

## Plan: Animation Smoothness and Responsive Polish

### 1. Smoother scroll/reveal animations

**File: `src/components/SectionReveal.tsx`**
- Increase `duration` from `0.8` to `1.0` for a more gradual reveal
- Reduce initial `y` offset from `30` to `20` to eliminate the "jumpy" feel
- Keep the same cubic-bezier easing (already smooth)

**File: `src/components/PageTransition.tsx`**
- Increase `duration` from `0.6` to `0.8`
- Reduce initial/exit `y` from `10`/`-10` to `8`/`-8`

### 2. Smoother hover transitions on product cards

**Files: `src/pages/Sales.tsx`, `src/pages/Collections.tsx`, `src/pages/Index.tsx`, `src/components/ProductCard.tsx`**
- Change `transition-transform duration-700` on image hovers to `duration-1000 ease-in-out` for a more fluid zoom
- Change the description reveal `transition-all duration-500 ease-out` to `duration-700 ease-in-out` for smoother expand/collapse

### 3. Responsive refinements

**File: `src/pages/Index.tsx`**
- Hero section: add `min-h-[100svh]` for mobile viewport stability
- Featured collections grid: add `sm:grid-cols-2` step between 1 and 3 columns
- Inspiration teaser: same `sm:grid-cols-2` intermediate step

**File: `src/pages/Sales.tsx`**
- Best Sellers grid: add `sm:grid-cols-2` before `md:grid-cols-3`
- Partner inline grid: ensure single-column stacks cleanly on small screens (already does)
- Benefits grid items: ensure text doesn't overflow on small screens

**File: `src/pages/Collections.tsx`**
- Product grid: add `sm:grid-cols-2` before `lg:grid-cols-3` for tablet
- Button row: add `flex-wrap` (already present) — verify no overflow on small screens

**File: `src/pages/Contact.tsx`**
- Multi-step form: reduce padding on mobile (`p-6 md:p-12` instead of `p-8 md:p-12`)
- Project type grid: use `grid-cols-1 sm:grid-cols-2` for very small screens

**File: `src/pages/Inspiration.tsx`**
- Already uses CSS columns which handle responsiveness well — no changes needed

**File: `src/components/Footer.tsx`**
- Grid gap: reduce from `gap-16` to `gap-12 md:gap-16` for tighter mobile spacing

**File: `src/components/Navbar.tsx`**
- Mobile menu: add `ease-in-out` to the AnimatePresence transition for smoother open/close

**File: `src/pages/Difference.tsx`**
- Card padding: adjust to `p-8 md:p-16` for better mobile fit

### 4. Global CSS animation performance

**File: `src/index.css`**
- Add `will-change: transform` to the `gold-shine` class to hint GPU acceleration
- No other CSS changes needed

### Files modified

| File | Change |
|------|--------|
| `SectionReveal.tsx` | Slower, subtler reveal animation |
| `PageTransition.tsx` | Smoother page transitions |
| `Index.tsx` | Responsive grid steps, svh hero |
| `Sales.tsx` | Responsive grid steps, smoother hovers |
| `Collections.tsx` | Intermediate grid breakpoint |
| `Contact.tsx` | Mobile padding adjustments |
| `Footer.tsx` | Tighter mobile gap |
| `Navbar.tsx` | Smoother mobile menu animation |
| `Difference.tsx` | Mobile padding adjustment |
| `ProductCard.tsx` | Smoother hover transitions |
| `index.css` | GPU hint on gold-shine |

