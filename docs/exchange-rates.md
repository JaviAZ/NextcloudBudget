# Exchange Rates

> Automatic currency conversion for multi-currency accounts using ECB (fiat) and CoinGecko (crypto) rates. All foreign-currency balances are converted to your base currency for dashboard totals, net worth calculations, and reports.

## Overview

If you hold accounts in multiple currencies, the Budget app automatically converts balances to your base currency using live exchange rates. This gives you accurate totals on the dashboard, in reports, and across any feature that aggregates monetary values.

Fiat currency rates come from the European Central Bank (ECB). Cryptocurrency rates come from CoinGecko. A background job refreshes rates automatically so conversions stay current without manual effort.

## How Rates Are Sourced

The app pulls exchange rates from two providers:

| Provider | Currencies | Update Frequency |
|----------|-----------|-----------------|
| **ECB** | Major fiat currencies (EUR, USD, GBP, JPY, etc.) | Daily (weekdays) |
| **CoinGecko** | Cryptocurrencies (BTC, ETH, etc.) | Periodically via background job |

A Nextcloud background job (cron) fetches updated rates automatically. As long as your Nextcloud cron is configured and running, rates stay up to date without any action from you.

> **Note:** ECB rates are published around 16:00 CET on business days. Weekend and holiday rates use the most recent available rate. CoinGecko rates update more frequently but depend on your cron interval.

## Viewing Current Rates

To see all current exchange rates:

1. Navigate to **Settings** > **Exchange Rates**
2. View the table of all rates relative to your base currency

The table shows each currency's code, name, current rate, and when it was last updated. Rates are expressed as "1 [base currency] = X [foreign currency]".

> **Tip:** If a rate looks stale (last updated date is old), check that your Nextcloud cron job is running correctly. Navigate to **Settings** > **Administration** > **Basic settings** to verify cron status.

## Manual Rate Overrides

For currencies not covered by ECB or CoinGecko, or when you want to use a specific rate:

1. Navigate to **Settings** > **Exchange Rates**
2. Click **Add Rate**
3. Enter the currency code, rate relative to your base currency, and optionally a description
4. Click **Save**

Manual rates take precedence over automatic rates for the same currency. To revert to automatic rates, delete the manual override.

> **Warning:** Manual rates do not update automatically. If you override a rate, remember to update it periodically or remove the override to resume automatic updates.

## How Rates Affect the App

Exchange rates are used throughout the app wherever monetary values from different currencies need to be combined:

- **Dashboard totals** -- All account balances converted to base currency for the total balance display
- **Net worth** -- Multi-currency accounts and assets summed in base currency
- **Reports** -- Spending and income aggregated in base currency regardless of source account currency
- **Forecast** -- Projected balances converted to base currency for combined views
- **Budget tracking** -- Category spending totals converted when transactions come from foreign-currency accounts

> **Note:** Individual transactions retain their original currency and amount. Conversion happens only for display and aggregation purposes -- no rounding or currency data is lost.

## Related Features

- [Accounts](accounts.md) -- Each account has a currency; multi-currency accounts rely on exchange rates
- [Reports](reports.md) -- Net worth and spending reports aggregate across currencies
- [Settings](settings.md) -- Set your default (base) currency in app settings
- [Dashboard](dashboard.md) -- Totals displayed in base currency using current rates

## Settings

- **Default Currency** -- Set in **Settings** > **General**. This is the base currency all others are converted to.
- **Exchange Rates Table** -- Managed in **Settings** > **Exchange Rates**. View, add, or override rates.
