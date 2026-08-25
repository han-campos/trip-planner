# Trip Planner — Step 3 Functional Fixes (for OMP)

Small, focused functional fixes to the live trip-planner app. Implement on branch
`haniel-dummy`, build, verify, commit. Read AGENTS.md + the whole brief first.

Repo: `/opt/data/workspace/trip-planner`. React/Vite SPA in `trip/`. Currently
LIVE on GitHub Pages (fork `han-campos/trip-planner`, `gh-pages` branch). Do NOT
modify the `gh-pages` branch — commit code changes to `haniel-dummy` only; a
separate deploy happens later. Preserve all existing content/features.

## Fix 1 — Remove the Lock button entirely
The top-bar "Lock" button (in `trip/src/App.jsx`) clears the cached passcode
unlock. Haniel decided it's unuseful (solo device) and wants it GONE. Remove the
button and its styling/handler references. Keep the cached-unlock behavior
(returning visitors still skip the passcode) — just no button to clear it.

## Fix 2 — Add a "Delete trip" feature (currently missing)
There is NO way to delete a whole trip today (only individual bookings). Add it:
- Storage: add `deleteTrip(tripId)` to BOTH adapters in
  `trip/src/storage/storage.js` — localStorage (remove the trip + its
  `trip-planner:v1:bookings:<id>` key) and Supabase (`supabase.from('trips').delete().eq('id', id)`
  and delete that trip's bookings by `trip_id`). Mirror the existing
  deleteBooking pattern (fallback on Supabase error).
- UI: put a visible "Delete Trip" control near the trip switcher (top bar) —
  a small trash/delete affordance. Must confirm before deleting
  (`window.confirm('Delete this trip and all its bookings?')`). After delete,
  switch to the first remaining trip (or if none, show an empty state).
- Guard: do NOT allow deleting every trip while leaving zero — if it's the last
  trip, either keep at least the seed or show a clear empty-state. Prefer: allow
  it but show a friendly empty state prompting to create a trip.
- Persist through the storage adapter like other operations.

## Fix 3 — Replace manual lat/lng fields in the Add Trip wizard with location autocomplete
In `trip/src/components/AddTripWizard.jsx`, the "Places" step currently asks the
user to type raw **Latitude** and **Longitude** (the `blankPlace` has `lat`/`lng`
string fields). This is hostile UX — Haniel flagged it. Replace it:
- Reuse the existing `LocationAutocomplete` component
  (`trip/src/components/LocationAutocomplete.jsx`) + `geo.js` (Nominatim
  autocomplete + `googleMapsSearchUrl`) in the Places step.
- Each place should have a **location field**: user types a place name/address,
  picks a match from the dropdown, and the place's `lat`/`lng` get filled
  automatically from the selected geocoded result. No raw coordinate typing.
- Keep the "Place title", "Description", "Notes" fields. Remove the two-col
  Latitude/Longitude inputs and the "use rough coordinates" help text.
- Handle the case where no location is chosen: coordinates stay empty and the
  place simply won't have a map pin (don't block saving on it).

## Verify (headlessly, phone viewport)
Use Playwright chromium:
  executablePath='/opt/hermes/.playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell'
- Lock button is gone from the top bar.
- Delete-trip: creating a throwaway trip and deleting it removes it (and doesn't
  error). Confirm dialog appears.
- Add Trip → Places step shows a location autocomplete (no Latitude/Longitude
  text fields). Typing a place suggests matches; selecting fills lat/lng.
- `npm run build` passes; existing features (guide/map/phrases/bookings) intact.

## Conventions
- $0, no new heavy deps. Nomintim (already used) for geocoding.
- Mobile-first, match existing palette/design, sleek not bulky.
- Update AGENTS.md if behavior/user-visible changed (delete-trip, lock removed).
- Commit on `haniel-dummy` (NOT gh-pages). Keep commits focused.
