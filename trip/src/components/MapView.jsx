import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { CATEGORIES } from '../places.js';

// Map tab for the merged Guide/Map view. Receives already city-filtered,
// categorized `places` and an `onJump` callback to switch to guide mode.
export default function MapView({ places, onJump }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapNode.current) return undefined;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapNode.current, {
      scrollWheelZoom: true,
      tap: true,
      // Keep popups clear of the top-left zoom controls so they don't overlap.
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

      const color = place.category.color;
      const marker = L.marker([lat, lng], { icon: pinIcon(color) }).addTo(map);
      marker.bindPopup(`
        <strong>${place.category.emoji} ${escapeHtml(place.title)}</strong>
        <p style="margin:4px 0;">${escapeHtml(place.snippet)}</p>
        <span style="font-size:12px;color:#7f8c8d;">${escapeHtml(place.category.label)} · ${escapeHtml(place.groupTitle)}</span>
        <br/>
        <button data-jump="${escapeHtml(place.id)}" style="margin-top:6px;cursor:pointer;border:0;background:#3498db;color:white;padding:6px 10px;border-radius:6px;font-weight:700;">View in guide →</button>
      `);
    });

    if (bounds.length > 0) map.fitBounds(bounds, { padding: [24, 24], maxZoom: 10 });
    else map.setView([37.9838, 23.7275], 6);

    map.on('popupopen', (event) => {
      const btn = event.popup.getElement()?.querySelector('[data-jump]');
      btn?.addEventListener('click', () => onJump(btn.getAttribute('data-jump')));
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [places, onJump]);

  return (
    <div className="map-page">
      <div className="leaflet-panel" ref={mapNode} aria-label="Trip locations map" />
      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="map-legend">
      {CATEGORIES.map((cat) => (
        <span key={cat.id}><i style={{ background: cat.color }} />{cat.label}</span>
      ))}
    </div>
  );
}

function pinIcon(color) {
  return L.divIcon({
    className: 'trip-pin',
    html: `<span style="--pin-color:${color}"></span>`,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -30],
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
