import { createClient } from '@supabase/supabase-js';

const tripsKey = 'trip-planner:v1:trips';
const deletedTripsKey = 'trip-planner:v1:deleted-trips';
const bookingsKey = (tripId) => `trip-planner:v1:bookings:${tripId}`;
const CONFIG_MODE_KEY = 'trip-planner:v1:config-mode';

const clone = (value) => JSON.parse(JSON.stringify(value));
const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

// Remember what mode we booted in, so a later Supabase failure v. "not configured"
// can be told apart in the UI.
function setConfigMode(mode) {
  try {
    localStorage.setItem(CONFIG_MODE_KEY, mode);
  } catch { /* ignore */ }
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readDeletedTripIds() {
  const ids = readJson(deletedTripsKey, []);
  return Array.isArray(ids) ? ids : [];
}

function writeDeletedTripIds(ids) {
  writeJson(deletedTripsKey, [...new Set(ids)]);
}

function seedLocalTrips(seedTrips) {
  const existing = readJson(tripsKey, null);
  const deletedTripIds = new Set(readDeletedTripIds());
  const activeSeeds = seedTrips.filter((seed) => !deletedTripIds.has(seed.id));
  if (!Array.isArray(existing)) {
    writeJson(tripsKey, clone(activeSeeds));
    for (const trip of activeSeeds) {
      writeJson(bookingsKey(trip.id), clone(trip.bookings || []));
    }
    return clone(activeSeeds);
  }

  const merged = [...existing];
  for (const seed of activeSeeds) {
    if (!merged.some((trip) => trip.id === seed.id)) {
      merged.push(clone(seed));
      writeJson(bookingsKey(seed.id), clone(seed.bookings || []));
    }
  }
  writeJson(tripsKey, merged);
  return clone(merged);
}

function localAdapter(seedTrips) {
  seedLocalTrips(seedTrips);

  return {
    mode: 'localStorage',
    lastError: null,
    async listTrips() {
      return seedLocalTrips(seedTrips);
    },
    async saveTrip(trip) {
      const trips = seedLocalTrips(seedTrips);
      const next = trips.some((item) => item.id === trip.id)
        ? trips.map((item) => (item.id === trip.id ? clone(trip) : item))
        : [...trips, clone(trip)];
      writeJson(tripsKey, next);
      if (!localStorage.getItem(bookingsKey(trip.id))) {
        writeJson(bookingsKey(trip.id), clone(trip.bookings || []));
      }
      writeDeletedTripIds(readDeletedTripIds().filter((id) => id !== trip.id));
      return clone(trip);
    },
    async deleteTrip(tripId) {
      const next = seedLocalTrips(seedTrips).filter((trip) => trip.id !== tripId);
      writeJson(tripsKey, next);
      writeDeletedTripIds([...readDeletedTripIds(), tripId]);
      localStorage.removeItem(bookingsKey(tripId));
    },
    async listBookings(tripId, seedBookings = []) {
      const existing = readJson(bookingsKey(tripId), null);
      if (!existing) {
        writeJson(bookingsKey(tripId), clone(seedBookings));
        return clone(seedBookings);
      }
      return clone(existing);
    },
    async upsertBooking(tripId, booking) {
      const bookings = readJson(bookingsKey(tripId), []);
      const normalized = { ...booking, id: booking.id || makeId() };
      const next = bookings.some((item) => item.id === normalized.id)
        ? bookings.map((item) => (item.id === normalized.id ? normalized : item))
        : [...bookings, normalized];
      writeJson(bookingsKey(tripId), next);
      return clone(normalized);
    },
    async deleteBooking(tripId, bookingId) {
      const next = readJson(bookingsKey(tripId), []).filter((booking) => booking.id !== bookingId);
      writeJson(bookingsKey(tripId), next);
    },
  };
}

export function createTripStorage(config, seedTrips) {
  const fallback = localAdapter(seedTrips);
  const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey);
  if (!hasSupabase) {
    fallback.mode = 'local-only';
    fallback.reason = 'Supabase not configured (missing VITE_SUPABASE_URL / ANON_KEY).';
    setConfigMode('local-only');
    return fallback;
  }

  setConfigMode('supabase');
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let lastError = null;
  const rememberError = (error) => {
    lastError = error?.message || String(error || 'Unknown Supabase error');
    if (config.debug) console.warn('[trip-planner] Supabase fallback:', lastError);
  };

  return {
    mode: 'supabase',
    lastError: null,
    get lastError() {
      return lastError;
    },
    async listTrips() {
      const { data, error } = await supabase.from('trips').select('id,payload').order('created_at', { ascending: true });
      if (error) {
        rememberError(error);
        return fallback.listTrips();
      }
      if (!data || data.length === 0) {
        const localTrips = await fallback.listTrips();
        for (const trip of localTrips) {
          await supabase.from('trips').upsert({ id: trip.id, payload: trip }, { onConflict: 'id' });
        }
        return localTrips;
      }
      const trips = data.map((row) => row.payload);
      writeJson(tripsKey, trips);
      return trips;
    },
    async saveTrip(trip) {
      const { error } = await supabase.from('trips').upsert({ id: trip.id, payload: trip }, { onConflict: 'id' });
      if (error) {
        rememberError(error);
        return fallback.saveTrip(trip);
      }
      await fallback.saveTrip(trip);
      return trip;
    },
    async deleteTrip(tripId) {
      const bookingsResult = await supabase.from('bookings').delete().eq('trip_id', tripId);
      if (bookingsResult.error) {
        rememberError(bookingsResult.error);
        return fallback.deleteTrip(tripId);
      }
      const { error } = await supabase.from('trips').delete().eq('id', tripId);
      if (error) {
        rememberError(error);
        return fallback.deleteTrip(tripId);
      }
      await fallback.deleteTrip(tripId);
    },
    async listBookings(tripId, seedBookings = []) {
      const { data, error } = await supabase
        .from('bookings')
        .select('id,payload')
        .eq('trip_id', tripId)
        .order('updated_at', { ascending: true });
      if (error) {
        rememberError(error);
        return fallback.listBookings(tripId, seedBookings);
      }
      if (!data || data.length === 0) {
        for (const booking of seedBookings) {
          await supabase
            .from('bookings')
            .upsert({ id: booking.id || makeId(), trip_id: tripId, payload: booking }, { onConflict: 'id' });
        }
        return fallback.listBookings(tripId, seedBookings);
      }
      const bookings = data.map((row) => row.payload);
      writeJson(bookingsKey(tripId), bookings);
      return bookings;
    },
    async upsertBooking(tripId, booking) {
      const normalized = { ...booking, id: booking.id || makeId() };
      const { error } = await supabase
        .from('bookings')
        .upsert({ id: normalized.id, trip_id: tripId, payload: normalized, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (error) {
        rememberError(error);
        return fallback.upsertBooking(tripId, normalized);
      }
      await fallback.upsertBooking(tripId, normalized);
      return normalized;
    },
    async deleteBooking(tripId, bookingId) {
      const { error } = await supabase.from('bookings').delete().eq('trip_id', tripId).eq('id', bookingId);
      if (error) {
        rememberError(error);
        return fallback.deleteBooking(tripId, bookingId);
      }
      await fallback.deleteBooking(tripId, bookingId);
    },
  };
}

export { makeId };
