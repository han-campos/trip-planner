import { useEffect, useMemo, useState } from 'react';
import { appConfig, activeTripStorageKey, unlockStorageKey } from './config.js';
import { defaultTripId, seedTrips } from './data/seedTrips.js';
import { createTripStorage, makeId } from './storage/storage.js';
import PasswordGate from './components/PasswordGate.jsx';
import TabBar from './components/TabBar.jsx';
import GuideView from './components/GuideView.jsx';
import MapView from './components/MapView.jsx';
import PhraseDeck from './components/PhraseDeck.jsx';
import BookingsView from './components/BookingsView.jsx';
import AddTripWizard from './components/AddTripWizard.jsx';

const tabs = [
  { id: 'guide', label: 'Guide', icon: '🇬🇷' },
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'phrases', label: 'Phrases', icon: '🗣️' },
  { id: 'bookings', label: 'Bookings', icon: '📋' },
  { id: 'add-trip', label: 'Add Trip', icon: '➕' },
];

export default function App() {
  const storage = useMemo(() => createTripStorage(appConfig, seedTrips), []);
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(unlockStorageKey) === 'true');
  const [activeTab, setActiveTab] = useState('guide');
  const [trips, setTrips] = useState(seedTrips);
  const [activeTripId, setActiveTripId] = useState(() => localStorage.getItem(activeTripStorageKey) || defaultTripId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    storage.listTrips().then((loadedTrips) => {
      if (!alive) return;
      setTrips(loadedTrips);
      const stored = localStorage.getItem(activeTripStorageKey);
      const nextId = loadedTrips.some((trip) => trip.id === stored) ? stored : loadedTrips[0]?.id || defaultTripId;
      setActiveTripId(nextId);
      localStorage.setItem(activeTripStorageKey, nextId);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [storage]);

  const activeTrip = trips.find((trip) => trip.id === activeTripId) || trips[0] || seedTrips[0];

  function unlock(passcode) {
    if (passcode !== appConfig.passcode) return false;
    localStorage.setItem(unlockStorageKey, 'true');
    setUnlocked(true);
    return true;
  }

  function lock() {
    localStorage.removeItem(unlockStorageKey);
    setUnlocked(false);
    setActiveTab('guide');
  }

  function chooseTrip(tripId) {
    setActiveTripId(tripId);
    localStorage.setItem(activeTripStorageKey, tripId);
    setActiveTab('guide');
  }

  async function saveTrip(tripDraft) {
    const trip = normalizeTrip(tripDraft);
    const saved = await storage.saveTrip(trip);
    setTrips((current) => {
      const next = current.some((item) => item.id === saved.id)
        ? current.map((item) => (item.id === saved.id ? saved : item))
        : [...current, saved];
      return next;
    });
    chooseTrip(saved.id);
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={unlock} />;
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div>
          <p className="eyebrow">Trip Planner V1</p>
          <h1>{activeTrip?.name || 'Trip Planner'}</h1>
        </div>
        <div className="topbar-actions">
          <label className="trip-switcher">
            <span>Trip</span>
            <select value={activeTrip?.id || ''} onChange={(event) => chooseTrip(event.target.value)}>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>{trip.name}</option>
              ))}
            </select>
          </label>
          <button className="ghost-button" type="button" onClick={lock}>Lock</button>
        </div>
      </header>

      {storage.lastError && <p className="storage-warning">Supabase is unavailable; using localStorage fallback. {storage.lastError}</p>}
      {loading ? <main className="screen-message">Loading trip…</main> : (
        <main className="content-shell">
          {activeTab === 'guide' && <GuideView trip={activeTrip} onOpenTab={setActiveTab} />}
          {activeTab === 'map' && <MapView trip={activeTrip} onOpenGuide={() => setActiveTab('guide')} />}
          {activeTab === 'phrases' && <PhraseDeck deck={activeTrip.phraseDeck} />}
          {activeTab === 'bookings' && <BookingsView trip={activeTrip} storage={storage} />}
          {activeTab === 'add-trip' && <AddTripWizard onSave={saveTrip} />}
        </main>
      )}

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

function normalizeTrip(draft) {
  const now = new Date().toISOString();
  const id = draft.id || makeId();
  const places = draft.places.map((place) => ({
    id: place.id || slug(place.title),
    title: place.title,
    paragraphs: place.description ? [place.description] : [],
    bullets: place.notes ? place.notes.split('\n').map((line) => line.trim()).filter(Boolean) : [],
    links: [],
    coordinates: {
      lat: Number(place.lat) || 0,
      lng: Number(place.lng) || 0,
    },
  }));

  return {
    id,
    name: draft.name,
    title: draft.title || draft.name,
    subtitle: draft.subtitle || `${draft.destination} — ${draft.dates}`,
    dates: draft.dates,
    createdAt: now,
    nav: [
      { label: '📍 Places', href: '#places' },
      { label: '🗣️ Phrases', href: '#phrases' },
      { label: '📅 Day Template', href: '#day-template' },
    ],
    guideSections: [{
      id: 'places',
      title: `📍 ${draft.destination || draft.name} — Places`,
      area: 'custom',
      groups: [{ id: 'saved-places', title: 'Saved Places', cards: places }],
    }],
    phraseDeck: {
      title: '🗣️ Phrase Deck',
      categories: [{
        id: 'basics',
        title: 'Basics',
        items: draft.phrases.map((phrase) => ({
          id: phrase.id || slug(`${phrase.greek}-${phrase.meaning}`),
          greek: phrase.greek,
          pronunciation: phrase.pronunciation,
          meaning: phrase.meaning,
        })),
      }],
      tip: { title: '💡 Practice', body: 'Add practical phrases you expect to use often, then practice them in flashcard mode.' },
    },
    dayTemplates: {
      title: '📅 Daily Schedule Templates',
      templates: [{
        id: 'day-template',
        title: 'SAMPLE DAY',
        header: 'Custom Day',
        slots: draft.dayPlan.split('\n').map((line, index) => ({ time: `Stop ${index + 1}`, activity: line.trim(), detail: '' })).filter((slot) => slot.activity),
      }],
      tip: { title: '💡 Adjust Daily', body: 'Use this as a starting rhythm; bookings and guide cards hold the detailed logistics.' },
    },
    bookings: draft.bookings,
  };
}

function slug(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || makeId();
}
