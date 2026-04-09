

## Plan: Fix Products Not Showing on Public Pages

### Diagnosis

The database has 18 active products correctly tagged with `Collection`, `Best Sellers`, `Dekton Partner`, etc. The SQL queries with the same filters the app uses all return correct results. RLS policies are correct (`public` role can SELECT active products). The admin panel works because it uses a separate hook.

The most likely cause is that the product fetch queries are **failing silently** on the client side — the `useProducts` hook throws on error, React Query retries once then gives up, and the pages just render empty arrays with no error feedback. The user sees nothing.

### Changes

**1. Add error visibility to `src/hooks/useProducts.ts`**
- Add `console.error` logging in the fetch function's catch path so silent failures become visible
- Return the `error` and `isError` states from the hooks so pages can use them

**2. Update `src/pages/Sales.tsx`** to show error states
- Destructure `isLoading` and `isError` from each `useProductsBySection` call
- Show a loading skeleton or error message with retry button instead of rendering nothing when products fail to load
- This makes the issue diagnosable immediately

**3. Update `src/pages/Collections.tsx`** to show error states
- Same pattern: show error feedback instead of silent empty state

**4. Update `src/pages/Index.tsx`** featured section
- Change the "Loading collections..." fallback to also handle errors and show a retry option

**5. Add a query error handler to React Query defaults in `src/App.tsx`**
- Add an `onError` callback to the global QueryClient config that logs failed queries to the console
- This ensures ALL query failures are visible during debugging, not just product-specific ones

### What this achieves

- Makes the actual error (network, auth, CORS, env vars) immediately visible in the console and on the page
- Users see a "Something went wrong — tap to retry" message instead of blank space
- No changes to UI design, layout, backend, or data structure

### Files modified

| File | Change |
|------|--------|
| `src/hooks/useProducts.ts` | Add error logging in fetchProducts |
| `src/pages/Sales.tsx` | Add error/loading states for all 3 sections |
| `src/pages/Collections.tsx` | Add error state with retry |
| `src/pages/Index.tsx` | Add error state for featured section |
| `src/App.tsx` | Add global query error logger |

