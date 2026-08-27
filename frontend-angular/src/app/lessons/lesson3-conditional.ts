// LESSON 3: Conditional rendering
//
// Angular templates have their own control-flow syntax (since v17) —
// @if / @else — instead of plain JS if/ternary/&&. It compiles to
// efficient DOM updates and reads close to the language it replaces.

import { Component, signal } from '@angular/core';

// PATTERN 1: @if / @else — pick which markup to show, for two very
// different chunks of content.
@Component({
  selector: 'lesson3-login-status',
  template: `
    @if (isLoggedIn()) {
      <p>Welcome back! ✅</p>
    } @else {
      <p>Please log in. 🔒</p>
    }
  `,
})
export class LoginStatus {
  isLoggedIn = signal(false);
}

// PATTERN 2: an inline expression bound to [style]/text — good for small,
// either/or values, same idea as a ternary inside JSX.
@Component({
  selector: 'lesson3-status-badge',
  template: `
    <span [style.color]="online() ? 'green' : 'gray'">
      {{ online() ? '● Online' : '● Offline' }}
    </span>
  `,
})
export class StatusBadge {
  online = signal(true);
}

// PATTERN 3: @if with no @else — render something ONLY if a condition is
// true, render nothing otherwise (Angular's equivalent of JSX's `&&`).
@Component({
  selector: 'lesson3-cart',
  template: `
    <div>
      <p>Cart items: {{ itemCount() }}</p>
      @if (itemCount() === 0) {
        <p style="color: crimson">Your cart is empty.</p>
      }
      @if (itemCount() > 5) {
        <p style="color: orange">Big order! Free shipping applied.</p>
      }
    </div>
  `,
})
export class Cart {
  itemCount = signal(0);
}

@Component({
  selector: 'app-lesson3-conditional',
  imports: [LoginStatus, StatusBadge, Cart],
  template: `
    <h2>Lesson 3: Conditional rendering</h2>

    <section style="margin-bottom: 1.5rem">
      <lesson3-login-status #login />
      <button (click)="login.isLoggedIn.update((v) => !v)">Toggle login</button>
    </section>

    <section style="margin-bottom: 1.5rem">
      <lesson3-status-badge #status />
      <button (click)="status.online.update((v) => !v)">Toggle status</button>
    </section>

    <section>
      <lesson3-cart #cart />
      <button (click)="cart.itemCount.update((n) => n + 1)">Add item</button>
      <button (click)="cart.itemCount.set(0)">Empty cart</button>
    </section>

    <p style="margin-top: 1rem; color: #666">
      Try it: in <code>Cart</code>, add a third <code>&#64;if</code> — show a
      message like "Almost free shipping!" when <code>itemCount</code> is
      exactly 4.
    </p>
  `,
})
export class Lesson3Conditional {}
