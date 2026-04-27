# Shared Expenses

> Share expenses with roommates, partners, or friends and track who owes whom. Record shared costs, split them flexibly, and settle up when ready.

## Overview

The Shared Expenses feature helps you manage costs shared with other people. Whether you are splitting rent with a roommate, sharing a dinner bill, or tracking joint household expenses with a partner, shared expenses keep a running tally of who owes whom.

You can split expenses equally, by custom amounts, or by percentages. The app maintains running balances across all shared expenses between you and each contact, so settling up is straightforward.

## Adding Contacts

Before sharing expenses, add the people you share with:

1. Navigate to **Shared Expenses**
2. Click **Add Contact**
3. Choose how to add:
   - **Nextcloud User** -- Select from the dropdown of users on your Nextcloud instance. Their display name is shown automatically.
   - **Manual** -- Enter a name and email address for people not on your Nextcloud instance.
4. Click **Save**

| Field | Required | Description |
|-------|----------|-------------|
| **Nextcloud User** | Either this or Manual | Select from existing Nextcloud users |
| **Name** | Yes (manual) | Display name for the contact |
| **Email** | No (manual) | Email address for reference |

> **Tip:** Adding Nextcloud users is faster and links to their profile. Use manual contacts for people outside your Nextcloud instance (friends, family, service providers).

## Recording a Shared Expense

To record an expense shared with one or more contacts:

1. Navigate to **Shared Expenses**
2. Click **Add Expense**
3. Fill in the details:

| Field | Required | Description |
|-------|----------|-------------|
| **Amount** | Yes | Total amount of the expense |
| **Description** | Yes | What the expense was for (e.g., "Dinner at Luigi's") |
| **Who Paid** | Yes | You or one of your contacts |
| **Split Method** | Yes | Equal, custom amounts, or percentages |
| **Participants** | Yes | Which contacts are included in the split |
| **Date** | No | When the expense occurred (defaults to today) |

4. Configure the split:
   - **Equal** -- Total divided evenly among all participants
   - **Custom amounts** -- Specify exactly how much each person owes
   - **Percentages** -- Assign each person a percentage of the total
5. Click **Save**

> **Note:** The person who paid is included as a participant by default. Their share is subtracted from what others owe them.

## Viewing Balances

The main Shared Expenses view shows your current balance with each contact:

- **Positive balance** -- The contact owes you money
- **Negative balance** -- You owe the contact money
- **Zero balance** -- You are settled up

Click on a contact to see a detailed breakdown of all shared expenses between you, showing how the current balance was reached.

> **Tip:** Balances are net amounts. If you owe someone for dinner but they owe you for groceries, the balance shows only the net difference.

## Recording Settlements

When someone pays what they owe (or you pay them), record a settlement:

1. Navigate to **Shared Expenses**
2. Select the contact you are settling with
3. Click **Settle Up**
4. Enter the payment amount and date
5. Click **Save**

The settlement reduces (or zeroes out) the balance between you and that contact. You can settle partially -- you do not have to pay the full balance at once.

> **Note:** A settlement is not an expense. It does not split between participants. It simply records a payment from one person to another to reduce the outstanding balance.

## Payment History

View all settlements between you and a contact:

1. Navigate to **Shared Expenses**
2. Select a contact
3. View the **Payment History** section

The history shows every settlement recorded between you and that contact, with dates and amounts. This provides an audit trail of who paid whom and when.

## Related Features

- [Transactions](transactions.md) -- Shared expenses can be linked to transactions in your accounts
- [Accounts](accounts.md) -- Payments and settlements may correspond to transactions in your accounts

## Settings

There are no dedicated settings for shared expenses. Contacts and expenses are managed directly through the shared expenses interface.
