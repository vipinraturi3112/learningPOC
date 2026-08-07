// LESSON 2: State with useState
//
// Props are data passed IN from a parent (read-only).
// State is data a component OWNS and can change over time — like a
// variable that, when updated, tells React "re-render me with this
// new value." Regular variables don't do that; state does.
//
// const [value, setValue] = useState(initialValue)
//   - `value`      -> the current value (read it like a normal variable)
//   - `setValue`   -> the ONLY correct way to change it
//   - calling setValue schedules a re-render with the new value

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3>Counter</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>{' '}
      <button onClick={() => setCount(count - 1)}>-1</button>{' '}
      <button onClick={() => setCount(0)}>reset</button>
    </div>
  );
}

// Each component's state is INDEPENDENT — two <Counter /> below don't share
// their count, even though they're the same component definition.

function ToggleBox() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3>Toggle</h3>
      <button onClick={() => setIsOn(!isOn)}>
        {isOn ? 'ON' : 'OFF'}
      </button>
      <div
        style={{
          marginTop: '0.5rem',
          width: 60,
          height: 60,
          borderRadius: 8,
          background: isOn ? '#4caf50' : '#ccc',
          transition: 'background 0.2s',
        }}
      />
    </div>
  );
}

// State can hold any value, not just numbers/booleans — here it's a string.
function NameInput() {
  const [name, setName] = useState('');

  return (
    <div>
      <h3>Live text</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name"
      />
      <p>Hello, {name || '...'}</p>
    </div>
  );
}

export default function Lesson2State() {
  return (
    <div>
      <h2>Lesson 2: State with useState</h2>

      <Counter />
      <Counter /> {/* independent state from the one above */}
      <ToggleBox />
      <NameInput />

      <p style={{ marginTop: '1rem', color: '#666' }}>
        Try it: in <code>Counter</code>, change the +1 button to add 5 instead.
        Then notice the two Counters on screen never affect each other — each
        component instance has its own private state.
      </p>
    </div>
  );
}
