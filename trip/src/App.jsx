import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Compass, MapPin, Plus, Search, Trash2, X } from 'lucide-react';
import { appConfig, activeTripStorageKey, unlockStorageKey } from './config.js';
import { defaultTripId, seedTrips } from './data/seedTrips.js';
import { createTripStorage, makeId } from './storage/storage.js';
import PasswordGate from './components/PasswordGate.jsx';
import TabBar from './components/TabBar.jsx';
import TripView from './components/TripView.jsx';
import PhraseDeck from './components/PhraseDeck.jsx';
import BookingsView from './components/BookingsView.jsx';
import AddTripWizard from './components/AddTripWizard.jsx';
import { iconStroke } from './components/uiIcons.jsx';

const tabs = [
  { id: 'guide', label: 'Guide' },
  { id: 'phrases', label: 'Phrases' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'add-trip', label: 'Add Trip' },
];

export default function App() {
  const storage = useMemo(() => createTripStorage(appConfig, seedTrips), []);
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(unlockStorageKey) === 'true');
  const [activeTab, setActiveTab] = useState('guide');
  const [trips, setTrips] = useState(seedTrips);
  const [activeTripId, setActiveTripId] = useState(() => localStorage.getItem(activeTripStorageKey) || defaultTripId);
  const [loading, setLoading] = useState(true);
  const [tripSheetOpen, setTripSheetOpen] = useState(false);
  const [tripSearch, setTripSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    storage.listTrips().then((loadedTrips) => {
      if (!mounted) return;
      setTrips(loadedTrips);
      const saved = localStorage.getItem(activeTripStorageKey);
      const next = loadedTrips.find((trip) => trip.id === saved)?.id || loadedTrips[0]?.id || '';
      setActiveTripId(next);
      if (next) localStorage.setItem(activeTripStorageKey, next);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [storage]);

  useEffect(() => {
    if (!tripSheetOpen) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') setTripSheetOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [tripSheetOpen]);

  const activeTrip = trips.find((trip) => trip.id === activeTripId) || trips[0] || null;
  const filteredTrips = trips.filter((trip) => `${trip.name} ${trip.subtitle} ${trip.dates}`.toLowerCase().includes(tripSearch.toLowerCase()));

  function unlock(passcode) {
    if (passcode === appConfig.passcode) {
      localStorage.setItem(unlockStorageKey, 'true');
      setUnlocked(true);
      return true;
    }
    return false;
  }

  async function deleteActiveTrip() {
    if (!activeTrip) return;
    if (!window.confirm(`Delete ${activeTrip.name}? This removes its saved bookings too.`)) return;
    await storage.deleteTrip(activeTrip.id);
    const remaining = trips.filter((trip) => trip.id !== activeTrip.id);
    setTrips(remaining);
    const next = remaining[0]?.id || '';
    setActiveTripId(next);
    if (next) localStorage.setItem(activeTripStorageKey, next);
    else localStorage.removeItem(activeTripStorageKey);
    setTripSheetOpen(false);
  }

  function chooseTrip(tripId) {
    setActiveTripId(tripId);
    localStorage.setItem(activeTripStorageKey, tripId);
    setActiveTab('guide');
    setTripSheetOpen(false);
  }

  async function saveTrip(tripDraft) {
    const normalized = normalizeTrip(tripDraft);
    const saved = await storage.saveTrip(normalized);
    setTrips((current) => [saved, ...current.filter((trip) => trip.id !== saved.id)]);
    chooseTrip(saved.id);
  }

  async function updateTrip(trip) {
    const saved = await storage.saveTrip(trip);
    setTrips((current) => current.map((item) => (item.id === saved.id ? saved : item)));
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={unlock} />;
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="topbar__brand" aria-label="Trip Planner">
          <span className="topbar__mark" aria-hidden="true"><Compass size={16} strokeWidth={iconStroke} /></span>
          <span>Trip Planner</span>
        </div>

        <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="desktop" />

        <button
          className={`trip-switcher-button ${tripSheetOpen ? 'is-open' : ''}`}
          type="button"
          onClick={() => setTripSheetOpen(true)}
          disabled={trips.length === 0}
          aria-haspopup="dialog"
          aria-expanded={tripSheetOpen}
        >
          <MapPin size={16} strokeWidth={iconStroke} aria-hidden="true" />
          <span>{activeTrip?.name || 'No trips'}</span>
          <ChevronDown size={16} strokeWidth={iconStroke} aria-hidden="true" />
        </button>
      </header>

      {storage.lastError && <p className="storage-warning">Supabase is unavailable; using localStorage fallback. {storage.lastError}</p>}
      {loading ? <main className="screen-message">Loading trip…</main> : (
        <main className="content-shell">
          {!activeTrip && activeTab !== 'add-trip' && <EmptyTrips onCreate={() => setActiveTab('add-trip')} />}
          {activeTrip && activeTab === 'guide' && <TripView trip={activeTrip} onOpenTab={setActiveTab} onUpdateTrip={updateTrip} />}
          {activeTrip && activeTab === 'phrases' && <PhraseDeck deck={activeTrip.phraseDeck} />}
          {activeTrip && activeTab === 'bookings' && <BookingsView trip={activeTrip} storage={storage} />}
          {activeTab === 'add-trip' && <AddTripWizard onSave={saveTrip} />}
        </main>
      )}

      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {tripSheetOpen && (
        <TripSheet
          trips={filteredTrips}
          allTripsCount={trips.length}
          activeTrip={activeTrip}
          query={tripSearch}
          onQuery={setTripSearch}
          onClose={() => setTripSheetOpen(false)}
          onChoose={chooseTrip}
          onCreate={() => { setActiveTab('add-trip'); setTripSheetOpen(false); }}
          onDelete={deleteActiveTrip}
        />
      )}
    </div>
  );
}

function TripSheet({ trips, allTripsCount, activeTrip, query, onQuery, onClose, onChoose, onCreate, onDelete }) {
  return (
    <div className="sheet-overlay" role="presentation" onMouseDown={onClose}>
      <section className="bottom-sheet trip-sheet" role="dialog" aria-modal="true" aria-labelledby="trip-sheet-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-header">
          <div>
            <h2 id="trip-sheet-title">Trips</h2>
            <p>{allTripsCount} saved {allTripsCount === 1 ? 'trip' : 'trips'}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close trips">
            <X size={20} strokeWidth={iconStroke} />
          </button>
        </header>

        <label className="search-field trip-search">
          <Search size={18} strokeWidth={iconStroke} aria-hidden="true" />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search trips" autoFocus />
        </label>

        <div className="trip-list" role="listbox" aria-label="Choose trip">
          {trips.map((trip) => (
            <button
              key={trip.id}
              type="button"
              className={`trip-row ${trip.id === activeTrip?.id ? 'is-active' : ''}`}
              onClick={() => onChoose(trip.id)}
              role="option"
              aria-selected={trip.id === activeTrip?.id}
            >
              <span>
                <strong>{trip.name}</strong>
                <small>{trip.dates || trip.subtitle || 'Trip guide'}</small>
              </span>
              <ChevronRight size={18} strokeWidth={iconStroke} aria-hidden="true" />
            </button>
          ))}
          {trips.length === 0 && <p className="empty-inline">No trips match that search.</p>}
        </div>

        <footer className="trip-sheet__footer">
          <button className="button button--primary" type="button" onClick={onCreate}>
            <Plus size={18} strokeWidth={iconStroke} aria-hidden="true" />
            New trip
          </button>
          <button className="button button--danger" type="button" onClick={onDelete} disabled={!activeTrip}>
            <Trash2 size={18} strokeWidth={iconStroke} aria-hidden="true" />
            Delete active trip
          </button>
        </footer>
      </section>
    </div>
  );
}

function EmptyTrips({ onCreate }) {
  return (
    <section className="page empty-state">
      <h2>No trips yet</h2>
      <p>Create a trip to fill the guide, map, phrases, and bookings.</p>
      <button className="button button--primary" type="button" onClick={onCreate}>Create a trip</button>
    </section>
  );
}

function normalizeTrip(draft) {
  const now = new Date().toISOString();
  const id = draft.id || makeId();
  const places = draft.places.map((place) => {
    const latText = String(place.lat ?? '').trim();
    const lngText = String(place.lng ?? '').trim();
    const lat = Number(latText);
    const lng = Number(lngText);
    const hasCoordinates = latText !== '' && lngText !== '' && Number.isFinite(lat) && Number.isFinite(lng);

    return {
      id: place.id || slug(place.title),
      title: place.title,
      paragraphs: place.description ? [place.description] : [],
      bullets: place.notes ? place.notes.split('\n').map((line) => line.trim()).filter(Boolean) : [],
      links: [],
      location: place.location?.trim() || '',
      coordinates: hasCoordinates ? { lat, lng } : null,
    };
  });

  return {
    id,
    name: draft.name,
    title: draft.title || draft.name,
    subtitle: draft.subtitle || `${draft.destination} — ${draft.dates}`,
    dates: draft.dates,
    createdAt: now,
    nav: [
      { label: 'Places', href: '#places' },
      { label: 'Phrases', href: '#phrases' },
      { label: 'Day Template', href: '#day-template' },
    ],
    guideSections: [{
      id: 'places',
      title: `${draft.destination || draft.name} — Places`,
      area: 'custom',
      groups: [{ id: 'saved-places', title: 'Saved Places', cards: places }],
    }],
    phraseDeck: {
      title: 'Phrase Deck',
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
      tip: { title: 'Practice', body: 'Add practical phrases you expect to use often, then practice them in flashcard mode.' },
    },
    dayTemplates: {
      title: 'Daily Schedule Templates',
      templates: [{
        id: 'day-template',
        title: 'Sample day',
        header: 'Custom day',
        slots: draft.dayPlan.split('\n').map((line, index) => ({ time: `Stop ${index + 1}`, activity: line.trim(), detail: '' })).filter((slot) => slot.activity),
      }],
      tip: { title: 'Adjust daily', body: 'Use this as a starting rhythm; bookings and guide cards hold the detailed logistics.' },
    },
    bookings: draft.bookings,
  };
}

function slug(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || makeId();
}
