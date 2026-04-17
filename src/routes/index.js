import { Router } from 'express';
import userController from '../controllers/user-controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const router = new Router();


router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:activationToken', userController.activate);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/refresh', userController.refresh);
export default router;