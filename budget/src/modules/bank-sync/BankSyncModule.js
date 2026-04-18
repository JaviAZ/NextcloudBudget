import { translate as t } from '@nextcloud/l10n';
import { showSuccess, showError } from '../../utils/notifications.js';

/**
 * Bank Sync Module — manages bank connections, account mappings, and sync operations.
 * Only visible when the admin has enabled bank sync.
 */
export default class BankSyncModule {
    constructor(app) {
        this.app = app;
        this.connections = [];
        this.selectedConnectionId = null;
    }

    async init() {
        // Check if bank sync is enabled and show/hide nav item
        await this.checkStatus();
        this.setupEventListeners();
    }

    async checkStatus() {
        try {
            const response = await fetch(OC.generateUrl('/apps/budget/api/bank-sync/status'), {
                headers: { 'requesttoken': OC.requestToken }
            });
            const data = await response.json();

            const navItem = document.getElementById('bank-sync-nav');
            if (navItem) {
                navItem.style.display = data.enabled ? '' : 'none';
            }

            return data;
        } catch (error) {
            console.error('Failed to check bank sync status:', error);
            return { enabled: false };
        }
    }

    setupEventListeners() {
        if (this._listenersSetup) return;
        this._listenersSetup = true;

        // Use event delegation for all bank sync UI interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('#add-bank-connection-btn')) {
                e.preventDefault();
                this.showConnectModal();
                return;
            }
            if (e.target.closest('#bank-sync-connect-btn')) {
                e.preventDefault();
                this.connect();
                return;
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'bank-sync-provider') {
                const provider = e.target.value;
                document.getElementById('simplefin-fields').style.display = provider === 'simplefin' ? 'block' : 'none';
                document.getElementById('gocardless-fields').style.display = provider === 'gocardless' ? 'block' : 'none';
            }
        });
    }

    async loadBankSyncView() {
        const status = await this.checkStatus();

        const disabledNotice = document.getElementById('bank-sync-disabled-notice');
        const content = document.getElementById('bank-sync-content');

        if (!status.enabled) {
            if (disabledNotice) disabledNotice.style.display = 'block';
            if (content) content.style.display = 'none';
            return;
        }

        if (disabledNotice) disabledNotice.style.display = 'none';
        if (content) content.style.display = 'block';

        // Re-bind event listeners in case they weren't bound during init
        this.setupEventListeners();

        await this.loadConnections();
    }

    async loadConnections() {
        try {
            const response = await fetch(OC.generateUrl('/apps/budget/api/bank-sync/connections'), {
                headers: { 'requesttoken': OC.requestToken }
            });
            if (!response.ok) throw new Error('Failed to fetch connections');

            this.connections = await response.json();
            this.renderConnections();
        } catch (error) {
            console.error('Failed to load bank connections:', error);
        }
    }

    renderConnections() {
        const container = document.getElementById('bank-connections-list');
        if (!container) return;

        if (!this.connections.length) {
            container.innerHTML = `<div class="empty-state-small">${t('budget', 'No bank connections yet. Click "Add Connection" to get started.')}</div>`;
            return;
        }

        container.innerHTML = this.connections.map(({ connection, mappings }) => {
            const statusClass = connection.status === 'active' ? 'positive' : (connection.status === 'error' ? 'negative' : '');
            const statusLabel = {
                active: t('budget', 'Active'),
                error: t('budget', 'Error'),
                expired: t('budget', 'Expired'),
            }[connection.status] || connection.status;

            const providerLabel = connection.provider === 'gocardless' ? 'GoCardless' : 'SimpleFIN';
            const lastSync = connection.lastSyncAt
                ? t('budget', 'Last sync: {date}', { date: new Date(connection.lastSyncAt).toLocaleString() })
                : t('budget', 'Never synced');
            const mappedCount = mappings.filter(m => m.budgetAccountId && m.enabled).length;

            return `
                <div class="bank-connection-card" data-connection-id="${connection.id}">
                    <div class="bank-connection-header">
                        <div class="bank-connection-info">
                            <strong>${this.escapeHtml(connection.name)}</strong>
                            <span class="bank-connection-provider">${providerLabel}</span>
                            <span class="bank-connection-status ${statusClass}">${statusLabel}</span>
                        </div>
                        <div class="bank-connection-actions">
                            <button class="btn btn-sm bank-sync-btn" data-connection-id="${connection.id}" title="${t('budget', 'Sync now')}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/></svg>
                            </button>
                            <button class="btn btn-sm bank-mappings-btn" data-connection-id="${connection.id}" title="${t('budget', 'Account mappings')}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/></svg>
                            </button>
                            <button class="btn btn-sm btn-danger bank-disconnect-btn" data-connection-id="${connection.id}" title="${t('budget', 'Disconnect')}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="bank-connection-meta">
                        <span>${lastSync}</span>
                        <span>${t('budget', '{count} account(s) mapped', { count: mappedCount })}</span>
                        ${connection.lastError ? `<span class="bank-connection-error">${this.escapeHtml(connection.lastError)}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        container.querySelectorAll('.bank-sync-btn').forEach(btn => {
            btn.addEventListener('click', () => this.syncConnection(parseInt(btn.dataset.connectionId)));
        });
        container.querySelectorAll('.bank-mappings-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showMappings(parseInt(btn.dataset.connectionId)));
        });
        container.querySelectorAll('.bank-disconnect-btn').forEach(btn => {
            btn.addEventListener('click', () => this.disconnect(parseInt(btn.dataset.connectionId)));
        });
    }

    showConnectModal() {
        const modal = document.getElementById('bank-sync-modal');
        if (modal) {
            // Reset form
            document.getElementById('bank-sync-provider').value = '';
            document.getElementById('bank-sync-name').value = '';
            document.getElementById('bank-sync-setup-token').value = '';
            document.getElementById('bank-sync-secret-id').value = '';
            document.getElementById('bank-sync-secret-key').value = '';
            document.getElementById('simplefin-fields').style.display = 'none';
            document.getElementById('gocardless-fields').style.display = 'none';
            modal.style.display = 'flex';
        }
    }

    async connect() {
        const provider = document.getElementById('bank-sync-provider').value;
        const name = document.getElementById('bank-sync-name').value.trim();

        if (!provider) {
            showError(t('budget', 'Please select a provider'));
            return;
        }
        if (!name) {
            showError(t('budget', 'Please enter a connection name'));
            return;
        }

        const body = { provider, name };

        if (provider === 'simplefin') {
            body.setupToken = document.getElementById('bank-sync-setup-token').value.trim();
            if (!body.setupToken) {
                showError(t('budget', 'Please enter a setup token'));
                return;
            }
        } else if (provider === 'gocardless') {
            body.secretId = document.getElementById('bank-sync-secret-id').value.trim();
            body.secretKey = document.getElementById('bank-sync-secret-key').value.trim();
            if (!body.secretId || !body.secretKey) {
                showError(t('budget', 'Please enter your API credentials'));
                return;
            }
        }

        try {
            const response = await fetch(OC.generateUrl('/apps/budget/api/bank-sync/connections'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'requesttoken': OC.requestToken
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            const result = await response.json();

            // Close modal
            document.getElementById('bank-sync-modal').style.display = 'none';

            // If GoCardless returned an authorization URL, open it
            if (result.authorizationUrl) {
                showSuccess(t('budget', 'Connection created. Please authorize with your bank.'));
                window.open(result.authorizationUrl, '_blank');
            } else {
                showSuccess(t('budget', 'Bank connected successfully'));
            }

            await this.loadConnections();
        } catch (error) {
            console.error('Failed to connect bank:', error);
            showError(t('budget', 'Failed to connect: {error}', { error: error.message }));
        }
    }

    async syncConnection(connectionId) {
        try {
            showSuccess(t('budget', 'Syncing...'));

            const response = await fetch(OC.generateUrl(`/apps/budget/api/bank-sync/connections/${connectionId}/sync`), {
                method: 'POST',
                headers: { 'requesttoken': OC.requestToken }
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            showSuccess(t('budget', 'Sync complete: {imported} imported, {skipped} skipped', {
                imported: result.imported,
                skipped: result.skipped
            }));

            await this.loadConnections();
        } catch (error) {
            console.error('Failed to sync:', error);
            showError(t('budget', 'Sync failed: {error}', { error: error.message }));
        }
    }

    async disconnect(connectionId) {
        if (!confirm(t('budget', 'Are you sure you want to disconnect this bank? This will remove the connection and all account mappings.'))) {
            return;
        }

        try {
            const response = await fetch(OC.generateUrl(`/apps/budget/api/bank-sync/connections/${connectionId}`), {
                method: 'DELETE',
                headers: { 'requesttoken': OC.requestToken }
            });

            if (!response.ok) throw new Error('Failed to disconnect');

            showSuccess(t('budget', 'Bank disconnected'));
            document.getElementById('bank-mappings-section').style.display = 'none';
            await this.loadConnections();
        } catch (error) {
            showError(t('budget', 'Failed to disconnect bank'));
        }
    }

    async showMappings(connectionId) {
        this.selectedConnectionId = connectionId;
        const section = document.getElementById('bank-mappings-section');
        if (!section) return;

        try {
            const response = await fetch(OC.generateUrl(`/apps/budget/api/bank-sync/connections/${connectionId}/mappings`), {
                headers: { 'requesttoken': OC.requestToken }
            });
            if (!response.ok) throw new Error('Failed to fetch mappings');

            const mappings = await response.json();
            section.style.display = 'block';

            // Find connection name
            const conn = this.connections.find(c => c.connection.id === connectionId);
            const title = document.getElementById('bank-mappings-title');
            if (title && conn) {
                title.textContent = t('budget', 'Account Mappings — {name}', { name: conn.connection.name });
            }

            this.renderMappings(mappings, connectionId);
        } catch (error) {
            showError(t('budget', 'Failed to load account mappings'));
        }
    }

    renderMappings(mappings, connectionId) {
        const container = document.getElementById('bank-mappings-list');
        if (!container) return;

        const accounts = this.app.accounts || [];
        const accountOptions = accounts.map(a =>
            `<option value="${a.id}">${this.escapeHtml(a.name)} (${a.currency})</option>`
        ).join('');

        container.innerHTML = mappings.map(mapping => {
            const enabled = mapping.enabled ? 'checked' : '';
            const balance = mapping.lastBalance ? `${mapping.lastCurrency || ''} ${mapping.lastBalance}` : '';

            return `
                <div class="bank-mapping-row" data-mapping-id="${mapping.id}">
                    <div class="bank-mapping-info">
                        <label class="bank-mapping-enable">
                            <input type="checkbox" class="mapping-enabled-checkbox"
                                   data-mapping-id="${mapping.id}" data-connection-id="${connectionId}" ${enabled}>
                        </label>
                        <div>
                            <strong>${this.escapeHtml(mapping.externalAccountName || mapping.externalAccountId)}</strong>
                            ${balance ? `<small>${balance}</small>` : ''}
                            ${mapping.consentExpires ? `<small class="consent-warning">${t('budget', 'Consent expires: {date}', { date: new Date(mapping.consentExpires).toLocaleDateString() })}</small>` : ''}
                        </div>
                    </div>
                    <div class="bank-mapping-target">
                        <select class="mapping-account-select" data-mapping-id="${mapping.id}" data-connection-id="${connectionId}">
                            <option value="">${t('budget', '— Not mapped —')}</option>
                            ${accountOptions}
                        </select>
                    </div>
                </div>
            `;
        }).join('');

        // Set selected values
        mappings.forEach(mapping => {
            if (mapping.budgetAccountId) {
                const select = container.querySelector(`.mapping-account-select[data-mapping-id="${mapping.id}"]`);
                if (select) select.value = mapping.budgetAccountId;
            }
        });

        // Event listeners for changes
        container.querySelectorAll('.mapping-enabled-checkbox').forEach(cb => {
            cb.addEventListener('change', () => this.updateMapping(
                parseInt(cb.dataset.connectionId),
                parseInt(cb.dataset.mappingId),
                null,
                cb.checked
            ));
        });

        container.querySelectorAll('.mapping-account-select').forEach(sel => {
            sel.addEventListener('change', () => this.updateMapping(
                parseInt(sel.dataset.connectionId),
                parseInt(sel.dataset.mappingId),
                sel.value ? parseInt(sel.value) : null,
                null
            ));
        });
    }

    async updateMapping(connectionId, mappingId, budgetAccountId, enabled) {
        try {
            const body = {};
            if (budgetAccountId !== null) body.budgetAccountId = budgetAccountId;
            if (enabled !== null) body.enabled = enabled;

            const response = await fetch(OC.generateUrl(`/apps/budget/api/bank-sync/connections/${connectionId}/mappings/${mappingId}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'requesttoken': OC.requestToken
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Failed to update mapping');
            showSuccess(t('budget', 'Mapping updated'));
        } catch (error) {
            showError(t('budget', 'Failed to update mapping'));
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
