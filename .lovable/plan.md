

## Contact Page — Live Vision Preview (Mini Showroom)

### What We're Building
Transform the left side of the Contact page from static info text into a **live visual preview** that updates as the user makes selections in the form. As they choose project type, style, and budget, they see a curated "mood board" reflecting their choices — giving them (and the owner) a clear picture of what they're after before any call is made.

### How It Works

**The left panel becomes a dynamic preview that evolves with each step:**

1. **Before any selection** — Shows the current static content (heading, contact info, years badge)
2. **After Step 0 (Project Type)** — A relevant inspiration image appears matching their space (kitchen → `insp-kitchen.jpg`, bathroom → `insp-shower.jpg`, feature wall → `insp-lobby.jpg`, custom → `insp-living.jpg`)
3. **After Step 1 (Style)** — Recommended slab thumbnails appear below the room image, filtered by style:
   - Minimal → Grigio Stone, Urban Concrete
   - Luxury → Calacatta Marble, Nero Marquina
   - Bold → Nero Marquina, Urban Concrete
   - Natural → Travertino Beige, Nordic Oak
4. **After Step 3 (Budget)** — A summary card appears showing all selections as a clean "Your Vision" recap with labels and the selected slab recommendations, reinforcing confidence before they submit details

**The contact info (location, phone, email) moves below the preview or into the form's thank-you state** so the left side is fully dedicated to the visual experience.

### Layout Change
- Left column: transforms from static text → animated vision board that builds up as steps progress
- The heading "Ready to Transform Your Space?" stays at top
- Below it, a card/panel grows with: room photo → recommended slabs → vision summary
- Contact details (MapPin, Phone, Mail) relocate to a compact strip below the preview or remain at the bottom of the left column

### Technical Details

**File changes:**

1. **`src/pages/Contact.tsx`** — Main changes:
   - Create mapping objects: `PROJECT_TYPE_IMAGES` (project type → inspiration image), `STYLE_SLABS` (style → array of collection IDs)
   - Import inspiration images from `src/assets/` and collections data from `src/lib/collections.ts`
   - Replace the static left panel with a `VisionPreview` section that reads `projectType`, `style`, and `budget` state
   - Use `AnimatePresence` + `motion.div` for smooth fade-in of each new visual element as selections are made
   - Show a "Your Vision" summary card after budget is selected (step 3+), listing: project type label, style label, budget label, and 2-3 recommended slab images with names
   - Keep contact info (MapPin/Phone/Mail) in a compact row at the bottom of the left column

2. **No new files or assets needed** — all inspiration images and slab images already exist in `src/assets/`

### User Experience Flow
- User selects "Kitchen" → left side fades in a kitchen installation photo
- User picks "Luxury" → two recommended slabs (Calacatta, Nero Marquina) slide in below the photo with names
- User uploads inspiration (optional) → preview unchanged
- User selects "R150k+" → a polished summary card appears: "Your Vision: Kitchen · Luxury · R150k+ · Recommended: Calacatta Marble, Nero Marquina" with thumbnails
- User fills in details and submits → thank you state, contact info shown

This gives the owner a visual brief of what the client envisions before ever picking up the phone.

