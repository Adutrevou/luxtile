

## Plan: Use Product Sizes Directly Instead of Option Sets

### Problem
Currently, `ProductQuoteControls` uses the `option_sets` / `option_set_items` tables to populate the size dropdown. But the product's own `sizes` array already contains the relevant size data (comma/pipe-separated strings). The user wants sizes to come directly from each product's `sizes` field and the size selector to appear inline next to "Add to Quote" on the Sales page.

### Changes

**1. Update `ProductQuoteControls.tsx`**
- Remove the dependency on `useOptionSetItems` and `option_set_id`
- Instead, parse the product's `sizes` array: split each entry by `|` to get individual size options
- If the product has sizes, show the `<select>` dropdown; otherwise hide it
- Keep all existing quantity, add-to-quote, and request-quote logic intact

**2. Update `QuoteBasketContext.tsx`** (if needed)
- Verify the composite ID still works with size strings from the `sizes` field — no change expected since it already uses string labels

**3. No database changes needed**
- The `sizes` column on `products` already holds the data
- The `option_sets` / `option_set_items` tables can remain for backward compatibility but will no longer be the primary source for storefront size selection

### Technical Detail

Size parsing logic:
```typescript
// Product sizes come as: ["3200mm x 1440mm x 8mm | 3200mm x 1440mm x 12mm | 3200mm x 1440mm x 20mm"]
// Split by " | " to get individual selectable options
const sizeOptions = product.sizes
  .flatMap(s => s.split(/\s*\|\s*/))
  .map(s => s.trim())
  .filter(Boolean);
const hasOptions = sizeOptions.length > 0;
```

The `<select>` dropdown will use these parsed sizes instead of querying option_set_items. Everything else (quantity controls, add to quote button, request quote button) stays the same.

