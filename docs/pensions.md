# Pensions

> Track retirement and pension accounts with contributions and growth projections. Monitor your progress toward retirement across multiple pension providers and see combined forecasts.

## Overview

The Pensions feature lets you track retirement accounts that receive regular contributions and grow over time. Unlike standard accounts where you record individual transactions, pension accounts focus on contributions and projected growth -- giving you a forward-looking view of your retirement savings.

Each pension account tracks its current value, contribution schedule, and projected growth rate. The app uses these to forecast your retirement savings over time.

## Adding a Pension Account

To add a new pension account:

1. Navigate to **Pensions**
2. Click **Add Pension**
3. Fill in the details:

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Descriptive name (e.g., "Company 401(k)", "Roth IRA") |
| **Provider** | No | Institution managing the account (e.g., "Fidelity", "Vanguard") |
| **Current Value** | Yes | Current balance of the pension account |
| **Currency** | Yes | Currency the account is denominated in |
| **Contribution Amount** | No | Regular contribution amount |
| **Contribution Frequency** | No | How often contributions are made (monthly, bi-weekly, etc.) |

> **Tip:** If your employer matches contributions, include both your contribution and the match in the contribution amount for a more accurate projection.

## Recording Contributions

Track individual contributions as they happen:

1. Navigate to **Pensions** and select a pension account
2. Click **Add Contribution**
3. Enter the amount and date
4. Click **Save**

Contributions update the account's recorded value and feed into the growth projection model.

> **Note:** Contributions are separate from value snapshots. A contribution records money you put in; a snapshot records the total account value (which includes investment gains or losses).

## Growth Projections

Each pension account includes an interactive chart showing projected growth:

- **Historical values** -- Plotted from your value snapshots and contributions
- **Projection curve** -- Shows expected future value based on contribution rate and assumed annual return
- **Adjustable parameters** -- Change the assumed return rate to see optimistic, moderate, and conservative scenarios

The projection compounds contributions at the assumed return rate, showing how regular saving grows over decades.

> **Tip:** Use a conservative return rate (5-7% for stocks, 2-4% for bonds) for planning purposes. Actual returns will vary year to year, but conservative projections help avoid overconfidence.

## Value Snapshots

Record the actual current value of your pension periodically:

1. Navigate to **Pensions** and select a pension account
2. Click **Add Snapshot**
3. Enter the current total value and date
4. Click **Save**

Snapshots capture the real value including investment gains or losses. Comparing snapshots against the projection shows whether your investments are outperforming or underperforming expectations.

> **Note:** Check your pension provider's statement or online portal for the current value. Recording snapshots quarterly gives a good balance between accuracy and effort.

## Combined Forecast

The combined forecast view shows all pension accounts together:

1. Navigate to **Pensions**
2. Click **Combined Forecast**
3. View the combined projection chart across all pension accounts

This gives you a single view of your total retirement savings trajectory. The chart stacks each pension account so you can see both the total and each account's contribution to it.

The combined view is useful for answering "Am I on track for retirement?" across all your pension sources.

## Related Features

- [Dashboard](dashboard.md) -- Pension worth tile shows combined pension values
- [Forecast](forecast.md) -- Overall financial forecast includes pension projections
- [Accounts](accounts.md) -- Standard accounts for liquid funds tracked separately

## Settings

There are no dedicated settings for pensions. Pension accounts and their parameters are managed directly through the pensions interface.
