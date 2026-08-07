// LESSON 3: Conditional rendering
//
// JSX is just JavaScript, so you show/hide things using normal JS —
// if/else, ternaries, && — there's no special "v-if" syntax like other
// frameworks. A few common patterns below.

import { useState } from 'react';

// PATTERN 1: if/else BEFORE the return — pick which JSX to return.
// Good when the two branches are very different chunks of markup.
function LoginStatus({ isLoggedIn }) {
  if (isLoggedIn) {
    return <p>Welcome back! ✅</p>;
  }
  return <p>Please log in. 🔒</p>;
}

// PATTERN 2: ternary ( condition ? a : b ) INSIDE JSX — good for small,
// inline either/or values.
function StatusBadge({ online }) {
  return (
    <span style={{ color: online ? 'green' : 'gray' }}>
      {online ? '● Online' : '● Offline'}
    </span>
  );
}

// PATTERN 3: && — render something ONLY if a condition is true,
// render nothing otherwise. `false`/`null`/`undefined` render as nothing.
function Cart({ itemCount }) {
  return (
    <div>
      <p>Cart items: {itemCount}</p>
      {itemCount === 0 && <p style={{ color: 'crimson' }}>Your cart is empty.</p>}
      {itemCount > 5 && <p style={{ color: 'orange' }}>Big order! Free shipping applied.</p>}
    </div>
  );
}

export default function Lesson3Conditional() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [online, setOnline] = useState(true);
  const [itemCount, setItemCount] = useState(0);

  return (
    <div>
      <h2>Lesson 3: Conditional rendering</h2>

      <section style={{ marginBottom: '1.5rem' }}>
        <LoginStatus isLoggedIn={isLoggedIn} />
        <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
          Toggle login
        </button>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <StatusBadge online={online} />{' '}
        <button onClick={() => setOnline(!online)}>Toggle status</button>
      </section>

      <section>
        <Cart itemCount={itemCount} />
        <button onClick={() => setItemCount((n) => n + 1)}>Add item</button>{' '}
        <button onClick={() => setItemCount(0)}>Empty cart</button>
      </section>

      <p style={{ marginTop: '1rem', color: '#666' }}>
        Try it: in <code>Cart</code>, add a third condition — show a message
        like "Almost free shipping!" when <code>itemCount</code> is exactly 4.
      </p>
    </div>
  );
}
