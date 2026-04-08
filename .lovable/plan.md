

## Plan: Luxtile Admin Panel + Quote Basket Fix

This plan covers two things: (1) building a fully independent admin panel for Luxtile product management, and (2) fixing the quote basket indicator so clicking it opens the quote modal.

---

### Part 1: Fix Quote Basket Click → Opens Quote Modal

**Problem:** The floating basket button calls `openQuoteModal()` which sets `isQuoteOpen = true` in context, but no component reads that state. The QuoteModal instances on Collections/Sales pages use their own local state.

**Fix:** Add a global QuoteModal in `App.tsx` that reads `isQuoteOpen` / `closeQuoteModal` from the QuoteBasketContext. This way clicking the basket indicator from any page opens the quote modal.

**File:** `src/App.tsx` — Add a wrapper component inside `QuoteBasketProvider` that renders `<QuoteModal>` bound to context state.

---

### Part 2: Luxtile Admin Panel

Following the ChariotsCars structure as a reference, build an isolated admin panel with local authentication (no Supabase dependency, since the project currently has none). Product data will be stored in localStorage for persistence, keeping the system fully independent.

#### 2a. Admin Authentication (`src/hooks/useAdminAuth.tsx`)
- Context-based auth with hardcoded credential validation (admin@intergrai.co.za / Admin,123)
- Session persisted in localStorage with a token
- `AdminAuthProvider`, `useAdminAuth` hook, `isAuthenticated` state
- `signIn(email, password)` and `signOut()` methods

#### 2b. Admin Route Guard (`src/components/admin/RequireAdmin.tsx`)
- Checks `useAdminAuth` for authentication
- Redirects to `/admin/login` if not authenticated
- Shows loading spinner while checking

#### 2c. Admin Login Page (`src/pages/AdminLogin.tsx`)
- Clean login form styled to match Luxtile's aesthetic (dark background, accent colors)
- Email + password fields, error handling
- Redirects to `/admin` on success
- Uses Luxtile logo

#### 2d. Admin Dashboard (`src/pages/AdminDashboard.tsx`)
- Sidebar navigation with tabs: Products, Activity
- **Products tab:**
  - Stats cards (total products, categories)
  - Product list with edit/delete actions
  - Add/Edit product form with fields: name, description, category, sizes, images (multiple), featured toggle
  - Image upload supporting multiple files (stored as base64/data URLs in localStorage)
  - Image reordering and cover image selection
- Responsive: sidebar on desktop, dropdown menu on mobile

#### 2e. Product Data Store (`src/hooks/useAdminProducts.tsx`)
- CRUD operations for admin-managed products
- localStorage persistence
- React Query integration for cache/state management
- Product interface matching the existing `Product` type from `productSource.ts`

#### 2f. Product Source Integration (`src/lib/productSource.ts`)
- Update `getProducts()` to merge local collections with admin-managed products
- Admin products marked with `source: 'admin'`
- No changes to how the frontend consumes products

#### 2g. Route Registration (`src/App.tsx`)
- Add `/admin/login` and `/admin` routes
- Admin routes render WITHOUT Navbar/Footer (isolated experience)
- Wrap admin dashboard in `RequireAdmin` guard
- Wrap app in `AdminAuthProvider`

#### Files Created/Modified

| File | Action |
|------|--------|
| `src/hooks/useAdminAuth.tsx` | Create — auth context |
| `src/components/admin/RequireAdmin.tsx` | Create — route guard |
| `src/pages/AdminLogin.tsx` | Create — login page |
| `src/pages/AdminDashboard.tsx` | Create — dashboard |
| `src/hooks/useAdminProducts.tsx` | Create — product CRUD |
| `src/lib/productSource.ts` | Modify — merge admin products |
| `src/App.tsx` | Modify — add routes + global QuoteModal |

---

### Security Note

The admin credentials are hardcoded as requested. This is a client-side-only auth system suitable for internal use. For production-grade security, a backend auth system (Supabase/Lovable Cloud) would be recommended as a future enhancement.

### No Impact on Existing UI

- All admin pages live under `/admin/*` routes with no Navbar/Footer
- Existing pages, styling, and flows remain completely untouched
- The product source layer merges data transparently

