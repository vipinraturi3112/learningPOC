// controllers/userController.js — CONTROLLER (the "C" in MVC)
//
// Translates HTTP <-> service calls. No business logic here — that's
// the service's job. No DB access here either — that's the repository's
// job, one layer further down.

import * as userService from '../services/userService.js';

export function register(req, res, next) {
  try {
    const user = userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err); // hand off to errorHandler middleware
  }
}

export function getById(req, res, next) {
  try {
    const user = userService.getUser(Number(req.params.id));
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export function list(req, res) {
  res.json(userService.listUsers());
}
