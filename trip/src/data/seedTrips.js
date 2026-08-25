// Seed trip data migrated from ../index.html without deleting the original.
// Data model notes for Step 2 AI fill-the-blanks:
// - trip: shareable row/object containing guide sections, phrase deck, day templates, and seed bookings.
// - place/card: guide item with paragraphs, bullets, links, and coordinates for Leaflet pins.
// - phrase: category-scoped flashcard with Greek text, pronunciation, and meaning.
// - booking: shared mutable row keyed by trip_id; Supabase stores the live list, localStorage mirrors it offline.

export const seedTrips = [
  {
    "id": "greece-crete-athens-2026",
    "name": "Greece Trip Guide",
    "title": "🇬🇷 Greece Trip Planning Guide",
    "subtitle": "Crete (Sept 9-13) & Athens (Sept 13-18) — Complete guide with things to do, restaurants, activities, Greek phrases & daily templates",
    "dates": "Crete (Sept 9-13) & Athens (Sept 13-18)",
    "nav": [
      {
        "label": "🏖️ Crete Things to Do",
        "href": "#crete-things"
      },
      {
        "label": "🚤 Water Activities",
        "href": "#crete-water"
      },
      {
        "label": "⛵ More Crete",
        "href": "#crete-activities"
      },
      {
        "label": "🏛️ Athens Things to Do",
        "href": "#athens-things"
      },
      {
        "label": "🗣️ Greek Phrases",
        "href": "#greek-phrases"
      },
      {
        "label": "🇬🇷 Local Day",
        "href": "#local-day"
      },
      {
        "label": "🏙️ Tourist Day",
        "href": "#tourist-day"
      }
    ],
    "guideSections": [
      {
        "id": "crete-things",
        "title": "🏖️ CRETE — Things to Do",
        "area": "crete",
        "groups": [
          {
            "id": "beaches-water",
            "title": "Beaches & Water",
            "cards": [
              {
                "id": "agioi-apostoli-beaches",
                "title": "Agioi Apostoli Beaches",
                "paragraphs": [
                  "Multiple sandy beaches within walking distance of Naeva. Local favorite, less crowded."
                ],
                "bullets": [
                  "Agioi Apostoli Beach",
                  "Chryssi Akti (Golden Beach)",
                  "Kalamaki Beach"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5136,
                  "lng": 23.9862
                }
              },
              {
                "id": "elafonissi-beach",
                "title": "Elafonissi Beach",
                "paragraphs": [
                  "Famous pink sand beach. 1.5 hour drive west from Chania. Must-see but touristy."
                ],
                "bullets": [
                  "Pink/gold sand",
                  "Lagoon swimming",
                  "Best before 10 AM"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.2717,
                  "lng": 23.5411
                }
              },
              {
                "id": "balos-lagoon",
                "title": "Balos Lagoon",
                "paragraphs": [
                  "Stunning turquoise lagoon with steep cliffs. West coast. 1.5 hours drive."
                ],
                "bullets": [
                  "Lagoon views",
                  "Hiking to cliffs",
                  "Less crowded mornings"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.583,
                  "lng": 23.588
                }
              },
              {
                "id": "falassarna-beach",
                "title": "Falassarna Beach",
                "paragraphs": [
                  "Pink sand, closer than Elafonissi, easier access. Local spot with restaurants."
                ],
                "bullets": [
                  "Pink sand patches",
                  "Beach bars/tavernas",
                  "1 hour drive"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.4924,
                  "lng": 23.5796
                }
              }
            ]
          },
          {
            "id": "hiking-nature",
            "title": "Hiking & Nature",
            "cards": [
              {
                "id": "samaria-gorge",
                "title": "Samaria Gorge",
                "paragraphs": [
                  "Europe's longest canyon. 16km downhill hike, 6-8 hours. Book shuttle in advance."
                ],
                "bullets": [
                  "Full day commitment",
                  "Very rewarding",
                  "Early start required"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.3077,
                  "lng": 23.918
                }
              },
              {
                "id": "imbros-gorge",
                "title": "Imbros Gorge",
                "paragraphs": [
                  "Easier alternative to Samaria. 4-5 hour hike, scenic, less crowded."
                ],
                "bullets": [
                  "Half-day option",
                  "River walk",
                  "Less extreme"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.2413,
                  "lng": 24.169
                }
              },
              {
                "id": "elos-village-hiking",
                "title": "Elos Village & Hiking",
                "paragraphs": [
                  "White Mountains village. Short hiking trails, chestnut-based food, rural vibes."
                ],
                "bullets": [
                  "Drive 40-50 min",
                  "Local tavernas",
                  "Easy walks"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.3618,
                  "lng": 23.633
                }
              },
              {
                "id": "botanical-garden",
                "title": "Botanical Garden",
                "paragraphs": [
                  "Near Chania, on Samaria route. Relaxing afternoon if you skip the gorge hike."
                ],
                "bullets": [
                  "Easy walk",
                  "Mountain views",
                  "Cafe on-site"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.4027,
                  "lng": 23.9352
                }
              }
            ]
          },
          {
            "id": "towns-markets",
            "title": "Towns & Markets",
            "cards": [
              {
                "id": "chania-old-town",
                "title": "Chania Old Town",
                "paragraphs": [
                  "Venetian harbor, lighthouse, narrow streets, cafes, restaurants, museums."
                ],
                "bullets": [
                  "Nautical Museum",
                  "Lighthouse at sunset",
                  "Waterfront dining"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.517,
                  "lng": 24.0179
                }
              },
              {
                "id": "chania-municipal-market-agora",
                "title": "Chania Municipal Market (Agora)",
                "paragraphs": [
                  "Cross-shaped building. Wednesday & Saturday mornings. Produce, cheese, olives, herbs."
                ],
                "bullets": [
                  "Local vendors",
                  "Fresh seasonal food",
                  "Chat with farmers"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5129,
                  "lng": 24.0197
                }
              },
              {
                "id": "astrikas-village",
                "title": "Astrikas Village",
                "paragraphs": [
                  "Home to Biolea estate. Olive oil tour, traditional restaurant in olive grove."
                ],
                "bullets": [
                  "Working olive oil estate",
                  "Tasting room",
                  "Farm-to-table lunch"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.4829,
                  "lng": 23.7544
                }
              },
              {
                "id": "kaliviani-remote-villages",
                "title": "Kaliviani & Remote Villages",
                "paragraphs": [
                  "Small villages near Balos/Falassarna. Traditional tavernas, local food, quiet vibe."
                ],
                "bullets": [
                  "No tourists",
                  "Authentic food",
                  "Local stories"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5127,
                  "lng": 23.5993
                }
              },
              {
                "id": "nea-chora-waterfront",
                "title": "Nea Chora (Waterfront)",
                "paragraphs": [
                  "Seaside village vibe. Beach access, relaxed, good restaurants."
                ],
                "bullets": [
                  "Beach walks",
                  "Seafood tavernas",
                  "Sunset views"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5137,
                  "lng": 24.0073
                }
              }
            ]
          },
          {
            "id": "dining-experiences",
            "title": "Dining Experiences",
            "cards": [
              {
                "id": "fine-dining",
                "title": "Fine Dining",
                "paragraphs": [],
                "bullets": [
                  "Salis — Harbor quay, seafood, wine",
                  "To Maridaki — Creative Greek, maritime setting",
                  "Arismari — Modern & traditional, local produce",
                  "Pelagos — Boho chic, grilled salmon"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5136,
                  "lng": 24.018
                }
              },
              {
                "id": "traditional-tavernas",
                "title": "Traditional Tavernas",
                "paragraphs": [],
                "bullets": [
                  "Chrisostomos — Wood stove, lamb, moussaka, locals",
                  "Tamam — Turkish bath setting, atmospheric",
                  "Rousios — Agia Roumeli, post-Samaria lunch",
                  "Village tavernas — Order dakos, lamb tsigariasto, fresh greens"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5136,
                  "lng": 24.018
                }
              },
              {
                "id": "casual-local",
                "title": "Casual & Local",
                "paragraphs": [],
                "bullets": [
                  "Waterfront tavernas — Fresh fish, casual, people-watching",
                  "Bougatsa shop — Breakfast pastry, €2, local bakery",
                  "Harbourfront cafes — Coffee, meze, slow sitting",
                  "Village taverna — Where locals eat lunch, 1:30 PM"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5136,
                  "lng": 24.018
                }
              },
              {
                "id": "food-to-try",
                "title": "Food to Try",
                "paragraphs": [],
                "bullets": [
                  "Dakos — Barley rusk with tomato & olive oil",
                  "Lamb tsigariasto — Slow-cooked in clay pot",
                  "Mizithra cheese — Local Cretan cheese",
                  "Fresh fish — Whatever the boat brought in",
                  "Pastitsio — Lasagna-like dish"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5136,
                  "lng": 24.018
                }
              }
            ]
          },
          {
            "id": "crete-water",
            "title": "Water Activities & Tours",
            "cards": [
              {
                "id": "catamaran-day-trip",
                "title": "Catamaran Day Trip",
                "paragraphs": [
                  "Half-day or full-day catamaran tours along Crete's coast. Usually includes multiple stops."
                ],
                "bullets": [
                  "Balos Lagoon + Gramvoussa Island",
                  "Snorkeling stops included",
                  "Hotel pickup available",
                  "€40-60 per person (half-day)",
                  "Book through hotel or GetYourGuide"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.517,
                  "lng": 24.0179
                }
              },
              {
                "id": "snorkeling-excursions",
                "title": "Snorkeling Excursions",
                "paragraphs": [
                  "Guided snorkeling trips to secluded coves and reefs. Great marine life and clear water."
                ],
                "bullets": [
                  "Reef snorkeling tours",
                  "Sea turtle spotting (possible)",
                  "Equipment rental included",
                  "Morning or afternoon options",
                  "€35-55 per person"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5136,
                  "lng": 23.9862
                }
              },
              {
                "id": "boat-tours",
                "title": "Boat Tours",
                "paragraphs": [
                  "Private or group boat tours to beaches and islands not easily accessible by car."
                ],
                "bullets": [
                  "Gramvouska Islands (pirates + history)",
                  "Spinalonga Island (fortress ruins)",
                  "Mertis Beach (secluded)",
                  "Sunset cruises available",
                  "Full-day or half-day options"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.583,
                  "lng": 23.588
                }
              },
              {
                "id": "scuba-diving",
                "title": "Scuba Diving",
                "paragraphs": [
                  "Professional diving courses and guided dives for certified divers."
                ],
                "bullets": [
                  "PADI certification courses",
                  "Wreck diving sites",
                  "Cave diving (advanced)",
                  "Multiple dive centers in Chania",
                  "All equipment provided"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.517,
                  "lng": 24.0179
                }
              }
            ]
          },
          {
            "id": "crete-activities",
            "title": "Additional Crete Activities",
            "cards": [
              {
                "id": "cooking-classes",
                "title": "Cooking Classes",
                "paragraphs": [
                  "Learn traditional Cretan cooking from local chefs. Usually includes market visit + meal."
                ],
                "bullets": [
                  "Market tour included",
                  "3-4 hour classes",
                  "€60-80 per person",
                  "Lunch or dinner included",
                  "Small group sizes"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5122,
                  "lng": 24.019
                }
              },
              {
                "id": "olive-oil-tasting-tours",
                "title": "Olive Oil Tasting & Tours",
                "paragraphs": [
                  "Visit working olive oil estates (like Biolea). Learn production, taste oils, buy locally."
                ],
                "bullets": [
                  "Astrikas olive estates",
                  "Farm-to-table restaurants",
                  "Oil tasting + shopping",
                  "Usually half-day trips",
                  "€30-50 per person"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.4829,
                  "lng": 23.7544
                }
              },
              {
                "id": "jeep-4x4-safari-tours",
                "title": "Jeep/4x4 Safari Tours",
                "paragraphs": [
                  "Off-road adventure to remote villages, waterfalls, and mountain landscapes."
                ],
                "bullets": [
                  "Explore White Mountains",
                  "Visit hidden villages",
                  "Swimming holes + waterfalls",
                  "Full-day adventure",
                  "€60-80 per person"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.41,
                  "lng": 23.91
                }
              },
              {
                "id": "photography-tours",
                "title": "Photography Tours",
                "paragraphs": [
                  "Guided photography tours with local photographers. Sunrise/sunset shoots."
                ],
                "bullets": [
                  "Golden hour shoots",
                  "Local secrets & hidden spots",
                  "Small groups",
                  "Half-day or full-day",
                  "Equipment advice included"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.517,
                  "lng": 24.0179
                }
              },
              {
                "id": "yoga-wellness",
                "title": "Yoga & Wellness",
                "paragraphs": [
                  "Beach yoga, meditation, and wellness retreats. Many studios offer drop-in classes."
                ],
                "bullets": [
                  "Beachfront yoga studios",
                  "Sunset yoga sessions",
                  "Meditation classes",
                  "€15-25 per class",
                  "No experience needed"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5136,
                  "lng": 23.9862
                }
              },
              {
                "id": "horseback-riding",
                "title": "Horseback Riding",
                "paragraphs": [
                  "Ride through villages, along beaches, through olive groves. Multiple horse ranches nearby."
                ],
                "bullets": [
                  "Beach rides available",
                  "Mountain trails",
                  "Half-day or full-day",
                  "€50-80 per person",
                  "Beginner-friendly"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.5,
                  "lng": 23.9
                }
              },
              {
                "id": "windsurf-water-sports",
                "title": "Windsurf & Water Sports",
                "paragraphs": [
                  "Windsurfing, paddleboarding, kayaking at local beaches. Schools rent equipment."
                ],
                "bullets": [
                  "Balos Lagoon (calm water)",
                  "Lessons available",
                  "Equipment rental hourly",
                  "€30-50 per activity",
                  "Summer season best"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.583,
                  "lng": 23.588
                }
              },
              {
                "id": "rock-climbing-via-ferrata",
                "title": "Rock Climbing & Via Ferrata",
                "paragraphs": [
                  "Indoor gyms or outdoor rock climbing. Via ferrata (protected climbing routes) on mountains."
                ],
                "bullets": [
                  "Beginner-friendly routes",
                  "Mountain views",
                  "Full equipment provided",
                  "Half or full-day adventures",
                  "€60-100 per person"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.315,
                  "lng": 24.02
                }
              },
              {
                "id": "kritsa-village-lace-crafts",
                "title": "Kritsa Village — Lace & Crafts",
                "paragraphs": [
                  "Traditional hilltop village famous for handmade lace, weaving, and embroidery. Watch artisans at work."
                ],
                "bullets": [
                  "Watch lace-making demonstrations",
                  "Buy authentic Cretan lace (excellent gifts)",
                  "Beautiful mountain village views",
                  "Surrounded by olive trees",
                  "Easily accessible from Chania"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.1586,
                  "lng": 25.6433
                }
              },
              {
                "id": "minoan-palace-of-knossos",
                "title": "Minoan Palace of Knossos",
                "paragraphs": [
                  "Ancient 1,500-room palace from 7000 BC, central to Minoan civilization. Legendary home of King Minos & the Minotaur."
                ],
                "bullets": [
                  "Oldest palace in Europe",
                  "Throne Room is stunning",
                  "Near Heraklion (30 min from Chania)",
                  "Pair with Heraklion Archaeological Museum",
                  "Guided tours available"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.298,
                  "lng": 25.1631
                }
              },
              {
                "id": "spinalonga-island-history-boat-trip",
                "title": "Spinalonga Island — History & Boat Trip",
                "paragraphs": [
                  "Former leper colony island (closed 1957). Important but somber Cretan history. Accessible by boat from Elounda."
                ],
                "bullets": [
                  "Venetian fortress ruins",
                  "Moving historical significance",
                  "Boat tours from Elounda (30 min)",
                  "Half-day excursion",
                  "Educational & culturally important"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.2977,
                  "lng": 25.7386
                }
              },
              {
                "id": "raki-festivals-tasting",
                "title": "Raki Festivals & Tasting",
                "paragraphs": [
                  "Experience authentic Cretan raki (grappa-like spirit). Visit raki festivals, especially October onwards."
                ],
                "bullets": [
                  "Kazani Zargianaki raki festival",
                  "October-November peak season",
                  "Local tasting & celebrations",
                  "Learn about Cretan spirits",
                  "Authentic local experience"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.45,
                  "lng": 24.05
                }
              },
              {
                "id": "wine-tours-vineyard-tastings",
                "title": "Wine Tours & Vineyard Tastings",
                "paragraphs": [
                  "Crete has rich winemaking history. Visit renowned wineries for tastings & tours of vineyards."
                ],
                "bullets": [
                  "Manousakis — Organic, family-run",
                  "Lyrarakis — Rare grape varieties",
                  "Dourakis — Mountain village winery",
                  "Douloufakis — Local varieties",
                  "€15-30 per tasting + wine trail options"
                ],
                "links": [],
                "coordinates": {
                  "lat": 35.26,
                  "lng": 25.16
                }
              }
            ]
          }
        ]
      },
      {
        "id": "athens-things",
        "title": "🏛️ ATHENS — Things to Do",
        "area": "athens",
        "groups": [
          {
            "id": "historical-sites-museums",
            "title": "Historical Sites & Museums",
            "cards": [
              {
                "id": "acropolis-parthenon",
                "title": "Acropolis & Parthenon",
                "paragraphs": [
                  "The main site. Arrive early (before 10 AM). Visible from Kerameikos area."
                ],
                "bullets": [
                  "Parthenon (temple)",
                  "Erechtheion",
                  "Propylaea gates",
                  "Best at sunrise/sunset"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9715,
                  "lng": 23.7267
                }
              },
              {
                "id": "acropolis-museum",
                "title": "Acropolis Museum",
                "paragraphs": [
                  "Modern museum, 3 levels. Amazing views. Glass floor shows archaeological site below."
                ],
                "bullets": [
                  "Sculptures & artifacts",
                  "Rooftop cafe views",
                  "Top-notch modern design"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9684,
                  "lng": 23.7285
                }
              },
              {
                "id": "ancient-agora",
                "title": "Ancient Agora",
                "paragraphs": [
                  "Ruins, Temple of Hephaestus. Walk through, imagine ancient marketplace."
                ],
                "bullets": [
                  "Temple of Hephaestus",
                  "Stoa of Attalos",
                  "Quieter than Acropolis"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.975,
                  "lng": 23.7225
                }
              },
              {
                "id": "roman-agora-tower-of-winds",
                "title": "Roman Agora & Tower of Winds",
                "paragraphs": [
                  "Smaller ruins, atmospheric. Near Monastiraki."
                ],
                "bullets": [
                  "Tower of the Winds",
                  "Gate of Athena",
                  "Easy walk"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9743,
                  "lng": 23.726
                }
              },
              {
                "id": "panathenaic-stadium",
                "title": "Panathenaic Stadium",
                "paragraphs": [
                  "Site of first modern Olympics (1896). Walk the track, museum inside."
                ],
                "bullets": [
                  "Original marble stadium",
                  "Olympic history",
                  "Good views of city"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9683,
                  "lng": 23.7411
                }
              },
              {
                "id": "national-museum",
                "title": "National Museum",
                "paragraphs": [
                  "Egyptian antiquities, sculptures, art. Larger collection."
                ],
                "bullets": [
                  "Cycladic art",
                  "Greek sculptures",
                  "Extensive collection"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.989,
                  "lng": 23.7328
                }
              }
            ]
          },
          {
            "id": "neighborhoods-to-explore",
            "title": "Neighborhoods to Explore",
            "cards": [
              {
                "id": "athens-neighborhood-walking-tour-guide",
                "title": "📍 Athens Neighborhood Walking Tour Guide",
                "paragraphs": [
                  "Discover Greece's Self-Guided Neighborhood Tours — A comprehensive guide to downtown Athens exploring three vibrant neighborhoods with specific restaurants, bars, shops, and local tips.",
                  "→ Read the Full Neighborhood Guide",
                  "🚶 Evripidou St & Surrounds: Spice stores, Varvakios Market (since 1886), Theatrou Square, traditional tavernas",
                  "🎨 Psirri: Hip cool district with Iroon Square, street art, vintage shops, meze restaurants, bars, Little Kook cafe",
                  "🏢 Commercial Triangle: Agia Irini Square, Vissis St, trendy shops, concept stores, upscale dining, Karitsi Square nightlife",
                  "🌟 Bonus: Omonia Square — Athens' oldest square, currently being revived as the next hotspot"
                ],
                "bullets": [],
                "links": [
                  {
                    "label": "→ Read the Full Neighborhood Guide",
                    "href": "https://www.discovergreece.com/travel-ideas/cover-story/neighbourhood-tour-athens"
                  }
                ],
                "coordinates": {
                  "lat": 37.9788,
                  "lng": 23.726
                }
              }
            ]
          },
          {
            "id": "more-athens-neighborhoods",
            "title": "More Athens Neighborhoods",
            "cards": [
              {
                "id": "kerameikos",
                "title": "Kerameikos",
                "paragraphs": [
                  "Your neighborhood! Artistic hub, museums, galleries, young vibe, nightlife."
                ],
                "bullets": [
                  "Benaki Museum of Islamic Art",
                  "Museum of Contemporary Art",
                  "Street art & galleries",
                  "Trendy restaurants/bars"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9785,
                  "lng": 23.7117
                }
              },
              {
                "id": "psirri",
                "title": "Psirri",
                "paragraphs": [
                  "Artistic, bohemian. Street art, galleries, trendy cafes, young professionals."
                ],
                "bullets": [
                  "Art galleries",
                  "Street art murals",
                  "Cafe hopping",
                  "Nightlife"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9776,
                  "lng": 23.7243
                }
              },
              {
                "id": "monastiraki",
                "title": "Monastiraki",
                "paragraphs": [
                  "Historic, bohemian. Street art, live music, cafes, authentic tavernas."
                ],
                "bullets": [
                  "Monastiraki Square",
                  "Flea market",
                  "Live music venues",
                  "Historic charm"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.976,
                  "lng": 23.7256
                }
              },
              {
                "id": "plaka",
                "title": "Plaka",
                "paragraphs": [
                  "Old town charm. Narrow streets, tavernas, tourist-friendly but pretty."
                ],
                "bullets": [
                  "Historic streets",
                  "Restaurants everywhere",
                  "Watch Acropolis light up at night"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.972,
                  "lng": 23.73
                }
              },
              {
                "id": "koukaki",
                "title": "Koukaki",
                "paragraphs": [
                  "Residential, local vibe. Good cafes, less touristy, real Athens feel."
                ],
                "bullets": [
                  "Local shops",
                  "Neighborhood cafes",
                  "Residential streets"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9633,
                  "lng": 23.7239
                }
              }
            ]
          },
          {
            "id": "dining-experiences",
            "title": "Dining Experiences",
            "cards": [
              {
                "id": "fine-dining-dress-up",
                "title": "Fine Dining (Dress Up!)",
                "paragraphs": [],
                "bullets": [
                  "CTC Urban Gastronomy — Michelin-star, Kerameikos",
                  "MAKRIS — Michelin-star, Thissio, ancient artifacts visible",
                  "Manu — Seafood, Greek-Asian fusion, stylish",
                  "Hill Athens — Rooftop, Acropolis views"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9755,
                  "lng": 23.7248
                }
              },
              {
                "id": "brunch-casual",
                "title": "Brunch & Casual",
                "paragraphs": [],
                "bullets": [
                  "Beauty Killed the Beast — Kerameikos, fusion",
                  "Mama Roux — Brunch, scrambled eggs, pancakes",
                  "Ginger Concept — All-day cafe, Old Town",
                  "Nudie Foodie — Healthy, veggie/vegan"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9755,
                  "lng": 23.7248
                }
              },
              {
                "id": "traditional-tavernas",
                "title": "Traditional & Tavernas",
                "paragraphs": [],
                "bullets": [
                  "Voliotiko — Psiri, meze in courtyard, live music",
                  "Elvis — Kerameikos, 4 skewers, locals",
                  "Avli — Psiri, traditional Greek vibes",
                  "Diporto — Omonoia, oldest taverna in Athens"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9755,
                  "lng": 23.7248
                }
              },
              {
                "id": "casual-street-food",
                "title": "Casual & Street Food",
                "paragraphs": [],
                "bullets": [
                  "Souvlaki stands — Kostas or Lefteris o Politis (since 1951)",
                  "Local kaffe — Morning coffee rituals",
                  "Bougatsa shops — €2 pastry breakfast",
                  "Waterfront meze — Ouzo + small plates at sunset"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.9755,
                  "lng": 23.7248
                }
              }
            ]
          },
          {
            "id": "day-trip-option",
            "title": "Day Trip Option",
            "cards": [
              {
                "id": "aegina-island",
                "title": "Aegina Island",
                "paragraphs": [
                  "Ferry from Piraeus (30 min). Explore island temples, beaches, local pistachios. Return same day."
                ],
                "bullets": [
                  "Ferry port: Piraeus (20 min from Kerameikos)",
                  "Temple of Aphaia",
                  "Local pistachio shops",
                  "Beach + seafood lunch"
                ],
                "links": [],
                "coordinates": {
                  "lat": 37.7467,
                  "lng": 23.4275
                }
              }
            ]
          }
        ]
      },
      {
        "id": "greek-phrases",
        "title": "🗣️ Essential Greek Phrases & Pronunciations",
        "area": "general",
        "groups": []
      },
      {
        "id": "daily-schedule-templates",
        "title": "📅 Daily Schedule Templates",
        "area": "general",
        "groups": [
          {
            "id": "local-day",
            "title": "SAMPLE: A \"LIVING LIKE A LOCAL\" DAY",
            "cards": []
          },
          {
            "id": "tourist-day",
            "title": "SAMPLE: A \"TOURIST\" DAY",
            "cards": []
          }
        ]
      }
    ],
    "phraseDeck": {
      "title": "🗣️ Essential Greek Phrases & Pronunciations",
      "categories": [
        {
          "id": "greetings-basics",
          "title": "Greetings & Basics",
          "items": [
            {
              "id": "greetings-basics-kalispera",
              "greek": "Kalispéra",
              "pronunciation": "kah-lee-SPARE-ah",
              "meaning": "Good evening (say when entering any shop/cafe)"
            },
            {
              "id": "greetings-basics-kalimera",
              "greek": "Kalimera",
              "pronunciation": "kah-lee-MARE-ah",
              "meaning": "Good morning"
            },
            {
              "id": "greetings-basics-adio",
              "greek": "Adio",
              "pronunciation": "ah-DEE-oh",
              "meaning": "Goodbye"
            },
            {
              "id": "greetings-basics-efharisto",
              "greek": "Efharisto",
              "pronunciation": "ef-hah-ree-STOH",
              "meaning": "Thank you"
            },
            {
              "id": "greetings-basics-parakalo",
              "greek": "Parakaló",
              "pronunciation": "pah-rah-kah-LOH",
              "meaning": "Please"
            },
            {
              "id": "greetings-basics-ne",
              "greek": "Ne",
              "pronunciation": "neh",
              "meaning": "Yes"
            },
            {
              "id": "greetings-basics-ohi",
              "greek": "Óhi",
              "pronunciation": "OH-hee",
              "meaning": "No"
            }
          ]
        },
        {
          "id": "dining-food",
          "title": "Dining & Food",
          "items": [
            {
              "id": "dining-food-ti-echi-kali-simera",
              "greek": "Ti echi kali simera?",
              "pronunciation": "tee EH-hee kah-LEE see-MARE-ah",
              "meaning": "What's good today?"
            },
            {
              "id": "dining-food-horta",
              "greek": "Horta",
              "pronunciation": "HOR-tah",
              "meaning": "Vegetables"
            },
            {
              "id": "dining-food-psari",
              "greek": "Psári",
              "pronunciation": "psah-REE",
              "meaning": "Fish"
            },
            {
              "id": "dining-food-kreas",
              "greek": "Kréas",
              "pronunciation": "KREH-ahs",
              "meaning": "Meat"
            },
            {
              "id": "dining-food-to-logariasmo-parakalo",
              "greek": "To logariásmó, parakaló",
              "pronunciation": "toh loh-gah-ree-AHS-moh",
              "meaning": "The check, please"
            },
            {
              "id": "dining-food-nero",
              "greek": "Neró",
              "pronunciation": "neh-ROH",
              "meaning": "Water"
            },
            {
              "id": "dining-food-krasi",
              "greek": "Krasi",
              "pronunciation": "KRAH-see",
              "meaning": "Wine"
            }
          ]
        },
        {
          "id": "shopping-markets",
          "title": "Shopping & Markets",
          "items": [
            {
              "id": "shopping-markets-posso-kanei",
              "greek": "Pósso kanei?",
              "pronunciation": "POH-soh kah-NEE",
              "meaning": "How much?"
            },
            {
              "id": "shopping-markets-ligo-ligo",
              "greek": "Lígo lígo",
              "pronunciation": "LEE-goh LEE-goh",
              "meaning": "A little bit"
            },
            {
              "id": "shopping-markets-fresco",
              "greek": "Frésco",
              "pronunciation": "FRES-koh",
              "meaning": "Fresh"
            }
          ]
        },
        {
          "id": "useful-phrases",
          "title": "Useful Phrases",
          "items": [
            {
              "id": "useful-phrases-kala",
              "greek": "Kalá",
              "pronunciation": "kah-LAH",
              "meaning": "Good"
            },
            {
              "id": "useful-phrases-stin-iyia-sas",
              "greek": "Stin iyía sas",
              "pronunciation": "stin ee-YEE-ah sahs",
              "meaning": "Cheers!"
            },
            {
              "id": "useful-phrases-milate-anglika",
              "greek": "Milate anglika?",
              "pronunciation": "mee-LAH-teh ahn-GLEE-kah",
              "meaning": "Do you speak English?"
            },
            {
              "id": "useful-phrases-pou-ine-to",
              "greek": "Pou ine to...?",
              "pronunciation": "poo EE-neh toh",
              "meaning": "Where is...?"
            }
          ]
        }
      ],
      "tip": {
        "title": "💡 Using These Phrases",
        "body": "Greeks LOVE when tourists try to speak Greek, even if just a few words. Don't worry about perfect pronunciation — saying \"Kalispéra\" when entering a shop makes a huge difference. Locals will appreciate the effort and often switch to English if needed. Use these phrases to connect, not to be fluent!"
      }
    },
    "dayTemplates": {
      "title": "📅 Daily Schedule Templates",
      "templates": [
        {
          "id": "local-day",
          "title": "SAMPLE: A \"LIVING LIKE A LOCAL\" DAY",
          "header": "🇬🇷 Local Day (How Greeks Actually Live)",
          "slots": [
            {
              "time": "7:00–8:00 AM",
              "activity": "Wake up slowly. Have coffee (freddo espresso or frappe) at home or go to a local kaffe.",
              "detail": ""
            },
            {
              "time": "8:00–9:30 AM",
              "activity": "Market time. Visit the weekly laiki agora or neighborhood bakery/cheese shop. Buy fresh produce, bread, cheese. Chat with vendors. Greet shopkeepers.",
              "detail": "This is how Greeks actually shop. Support local. Know the farmer."
            },
            {
              "time": "9:30 AM–1:00 PM",
              "activity": "Explore neighborhood slowly. Cafe-hop. Sit at a local kaffe for 1-2 hours. People-watch. No destination. Maybe visit a museum or walk historic streets at your own pace.",
              "detail": ""
            },
            {
              "time": "1:30–3:30 PM",
              "activity": "LUNCH — The main meal of the day. Go to a local taverna where Greeks eat (not tourists). Order what locals order. Sit for 1-2 hours. Take your time.",
              "detail": "Ask server: \"Ti echi kali simera?\" (What's good today?). Try dakos, lamb, fresh fish, horta."
            },
            {
              "time": "3:30–7:00 PM",
              "activity": "SIESTA TIME. This isn't laziness — rest, nap, read, swim. Many shops close 2-6 PM. Embrace the pace. Don't feel bad about slow time.",
              "detail": ""
            },
            {
              "time": "7:00–8:30 PM",
              "activity": "APERITIVO. Go to a waterfront spot or neighborhood cafe. Order ouzo/wine + meze. Sit outside. Watch sunset. No rush.",
              "detail": ""
            },
            {
              "time": "8:30–9:30 PM",
              "activity": "VOLTA (evening walk). Slow walk through town with no destination. See & be seen. This is Greek social time. Chat with locals. Stop at a gelato shop.",
              "detail": ""
            },
            {
              "time": "9:30 PM–11:30 PM+",
              "activity": "DINNER. Never before 9 PM. Sit for 2+ hours. Order local wine. Meze or full meal. Arrive late (8-9 PM for better atmosphere). Restaurants are lively after 9 PM.",
              "detail": "Try retsina, local wine. Ask for recommendations. Eat slowly. Enjoy the company."
            },
            {
              "time": "Late night",
              "activity": "After dinner, Greeks might go for a nightcap, dessert, or just walk more. You'll be tired — return to your place.",
              "detail": ""
            }
          ]
        },
        {
          "id": "tourist-day",
          "title": "SAMPLE: A \"TOURIST\" DAY",
          "header": "🏙️ Tourist Day (Classic Sightseeing)",
          "slots": [
            {
              "time": "6:30–7:30 AM",
              "activity": "Early wake-up. Quick coffee/breakfast at your hotel or a chain cafe. Fast-moving energy.",
              "detail": ""
            },
            {
              "time": "7:30–10:30 AM",
              "activity": "Major historical site (Acropolis, Samaria Gorge, museums). Arrive early to beat crowds. Moving from place to place. Taking photos.",
              "detail": ""
            },
            {
              "time": "10:30 AM–12:30 PM",
              "activity": "Continue touring. Another museum or site. Checking off a list. Maybe a guided tour.",
              "detail": ""
            },
            {
              "time": "12:30–1:30 PM",
              "activity": "LUNCH — Quick tourist meal. Touristy restaurant with English menus. Eat fast. Prepared food, not fresh that morning.",
              "detail": ""
            },
            {
              "time": "1:30–4:00 PM",
              "activity": "Tour more sites. Museum time. Beach time. Shopping. Staying busy. Checking boxes on an itinerary.",
              "detail": ""
            },
            {
              "time": "4:00–5:30 PM",
              "activity": "Break for gelato or coffee at a chain cafe. Phone time. Recharge. Maybe rest at hotel.",
              "detail": ""
            },
            {
              "time": "5:30–7:00 PM",
              "activity": "Rooftop bar for sunset. Photos for Instagram. Tourist-heavy spot. Designer drinks.",
              "detail": ""
            },
            {
              "time": "7:00–8:30 PM",
              "activity": "DINNER — Early (7-8 PM). Tourist restaurant in Plaka or Old Town. English menus everywhere. Food tailored for visitors.",
              "detail": ""
            },
            {
              "time": "8:30 PM–late",
              "activity": "Nightclub or tourist bar. Or return to hotel to rest. The day is \"done.\"",
              "detail": ""
            }
          ]
        }
      ],
      "tip": {
        "title": "💡 The Key Difference",
        "body": "Tourist days = checking boxes, rushing, seeing lots, experiencing little. Local days = slow pace, deep connections, fewer \"sights\" but richer experience. Mix both! But aim for more local days than tourist days. You're in Greece — live the rhythm, not just see the sites."
      }
    },
    "bookings": [
      {
        "id": "1",
        "name": "🏨 Athens Accommodation",
        "checkin": "Sun, Sep 13 at 3:00 PM",
        "checkout": "Thu, Sep 17 at 11:00 AM",
        "confirmation": "",
        "phone": "+30 694 3639427",
        "address": "Nauárxou Apostóli 22"
      },
      {
        "id": "2",
        "name": "🏖️ Crete Accommodation",
        "checkin": "Mon, Sep 9",
        "checkout": "Fri, Sep 13",
        "confirmation": "",
        "phone": "",
        "address": ""
      },
      {
        "id": "3",
        "name": "🚗 Car Rental - Crete",
        "checkin": "Mon, Sep 9",
        "checkout": "Fri, Sep 13",
        "confirmation": "",
        "phone": "",
        "address": ""
      }
    ]
  }
];

export const defaultTripId = 'greece-crete-athens-2026';
