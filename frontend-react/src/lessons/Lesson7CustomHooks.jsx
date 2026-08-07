// LESSON 7: Custom hooks
//
// You've now used useState and useEffect several times for the same kinds
// of problems (a toggle, a value synced to localStorage, tracking online
// status...). A CUSTOM HOOK lets you extract that reusable stateful logic
// into a plain function you can call from any component.
//
// Rules:
//   - the name MUST start with "use" (e.g. useToggle) — this is how React
//     knows it's allowed to call other hooks inside it, and how lint tools
//     enforce the "only call hooks at the top level" rule for it too.
//   - inside, it's just a normal function that calls useState/useEffect/etc
//     and RETURNS whatever the calling component needs (values, setters).
//   - each component that calls it gets its OWN independent state — a
//     custom hook is a recipe for state, not shared state itself.

import { useState, useEffect } from 'react';

// CUSTOM HOOK 1: a boolean that flips — replaces repeating
// `const [x, setX] = useState(false); const toggle = () => setX(v => !v)`
// in every component that needs an on/off flag.
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}

// CUSTOM HOOK 2: state that stays in sync with localStorage, so it
// survives a page refresh. Wraps useState + a useEffect in one call.
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// CUSTOM HOOK 3: tracks browser online/offline status — wraps a
// subscription (with cleanup) that would otherwise be copy-pasted
// into every component that cares about connectivity.
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}

// --- Components using the custom hooks above ---

function DarkModeToggle() {
  const [isDark, toggle] = useToggle(false);
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3>useToggle</h3>
      <div
        style={{
          padding: '0.75rem',
          background: isDark ? '#222' : '#f5f5f5',
          color: isDark ? '#fff' : '#000',
          borderRadius: 6,
        }}
      >
        {isDark ? 'Dark mode' : 'Light mode'}
      </div>
      <button onClick={toggle} style={{ marginTop: '0.5rem' }}>
        Toggle
      </button>
    </div>
  );
}

function DraftNote() {
  const [note, setNote] = useLocalStorage('lesson7-note', '');
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3>useLocalStorage</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type something, then refresh the page..."
        rows={2}
        style={{ width: '100%' }}
      />
      <p style={{ color: '#666' }}>Survives a page refresh — try it.</p>
    </div>
  );
}

function ConnectivityBadge() {
  const online = useOnlineStatus();
  return (
    <div>
      <h3>useOnlineStatus</h3>
      <p style={{ color: online ? 'green' : 'crimson' }}>
        {online ? '● Online' : '● Offline — try turning off wifi'}
      </p>
    </div>
  );
}

export default function Lesson7CustomHooks() {
  return (
    <div>
      <h2>Lesson 7: Custom hooks</h2>
      <DarkModeToggle />
      <DraftNote />
      <ConnectivityBadge />

      <p style={{ marginTop: '1rem', color: '#666' }}>
        Try it: write <code>useCounter(initial = 0)</code> that returns{' '}
        <code>[count, increment, decrement, reset]</code> using{' '}
        <code>useState</code> internally, then use it to replace the{' '}
        <code>Counter</code> component back in Lesson 2.
      </p>

      <p style={{ marginTop: '1rem', color: '#888', fontSize: '0.9em' }}>
        That's the core hook set: props (data in), state (data owned),
        conditionals & lists (what to render), effects (talking to the
        outside world), forms (controlled inputs), and custom hooks
        (packaging reusable logic). From here, natural next steps are{' '}
        <code>useContext</code> (avoiding prop-drilling), <code>useRef</code>{' '}
        (values that don't trigger re-renders), and React 19's{' '}
        <code>useOptimistic</code> / Actions for forms — say the word when
        you want to go there.
      </p>
    </div>
  );
}
