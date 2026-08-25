import { useEffect, useState } from 'react';
import { makeId } from '../storage/storage.js';

const fields = [
  ['checkin', 'Check-in / Date'],
  ['checkout', 'Check-out'],
  ['confirmation', 'Confirmation #'],
  ['phone', 'Phone'],
  ['address', 'Address'],
];

const emptyBooking = { name: '', checkin: '', checkout: '', confirmation: '', phone: '', address: '' };

export default function BookingsView({ trip, storage }) {
  const [bookings, setBookings] = useState([]);
  const [draft, setDraft] = useState(emptyBooking);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    storage.listBookings(trip.id, trip.bookings || []).then((loaded) => {
      if (alive) setBookings(loaded);
    });
    return () => {
      alive = false;
    };
  }, [storage, trip.id, trip.bookings]);

  async function reload() {
    setBookings(await storage.listBookings(trip.id, trip.bookings || []));
  }

  async function saveBooking(booking) {
    setSaving(true);
    const saved = await storage.upsertBooking(trip.id, booking);
    setBookings((current) => current.some((item) => item.id === saved.id)
      ? current.map((item) => (item.id === saved.id ? saved : item))
      : [...current, saved]);
    setSaving(false);
    return saved;
  }

  async function addBooking(event) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    await saveBooking({ ...draft, id: makeId(), name: draft.name.trim() });
    setDraft(emptyBooking);
    setShowForm(false);
  }

  async function deleteBooking(bookingId) {
    if (!window.confirm('Delete this booking?')) return;
    await storage.deleteBooking(trip.id, bookingId);
    setBookings((current) => current.filter((booking) => booking.id !== bookingId));
  }

  return (
    <article className="page bookings-page">
      <header className="hero-card">
        <h2>📋 Trip Bookings</h2>
        <p>{storage.mode === 'supabase' ? 'Shared Supabase bookings for everyone with the passcode.' : 'Offline-ready localStorage bookings on this device.'}</p>
      </header>

      <div className="booking-toolbar">
        <button className="add-booking-btn" type="button" onClick={() => setShowForm((open) => !open)}>+ Add New Booking</button>
        <button className="ghost-button" type="button" onClick={reload}>Refresh</button>
      </div>

      {showForm && (
        <form className="add-booking-form show" onSubmit={addBooking}>
          <h3>Create New Booking</h3>
          <BookingInput label="Booking Name" value={draft.name} placeholder="e.g., Acropolis Tickets, Catamaran, etc." onChange={(name) => setDraft({ ...draft, name })} />
          <BookingInput label="Check-in / Date" value={draft.checkin} placeholder="e.g., Sun, Sep 13 at 3:00 PM" onChange={(checkin) => setDraft({ ...draft, checkin })} />
          <BookingInput label="Check-out (if applicable)" value={draft.checkout} placeholder="e.g., Thu, Sep 17 at 11:00 AM" onChange={(checkout) => setDraft({ ...draft, checkout })} />
          <BookingInput label="Confirmation #" value={draft.confirmation} placeholder="e.g., ABC123XYZ" onChange={(confirmation) => setDraft({ ...draft, confirmation })} />
          <BookingInput label="Phone Number" value={draft.phone} placeholder="e.g., +30 694 3639427" onChange={(phone) => setDraft({ ...draft, phone })} />
          <BookingInput label="Address / Location" value={draft.address} placeholder="e.g., Nauárxou Apostóli 22" onChange={(address) => setDraft({ ...draft, address })} />
          <div className="form-buttons">
            <button className="form-btn cancel" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="form-btn save" type="submit" disabled={!draft.name.trim() || saving}>Save Booking</button>
          </div>
        </form>
      )}

      <div className="booking-list">
        {bookings.map((booking) => (
          <article className="booking-card" key={booking.id}>
            <div className="booking-card-header">
              <h3>{booking.name}</h3>
              <button className="delete-btn" type="button" onClick={() => deleteBooking(booking.id)}>Delete</button>
            </div>
            {fields.map(([field, label]) => (
              <BookingField
                key={field}
                label={label}
                value={booking[field] || ''}
                editing={editing?.id === booking.id && editing?.field === field}
                onEdit={() => setEditing({ id: booking.id, field })}
                onCancel={() => setEditing(null)}
                onSave={async (value) => {
                  await saveBooking({ ...booking, [field]: value });
                  setEditing(null);
                }}
              />
            ))}
          </article>
        ))}
      </div>

      <div className="tip-box">
        <strong>💡 How to Use</strong>
        <p>Click on any field to edit it directly. Click "+ Add New Booking" to create new entries for tickets, activities, rentals, etc. All changes are saved automatically to your device.</p>
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

function BookingField({ label, value, editing, onEdit, onCancel, onSave }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value, editing]);

  if (editing) {
    return (
      <div className="booking-field editing">
        <div className="booking-label">{label}:</div>
        <form onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
          <input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} />
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <button className="booking-field" type="button" onClick={onEdit}>
      <span className="booking-label">{label}:</span>
      <span className={`booking-value ${!value ? 'empty' : ''}`}>{value || 'Click to add'}</span>
    </button>
  );
}
