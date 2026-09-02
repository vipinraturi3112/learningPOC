// middleware/logger.js — one LINK in the middleware chain
// (Chain of Responsibility: each link does its bit, then passes control on)

export function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // pass control to the next link
}
