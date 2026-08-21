// LESSON 8: useReducer
//
// So far, state changes have looked like `setX(newValue)` calls scattered
// across event handlers. That's fine for one or two independent values.
// It gets messy once a piece of state has several related ways it can
// change (add/remove/toggle an item, undo, reset...) — the "how state
// changes" logic ends up duplicated or spread across many handlers.
//
// useReducer centralizes that logic into ONE function:
//
//   const [state, dispatch] = useReducer(reducer, initialState);
//
//   - `reducer(state, action)` is a pure function: given the current state
//     and an action describing what happened, it RETURNS the next state.
//     It never mutates `state` directly — always return a new object/array.
//   - `dispatch(action)` is how components ask for a change. They don't
//     say *how* state should change, just *what happened*
//     (e.g. { type: 'add', text: 'Milk' }) — the reducer decides the rest.
//
// This is the same shape as Array.prototype.reduce: (state, action) => state.
// It's also the exact mental model Redux uses, minus the library.

import { useReducer, useState } from 'react';

// --- Example 1: counter, useState vs useReducer side by side ---
// Small enough that useReducer is arguably overkill — shown here just to
// see the two styles solve the same problem before moving to a case where
// the reducer actually earns its keep.

function CounterWithState() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={() => setCount((c) => c - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      // Unknown action — in a real app, throwing here catches typos in
      // action.type early instead of silently doing nothing.
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function CounterWithReducer() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}

// --- Example 2: a todo list — where the reducer earns its keep ---
// Three different ways this array can change (add, toggle, remove), each
// needing to copy-and-modify the array immutably. Without a reducer, each
// handler would repeat that array logic inline. With one, every handler
// is just a one-line dispatch, and all the "how" lives in one place you
// can read top to bottom.

function todosReducer(todos, action) {
  switch (action.type) {
    case 'add':
      return [...todos, { id: Date.now(), text: action.text, done: false }];
    case 'toggle':
      return todos.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t
      );
    case 'remove':
      return todos.filter((t) => t.id !== action.id);
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function TodoList() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const [text, setText] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: 'add', text });
    setText('');
  }

  return (
    <div>
      <form onSubmit={handleAdd} style={{ marginBottom: '0.75rem' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ paddingLeft: '1.25rem' }}>
        {todos.map((t) => (
          <li key={t.id}>
            <label style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => dispatch({ type: 'toggle', id: t.id })}
              />{' '}
              {t.text}
            </label>{' '}
            <button onClick={() => dispatch({ type: 'remove', id: t.id })}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p style={{ color: '#666' }}>No todos yet.</p>}
    </div>
  );
}

export default function Lesson8Reducer() {
  return (
    <div>
      <h2>Lesson 8: useReducer</h2>

      <h3>useState version</h3>
      <CounterWithState />

      <h3 style={{ marginTop: '1.5rem' }}>useReducer version — same behavior</h3>
      <CounterWithReducer />

      <h3 style={{ marginTop: '1.5rem' }}>Where it pays off: a todo list</h3>
      <TodoList />

      <p style={{ marginTop: '1.5rem', color: '#666' }}>
        Try it: add an <code>'edit'</code> action to <code>todosReducer</code>{' '}
        that takes <code>{'{ type: \'edit\', id, text }'}</code> and updates a
        todo's text — same <code>.map()</code> shape as <code>'toggle'</code>,
        just changing a different field.
      </p>

      <p style={{ marginTop: '1rem', color: '#888', fontSize: '0.9em' }}>
        Rule of thumb: reach for <code>useReducer</code> when one state value
        has several distinct ways it can change, or when the next state
        depends on the previous state in a non-trivial way. For a single
        flag or field, <code>useState</code> is still simpler. Natural next
        step: <code>useContext</code> — passing <code>state</code> and{' '}
        <code>dispatch</code> down through the tree without prop-drilling
        them through every level.
      </p>
    </div>
  );
}
