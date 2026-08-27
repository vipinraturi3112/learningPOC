// LESSON 2: State with signal()
//
// Inputs are data passed IN from a parent (read-only).
// A signal is data a component OWNS and can change over time — like a
// variable that, when updated, tells Angular "re-render whatever reads
// this." Regular class fields don't do that; signals do.
//
// const value = signal(initialValue)
//   - value()             -> read the current value (call it like a function)
//   - value.set(x)        -> replace it
//   - value.update(v => ...) -> compute the next value from the current one
//
// Angular's change detection tracks exactly which parts of the template
// read a given signal, and only updates those — not the whole component.

import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lesson2-counter',
  template: `
    <div style="margin-bottom: 1.5rem">
      <h3>Counter</h3>
      <p>Count: {{ count() }}</p>
      <button (click)="count.set(count() + 1)">+1</button>
      <button (click)="count.set(count() - 1)">-1</button>
      <button (click)="count.set(0)">reset</button>
    </div>
  `,
})
export class Counter {
  count = signal(0);
}

// Each component instance's state is INDEPENDENT — two <lesson2-counter>
// below don't share their count, even though they're the same class.

@Component({
  selector: 'lesson2-toggle-box',
  template: `
    <div style="margin-bottom: 1.5rem">
      <h3>Toggle</h3>
      <button (click)="isOn.update((v) => !v)">{{ isOn() ? 'ON' : 'OFF' }}</button>
      <div
        style="margin-top: 0.5rem; width: 60px; height: 60px; border-radius: 8px; transition: background 0.2s"
        [style.background]="isOn() ? '#4caf50' : '#ccc'"
      ></div>
    </div>
  `,
})
export class ToggleBox {
  isOn = signal(false);
}

// A signal can hold any value, not just numbers/booleans — here it's a
// string. ngModel's banana-in-a-box syntax expects a plain property, not
// a signal function, so we bind the two halves separately: [ngModel] reads
// the current value out, (ngModelChange) calls .set() with what the user typed.
@Component({
  selector: 'lesson2-name-input',
  imports: [FormsModule],
  template: `
    <div>
      <h3>Live text</h3>
      <input
        [ngModel]="name()"
        (ngModelChange)="name.set($event)"
        placeholder="Type your name"
      />
      <p>Hello, {{ name() || '...' }}</p>
    </div>
  `,
})
export class NameInput {
  name = signal('');
}

@Component({
  selector: 'app-lesson2-signals',
  imports: [Counter, ToggleBox, NameInput],
  template: `
    <h2>Lesson 2: State with signal()</h2>

    <lesson2-counter />
    <lesson2-counter />
    <!-- independent state from the one above -->
    <lesson2-toggle-box />
    <lesson2-name-input />

    <p style="margin-top: 1rem; color: #666">
      Try it: in <code>Counter</code>, change the +1 button to add 5 instead.
      Then notice the two Counters on screen never affect each other — each
      component instance has its own private signal.
    </p>
  `,
})
export class Lesson2Signals {}
