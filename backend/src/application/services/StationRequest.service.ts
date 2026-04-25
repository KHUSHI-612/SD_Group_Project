import { AppError } from "../../shared/error/AppError.js";
import type { CreateRequestdto, UpdateRequestdto } from "../dtos/StationRequest.dto.js";
import DatabaseClient from "../../infrastructure/database/prisma.client.js";
import { Role } from "@prisma/client";
import type { DBTransactionClient } from "../../shared/types/prisma/index.js";
import { StationService } from "./Station.service.js";
import type { IStationRequestRepository } from "../../core/interfaces/IStationRequestRepository.js";
import type { IUserRepository } from "../../core/interfaces/IUserRepository.js";
import { RepositoryFactory } from "../../infrastructure/factories/Repository.factory.js";
import { CloudinaryService } from "../../shared/utils/cloudinary.util.js";
import type { StationRequestEntity } from "../../core/entities/StationRequest.entity.js";
import type { Multer } from "multer";

export class StationRequestService {
  private stationRequestRepository: IStationRequestRepository;
  private userRepository: IUserRepository;
  private cloudinaryService: CloudinaryService;
  private stationService: StationService;

  constructor() {
    this.stationRequestRepository =
      RepositoryFactory.getStationRequestRepository();
    this.userRepository = RepositoryFactory.getUserRepository();
    this.cloudinaryService = new CloudinaryService();
    this.stationService = new StationService();
  }

  private uploadDocuments = async (files: Express.Multer.File[]) => {
    const documents: Record<string, string> = {};
    let urls: string[] = [];

    await Promise.all(
      files.map(async (file) => {
        const result = await this.cloudinaryService.uploadToCloudinary(
          file.path,
        );
        documents[file.fieldname] = result.secure_url;
        urls.push(result.secure_url);
      }),
    );

    return { documents, urls };
  };

  create = async (
    createRequestdto: CreateRequestdto,
    documents: Express.Multer.File[],
  ): Promise<StationRequestEntity> => {
    const existing = await this.stationRequestRepository.findByOwner(
      createRequestdto.owner_id,
    );
    const found = existing?.find(
      (station) => station.station_name == createRequestdto.station_name,
    );

    if (found) {
      throw new AppError("Station already exists", 400);
    }

    let urls: string[] = [];

    try {
      const result = await this.uploadDocuments(documents);
      urls = result.urls;
      const stationRequest = await this.stationRequestRepository.create(
        createRequestdto,
        result.documents,
      );
      return stationRequest;
    } catch (error) {
      await Promise.all(
        urls.map((url) => {
          this.cloudinaryService.deleteFromCloudinary(url).catch(() => null);
        }),
      );
      console.log(error);
      throw new AppError(
        "Something went wrong while creating a Station Request",
        500,
      );
    }
  };

  requests = async (
    user_id: string,
  ): Promise<StationRequestEntity[] | null[]> => {
    const isSuperAdmin = (
      await this.userRepository.getUserRole(user_id)
    ).includes("SUPERADMIN");

    let requests: StationRequestEntity[] | null[];

    if (isSuperAdmin) {
      requests = await this.stationRequestRepository.findAll();
    } else {
      requests = await this.stationRequestRepository.findByOwner(user_id);
    }
    return requests;
  };

  findById = async (
    user_id: string,
    request_id: string,
  ): Promise<StationRequestEntity> => {
    const record = await this.stationRequestRepository.findById(request_id);

    if(!record) {
      throw new AppError("Record not found", 404)
    }

    const isSuperAdmin = (
      await this.userRepository.getUserRole(user_id)
    ).includes("SUPERADMIN");

    if(!isSuperAdmin && record.owner_id !== user_id) {
      throw new AppError("Forbidden", 401)
    }

    return record
  };

  getByReviewer = async (
    reviewer_id: string,
  ): Promise<StationRequestEntity[] | null> => {
    return await this.stationRequestRepository.findByReviewer(reviewer_id);
  };

  getByStatus = async (
    status: any,
  ): Promise<StationRequestEntity[] | null> => {
    return await this.stationRequestRepository.findByStatus(status);
  };

  updateDetails = async (
    user_id: string,
    request_id: string,
    updateData: UpdateRequestdto
  ): Promise<StationRequestEntity | null> => {
    const record = await this.stationRequestRepository.findById(request_id);

    if(!record) {
      throw new AppError("Record not found", 404);
    }

    if(record.owner_id !== user_id) {
      throw new AppError("Forbidden: Only the owner can update the request details", 403);
    }

    return await this.stationRequestRepository.update(request_id, updateData);
  }

  updateDocuments = async (
    user_id: string,
    request_id: string,
    files: Express.Multer.File[]
  ): Promise<StationRequestEntity | null> => {
    const record = await this.stationRequestRepository.findById(request_id);

    if(!record) {
      throw new AppError("Record not found", 404);
    }

    if(record.owner_id !== user_id) {
      throw new AppError("Forbidden: Only the owner can update the request documents", 403);
    }

    if(!files || files.length === 0) {
      throw new AppError("No documents provided for update", 400);
    }

    let urls: string[] = [];

    try {
      const result = await this.uploadDocuments(files);
      urls = result.urls;
      const updatedDocuments = {
        ...result.documents
      };

      return await this.stationRequestRepository.update(request_id, { documents: updatedDocuments });
    } catch (error) {
      await Promise.all(
        urls.map((url) => {
          this.cloudinaryService.deleteFromCloudinary(url).catch(() => null);
        }),
      );
      console.log(error);
      throw new AppError(
        "Something went wrong while updating documents",
        500,
      );
    }
  }

  rejectRequest = async (
    reviewer_id: string,
    request_id: string
  ): Promise<StationRequestEntity | null> => {
    const record = await this.stationRequestRepository.findById(request_id);

    if(!record) {
      throw new AppError("Record not found", 404);
    }

    if(record.status !== "PENDING") {
      throw new AppError("Only PENDING requests can be rejected", 400);
    }

    return await this.stationRequestRepository.update(request_id, {
      status: "REJECTED",
      reviewed_by: reviewer_id
    });
  }

  approveRequest = async (
    reviewer_id: string,
    request_id: string
  ): Promise<any> => {
    const record = await this.stationRequestRepository.findById(request_id);

    if(!record) {
      throw new AppError("Record not found", 404);
    }

    if(record.status !== "PENDING") {
      throw new AppError("Only PENDING requests can be approved", 400);
    }

    const prisma = DatabaseClient.getInstance();

    const result = await prisma.$transaction(async (tx: DBTransactionClient) => {
      const newStation = await this.stationService.create({
        owner_id: record.owner_id,
        name: record.station_name,
        address: record.address,
        latitude: record.latitude,
        longitude: record.longitude,
        helpline_number: record.helpline_number,
        documents: record.documents as Record<string, string> ?? {},
        working_days: record.working_days as Record<string, boolean> ?? {},
        opensAt: record.opensAt,
        closesAt: record.closesAt
      }, tx);

      const userRoles = await this.userRepository.getUserRole(record.owner_id, tx);
      if (!userRoles.includes(Role.OWNER)) {
        await this.userRepository.assignRole(record.owner_id, Role.OWNER, tx);
      }

      const updatedRequest = await this.stationRequestRepository.update(request_id, {
        status: "APPROVED",
        reviewed_by: reviewer_id
      }, tx);

      return { station: newStation, request: updatedRequest };
    });

    return result;
  }
}
