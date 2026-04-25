import type { Request, Response, NextFunction } from "express";
import { StationService } from "../../application/services/Station.service.js";
import { AppResponse } from "../../shared/response/AppResponse.js";
import type { StationStatus } from "@prisma/client";
import { AppError } from "../../shared/error/AppError.js";

export class StationController {
    private stationService: StationService;

    constructor() {
        this.stationService = new StationService();
    }

    getStations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query: any = {};
            
            if (req.query.owner_id) {
                if (!req.user) {
                    throw new AppError("Unauthorized: Login to view your stations", 401);
                }
                
                if (req.user.user_id !== req.query.owner_id) {
                    throw new AppError("Forbidden: You can only view your own stations", 403);
                }

                query.owner_id = req.query.owner_id as string;
            }

            if (req.query.status) query.status = req.query.status as StationStatus;
            
            if (req.query.latitude && req.query.longitude && req.query.radius) {
                query.latitude = parseFloat(req.query.latitude as string);
                query.longitude = parseFloat(req.query.longitude as string);
                query.radius = parseFloat(req.query.radius as string);
            }

            const stations = await this.stationService.getStations(query);
            res.status(200).json(new AppResponse(200, stations, "Stations fetched successfully"));
        } catch (error) {
            next(error);
        }
    };

    getStationById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const station = await this.stationService.getStationById(req.params.station_id as string);
            res.status(200).json(new AppResponse(200, station, "Station fetched successfully"));
        } catch (error) {
            next(error);
        }
    };

    updateStation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const role = req.stationMemberRole!;
            const station = await this.stationService.updateStation(req.params.station_id as string, req.body, role);
            res.status(200).json(new AppResponse(200, station, "Station updated successfully"));
        } catch (error) {
            next(error);
        }
    };

    softDelete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const station = await this.stationService.softDelete(req.params.station_id as string);
            res.status(200).json(new AppResponse(200, station, "Station soft deleted successfully"));
        } catch (error) {
            next(error);
        }
    };
}
