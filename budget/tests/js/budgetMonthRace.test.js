/**
 * Clicking quickly through months on the Budget page starts overlapping loads.
 * #387 kept an older spending load from landing on a newer month; the budget
 * amounts load the same way and needed the same guard, and a load has to
 * measure one month from start to finish even if the selection moves on.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('@nextcloud/l10n', () => ({
    translate: (_app, text, params = {}) =>
        String(text).replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m)),
    translatePlural: (_app, singular, plural, count) => (count === 1 ? singular : plural),
}));

import CategoriesModule from '../../src/modules/categories/CategoriesModule.js';

const ok = (body) => ({ ok: true, json: async () => body });
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

function deferred() {
    let resolve;
    const promise = new Promise(r => { resolve = r; });
    return { promise, resolve };
}

function makeModule(app = {}) {
    const mod = Object.create(CategoriesModule.prototype);
    mod.app = { settings: {}, getAuthHeaders: () => ({}), ...app };
    return mod;
}

beforeEach(() => {
    global.OC = { generateUrl: (p) => p, requestToken: 'tok' };
});

afterEach(() => {
    vi.restoreAllMocks();
    delete global.fetch;
    delete global.OC;
    document.body.innerHTML = '';
});

describe('fetchEffectiveBudgets', () => {
    it('ignores an older month request that finishes last', async () => {
        const pending = new Map();
        global.fetch = vi.fn((url) => {
            if (url.endsWith('/budget-snapshots')) return Promise.resolve(ok([]));
            return new Promise(resolve => pending.set(url, resolve));
        });
        const mod = makeModule();

        mod.budgetMonth = '2026-05';
        const may = mod.fetchEffectiveBudgets();
        mod.budgetMonth = '2026-06';
        const june = mod.fetchEffectiveBudgets();

        pending.get('/apps/budget/api/budget-snapshots/2026-06/budgets')(ok({ budgets: { 7: 200 } }));
        await june;
        pending.get('/apps/budget/api/budget-snapshots/2026-05/budgets')(ok({ budgets: { 7: 100 } }));
        await may;

        expect(mod._effectiveBudgets).toEqual({ 7: 200 });
    });

    it("clears the budgets when the load fails rather than keeping another month's", async () => {
        global.fetch = vi.fn(async (url) => (url.endsWith('/budget-snapshots') ? ok([]) : { ok: false }));
        const mod = makeModule();
        mod.budgetMonth = '2026-06';
        mod._effectiveBudgets = { 7: 100 };
        mod._currentMonthHasSnapshot = true;

        await mod.fetchEffectiveBudgets();

        expect(mod._effectiveBudgets).toBeNull();
        expect(mod._currentMonthHasSnapshot).toBe(false);
    });
});

describe('calculateCategorySpending', () => {
    it('measures the month it started with for every group', async () => {
        const requests = [];
        global.fetch = vi.fn((url) => new Promise(resolve => requests.push({ url, resolve })));
        const mod = makeModule({
            categoryTree: [
                { id: 7, type: 'expense', budgetPeriod: 'monthly', children: [] },
                { id: 8, type: 'income', budgetPeriod: 'monthly', children: [] },
            ],
        });
        mod.budgetMonth = '2026-05';

        const load = mod.calculateCategorySpending();
        mod.budgetMonth = '2026-06';
        requests[0].resolve(ok([]));
        await flush();
        requests[1].resolve(ok([]));
        await load;

        expect(requests).toHaveLength(2);
        for (const { url } of requests) {
            expect(url).toContain('startDate=2026-05-01');
            expect(url).toContain('endDate=2026-05-31');
        }
    });
});

describe('month selector', () => {
    it('lets only the newest month change render', async () => {
        document.body.innerHTML = `
            <select id="budget-month">
                <option value="2026-05">May</option>
                <option value="2026-06">June</option>
            </select>`;
        const select = document.getElementById('budget-month');
        const mod = makeModule();
        const loads = [];
        mod.fetchEffectiveBudgets = vi.fn(() => {
            const d = deferred();
            loads.push(d);
            return d.promise;
        });
        mod.calculateCategorySpending = vi.fn(async () => {});
        mod.renderBudgetTree = vi.fn();
        mod.updateBudgetSummary = vi.fn();
        mod.renderSnapshotControls = vi.fn();
        mod.setupBudgetEventListeners();

        select.value = '2026-05';
        select.dispatchEvent(new Event('change'));
        select.value = '2026-06';
        select.dispatchEvent(new Event('change'));

        loads[1].resolve();
        await flush();
        loads[0].resolve();
        await flush();

        expect(mod.budgetMonth).toBe('2026-06');
        expect(mod.calculateCategorySpending).toHaveBeenCalledTimes(1);
        expect(mod.renderBudgetTree).toHaveBeenCalledTimes(1);
    });
});
