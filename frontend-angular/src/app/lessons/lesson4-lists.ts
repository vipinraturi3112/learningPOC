// LESSON 4: Lists & track
//
// To render an array of data, use Angular's @for block. Angular needs a
// `track` expression so it can identify which item is which across
// re-renders (added/removed/reordered) instead of re-rendering the whole
// list from scratch — this is Angular's equivalent of React's `key`.
//
// Rule of thumb: track should be a STABLE, UNIQUE id from your data
// (e.g. todo.id) — NOT the array index, if the list can reorder, be
// filtered, or have items inserted/removed. Tracking by index can cause
// Angular to mix up state between items when the order changes.

import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const initialTodos: Todo[] = [
  { id: 1, text: 'Learn inputs', done: true },
  { id: 2, text: 'Learn signals', done: true },
  { id: 3, text: 'Learn lists & track', done: false },
  { id: 4, text: 'Learn effect()', done: false },
];

@Component({
  selector: 'app-lesson4-lists',
  imports: [FormsModule],
  template: `
    <h2>Lesson 4: Lists & track</h2>

    <div style="margin-bottom: 1rem">
      <input
        [ngModel]="text()"
        (ngModelChange)="text.set($event)"
        (keydown.enter)="addTodo()"
        placeholder="New todo"
      />
      <button (click)="addTodo()">Add</button>
    </div>

    <ul style="list-style: none; padding: 0">
      <!-- track todo.id -- stable id from data, not the array index -->
      @for (todo of todos(); track todo.id) {
        <li style="margin-bottom: 0.4rem">
          <label [style.text-decoration]="todo.done ? 'line-through' : 'none'">
            <input
              type="checkbox"
              [checked]="todo.done"
              (change)="toggleTodo(todo.id)"
            />
            {{ todo.text }}
          </label>
          <button (click)="removeTodo(todo.id)">✕</button>
        </li>
      }
    </ul>

    <p style="color: #666">{{ doneCount() }} / {{ todos().length }} done</p>

    <p style="margin-top: 1rem; color: #666">
      Try it: add a "Clear completed" button that removes every todo where
      <code>done</code> is true (hint: use <code>.filter</code> like
      <code>removeTodo</code> does).
    </p>
  `,
})
export class Lesson4Lists {
  todos = signal<Todo[]>(initialTodos);
  nextId = signal(5);
  text = signal('');

  doneCount() {
    return this.todos().filter((t) => t.done).length;
  }

  addTodo() {
    if (!this.text().trim()) return;
    // never mutate state directly (no todos().push) — build a NEW array
    this.todos.update((prev) => [
      ...prev,
      { id: this.nextId(), text: this.text(), done: false },
    ]);
    this.nextId.update((n) => n + 1);
    this.text.set('');
  }

  toggleTodo(id: number) {
    this.todos.update((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  removeTodo(id: number) {
    this.todos.update((prev) => prev.filter((t) => t.id !== id));
  }
}
