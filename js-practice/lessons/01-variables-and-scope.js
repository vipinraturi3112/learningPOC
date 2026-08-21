// LESSON 1: Variables, scope, and const-by-default
//
// Run this file directly to see it in action:  node 01-variables-and-scope.js
//
// JavaScript has three ways to declare a variable: var, let, const.
// Good practice: reach for `const` by default, `let` only when you know
// the value must change, and avoid `var` entirely in modern code.
//
//   - `const` — can't be reassigned. Signals "this name always points at
//     the same value" to anyone reading the code later (often future you).
//   - `let`   — can be reassigned. Use it for loop counters, accumulators,
//     anything that genuinely varies.
//   - `var`   — function-scoped (or global), NOT block-scoped, and hoisted
//     in a way that lets you read it before its declaration line (as
//     `undefined`, silently). This is the source of a lot of classic JS
//     bugs — see the loop example below.

// --- 1. Block scope: let/const vs var ---

function blockScopeDemo() {
  if (true) {
    var fromVar = 'var leaks out of the block';
    let fromLet = 'let stays inside the block';
    const fromConst = 'const stays inside the block';
    console.log(fromLet, '/', fromConst, '— both only exist right here');
  }

  console.log(fromVar); // works — var ignores the `if` block entirely
  // console.log(fromLet);   // ReferenceError — fromLet doesn't exist here
  // console.log(fromConst); // ReferenceError — same for fromConst
}

// --- 2. The classic var-in-a-loop bug ---
//
// This is the single most common reason "use let, not var" is a rule.

function varLoopBug() {
  const fns = [];
  for (var i = 0; i < 3; i++) {
    // All three closures below share the SAME `i`, because `var` is
    // function-scoped, not per-iteration. By the time they run, the loop
    // has already finished and i is 3.
    fns.push(() => i);
  }
  return fns.map((fn) => fn()); // [3, 3, 3] — almost certainly not what you wanted
}

function letLoopFix() {
  const fns = [];
  for (let i = 0; i < 3; i++) {
    // `let` creates a FRESH binding of i for every iteration, so each
    // closure captures its own snapshot.
    fns.push(() => i);
  }
  return fns.map((fn) => fn()); // [0, 1, 2] — what you actually wanted
}

// --- 3. const doesn't mean "frozen", it means "can't be reassigned" ---
//
// A common misconception: const objects/arrays ARE still mutable. const
// only locks the *variable binding*, not the *contents*.

function constIsNotFrozen() {
  const user = { name: 'Vipin', role: 'Developer' };
  user.role = 'Senior Developer'; // fine — mutating the object is allowed
  // user = { name: 'Someone else' }; // TypeError — reassigning the binding is not

  return user;
}

// --- 4. Naming: make the value's shape and intent obvious from the name ---
//
// - camelCase for variables/functions, PascalCase for classes/components.
// - booleans read as yes/no questions: isActive, hasPermission, canEdit —
//   not `flag`, `status`, or `check`.
// - plural names for arrays/collections: `users`, not `userList` (the
//   "List" is redundant — the plural already says it's a collection).
// - avoid single-letter names outside of tiny loop counters (i, j) or
//   well-known math contexts.

const isLoggedIn = true; // good — reads as a question
const hasItemsInCart = false; // good
// const flag1 = true;    // bad — what does flag1 even mean?

const activeUsers = ['Vipin', 'Asha']; // good — plural, no redundant suffix
// const userList = ['Vipin', 'Asha']; // avoid — "List" adds nothing `[]` doesn't already say

// --- run everything and print results ---

blockScopeDemo();
console.log('var loop bug:', varLoopBug());
console.log('let loop fix:', letLoopFix());
console.log('const mutated:', constIsNotFrozen());
console.log({ isLoggedIn, hasItemsInCart, activeUsers });

// --- Try it ---
//
// 1. Below, `buildMultipliers` has the same var-in-a-loop bug as
//    `varLoopBug` above. Fix it by changing ONE keyword.
// 2. Then run this file again — the self-check at the bottom will tell
//    you if you got it right.

function buildMultipliers() {
  const multipliers = [];
  for (var factor = 1; factor <= 3; factor++) {
    multipliers.push((n) => n * factor);
  }
  return multipliers;
}

// --- self-check: run automatically, no test framework needed ---

const results = buildMultipliers().map((fn) => fn(10));
const expected = [10, 20, 30];
const passed = JSON.stringify(results) === JSON.stringify(expected);

console.log('\n--- self-check ---');
console.log('buildMultipliers()(10) for each ->', results);
console.log(
  passed
    ? '✅ passed — factor is per-iteration now'
    : `❌ not yet — got ${JSON.stringify(results)}, expected ${JSON.stringify(expected)} (hint: var -> let)`
);
