// models/User.js — MODEL (the "M" in MVC)
//
// A model's only job is to define the shape of the data and its
// invariants. No DB calls, no business logic — those belong to the
// repository and service layers, one hop further down.

export function createUserDocument({ id, name, email }) {
  if (!email || !email.includes('@')) {
    throw new Error(`Invalid email: ${email}`);
  }
  return { id, name, email, createdAt: new Date().toISOString() };
}
