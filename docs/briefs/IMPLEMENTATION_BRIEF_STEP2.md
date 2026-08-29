# Trip Planner — Step 1.5 Implementation Brief (for OMP)

Extend the existing React/Vite trip-planner app with a user-facing **edit mode**
and **maps integration**. This is a feature build — implement it cleanly and
completely on branch `haniel-dummy`. Read the whole brief first, then execute.

## Context
Repo: `/opt/data/workspace/trip-planner`. React/Vite app in `trip/`. Live app
renders any trip from data (not code). Storage behind one adapter at
`trip/src/storage/storage.js` (Supabase with localStorage fallback). Trip content
is structured JSON in `trip/src/data/seedTrips.js`. See `AGENTS.md` for the full
architecture, conventions, and the fixed colour palette. Preserve ALL existing
features/content — this is additive.

## Feature 1 — Guide edit mode (add places/restaurants to the CURRENT trip)
Today `AddTripWizard` creates whole *new* trips, but there is no way to add a
place/restaurant to the *existing* (active) trip's guide from the UI. Build a
lightweight, non-developer-friendly edit flow:

- An **"Edit" toggle / mode** on the Guide view. When on, each guide section group
  (e.g. "Dining Experiences") gets a small **"+ Add"** control, and each place card
  gets a delete/remove control.
- Tapping **"+ Add"** opens an inline form. Fields: title, a one-line description,
  optional bullets (newline-separated), and — importantly — **a location field**.
  On save, the new card is appended to that group in the active trip and persisted
  through the storage adapter (so it shows for all passcode users once Supabase is on).
- New cards must be assigned the correct guide **category** automatically (reuse the
  classifier in `trip/src/places.js` — `categorizeGroup`) so they show up in the right
  color on the map and the category filter.
- Keep it simple and mobile-first. Match the existing design (palette, cards, forms).

## Feature 2 — "Open in Google Maps" links everywhere
Wherever a location exists, provide an obvious **"Open in Google Maps"** link:
- **Guide place cards** that have coordinates → link to
  `https://www.google.com/maps/search/?api=1&query=<lat>,<lng>`.
- **Map popups** → include the same "Open in Google Maps" link (in addition to the
  existing "View in guide").
- **Bookings** with an address → link to
  `https://www.google.com/maps/search/?api=1&query=<encoded address>`.
- These are FREE deep links (no API key). Style as a small, consistent
  "📍 Open in Google Maps" affordance.

## Feature 3 — Booking address autocomplete (type-in → pick → geolocated)
Make the booking **address field** feel like a maps type-in (seamless):
- Use **OpenStreetMap's Nominatim** (`https://nominatim.openstreetmap.org/search?format=json&q=<query>`) for autocomplete suggestions as the user types (debounced).
- Show a dropdown of matches; selecting one fills the address AND captures the
  selected `lat`/`lng` for that booking.
- Respect Nominatim's usage policy (light usage, include a `User-Agent`/referer; keep
  requests debounced and modest).
- Keep it FREE — do NOT add a Google Places API key. Design the lookup behind a small
  module (e.g. `trip/src/geo.js`) with a `geocode(query)` + `autocomplete(query)`
  interface so a paid backend could be swapped in later without touching UI.
- Store the captured `lat/lng` on the booking object (additive field). The "Open in
  Google Maps" link from a booking should prefer stored lat/lng when present, else the address.

## Suggested structure
- `trip/src/components/GuideView.jsx` — add edit mode (Edit toggle, "+ Add", remove controls).
- New: `trip/src/components/AddPlaceForm.jsx` (or inline) — the add-place form with location picker.
- `trip/src/geo.js` — Nominatim geocoder + autocomplete module (clean interface).
- `trip/src/components/BookingsView.jsx` — address field autocomplete + capture lat/lng;
  add "Open in Google Maps" to booking cards.
- `trip/src/components/MapView.jsx` — add "Open in Google Maps" to popups.
- `trip/src/components/PlaceCard.jsx` / `GuideView.jsx` — add "Open in Google Maps" to place cards.
- `trip/src/storage/storage.js` + `trip/src/data/seedTrips.js` — support/seed any new
  fields (e.g. booking `lat/lng`) without breaking existing data.
- `trip/src/styles.css` — styles for edit-mode controls, autocomplete dropdown, and the maps link.
- Update `AGENTS.md` to reflect the new edit mode + geo module.

## Requirements / quality bar
- $0 backend only. No Google APIs that require billing. Nominatim for geocoding.
- Mobile-first; match existing palette and design system; no new heavy deps
  (a light debounce helper is acceptable; do NOT add a full autocomplete library
  unless you must).
- Must build (`npm run build` in `trip/`) and be verified headlessly at a phone
  viewport (Playwright chromium is available at
  `/opt/hermes/node_modules/playwright`; launch with
  `executablePath='/opt/hermes/.playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell'`).
  Verify: edit mode shows and adds a place that appears in the guide + map + correct
  category; "Open in Google Maps" links render for a place and a booking; address
  autocomplete returns suggestions and captures lat/lng.
- Preserve existing behavior — no regressions to tabs, filters, map, phrases, bookings.
- Commit cleanly on `haniel-dummy`. Update README if user-visible behaviors change.

## Current branch
Work on `haniel-dummy`. Preserve `index.html` at repo root. Keep commits focused.