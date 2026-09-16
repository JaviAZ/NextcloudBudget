/**
 * A new rule action starts on getDefaultBehaviorForType(), and that value
 * must be one its own Behavior dropdown offers. Set Description (#385)
 * defaulted to 'replace' while offering only 'always' and 'if_empty', so
 * the dropdown showed "Always set" over a saved value it did not list.
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('@nextcloud/l10n', () => ({
    translate: (_app, text, params = {}) =>
        String(text).replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m)),
    translatePlural: (_app, singular, plural, count) => (count === 1 ? singular : plural),
}));

vi.mock('../../src/modules/rules/components/ActionBuilder.css', () => ({}));

import { ActionBuilder } from '../../src/modules/rules/components/ActionBuilder.js';

const ACTION_TYPES = [
    'set_category', 'set_vendor', 'set_description', 'set_notes', 'add_tags',
    'set_account', 'set_type', 'set_reference', 'set_forecast_exclude', 'link_transfer',
];

function offeredBehaviors(ab, type) {
    const el = document.createElement('div');
    el.innerHTML = ab.renderActionConfig({ type, value: null, behavior: null }, 0);
    const select = el.querySelector('select.action-behavior');
    return select ? Array.from(select.options).map(o => o.value) : null;
}

describe('rule action default behavior', () => {
    const ab = Object.create(ActionBuilder.prototype);
    ab.options = { categories: [], accounts: [], tagSets: [] };

    it.each(ACTION_TYPES)('%s defaults to a behavior its dropdown offers', (type) => {
        const offered = offeredBehaviors(ab, type);
        if (offered === null) return; // no Behavior choice for this type

        expect(offered).toContain(ab.getDefaultBehaviorForType(type));
    });

    it('defaults Set Description to "Always set"', () => {
        expect(ab.getDefaultBehaviorForType('set_description')).toBe('always');
    });
});
