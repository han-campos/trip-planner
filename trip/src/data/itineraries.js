// Proposed day-by-day itineraries, keyed by trip id.
// Every day is fixed except the "options" day, which carries several
// interchangeable variants the group still has to pick between.
// Drive times are car estimates from the Chania base (Agioi Apostoli / Naeva).

export const itineraries = {
  'greece-crete-athens-2026': {
    title: 'Proposed Crete Itinerary',
    subtitle: 'Sept 9–13 — same plan every day except Sept 12, where we choose one of four options.',
    base: 'Base: Chania (Agioi Apostoli / Naeva)',
    days: [
      {
        id: 'sep-9',
        date: 'Tue Sept 9',
        title: 'Chania Old Town',
        category: 'town',
        summary: 'Arrival day taken slow: Venetian harbor, the old town lanes, dinner out, no fixed schedule.',
        bullets: [
          'Venetian harbor + lighthouse walk at golden hour',
          'Wander the old town: Splantzia, the leather lane, Municipal Market',
          'Sunset drink in Nea Chora, dinner in the old town',
        ],
        drives: [
          { from: 'Naeva / Agioi Apostoli', to: 'Chania old town', time: '10–15 min', distance: '6 km', note: 'Park at Talos or the harbor lots; old town itself is walk-only.' },
        ],
      },
      {
        id: 'sep-10',
        date: 'Wed Sept 10',
        title: 'Samaria Gorge',
        category: 'nature',
        summary: 'The big hike. Early start, 16 km downhill through the gorge, ferry + bus loop back.',
        bullets: [
          'Leave 5:30–6:00am; gorge entrance at Xyloskalo (Omalos) opens 7:00am',
          '16 km, 5–7 hours descending to Agia Roumeli — no road out, the boat is the only exit',
          'Ferry Agia Roumeli → Chora Sfakion (or Sougia), then bus back to Chania',
          'Book the ferry/bus combo or an organized transfer so the car is not stranded at Omalos',
        ],
        drives: [
          { from: 'Chania', to: 'Xyloskalo / Omalos (trailhead)', time: '45–60 min', distance: '42 km', note: 'Mountain switchbacks the last 20 min.' },
          { from: 'Agia Roumeli', to: 'Chora Sfakion', time: '45–70 min', distance: 'ferry', note: 'Ferry only; last boat typically ~5:30pm — do not miss it.' },
          { from: 'Chora Sfakion', to: 'Chania', time: '1 h 30 – 1 h 45', distance: '73 km', note: 'Public bus meets the ferry.' },
        ],
      },
      {
        id: 'sep-11',
        date: 'Thu Sept 11',
        title: 'Elafonisi + Kedrodasos, then Elos',
        category: 'water',
        summary: 'Pink-sand lagoon early, the wild cedar beach next door, chestnut-village lunch on the way home.',
        bullets: [
          'Arrive Elafonisi by 9:30am to beat the tour buses',
          'Walk 20–25 min south to Kedrodasos — no facilities, bring water and shade',
          'Late lunch in Elos under the plane trees on the drive back',
        ],
        drives: [
          { from: 'Chania', to: 'Elafonisi', time: '1 h 45 – 2 h', distance: '75 km', note: 'Narrow, winding final 30 km — slower than the map says.' },
          { from: 'Elafonisi', to: 'Kedrodasos', time: '20–25 min walk', distance: '1.5 km', note: 'Or 10 min drive to the dirt track + short walk.' },
          { from: 'Elafonisi', to: 'Elos', time: '35–45 min', distance: '28 km' },
          { from: 'Elos', to: 'Chania', time: '1 h 10', distance: '58 km' },
        ],
      },
      {
        id: 'sep-12',
        date: 'Fri Sept 12',
        title: 'Pick one',
        category: 'activity',
        summary: 'The one open day. Four bookable options — beach-boat, catamaran, countryside culture, or an art workshop.',
        options: [
          {
            id: 'countryside-4x4',
            label: 'Countryside 4x4 + cooking',
            category: 'activity',
            tagline: 'Villages, mountain viewpoints, hands-on Cretan cooking lesson and lunch.',
            duration: 'Full day, ~8–9 h',
            bullets: [
              'Guided 4x4 through inland villages and olive/vineyard country',
              'Cooking lesson + long lunch with the host family',
              'Hotel pickup — nobody has to drive the dirt roads',
            ],
            drives: [
              { from: 'Chania', to: 'Pickup point', time: '0–20 min', distance: '—', note: 'Hotel/area pickup included; no self-drive.' },
            ],
            link: { label: 'GetYourGuide — sightseeing + cooking lesson', url: 'https://www.getyourguide.com/crete-l404/crete-sightseeing-day-trip-with-cooking-lesson-and-lunch-t412361/' },
            availability: 'Plenty of dates available',
          },
          {
            id: 'balos-gramvousa',
            label: 'Balos + Gramvousa',
            category: 'water',
            tagline: 'Luxury catamaran from Kissamos to the lagoon and the pirate-fort island.',
            duration: 'Full day, ~8 h incl. drive',
            bullets: [
              'Catamaran instead of the crowded ferry — swim stops, less queueing',
              'Gramvousa fort climb (~20 min up) plus Balos lagoon time',
              'The single most photogenic day on the list',
            ],
            drives: [
              { from: 'Chania', to: 'Kissamos port', time: '40–50 min', distance: '42 km', note: 'Highway most of the way; be at the port ~45 min before departure.' },
              { from: 'Kissamos port', to: 'Chania', time: '40–50 min', distance: '42 km', note: 'Evening return.' },
            ],
            link: { label: 'Viator — Kissamos luxury catamaran to Balos & Gramvousa', url: 'https://www.viator.com/tours/Chania/Kissamos-Luxury-Catamaran-Cruise-to-Balos-and-Gramvousa/d4251-124964P35' },
          },
          {
            id: 'byzantine-art',
            label: 'Byzantine art class',
            category: 'history',
            tagline: 'Greek Byzantine art workshop in Rethymno with rooftop hospitality.',
            duration: 'Half day, ~3 h + drive',
            bullets: [
              'Small-group icon/Byzantine technique workshop — the only make-something day',
              'Pairs well with an afternoon in Rethymno old town and the Venetian fortress',
              'Lightest day of the trip, good recovery after Samaria',
            ],
            drives: [
              { from: 'Chania', to: 'Rethymno', time: '1 h', distance: '62 km', note: 'Straight shot on the E75 national road.' },
              { from: 'Rethymno', to: 'Chania', time: '1 h', distance: '62 km' },
            ],
            link: { label: 'GetYourGuide — Rethymno Greek Byzantine art workshop', url: 'https://www.getyourguide.com/rethymno-l1808/rethymno-greek-byzantine-art-workshop-rooftop-hospitality-t1330747/' },
            availability: 'Confirmed available on Sept 12',
          },
          {
            id: 'boat-snorkel',
            label: 'Boat + snorkel tour',
            category: 'water',
            tagline: 'Snorkeling and boat trip straight out of Chania.',
            duration: 'Half day, ~4–5 h',
            bullets: [
              'Departs from Chania — essentially zero driving',
              'Snorkel gear included; calm-water coves along the Akrotiri coast',
              'Leaves half the day free for the old town or the beach',
            ],
            drives: [
              { from: 'Naeva / Agioi Apostoli', to: 'Chania harbor', time: '10–15 min', distance: '6 km', note: 'Departure from the harbor — walkable if staying in town.' },
            ],
            link: { label: 'Viator — snorkeling and boat trip to Chania', url: 'https://www.viator.com/tours/Crete/Snorkeling-and-Boat-trip-to-Chania/d960-75191P2' },
          },
        ],
      },
      {
        id: 'sep-13',
        date: 'Sat Sept 13',
        title: 'Vamos, then onward',
        category: 'town',
        summary: 'Slow last morning in the restored stone village of Vamos before the flight to Athens.',
        bullets: [
          'Vamos village: stone lanes, local co-op shops, a long taverna lunch',
          'Optional add-on: Almyrida or Kalyves beach 15 min away',
          'Leave a 2 h buffer before the Chania (CHQ) flight',
        ],
        drives: [
          { from: 'Chania', to: 'Vamos', time: '30 min', distance: '25 km' },
          { from: 'Vamos', to: 'Chania airport (CHQ)', time: '30–35 min', distance: '28 km' },
        ],
      },
    ],
    tip: {
      title: 'How to read this',
      body: 'Sept 9, 10, 11 and 13 are the same in every version of the plan. Only Sept 12 changes — pick an option below and the summary at the top updates. Drive times are car estimates and assume September traffic, which is light outside Chania town.',
    },
  },
};

export function itineraryFor(trip) {
  if (!trip) return null;
  return trip.itinerary || itineraries[trip.id] || null;
}
