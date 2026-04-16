

## Plan: Standardize Partner Logo Sizes on Sales Page

### Problem
The partner logos (Dekton, Neolith, Infinity) in each partner section have different intrinsic aspect ratios. While they share the same height class (`h-8 md:h-10`), some logos appear visually larger or smaller due to their width differences.

### Solution
Add a consistent `max-w` constraint and fixed height container so all logos render at the same visual weight as Dekton, without stretching.

### Change

**File: `src/pages/Sales.tsx`** (line 62)

Change the logo `<img>` className from:
```
h-8 md:h-10 w-auto object-contain
```
to:
```
h-8 md:h-10 max-h-10 w-auto max-w-[160px] md:max-w-[200px] object-contain
```

This caps both dimensions so all logos — regardless of intrinsic aspect ratio — occupy the same visual footprint. `object-contain` ensures no stretching or distortion. No layout, spacing, or responsiveness changes.

