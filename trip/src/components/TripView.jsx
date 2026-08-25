import { useMemo, useState } from 'react';
import GuideView from './GuideView.jsx';
import MapView from './MapView.jsx';
import { collectPlaces, filterPlacesByCity, filterSectionsByCity, citiesOfTrip, cityLabel } from '../places.js';

// Merged Guide/Map view. One page with a Guide ⇄ Map slider and a city filter
// that applies to both. Defaults to the whole trip.
export default function TripView({ trip, onOpenTab }) {
  const [mode, setMode] = useState('guide'); // 'guide' | 'map'
  const [city, setCity] = useState('all');    // 'all' | 'crete' | 'athens' ...

  const cities = useMemo(() => citiesOfTrip(trip), [trip]);
  const allPlaces = useMemo(() => collectPlaces(trip), [trip]);
  const sections = useMemo(() => filterSectionsByCity(trip.guideSections, city), [trip, city]);
  const places = useMemo(() => filterPlacesByCity(allPlaces, city), [allPlaces, city]);

  function jumpToGuide(placeId) {
    setMode('guide');
    setTimeout(() => {
      document.getElementById(placeId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  return (
    <article className="page">
      <div className="view-toolbar">
        <div className="mode-switch" role="tablist" aria-label="Guide or Map view">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'guide'}
            className={mode === 'guide' ? 'active' : ''}
            onClick={() => setMode('guide')}
          >
            📖 Guide
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'map'}
            className={mode === 'map' ? 'active' : ''}
            onClick={() => setMode('map')}
          >
            🗺️ Map
          </button>
          <span className={`mode-switch-thumb ${mode}`} aria-hidden="true" />
        </div>

        <div className="city-filter" role="group" aria-label="Filter by city">
          {cities.map((c) => (
            <button
              key={c}
              type="button"
              className={city === c ? 'active' : ''}
              onClick={() => setCity(c)}
            >
              {cityLabel(c)}
            </button>
          ))}
        </div>
      </div>

      {mode === 'guide' ? (
        <GuideView trip={trip} sections={sections} onOpenMap={() => setMode('map')} onOpenTab={onOpenTab} />
      ) : (
        <MapView places={places} onJump={jumpToGuide} />
      )}
    </article>
  );
}
