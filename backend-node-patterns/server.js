// server.js — LESSON: Design Patterns in a MEAN-stack backend
//
// Run this file:  npm install && npm start
// Then try (in another terminal):
//
//   curl localhost:3000/api/users
//     -> 401, no Authorization header (the auth middleware short-circuits)
//
//   curl -H "Authorization: x" -X POST localhost:3000/api/users \
//        -H "Content-Type: application/json" \
//        -d '{"name":"Ada","email":"ada@example.com"}'
//     -> 201, created user (watch the console for the notifier + logger output)
//
//   curl -H "Authorization: x" localhost:3000/api/users
//     -> 200, [{ id: 1, name: "Ada", ... }]
//
// Six patterns are wired together here:
//   MODULE     — every file, via import/export
//   SINGLETON  — db.js's cached module instance
//   FACTORY    — services/notifierFactory.js
//   REPOSITORY — repositories/userRepository.js
//   MIDDLEWARE CHAIN (Chain of Responsibility) — the app.use() calls below
//   MVC        — models/, controllers/, routes/

import express from 'express';
import './db.js'; // establishes the "connection" once (Singleton)
import { requestLogger } from './middleware/logger.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(express.json()); // parse JSON bodies — link 1
app.use(requestLogger); // log every request — link 2
app.use('/api', authenticate); // require auth for /api/* — link 3 (can short-circuit)
app.use('/api/users', usersRouter); // route to controllers — link 4
app.use(errorHandler); // catch errors from any link above — terminal link

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
