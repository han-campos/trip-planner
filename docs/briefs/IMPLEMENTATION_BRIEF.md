# Trip Planner — V1 Implementation Brief (for OMP)

Build the React/Vite frontend for the trip-planner app on branch `haniel-dummy`.
This is a systems build — implement it cleanly and completely. You (OMP) own this
end-to-end; the repo is the deliverable. Do NOT invent new features beyond this
scope. Read this whole brief before starting, then execute in order.

## Context
Existing code: single-file `index.html` (a Greece 2026 guide, Crete + Athens) with a
passcode gate, a guide tab, a bookings tab (currently localStorage only), and a
static Greek-phrase list. It sits in `/opt/data/workspace/trip-planner`. Preserve ALL
existing content (every paragraph, card, list item, phrase, day-template, booking
detail) — the rebuild must carry over 100% of the current information, restructured
into data, nothing dropped.

## Decisions already made (do not overturn)
- **Stack**: React + Vite, plain JavaScript (no TypeScript — lower contributor barrier).
  No CSS framework; hand-rolled CSS with CSS custom properties.
- **Hosting**: static build output (GitHub Pages). All assets must build to a static bundle.
- **State/data**: Supabase (Postgres). Bookings and user-created trip data live in rows.
  The site must ALSO work with a **localStorage fallback** when Supabase keys are not
  configured (see env/config approach) — the app is usable offline out of the box.
- **Map**: Leaflet + OpenStreetMap tiles (free, no API key). Mark all locations.
- **Framework must be truly $0 and no-setup for a visitor who has the passcode.**
- **Colour scheme**: keep the existing palette (blues `#3498db`, `#2980b9`, `#667eea`,
  greys `#2c3e50`, `#f5f5f5`, etc.). Same feel, modernized. Mobile-first.

## User-facing requirements (all must work)
1. **Passcode gate** (no account auth). One shared password. Once unlocked, CACHE the
   unlock (localStorage) so returning visitors skip typing it; provide a visible
   "Lock" button to clear it. Password lives in config, not hardcoded inline.
2. **Reusable / Add a trip from the USER side**: the app models a "trip" as structured
   data (trip → places/sections, phrases, day templates, bookings). Provide an
   "Add New Trip" flow (a form/wizard) a non-developer user can drive. The Greece trip
   ships as the seed/example data. Future trips = creating a new trip row, not editing code.
3. **Mobile-first navigation**: sticky bottom tab bar (Guide / Bookings / …), hamburger /
   section menu on the guide, everything reflows to a single column. Very easy to use on a phone.
4. **Map**: pinch/zoom map pinning every location in the guide. Tapping a pin shows the
   place's info (title + snippet + jump to the section).
5. **Greek vocab made dynamic**: phrase deck with categories; tap-to-flip cards
   (Greek → pronunciation → meaning), a search/filter, and a "let's practice" mode
   (flashcard-style). Not a plain single scroll of text.
6. **Shared bookings**: bookings saved to Supabase so all passcode users see the same
   list; falls back to localStorage per-device when no backend configured. Add / edit /
   delete (tap-to-edit inline fields) — same UX as today.
7. **Zero setup for a passcode visitor**: all features work immediately; the fallback
   storage + static build guarantees this without an account.

## Suggested structure
Implement the Vite React app under `trip/` (or top-level — your call, keep tidy and
 document your choice in the README). Representative split:
- Vite React SPA (single `index.html` entry, JS or JSX)
- React Router or a simple tab router (keep it lightweight; no heavy deps)
- Components: PasswordGate, TabBar, GuideView, PlaceCard section, MapView (Leaflet),
  PhraseDeck (flip cards), BookingsView, AddTripWizard
- Data: a seeded/data-driven trip object for Greece (places, phrases, bookings, itinerary)
- Storage module: `storage.js` with a Supabase-backing OR a localStorage adapter behind
  a common interface (swap when Supabase configured). Supabase JS SDK loaded via npm/CDN.
- CSS: tokens via custom properties, mobile-first, bottom bar, cards, dark-ish accents
  kept to the current blue palette
- Config: passcode + Supabase URL/anon-key + a debug flag all driven by a small config
  (e.g. `js/config.js` or Vite `import.meta.env`), never hardcoded into the bundle where
  the whole SECURITY note matters (see below).

## Security note (non-negotiable)
The passcode and any Supabase keys are CLIENT-side secrets — they are visible to anyone
who inspects the page. That's acceptable and normal for this lightweight shared-guest model
(the passcode is just a weak gate to keep friends out, not real auth). BUT the OpenRouter
**AI generation in Step 2 must NOT hold any API key client-side.** Do not build the AI
call in the client now. Leave a clearly-marked `ai/` stub that calls a server endpoint URL
(placeholder) with a small block comment noting it must be a Supabase Edge Function. Keep
Key out of the bundle.

## Deliverables / quality bar
- A runnable `npm run dev` and `npm run build` (static output for GitHub Pages).
- README that documents: how a friend opens the hosted site and uses it; how to configure
  Supabase keys; how to add a new trip from the user side; how a future dev extends it.
- Keep it dependency-lean. No over-engineering, no scope creep.
- The Greece trip content fully carried over (compare against the original `index.html`).
- Comment the data model (`trip`, `place`, `phrase`, `booking`) so Step 2 (AI fill-the-blanks
  server-side) slots in cleanly.

## Current branch
Work on branch `haniel-dummy` of `/opt/data/workspace/trip-planner`. Preserve `index.html`
(original, unmodified) — do not delete it; the new app lives alongside it until Haniel
reviews the build. Commit your work on this branch.