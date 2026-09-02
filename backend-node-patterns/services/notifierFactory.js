// services/notifierFactory.js — FACTORY pattern
//
// Callers ask for "a notifier of this type" without knowing which class
// gets built or how. Add a new channel (push, slack, ...) by adding a
// case here — nothing that CALLS the factory has to change.

class EmailNotifier {
  send(user, message) {
    console.log(`[email] to ${user.email}: ${message}`);
  }
}

class ConsoleNotifier {
  send(user, message) {
    console.log(`[console] notify ${user.name}: ${message}`);
  }
}

export function createNotifier(type) {
  switch (type) {
    case 'email':
      return new EmailNotifier();
    case 'console':
      return new ConsoleNotifier();
    default:
      throw new Error(`Unknown notifier type: ${type}`);
  }
}
