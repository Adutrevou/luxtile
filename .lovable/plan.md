
Plan: Stabilize the admin, stop products from disappearing, and speed up photo saves

What I found
- The products are not actually gone from the backend right now. The live catalog still has 10 active products: 6 Collection, 3 Best Sellers, 4 Dekton Partner, and 0 On Sale.
- The admin flow is fragile because admin role is checked in two places (`AdminLogin` and `useAdminAuth`), which creates repeated `has_role` calls and can cause slow or inconsistent loading.
- The admin dashboard does not show a proper error state when product loading fails, so it can look “broken” instead of recoverable.
- Image uploads are currently done one file at a time, which is the main reason photo saves feel stuck or very slow.
- The current delete action is a real database delete, so products can disappear permanently.

Implementation plan
1. Stabilize admin authentication and loading
   - Refactor `src/hooks/useAdminAuth.tsx` to be the single source of truth for session + admin role state.
   - Remove the duplicate role-check flow from `src/pages/AdminLogin.tsx` and route sign-in through the auth hook only.
   - Make `/admin` wait for one clean auth initialization, then either load or redirect without bouncing.

2. Prevent products from being “removed” again
   - Change the current admin delete flow from hard delete to safe archive by setting `status = 'inactive'`.
   - Keep archived products visible in admin so they can be restored instead of disappearing permanently.
   - Add a one-time idempotent backend repair migration to restore the current baseline Luxtile/Dekton catalog if any original website items were deleted, without creating duplicates.

3. Make the admin product list reliable
   - Update `src/pages/AdminDashboard.tsx` to show proper loading, error, and retry states instead of silent failure.
   - Ensure admin loads all products, including inactive ones, so nothing “vanishes” from management.
   - Keep the existing search/filter/sort structure intact.

4. Fix slow image upload and save behavior
   - Refactor `src/hooks/useAdminProducts.tsx` so selected images upload in parallel instead of sequentially.
   - Add client-side image optimization/resizing before upload to reduce file size and speed up saves.
   - Separate “uploading images” from “saving product” state in `AdminDashboard`.
   - Disable submit while uploads are still running so the form cannot get stuck in a half-saved state.
   - Update the local product cache immediately after save, then do a background refresh for speed.

5. Reconfirm product placement on the site
   - Keep the current section rules:
     - `Collection` → Collections page
     - `Best Sellers`, `On Sale`, `Dekton Partner` → Sales page
     - `featured` → home signature section
   - Re-verify `src/pages/Collections.tsx`, `src/pages/Sales.tsx`, and `src/pages/Index.tsx` after the admin/data fixes.
   - Keep the Dekton section as its own section exactly as it is now.

6. Clean up stability issues
   - Fix the current noisy console warnings around skeleton/modal rendering so real issues are easier to spot.
   - Tighten mutation/error handling so failed saves stop cleanly instead of appearing to load forever.

Files involved
- `src/hooks/useAdminAuth.tsx`
- `src/pages/AdminLogin.tsx`
- `src/hooks/useAdminProducts.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/hooks/useProducts.ts`
- `src/pages/Collections.tsx`
- `src/pages/Sales.tsx`
- `src/pages/Index.tsx`
- `supabase/migrations/*` for the data-repair migration

Technical details
- Existing backend security is already solid: public users can only read active products, and admin writes are role-protected.
- Existing indexes on `display_section`, `status`, and `category` are already in place, so this does not need a backend redesign.
- The auth service itself is not the main bottleneck; the slowdown is mostly from duplicated client-side auth checks and the one-by-one image upload loop.

QA after implementation
- Log into `/admin` and confirm it opens without hanging or bouncing.
- Confirm all current products appear in admin.
- Upload one image and multiple images to a product, save, refresh, and verify they persist.
- Archive a product and confirm it disappears from the public site but remains recoverable in admin.
- Verify Collections, Best Sellers, On Sale, Dekton Partner, and featured home products all show in the correct places.
