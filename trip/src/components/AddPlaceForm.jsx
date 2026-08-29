import { useState } from 'react';
import { X } from 'lucide-react';
import { geocode } from '../geo.js';
import LocationAutocomplete from './LocationAutocomplete.jsx';
import { CategoryIcon, categoryTone, iconStroke } from './uiIcons.jsx';

export default function AddPlaceForm({ groupTitle, category, saving, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bullets, setBullets] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [lookupStatus, setLookupStatus] = useState('idle');

  async function submit(event) {
    event.preventDefault();
    if (!title.trim() || saving) return;

    let resolvedLocation = selectedLocation;
    if (!resolvedLocation && location.trim()) {
      setLookupStatus('searching');
      resolvedLocation = await geocode(location).catch(() => null);
      setLookupStatus('idle');
    }

    await onSave({
      title: title.trim(),
      description: description.trim(),
      bullets,
      location: resolvedLocation?.label || location.trim(),
      coordinates: resolvedLocation ? { lat: resolvedLocation.lat, lng: resolvedLocation.lng } : null,
    });
  }

  return (
    <form className="add-place-form" onSubmit={submit}>
      <div className="add-place-heading">
        <div>
          <h4>Add to {groupTitle}</h4>
          <span className={`category-chip category-chip--${categoryTone(category)}`}><CategoryIcon category={category} size={16} />{category.label}</span>
        </div>
        <button className="icon-button" type="button" onClick={onCancel} aria-label="Close add place">
          <X size={18} strokeWidth={iconStroke} />
        </button>
      </div>

      <label className="form-group">
        <span>Title</span>
        <input value={title} placeholder="e.g., Sunset dinner in Chania" onChange={(event) => setTitle(event.target.value)} />
      </label>

      <label className="form-group">
        <span>One-line description</span>
        <textarea value={description} placeholder="Why this place is worth saving" onChange={(event) => setDescription(event.target.value)} />
      </label>

      <label className="form-group">
        <span>Optional bullets</span>
        <textarea value={bullets} placeholder={'One note per line\nBest time to go\nWhat to order'} onChange={(event) => setBullets(event.target.value)} />
      </label>

      <LocationAutocomplete
        label="Location"
        value={location}
        placeholder="Type a place or address, then pick a match"
        onChange={(nextLocation) => {
          setLocation(nextLocation);
          setSelectedLocation(null);
        }}
        onSelect={(place) => {
          setLocation(place.label);
          setSelectedLocation(place);
        }}
      />
      {selectedLocation && <p className="location-picked">Saved map pin: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}</p>}
      {lookupStatus === 'searching' && <p className="location-picked">Checking OpenStreetMap before saving…</p>}

      <div className="form-buttons">
        <button className="button button--secondary" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
        <button className="button button--primary" type="submit" disabled={!title.trim() || saving}>{saving ? 'Saving…' : 'Save place'}</button>
      </div>
    </form>
  );
}
