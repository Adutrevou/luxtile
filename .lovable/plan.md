

## Plan: Replace Multi-Step Contact Form with Simple Quote Request Form

### Summary
Replace the 5-step wizard (Project Type → Style → Inspiration → Budget → Details) with a straightforward single-page contact/quote form, matching the style of the existing Quote Modal.

### Changes

**File: `src/pages/Contact.tsx`** — Full rewrite of the right-side form panel:

- Remove all step/wizard logic, `STEPS`, `PROJECT_TYPES`, `STYLES`, `BUDGETS` constants, `AnimatePresence` step transitions, and `Progress` bar
- Replace with a simple form containing:
  - **Name** (required)
  - **Email** (required)
  - **Phone** (optional)
  - **Delivery Location** (optional, placeholder "City / Province")
  - **Message** (optional, textarea)
  - **Submit button** with gold accent styling and `gold-shine` class
- Keep the honeypot spam protection field
- Keep the same `submitForm` API call with `formName: 'Contact Us'`
- Keep the success "Thank You" state with check icon
- Keep the left column (contact info, location, "10+ Years of Excellence") unchanged
- Match input styling to Quote Modal: `border-b border-border bg-transparent py-3 outline-none focus:border-accent`
- Use `label-caps` for field labels, consistent with Quote Modal

### Result
A clean, single-step "Request a Quote" form on the Contact page — no wizard steps, no progress bar — visually and functionally aligned with the basket quote modal.

