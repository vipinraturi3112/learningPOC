// LESSON 1: Components & Inputs
//
// A component is a class decorated with @Component, paired with a template.
// "Inputs" are how a parent component passes data DOWN into a child — like
// function arguments, but for components. This is Angular's equivalent of
// React "props". Inputs are read-only from the child's side: a child must
// never reassign an input signal, only read it.
//
// Signal inputs (Angular 17.1+) are the modern way to declare them:
//
//   name = input<string>();        // optional, starts as undefined
//   name = input.required<string>(); // required — compile error if not passed
//   mood = input('curious');       // optional, with a default value
//
// Read an input the same way you read a signal: call it as a function, `name()`.

import { Component, input } from '@angular/core';

// Greeting is a CHILD component. It receives `name` and `mood` as inputs.
@Component({
  selector: 'lesson1-greeting',
  template: `
    <p>Hey {{ name() }}, you seem <strong>{{ mood() }}</strong> today.</p>
  `,
})
export class Greeting {
  name = input.required<string>();
  mood = input('curious');
}

// UserCard is another child component. It takes a whole `user` object as an input.
interface User {
  name: string;
  role: string;
}

@Component({
  selector: 'lesson1-user-card',
  template: `
    <div style="border: 1px solid #ccc; padding: 0.75rem; border-radius: 8px">
      <h3 style="margin: 0">{{ user().name }}</h3>
      <p style="margin: 0.25rem 0">Role: {{ user().role }}</p>
    </div>
  `,
})
export class UserCard {
  user = input.required<User>();
}

// Lesson1Inputs is the PARENT. It owns the data and passes slices of it
// down to each child via inputs — data flows one-way, top to bottom.
@Component({
  selector: 'app-lesson1-inputs',
  imports: [Greeting, UserCard],
  template: `
    <h2>Lesson 1: Components & Inputs</h2>

    <!-- Passing plain string inputs -->
    <lesson1-greeting name="Vipin" mood="curious" />
    <lesson1-greeting name="Asha" mood="focused" />

    <!-- Passing an object as a single input, bound with [user] -->
    <div style="display: flex; gap: 1rem; margin-top: 1rem">
      @for (u of users; track u.name) {
        <lesson1-user-card [user]="u" />
      }
    </div>

    <p style="margin-top: 1rem; color: #666">
      Try it: add a third field to a user object below (e.g. <code>age</code>),
      then read it inside <code>UserCard</code>'s template with
      <code>user().age</code>.
    </p>
  `,
})
export class Lesson1Inputs {
  users: User[] = [
    { name: 'Vipin', role: 'Developer' },
    { name: 'Asha', role: 'Designer' },
  ];
}
