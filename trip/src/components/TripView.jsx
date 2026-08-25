import { useMemo, useState } from 'react';
import { ChevronLeft, List, Map as MapIcon } from 'lucide-react';
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

// Merged Guide tab view. The parent tab remains "Guide"; this in-tab switch
// moves between the trip List and Map, with filters shared across both modes.
export default function TripView({ trip, mode: controlledMode, onMode, onOpenTab, onUpdateTrip }) {
  const [localMode, setLocalMode] = useState('guide'); // 'guide' | 'map'
  const mode = controlledMode || localMode;
  const setMode = onMode || setLocalMode;
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
        <header className="map-nav-header">
          <button type="button" className="map-nav-back" onClick={() => setMode('guide')} aria-label="Back to List">
            <ChevronLeft size={24} strokeWidth={iconStroke} />
          </button>
          <h1>{trip.name || trip.title} · Map</h1>
        </header>
        <div className="map-stage">
          <div className="map-filter-card">
            {modeSwitch}
            {filters}
          </div>
          <MapView
            places={places}
            categories={categories}
            activeCategories={cats}
            onToggleCategory={toggleCat}
            onJump={jumpToGuide}
          />
        </div>
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
    <div className="mode-switch" role="tablist" aria-label="List or Map view">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'guide'}
        className={mode === 'guide' ? 'active' : ''}
        onClick={() => onMode('guide')}
      >
        <List size={18} strokeWidth={iconStroke} aria-hidden="true" />
        List
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
