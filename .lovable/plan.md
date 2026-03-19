

## Plan: Logo Cleanup & Layout Fixes

### 1. Remove white background from logo asset
Use the AI image generation API to process `src/assets/luxtile-logo.png` — remove the white background making it fully transparent, and enhance the black elements for bold, sharp contrast. Save back as PNG with transparency.

### 2. Remove logo from hero section (`src/pages/Index.tsx`)
Remove the `motion.div` block (lines 41-52) that renders the logo in the hero. Restore the hero to a clean text-only layout — the "Premium Porcelain Slabs" label, tagline, description, and CTA buttons remain.

### 3. Enlarge footer logo (`src/components/Footer.tsx`)
Increase the logo from `h-10` to `h-16 md:h-20` for a larger, bolder presence. Keep `brightness-0 invert` for visibility on dark background. Ensure it remains balanced with surrounding content.

### 4. Navbar logo stays as-is
The navbar logo at `h-8 md:h-10` is already well-sized. The transparent background fix will make it blend naturally. The `brightness-0 invert` logic for dark pages remains.

### Files changed
- `src/assets/luxtile-logo.png` — reprocessed with transparent background
- `src/pages/Index.tsx` — remove logo from hero
- `src/components/Footer.tsx` — increase footer logo size

