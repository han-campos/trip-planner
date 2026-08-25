import { useMemo, useState } from 'react';
import { Compass, Map as MapIcon } from 'lucide-react';
import GuideView from './GuideView.jsx';
import MapView from './MapView.jsx';
import { CategoryIcon, iconStroke } from './uiIcons.jsx';
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

  const modeSwitch = <ModeSwitch mode={mode} onMode={setMode} />;
  const filters = (
    <FilterToolbar
      cities={cities}
      city={city}
      onCity={setCity}
      categories={categories}
      activeCategories={cats}
      onToggleCategory={toggleCat}
    />
  );

  if (mode === 'map') {
    return (
      <article className="map-shell" aria-label="Trip map">
        <div className="map-filter-card">
          <div className="map-filter-card__top">
            <button type="button" className="button button--secondary map-back-btn" onClick={() => setMode('guide')}>
              <Compass size={18} strokeWidth={iconStroke} /> Guide list
            </button>
            {modeSwitch}
          </div>
          {filters}
        </div>
        <MapView
          places={places}
          categories={categories}
          activeCategories={cats}
          onToggleCategory={toggleCat}
          onJump={jumpToGuide}
        />
      </article>
    );
  }

  return (
    <GuideView
      trip={trip}
      sections={sections}
      filters={filters}
      modeSwitch={modeSwitch}
      onOpenTab={onOpenTab}
      onUpdateTrip={onUpdateTrip}
    />
  );
}

function ModeSwitch({ mode, onMode }) {
  return (
    <div className="mode-switch" role="tablist" aria-label="Guide or Map view">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'guide'}
        className={mode === 'guide' ? 'active' : ''}
        onClick={() => onMode('guide')}
      >
        <Compass size={18} strokeWidth={iconStroke} aria-hidden="true" />
        Guide
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'map'}
        className={mode === 'map' ? 'active' : ''}
        onClick={() => onMode('map')}
      >
        <MapIcon size={18} strokeWidth={iconStroke} aria-hidden="true" />
        Map
      </button>
      <span className={`mode-switch-thumb ${mode}`} aria-hidden="true" />
    </div>
  );
}

function FilterToolbar({ cities, city, onCity, categories, activeCategories, onToggleCategory }) {
  return (
    <div className="filter-toolbar">
      <div className="city-filter" role="tablist" aria-label="Filter by city">
        {cities.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={city === c}
            className={city === c ? 'active' : ''}
            onClick={() => onCity(c)}
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
            className={activeCategories.includes(cat.id) ? 'active' : ''}
            onClick={() => onToggleCategory(cat.id)}
            title={cat.label}
          >
            <CategoryIcon category={cat} size={16} />
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
