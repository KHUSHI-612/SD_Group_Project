import { Router } from 'express';
import upload from '../middleware/multer.middleware.js';
import { StationRequestController } from '../controllers/StationRequest.controllers.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
const stationRequestController = new StationRequestController();
const authMiddleware = new AuthMiddleware();

// Authenticated Routes
router.post("/", authMiddleware.authenticate, upload.any() ,stationRequestController.create);
router.get("/", authMiddleware.authenticate, stationRequestController.requests);
// SuperAdmin Specific Routes
router.get("/reviewer", authMiddleware.authenticate, authMiddleware.verifySuperAdmin, stationRequestController.getRequestByReviewer);
router.get("/status", authMiddleware.authenticate, authMiddleware.verifySuperAdmin, stationRequestController.getRequestByStatus);
router.patch("/:request_id/reject", authMiddleware.authenticate, authMiddleware.verifySuperAdmin, stationRequestController.rejectRequest);
router.patch("/:request_id/approve", authMiddleware.authenticate, authMiddleware.verifySuperAdmin, stationRequestController.approveRequest);

// Authenticated Routes (Parameterized)
router.get("/:request_id", authMiddleware.authenticate, stationRequestController.findRequestById);
router.patch("/:request_id", authMiddleware.authenticate, stationRequestController.updateDetails);
router.patch("/:request_id/documents", authMiddleware.authenticate, upload.any(), stationRequestController.updateDocuments);

export default router;