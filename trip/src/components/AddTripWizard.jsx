import { useState } from 'react';
import LocationAutocomplete from './LocationAutocomplete.jsx';

const blankPlace = { title: '', description: '', notes: '', location: '', lat: '', lng: '' };
const blankPhrase = { greek: '', pronunciation: '', meaning: '' };
const blankBooking = { name: '', checkin: '', checkout: '', confirmation: '', phone: '', address: '' };

export default function AddTripWizard({ onSave }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    name: '',
    destination: '',
    dates: '',
    subtitle: '',
    places: [{ ...blankPlace }],
    phrases: [{ ...blankPhrase }],
    dayPlan: 'Morning — coffee and first walk\nLunch — local restaurant\nAfternoon — beach, museum, or neighborhood time\nEvening — dinner and slow walk',
    bookings: [{ ...blankBooking }],
  });

  const steps = ['Basics', 'Places', 'Phrases', 'Day Plan', 'Bookings', 'Review'];

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const cleaned = {
      ...draft,
      name: draft.name.trim(),
      destination: draft.destination.trim(),
      places: draft.places.filter((place) => place.title.trim()),
      phrases: draft.phrases.filter((phrase) => phrase.greek.trim() && phrase.meaning.trim()),
      bookings: draft.bookings.filter((booking) => booking.name.trim()),
    };
    if (!cleaned.name || !cleaned.destination || cleaned.places.length === 0) return;
    setSaving(true);
    await onSave(cleaned);
    setSaving(false);
  }

  return (
    <article className="page wizard-page">
      <header className="hero-card">
        <h2>➕ Add New Trip</h2>
        <p>Create a reusable trip from the user side. It becomes structured trip data, not a code edit.</p>
      </header>

      <ol className="wizard-steps">
        {steps.map((label, index) => <li key={label} className={index === step ? 'active' : index < step ? 'done' : ''}>{label}</li>)}
      </ol>

      <form className="wizard-card" onSubmit={submit}>
        {step === 0 && <Basics draft={draft} update={update} />}
        {step === 1 && <Places draft={draft} update={update} />}
        {step === 2 && <Phrases draft={draft} update={update} />}
        {step === 3 && <DayPlan draft={draft} update={update} />}
        {step === 4 && <Bookings draft={draft} update={update} />}
        {step === 5 && <Review draft={draft} />}

        <div className="wizard-actions">
          <button type="button" className="ghost-button" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>Back</button>
          {step < steps.length - 1 ? (
            <button type="button" className="primary-button" onClick={() => setStep((value) => value + 1)}>Next</button>
          ) : (
            <button type="submit" className="primary-button" disabled={saving || !draft.name.trim() || !draft.destination.trim()}>Save Trip</button>
          )}
        </div>
      </form>
    </article>
  );
}

function Basics({ draft, update }) {
  return (
    <section>
      <h3>Trip basics</h3>
      <Field label="Trip name" value={draft.name} onChange={(value) => update('name', value)} placeholder="Portugal 2027" />
      <Field label="Destination" value={draft.destination} onChange={(value) => update('destination', value)} placeholder="Lisbon & Porto" />
      <Field label="Dates" value={draft.dates} onChange={(value) => update('dates', value)} placeholder="May 1-9" />
      <Field label="Subtitle" value={draft.subtitle} onChange={(value) => update('subtitle', value)} placeholder="Optional short guide summary" />
    </section>
  );
}

function Places({ draft, update }) {
  return (
    <section>
      <h3>Places and map pins</h3>
      <p className="help-text">Type a place or address and pick a match to add a map pin. If you skip the location, the place saves without a pin.</p>
      {draft.places.map((place, index) => (
        <div className="nested-card" key={index}>
          <Field label="Place title" value={place.title} onChange={(value) => updateList(update, draft, 'places', index, { ...place, title: value })} />
          <TextArea label="Description" value={place.description} onChange={(value) => updateList(update, draft, 'places', index, { ...place, description: value })} />
          <TextArea label="Notes, one per line" value={place.notes} onChange={(value) => updateList(update, draft, 'places', index, { ...place, notes: value })} />
          <LocationAutocomplete
            label="Location"
            value={place.location}
            placeholder="Type a place or address, then pick a match"
            onChange={(value) => updateList(update, draft, 'places', index, { ...place, location: value, lat: '', lng: '' })}
            onSelect={(match) => updateList(update, draft, 'places', index, { ...place, location: match.label, lat: match.lat, lng: match.lng })}
          />
          {hasCoordinates(place) && <p className="location-picked">Saved map pin: {Number(place.lat).toFixed(5)}, {Number(place.lng).toFixed(5)}</p>}
        </div>
      ))}
      <button type="button" className="ghost-button" onClick={() => update('places', [...draft.places, { ...blankPlace }])}>+ Add place</button>
    </section>
  );
}

function Phrases({ draft, update }) {
  return (
    <section>
      <h3>Phrase deck</h3>
      {draft.phrases.map((phrase, index) => (
        <div className="nested-card compact" key={index}>
          <Field label="Greek" value={phrase.greek} onChange={(value) => updateList(update, draft, 'phrases', index, { ...phrase, greek: value })} />
          <Field label="Pronunciation" value={phrase.pronunciation} onChange={(value) => updateList(update, draft, 'phrases', index, { ...phrase, pronunciation: value })} />
          <Field label="Meaning" value={phrase.meaning} onChange={(value) => updateList(update, draft, 'phrases', index, { ...phrase, meaning: value })} />
        </div>
      ))}
      <button type="button" className="ghost-button" onClick={() => update('phrases', [...draft.phrases, { ...blankPhrase }])}>+ Add phrase</button>
    </section>
  );
}

function DayPlan({ draft, update }) {
  return (
    <section>
      <h3>Simple day template</h3>
      <TextArea label="Plan, one line per slot" value={draft.dayPlan} onChange={(value) => update('dayPlan', value)} rows={8} />
    </section>
  );
}

function Bookings({ draft, update }) {
  return (
    <section>
      <h3>Seed bookings</h3>
      {draft.bookings.map((booking, index) => (
        <div className="nested-card compact" key={index}>
          {Object.keys(blankBooking).map((key) => (
            <Field key={key} label={key} value={booking[key]} onChange={(value) => updateList(update, draft, 'bookings', index, { ...booking, [key]: value })} />
          ))}
        </div>
      ))}
      <button type="button" className="ghost-button" onClick={() => update('bookings', [...draft.bookings, { ...blankBooking }])}>+ Add seed booking</button>
    </section>
  );
}

function Review({ draft }) {
  return (
    <section>
      <h3>Review</h3>
      <dl className="review-list">
        <dt>Name</dt><dd>{draft.name || 'Missing'}</dd>
        <dt>Destination</dt><dd>{draft.destination || 'Missing'}</dd>
        <dt>Places</dt><dd>{draft.places.filter((place) => place.title.trim()).length}</dd>
        <dt>Phrases</dt><dd>{draft.phrases.filter((phrase) => phrase.greek.trim()).length}</dd>
        <dt>Bookings</dt><dd>{draft.bookings.filter((booking) => booking.name.trim()).length}</dd>
      </dl>
    </section>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return <label className="form-group"><span>{label}</span><input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return <label className="form-group"><span>{label}</span><textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function hasCoordinates(place) {
  return place.lat !== '' && place.lng !== '' && Number.isFinite(Number(place.lat)) && Number.isFinite(Number(place.lng));
}

function updateList(update, draft, key, index, value) {
  update(key, draft[key].map((item, itemIndex) => (itemIndex === index ? value : item)));
}
