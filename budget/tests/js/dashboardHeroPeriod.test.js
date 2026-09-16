/**
 * With a budget start day set, the hero tiles labelled "This Month" cover the
 * budget period instead (#386), so they show which days that is. A start day
 * of the 1st is a calendar month and needs no hint.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('@nextcloud/l10n', () => ({
    translate: (_app, text, params = {}) =>
        String(text).replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m)),
    translatePlural: (_app, singular, plural, count) => (count === 1 ? singular : plural),
}));

import DashboardModule from '../../src/modules/dashboard/DashboardModule.js';
import { getPeriodDateRange } from '../../src/utils/formatters.js';

const HERO_MARKUP = `
    <div class="dashboard-hero">
        <div class="hero-card" data-widget-id="netWorth">
            <div class="hero-content"><span class="hero-label">Net Worth</span></div>
        </div>
        <div class="hero-card" data-widget-id="income">
            <div class="hero-content"><span class="hero-label">Income This Month</span></div>
        </div>
        <div class="hero-card" data-widget-id="accountIncome">
            <div class="hero-content">
                <div class="hero-label-row"><span class="hero-label">Account Income</span><select></select></div>
            </div>
        </div>
    </div>`;

function makeDashboard(settings = {}) {
    const mod = Object.create(DashboardModule.prototype);
    mod.app = {
        settings,
        dashboardConfig: { widgets: { tileSettings: {} } },
        widgetData: {},
        widgetDataLoaded: {},
        accounts: [],
    };
    return mod;
}

const hintOf = (widgetId) =>
    document.querySelector(`[data-widget-id="${widgetId}"] .hero-period`)?.textContent ?? null;

beforeEach(() => {
    document.body.innerHTML = HERO_MARKUP;
});

afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    delete global.OC;
    delete global.fetch;
});

describe('updateHeroPeriodHints', () => {
    it('adds the span to period tiles only', () => {
        makeDashboard().updateHeroPeriodHints('Aug 28 - Sep 27');

        expect(hintOf('income')).toBe('Aug 28 - Sep 27');
        expect(hintOf('accountIncome')).toBe('Aug 28 - Sep 27');
        expect(hintOf('netWorth')).toBeNull();
    });

    it('places the hint under the label, and under the label row with an account picker', () => {
        makeDashboard().updateHeroPeriodHints('Aug 28 - Sep 27');

        expect(document.querySelector('[data-widget-id="income"] .hero-label').nextElementSibling.className).toBe('hero-period');
        expect(document.querySelector('[data-widget-id="accountIncome"] .hero-label-row').nextElementSibling.className).toBe('hero-period');
    });

    it('updates an existing hint instead of adding another', () => {
        const dash = makeDashboard();
        dash.updateHeroPeriodHints('Aug 28 - Sep 27');
        dash.updateHeroPeriodHints('Sep 28 - Oct 27');

        expect(document.querySelectorAll('[data-widget-id="income"] .hero-period')).toHaveLength(1);
        expect(hintOf('income')).toBe('Sep 28 - Oct 27');
    });

    it('removes the hints when there is no custom period', () => {
        const dash = makeDashboard();
        dash.updateHeroPeriodHints('Aug 28 - Sep 27');
        dash.updateHeroPeriodHints(null);

        expect(document.querySelectorAll('.hero-period')).toHaveLength(0);
    });
});

describe('dashboard load', () => {
    async function load(settings) {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 8, 20));
        global.OC = { generateUrl: (u) => u, requestToken: 'tok' };
        global.fetch = vi.fn(async () => ({ ok: true, json: async () => ({}) }));
        const dash = makeDashboard(settings);
        dash.app.getPrimaryCurrency = () => 'GBP';
        await dash.loadDashboard();
    }

    it('labels the tiles with the budget period for a custom start day', async () => {
        await load({ budget_start_day: '10' });

        expect(hintOf('income')).toBe(getPeriodDateRange('monthly', 10, new Date(2026, 8, 20)).label);
    });

    it('adds nothing when the budget month is the calendar month', async () => {
        await load({ budget_start_day: '1' });

        expect(document.querySelectorAll('.hero-period')).toHaveLength(0);
    });
});
