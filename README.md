# Trip Planner

React/Vite V1 lives in `trip/`. The original single-file `index.html` is preserved in `docs/original/` for reference. Design/implementation briefs live in `docs/briefs/`.

## Friend usage

1. Open the hosted GitHub Pages URL.
2. Enter the shared passcode.
3. Use the bottom tabs:
   - `Guide`: trip sections, day templates, section menu, and an edit mode for adding/removing guide cards on the active trip. Inside Guide, a `List | Map` toggle switches between the guide list and a focused full-screen map (with its own compact filter bar and a `←` back control).
   - `Phrases`: searchable Greek flashcards and practice mode.
   - `Bookings`: shared booking cards with tap-to-edit fields, address autocomplete, and Google Maps links.
   - `Trips`: the list of all trips; create a new trip from the browser without editing code (also available via the header `+`).
4. The unlock is cached, so returning visitors skip the passcode automatically.

The unlock is cached in localStorage so returning visitors skip the passcode. With no Supabase config, trips and bookings still work offline per device through localStorage.

Guide cards with coordinates and bookings with either saved coordinates or an address include a free `📍 Open in Google Maps` link. Address suggestions use OpenStreetMap Nominatim with debounced, light client-side requests; no Google Places billing key is required.

## Develop and build

```bash
cd trip
npm install
npm run dev
npm run build
```

`npm run build` writes a static bundle to `trip/dist` with `base: './'`, suitable for GitHub Pages.

## Configuration

Copy `trip/.env.example` to `trip/.env` for local development:

```bash
VITE_TRIP_PASSCODE=bimpeangel2026
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AI_ENDPOINT_URL=
VITE_DEBUG=false
```

Security model: the passcode and Supabase anon key are client-visible. They are a lightweight shared-guest gate, not real auth. AI provider keys must never be exposed client-side; `trip/src/ai/client.js` only calls a configurable server endpoint placeholder.

## Optional Supabase setup

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are blank, the app uses localStorage. To make bookings shared across all passcode users, create these tables in Supabase and set the env vars:

```sql
create table if not exists trips (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id text primary key,
  trip_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table trips enable row level security;
alter table bookings enable row level security;

create policy "public trip planner read trips" on trips for select using (true);
create policy "public trip planner write trips" on trips for insert with check (true);
create policy "public trip planner update trips" on trips for update using (true) with check (true);

create policy "public trip planner read bookings" on bookings for select using (true);
create policy "public trip planner write bookings" on bookings for insert with check (true);
create policy "public trip planner update bookings" on bookings for update using (true) with check (true);
create policy "public trip planner delete bookings" on bookings for delete using (true);
```

These policies match the brief's shared-passcode model: anyone who can open the site can read/write trip data. Use stricter policies only if the product moves to real auth.

## Add a new trip from the user side

1. Unlock the app.
2. Open `Add Trip`.
3. Fill basics, places with map coordinates, phrase cards, a simple day plan, and optional seed bookings.
4. Save. The new trip appears in the header trip switcher and is stored through Supabase or localStorage, depending on configuration.

## Edit the current trip guide

1. Open `Guide` and tap `Edit Guide`.
2. Use `+ Add` inside a guide group such as Dining Experiences.
3. Enter a title, short description, optional bullet notes, and type a location.
4. Pick an OpenStreetMap suggestion to save map coordinates, then save. The card is appended to that group and persisted through the storage adapter.
5. Use `Remove` while edit mode is on to delete a guide card from the active trip.

## Future development

- Seed data is in `trip/src/data/seedTrips.js` and is structured as `trip -> guideSections/groups/cards`, `phraseDeck`, `dayTemplates`, and `bookings`.
- Storage is behind `trip/src/storage/storage.js`; components call the same interface whether Supabase or localStorage is active.
- AI generation must be server-side. Extend the placeholder in `trip/src/ai/client.js` to call a Supabase Edge Function that owns the OpenRouter key and returns the same trip shape used by `seedTrips.js`.
- Keep CSS framework-free. Shared palette tokens live at the top of `trip/src/styles.css`.

## Roadmap

### TODO (known gaps / bugs to fix)

| # | Item | Notes |
|---|---|---|
| 1 | **Stale README sections** | Friend-usage section still references the removed `Lock` button and the old `Add Trip` tab (now `Trips`). Update to match the current UI. |
| 2 | **Upstream PR to `zangelchen/trip-planner`** | Needs Haniel added as collaborator, or a token with `Pull requests` permission on the upstream repo. The current fine-grained PAT gets `403 Resource not accessible`. |
| 3 | **Map marker clustering** | Dense areas (e.g. Crete) render an overlapping pile of pins. Add `leaflet.markercluster` or a similar clustering pass. |
| 4 | **Edit mode for existing cards** | Guide edit mode can add/remove cards but not *edit* an existing card's fields in place. |
| 5 | **Booking status field** | Bookings have no `status` (confirmed/pending/cancelled) — the design system already defines the chips. |
| 6 | **Offline-first check** | The localStorage fallback works, but there's no service worker; a cold visit with no network shows a blank shell. |
| 7 | **Automated test suite** | Verification is currently headless-browser scripts run by hand. Consider a small Playwright/Vitest suite committed to the repo. |
| 8 | **README architecture diagram** | A simple component/data-flow diagram would help new contributors. |

### Nice to have (step-two / three ideas)

| # | Item | Notes |
|---|---|---|
| 1 | **AI trip fill-in** | "Add Trip → AI drafts the sections" from a plain prompt, via a Supabase Edge Function + free OpenRouter models (e.g. `google/gemma-4-*:free`). Client seam already exists in `trip/src/ai/client.js`. |
| 2 | **Wardrobe/outfit picker** | Upload clothing photos → tokenize each item into a structured "garment card" via a free multimodal Gemma call → plan trip wardrobes from the cards (text-only, cheap). Friend's idea. |
| 3 | **Bookings enhancements** | Cost tracking + running trip total, attachments/links, per-person flags, status chips, itinerary ordering. |
| 4 | **Gmail auto-sync** | OAuth + Gmail API to auto-import booking confirmations into shared bookings. Server-side (Edge Function), same seam as AI. |
| 5 | **PWA install** | Manifest + service worker so the app installs to a home screen and works offline. |
| 6 | **Real map geocoding picker** | A mini map picker when adding a place (drop a pin visually instead of typing an address). |
| 7 | **Multi-trip dashboard** | The `Trips` tab is currently a list; a richer dashboard with trip cards/photos would scale past 2–3 trips. |
| 8 | **i18n** | The UI is English-only; Greek labels on the map are from OSM tiles. Low priority. |
