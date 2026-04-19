
import express from 'express';
import {
    register, activate, login, refresh, logout,
    getUsers
} from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login)
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/activate/:activationToken', activate);
router.get('/users', authMiddleware, getUsers);

export default router;