// LESSON 6: Forms & controlled inputs
//
// In plain HTML, an <input> keeps its own value internally and you read it
// from the DOM when you need it. Angular has TWO ways to avoid that:
//
//   1. Template-driven forms (ngModel) — bind each field straight to a
//      signal/property, like Lesson 2's NameInput. Fine for a couple of
//      fields.
//   2. Reactive forms (FormGroup/FormControl) — build the form's shape as
//      an object in the class, with validation rules attached. Scales
//      better once you have many fields, cross-field validation, or need
//      to test form logic without touching the DOM.

import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Template-driven: each field is its own signal, bound with [ngModel]/(ngModelChange).
@Component({
  selector: 'lesson6-simple-form',
  imports: [FormsModule],
  template: `
    <div style="margin-bottom: 1.5rem">
      <h3>Simple login form (template-driven)</h3>
      <form (submit)="handleSubmit($event)">
        <input
          type="email"
          [ngModel]="email()"
          (ngModelChange)="email.set($event)"
          name="email"
          placeholder="Email"
        />
        <input
          type="password"
          [ngModel]="password()"
          (ngModelChange)="password.set($event)"
          name="password"
          placeholder="Password"
        />
        <button type="submit">Log in</button>
      </form>
      @if (submitted()) {
        <p style="color: #666">
          Submitted: {{ submitted()!.email }} /
          {{ '*'.repeat(submitted()!.password.length) }}
        </p>
      }
    </div>
  `,
})
export class SimpleForm {
  email = signal('');
  password = signal('');
  submitted = signal<{ email: string; password: string } | null>(null);

  handleSubmit(e: Event) {
    e.preventDefault(); // stop the browser's default full-page reload on submit
    this.submitted.set({ email: this.email(), password: this.password() });
  }
}

// Reactive forms: the whole form's shape + validators live in ONE FormGroup,
// built once via FormBuilder. This scales better than one signal per field
// once you have many fields or validation rules.
@Component({
  selector: 'lesson6-profile-form',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <div>
      <h3>Profile form (reactive form + validation)</h3>
      <form (submit)="$event.preventDefault()" [formGroup]="form">
        <div>
          <input formControlName="name" placeholder="Your name" />
        </div>
        <div style="margin: 0.5rem 0">
          <select formControlName="plan">
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="team">Team</option>
          </select>
        </div>
        <div>
          <label>
            <input type="checkbox" formControlName="newsletter" />
            Subscribe to newsletter
          </label>
        </div>
        <div style="margin: 0.5rem 0">
          <textarea formControlName="bio" placeholder="Short bio" rows="2"></textarea>
        </div>
        @if (form.controls['name'].invalid) {
          <p style="color: crimson">Name is required.</p>
        }
        <button type="submit" [disabled]="form.invalid">Save profile</button>
      </form>
      <pre style="background: #f5f5f5; padding: 0.5rem; margin-top: 0.5rem">{{
        form.value | json
      }}</pre>
    </div>
  `,
})
export class ProfileForm {
  private fb = new FormBuilder();

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    plan: ['free'],
    newsletter: [false],
    bio: [''],
  });
}

@Component({
  selector: 'app-lesson6-forms',
  imports: [SimpleForm, ProfileForm],
  template: `
    <h2>Lesson 6: Forms & controlled inputs</h2>
    <lesson6-simple-form />
    <lesson6-profile-form />

    <p style="margin-top: 1rem; color: #666">
      Try it: add an <code>age</code> field to <code>ProfileForm</code>'s
      FormGroup (<code>age: [null]</code>) and a matching
      <code>&lt;input type="number" formControlName="age" /&gt;</code> — no
      new signal needed, the FormGroup already tracks it.
    </p>
  `,
})
export class Lesson6Forms {}
