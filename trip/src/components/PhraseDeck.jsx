import { useMemo, useState } from 'react';

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
    <article className="page" id="greek-phrases">
      <header className="hero-card">
        <h2>{deck.title}</h2>
        <p>Tap cards to flip from Greek to pronunciation and meaning. Filter by category or search.</p>
      </header>

      <div className="phrase-controls">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Greek, pronunciation, meaning…" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {deck.categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
        </select>
        <button className="primary-button" type="button" onClick={() => setPractice((value) => !value)}>
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
  return (
    <button type="button" className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((value) => !value)}>
      <span className="phrase-category">{phrase.category}</span>
      <span className="card-front">{phrase.greek}</span>
      <span className="card-back"><strong>{phrase.pronunciation}</strong><em>{phrase.meaning}</em></span>
    </button>
  );
}
