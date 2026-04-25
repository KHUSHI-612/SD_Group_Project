import { Router } from "express";
import { StationController } from "../controllers/Station.controllers.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { validateGetStationsAccess } from "../middleware/station.middleware.js";

const router = Router();
const stationController = new StationController();
const authMiddleware = new AuthMiddleware();

router.get("/", validateGetStationsAccess, stationController.getStations);
router.get("/:station_id", stationController.getStationById);

router.patch(
    "/:station_id",
    authMiddleware.authenticate,
    authMiddleware.verifyStationRole(["OWNER"]),
    stationController.updateStation
);

router.patch(
    "/:station_id/status",
    authMiddleware.authenticate,
    authMiddleware.verifyStationRole(["OWNER", "MANAGER"]),
    stationController.updateStation
);

router.delete(
    "/:station_id",
    authMiddleware.authenticate,
    authMiddleware.verifyStationRole(["OWNER"]),
    stationController.softDelete
);

export default router;
