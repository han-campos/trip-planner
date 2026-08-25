import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChevronRight, LocateFixed, Minus, Navigation, Plus } from 'lucide-react';
import { CATEGORIES } from '../places.js';
import { googleMapsSearchUrl } from '../geo.js';
import { categoryMeta, categoryTone, iconStroke } from './uiIcons.jsx';

// Map tab for the merged Guide/Map view. Receives already city-filtered,
// categorized `places` and an `onJump` callback to switch to guide mode.
export default function MapView({ places, categories = CATEGORIES, activeCategories = [], onToggleCategory, onJump }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const boundsRef = useRef(null);

  useEffect(() => {
    if (!mapNode.current) return undefined;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapNode.current, {
      scrollWheelZoom: true,
      tap: true,
      zoomControl: false,
      autoPanPaddingTopLeft: [56, 56],
      autoPanPadding: [44, 44],
    });
    mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const bounds = [];
    places.forEach((place) => {
      const { lat, lng } = place.coordinates || {};
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      bounds.push([lat, lng]);

      const marker = L.marker([lat, lng], { icon: pinIcon(place.category), title: place.title }).addTo(map);
      const mapsUrl = googleMapsSearchUrl({ lat, lng });
      marker.bindPopup(`
        <div class="map-popup">
          <strong>${escapeHtml(place.title)}</strong>
          <p>${escapeHtml(place.snippet)}</p>
          <span>${escapeHtml(place.category.label)} · ${escapeHtml(place.groupTitle)}</span>
          <div class="map-popup__actions">
            <a class="popup-action popup-action--primary" href="${escapeHtml(mapsUrl)}" target="_blank" rel="noreferrer">${iconMarkup(Navigation, 14)} Directions</a>
            <button class="popup-action" type="button" data-jump="${escapeHtml(place.id)}">View in guide ${iconMarkup(ChevronRight, 14)}</button>
          </div>
        </div>
      `);
    });

    if (bounds.length > 0) {
      const nextBounds = L.latLngBounds(bounds);
      boundsRef.current = nextBounds;
      map.fitBounds(nextBounds, { padding: [32, 32], maxZoom: 10 });
    } else {
      boundsRef.current = null;
      map.setView([37.9838, 23.7275], 6);
    }

    map.on('popupopen', (event) => {
      const btn = event.popup.getElement()?.querySelector('[data-jump]');
      btn?.addEventListener('click', () => onJump(btn.getAttribute('data-jump')));
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [places, onJump]);

  function recenter() {
    const map = mapRef.current;
    if (!map) return;
    if (boundsRef.current) map.fitBounds(boundsRef.current, { padding: [32, 32], maxZoom: 10 });
    else map.setView([37.9838, 23.7275], 6);
  }

  return (
    <div className="map-page">
      <div className="leaflet-panel" ref={mapNode} aria-label="Trip locations map" />
      <div className="map-controls" aria-label="Map controls">
        <button type="button" onClick={recenter} aria-label="Recenter map"><LocateFixed size={20} strokeWidth={iconStroke} /></button>
        <button type="button" onClick={() => mapRef.current?.zoomIn()} aria-label="Zoom in"><Plus size={20} strokeWidth={iconStroke} /></button>
        <button type="button" onClick={() => mapRef.current?.zoomOut()} aria-label="Zoom out"><Minus size={20} strokeWidth={iconStroke} /></button>
      </div>
      <Legend categories={categories} activeCategories={activeCategories} onToggleCategory={onToggleCategory} />
    </div>
  );
}

function Legend({ categories, activeCategories, onToggleCategory }) {
  return (
    <div className="map-legend" aria-label="Map legend">
      {categories.map((cat) => {
        const active = activeCategories.includes(cat.id);
        return (
          <button key={cat.id} type="button" className={active ? 'active' : ''} onClick={() => onToggleCategory?.(cat.id)}>
            <i className={`legend-dot legend-dot--${categoryTone(cat)}`} aria-hidden="true" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

function pinIcon(category) {
  const tone = categoryTone(category);
  const { Icon } = categoryMeta(category);
  return L.divIcon({
    className: 'trip-pin',
    html: `<span class="map-marker map-marker--${tone}">${iconMarkup(Icon, 16)}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function iconMarkup(Icon, size) {
  return renderToStaticMarkup(<Icon aria-hidden="true" size={size} strokeWidth={iconStroke} />);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
