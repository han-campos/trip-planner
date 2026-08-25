import { useMemo, useState } from 'react';
import GuideView from './GuideView.jsx';
import MapView from './MapView.jsx';
import {
  citiesOfTrip, cityLabel,
  categoriesOfTrip,
  collectPlaces,
  filterPlacesByCity, filterPlacesByCategory,
  filterSectionsByCity, filterSectionsByCategory,
} from '../places.js';

// Merged Guide/Map view. One page with a Guide ⇄ Map slider, a per-city filter,
// and a multi-select category filter — both apply to guide + map. Defaults to
// the whole trip.
export default function TripView({ trip, onOpenTab, onUpdateTrip }) {
  const [mode, setMode] = useState('guide'); // 'guide' | 'map'
  const [city, setCity] = useState('all');    // 'all' | 'crete' | 'athens' ...
  const [cats, setCats] = useState([]);       // [] = all categories

  const cities = useMemo(() => citiesOfTrip(trip), [trip]);
  const categories = useMemo(() => categoriesOfTrip(trip), [trip]);
  const allPlaces = useMemo(() => collectPlaces(trip), [trip]);

  const sections = useMemo(() => {
    let s = filterSectionsByCity(trip.guideSections, city);
    s = filterSectionsByCategory(s, cats);
    return s;
  }, [trip, city, cats]);

  const places = useMemo(() => {
    let p = filterPlacesByCity(allPlaces, city);
    p = filterPlacesByCategory(p, cats);
    return p;
  }, [allPlaces, city, cats]);

  function jumpToGuide(placeId) {
    setMode('guide');
    setTimeout(() => {
      document.getElementById(placeId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function toggleCat(catId) {
    setCats((current) => current.includes(catId) ? current.filter((c) => c !== catId) : [...current, catId]);
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

        <div className="cat-filter" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={cats.includes(cat.id) ? 'active' : ''}
              onClick={() => toggleCat(cat.id)}
              title={cat.label}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'guide' ? (
        <GuideView trip={trip} sections={sections} onOpenMap={() => setMode('map')} onOpenTab={onOpenTab} onUpdateTrip={onUpdateTrip} />
      ) : (
        <MapView places={places} onJump={jumpToGuide} />
      )}
    </article>
  );
}
