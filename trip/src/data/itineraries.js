// Proposed day-by-day itineraries, keyed by trip id.
// A trip splits into legs (Crete, Athens); each leg is a list of days.
// A day is fixed unless it carries `options`, the interchangeable variants
// still to be picked between (Sept 12 in Crete, Sept 16 in Athens).
// Crete travel times are car estimates from the Chania base; Athens times are
// walking or metro unless the note says otherwise.

export const itineraries = {
  'greece-crete-athens-2026': {
    title: 'Proposed Itinerary',
    subtitle: 'Crete Sept 9–13, Athens Sept 13–17. Every day is settled except two: Sept 12 in Crete and Sept 16 in Athens.',
    legs: [
      {
        id: 'crete',
        label: 'Crete',
        title: 'Crete — Sept 9–13',
        base: 'Base: Chania (Agioi Apostoli / Naeva)',
        note: 'Same plan every day except Sept 12, where we pick one of four options.',
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
      },
      {
        id: 'athens',
        label: 'Athens',
        title: 'Athens — Sept 13–17',
        base: 'Base: central Athens (Monastiraki / Plaka side)',
        note: 'One main thing each morning, then the rest of the day stays deliberately loose. Roughly half of the waking hours are unscheduled on purpose.',
        days: [
          {
            id: 'ath-sep-13',
            date: 'Sat Sept 13',
            title: 'Arrival + first taste of Athens',
            category: 'town',
            pace: 'Very easy',
            paceTone: 'easy',
            summary: 'Fly in from Crete, check in, and do nothing more demanding than walking around Monastiraki and Psyrri.',
            blocks: [
              {
                label: 'Morning / early afternoon',
                items: ['Fly CHQ → ATH, get to the hotel, check in, settle'],
              },
              {
                label: 'Late afternoon / evening — open',
                items: [
                  'Monastiraki → Avissinia Square → Psyrri on foot',
                  'Look through the shops, get lost in the side streets, sit outside somewhere',
                  'Meze dinner, a drink, people-watching. No sightseeing obligation.',
                ],
              },
            ],
            travelTitle: 'Getting around',
            drives: [
              { from: 'Athens airport (ATH)', to: 'Central Athens', time: '40 min metro / 35–50 min taxi', distance: '33 km', note: 'Metro Line 3 runs straight to Monastiraki and Syntagma.' },
              { from: 'Hotel', to: 'Monastiraki + Psyrri', time: 'Walkable', distance: '—' },
            ],
          },
          {
            id: 'ath-sep-14',
            date: 'Sun Sept 14',
            title: 'Acropolis + mythology',
            category: 'history',
            pace: 'Moderate',
            paceTone: 'moderate',
            summary: 'The one unmissable morning. Acropolis at opening, museum after, then the whole afternoon is yours.',
            blocks: [
              {
                label: 'Morning / early afternoon',
                items: [
                  'Acropolis at opening — Parthenon, Erechtheion / Caryatids, Temple of Athena Nike',
                  'Theatre of Dionysus on the way down',
                  'Acropolis Museum, then lunch nearby',
                ],
              },
              {
                label: 'After ~2–3 pm — open',
                items: [
                  'Anafiotika: tiny whitewashed lanes right under the Acropolis',
                  'Plaka for the historic streets, Koukaki for the neighborhood cafés',
                  'Optional Philopappos Hill at sunset',
                  'If a café is good, stay in it an hour instead — that counts as the plan',
                ],
              },
            ],
            travelTitle: 'Getting around',
            drives: [
              { from: 'Plaka / Monastiraki', to: 'Acropolis entrance', time: '10–15 min walk', distance: '1 km', note: 'Or metro to Akropoli. Go at opening — the heat and the crowds both build fast.' },
              { from: 'Acropolis', to: 'Acropolis Museum', time: '5 min walk', distance: '300 m' },
            ],
          },
          {
            id: 'ath-sep-15',
            date: 'Mon Sept 15',
            title: 'Markets + ancient Athens',
            category: 'town',
            pace: 'Moderate',
            paceTone: 'moderate',
            summary: 'Varvakios market and the flea-market lanes, then the Ancient Agora. Afternoon open again.',
            blocks: [
              {
                label: 'Morning / early afternoon',
                items: [
                  'Varvakios Central Market, then wander Athinas and Evripidou streets',
                  'Monastiraki flea-market lanes',
                  'Ancient Agora: Temple of Hephaestus, Stoa of Attalos, Agora Museum',
                  'Lunch afterward',
                ],
              },
              {
                label: 'Afternoon / evening — open',
                items: [
                  'Thissio → Psyrri wander, shopping, coffee',
                  'Or go back to the hotel and nap. A good day to do nothing productive.',
                ],
              },
            ],
            travelTitle: 'Getting around',
            drives: [
              { from: 'Monastiraki', to: 'Varvakios Market', time: '10 min walk', distance: '700 m' },
              { from: 'Varvakios Market', to: 'Ancient Agora', time: '12 min walk', distance: '900 m', note: 'All of this day is walkable — no transport needed.' },
            ],
          },
          {
            id: 'ath-sep-16',
            date: 'Tue Sept 16',
            title: 'Pick one',
            category: 'activity',
            pace: 'Full day',
            paceTone: 'full',
            summary: 'The Athens decision day: the big mythology site, or another easy island day. Either way, dinner back in Athens is the only evening plan.',
            lean: 'Current lean — Delphi 55% / Aegina 45%. Delphi adds variety since Crete already gave us beaches and island life. If travel fatigue has set in by Sept 15, switch to Aegina without guilt.',
            options: [
              {
                id: 'delphi',
                label: 'Delphi',
                category: 'history',
                tagline: 'The mythology and ancient-religion day, in dramatic mountain scenery.',
                duration: 'Full day, ~10–12 h',
                bullets: [
                  'Sanctuary of Apollo, the Oracle / Pythia site, the Temple, the theatre and stadium',
                  'Delphi Archaeological Museum, then lunch in Delphi village',
                  'The most sightseeing-heavy day of the trip — and the most different from Crete',
                  'Doable self-drive, by KTEL bus, or as an organized day tour',
                ],
                drives: [
                  { from: 'Athens', to: 'Delphi', time: '2 h 30 – 3 h', distance: '180 km', note: 'Bus is ~3 h each way; a guided coach tour handles the timing for you.' },
                  { from: 'Delphi', to: 'Athens', time: '2 h 30 – 3 h', distance: '180 km', note: 'Back in Athens early evening — keep dinner easy and close.' },
                ],
                bestFor: 'Mythology, ancient Greek religion, mountain scenery, maximum contrast with Crete.',
              },
              {
                id: 'aegina',
                label: 'Aegina',
                category: 'water',
                tagline: 'Another beautiful, low-effort vacation day — one ferry, no itinerary.',
                duration: 'Full day, ~8 h, most of it optional',
                bullets: [
                  'Aegina Town: coffee, pistachios, the waterfront, a long lunch',
                  'Optional Temple of Aphaia, optional swim — neither is required',
                  'No need to tour the island; half the day can be eating, walking and sitting by the water',
                ],
                drives: [
                  { from: 'Central Athens', to: 'Piraeus port', time: '25–30 min metro', distance: '11 km', note: 'Metro Line 1 to Piraeus, then walk to the gate.' },
                  { from: 'Piraeus', to: 'Aegina Town', time: '40 min fast ferry / 1 h 10 conventional', distance: 'ferry', note: 'Frequent sailings; check the last return boat before settling into lunch.' },
                ],
                bestFor: 'Relaxation, cafés, island atmosphere, spontaneous wandering, low mental effort.',
              },
            ],
          },
          {
            id: 'ath-sep-17',
            date: 'Wed Sept 17',
            title: 'Lazy final day in Pangrati',
            category: 'dining',
            pace: 'Very easy',
            paceTone: 'easy',
            summary: 'Protected on purpose: no leftover sightseeing, just one neighborhood, slowly, then the flight.',
            blocks: [
              {
                label: 'Morning / early afternoon',
                items: [
                  'Sleep in, then head to Pangrati',
                  '10:00 breakfast / coffee, wander Archelaou and Platia Proskopon',
                  'Second coffee somewhere else, wander toward Varnava Square',
                  '13:00–14:00 long lunch',
                  'Panathenaic Stadium is nearby if energy allows — strictly optional',
                ],
              },
              {
                label: 'Afternoon — the exit',
                items: [
                  '14:30–15:30 final café. Sit for an hour: journal, people-watch, go through the photos.',
                  '15:30–16:00 back to the hotel for the bags',
                  '16:15–16:30 leave central Athens for the airport',
                  '19:00 flight',
                ],
              },
            ],
            travelTitle: 'Getting around',
            drives: [
              { from: 'Central Athens', to: 'Pangrati', time: '20–25 min walk / 10 min taxi', distance: '2 km' },
              { from: 'Central Athens', to: 'Athens airport (ATH)', time: '40 min metro / 35–50 min taxi', distance: '33 km', note: 'Leaving by 16:30 gives roughly a 2 h buffer for the 19:00 flight.' },
            ],
          },
        ],
        pool: {
          title: 'Classes & workshops to consider',
          note: 'None of these are scheduled. Each is a half-day at most, so any one of them can drop into an open Athens afternoon — most naturally Sept 14 or Sept 15.',
          items: [
            { label: 'Greek silk scarf — make your own', url: 'https://www.getyourguide.com/athens-l91/create-your-own-greek-silk-scarf-souvenirs-t641247/', note: 'Take-home souvenir you actually made.' },
            { label: 'Be an ancient sculptor', url: 'https://www.getyourguide.com/athens-l91/athens-be-an-ancient-sculptor-craft-your-greek-masterpiece-t970755/', note: 'Pairs thematically with the Acropolis day.' },
            { label: 'Handmade leather sandals workshop', url: 'https://www.getyourguide.com/athens-l91/athens-greece-handmade-leather-sandals-making-workshop-t657795/', note: 'Very Athens; walk out wearing them.' },
            { label: 'Cooking class + rooftop skyline dinner', url: 'https://www.getyourguide.com/athens-l91/athens-cooking-class-with-athens-skyline-roof-top-dinner-t196157/', note: 'Evening slot — would replace a dinner, not an afternoon.' },
            { label: 'Jewelry design — handcraft your story', url: 'https://www.getyourguide.com/chalandri-greece-l256703/athens-handcraft-your-story-on-your-own-jewelry-design-t1334907/', note: 'In Chalandri, ~30 min out of the centre.' },
            { label: 'Outdoor painting in central Athens', url: 'https://www.getyourguide.com/athens-l91/painting-athens-learn-to-paint-outdoors-in-central-athens-t1396818/', note: 'Slow and sit-down — fits the loose-afternoon rule best.' },
            { label: 'Kitesurfing lesson with a certified instructor', url: 'https://www.getyourguide.com/athens-l91/athens-kitesurfing-lessons-with-certified-instructor-t1373875/', note: 'Coast outside the city — this one eats a whole day.' },
          ],
        },
      },
    ],
    tip: {
      title: 'How to read this',
      body: 'Every day is settled except two. Sept 12 in Crete has four options and Sept 16 in Athens has two — pick one on each and the route strip at the top updates. Crete times are car estimates; Athens times are walking or metro unless noted. In Athens the morning holds the one fixed activity and the rest of the day is deliberately left open.',
    },
  },
};

export function itineraryFor(trip) {
  if (!trip) return null;
  return trip.itinerary || itineraries[trip.id] || null;
}
