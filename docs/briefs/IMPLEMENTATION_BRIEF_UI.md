# Trip Planner — Visual Uplift Implementation Brief (for OMP)

Implement the documented UI redesign on the trip-planner app. Read AGENTS.md,
then read `UI_REDESIGN_SPEC.md` in full — it is the authoritative design spec
(Qwen 3 827B produced it, Haniel approved it). Follow it precisely.

Repo: `/opt/data/workspace/trip-planner`. React/Vite SPA in `trip/`. Branch:
`haniel-dummy` (DO NOT touch `gh-pages`). A checkpoint tag `pre-visual-uplift`
exists. Build, verify headlessly, commit.

## Goal
Transform the current "generic React library / 2015 bootstrap" look into a modern,
sleek, mobile-first product (Notion/Airbnb/Linear-grade) while keeping:
- ALL features intact (guide, map, phrases, bookings, add-trip, edit mode, delete-trip)
- The **blue family** (refined toward indigo/slate/off-white, NOT replaced)
- $0 static React/Vite, no new heavy framework/library
- The existing data model + Supabase/Nominatim (already working — do not break)

## Source of truth
`UI_REDESIGN_SPEC.md` (1965 lines). It contains:
- §1 design tokens (colors, spacing, radius, shadows, type, motion) — exact values
- §2 per-component redesign (top bar, hero, slider, filters, cards, edit mode, map,
  bottom nav, phrases, bookings, add-trip, shared controls)
- §3 emoji→icon map (use **Lucide** icons, single stroke system, `currentColor`,
  stroke 1.75)
- §4 CSS token architecture (`@layer tokens base components utilities`, semantic
  custom props)
- §5 highest-impact implementation order — FOLLOW IT.

## Non-negotiable specifics (from spec + Haniel)
1. **Kill `TRIP PLANNER V1`** from the top bar → clean wordmark. (Lock button is
   already removed in step-3; keep it gone.)
2. **Replace the raw `<select>`** trip switcher with a brand/trip button + bottom
   sheet (spec §2.2).
3. **Top bar** = brand + trip switcher only. Filters move into the Guide (and a
   floating card on Map).
4. **Bottom nav** → floating rounded bar (spec §2.15) with Lucide icons + subtle
   active pill. 4 tabs: Guide, Phrases, Bookings, Add Trip.
5. **Filter chips** (city + category): 44px heights, larger touch targets, soft
   indigo active state. Category chips use category Lucide icons (NOT emoji+dot).
6. **Cards**: white, 12–16px radius, soft shadows, category tiles. No blue bottom
   border bars / table-row headers. Hero card per spec §2.4.
7. **Map**: colored circle `divIcon` markers (no emoji), styled popups + floating
   legend + floating filters (spec §2.9–2.14). Keep marker→"view in guide" + maps links.
8. **Icons**: swap ALL emoji in UI chrome for Lucide icons per the map in §3. No
   emoji in UI chrome. (Emoji inside trip *content* data is fine — only chrome.)
9. **Phrases / Bookings / Add-Trip** unified under the shared input/button/card
   system (spec §2.16–2.18). Keep autocomplete, delete-trip, edit mode working.
10. Mobile-first, desktop refinement at `min-width: 768px` (hide floating bottom
    nav, inline tabs) per §2.1.

## Implementation guidance
- The design tokens go into `trip/src/styles.css` `:root` (replace/extend existing
  vars). Adopt the `@layer` architecture and semantic naming (spec §4).
- Add **Lucide** icons. Prefer the `lucide-react` package (lean) OR hand-inline SVG
  paths — your call, but keep it dependency-lean and consistent. Use one system.
- Update every component class in `trip/src/components/*` to match the spec.
- Do NOT change data shapes, storage, or Supabase interactions. Pure presentational
  + some structural (top bar, bottom nav, sheets) changes.
- Keep the Guide⇄Map slider, city/category filtering, edit mode, delete-trip,
  bookings autocomplete, Nominatim geocoding — all functional.

## Verify (headlessly, phone viewport 390x844 AND desktop 1440x900)
Use Playwright chromium at
`/opt/hermes/.playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell`.
- No "V1" text; clean brand.
- No emoji in UI chrome (buttons/nav/chips); all Lucide.
- Top bar has brand + trip switcher (button → sheet), no raw `<select>`, no Lock.
- Bottom nav: 4 tabs, floating, active pill.
- Guide: hero card (no blue bottom bar), filter chips (44px, category icons), place
  cards (category tiles).
- Map: colored circle markers, styled popup, legend; filters work (city+category);
  marker→guide + maps links work.
- All 4 tabs render; guide/map/phrases/bookings/add-trip + edit + delete work.
- `npm run build` passes in `trip/`.
- Capture before/after screenshots (mobile + desktop) into `trip/shots/redesign/`.

## Deliverables
- All component/CSS changes committed on `haniel-dummy` (clean, focused commits).
- A short `REDESIGN_NOTES.md` (optional) noting any spec deviation + why.
- Update README/AGENTS.md if user-visible structure changed.

## Do NOT
- Do not touch `gh-pages` (deploy happens separately after Haniel reviews).
- Do not change data model, storage, or backend connectivity.
- Do not add heavy UI frameworks (no MUI, Chakra, etc.) — plain CSS + Lucide per spec.
- Do not break any existing feature.
