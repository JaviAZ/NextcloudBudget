/**
 * An envelope whose carried overspend exceeds this month's budget has a
 * negative amount available. The Budget page showed such a row as "No budget
 * set" with no remaining figure, while the dashboard and the alerts count it
 * as over budget. It now shows the negative remaining and the over-budget bar.
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('@nextcloud/l10n', () => ({
    translate: (_app, text, params = {}) =>
        String(text).replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m)),
    translatePlural: (_app, singular, plural, count) => (count === 1 ? singular : plural),
}));

import CategoriesModule from '../../src/modules/categories/CategoriesModule.js';

const CATEGORY = {
    id: 44, name: 'Cigarettes', type: 'expense',
    budgetAmount: 200, budgetPeriod: 'monthly', children: [],
};

function renderRow({ spent, available, carried, rollover = true }) {
    const mod = Object.create(CategoriesModule.prototype);
    mod.app = { settings: {} };
    mod.categorySpending = { 44: spent };
    mod._ownSpending = {};
    mod.budgetMonth = '2026-09';
    mod._recurringBudgets = {};
    mod._effectiveBudgets = { 44: { amount: 200, period: 'monthly', rollover, carried, available } };
    mod.formatCurrency = (v) => 'CHF ' + Number(v).toFixed(2);

    const el = document.createElement('div');
    el.innerHTML = mod.renderBudgetCategoryNodes([CATEGORY], 0);
    return {
        remaining: el.querySelector('.budget-remaining').textContent.trim(),
        progress: el.querySelector('.budget-progress-wrapper').textContent.replace(/\s+/g, ' ').trim(),
        fill: el.querySelector('.budget-progress-fill'),
    };
}

describe('overdrawn envelope row', () => {
    it('shows the negative remaining instead of "No budget set"', () => {
        const row = renderRow({ spent: 73.6, available: -504.65, carried: -704.65 });

        expect(row.remaining).toBe('CHF -578.25');
        expect(row.progress).not.toContain('No budget set');
    });

    it('draws a full over-budget bar once anything is spent', () => {
        const row = renderRow({ spent: 73.6, available: -504.65, carried: -704.65 });

        expect(row.fill.className).toContain('over');
        expect(row.fill.getAttribute('style')).toContain('width: 100%');
    });

    it('still reads "No budget set" for a category with no budget and nothing carried', () => {
        const row = renderRow({ spent: 20, available: 0, carried: 0, rollover: false });

        expect(row.remaining).toBe('—');
        expect(row.progress).toContain('No budget set');
    });
});
