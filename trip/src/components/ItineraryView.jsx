import { useEffect, useMemo, useState } from 'react';
import { Car, Check, Clock, ExternalLink, Footprints, MapPin, Upload } from 'lucide-react';
import { itineraryFor } from '../data/itineraries.js';
import ImportItinerary from './ImportItinerary.jsx';
import { CategoryIcon, categoryTone, iconStroke } from './uiIcons.jsx';

const choiceKey = (tripId) => `trip-planner:v1:itinerary-choice:${tripId}`;

// Choices are a { [dayId]: optionId } map. Older builds stored a bare option id
// for the single Crete options day, so migrate that shape on read.
function readChoices(tripId) {
  try {
    const raw = localStorage.getItem(choiceKey(tripId));
    if (!raw) return {};
    if (!raw.startsWith('{')) return { 'sep-12': raw };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export default function ItineraryView({ trip, onUpdateTrip }) {
  const itinerary = itineraryFor(trip);
  const legs = useMemo(() => normalizeLegs(itinerary), [itinerary]);
  const [choices, setChoices] = useState({});
  const [activeLeg, setActiveLeg] = useState('all');
  const [importing, setImporting] = useState(false);
  const canImport = Boolean(onUpdateTrip);
  const hasCustom = Boolean(trip?.itinerary);

  async function saveItinerary(next) {
    await onUpdateTrip({ ...trip, itinerary: next });
    setActiveLeg('all');
  }

  async function resetItinerary() {
    const { itinerary: _dropped, ...rest } = trip;
    await onUpdateTrip(rest);
    setActiveLeg('all');
  }

  const importSheet = importing && canImport ? (
    <ImportItinerary
      trip={trip}
      hasCustom={hasCustom}
      onSave={saveItinerary}
      onReset={resetItinerary}
      onClose={() => setImporting(false)}
    />
  ) : null;

  useEffect(() => {
    if (trip) setChoices(readChoices(trip.id));
  }, [trip?.id]);

  function chooseOption(dayId, optionId) {
    setChoices((current) => {
      const next = { ...current };
      if (next[dayId] === optionId) delete next[dayId];
      else next[dayId] = optionId;
      try {
        localStorage.setItem(choiceKey(trip.id), JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }

  if (!itinerary || legs.length === 0) {
    return (
      <article className="page itinerary-page">
        <section className="page empty-state">
          <h2>No itinerary yet</h2>
          <p>This trip doesn’t have a proposed day-by-day plan. Import one from a chat assistant, or use the Guide tab for places and day templates.</p>
          {canImport && (
            <button className="button button--primary" type="button" onClick={() => setImporting(true)}>
              <Upload size={18} strokeWidth={iconStroke} aria-hidden="true" />
              Import itinerary
            </button>
          )}
        </section>
        {importSheet}
      </article>
    );
  }

  const shownLegs = activeLeg === 'all' ? legs : legs.filter((leg) => leg.id === activeLeg);
  const totalDays = legs.reduce((count, leg) => count + leg.days.length, 0);

  return (
    <article className="page itinerary-page">
      <header className="hero-card">
        <div className="itin-hero__title-row">
          <h1>{itinerary.title}</h1>
          {canImport && (
            <button className="button button--secondary itin-import-button" type="button" onClick={() => setImporting(true)}>
              <Upload size={16} strokeWidth={iconStroke} aria-hidden="true" />
              Import
            </button>
          )}
        </div>
        <p>{itinerary.subtitle}</p>
        <div className="hero-meta">
          <span><MapPin size={16} strokeWidth={iconStroke} aria-hidden="true" />{legs.map((leg) => leg.label).join(' → ')}</span>
          <span><Clock size={16} strokeWidth={iconStroke} aria-hidden="true" />{totalDays} days</span>
        </div>
        {legs.map((leg) => (
          <RouteStrip key={leg.id} leg={leg} choices={choices} showLabel={legs.length > 1} />
        ))}
      </header>

      {legs.length > 1 && (
        <div className="city-filter itinerary-legs" role="tablist" aria-label="Filter by leg">
          <button type="button" role="tab" aria-selected={activeLeg === 'all'} className={activeLeg === 'all' ? 'active' : ''} onClick={() => setActiveLeg('all')}>
            Whole trip
          </button>
          {legs.map((leg) => (
            <button key={leg.id} type="button" role="tab" aria-selected={activeLeg === leg.id} className={activeLeg === leg.id ? 'active' : ''} onClick={() => setActiveLeg(leg.id)}>
              {leg.label}
            </button>
          ))}
        </div>
      )}

      {shownLegs.map((leg) => (
        <section className="itin-leg" key={leg.id}>
          {(leg.title || leg.note) && (
            <div className="itin-leg__header">
              {leg.title && <h2>{leg.title}</h2>}
              {leg.base && <p className="itin-leg__base"><MapPin size={14} strokeWidth={iconStroke} aria-hidden="true" />{leg.base}</p>}
              {leg.note && <p className="itin-leg__note">{leg.note}</p>}
            </div>
          )}

          <div className="itinerary-timeline">
            {leg.days.map((day) => (
              <DayBlock key={day.id} day={day} choice={choices[day.id]} onChoose={(optionId) => chooseOption(day.id, optionId)} />
            ))}
          </div>

          {leg.pool && <WorkshopPool pool={leg.pool} />}
        </section>
      ))}

      {itinerary.tip && (
        <div className="tip-box">
          <strong>{itinerary.tip.title}</strong>
          <p>{itinerary.tip.body}</p>
        </div>
      )}

      {hasCustom && <p className="itin-source">Imported itinerary. “Import” replaces it; reset from there to return to the built-in plan.</p>}

      {importSheet}
    </article>
  );
}

function RouteStrip({ leg, choices, showLabel }) {
  return (
    <div className="route-strip-block">
      {showLabel && <span className="route-strip__leg">{leg.label}</span>}
      <ol className="route-strip" aria-label={`${leg.label} route summary`}>
        {leg.days.map((day) => {
          const isChoice = Boolean(day.options?.length);
          const picked = isChoice ? day.options.find((option) => option.id === choices[day.id]) : null;
          return (
            <li key={day.id} className={`route-strip__step ${isChoice ? 'is-choice' : ''} ${isChoice && !picked ? 'is-unset' : ''}`}>
              <span className="route-strip__date">{day.date.replace(/^\w+ /, '')}</span>
              <span className="route-strip__label">{isChoice ? (picked?.label || 'Pick one') : day.title}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function DayBlock({ day, choice, onChoose }) {
  const isOptionDay = Boolean(day.options?.length);

  return (
    <section className={`itin-day ${isOptionDay ? 'itin-day--choice' : ''}`} id={day.id}>
      <div className="itin-day__rail" aria-hidden="true">
        <span className={`category-tile category-tile--${categoryTone(day.category)}`}>
          <CategoryIcon category={day.category} size={18} />
        </span>
      </div>

      <div className="itin-day__body">
        <div className="itin-day__header">
          <span className="itin-day__date">{day.date}</span>
          <h3>{day.title}</h3>
          {day.pace && <span className={`itin-pace itin-pace--${day.paceTone || 'easy'}`}>{day.pace}</span>}
          {isOptionDay && <span className="itin-choice-chip">{day.options.length} options</span>}
        </div>
        <p className="itin-day__summary">{day.summary}</p>

        {day.bullets && (
          <ul className="itin-list">
            {day.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        )}

        {day.blocks?.map((block) => (
          <div className="itin-block" key={block.label}>
            <div className="itin-block__label">{block.label}</div>
            <ul className="itin-list">
              {block.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}

        {day.drives && <TravelTable title={day.travelTitle} legs={day.drives} />}

        {day.notes?.length > 0 && (
          <ul className="itin-list itin-list--notes">
            {day.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        )}

        {day.lean && <p className="itin-lean">{day.lean}</p>}

        {isOptionDay && (
          <div className="itin-options" role="radiogroup" aria-label={`${day.date} options`}>
            {day.options.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                selected={choice === option.id}
                dimmed={Boolean(choice) && choice !== option.id}
                onChoose={() => onChoose(option.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function OptionCard({ option, selected, dimmed, onChoose }) {
  return (
    <article className={`itin-option ${selected ? 'is-selected' : ''} ${dimmed ? 'is-dimmed' : ''}`}>
      <button
        type="button"
        className="itin-option__pick"
        role="radio"
        aria-checked={selected}
        onClick={onChoose}
      >
        <span className={`category-tile category-tile--${categoryTone(option.category)}`} aria-hidden="true">
          <CategoryIcon category={option.category} size={18} />
        </span>
        <span className="itin-option__heading">
          <strong>{option.label}</strong>
          <small>{option.tagline}</small>
        </span>
        <span className="itin-option__check" aria-hidden="true">
          {selected ? <Check size={16} strokeWidth={iconStroke} /> : null}
        </span>
      </button>

      <div className="itin-option__meta">
        <span className="itin-pill"><Clock size={14} strokeWidth={iconStroke} aria-hidden="true" />{option.duration}</span>
        {option.availability && <span className="itin-pill itin-pill--ok">{option.availability}</span>}
      </div>

      <ul className="itin-list">
        {option.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
      </ul>

      <TravelTable title={option.travelTitle} legs={option.drives} />

      {option.notes?.length > 0 && (
        <ul className="itin-list itin-list--notes">
          {option.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      )}

      {option.bestFor && <p className="itin-bestfor"><strong>Best for:</strong> {option.bestFor}</p>}

      {option.link && (
        <a className="itin-option__link" href={option.link.url} target="_blank" rel="noreferrer">
          <ExternalLink size={14} strokeWidth={iconStroke} aria-hidden="true" />
          {option.link.label}
        </a>
      )}
    </article>
  );
}

function TravelTable({ title = 'Driving', legs }) {
  if (!legs?.length) return null;
  const Icon = title === 'Driving' ? Car : Footprints;
  return (
    <div className="itin-drives">
      <div className="itin-drives__title">
        <Icon size={14} strokeWidth={iconStroke} aria-hidden="true" />
        {title}
      </div>
      {legs.map((leg) => (
        <div className="itin-drive" key={`${leg.from}-${leg.to}`}>
          <div className="itin-drive__route">
            <span>{leg.from}</span>
            <span className="itin-drive__arrow" aria-hidden="true">→</span>
            <span>{leg.to}</span>
          </div>
          <div className="itin-drive__stats">
            <strong>{leg.time}</strong>
            {leg.distance && leg.distance !== '—' && <span>{leg.distance}</span>}
          </div>
          {leg.note && <p className="itin-drive__note">{leg.note}</p>}
        </div>
      ))}
    </div>
  );
}

function WorkshopPool({ pool }) {
  return (
    <section className="itin-pool">
      <div className="itin-pool__header">
        <h3>{pool.title}</h3>
        <p>{pool.note}</p>
      </div>
      <div className="itin-pool__grid">
        {pool.items.map((item) => (
          <a className="itin-pool__item" key={item.url} href={item.url} target="_blank" rel="noreferrer">
            <span className="itin-pool__label">
              <strong>{item.label}</strong>
              {item.note && <small>{item.note}</small>}
            </span>
            <ExternalLink size={14} strokeWidth={iconStroke} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

// Older itineraries are a flat day list; wrap them so both shapes render.
function normalizeLegs(itinerary) {
  if (!itinerary) return [];
  if (itinerary.legs?.length) return itinerary.legs;
  if (itinerary.days?.length) {
    return [{ id: 'trip', label: 'Trip', title: '', base: itinerary.base, days: itinerary.days }];
  }
  return [];
}
