# Income

> Income sources track your expected recurring revenue — salary, dividends, freelance payments, rental income, and more. By recording when and how much you expect to receive, the app helps you monitor whether income has arrived on time and gives you a clear picture of your monthly cash inflows.

## Adding an Income Source

Navigate to **Income > Add Income** to create a new income source.

| Field | Description |
|-------|-------------|
| **Name** | A descriptive name for the income (e.g., "Monthly Salary", "Freelance Invoice", "Quarterly Dividends"). |
| **Expected Amount** | The amount you expect to receive each period. |
| **Source** | Who pays you (e.g., employer name, client name, investment account). |
| **Frequency** | How often you receive this income. See [Frequency Options](#frequency-options) below. |
| **Expected Day** | The day of the month (or week) you typically receive payment. |
| **Category** | The income category to assign when marking received (e.g., "Salary", "Investment Income"). |
| **Receive-To Account** | The account the payment arrives in. Used when marking income as received. |
| **Auto-Detect Pattern** | A text pattern to match imported transactions against this income source (e.g., "PAYROLL" or "ACME CORP"). When an imported transaction matches, it is automatically linked to this income source. |
| **Notes** | Optional free-text notes about the income source. |

> **Tip:** Setting an auto-detect pattern allows the app to automatically recognize income deposits when you import bank statements, so you don't have to manually mark each one as received.

## Frequency Options

| Frequency | Description |
|-----------|-------------|
| **Weekly** | Every 7 days on the same weekday. |
| **Biweekly** | Every 14 days (every other week). |
| **Monthly** | Once per calendar month on the expected day. |
| **Quarterly** | Every 3 months. |
| **Semi-Annually** | Every 6 months. |
| **Yearly** | Once per year. |

## Income Detection

Click **Detect Income** to let the app analyze your transaction history and automatically identify recurring credit transactions that look like income. The detection algorithm looks for:

- Regular timing patterns (transactions that arrive around the same day each period).
- Consistent amounts or amounts within a typical range.
- Credit transactions (deposits) rather than debits.

After detection runs, you are presented with a list of potential income sources to review. Confirm the ones you want to track, and the app creates income sources with the detected pattern, amount, and frequency pre-filled.

> **Note:** Income detection works best when you have at least 2-3 months of imported transaction history for the app to identify patterns.

## Marking Income as Received

Click **Mark Received** on any income source to record that the payment has arrived. This:

1. Creates a transaction in the linked receive-to account for the expected amount and category.
2. Advances the expected date to the next occurrence based on the frequency.
3. Shows an **Undo** notification for approximately 5 seconds, allowing you to reverse the action if clicked accidentally.

> **Tip:** If the actual amount received differs from the expected amount (e.g., a bonus or deduction), you can edit the created transaction afterward to reflect the correct figure.

## Status Badges

Each income source displays a status badge indicating its current state:

| Badge | Meaning |
|-------|---------|
| **EXPECTED SOON** | The income is due within the next 7 days but has not been received yet. |
| **UPCOMING** | The income is expected but more than 7 days away. |
| **RECEIVED** | The income has already been marked as received for the current period. |

## Tabs

The income view organizes sources into three tabs for quick access:

| Tab | Contents |
|-----|----------|
| **All Income** | Every income source regardless of status (active and inactive). |
| **Expected Soon** | Only income sources due within the next 7 days that have not yet been received. |
| **Received** | Income sources that have been marked as received for the current period. |

## Summary Cards

At the top of the income page, three summary cards provide a quick financial snapshot:

| Card | Description |
|------|-------------|
| **Expected This Month** | The total amount of income expected to arrive during the current month across all active sources. |
| **Received This Month** | The total amount of income already marked as received this month. |
| **Active Sources** | The count of currently active income sources being tracked. |

> **Tip:** Comparing "Expected This Month" against "Received This Month" gives you a quick view of outstanding income you are still waiting on.

## Related Features

- [Transactions](transactions.md) — Each received income creates a transaction in the linked account.
- [Forecast](forecast.md) — Active income sources are factored into balance forecasting.
- [Dashboard](index.md) — The Income Tracking tile shows expected and received income.
- [Accounts](accounts.md) — Income is received into a linked account.

## Settings

Income sources do not have dedicated settings. The feature works with your existing accounts and categories configuration.
