import { useState } from 'react';
import AddPlaceForm from './AddPlaceForm.jsx';
import { googleMapsSearchUrl } from '../geo.js';
import { categorizeGroup } from '../places.js';
import { makeId } from '../storage/storage.js';

export default function GuideView({ trip, sections, onOpenTab, onOpenMap, onUpdateTrip }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addingTo, setAddingTo] = useState(null);
  const [saving, setSaving] = useState(false);
  const guideSections = sections || trip.guideSections;
  const canEdit = Boolean(onUpdateTrip);

  async function persistGuideSections(guideSectionsDraft) {
    setSaving(true);
    try {
      await onUpdateTrip({ ...trip, guideSections: guideSectionsDraft });
    } finally {
      setSaving(false);
    }
  }

  async function addPlace(sectionId, groupId, draft) {
    const cardId = uniquePlaceId(trip, draft.title);
    const card = {
      id: cardId,
      title: draft.title,
      paragraphs: draft.description ? [draft.description] : [],
      bullets: draft.bullets.split('\n').map((line) => line.trim()).filter(Boolean),
      links: [],
      location: draft.location,
      coordinates: draft.coordinates,
    };

    const nextGuideSections = trip.guideSections.map((section) => section.id !== sectionId ? section : {
      ...section,
      groups: section.groups.map((group) => group.id !== groupId ? group : {
        ...group,
        cards: [...group.cards, card],
      }),
    });

    await persistGuideSections(nextGuideSections);
    setAddingTo(null);
    window.setTimeout(() => document.getElementById(cardId)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  }

  async function removePlace(sectionId, groupId, cardId) {
    if (!window.confirm('Remove this place from the guide?')) return;
    const nextGuideSections = trip.guideSections.map((section) => section.id !== sectionId ? section : {
      ...section,
      groups: section.groups.map((group) => group.id !== groupId ? group : {
        ...group,
        cards: group.cards.filter((card) => card.id !== cardId),
      }),
    });
    await persistGuideSections(nextGuideSections);
  }

  return (
    <article className="page guide-page">
      <div className="sticky-section-menu">
        <div className="section-menu-header">
          <strong>{trip.name}</strong>
          <button type="button" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? '✕ Close' : '☰ Menu'}</button>
        </div>
        {menuOpen && (
          <div className="section-menu-list">
            {trip.nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
            ))}
            {onOpenMap && (
              <button type="button" onClick={() => { setMenuOpen(false); onOpenMap(); }}>🗺️ View Map</button>
            )}
            <button type="button" onClick={() => { setMenuOpen(false); onOpenTab('phrases'); }}>🗣️ Practice Phrases</button>
          </div>
        )}
      </div>

      <header className="hero-card">
        <h2>{trip.title}</h2>
        <p>{trip.subtitle}</p>
      </header>

      {canEdit && (
        <div className="guide-edit-toolbar">
          <button className={`edit-toggle ${editMode ? 'active' : ''}`} type="button" onClick={() => setEditMode((active) => !active)}>
            {editMode ? 'Done Editing' : 'Edit Guide'}
          </button>
          <span>{editMode ? 'Add or remove guide cards for this trip.' : 'Turn on edit mode to add places and restaurants.'}</span>
          {saving && <strong>Saving…</strong>}
        </div>
      )}

      {guideSections.map((section) => (
        <section className="section" id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.groups.map((group) => {
            const category = categorizeGroup(group.title);
            const isAdding = addingTo?.sectionId === section.id && addingTo?.groupId === group.id;
            return (
              <div className="guide-group" key={group.id}>
                <div className="guide-group-header">
                  <h3 id={group.id}>{group.title}</h3>
                  {editMode && (
                    <button className="add-place-btn" type="button" onClick={() => setAddingTo(isAdding ? null : { sectionId: section.id, groupId: group.id })}>
                      {isAdding ? 'Close' : '+ Add'}
                    </button>
                  )}
                </div>
                {isAdding && (
                  <AddPlaceForm
                    groupTitle={group.title}
                    category={category}
                    saving={saving}
                    onCancel={() => setAddingTo(null)}
                    onSave={(draft) => addPlace(section.id, group.id, draft)}
                  />
                )}
                <div className="card-grid">
                  {group.cards.map((card) => (
                    <PlaceCard
                      key={card.id}
                      card={card}
                      editMode={editMode}
                      onDelete={() => removePlace(section.id, group.id, card.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ))}

      <section className="section" id="daily-templates">
        <h2>{trip.dayTemplates.title}</h2>
        {trip.dayTemplates.templates.map((template) => (
          <div className="day-template" id={template.id} key={template.id}>
            <h3>{template.title}</h3>
            <div className="day-header">{template.header}</div>
            {template.slots.map((slot) => (
              <div className="time-slot" key={`${template.id}-${slot.time}`}>
                <div className="time">{slot.time}</div>
                <div className="activity">{slot.activity}</div>
                {slot.detail && <div className="activity-detail">{slot.detail}</div>}
              </div>
            ))}
          </div>
        ))}
        <div className="tip-box">
          <strong>{trip.dayTemplates.tip.title}</strong>
          <p>{trip.dayTemplates.tip.body}</p>
        </div>
      </section>
    </article>
  );
}

export function PlaceCard({ card, editMode = false, onDelete }) {
  const mapsUrl = googleMapsSearchUrl(card.coordinates || {});
  const paragraphs = card.paragraphs || [];
  const bullets = card.bullets || [];

  return (
    <article className={`place-card ${editMode ? 'editing' : ''}`} id={card.id}>
      <div className="place-card-header">
        <h4>{card.title}</h4>
        {editMode && <button className="remove-place-btn" type="button" onClick={onDelete}>Remove</button>}
      </div>
      {card.location && <p className="location-line">📍 {card.location}</p>}
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {card.links?.map((link) => <p key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></p>)}
      {mapsUrl && <p><a className="maps-link" href={mapsUrl} target="_blank" rel="noreferrer">📍 Open in Google Maps</a></p>}
      {bullets.length > 0 && (
        <ul>
          {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      )}
    </article>
  );
}

function uniquePlaceId(trip, title) {
  const base = slug(title);
  const existing = new Set(trip.guideSections.flatMap((section) => section.groups.flatMap((group) => group.cards.map((card) => card.id))));
  if (!existing.has(base)) return base;
  return `${base}-${makeId().slice(0, 8)}`;
}

function slug(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || makeId();
}
