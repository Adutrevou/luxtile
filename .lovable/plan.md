

## Plan: Enhanced Display Section Controls + Show Existing Products in Admin

### What's Changing

1. **Granular display section options** in admin product form — replace the current simple "Sale" / "Collection" toggles with more specific sub-sections
2. **Show existing static products** (from `collections.ts` and Dekton) in the admin product list so they can be edited/removed
3. **Landing page "Signature Collections"** pulls from products marked `featured` in the database

### Display Section Structure

The current `display_section` field (text array) will use these values:

| Value | Where it appears |
|-------|-----------------|
| `Collection` | Collections page — main grid |
| `Best Sellers` | Sales page — Best Sellers section |
| `On Sale` | Sales page — On Sale section |
| `Dekton Partner` | Sales page — Dekton partner section |

The `featured` boolean toggle determines if a product appears in the **Signature Collections** section on the landing page.

### Step 1: Update Admin Form — Section Picker

**File:** `src/pages/AdminDashboard.tsx`

Replace the current `SECTIONS = ['Sale', 'Collection']` with a two-level picker:
- First: choose page(s) — **Collection** and/or **Sales**
- If Sales is selected, show sub-options: **Best Sellers**, **On Sale**, **Dekton Partner**
- If Collection is selected, product goes to Collections page
- The `featured` toggle already exists — this controls the landing page Signature section

Update `SECTIONS` constant to `['Collection', 'Best Sellers', 'On Sale', 'Dekton Partner']` and update the toggle UI to group them logically.

### Step 2: Seed Existing Products into Database

Create a one-time seed that inserts the 6 static collections and 4 Dekton products into the `products` table so they appear in the admin panel and can be edited/deleted. Each will be inserted with appropriate `display_section` values:
- Static collections → `['Collection']` with first 3 also `featured: true`
- Dekton products → `['Dekton Partner']`
- Best sellers (Calacatta, Nero Marquina, Travertino) → also get `['Best Sellers']`

This will be done via database insert statements.

### Step 3: Update Sales Page Sections

**File:** `src/pages/Sales.tsx`

Replace the hardcoded `bestSellers` and `dektonProducts` arrays with dynamic queries:
- `useProductsBySection('Best Sellers')` for Best Sellers
- `useProductsBySection('On Sale')` for On Sale section (new)
- `useProductsBySection('Dekton Partner')` for Dekton partner section
- Remove static imports and hardcoded arrays

### Step 4: Update Collections Page

**File:** `src/pages/Collections.tsx`

Replace the static `collections` import with `useProductsBySection('Collection')` to render all products dynamically from the database.

### Step 5: Update Landing Page Signature Section

**File:** `src/pages/Index.tsx`

Replace `collections.slice(0, 3)` with a query for products where `featured = true` to dynamically show signature collection items.

### Step 6: Update useProducts Hook

**File:** `src/hooks/useProducts.ts`

Add a `useFeaturedProducts()` export that filters by `featured = true`.

### Files Modified

| File | Change |
|------|--------|
| `src/pages/AdminDashboard.tsx` | Granular section picker UI |
| `src/pages/Sales.tsx` | Dynamic product rendering from DB |
| `src/pages/Collections.tsx` | Dynamic product rendering from DB |
| `src/pages/Index.tsx` | Featured products from DB |
| `src/hooks/useProducts.ts` | Add `useFeaturedProducts` |
| Database | Insert existing products as seed data |

