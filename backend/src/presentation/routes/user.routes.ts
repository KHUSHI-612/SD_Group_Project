import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';
import { UserController } from '../controllers/User.controllers.js';

const router = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

// Account update Routes
router.patch('/profile', authMiddleware.authenticate, userController.updateProfile);
router.patch('/govt-id', authMiddleware.authenticate, upload.single('govt_id'), userController.uploadGovtId);

export default router;