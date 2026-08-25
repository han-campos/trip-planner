import { useRef, useState } from 'react';

export default function PasswordGate({ onUnlock }) {
  const inputRef = useRef(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  function submit(event) {
    event.preventDefault();
    const ok = onUnlock(passcode);
    if (!ok) {
      setError(true);
      setPasscode('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  return (
    <main className="password-screen">
      <form className="password-box" onSubmit={submit}>
        <h1>Greece Trip Guide</h1>
        <p>Enter the shared passcode to open the planner.</p>
        <input
          ref={inputRef}
          autoFocus
          type="password"
          value={passcode}
          placeholder="Enter password"
          onChange={(event) => {
            setPasscode(event.target.value);
            setError(false);
          }}
        />
        <button type="submit">Access</button>
        {error && <div className="password-error">Incorrect password. Try again.</div>}
      </form>
    </main>
  );
}
