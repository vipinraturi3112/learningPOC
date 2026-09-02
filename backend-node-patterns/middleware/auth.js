// middleware/auth.js — another link; this one can SHORT-CIRCUIT the chain

export function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization header' });
    // ^ chain stops here — next() is never called, later links never run
  }
  req.user = { token };
  next();
}
