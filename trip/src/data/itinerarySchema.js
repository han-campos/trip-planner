// The itinerary schema is the authoring interface: it is what you paste into a
// chat assistant so the plan comes back structured instead of as prose, and what
// the importer validates against. Keep the prompt and the normalizer in sync.

export const itinerarySchemaPrompt = `You are turning a trip plan into JSON for a trip-planning app.

Return ONLY a JSON object — no markdown fence, no commentary. Shape:

{
  "title": "Proposed Itinerary",
  "subtitle": "One line covering the dates and what is still undecided.",
  "legs": [
    {
      "id": "crete",
      "label": "Crete",
      "title": "Crete — Sept 9–13",
      "base": "Base: where we sleep",
      "note": "Optional. The rhythm of this leg, or what is still open.",
      "days": [
        {
          "id": "sep-9",
          "date": "Tue Sept 9",
          "title": "Short name for the day",
          "category": "town",
          "pace": "Very easy",
          "paceTone": "easy",
          "summary": "One or two sentences on what this day is.",
          "blocks": [
            { "label": "Morning / early afternoon", "items": ["Specific thing", "Another"] },
            { "label": "Afternoon / evening — open", "items": ["Loose idea", "Another"] }
          ],
          "bullets": ["Use INSTEAD of blocks when the day is not split into parts."],
          "travelTitle": "Driving",
          "drives": [
            { "from": "A", "to": "B", "time": "45 min", "distance": "42 km", "note": "Optional caveat." }
          ],
          "notes": ["Anything that does not fit a field above. Never drop a detail — put it here."]
        }
      ],
      "pool": {
        "title": "Classes & workshops to consider",
        "note": "Why these are unscheduled.",
        "items": [{ "label": "Name", "url": "https://…", "note": "One line of orientation." }]
      }
    }
  ],
  "tip": { "title": "How to read this", "body": "Any closing guidance." }
}

A day the group must still choose between options replaces "blocks"/"bullets" with:

  "lean": "Optional. Which way you lean and under what condition to switch.",
  "options": [
    {
      "id": "delphi",
      "label": "Delphi",
      "category": "history",
      "tagline": "One line on what this option is.",
      "duration": "Full day, ~10–12 h",
      "bullets": ["What you actually do"],
      "drives": [{ "from": "Athens", "to": "Delphi", "time": "2 h 30", "distance": "180 km" }],
      "bestFor": "Who or what mood this suits.",
      "availability": "Optional, e.g. Confirmed available on Sept 12",
      "link": { "label": "Where to book", "url": "https://…" }
    }
  ]

Rules:
- "category" is one of: water, nature, town, dining, history, activity.
- "paceTone" is one of: easy, moderate, full. "pace" is its human label.
- "id" values are lowercase-hyphenated and unique within the trip.
- Preserve detail. Specific names, times, warnings and reasons are the point —
  if something has no obvious field, put it in "notes" rather than dropping it.
- Use "travelTitle": "Getting around" when the day is walking or transit rather
  than driving. Include "note" on a leg whenever there is a catch worth knowing.
- Only include a URL that was actually given to you. Never invent a booking link.

Here is the plan to convert:
`;

const categories = new Set(['water', 'nature', 'town', 'dining', 'history', 'activity']);
const paceTones = new Set(['easy', 'moderate', 'full']);

function slug(value, fallback) {
  const base = String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return base || fallback;
}

const asArray = (value) => (Array.isArray(value) ? value : []);
const asText = (value) => (typeof value === 'string' ? value.trim() : '');
const asLines = (value) => asArray(value).map(asText).filter(Boolean);

function normalizeTravel(value) {
  return asArray(value)
    .map((leg) => ({
      from: asText(leg?.from),
      to: asText(leg?.to),
      time: asText(leg?.time),
      distance: asText(leg?.distance),
      note: asText(leg?.note),
    }))
    .filter((leg) => leg.from && leg.to);
}

function normalizeLink(value) {
  const url = asText(value?.url);
  if (!/^https?:\/\//i.test(url)) return null;
  return { label: asText(value?.label) || url, url };
}

function normalizeOption(raw, index, errors, where) {
  const label = asText(raw?.label);
  if (!label) {
    errors.push(`${where}: option ${index + 1} has no "label".`);
    return null;
  }
  const category = asText(raw?.category);
  return {
    id: slug(raw?.id || label, `option-${index + 1}`),
    label,
    category: categories.has(category) ? category : 'activity',
    tagline: asText(raw?.tagline),
    duration: asText(raw?.duration),
    bullets: asLines(raw?.bullets),
    travelTitle: asText(raw?.travelTitle) || 'Driving',
    drives: normalizeTravel(raw?.drives),
    bestFor: asText(raw?.bestFor),
    availability: asText(raw?.availability),
    link: normalizeLink(raw?.link),
    notes: asLines(raw?.notes),
  };
}

function normalizeDay(raw, index, errors, where) {
  const date = asText(raw?.date);
  const title = asText(raw?.title);
  if (!date && !title) {
    errors.push(`${where}: day ${index + 1} needs at least a "date" or a "title".`);
    return null;
  }

  const category = asText(raw?.category);
  const paceTone = asText(raw?.paceTone);
  const options = asArray(raw?.options)
    .map((option, i) => normalizeOption(option, i, errors, `${where} → ${title || date}`))
    .filter(Boolean);

  const blocks = asArray(raw?.blocks)
    .map((block) => ({ label: asText(block?.label), items: asLines(block?.items) }))
    .filter((block) => block.label && block.items.length);

  return {
    id: slug(raw?.id || `${date}-${title}`, `day-${index + 1}`),
    date: date || title,
    title: title || date,
    category: categories.has(category) ? category : 'town',
    pace: asText(raw?.pace),
    paceTone: paceTones.has(paceTone) ? paceTone : '',
    summary: asText(raw?.summary),
    bullets: asLines(raw?.bullets),
    blocks,
    travelTitle: asText(raw?.travelTitle) || 'Driving',
    drives: normalizeTravel(raw?.drives),
    notes: asLines(raw?.notes),
    lean: asText(raw?.lean),
    options,
  };
}

function normalizeLeg(raw, index, errors) {
  const label = asText(raw?.label) || asText(raw?.title);
  const where = label || `leg ${index + 1}`;
  const days = asArray(raw?.days)
    .map((day, i) => normalizeDay(day, i, errors, where))
    .filter(Boolean);

  if (days.length === 0) {
    errors.push(`${where}: no usable days. Each leg needs a "days" array.`);
    return null;
  }

  const poolItems = asArray(raw?.pool?.items)
    .map((item) => {
      const link = normalizeLink(item);
      return link ? { ...link, note: asText(item?.note) } : null;
    })
    .filter(Boolean);

  return {
    id: slug(raw?.id || label, `leg-${index + 1}`),
    label: label || `Leg ${index + 1}`,
    title: asText(raw?.title),
    base: asText(raw?.base),
    note: asText(raw?.note),
    days,
    pool: poolItems.length
      ? { title: asText(raw?.pool?.title) || 'Also considering', note: asText(raw?.pool?.note), items: poolItems }
      : null,
  };
}

/**
 * Turn pasted text into a renderable itinerary.
 * Returns { itinerary, errors, warnings }. `itinerary` is null when the input
 * cannot be used at all; `errors` explain why in plain language.
 */
export function parseItinerary(text) {
  const errors = [];
  const warnings = [];
  const raw = asText(text);

  if (!raw) return { itinerary: null, errors: ['Nothing pasted yet.'], warnings };

  // Assistants often wrap JSON in a markdown fence or add a sentence around it.
  let candidate = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  if (!candidate.startsWith('{')) {
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start === -1 || end <= start) {
      return {
        itinerary: null,
        errors: ['That does not look like JSON. Paste the JSON object the assistant returned, starting with "{".'],
        warnings,
      };
    }
    candidate = candidate.slice(start, end + 1);
    warnings.push('Ignored some text around the JSON object.');
  }

  let data;
  try {
    data = JSON.parse(candidate);
  } catch (error) {
    return { itinerary: null, errors: [`The JSON could not be parsed: ${error.message}`], warnings };
  }

  // Accept a bare array of days, or a single-leg object, as well as the full shape.
  let legsInput = data?.legs;
  if (!Array.isArray(legsInput)) {
    if (Array.isArray(data?.days)) legsInput = [{ id: 'trip', label: 'Trip', days: data.days }];
    else if (Array.isArray(data)) legsInput = [{ id: 'trip', label: 'Trip', days: data }];
    else return { itinerary: null, errors: ['No "legs" or "days" array found in that JSON.'], warnings };
  }

  const legs = legsInput.map((leg, index) => normalizeLeg(leg, index, errors)).filter(Boolean);
  if (legs.length === 0) {
    return { itinerary: null, errors: errors.length ? errors : ['No usable legs or days found.'], warnings };
  }

  const seen = new Set();
  for (const leg of legs) {
    for (const day of leg.days) {
      while (seen.has(day.id)) day.id = `${day.id}-x`;
      seen.add(day.id);
    }
  }

  const dayCount = legs.reduce((count, leg) => count + leg.days.length, 0);
  const optionDays = legs.flatMap((leg) => leg.days).filter((day) => day.options.length);
  for (const day of optionDays) {
    if (day.options.length === 1) warnings.push(`${day.title}: only one option, so there is nothing to choose between.`);
  }

  return {
    itinerary: {
      title: asText(data?.title) || 'Proposed Itinerary',
      subtitle: asText(data?.subtitle),
      legs,
      tip: data?.tip?.body ? { title: asText(data.tip.title) || 'Notes', body: asText(data.tip.body) } : null,
      importedAt: new Date().toISOString(),
    },
    errors,
    warnings,
    summary: { legs: legs.length, days: dayCount, optionDays: optionDays.length },
  };
}
