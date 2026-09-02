// services/userService.js — SERVICE (business logic layer)
//
// Depends on the REPOSITORY, never on the store or Mongoose directly.
// This is what makes the repository pattern pay off: this file would be
// byte-for-byte identical whether userRepository is backed by an
// in-memory array (this lesson) or a real MongoDB collection.

import * as userRepo from '../repositories/userRepository.js';
import { createNotifier } from './notifierFactory.js';

export function registerUser({ name, email }) {
  if (userRepo.findByEmail(email)) {
    throw new Error(`Email already registered: ${email}`);
  }
  const user = userRepo.create({ name, email });

  const notifier = createNotifier('console');
  notifier.send(user, 'Welcome aboard!');

  return user;
}

export function getUser(id) {
  const user = userRepo.findById(id);
  if (!user) throw new Error(`User not found: ${id}`);
  return user;
}

export function listUsers() {
  return userRepo.findAll();
}
