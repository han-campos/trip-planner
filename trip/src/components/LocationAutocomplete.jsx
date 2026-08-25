import { useEffect, useState } from 'react';
import { autocomplete } from '../geo.js';

export default function LocationAutocomplete({
  label = 'Location',
  value,
  placeholder = 'Type an address or place name',
  onChange,
  onSelect,
  autoFocus = false,
  compact = false,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [acceptedValue, setAcceptedValue] = useState('');

  useEffect(() => {
    const query = value.trim();
    setError('');
    if (query.length < 3 || query === acceptedValue) {
      setSuggestions([]);
      setStatus('idle');
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setStatus('searching');
      autocomplete(query, { signal: controller.signal })
        .then((matches) => {
          setSuggestions(matches);
          setStatus(matches.length ? 'ready' : 'empty');
        })
        .catch((lookupError) => {
          if (lookupError.name === 'AbortError') return;
          setSuggestions([]);
          setError('Location lookup unavailable. You can still save the typed address.');
          setStatus('error');
        });
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value, acceptedValue]);

  function chooseSuggestion(place) {
    setSuggestions([]);
    setStatus('idle');
    setAcceptedValue(place.label);
    onSelect(place);
  }

  return (
    <label className={`form-group autocomplete-field ${compact ? 'compact' : ''}`}>
      {label && <span>{label}</span>}
      <div className="autocomplete-wrap">
        <input
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={(event) => { setAcceptedValue(''); onChange(event.target.value); }}
          autoComplete="off"
        />
        {status === 'searching' && <small className="autocomplete-status">Searching OpenStreetMap…</small>}
        {status === 'empty' && <small className="autocomplete-status">No matches yet. Keep typing or save as entered.</small>}
        {error && <small className="autocomplete-error">{error}</small>}
        {suggestions.length > 0 && (
          <div className="autocomplete-list" role="listbox">
            {suggestions.map((place) => (
              <button key={place.id} type="button" role="option" onClick={() => chooseSuggestion(place)}>
                <strong>{place.label}</strong>
                <span>{place.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </label>
  );
}
