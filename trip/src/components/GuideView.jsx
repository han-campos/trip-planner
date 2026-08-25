import { useState } from 'react';

export default function GuideView({ trip, sections, onOpenTab, onOpenMap }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const guideSections = sections || trip.guideSections;
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

      {guideSections.map((section) => (
        <section className="section" id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.groups.map((group) => (
            <div className="guide-group" key={group.id}>
              <h3 id={group.id}>{group.title}</h3>
              <div className="card-grid">
                {group.cards.map((card) => <PlaceCard key={card.id} card={card} />)}
              </div>
            </div>
          ))}
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

export function PlaceCard({ card }) {
  return (
    <article className="place-card" id={card.id}>
      <h4>{card.title}</h4>
      {card.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {card.links?.map((link) => <p key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></p>)}
      {card.bullets.length > 0 && (
        <ul>
          {card.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      )}
    </article>
  );
}
