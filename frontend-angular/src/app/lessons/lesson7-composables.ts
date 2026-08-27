// LESSON 7: Composables (Angular's answer to custom hooks)
//
// You've now used signal() and effect() several times for the same kinds
// of problems (a toggle, a value synced to localStorage, tracking online
// status...). Angular doesn't need a special naming convention for this —
// a plain function that creates signals/effects and returns them works,
// as long as it's CALLED from an injection context (a constructor, or a
// field initializer, both count). The community calls these "composables".
//
// Rules:
//   - it's just a normal function that calls signal()/effect() and
//     RETURNS whatever the calling component needs.
//   - if it uses effect() internally, it must be invoked somewhere Angular
//     considers an injection context — a component's constructor or field
//     initializer, not inside a click handler or setTimeout.
//   - each component that calls it gets its OWN independent signals — a
//     composable is a recipe for state, not shared state itself.
//
// NOTE: this app has SSR enabled, and effect() runs on the SERVER during
// prerendering too — where `window`/`localStorage`/`navigator.onLine`
// don't exist (or don't mean anything). Composables that touch them guard
// with isPlatformBrowser(), same as Lesson 5.

import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// COMPOSABLE 1: a boolean that flips — replaces repeating
// `const flag = signal(false); const toggle = () => flag.update(v => !v)`
// in every component that needs an on/off switch. No browser globals
// involved, so no platform check needed.
function useToggle(initial = false) {
  const value = signal(initial);
  const toggle = () => value.update((v) => !v);
  return { value, toggle };
}

// COMPOSABLE 2: state that stays in sync with localStorage, so it
// survives a page refresh. Wraps signal() + an effect() in one call.
function useLocalStorage(key: string, initialValue: string) {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const saved = isBrowser ? localStorage.getItem(key) : null;
  const value = signal(saved !== null ? JSON.parse(saved) : initialValue);

  effect(() => {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value()));
  });

  return value;
}

// COMPOSABLE 3: tracks browser online/offline status — wraps a
// subscription (with cleanup) that would otherwise be copy-pasted
// into every component that cares about connectivity.
function useOnlineStatus() {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const online = signal(isBrowser ? navigator.onLine : true);

  effect((onCleanup) => {
    if (!isBrowser) return;
    const goOnline = () => online.set(true);
    const goOffline = () => online.set(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    onCleanup(() => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    });
  });

  return online;
}

// --- Components using the composables above ---

@Component({
  selector: 'lesson7-dark-mode-toggle',
  template: `
    <div style="margin-bottom: 1.5rem">
      <h3>useToggle</h3>
      <div
        style="padding: 0.75rem; border-radius: 6px"
        [style.background]="dark.value() ? '#222' : '#f5f5f5'"
        [style.color]="dark.value() ? '#fff' : '#000'"
      >
        {{ dark.value() ? 'Dark mode' : 'Light mode' }}
      </div>
      <button style="margin-top: 0.5rem" (click)="dark.toggle()">Toggle</button>
    </div>
  `,
})
export class DarkModeToggle {
  dark = useToggle(false);
}

@Component({
  selector: 'lesson7-draft-note',
  template: `
    <div style="margin-bottom: 1.5rem">
      <h3>useLocalStorage</h3>
      <textarea
        [value]="note()"
        (input)="note.set($any($event.target).value)"
        placeholder="Type something, then refresh the page..."
        rows="2"
        style="width: 100%"
      ></textarea>
      <p style="color: #666">Survives a page refresh — try it.</p>
    </div>
  `,
})
export class DraftNote {
  note = useLocalStorage('lesson7-note', '');
}

@Component({
  selector: 'lesson7-connectivity-badge',
  template: `
    <div>
      <h3>useOnlineStatus</h3>
      <p [style.color]="online() ? 'green' : 'crimson'">
        {{ online() ? '● Online' : '● Offline — try turning off wifi' }}
      </p>
    </div>
  `,
})
export class ConnectivityBadge {
  online = useOnlineStatus();
}

@Component({
  selector: 'app-lesson7-composables',
  imports: [DarkModeToggle, DraftNote, ConnectivityBadge],
  template: `
    <h2>Lesson 7: Composables</h2>
    <lesson7-dark-mode-toggle />
    <lesson7-draft-note />
    <lesson7-connectivity-badge />

    <p style="margin-top: 1rem; color: #666">
      Try it: write <code>useCounter(initial = 0)</code> that returns
      <code>{{ '{ count, increment, decrement, reset }' }}</code> using
      <code>signal()</code> internally, then use it to replace the
      <code>Counter</code> component back in Lesson 2.
    </p>

    <p style="margin-top: 1rem; color: #888; font-size: 0.9em">
      That's the core set: inputs (data in), signals (data owned),
      conditionals & lists (what to render), effects (talking to the
      outside world), forms (controlled inputs), and composables (packaging
      reusable logic). From here, natural next steps are dependency-injected
      services (sharing state ACROSS components, not just the recipe for
      it), <code>computed()</code> (derived signals), and route-level
      lazy loading — say the word when you want to go there.
    </p>
  `,
})
export class Lesson7Composables {}
