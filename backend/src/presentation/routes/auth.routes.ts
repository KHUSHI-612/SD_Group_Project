import { Router } from 'express';
import { AuthController } from '../controllers/Auth.controllers.js';
// import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', upload.single('govtId'), authController.register);
router.post('/login',  authController.login);

// Protected routes
// router.get('/me', authenticate, authController.getMe);

export default router;