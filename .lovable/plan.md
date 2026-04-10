

## Plan: Show Estimated Area Input in Quote Modal on All Pages

### Problem
The "Estimated Area (m²)" and "Delivery Location" fields only appear in the Quote Modal when `showSalesFields` is true (currently only on the Sales page). The user wants these fields visible on every page when the quote side panel opens.

### Change

**File: `src/components/QuoteModal.tsx`** (lines 140-151)

Remove the `{showSalesFields && ( ... )}` conditional wrapper so the "Quantity (m²)" and "Delivery Location" fields always render, regardless of which page triggered the modal.

This is a single-line conditional removal — no layout, styling, or logic changes needed.

