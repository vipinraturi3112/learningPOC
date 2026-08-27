// LESSON 8: The reducer pattern
//
// So far, state changes have looked like `value.set(x)` / `value.update(fn)`
// calls scattered across event handlers. That's fine for one or two
// independent values. It gets messy once a piece of state has several
// related ways it can change (add/remove/toggle an item, undo, reset...) —
// the "how state changes" logic ends up duplicated or spread across many
// handlers.
//
// Angular has no built-in useReducer, but the pattern is just a few lines
// on top of signal() — and it's worth knowing because it's the exact
// mental model NgRx (and Redux) use, minus the library:
//
//   function reducer(state, action) { ... return newState; }
//   const state = signal(initialState);
//   const dispatch = (action) => state.update((s) => reducer(s, action));
//
//   - `reducer(state, action)` is a PURE function: given the current state
//     and an action describing what happened, it RETURNS the next state.
//     It never mutates `state` directly — always return a new object/array.
//   - `dispatch(action)` is how components ask for a change. They don't
//     say *how* state should change, just *what happened*
//     (e.g. { type: 'add', text: 'Milk' }) — the reducer decides the rest.

import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// A small reusable helper — this is literally what useReducer does under
// the hood: pair a signal with a dispatch function that runs it through a
// reducer.
function useReducerSignal<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S
) {
  const state = signal(initialState);
  const dispatch = (action: A) => state.update((s) => reducer(s, action));
  return { state, dispatch };
}

// --- Example 1: counter, plain signal vs reducer, side by side ---
// Small enough that a reducer is arguably overkill — shown here just to
// see the two styles solve the same problem before moving to a case where
// the reducer actually earns its keep.

@Component({
  selector: 'lesson8-counter-with-signal',
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <button (click)="count.update((c) => c + 1)">+1</button>
      <button (click)="count.update((c) => c - 1)">-1</button>
      <button (click)="count.set(0)">Reset</button>
    </div>
  `,
})
export class CounterWithSignal {
  count = signal(0);
}

type CounterAction = { type: 'increment' | 'decrement' | 'reset' };

function counterReducer(state: { count: number }, action: CounterAction) {
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
      throw new Error(`Unknown action: ${(action as CounterAction).type}`);
  }
}

@Component({
  selector: 'lesson8-counter-with-reducer',
  template: `
    <div>
      <p>Count: {{ counter.state().count }}</p>
      <button (click)="counter.dispatch({ type: 'increment' })">+1</button>
      <button (click)="counter.dispatch({ type: 'decrement' })">-1</button>
      <button (click)="counter.dispatch({ type: 'reset' })">Reset</button>
    </div>
  `,
})
export class CounterWithReducer {
  counter = useReducerSignal(counterReducer, { count: 0 });
}

// --- Example 2: a todo list — where the reducer earns its keep ---
// Three different ways this array can change (add, toggle, remove), each
// needing to copy-and-modify the array immutably. Without a reducer, each
// handler would repeat that array logic inline. With one, every handler
// is just a one-line dispatch, and all the "how" lives in one place you
// can read top to bottom.

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

type TodoAction =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number };

function todosReducer(todos: Todo[], action: TodoAction): Todo[] {
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
      throw new Error(`Unknown action: ${(action as TodoAction).type}`);
  }
}

@Component({
  selector: 'lesson8-todo-list',
  imports: [FormsModule],
  template: `
    <div>
      <form (submit)="handleAdd($event)" style="margin-bottom: 0.75rem">
        <input
          [ngModel]="text()"
          (ngModelChange)="text.set($event)"
          name="text"
          placeholder="New todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul style="padding-left: 1.25rem">
        @for (t of todos.state(); track t.id) {
          <li>
            <label [style.text-decoration]="t.done ? 'line-through' : 'none'">
              <input
                type="checkbox"
                [checked]="t.done"
                (change)="todos.dispatch({ type: 'toggle', id: t.id })"
              />
              {{ t.text }}
            </label>
            <button (click)="todos.dispatch({ type: 'remove', id: t.id })">✕</button>
          </li>
        }
      </ul>
      @if (todos.state().length === 0) {
        <p style="color: #666">No todos yet.</p>
      }
    </div>
  `,
})
export class TodoList {
  todos = useReducerSignal(todosReducer, [] as Todo[]);
  text = signal('');

  handleAdd(e: Event) {
    e.preventDefault();
    if (!this.text().trim()) return;
    this.todos.dispatch({ type: 'add', text: this.text() });
    this.text.set('');
  }
}

@Component({
  selector: 'app-lesson8-reducer',
  imports: [CounterWithSignal, CounterWithReducer, TodoList],
  template: `
    <h2>Lesson 8: The reducer pattern</h2>

    <h3>Plain signal version</h3>
    <lesson8-counter-with-signal />

    <h3 style="margin-top: 1.5rem">Reducer version — same behavior</h3>
    <lesson8-counter-with-reducer />

    <h3 style="margin-top: 1.5rem">Where it pays off: a todo list</h3>
    <lesson8-todo-list />

    <p style="margin-top: 1.5rem; color: #666">
      Try it: add an <code>'edit'</code> action to <code>todosReducer</code>
      that takes <code>{{ '{ type: \\'edit\\', id, text }' }}</code> and
      updates a todo's text — same <code>.map()</code> shape as
      <code>'toggle'</code>, just changing a different field.
    </p>

    <p style="margin-top: 1rem; color: #888; font-size: 0.9em">
      Rule of thumb: reach for the reducer pattern when one piece of state
      has several distinct ways it can change, or when the next state
      depends on the previous state in a non-trivial way. For a single flag
      or field, a plain <code>signal()</code> is still simpler. Natural next
      step: package this behind an injectable service so multiple
      components can share one <code>dispatch</code> — that's the seed of
      an NgRx-style store.
    </p>
  `,
})
export class Lesson8Reducer {}
