// LESSON 5: useEffect (side effects)
//
// Rendering should be "pure" — just compute JSX from props/state. Anything
// that reaches OUTSIDE the component (timers, subscriptions, changing the
// document title, fetching data) is a "side effect", and useEffect is where
// it belongs. It runs AFTER React updates the screen.
//
//   useEffect(() => {
//     // effect code — runs after render
//     return () => {
//       // optional CLEANUP — runs before the next effect, and on unmount
//     };
//   }, [dependencies]); // effect re-runs only when one of these changes
//
// Dependency array cases:
//   no array at all  -> runs after EVERY render (rarely what you want)
//   []                -> runs ONCE, after the first render
//   [count]           -> runs after first render, and again whenever count changes

import { useState, useEffect } from 'react';

// EXAMPLE 1: sync with something outside React (the document title)
function TitleSync() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Clicked ${count} times`;
    // no cleanup needed here — we're just overwriting the title each time
  }, [count]); // re-run only when `count` changes

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3>Sync document title</h3>
      <p>Count: {count} — check your browser tab title!</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}

// EXAMPLE 2: a timer, with CLEANUP so it doesn't keep running forever
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return; // don't start an interval if not running

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // cleanup: runs when `running` changes again, or component unmounts.
    // Without this, every toggle would stack up ANOTHER interval running
    // in the background — a classic bug.
    return () => clearInterval(id);
  }, [running]);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3>Stopwatch (cleanup)</h3>
      <p>{seconds}s</p>
      <button onClick={() => setRunning(!running)}>
        {running ? 'Pause' : 'Start'}
      </button>{' '}
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}

// EXAMPLE 3: fetching data when a piece of state changes
function UserLookup() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false; // guards against a stale response overwriting a newer one
    setLoading(true);

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true; // if userId changes again before this finishes, ignore it
    };
  }, [userId]); // re-fetch whenever userId changes

  return (
    <div>
      <h3>Fetch on state change</h3>
      <button onClick={() => setUserId((id) => (id % 10) + 1)}>
        Load next user
      </button>
      {loading && <p>Loading...</p>}
      {!loading && user && (
        <p>
          #{user.id} — {user.name} ({user.email})
        </p>
      )}
    </div>
  );
}

export default function Lesson5Effect() {
  return (
    <div>
      <h2>Lesson 5: useEffect (side effects)</h2>
      <TitleSync />
      <Stopwatch />
      <UserLookup />

      <p style={{ marginTop: '1rem', color: '#666' }}>
        Try it: in <code>Stopwatch</code>, remove the{' '}
        <code>return () =&gt; clearInterval(id)</code> line, start it, then
        rapidly click Pause/Start a few times — watch the seconds count jump
        by more than 1 per tick as leftover intervals stack up. Then put the
        cleanup back.
      </p>
    </div>
  );
}
