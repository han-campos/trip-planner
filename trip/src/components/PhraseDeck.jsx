import { useMemo, useState } from 'react';
import { Copy, Heart, Search, Volume2 } from 'lucide-react';
import { iconStroke } from './uiIcons.jsx';

export default function PhraseDeck({ deck }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [practice, setPractice] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const allPhrases = useMemo(() => deck.categories.flatMap((cat) => cat.items.map((item) => ({ ...item, category: cat.title, categoryId: cat.id }))), [deck]);
  const filtered = allPhrases.filter((phrase) => {
    const haystack = `${phrase.greek} ${phrase.pronunciation} ${phrase.meaning} ${phrase.category}`.toLowerCase();
    return (category === 'all' || phrase.categoryId === category) && haystack.includes(query.toLowerCase());
  });
  const practicePhrase = filtered[practiceIndex % Math.max(filtered.length, 1)];

  function nextPractice() {
    setPracticeIndex((index) => (index + 1) % Math.max(filtered.length, 1));
    setRevealed(false);
  }

  return (
    <article className="page phrase-page" id="greek-phrases">
      <header className="hero-card simple-hero">
        <h1>{deck.title}</h1>
        <p>Tap cards to flip from Greek to pronunciation and meaning. Filter by category or search.</p>
      </header>

      <div className="phrase-controls">
        <label className="search-field">
          <Search size={18} strokeWidth={iconStroke} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Greek, pronunciation, meaning…" />
        </label>
        <div className="cat-filter phrase-category-filter" role="group" aria-label="Phrase category">
          <button type="button" className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>All</button>
          {deck.categories.map((cat) => <button key={cat.id} type="button" className={category === cat.id ? 'active' : ''} onClick={() => setCategory(cat.id)}>{cat.title}</button>)}
        </div>
        <button className="button button--primary" type="button" onClick={() => setPractice((value) => !value)}>
          {practice ? 'Browse cards' : "Let's practice"}
        </button>
      </div>

      {practice ? (
        <section className="practice-panel">
          {practicePhrase ? (
            <button type="button" className={`flashcard big ${revealed ? 'flipped' : ''}`} onClick={() => setRevealed((value) => !value)}>
              <span className="card-front">{practicePhrase.greek}</span>
              <span className="card-back"><strong>{practicePhrase.pronunciation}</strong><em>{practicePhrase.meaning}</em></span>
            </button>
          ) : <p>No phrases match this filter.</p>}
          <div className="practice-actions">
            <button type="button" onClick={() => setRevealed((value) => !value)}>{revealed ? 'Hide answer' : 'Reveal answer'}</button>
            <button type="button" onClick={nextPractice}>Next card</button>
          </div>
        </section>
      ) : (
        <div className="phrase-grid">
          {filtered.map((phrase) => <PhraseCard key={phrase.id} phrase={phrase} />)}
        </div>
      )}

      <div className="tip-box">
        <strong>{deck.tip.title}</strong>
        <p>{deck.tip.body}</p>
      </div>
    </article>
  );
}

function PhraseCard({ phrase }) {
  const [flipped, setFlipped] = useState(false);
  const [favorite, setFavorite] = useState(false);

  function speak(event) {
    event.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(phrase.greek));
  }

  function copy(event) {
    event.stopPropagation();
    navigator.clipboard?.writeText(`${phrase.greek} — ${phrase.pronunciation} — ${phrase.meaning}`);
  }

  return (
    <button type="button" className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((value) => !value)}>
      <span className="phrase-card__header">
        <span className="phrase-category">{phrase.category}</span>
        <span
          role="button"
          tabIndex={0}
          className={`phrase-favorite ${favorite ? 'active' : ''}`}
          onClick={(event) => { event.stopPropagation(); setFavorite((value) => !value); }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              setFavorite((value) => !value);
            }
          }}
          aria-label={favorite ? 'Remove favorite' : 'Favorite phrase'}
        >
          <Heart size={20} strokeWidth={iconStroke} fill={favorite ? 'currentColor' : 'none'} />
        </span>
      </span>
      <span className="card-front">{phrase.greek}</span>
      <span className="card-back"><strong>{phrase.pronunciation}</strong><em>{phrase.meaning}</em></span>
      <span className="phrase-actions">
        <span role="button" tabIndex={0} className="phrase-action primary" onClick={speak} onKeyDown={(event) => { if (event.key === 'Enter') speak(event); }} aria-label="Play phrase"><Volume2 size={18} strokeWidth={iconStroke} /></span>
        <span role="button" tabIndex={0} className="phrase-action" onClick={copy} onKeyDown={(event) => { if (event.key === 'Enter') copy(event); }} aria-label="Copy phrase"><Copy size={18} strokeWidth={iconStroke} /></span>
      </span>
    </button>
  );
}
