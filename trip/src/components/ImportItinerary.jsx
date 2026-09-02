import { useState } from 'react';
import { AlertTriangle, Check, ClipboardCopy, RotateCcw, X } from 'lucide-react';
import { itinerarySchemaPrompt, parseItinerary } from '../data/itinerarySchema.js';
import { iconStroke } from './uiIcons.jsx';

export default function ImportItinerary({ trip, hasCustom, onSave, onReset, onClose }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  function check(nextText) {
    setText(nextText);
    setResult(nextText.trim() ? parseItinerary(nextText) : null);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(itinerarySchemaPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  async function save() {
    if (!result?.itinerary) return;
    setSaving(true);
    try {
      await onSave(result.itinerary);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!window.confirm('Remove the imported itinerary and go back to the built-in plan?')) return;
    setSaving(true);
    try {
      await onReset();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="sheet-overlay" role="presentation" onMouseDown={onClose}>
      <section className="bottom-sheet import-sheet" role="dialog" aria-modal="true" aria-labelledby="import-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-header">
          <div>
            <h2 id="import-title">Import itinerary</h2>
            <p>Plan in any AI chat, paste the result here. No rebuild needed.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close import">
            <X size={20} strokeWidth={iconStroke} />
          </button>
        </header>

        <ol className="import-steps">
          <li>
            <span>Copy the prompt and paste it into ChatGPT, followed by your plan and any booking links.</span>
            <button className="button button--secondary" type="button" onClick={copyPrompt}>
              {copied ? <Check size={16} strokeWidth={iconStroke} aria-hidden="true" /> : <ClipboardCopy size={16} strokeWidth={iconStroke} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy prompt'}
            </button>
          </li>
          <li>Paste the JSON it returns below. It is checked as you type.</li>
        </ol>

        <textarea
          className="import-textarea"
          value={text}
          onChange={(event) => check(event.target.value)}
          placeholder={'{\n  "title": "Proposed Itinerary",\n  "legs": [ … ]\n}'}
          spellCheck="false"
          aria-label="Itinerary JSON"
        />

        {result && <ImportFeedback result={result} />}

        <footer className="import-footer">
          {hasCustom && (
            <button className="button button--danger" type="button" onClick={reset} disabled={saving}>
              <RotateCcw size={16} strokeWidth={iconStroke} aria-hidden="true" />
              Reset to built-in
            </button>
          )}
          <button className="button button--primary" type="button" onClick={save} disabled={!result?.itinerary || saving}>
            {saving ? 'Saving…' : `Replace ${trip.name} itinerary`}
          </button>
        </footer>
      </section>
    </div>
  );
}

function ImportFeedback({ result }) {
  const { itinerary, errors, warnings, summary } = result;

  return (
    <div className={`import-feedback ${itinerary ? 'is-ok' : 'is-bad'}`} role="status" aria-live="polite">
      {itinerary ? (
        <p className="import-feedback__headline">
          <Check size={16} strokeWidth={iconStroke} aria-hidden="true" />
          Ready: {summary.days} {summary.days === 1 ? 'day' : 'days'} across {summary.legs} {summary.legs === 1 ? 'leg' : 'legs'}
          {summary.optionDays > 0 && `, ${summary.optionDays} with options to pick`}.
        </p>
      ) : (
        <p className="import-feedback__headline">
          <AlertTriangle size={16} strokeWidth={iconStroke} aria-hidden="true" />
          Not usable yet
        </p>
      )}

      {errors.length > 0 && (
        <ul className="import-feedback__list">
          {errors.map((message) => <li key={message}>{message}</li>)}
        </ul>
      )}
      {warnings.length > 0 && (
        <ul className="import-feedback__list import-feedback__list--warn">
          {warnings.map((message) => <li key={message}>{message}</li>)}
        </ul>
      )}

      {itinerary && (
        <ul className="import-preview">
          {itinerary.legs.map((leg) => (
            <li key={leg.id}>
              <strong>{leg.label}</strong>
              <span>{leg.days.map((day) => day.title).join(' → ')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
