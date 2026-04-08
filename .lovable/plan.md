

## Plan: Full Product Management System with Lovable Cloud Backend

The current system stores admin products in `localStorage` — this means data is lost if the browser cache is cleared and never syncs to the frontend for other users. We need to move to a real database with Lovable Cloud (Supabase).

---

### What We're Building

A database-backed product management system where products added in the admin panel automatically appear on the Collections and Sales pages. The admin can assign products to "Sale", "Collection", or both via a `displaySection` field.

---

### Step 1: Enable Lovable Cloud & Create Database Schema

Create a `products` table with migration:

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto-generated |
| name | text | required |
| description | text | required |
| price | numeric | nullable |
| category | text | e.g. Marble, Stone, Concrete |
| tags | text[] | optional array |
| sizes | text[] | e.g. ['600×1200mm'] |
| display_section | text[] | e.g. ['Sale', 'Collection'] |
| images | text[] | storage URLs |
| cover_index | integer | default 0 |
| status | text | 'active' or 'inactive', default 'active' |
| featured | boolean | default false |
| sort_order | integer | for manual ordering |
| created_at | timestamptz | auto |
| updated_at | timestamptz | auto |

Create a `product_images` storage bucket for image uploads (replacing base64 in localStorage).

RLS policies:
- Public SELECT for active products (no auth needed)
- Full CRUD for authenticated admin users (using `has_role` pattern)

### Step 2: Set Up Admin Auth with Supabase

Replace the current hardcoded localStorage auth (`useAdminAuth.tsx`) with Supabase authentication:
- Create the admin user in Supabase (admin@intergrai.co.za)
- Create `user_roles` table with `admin` role
- Update `useAdminAuth` to use `supabase.auth.signInWithPassword`
- Update `RequireAdmin` to check the `user_roles` table

### Step 3: Create Product API Hook (`src/hooks/useProducts.ts`)

A new hook for frontend consumption using React Query + Supabase:
- `useProducts(section?: string)` — fetches active products, optionally filtered by `display_section`
- `useProductsBySection('Sale')` for the Sales page
- `useProductsBySection('Collection')` for the Collections page
- Auto-refetch with React Query's `staleTime` and `refetchOnWindowFocus`

### Step 4: Upgrade Admin Dashboard

Enhance `AdminDashboard.tsx` with:
- **New fields**: price, tags, displaySection (multi-select: Sale/Collection), status toggle
- **Image upload**: Upload to Supabase Storage instead of base64, with drag-to-reorder
- **Search/filter/sort**: Text search by name, filter by category/section/status, sort by date/name
- **Delete confirmation**: Dialog prompt before deletion
- **Toast feedback**: Success/error notifications on all CRUD operations
- **Product list**: Show status badge, section badges, thumbnail, price

### Step 5: Update Admin Product CRUD (`src/hooks/useAdminProducts.tsx`)

Replace localStorage operations with Supabase client calls:
- `addProduct` → `supabase.from('products').insert()`
- `updateProduct` → `supabase.from('products').update()`
- `deleteProduct` → `supabase.from('products').delete()`
- Image upload → `supabase.storage.from('product_images').upload()`
- Use React Query mutations with cache invalidation

### Step 6: Update Frontend Pages

**Collections.tsx:**
- Keep existing static collections as fallback
- Fetch admin products where `display_section` contains 'Collection'
- Merge and render using a shared `ProductCard` component

**Sales.tsx:**
- Keep existing Dekton section as-is (hardcoded brand feature)
- Add a dynamic section below for admin products where `display_section` contains 'Sale'
- Use same `ProductCard` component

### Step 7: Create Reusable ProductCard Component

`src/components/ProductCard.tsx` — shared card used across Collections and Sales:
- Product image with hover zoom
- Name, price, category badge
- "Add to Quote" button integrated with existing QuoteBasket context
- Consistent styling matching current design

### Step 8: Update Product Source Layer

Update `src/lib/productSource.ts` to fetch from Supabase instead of localStorage, maintaining the unified `Product` interface for backward compatibility.

---

### Files Created/Modified

| File | Action |
|------|--------|
| `supabase/migrations/001_products.sql` | Create — products table, RLS, storage bucket |
| `supabase/migrations/002_user_roles.sql` | Create — admin roles table |
| `src/hooks/useAdminAuth.tsx` | Modify — Supabase auth |
| `src/hooks/useAdminProducts.tsx` | Modify — Supabase CRUD |
| `src/hooks/useProducts.ts` | Create — frontend product fetching |
| `src/components/ProductCard.tsx` | Create — reusable card |
| `src/components/admin/RequireAdmin.tsx` | Modify — role-based check |
| `src/pages/AdminDashboard.tsx` | Modify — new fields, search/filter, confirmations |
| `src/pages/Collections.tsx` | Modify — dynamic product rendering |
| `src/pages/Sales.tsx` | Modify — dynamic product rendering |
| `src/lib/productSource.ts` | Modify — Supabase data source |
| `src/integrations/supabase/client.ts` | Create — Supabase client setup |

### Architecture

```text
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Admin Panel  │────▶│  Supabase DB │◀────│  Frontend Pages │
│ (CRUD + UI)  │     │  + Storage   │     │  (React Query)  │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                                          │
       └── Auth via Supabase ──────── RLS Policies ┘
```

### Prerequisites

Lovable Cloud must be enabled to provision the Supabase backend. This will be done first before any code changes.

