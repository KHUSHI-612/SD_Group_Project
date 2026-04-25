import type { Request, Response, NextFunction } from "express";
import { StationRequestService } from "../../application/services/StationRequest.service.js";
import type {
  CreateRequestdto,
  UpdateRequestdto,
} from "../../application/dtos/StationRequest.dto.js";
import { AppError } from "../../shared/error/AppError.js";
import { AppResponse } from "../../shared/response/AppResponse.js";
import type { Multer } from "multer";

export class StationRequestController {
  private stationRequestService: StationRequestService;

  constructor() {
    this.stationRequestService = new StationRequestService();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const {
      station_name,
      latitude,
      longitude,
      address,
      helpline_number,
      working_days,
      opensAt,
      closesAt,
    } = req.body;
    // console.log(req.body)
    const documents = req.files as Express.Multer.File[];

    if (
      !station_name ||
      !latitude ||
      !longitude ||
      !address ||
      !helpline_number ||
      !working_days ||
      !opensAt ||
      !closesAt
    ) {
      throw new AppError("All fields are required", 400);
    } else if (helpline_number && !/^\d{10}$/.test(helpline_number)) {
      throw new AppError("Helpline number must be 10 digits", 400);
    } else if (!documents) {
      throw new AppError("Documents are required", 400);
    } else if (
      station_name.trim().length < 3 ||
      station_name.trim().length > 50
    ) {
      throw new AppError(
        "Station name is required and must be between 3 and 50 characters",
      );
    }

    try {
      const result = await this.stationRequestService.create({
        owner_id: req?.user!.user_id,
        station_name,
        latitude: Number(latitude),
        longitude: Number(longitude),
        address,
        helpline_number,
        working_days,
        opensAt,
        closesAt,
      }, documents);

      res
        .status(201)
        .json(
            new AppResponse(
                201,
                result,
                "Station Request created successfully."
            )
        )
    } catch (error) {
        next(error);
    }
  };

  requests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.stationRequestService.requests(req.user!.user_id);
      
      res
      .status(200)
      .json(
        new AppResponse(
          200,
          result,
          "Station Requests fetched successfully."
        )
      )
    } catch (error) {
      next(error)
    }
  };

  findRequestById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const {request_id} = req.params;

    if(!request_id) {
      throw new AppError("No request_id provided", 400)
    }

    try {
      const result = await this.stationRequestService.findById(req?.user!.user_id, request_id as string)

      res
        .status(200)
        .json(
          new AppResponse(
            200,
            result,
            "Request data fetched successfully"
          )
        )
    } catch (error) {
      next(error)
    }
  }
  getRequestByReviewer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { reviewer_id } = req.query;

    if(!reviewer_id) {
       throw new AppError("Reviewer ID is required", 400);
    }
  
    try {
      const result = await this.stationRequestService.getByReviewer(reviewer_id as string);
      
      res
      .status(200)
      .json(
        new AppResponse(
          200,
          result,
          "Station requests fetched successfully by reviewer."
        )
      )
    } catch (error) {
      next(error)
    }
  };

  getRequestByStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { status } = req.query;

    if(!status) {
       throw new AppError("Status is required", 400);
    }

    try {
      const result = await this.stationRequestService.getByStatus(status as any);
      
      res
      .status(200)
      .json(
        new AppResponse(
          200,
          result,
          "Station requests fetched successfully by status."
        )
      )
    } catch (error) {
      next(error)
    }
  };
  updateDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { request_id } = req.params;
    const updateData = req.body;

    if (!request_id) {
       throw new AppError("Request ID is required", 400);
    }

    delete updateData.id;
    delete updateData.request_id;
    delete updateData.owner_id;
    delete updateData.status;
    delete updateData.reviewed_by;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    try {
      const result = await this.stationRequestService.updateDetails(
        req.user!.user_id,
        request_id as string,
        updateData as UpdateRequestdto
      );
      
      res.status(200).json(
        new AppResponse(
          200,
          result,
          "Station request details updated successfully."
        )
      );
    } catch (error) {
      next(error);
    }
  };

  updateDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { request_id } = req.params;
    const documents = req.files as Express.Multer.File[];

    if (!request_id) {
       throw new AppError("Request ID is required", 400);
    }

    try {
      const result = await this.stationRequestService.updateDocuments(
        req.user!.user_id,
        request_id as string,
        documents
      );
      
      res.status(200).json(
        new AppResponse(
          200,
          result,
          "Station request documents updated successfully."
        )
      );
    } catch (error) {
      next(error);
    }
  };

  rejectRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { request_id } = req.params;

    if (!request_id) {
       throw new AppError("Request ID is required", 400);
    }

    try {
      const result = await this.stationRequestService.rejectRequest(
        req.user!.user_id,
        request_id as string
      );
      
      res.status(200).json(
        new AppResponse(
          200,
          result,
          "Station request rejected successfully."
        )
      );
    } catch (error) {
      next(error);
    }
  };

  approveRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { request_id } = req.params;

    if (!request_id) {
       throw new AppError("Request ID is required", 400);
    }

    try {
      const result = await this.stationRequestService.approveRequest(
        req.user!.user_id,
        request_id as string
      );
      
      res.status(200).json(
        new AppResponse(
          200,
          result,
          "Station request approved and station created successfully."
        )
      );
    } catch (error) {
      next(error);
    }
  };
}
