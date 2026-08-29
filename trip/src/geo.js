const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const MIN_QUERY_LENGTH = 3;

export async function autocomplete(query, options = {}) {
  return searchNominatim(query, { limit: 5, ...options });
}

export async function geocode(query, options = {}) {
  const [match] = await searchNominatim(query, { limit: 1, ...options });
  return match || null;
}

export function googleMapsSearchUrl({ lat, lng, query } = {}) {
  const hasCoordinates = lat !== null && lat !== undefined && lat !== '' && lng !== null && lng !== undefined && lng !== '';
  const numericLat = Number(lat);
  const numericLng = Number(lng);
  if (hasCoordinates && Number.isFinite(numericLat) && Number.isFinite(numericLng)) {
    return `https://www.google.com/maps/search/?api=1&query=${numericLat},${numericLng}`;
  }

  const trimmed = String(query || '').trim();
  if (!trimmed) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

async function searchNominatim(query, { limit = 5, signal } = {}) {
  const trimmed = String(query || '').trim();
  if (trimmed.length < MIN_QUERY_LENGTH) return [];

  const url = new URL(NOMINATIM_SEARCH_URL);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('q', trimmed);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('addressdetails', '1');

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    referrerPolicy: 'strict-origin-when-cross-origin',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Nominatim lookup failed (${response.status})`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return data.map(normalizePlace).filter(Boolean);
}

function normalizePlace(result) {
  const lat = Number(result.lat);
  const lng = Number(result.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    id: String(result.place_id || `${lat},${lng}`),
    label: result.display_name || result.name || `${lat}, ${lng}`,
    lat,
    lng,
    type: result.type || result.class || 'place',
  };
}
