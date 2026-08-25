// Shared place + category helpers for the merged Guide/Map view.

export const CATEGORIES = [
  { id: 'water',   color: '#3498db', emoji: '🌊', label: 'Beaches & Water',     match: /beach|water|lagoon|boat|snorkel|scuba|swim|windsurf|paddle|kayak|dive/i },
  { id: 'nature',  color: '#27ae60', emoji: '🌲', label: 'Hiking & Nature',      match: /hiking|nature|gorge|mountain|garden|trail|river|botanical/i },
  { id: 'town',    color: '#e67e22', emoji: '🏘️', label: 'Towns & Neighborhoods', match: /town|market|village|neighbor|district|old town|plaka|psirri|kerameikos|monastiraki/i },
  { id: 'dining',  color: '#c0392b', emoji: '🍽️', label: 'Dining & Food',        match: /dining|food|taverna|restaurant|brunch|cafe|street food|meal|wine bar/i },
  { id: 'history', color: '#8e44ad', emoji: '🏛️', label: 'History & Culture',    match: /museum|historical|site|palace|ancient|agora|acropol|stadium|fortress|archae|temple|island|agora/i },
  { id: 'activity', color: '#16a085', emoji: '🚤', label: 'Tours & Activities',  match: /tour|class|tasting|safari|photo|yoga|horse|climb|ferrata|cook|jeep|4x4|wine|raki|catamaran|excursion/i },
];

export const DEFAULT_CATEGORY = { id: 'other', color: '#95a5a6', emoji: '📍', label: 'Other' };

export function categorizeGroup(title) {
  return CATEGORIES.find((c) => c.match.test(title || '')) || DEFAULT_CATEGORY;
}

// Flatten a trip's guide sections into a list of places, each tagged with its
// city (area) + guide category. Shared by the city filter and the map.
export function collectPlaces(trip) {
  return trip.guideSections.flatMap((section) =>
    section.groups.flatMap((group) => group.cards.map((card) => ({
      id: card.id,
      title: card.title,
      area: section.area,
      category: categorizeGroup(group.title),
      groupTitle: group.title,
      snippet: card.paragraphs[0] || card.bullets[0] || section.title,
      coordinates: card.coordinates || { lat: 0, lng: 0 },
    })))
  );
}

export function filterPlacesByCity(places, city) {
  return city === 'all' ? places : places.filter((p) => p.area === city);
}

export function filterSectionsByCity(sections, city) {
  return city === 'all' ? sections : sections.filter((s) => s.area === city);
}

export function citiesOfTrip(trip) {
  // Only surface areas that actually have mapped (coordinate-bearing) places,
  // so non-place sections like phrases/daily-templates don't appear as cities.
  const set = new Set();
  trip.guideSections.forEach((section) =>
    section.groups.forEach((group) =>
      group.cards.forEach((card) => {
        const c = card.coordinates || {};
        if (section.area && Number.isFinite(c.lat) && Number.isFinite(c.lng)) set.add(section.area);
      })
    )
  );
  return ['all', ...set];
}

export function cityLabel(city) {
  if (city === 'all') return '🗺️ All';
  if (city === 'crete') return '🇬🇷 Crete';
  if (city === 'athens') return '🏛️ Athens';
  return city;
}
