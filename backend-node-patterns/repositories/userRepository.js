// repositories/userRepository.js — REPOSITORY pattern
//
// Everything in THIS file knows the store is an in-memory array today.
// Nothing OUTSIDE this file is allowed to know that. Swap `store.users`
// for `User.find()` / `User.create()` (Mongoose) later, and every caller
// of this repository — services, tests — keeps working unchanged.

import store from '../db.js';
import { createUserDocument } from '../models/User.js';

export function findByEmail(email) {
  return store.users.find((u) => u.email === email) ?? null;
}

export function findById(id) {
  return store.users.find((u) => u.id === id) ?? null;
}

export function create({ name, email }) {
  const user = createUserDocument({ id: store.nextId++, name, email });
  store.users.push(user);
  return user;
}

export function findAll() {
  return store.users;
}
