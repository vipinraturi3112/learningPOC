// routes/users.js — wires URLs to controller functions
// (the router itself is a Facade over the controller layer)

import { Router } from 'express';
import * as userController from '../controllers/userController.js';

const router = Router();

router.get('/', userController.list);
router.get('/:id', userController.getById);
router.post('/', userController.register);

export default router;
