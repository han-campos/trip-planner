# AGENTS.md — Trip Planner

Guiding context for any coding agent (OMP, this assistant, or a future contributor)
working in this repo. Read this first; it reflects the architecture and decisions
Haniel + Kira landed on.

## What this is
A shared **trip planning** web app for Haniel and his friend(s): a per-trip guide,
map, phrase deck, and shared bookings. Seeded with the **Greece 2026** trip
(Crete + Athens). The whole point is a **\$0, zero-setup-for-a-friend** experience:
someone who has the passcode opens a static URL and every feature works.

## Stack (locked — do not overturn without discussion)
- **React + Vite**, plain JavaScript (no TypeScript — lower contributor barrier).
- **No CSS framework.** Hand-rolled CSS with custom properties in `trip/src/styles.css`.
- **Leaflet + OpenStreetMap** tiles (free, no API key) for the map.
- **Supabase (Postgres)** for shared data, with a **localStorage fallback** when
  keys aren't configured. Storage is behind one adapter: `trip/src/storage/storage.js`.
- **Hosting**: static build output for GitHub Pages (`base: './'`). Build with
  `npm run build` inside `trip/` → `trip/dist`.
- The original single-file `index.html` is preserved at repo root for reference
  (content source of truth for the migration); the live app is the React build in `trip/`.

## Getting started
```bash
cd trip
npm install
npm run dev      # local dev
npm run build    # static bundle → trip/dist
npm run preview  # serve the build
```

## Data model (the "reusable trip" core)
A **trip** is one structured object; the app renders any trip from data, not code.
New trips are created either from `trip/src/data/seedTrips.js` or via the
**Add Trip wizard** in the UI (a non-dev user can drive it).
- Trips and bookings persist via the storage adapter (Supabase when configured,
  localStorage otherwise), written to `trip-planner:v1:*` keys.
- Config incl. passcode + Supabase keys + AI endpoint lives in `trip/src/config.js`,
  driven by Vite env vars (`VITE_TRIP_PASSCODE`, `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_AI_ENDPOINT_URL`). See `trip/.env.example`.

## Component map (`trip/src/`)
- `App.jsx` — shell, unlock/lock, active-trip switch, tab routing (4 tabs:
  Guide, Phrases, Bookings, Add Trip).
- `components/TripView.jsx` — **merged Guide + Map** view with a Guide⇄Map slider
  and a per-city filter (All/Crete/Athens). Defaults to whole trip.
- `components/GuideView.jsx` — renders guide sections + day templates from trip data.
- `components/MapView.jsx` — Leaflet map; markers are color/emoji-coded by guide
  category; click marker → popup → "View in guide" jumps to the card.
- `components/PhraseDeck.jsx` — searchable, category-filtered flashcard deck + tap-to-flip + practice mode.
- `components/BookingsView.jsx` — shared bookings, tap-to-edit fields, add/delete.
- `components/AddTripWizard.jsx` — user-side "create a new trip" form.
- `components/PasswordGate.jsx` — shared-passcode gate; unlock cached in localStorage + Lock button.
- `places.js` — shared helpers: category classifier (beaches/nature/towns/dining/
  history/activity), `collectPlaces`, city filtering, legend data.
- `storage/storage.js` — storage adapter (Supabase w/ localStorage fallback).
- `ai/client.js` — **stub only**: calls a server endpoint `VITE_AI_ENDPOINT_URL`.

## Security (non-negotiable)
- Passcode + Supabase keys are **client-side secrets** by design — this is a
  lightweight shared-guest gate, not real auth. Keep it that way; don't pretend it's secure.
- **AI generation must NOT hold a provider key in the client bundle.**
  `ai/client.js` must only POST to a server-owned endpoint — the plan is a
  **Supabase Edge Function** (free tier). The key stays server-side.

## Conventions / quality bar
- Data-driven: content lives in trip data, not hardcoded JSX. A future trip =
  adding data, not editing components.
- Colour scheme is fixed (blues `#3498db`, `#2980b9`, `#667eea`, greys `#2c3e50`,
  `#f5f5f5`). New UI must match; update `:root` tokens rather than inline hex.
- Mobile-first. The bottom tab bar reflows; cards go single-column on small screens.
- Keep it dependency-lean and $0. No over-engineering. Prefer the existing pattern
  to bolting on a new library.
- Build must pass (`npm run build`) before committing.
- Verify changes headlessly (Playwright chromium) at a phone viewport; the UI is a
  phone-first experience.

## Known issue / open item
- **Nea Chora (Waterfront)** is currently filed under *Athens → More Athens
  Neighborhoods*, but it's a neighborhood of **Chania, Crete** (its coordinate is in
  Chania, so it shows as a stray marker when filtering to Athens). Haniel hasn't
  decided whether to move it into the Crete section.

## Step-two / three roadmap (designed, not yet built — serverless seam)
The client already has a clean seam for these; all go through a Supabase Edge
Function (no client-side keys):
1. **AI trip fill-in** — "Add New Trip → AI drafts the sections" from a plain
   prompt, using free OpenRouter models (e.g. `google/gemma-4-*:free`).
2. **Ourfit/wardrobe picker** (friend's idea) — upload clothing photos to Supabase
   Storage → tokenize each item into a structured "garment card" via a free
   multimodal Gemma-4 call → plan a trip wardrobe from the cards (text-only, cheap).
3. **Bookings enhancement + Gmail auto-sync** — cost tracking, links/attachments,
   status, per-person flags; Gmail OAuth + Gmail API to auto-import booking
   confirmations into shared bookings.

## Repo / branch
- Work on `haniel-dummy`. Preserve `index.html` (original). Commit clean, focused
  changes. The AI/wardrobe/Gmail work stays OUT of v1 until Haniel greenlights it.
