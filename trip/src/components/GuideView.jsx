import { useMemo, useState } from 'react';
import { Check, ChevronRight, Clock, ExternalLink, MapPin, Navigation, Pencil, Plus, Trash2, Users } from 'lucide-react';
import AddPlaceForm from './AddPlaceForm.jsx';
import { googleMapsSearchUrl } from '../geo.js';
import { categorizeGroup } from '../places.js';
import { makeId } from '../storage/storage.js';
import { CategoryIcon, categoryTone, iconStroke } from './uiIcons.jsx';

export default function GuideView({ trip, sections, filters, modeSwitch, onUpdateTrip }) {
  const [editMode, setEditMode] = useState(false);
  const [addingTo, setAddingTo] = useState(null);
  const [saving, setSaving] = useState(false);
  const guideSections = sections || trip.guideSections;
  const canEdit = Boolean(onUpdateTrip);
  const firstEditableTarget = useMemo(() => {
    const section = trip.guideSections?.find((item) => item.groups?.length);
    const group = section?.groups?.[0];
    return section && group ? { sectionId: section.id, groupId: group.id } : null;
  }, [trip.guideSections]);

  async function persistGuideSections(guideSectionsDraft) {
    if (!onUpdateTrip) return;
    setSaving(true);
    try {
      await onUpdateTrip({ ...trip, guideSections: guideSectionsDraft });
    } finally {
      setSaving(false);
    }
  }

  async function addPlace(sectionId, groupId, draft) {
    const nextSections = trip.guideSections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        groups: section.groups.map((group) => {
          if (group.id !== groupId) return group;
          const card = {
            id: uniquePlaceId(trip, draft.title),
            title: draft.title,
            paragraphs: draft.description ? [draft.description] : [],
            bullets: draft.bullets.split('\n').map((line) => line.trim()).filter(Boolean),
            links: [],
            location: draft.location || '',
            coordinates: draft.coordinates || null,
          };
          return { ...group, cards: [...group.cards, card] };
        }),
      };
    });
    await persistGuideSections(nextSections);
    setAddingTo(null);
  }

  async function removePlace(sectionId, groupId, cardId) {
    const nextSections = trip.guideSections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        groups: section.groups.map((group) => group.id === groupId ? { ...group, cards: group.cards.filter((card) => card.id !== cardId) } : group),
      };
    });
    await persistGuideSections(nextSections);
  }

  function openQuickAdd() {
    if (!firstEditableTarget) return;
    setAddingTo(firstEditableTarget);
    window.setTimeout(() => document.querySelector('.add-place-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  }

  return (
    <article className="page guide-page">
      <header className="hero-card trip-hero">
        <div className="hero-card__copy">
          <div className="hero-card__title-row">
            <h1>{trip.title}</h1>
            <span className="active-chip">Active</span>
          </div>
          <p>{trip.subtitle}</p>
          <div className="hero-meta" aria-label="Trip details">
            <span><MapPin size={16} strokeWidth={iconStroke} aria-hidden="true" />{summarizeAreas(trip)}</span>
            {trip.dates && <span><Clock size={16} strokeWidth={iconStroke} aria-hidden="true" />{trip.dates}</span>}
            <span><Users size={16} strokeWidth={iconStroke} aria-hidden="true" />Shared guide</span>
          </div>
        </div>
        {canEdit && (
          <button className={`hero-edit-button ${editMode ? 'active' : ''}`} type="button" onClick={() => setEditMode((active) => !active)} aria-label={editMode ? 'Finish editing guide' : 'Edit guide'}>
            {editMode ? <Check size={18} strokeWidth={iconStroke} /> : <Pencil size={18} strokeWidth={iconStroke} />}
          </button>
        )}
      </header>

      {canEdit && editMode && (
        <div className="editing-banner">
          <strong>Editing</strong>
          <span>Add or remove guide cards for this trip.</span>
          {saving && <em>Saving…</em>}
        </div>
      )}

      {modeSwitch}
      {filters}

      {guideSections.map((section) => (
        <section className="guide-section" id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.groups.map((group) => {
            const category = categorizeGroup(group.title);
            const isAdding = addingTo?.sectionId === section.id && addingTo?.groupId === group.id;
            return (
              <div className="guide-group" key={group.id}>
                <div className="section-header">
                  <span className={`section-header__icon category-tile category-tile--${categoryTone(category)}`}><CategoryIcon category={category} size={16} /></span>
                  <h3 id={group.id}>{group.title}</h3>
                  <span className="section-count">{group.cards.length}</span>
                  {editMode && (
                    <button className="mini-add-button" type="button" onClick={() => setAddingTo(isAdding ? null : { sectionId: section.id, groupId: group.id })}>
                      <Plus size={16} strokeWidth={iconStroke} aria-hidden="true" />
                      {isAdding ? 'Close' : 'Add'}
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
                      category={category}
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

      <section className="guide-section" id="daily-templates">
        <h2>{trip.dayTemplates.title}</h2>
        <div className="day-template-grid">
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
        </div>
        <div className="tip-box">
          <strong>{trip.dayTemplates.tip.title}</strong>
          <p>{trip.dayTemplates.tip.body}</p>
        </div>
      </section>

      {canEdit && editMode && (
        <button className="add-place-fab" type="button" onClick={openQuickAdd} aria-label="Add place">
          <Plus size={24} strokeWidth={iconStroke} />
        </button>
      )}
    </article>
  );
}

export function PlaceCard({ card, category, editMode = false, onDelete }) {
  const mapsUrl = googleMapsSearchUrl(card.coordinates || {});
  const paragraphs = card.paragraphs || [];
  const bullets = card.bullets || [];

  return (
    <article className={`place-card ${editMode ? 'editing' : ''}`} id={card.id}>
      <div className={`category-tile category-tile--${categoryTone(category)}`} aria-hidden="true">
        <CategoryIcon category={category} size={20} />
      </div>
      <div className="place-card__body">
        <div className="place-card__header">
          <h4>{card.title}</h4>
          {editMode ? (
            <button className="icon-button danger" type="button" onClick={onDelete} aria-label={`Remove ${card.title}`}>
              <Trash2 size={18} strokeWidth={iconStroke} />
            </button>
          ) : (
            <ChevronRight size={18} strokeWidth={iconStroke} className="place-card__chevron" aria-hidden="true" />
          )}
        </div>
        {card.location && <p className="location-line"><MapPin size={14} strokeWidth={iconStroke} aria-hidden="true" />{card.location}</p>}
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {bullets.length > 0 && (
          <ul>
            {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        )}
        <div className="place-card__links">
          {card.links?.map((link) => <a className="maps-link" key={link.href} href={link.href} target="_blank" rel="noreferrer"><ExternalLink size={14} strokeWidth={iconStroke} />{link.label}</a>)}
          {mapsUrl && <a className="maps-link" href={mapsUrl} target="_blank" rel="noreferrer"><Navigation size={14} strokeWidth={iconStroke} />Open in Google Maps</a>}
        </div>
      </div>
    </article>
  );
}

function summarizeAreas(trip) {
  const areas = [...new Set((trip.guideSections || []).map((section) => section.area).filter(Boolean))];
  if (areas.includes('crete') && areas.includes('athens')) return 'Crete & Athens';
  if (areas.length === 1) return areas[0][0].toUpperCase() + areas[0].slice(1);
  return 'Trip places';
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
