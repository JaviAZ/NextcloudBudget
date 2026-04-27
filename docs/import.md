# Importing Bank Statements

> Import transactions directly from your bank's exported files instead of entering them manually. The Budget app supports CSV, OFX, and QIF formats with automatic duplicate detection.

## Supported Formats

| Format | Best For | Notes |
|--------|----------|-------|
| **CSV** | Most banks, custom exports | Most flexible; requires column mapping |
| **OFX** | US/Canadian banks, direct downloads | Automatic field parsing, no mapping needed |
| **QIF** | Quicken exports, older software | Legacy format with basic field support |

> **Tip:** If your bank offers multiple export formats, OFX is usually the easiest since it requires no manual column mapping. Use CSV when you need full control over how fields are interpreted.

## CSV Import Step-by-Step

CSV is the most flexible import format. The import process walks you through uploading, mapping, previewing, and executing the import.

### 1. Upload Your File

Navigate to **Import > Upload File** and select your CSV file. The file must include a header row as the first line so the app can identify your columns.

> **Note:** Ensure your file is saved with UTF-8 encoding. Files exported with other encodings (e.g., Latin-1 or Windows-1252) may display special characters incorrectly. Most spreadsheet applications let you choose the encoding when saving as CSV.

### 2. Delimiter Detection

The app automatically detects whether your file uses commas, semicolons, or tabs as delimiters. The detected delimiter is shown in the preview. If the detection is wrong, you can override it manually.

> **Tip:** European bank exports commonly use semicolons as delimiters since commas are used as decimal separators in those regions.

### 3. Column Mapping

Map each column in your CSV to the corresponding transaction field:

| Field | Required | Description |
|-------|----------|-------------|
| **Date** | Yes | Transaction date |
| **Amount** | Yes (unless using dual columns) | Transaction amount |
| **Income Amount** | No | Separate column for credits/deposits |
| **Expense Amount** | No | Separate column for debits/withdrawals |
| **Description** | No | Transaction description or memo |
| **Vendor** | No | Payee or merchant name |
| **Reference** | No | Check number or reference ID |

Select the appropriate column header from the dropdown for each field. Columns you do not map are ignored.

### 4. Dual-Column Amount Mapping

Some banks, particularly European ones, export income and expenses in two separate columns rather than using positive and negative values in a single column.

If your file uses this format, map the **Income Amount** and **Expense Amount** columns individually instead of mapping a single **Amount** column.

> **Warning:** You must map either a single **Amount** column or the **Income Amount** and **Expense Amount** pair. Mapping both at the same time is not allowed and will display a validation error.

### 5. European Number Format

If your bank uses European number formatting (e.g., `1.234,56` instead of `1,234.56`), enable the **European number format** toggle during column mapping. This tells the app to interpret periods as thousands separators and commas as decimal separators.

### 6. Preview

After mapping your columns, click **Preview** to see a table of parsed transactions before anything is written to the database. Review the preview carefully:

- Verify dates are parsed correctly
- Confirm amounts have the right sign (positive for income, negative for expenses)
- Check that descriptions and vendors look right

> **Tip:** If something looks wrong in the preview, go back and adjust your column mapping or delimiter settings. No data is saved until you execute the import.

### 7. Execute Import

When the preview looks correct, click **Execute Import** to save the transactions to your selected account. The app reports how many transactions were imported and how many were skipped as duplicates.

## OFX Import

OFX (Open Financial Exchange) files are structured financial data files that many banks offer as a download option, sometimes labeled as "Microsoft Money" or "Quicken" format.

1. Navigate to **Import > Upload File** and select your `.ofx` file
2. The app parses the file automatically -- no column mapping is needed
3. If the file contains an account identifier, the app attempts to match it to one of your existing accounts
4. Review the parsed transactions in the **Preview** step
5. Click **Execute Import** to save

> **Note:** OFX files contain standardized field names, so the date, amount, and description are extracted automatically.

## QIF Import

QIF (Quicken Interchange Format) is a legacy format still exported by some banks and financial software.

1. Navigate to **Import > Upload File** and select your `.qif` file
2. Map the detected fields to transaction fields (similar to CSV mapping)
3. Review the preview and click **Execute Import**

> **Tip:** QIF has limited field support compared to OFX and CSV. If your bank offers OFX as an alternative, prefer that format for more complete data.

## Duplicate Detection

The app automatically checks for duplicate transactions during import. A transaction is considered a duplicate when it matches an existing transaction in the same account on all of the following:

- Date
- Amount
- Description

Duplicates are skipped during import and reported in the results summary. This makes it safe to import overlapping date ranges without creating duplicate entries.

> **Note:** Duplicate detection is based on exact matching. If your bank changes the description text between exports, the same transaction may not be recognized as a duplicate.

## Rolling Back an Import

If you imported transactions by mistake or with incorrect settings, you can undo the entire import:

1. Navigate to **Import**
2. Find the import in your import history
3. Click **Rollback** to delete all transactions that were created by that import

Rolling back removes only the transactions from that specific import. Transactions you entered manually or imported separately are not affected.

> **Warning:** If you have edited any imported transactions (changed categories, amounts, etc.) since the import, those edits will be lost when you roll back.

## Tips

- The first row of a CSV file must contain column headers. Files without headers cannot be mapped correctly.
- Save CSV files as UTF-8 to avoid garbled special characters (accents, currency symbols, etc.).
- For large imports, the preview shows a sample of rows. Scroll through to verify different transaction types are parsed correctly.
- Import into the correct account before clicking **Execute Import** -- transactions cannot be moved between accounts after import.
- Use [Import Rules](rules.md) to automatically categorize transactions after import, saving you from manually categorizing each one.

## Related Features

- [Import Rules](rules.md) -- Create rules to auto-categorize imported transactions by matching description or vendor patterns
- [Transactions](transactions.md) -- View, edit, and manage all your transactions including imported ones
- [Accounts](accounts.md) -- Set up accounts that correspond to your bank accounts before importing

## Settings

- **Auto-apply import rules** -- When enabled, import rules are applied automatically to new transactions during import. Disable this if you prefer to review transactions before categorizing.
- **Skip duplicate transactions** -- Controls whether duplicate detection is active during import. Enabled by default.
