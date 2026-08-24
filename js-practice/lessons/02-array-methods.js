// LESSON 2: Array methods — map, filter, reduce, and chaining
//
// Run this file directly:  node lessons/02-array-methods.js
//
// A manual for-loop can do anything, but it forces the reader to trace
// through the loop body to figure out WHAT it's doing before they can
// even ask WHY. map/filter/reduce each say the "what" in their own name,
// so the reader knows the shape of the result before reading the body:
//
//   - map(fn)     — TRANSFORM each item 1-for-1. Same length in and out.
//   - filter(fn)  — KEEP items where fn returns true. Same or shorter.
//   - reduce(fn)  — FOLD the whole array down to one value (a sum, an
//                   object, another array — whatever you return).
//
// All three are "pure" in normal use: they return a NEW array/value and
// leave the original array untouched. That's the whole point — no
// accidental mutation for something else to trip over later.

const cart = [
  { name: 'Keyboard', price: 45, qty: 1 },
  { name: 'Mouse', price: 20, qty: 2 },
  { name: 'Monitor', price: 150, qty: 1 },
  { name: 'Cable', price: 5, qty: 0 }, // in the list, but not actually ordered
];

// --- 1. map: same length in, same length out, each item transformed ---

const lineTotals = cart.map((item) => item.price * item.qty);
console.log('line totals:', lineTotals); // one number per cart item, 0 included

// --- 2. filter: keep only what matches, length can shrink ---

const actuallyOrdered = cart.filter((item) => item.qty > 0);
console.log(
  'actually ordered:',
  actuallyOrdered.map((i) => i.name)
);

// --- 3. reduce: fold the whole array into ONE value ---
//
// reduce(fn, initialValue) calls fn(accumulator, item) for every item,
// carrying the return value forward as the next accumulator. The
// initialValue is where the accumulator starts.

const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log('cart total: $' + cartTotal);

// reduce isn't just for sums — it can build any shape. Here it builds an
// object grouping items by whether they were ordered:
const grouped = cart.reduce(
  (groups, item) => {
    const key = item.qty > 0 ? 'ordered' : 'skipped';
    groups[key].push(item.name);
    return groups; // must return the accumulator every time
  },
  { ordered: [], skipped: [] }
);
console.log('grouped:', grouped);

// --- 4. Chaining: filter then map reads like the sentence you'd say out loud ---
//
// "Take the ordered items, then get their names" — filter().map() says
// exactly that, in that order. Chaining also means each step operates on
// a SMALLER array by the time it matters (filter first, transform after),
// rather than transforming everything and then throwing some away.

const orderedNames = cart
  .filter((item) => item.qty > 0)
  .map((item) => item.name);
console.log('ordered names:', orderedNames);

// --- 5. Two common mistakes worth knowing before an interview asks about them ---

// Mistake A: forEach doesn't return anything useful.
const brokenDoubled = [1, 2, 3].forEach((n) => n * 2);
console.log('forEach "result":', brokenDoubled); // undefined — forEach always returns undefined
// Fix: use map when you need a new array back.
const doubled = [1, 2, 3].map((n) => n * 2);
console.log('map result:', doubled); // [2, 4, 6]

// Mistake B: reduce with no initialValue on an empty array throws.
try {
  [].reduce((sum, n) => sum + n); // no initial value + empty array
} catch (err) {
  console.log('reduce without initial value on []:', err.message);
}
// Fix: always pass an initialValue (like the `0` in cartTotal above) —
// it also makes the accumulator's starting shape explicit to the reader.
console.log('safe version:', [].reduce((sum, n) => sum + n, 0)); // 0, no throw

// --- Try it ---
//
// Using reduce, implement `mostExpensiveItem(items)` below: return the
// single item object with the highest `price`. (Don't use Math.max or
// sort — the point is practicing the reduce accumulator pattern, where
// the accumulator is the "best so far" item instead of a number.)

function mostExpensiveItem(items) {
  // TODO: replace this with items.reduce(...)
  return null;
}

// --- self-check ---

const result = mostExpensiveItem(cart);
const expectedName = 'Monitor';
const passed = result && result.name === expectedName;

console.log('\n--- self-check ---');
console.log('mostExpensiveItem(cart) ->', result);
console.log(
  passed
    ? '✅ passed'
    : `❌ not yet — expected the item named "${expectedName}" (hint: reduce((best, item) => ..., items[0]))`
);
