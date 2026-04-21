import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = new Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/activate/:activationToken', authController.activate);

export default router;