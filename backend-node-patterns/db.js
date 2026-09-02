// db.js — SINGLETON + MODULE pattern
//
// In a real MEAN app this file would call mongoose.connect(uri) once and
// export the connection. We fake it here with an in-memory store so this
// lesson runs with zero external services — but the SHAPE is identical to
// a real Mongo connection: create it once, share the same instance everywhere.
//
// Why this IS the Singleton pattern for free: Node caches modules by their
// resolved file path. The first `import './db.js'` runs this file and
// creates `store`; every later import gets the SAME cached module object,
// never a fresh one. You don't need a getInstance() class — the module
// system already enforces "exactly one instance exists".

const store = {
  users: [],
  nextId: 1,
};

console.log('[db] connection established (in-memory)');

export default store;
