import { useEffect, useState } from 'react';
import { CalendarDays, ExternalLink, Phone, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { googleMapsSearchUrl } from '../geo.js';
import { makeId } from '../storage/storage.js';
import LocationAutocomplete from './LocationAutocomplete.jsx';
import { bookingIconFor, iconStroke } from './uiIcons.jsx';

const fields = [
  ['checkin', 'Check-in / Date'],
  ['checkout', 'Check-out'],
  ['confirmation', 'Confirmation #'],
  ['phone', 'Phone'],
  ['address', 'Address'],
];

const emptyBooking = { name: '', checkin: '', checkout: '', confirmation: '', phone: '', address: '', lat: null, lng: null };

export default function BookingsView({ trip, storage }) {
  const [bookings, setBookings] = useState([]);
  const [draft, setDraft] = useState(emptyBooking);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    storage.listBookings(trip.id, trip.bookings || []).then((items) => {
      if (mounted) setBookings(items);
    });
    return () => { mounted = false; };
  }, [storage, trip.id, trip.bookings]);

  async function reload() {
    setBookings(await storage.listBookings(trip.id, trip.bookings || []));
  }

  async function saveBooking(booking) {
    setSaving(true);
    try {
      const saved = await storage.saveBooking(trip.id, booking);
      setBookings((current) => current.map((item) => (item.id === saved.id ? saved : item)));
    } finally {
      setSaving(false);
    }
  }

  async function addBooking(event) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    const saved = await storage.saveBooking(trip.id, { ...draft, id: makeId() });
    setBookings((current) => [saved, ...current]);
    setDraft(emptyBooking);
    setShowForm(false);
  }

  async function deleteBooking(bookingId) {
    await storage.deleteBooking(trip.id, bookingId);
    setBookings((current) => current.filter((booking) => booking.id !== bookingId));
  }

  return (
    <article className="page bookings-page">
      <header className="hero-card simple-hero">
        <h1>Trip Bookings</h1>
        <p>{storage.mode === 'supabase' ? 'Shared Supabase bookings for everyone with the passcode.' : 'Offline-ready localStorage bookings on this device.'}</p>
      </header>

      <div className="booking-toolbar">
        <button className="button button--primary" type="button" onClick={() => setShowForm((open) => !open)}>
          <Plus size={18} strokeWidth={iconStroke} aria-hidden="true" />
          Add booking
        </button>
        <button className="button button--secondary" type="button" onClick={reload}>
          <RefreshCw size={18} strokeWidth={iconStroke} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {showForm && (
        <form className="add-booking-form show" onSubmit={addBooking}>
          <h3>Create new booking</h3>
          <BookingInput label="Booking Name" value={draft.name} placeholder="e.g., Acropolis tickets, catamaran, hotel" onChange={(name) => setDraft({ ...draft, name })} />
          <BookingInput label="Check-in / Date" value={draft.checkin} placeholder="e.g., Sun, Sep 13 at 3:00 PM" onChange={(checkin) => setDraft({ ...draft, checkin })} />
          <BookingInput label="Check-out (if applicable)" value={draft.checkout} placeholder="e.g., Thu, Sep 17 at 11:00 AM" onChange={(checkout) => setDraft({ ...draft, checkout })} />
          <BookingInput label="Confirmation #" value={draft.confirmation} placeholder="e.g., ABC123XYZ" onChange={(confirmation) => setDraft({ ...draft, confirmation })} />
          <BookingInput label="Phone Number" value={draft.phone} placeholder="e.g., +30 694 3639427" onChange={(phone) => setDraft({ ...draft, phone })} />
          <LocationAutocomplete
            label="Address / Location"
            value={draft.address}
            placeholder="Start typing an address, then pick a match"
            onChange={(address) => setDraft({ ...draft, address, lat: null, lng: null })}
            onSelect={(place) => setDraft({ ...draft, address: place.label, lat: place.lat, lng: place.lng })}
          />
          {draft.lat !== null && draft.lat !== undefined && draft.lng !== null && draft.lng !== undefined && Number.isFinite(Number(draft.lat)) && Number.isFinite(Number(draft.lng)) && (
            <p className="location-picked">Saved map pin: {Number(draft.lat).toFixed(5)}, {Number(draft.lng).toFixed(5)}</p>
          )}
          <div className="form-buttons">
            <button className="button button--secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="button button--primary" type="submit" disabled={!draft.name.trim() || saving}>Save booking</button>
          </div>
        </form>
      )}

      <div className="booking-list">
        {bookings.map((booking) => {
          const mapsUrl = bookingMapsUrl(booking);
          const Icon = bookingIconFor(booking.name);
          return (
            <article className="booking-card" key={booking.id}>
              <div className="booking-card__tile" aria-hidden="true"><Icon size={20} strokeWidth={iconStroke} /></div>
              <div className="booking-card__body">
                <div className="booking-card-header">
                  <div>
                    <h3>{booking.name}</h3>
                    <p>{booking.address || booking.checkin || 'Tap a field to add details'}</p>
                  </div>
                  <button className="icon-button danger" type="button" onClick={() => deleteBooking(booking.id)} aria-label={`Delete ${booking.name}`}>
                    <Trash2 size={18} strokeWidth={iconStroke} />
                  </button>
                </div>
                {fields.map(([field, label]) => (
                  <BookingField
                    key={field}
                    field={field}
                    booking={booking}
                    label={label}
                    value={booking[field] || ''}
                    editing={editing?.id === booking.id && editing?.field === field}
                    onEdit={() => setEditing({ id: booking.id, field })}
                    onCancel={() => setEditing(null)}
                    onSave={async (patch) => {
                      await saveBooking({ ...booking, ...patch });
                      setEditing(null);
                    }}
                  />
                ))}
                {mapsUrl && <a className="maps-link booking-maps-link" href={mapsUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} strokeWidth={iconStroke} />Open in Google Maps</a>}
              </div>
            </article>
          );
        })}
      </div>

      <div className="tip-box">
        <strong>How to use</strong>
        <p>Click on any field to edit it directly. Address fields offer OpenStreetMap suggestions and save map coordinates when you pick a match.</p>
      </div>
    </article>
  );
}

function BookingInput({ label, value, placeholder, onChange }) {
  return (
    <label className="form-group">
      <span>{label}</span>
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function BookingField({ field, booking, label, value, editing, onEdit, onCancel, onSave }) {
  const [draft, setDraft] = useState(value);
  const [selectedPlace, setSelectedPlace] = useState(null);
  useEffect(() => {
    setDraft(value);
    setSelectedPlace(null);
  }, [value, editing]);

  if (editing) {
    if (field === 'address') {
      return (
        <div className="booking-field editing">
          <div className="booking-label">{label}</div>
          <form className="address-edit-form" onSubmit={(event) => {
            event.preventDefault();
            onSave(addressPatch(booking, draft, selectedPlace));
          }}>
            <LocationAutocomplete
              label=""
              compact
              autoFocus
              value={draft}
              placeholder="Start typing an address"
              onChange={(address) => {
                setDraft(address);
                setSelectedPlace(null);
              }}
              onSelect={(place) => {
                setDraft(place.label);
                setSelectedPlace(place);
              }}
            />
            {selectedPlace && <p className="location-picked">Saved map pin: {selectedPlace.lat.toFixed(5)}, {selectedPlace.lng.toFixed(5)}</p>}
            <div className="address-edit-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={onCancel}>Cancel</button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="booking-field editing">
        <div className="booking-label">{label}</div>
        <form onSubmit={(event) => { event.preventDefault(); onSave({ [field]: draft }); }}>
          <input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} />
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <button className="booking-field" type="button" onClick={onEdit}>
      <span className="booking-label">{field === 'phone' ? <Phone size={14} strokeWidth={iconStroke} aria-hidden="true" /> : <CalendarDays size={14} strokeWidth={iconStroke} aria-hidden="true" />}{label}</span>
      <span className={`booking-value ${!value ? 'empty' : ''}`}>{value || 'Click to add'}</span>
    </button>
  );
}

function addressPatch(booking, address, selectedPlace) {
  if (selectedPlace) {
    return { address: selectedPlace.label, lat: selectedPlace.lat, lng: selectedPlace.lng };
  }
  if (address !== (booking.address || '')) {
    return { address, lat: null, lng: null };
  }
  return { address };
}

function bookingMapsUrl(booking) {
  return googleMapsSearchUrl({ lat: booking.lat, lng: booking.lng, query: booking.address });
}
