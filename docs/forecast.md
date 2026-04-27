# Forecast

> The Forecast tool predicts your future account balances by analyzing historical spending and income patterns. Use it to plan ahead, avoid overdrafts, and understand how your financial habits project into the future.

## Overview

Forecasting uses your transaction history to identify regular income, recurring expenses, and seasonal variations. It then projects those patterns forward to show where your account balances are heading. You can adjust assumptions to model different scenarios — such as adding a new expense or cutting a subscription.

## Setting Up a Forecast

Navigate to **Forecast > Generate** to create a new forecast.

| Setting | Description |
|---------|-------------|
| **Account(s)** | Select one or more accounts to forecast. You can forecast a single account or combine several to see an aggregate projection. |
| **Historical Period** | How far back to analyze: 3 months, 6 months, or 12 months. Longer periods capture seasonal patterns but may be less responsive to recent changes. |
| **Forecast Horizon** | How far ahead to project: 1 month, 3 months, 6 months, or 12 months. |

> **Tip:** A 6-month historical period with a 3-month horizon works well for most users. Use 12 months of history if your spending has strong seasonal patterns (e.g., higher heating bills in winter).

## How It Works

The forecast engine analyzes your transaction history across several dimensions:

1. **Regular Income Patterns** — Identifies recurring deposits (salary, freelance payments, benefits) by matching amounts, frequencies, and descriptions.
2. **Recurring Expenses** — Detects fixed and semi-fixed outflows such as rent, subscriptions, and loan payments. Active bills are included automatically.
3. **Seasonal Variations** — Recognizes spending that changes by season or month (e.g., holiday gifts in December, back-to-school expenses in September).
4. **Average Spending by Category** — For irregular day-to-day spending (groceries, dining, fuel), the engine calculates category-level averages and projects them forward.

The combination of these factors produces a projected daily balance for each day in the forecast horizon.

## Reading the Forecast

The forecast chart shows:

| Element | Meaning |
|---------|---------|
| **Projected Balance Line** | The most likely path your balance will follow based on detected patterns. |
| **Confidence Interval** | A shaded band around the projection showing the range of likely outcomes. Wider bands indicate more uncertainty (common further into the future). |
| **Current Balance Marker** | Your starting point — the account's balance as of today. |
| **Known Events** | Upcoming bills and scheduled income are marked on the timeline as dots or vertical lines. |

> **Note:** The confidence interval widens over time because uncertainty compounds. A forecast 30 days out is considerably more reliable than one 6 months out.

### Interpreting Key Signals

- **Downward trend crossing zero** — Your spending exceeds income at the current rate. Consider adjusting your budget.
- **Sharp drops on specific dates** — Large known expenses (bills, rent) are scheduled on those dates.
- **Flat or rising trend** — Your income comfortably covers expenses and you are likely building savings.

## Scenario Modeling

Scenario modeling lets you adjust assumptions to explore "what if" questions without changing your actual data.

### Adjustable Parameters

| Parameter | Example |
|-----------|---------|
| **Add an expense** | "What if I add a $200/month car payment?" |
| **Remove an expense** | "What if I cancel my gym membership?" |
| **Change income** | "What if my pay increases by 10%?" |
| **One-time event** | "What if I spend $5,000 on a vacation in July?" |

### How to Use

1. Generate a baseline forecast.
2. Click **Add Scenario** to create a modified projection.
3. Adjust the parameters as needed.
4. The chart overlays the scenario on top of the baseline so you can compare outcomes visually.

> **Tip:** Scenario modeling is a planning tool — it does not create or modify any transactions or bills. Your actual data remains unchanged.

## Related Features

- [Dashboard](dashboard.md) — The Forecast tile shows a summary of your projected balance on the dashboard.
- [Bills](bills.md) — Active bills are factored into the forecast as known future expenses.
- [Income](income.md) — Recurring income entries improve forecast accuracy for expected deposits.
- [Accounts](accounts.md) — Forecasts are generated per-account or across multiple accounts.

## Settings

Forecast does not have dedicated settings. The historical period and horizon are selected each time you generate a forecast. Your most recent selections are remembered for convenience.
