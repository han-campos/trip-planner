# Trip Planner — Navigation Overhaul (for OMP)

Implement a focused mobile-navigation overhaul on the trip-planner app. Read
AGENTS.md first, then the whole brief. This is based on a senior-UX (Qwen 3 827B)
critique of the LIVE app — the critique is the source of truth for the *problems*;
this brief gives the concrete fixes. Implement on branch `haniel-dummy`, build,
verify headlessly, commit. Do NOT touch `gh-pages` (deploy happens separately).

Repo: `/opt/data/workspace/trip-planner`. React/Vite SPA in `trip/`. The app has
4 bottom tabs (Guide, Phrases, Bookings, Add Trip). Inside the Guide tab is a
Guide⇄Map view already merged into `TripView.jsx` (a `mode` state: 'guide'|'map').

## The core problem (fix the mental model)
The word **"Guide"** is overloaded: it is BOTH the bottom tab name AND the left
state of the in-content view toggle ("Guide | Map"). Users cannot tell which level
they're at, and there is no intuitive way to return to the list from Map. Labels
must be hierarchical: **tab = "Guide"", toggle = "List" | "Map"", card title = trip name.

## Required changes (implement all)

### 1. THE critical fix — real back control in Map view
Qwen: "the single control whose absence makes Map state feel like a dead end."
- In **Map mode**, render a top bar (like a nav header) with:
  - a leading **chevron-left ←** button that returns to List (the guide list)
  - a title like **"<Trip name> · Map"** (e.g. "Greece Trip Guide · Map")
- Style it so it clearly reads as a nav/back header (solid background, sits above
  the map), NOT a filter chip. Keep it discoverable and tappable (≥44px).
- The brand logo/compass should NOT occupy the back slot — in map mode the left is
  the ← back, not the brand mark.

### 2. Rename + relocate the view toggle
- Rename the Guide⇄Map segmented toggle to **"List" | "Map"** (drop "Guide" from
  the toggle entirely; reserve "Guide" for the tab only).
- In BOTH List and Map modes, put the toggle **above the filter rows** so it reads
  as a *view switch*, not a filter chip.
- Make the two segments a single sliding-thumb segmented control (already exists as
  the mode-switch) — just relabel + move above filters in List view too.
- Ensure both labels are fully visible (no clipping/overlap with the map or edges).

### 3. Fix the bottom tab bar
- Replace **"Add Trip"** tab with **"Trips"** tab — a list of all trips (reuse the
  trip data from the top switcher/sheet). The "Trips" tab is a persistent destination.
- Move **create-trip** to: a **"+"** button in the top bar header (right side), AND/OR
  keep it in the trip-switcher sheet (a "＋ New trip" row). At least one clear
  entry point must remain for creating a new trip.
- Keep the trip-switcher sheet functional.
- The map view's **+ zoom button** is separate from the tab bar; ensure no visual
  confusion (the "Trips" tab icon should not be a bare "+").

### 4. Fix the List↔Map filter inconsistency
- The List view category filters and the Map view legend/filters must present the
  SAME category set (Map currently may show a category not in list filters, e.g.
  "Dining"). Unify to the same categories in both.

### 5. Stop the lit "Guide" tab from lying during Map
- When in Map (a sub-view of the Guide tab), the bottom "Guide" tab should NOT read
  as a fully lit "you are here" if that's confusing — either dim it subtly or rely
  on the new ← (item 1). Decide a clean behavior: keep the Guide tab selectable
  (tapping it returns to Guide list) but the ← is the primary escape.

### 6. Improve the Phrases tab icon
- The Phrases icon is currently listable at tab size. Redraw/replace with a clearer
  glyph (speech-bubble + letters, or a glossary/book icon), and make all tab icons
  use a consistent, slightly bolder stroke so they read at 22-24px.

## Verify (headlessly, phone 390x844 + desktop 1440x900)
Use Playwright chromium at:
`/opt/hermes/.playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell`
- List view: toggle says "List | Map", above filters; bottom tab "Trips".
- Map view: top-left ← back header (e.g. "Trip Name · Map") present; ← returns to List.
- No "Guide list" label on the toggle (it's "List").
- Bottom tabs: Guide, Phrases, Bookings, Trips (no "Add Trip").
- Create-trip still reachable (top-bar + and/or trip-sheet "New trip").
- Filters identical between List and Map.
- All existing features intact: guide cards, map markers/legend, phrases, bookings,
  edit mode, delete-trip, address autocomplete, persistence (Supabase/localStorage).
- `npm run build` passes.
- Capture before/after screenshots (List + Map, mobile + desktop) into `trip/shots/navfix/`.

## Conventions
- Mobile-first; keep the sleek design system (tokens in `styles.css`); no heavy new deps.
- Keep data model / storage / Supabase UNCHANGED. This is UI/navigation only.
- Commit cleanly on `haniel-dummy`.

## Deliverables
- All changes committed. A short `NAV_NOTES.md` (optional) listing any spec deviations.
- Before/after screenshots.

Do NOT touch `gh-pages` — deploy happens after Haniel reviews.