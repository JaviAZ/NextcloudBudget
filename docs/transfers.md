# Transfers

> Transfers track the movement of money between your own accounts — whether recurring (like a monthly savings transfer) or one-time (like moving funds to cover a bill). They keep both accounts in sync by creating linked debit and credit transactions.

## Overview

A transfer represents money moving from one of your accounts to another. Unlike bills (which are outflows to external payees), transfers do not change your net worth — they simply redistribute funds across your accounts. The app manages both sides of the transaction so your balances stay accurate.

## Creating a Transfer

Navigate to **Transfers > Add Transfer** to create a new transfer.

| Field | Description |
|-------|-------------|
| **Name** | A descriptive name for the transfer (e.g., "Monthly Savings", "Credit Card Payment", "Rent Account Top-Up"). |
| **Amount** | The transfer amount. |
| **Source Account** | The account money is withdrawn from (debit). |
| **Destination Account** | The account money is deposited into (credit). |
| **Frequency** | How often the transfer recurs. See frequency options below. |
| **Due Day** | The day of the month (or week) the transfer occurs. |

### Frequency Options

| Frequency | Description |
|-----------|-------------|
| **Weekly** | Every 7 days on the same weekday. |
| **Biweekly** | Every 14 days (every other week). |
| **Monthly** | Once per calendar month on the due day. |
| **Quarterly** | Every 3 months. |
| **Semi-Annually** | Every 6 months. |
| **Yearly** | Once per year. |
| **One-Time** | A single transfer with no recurrence. |

## One-Time Transfers

One-time transfers represent a single planned movement of funds. After you mark a one-time transfer as paid, it automatically deactivates. It remains visible in your transfer history but no longer appears in the active list or generates reminders.

> **Note:** Use one-time transfers for planned large moves — like transferring money to cover an upcoming expense — so you do not forget and overdraft the destination account.

## Auto-Pay

Auto-pay automates the transfer on its due date, removing the need to mark it paid manually.

### How to Enable

1. Edit the transfer and toggle **Auto-Pay** on.
2. Ensure both a source and destination account are set.

### How It Works

- A background job runs daily and checks for transfers with auto-pay enabled that are due today.
- When triggered, it creates linked transactions in both accounts (a debit in the source, a credit in the destination).
- The due date advances to the next occurrence automatically.
- Transfers with auto-pay show an **Auto-pay** badge in the list.

> **Warning:** If either the source or destination account is deleted, auto-pay will fail and be disabled. You will need to update the transfer and re-enable it.

## Marking as Paid

Click **Mark Paid** on any transfer to record the movement. This creates two linked transactions:

1. A **debit** (withdrawal) in the source account for the transfer amount.
2. A **credit** (deposit) in the destination account for the same amount.

Both transactions are linked together and reference the transfer name for easy identification. The transfer's due date then advances to the next occurrence based on its frequency.

> **Tip:** If you mark a transfer paid accidentally, click **Undo** in the notification that appears briefly after payment. This removes both the debit and credit transactions.

## Monthly Equivalent

Each transfer displays a **Monthly Equivalent** amount regardless of its actual frequency. This normalizes all transfers to a monthly figure so you can easily compare their impact on your cash flow.

| Frequency | Monthly Equivalent Calculation |
|-----------|-------------------------------|
| Weekly | Amount x 52 / 12 |
| Biweekly | Amount x 26 / 12 |
| Monthly | Amount (unchanged) |
| Quarterly | Amount / 3 |
| Semi-Annually | Amount / 6 |
| Yearly | Amount / 12 |

> **Tip:** The monthly equivalent is especially useful when comparing transfers of different frequencies side by side — it answers "how much does this cost me per month?"

## Related Features

- [Bills](bills.md) — Transfers use the same underlying system as bills (frequencies, auto-pay, due dates). Bills track external payments while transfers track internal movements.
- [Accounts](accounts.md) — Transfers link two accounts and keep both balances synchronized.
- [Transactions](transactions.md) — Each paid transfer creates linked debit and credit transactions.

## Settings

Transfers do not have dedicated settings. They share the notification system with bills — reminders use the Nextcloud notification system and respect your Nextcloud notification preferences.
