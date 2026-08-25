import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';

export default function MapView({ trip, onOpenGuide }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const places = useMemo(() => collectPlaces(trip), [trip]);

  useEffect(() => {
    if (!mapNode.current) return undefined;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapNode.current, { scrollWheelZoom: true, tap: true });
    mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const bounds = [];
    places.forEach((place) => {
      if (!Number.isFinite(place.coordinates.lat) || !Number.isFinite(place.coordinates.lng)) return;
      bounds.push([place.coordinates.lat, place.coordinates.lng]);
      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon: pinIcon(place.area) }).addTo(map);
      marker.bindPopup(`
        <strong>${escapeHtml(place.title)}</strong>
        <p>${escapeHtml(place.snippet)}</p>
        <a href="#${escapeHtml(place.id)}" data-place-link="${escapeHtml(place.id)}">Jump to section</a>
      `);
    });

    if (bounds.length > 0) map.fitBounds(bounds, { padding: [24, 24], maxZoom: 10 });
    else map.setView([37.9838, 23.7275], 6);

    map.on('popupopen', (event) => {
      const link = event.popup.getElement()?.querySelector('[data-place-link]');
      link?.addEventListener('click', () => onOpenGuide?.());
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [places, onOpenGuide]);

  return (
    <article className="page map-page">
      <header className="hero-card">
        <h2>🗺️ Trip Map</h2>
        <p>Pinch, zoom, and tap pins for the guide snippet and a jump link.</p>
      </header>
      <div className="map-layout">
        <div className="leaflet-panel" ref={mapNode} aria-label="Trip locations map" />
        <div className="map-list">
          <h3>Locations</h3>
          {places.map((place) => (
            <a key={place.id} href={`#${place.id}`} onClick={onOpenGuide}>
              <strong>{place.title}</strong>
              <span>{place.snippet}</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function collectPlaces(trip) {
  return trip.guideSections.flatMap((section) => section.groups.flatMap((group) => group.cards.map((card) => ({
    id: card.id,
    title: card.title,
    area: section.area,
    snippet: card.paragraphs[0] || card.bullets[0] || section.title,
    coordinates: card.coordinates || { lat: 0, lng: 0 },
  }))));
}

function pinIcon(area) {
  const color = area === 'crete' ? '#3498db' : area === 'athens' ? '#667eea' : '#27ae60';
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
