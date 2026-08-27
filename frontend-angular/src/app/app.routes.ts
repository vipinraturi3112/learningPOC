import { Routes } from '@angular/router';

// As we go, each new lesson gets its own file in src/app/lessons/, and
// gets added to this list. loadComponent lazy-loads it — the code for a
// lesson isn't downloaded until you navigate to it.
export const routes: Routes = [
  { path: '', redirectTo: 'inputs', pathMatch: 'full' },
  {
    path: 'inputs',
    loadComponent: () =>
      import('./lessons/lesson1-inputs').then((m) => m.Lesson1Inputs),
  },
  {
    path: 'signals',
    loadComponent: () =>
      import('./lessons/lesson2-signals').then((m) => m.Lesson2Signals),
  },
  {
    path: 'conditional',
    loadComponent: () =>
      import('./lessons/lesson3-conditional').then((m) => m.Lesson3Conditional),
  },
  {
    path: 'lists',
    loadComponent: () =>
      import('./lessons/lesson4-lists').then((m) => m.Lesson4Lists),
  },
  {
    path: 'effect',
    loadComponent: () =>
      import('./lessons/lesson5-effect').then((m) => m.Lesson5Effect),
  },
  {
    path: 'forms',
    loadComponent: () =>
      import('./lessons/lesson6-forms').then((m) => m.Lesson6Forms),
  },
  {
    path: 'composables',
    loadComponent: () =>
      import('./lessons/lesson7-composables').then((m) => m.Lesson7Composables),
  },
  {
    path: 'reducer',
    loadComponent: () =>
      import('./lessons/lesson8-reducer').then((m) => m.Lesson8Reducer),
  },
];

// Mirrors the routes above — used to render the sidebar nav in app.html.
export const lessonLinks = [
  { path: 'inputs', title: '1. Inputs' },
  { path: 'signals', title: '2. Signals' },
  { path: 'conditional', title: '3. Conditional' },
  { path: 'lists', title: '4. Lists & track' },
  { path: 'effect', title: '5. effect()' },
  { path: 'forms', title: '6. Forms' },
  { path: 'composables', title: '7. Composables' },
  { path: 'reducer', title: '8. Reducer pattern' },
];
