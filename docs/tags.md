# Tags

> Tag sets provide multi-dimensional categorization beyond the category hierarchy. Attach additional metadata to transactions -- like which store you shopped at, which project an expense belongs to, or how you paid -- without duplicating categories.

## Overview

Categories tell you *what* a transaction is (groceries, rent, entertainment). Tag sets tell you *more* about it. A "Groceries" category might have a "Store" tag set with tags like "Walmart", "Costco", and "Trader Joes". A "Business" category might have a "Project" tag set with tags for each client or project.

Tag sets are defined per-category. Each category can have multiple tag sets, and each tag set contains any number of individual tags. When you create or edit a transaction, the tag selectors for that category's tag sets appear automatically.

## Creating Tag Sets

To create a tag set:

1. Navigate to **Categories**
2. Select the category you want to add a tag set to
3. Click **Add Tag Set**
4. Enter a name for the set (e.g., "Store", "Project", "Payment Method")
5. Click **Save**

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Descriptive label for this dimension (e.g., "Store") |
| **Category** | Yes | The category this tag set belongs to |

> **Tip:** Keep tag set names short and descriptive. Think of them as column headers -- "Store", "Brand", "Project" -- rather than full sentences.

## Adding Tags to a Set

Once you have a tag set, populate it with individual tag values:

1. Navigate to **Categories**
2. Select the category, then find the tag set
3. Click **Add Tag**
4. Enter the tag value (e.g., "Walmart", "Costco")
5. Click **Save**

You can add as many tags as you need. Tags within a set are displayed in alphabetical order.

> **Note:** Tags are reusable -- once created, they appear in the tag selector every time you categorize a transaction under that category.

## Tagging Transactions

When you add or edit a transaction and select a category that has tag sets, tag selectors appear automatically below the category field:

1. Navigate to **Transactions** and click **Add Transaction** (or edit an existing one)
2. Select a category that has tag sets defined
3. For each tag set, select the appropriate tag from the dropdown
4. Save the transaction

Each tag set selector allows you to pick one tag per set. If a category has multiple tag sets (e.g., "Store" and "Payment Method"), you can tag the transaction along both dimensions.

> **Tip:** You do not have to fill in every tag set. Leave a tag selector empty if it does not apply to that particular transaction.

## Filtering by Tags

Use tag filters in the transaction view to narrow your results:

1. Navigate to **Transactions**
2. Open the filter panel
3. Select a tag set and one or more tag values to filter by
4. The transaction list updates to show only matching transactions

Tag filters combine with other filters (date range, category, account) so you can drill into very specific subsets of your data. For example, filter to "Groceries" category + "Costco" tag to see all your Costco grocery trips.

## Tag-Linked Savings Goals

You can link a savings goal to specific tags to automatically track progress based on tagged transactions:

1. Navigate to **Savings Goals**
2. Create or edit a savings goal
3. Under **Tracking**, select a tag set and one or more tags
4. The savings goal will automatically calculate its progress based on transactions matching those tags

This is useful for tracking spending toward a specific purpose. For example, link a "Vacation Fund" savings goal to a "Vacation" tag to see how much you have saved or spent toward your trip.

## Related Features

- [Categories](categories.md) -- Tag sets are defined per-category
- [Transactions](transactions.md) -- Tag transactions when adding or editing them
- [Savings Goals](savings-goals.md) -- Link savings goals to specific tags for automatic tracking
- [Import Rules](rules.md) -- Rules can automatically assign tags to imported transactions

## Settings

There are no dedicated settings for tags. Tag sets are managed through the category detail view.
