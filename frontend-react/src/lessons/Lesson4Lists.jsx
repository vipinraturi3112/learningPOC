// LESSON 4: Lists & keys
//
// To render an array of data as JSX, use Array.prototype.map() to turn
// each item into an element. React needs a `key` prop on each item so it
// can track which item is which across re-renders (added/removed/reordered)
// instead of re-rendering the whole list from scratch.
//
// Rule of thumb: key should be a STABLE, UNIQUE id from your data
// (e.g. a database id) — NOT the array index, if the list can reorder,
// be filtered, or have items inserted/removed. Index keys can cause React
// to mix up state between items when the order changes.

import { useState } from 'react';

const initialTodos = [
  { id: 1, text: 'Learn props', done: true },
  { id: 2, text: 'Learn state', done: true },
  { id: 3, text: 'Learn lists & keys', done: false },
  { id: 4, text: 'Learn useEffect', done: false },
];

export default function Lesson4Lists() {
  const [todos, setTodos] = useState(initialTodos);
  const [nextId, setNextId] = useState(5);
  const [text, setText] = useState('');

  function addTodo() {
    if (!text.trim()) return;
    // never mutate state directly (no todos.push) — build a NEW array
    setTodos([...todos, { id: nextId, text, done: false }]);
    setNextId(nextId + 1);
    setText('');
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  return (
    <div>
      <h2>Lesson 4: Lists & keys</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="New todo"
        />{' '}
        <button onClick={addTodo}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          // key={todo.id} -- stable id from data, not the array index
          <li key={todo.id} style={{ marginBottom: '0.4rem' }}>
            <label style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />{' '}
              {todo.text}
            </label>{' '}
            <button onClick={() => removeTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>

      <p style={{ color: '#666' }}>
        {todos.filter((t) => t.done).length} / {todos.length} done
      </p>

      <p style={{ marginTop: '1rem', color: '#666' }}>
        Try it: add a "Clear completed" button that removes every todo where{' '}
        <code>done</code> is true (hint: use <code>.filter</code> like{' '}
        <code>removeTodo</code> does).
      </p>
    </div>
  );
}
