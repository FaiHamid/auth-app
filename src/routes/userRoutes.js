import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { User } from '../models/user.js';

const router = new Router();

router.get('/users', authMiddleware, async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

export default router;