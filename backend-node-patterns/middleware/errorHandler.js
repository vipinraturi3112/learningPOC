// middleware/errorHandler.js — TERMINAL link
// Catches errors passed via next(err) from any earlier link or controller.
// Express recognizes it as an error handler because it takes 4 arguments.

export function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);
  res.status(400).json({ error: err.message });
}
