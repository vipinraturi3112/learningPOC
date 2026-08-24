// LESSON 3: Microtasks vs macrotasks (the event loop)
//
// Run this file directly:  node lessons/03-microtasks-vs-macrotasks.js
//
// JS runs on ONE thread. When code calls something async (setTimeout, a
// Promise, an HTTP request...), it doesn't block — it hands the callback
// off to be run LATER, once the current synchronous code has finished.
// "Later" is governed by two separate queues, checked in this order,
// forever, in a loop:
//
//   1. Run all synchronous code top to bottom (the "call stack").
//   2. Drain the MICROTASK queue completely — every microtask, including
//      ones that got added WHILE draining. Promise .then/.catch/.finally
//      callbacks and async/await resumptions go here.
//   3. Run exactly ONE task from the MACROTASK queue (setTimeout,
//      setInterval, I/O callbacks).
//   4. Go back to step 2.
//
// The rule that surprises people: microtasks ALWAYS fully drain before
// the next macrotask runs — even a setTimeout(fn, 0) has to wait for
// every pending .then() to finish first.

// --- 1. Sync code always wins, no matter what's scheduled first ---

console.log('1: sync start');
setTimeout(() => console.log('4: macrotask (setTimeout)'), 0);
Promise.resolve().then(() => console.log('3: microtask (promise.then)'));
console.log('2: sync end');

// Actual order: 1, 2, 3, 4 — NOT the order they were written in. Both
// setTimeout and .then() are scheduled immediately, but scheduling isn't
// running: the sync lines (1, 2) finish first, then microtasks (3) drain
// before the one macrotask (4) gets its turn.

// --- 2. Microtasks queued DURING draining still go before the macrotask ---

setTimeout(() => console.log('7: macrotask, ran last'), 0);
Promise.resolve().then(() => {
  console.log('5: microtask 1');
  // this schedules a NEW microtask while microtask 1 is still running —
  // it still cuts in front of the macrotask above.
  Promise.resolve().then(() => console.log('6: microtask 2 (queued during microtask 1)'));
});

// --- 3. async/await is just Promise .then() with nicer syntax ---
//
// Everything after an `await` runs as a microtask — the function
// literally pauses and resumes the same way a .then() callback would.

async function demo() {
  console.log('8: async fn — runs sync, up to the first await');
  await null;
  console.log('10: async fn — resumes as a microtask, after "9"');
}

console.log('(calling demo...)');
demo();
console.log('9: sync code right after calling demo() — runs BEFORE the resume');

// Node-specific footnote (only matters if you're targeting Node, not the
// browser): process.nextTick() drains before Promise microtasks, on its
// own even-higher-priority queue. It comes up in Node-specific interviews
// but isn't part of the browser event loop spec.

// --- Try it ---
//
// Fill in the two TODOs below so `order` ends up:
//   ['A: sync start', 'B: sync end', 'C: microtask', 'D: macrotask']
//
// Use Promise.resolve().then(...) for the microtask and setTimeout(...)
// for the macrotask — same pattern as the demos above.

function exerciseDemo() {
  const order = [];
  const record = (label) => order.push(label);

  record('A: sync start');

  setTimeout(() => record('D: macrotask'), 0);

  Promise.resolve().then(() => record('C: microtask'));

  record('B: sync end');

  // Waits long enough for both the microtask queue and the macrotask
  // above to have run, then checks the final order.
  setTimeout(() => {
    const expected = ['A: sync start', 'B: sync end', 'C: microtask', 'D: macrotask'];
    const passed = JSON.stringify(order) === JSON.stringify(expected);

    console.log('\n--- self-check ---');
    console.log('order:', order);
    console.log(
      passed
        ? '✅ passed'
        : `❌ not yet — expected ${JSON.stringify(expected)}`
    );
  }, 50);
}

exerciseDemo();
