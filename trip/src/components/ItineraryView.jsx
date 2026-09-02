import { useEffect, useState } from 'react';
import { Car, Check, Clock, ExternalLink, MapPin } from 'lucide-react';
import { itineraryFor } from '../data/itineraries.js';
import { CategoryIcon, categoryTone, iconStroke } from './uiIcons.jsx';

const choiceKey = (tripId) => `trip-planner:v1:itinerary-choice:${tripId}`;

export default function ItineraryView({ trip }) {
  const itinerary = itineraryFor(trip);
  const optionDay = itinerary?.days.find((day) => day.options?.length);
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    if (!trip) return;
    try {
      setChoice(localStorage.getItem(choiceKey(trip.id)));
    } catch {
      setChoice(null);
    }
  }, [trip?.id]);

  function chooseOption(optionId) {
    const next = choice === optionId ? null : optionId;
    setChoice(next);
    try {
      if (next) localStorage.setItem(choiceKey(trip.id), next);
      else localStorage.removeItem(choiceKey(trip.id));
    } catch { /* ignore */ }
  }

  if (!itinerary) {
    return (
      <article className="page itinerary-page">
        <section className="page empty-state">
          <h2>No itinerary yet</h2>
          <p>This trip doesn’t have a proposed day-by-day plan. The Guide tab has the places and day templates.</p>
        </section>
      </article>
    );
  }

  const selected = optionDay?.options.find((option) => option.id === choice) || null;

  return (
    <article className="page itinerary-page">
      <header className="hero-card">
        <h1>{itinerary.title}</h1>
        <p>{itinerary.subtitle}</p>
        <div className="hero-meta">
          <span><MapPin size={16} strokeWidth={iconStroke} aria-hidden="true" />{itinerary.base}</span>
          <span><Clock size={16} strokeWidth={iconStroke} aria-hidden="true" />{itinerary.days.length} days</span>
        </div>
        <ol className="route-strip" aria-label="Route summary">
          {itinerary.days.map((day) => {
            const isOptionDay = Boolean(day.options?.length);
            const label = isOptionDay ? (selected?.label || 'Pick one') : day.title;
            return (
              <li key={day.id} className={`route-strip__step ${isOptionDay ? 'is-choice' : ''} ${isOptionDay && !selected ? 'is-unset' : ''}`}>
                <span className="route-strip__date">{day.date.replace(/^\w+ /, '')}</span>
                <span className="route-strip__label">{label}</span>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="itinerary-timeline">
        {itinerary.days.map((day) => (
          <DayBlock
            key={day.id}
            day={day}
            choice={choice}
            onChoose={chooseOption}
          />
        ))}
      </div>

      {itinerary.tip && (
        <div className="tip-box">
          <strong>{itinerary.tip.title}</strong>
          <p>{itinerary.tip.body}</p>
        </div>
      )}
    </article>
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
          <h2>{day.title}</h2>
          {isOptionDay && <span className="itin-choice-chip">{day.options.length} options</span>}
        </div>
        <p className="itin-day__summary">{day.summary}</p>

        {day.bullets && (
          <ul className="itin-list">
            {day.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        )}

        {day.drives && <DriveTable drives={day.drives} />}

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

      <DriveTable drives={option.drives} />

      {option.link && (
        <a className="itin-option__link" href={option.link.url} target="_blank" rel="noreferrer">
          <ExternalLink size={14} strokeWidth={iconStroke} aria-hidden="true" />
          {option.link.label}
        </a>
      )}
    </article>
  );
}

function DriveTable({ drives }) {
  if (!drives?.length) return null;
  return (
    <div className="itin-drives">
      <div className="itin-drives__title">
        <Car size={14} strokeWidth={iconStroke} aria-hidden="true" />
        Driving
      </div>
      {drives.map((leg) => (
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
