import { Router } from 'express';
import { AuthController } from '../controllers/Auth.controllers.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Public routes
router.post('/register', upload.single('govt_id'), authController.register);
router.post('/login',  authController.login);
router.post('/refresh-tokens', authController.refreshTokens);

// Protected routes
router.post('/logout', authMiddleware.authenticate, authController.logout);
router.get('/me', authMiddleware.authenticate, authController.getMe);
router.patch('/change-password', authMiddleware.authenticate, authController.changePassword);
router.delete('/deactivate-account', authMiddleware.authenticate, authController.deactivateAccount);
router.patch('/activate-account', authController.activateAccount);

export default router;