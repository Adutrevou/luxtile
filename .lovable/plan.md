

## Plan: Remove Area Estimate from Product Cards

Remove the "Area (m²)" input field from all three product card components on the Sales page. The area estimate will remain available only in the Quote Modal (already has a "Quantity (m²)" field when `showSalesFields` is true).

### Changes in `src/pages/Sales.tsx`

1. **ProductOverlayCard** (lines 38, 52-58): Remove `area` state and the `<input>` element. Change `handleAdd(product, area)` → `handleAdd(product)`.

2. **PartnerProductCard** (lines 86, 104-110): Same removal — drop `area` state, remove `<input>`, simplify `handleAdd` call.

3. **PartnerInlineCard** (lines 307, 325-331): Same removal — drop `area` state, remove `<input>`, simplify `handleAdd` call.

4. **`handleAdd` function** (line 31): Simplify to always call `addItem` without area since it's no longer passed from cards.

No other files need changes. The `QuoteModal` already has area/quantity fields for the quote flow. The `estimatedArea` field stays in `QuoteBasketContext` for use from the modal.

