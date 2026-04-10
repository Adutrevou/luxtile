

## Plan: Navbar Shift, Add-to-Basket Enhancement, Sales Page Cleanup

### 1. Shift nav links closer to logo

**File: `src/components/Navbar.tsx`**

Change the desktop nav container from `justify-between` to a layout where the nav sits closer to the logo. Replace the outer flex with `justify-start` and add a controlled gap (e.g. `gap-16`) between logo and nav links. Reduce inter-link gap from `gap-10` to `gap-8`. This keeps the mobile layout untouched.

### 2. Add "Estimated Area" input to the Add-to-Basket flow

**File: `src/context/QuoteBasketContext.tsx`**
- Extend `QuoteBasketItem` with an optional `estimatedArea?: string` field.
- Update `addItem` signature to accept area.

**File: `src/pages/Sales.tsx`**
- In both `ProductOverlayCard` and `PartnerProductCard` (and the inline partner card), add a small "Estimated Area (m²)" input field inline next to the "Add to Quote" button. Use local state per card. Pass area value to `addItem`.
- Style the input to match the existing minimal border-bottom aesthetic.

**File: `src/components/QuoteModal.tsx`**
- Display the `estimatedArea` per item in the basket item row (next to name/category).
- Keep the existing standalone "Quantity (m²)" field for `showSalesFields` mode.

### 3. Remove "No middlemen" and "Samples on request" from benefits, re-space

**File: `src/pages/Sales.tsx`**
- Remove `'No middlemen'` and `'Samples on request'` from the `benefits` array (leaving 4 items).
- Change the grid from `lg:grid-cols-3` to `md:grid-cols-2` for the 4 remaining benefits, creating a clean 2x2 layout.

### Files modified

| File | Change |
|------|--------|
| `src/components/Navbar.tsx` | Shift nav links left with reduced gap |
| `src/context/QuoteBasketContext.tsx` | Add `estimatedArea` to basket item type |
| `src/pages/Sales.tsx` | Add area input to cards; remove 2 benefits; adjust grid |
| `src/components/QuoteModal.tsx` | Show estimated area per basket item |

