# Trip Planner

React/Vite V1 lives in `trip/`. The original single-file `index.html` is preserved at the repo root for review.

## Friend usage

1. Open the hosted GitHub Pages URL.
2. Enter the shared passcode.
3. Use the bottom tabs:
   - `Guide`: trip sections, day templates, hamburger section menu, and an edit mode for adding/removing guide cards on the active trip.
   - `Map`: Leaflet/OpenStreetMap pins for guide locations, with Google Maps deep links in popups.
   - `Phrases`: searchable Greek flashcards and practice mode.
   - `Bookings`: shared booking cards with tap-to-edit fields, address autocomplete, and Google Maps links.
   - `Add Trip`: create a future trip from the browser without editing code.
4. Use `Lock` in the header to clear the cached unlock on a shared device.

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
