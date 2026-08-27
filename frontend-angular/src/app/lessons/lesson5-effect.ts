// LESSON 5: effect() (side effects)
//
// Rendering (the template) should be "pure" — just compute markup from
// inputs/signals. Anything that reaches OUTSIDE the component (timers,
// subscriptions, changing document.title, fetching data) is a "side
// effect", and effect() is where it belongs. It runs whenever a signal it
// reads changes — Angular tracks the dependencies automatically, there's
// no dependency array to declare by hand.
//
//   constructor() {
//     effect((onCleanup) => {
//       // effect code — runs once immediately, then again whenever
//       // any signal read inside changes
//       onCleanup(() => {
//         // optional CLEANUP — runs before the next run, and on destroy
//       });
//     });
//   }
//
// effect() must be created in an injection context — typically a
// component's constructor, or a field initializer.
//
// NOTE: this app has SSR enabled, and effect() runs on the SERVER during
// prerendering too — where `document`, `window`, and `localStorage` don't
// exist. Any effect that touches a browser-only global has to check
// isPlatformBrowser() first, or the server render crashes.

import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// EXAMPLE 1: sync with something outside Angular (the document title)
@Component({
  selector: 'lesson5-title-sync',
  template: `
    <div style="margin-bottom: 1.5rem">
      <h3>Sync document title</h3>
      <p>Count: {{ count() }} — check your browser tab title!</p>
      <button (click)="count.update((c) => c + 1)">+1</button>
    </div>
  `,
})
export class TitleSync {
  count = signal(0);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    effect(() => {
      if (!this.isBrowser) return; // no `document` on the server
      document.title = `Clicked ${this.count()} times`;
      // no cleanup needed here — we're just overwriting the title each time
    });
  }
}

// EXAMPLE 2: a timer, with CLEANUP so it doesn't keep running forever
@Component({
  selector: 'lesson5-stopwatch',
  template: `
    <div style="margin-bottom: 1.5rem">
      <h3>Stopwatch (cleanup)</h3>
      <p>{{ seconds() }}s</p>
      <button (click)="running.update((r) => !r)">
        {{ running() ? 'Pause' : 'Start' }}
      </button>
      <button (click)="seconds.set(0)">Reset</button>
    </div>
  `,
})
export class Stopwatch {
  seconds = signal(0);
  running = signal(false);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    effect((onCleanup) => {
      if (!this.isBrowser || !this.running()) return; // don't start an interval if not running, or on the server

      const id = setInterval(() => {
        this.seconds.update((s) => s + 1);
      }, 1000);

      // cleanup: runs when `running` changes again, or the component is
      // destroyed. Without this, every toggle would stack up ANOTHER
      // interval running in the background — a classic bug.
      onCleanup(() => clearInterval(id));
    });
  }
}

// EXAMPLE 3: fetching data when a piece of state changes
interface ApiUser {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'lesson5-user-lookup',
  template: `
    <div>
      <h3>Fetch on signal change</h3>
      <button (click)="userId.update((id) => (id % 10) + 1)">
        Load next user
      </button>
      @if (loading()) {
        <p>Loading...</p>
      }
      @if (!loading() && user()) {
        <p>#{{ user()!.id }} — {{ user()!.name }} ({{ user()!.email }})</p>
      }
    </div>
  `,
})
export class UserLookup {
  userId = signal(1);
  user = signal<ApiUser | null>(null);
  loading = signal(false);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    effect((onCleanup) => {
      if (!this.isBrowser) return; // don't fetch during server prerendering
      const id = this.userId();
      const controller = new AbortController();
      this.loading.set(true);

      fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          this.user.set(data);
          this.loading.set(false);
        })
        .catch(() => {}); // aborted fetches reject — ignore them

      // if userId changes again before this finishes, abort the stale request
      onCleanup(() => controller.abort());
    });
  }
}

@Component({
  selector: 'app-lesson5-effect',
  imports: [TitleSync, Stopwatch, UserLookup],
  template: `
    <h2>Lesson 5: effect() (side effects)</h2>
    <lesson5-title-sync />
    <lesson5-stopwatch />
    <lesson5-user-lookup />

    <p style="margin-top: 1rem; color: #666">
      Try it: in <code>Stopwatch</code>, remove the
      <code>onCleanup(() => clearInterval(id))</code> line, start it, then
      rapidly click Pause/Start a few times — watch the seconds count jump
      by more than 1 per tick as leftover intervals stack up. Then put the
      cleanup back.
    </p>
  `,
})
export class Lesson5Effect {}
