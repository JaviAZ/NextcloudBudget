# Bank Sync

> **BETA** - Connect external bank accounts for automatic transaction imports. Must be enabled by a Nextcloud administrator.

## Overview

Bank Sync allows you to connect your real bank accounts to the Budget app and automatically import transactions. Instead of manually uploading CSV or OFX files, transactions flow in directly from your bank.

> **Note:** This is a beta feature and may have rough edges. If you encounter issues, please report them on the [GitHub issue tracker](https://github.com/otherworld-dev/budget/issues).

## Enabling Bank Sync (Admin)

Bank Sync must be enabled by a Nextcloud administrator before any user can access it:

1. Log in as a Nextcloud admin
2. Open the Budget app and go to **Settings**
3. Scroll down to the **Admin Settings** section
4. Toggle **Enable Bank Sync** to on

> **Warning:** This is an experimental feature. The warning banner displayed in Admin Settings explains that bank connectivity relies on third-party services and may experience interruptions or breaking changes.

Once enabled, all users on the instance will see the Bank Sync option in their account management interface.

## Supported Providers

Bank Sync supports two providers, each covering different regions:

| Provider | Region | Connection Method |
|----------|--------|-------------------|
| **GoCardless** | UK and European banks | OAuth authorization flow |
| **SimpleFIN** | US banks | Token-based authentication |

> **Tip:** If your bank isn't listed under one provider, try the other. Coverage varies and is continuously expanding.

## Connecting via GoCardless

To connect a UK or European bank account:

1. Navigate to your accounts list and select **Add Bank Connection**
2. Choose **GoCardless** as the provider
3. Search for your bank or financial institution by name
4. Select your bank from the results
5. You will be redirected to your bank's authorization page (OAuth flow)
6. Log in to your bank and authorize the Budget app to read your transactions
7. After authorization, you are redirected back to the Budget app
8. Your connected accounts will appear for mapping

> **Note:** GoCardless connections typically remain valid for 90 days before requiring re-authorization, depending on your bank's policies.

## Connecting via SimpleFIN

To connect a US bank account:

1. Navigate to your accounts list and select **Add Bank Connection**
2. Choose **SimpleFIN** as the provider
3. Obtain a SimpleFIN token from [simplefin.org](https://simplefin.org) (requires a SimpleFIN Bridge subscription)
4. Paste your token into the token field
5. Click **Connect**
6. The app claims the token and fetches your available accounts

> **Note:** SimpleFIN tokens are single-use for claiming. Once claimed by the Budget app, the same token cannot be used elsewhere.

## Account Mapping

After connecting a bank, you must map external accounts to local Budget accounts:

1. A list of discovered external bank accounts is displayed
2. For each external account, select an existing local Budget account from the dropdown, or create a new one
3. Only mapped accounts will have their transactions synced
4. Unmapped accounts are ignored during sync

> **Tip:** You can change account mappings at any time. Transactions already imported will remain in their original local account.

## Syncing Transactions

Transactions are synced in two ways:

- **Manual sync** - Click the **Sync** button on a connected account to immediately fetch new transactions
- **Automatic sync** - A background job runs daily to sync all mapped accounts automatically

Duplicate detection prevents the same transaction from being imported twice. Each synced transaction carries a unique import ID from the bank, which is checked against existing transactions before importing.

> **Note:** The first sync may take longer as it imports your recent transaction history. Subsequent syncs only fetch new transactions.

## Security

Bank Sync takes security seriously:

- All connection credentials (tokens, access keys) are **encrypted at rest** using Nextcloud's built-in encryption service
- Credentials are **never exposed in API responses** - the app only confirms whether a connection exists
- Communication with bank providers uses encrypted HTTPS connections
- You can revoke access at any time by disconnecting (see below)

> **Tip:** Review your connected banks periodically and disconnect any you no longer use.

## Disconnecting

To remove a bank connection:

1. Go to the account management page
2. Find the bank connection you want to remove
3. Click **Disconnect**
4. Confirm the action

When disconnecting:

- The external link and stored credentials are permanently deleted
- All previously imported transactions **remain in your local accounts**
- You can reconnect the same bank later, but it will be treated as a new connection

## Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Bank Sync option not visible | Ask your Nextcloud admin to enable it in **Settings > Admin Settings** |
| OAuth redirect fails | Ensure your Nextcloud instance URL is publicly accessible and HTTPS is configured correctly |
| GoCardless bank not found | Try searching by the bank's official name rather than a nickname. Not all institutions are supported |
| SimpleFIN token rejected | Tokens are single-use. Generate a new token from simplefin.org if the previous one was already claimed |
| Sync shows no new transactions | Check that the account is mapped. Unmapped accounts are skipped during sync |
| Transactions appear duplicated | This should not happen due to import ID tracking. File a bug report with details |
| Connection expired | GoCardless connections may expire after 90 days. Re-authorize by connecting again |
| Daily sync not running | Ensure Nextcloud background jobs (cron) are configured and running on your server |

> **Note:** If you encounter persistent issues, check your Nextcloud log file for error messages related to Bank Sync and include them when reporting bugs.

## Related Features

- [Accounts](accounts.md) - Managing your local budget accounts
- [Transactions](transactions.md) - Working with imported transactions
- [Import](import.md) - Manual file-based import as an alternative
- [Settings](settings.md) - Admin toggle and general configuration
