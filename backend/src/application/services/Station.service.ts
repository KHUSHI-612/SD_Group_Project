import { AppError } from "../../shared/error/AppError.js";
import type { CreateStationdto, UpdateStationDto } from "../dtos/Station.dto.js";
import type { IStationRepository } from "../../core/interfaces/IStationRepository.js";
import { RepositoryFactory } from "../../infrastructure/factories/Repository.factory.js";
import type { StationEntity } from "../../core/entities/Station.entity.js";
import type { DBTransactionClient } from "../../shared/types/prisma/index.js";
import { StationStatus, StationMemberRole } from "@prisma/client";

export class StationService {
  private stationRepository: IStationRepository;

  constructor() {
    this.stationRepository = RepositoryFactory.getStationRepository();
  }

  create = async (
    createStationdto: CreateStationdto,
    tx?: DBTransactionClient
  ): Promise<StationEntity> => {
    try {
      const station = await this.stationRepository.create(createStationdto, tx);
      return station;
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Something went wrong while creating a Station",
        500,
      );
    }
  };

  getStations = async (query: { owner_id?: string; latitude?: number; longitude?: number; radius?: number; status?: StationStatus }): Promise<StationEntity[]> => {
      if (query.latitude !== undefined && query.longitude !== undefined && query.radius !== undefined) {
         return await this.stationRepository.findNearest(query.latitude, query.longitude, query.radius);
      }
      const filters: { owner_id?: string; status?: StationStatus } = {};
      if (query.owner_id !== undefined) filters.owner_id = query.owner_id;
      if (query.status !== undefined) filters.status = query.status;
      return await this.stationRepository.findAll(filters);
  };

  getStationById = async (id: string): Promise<StationEntity> => {
      const station = await this.stationRepository.findById(id);
      if (!station) {
          throw new AppError("Station not found", 404);
      }
      return station;
  };

  updateStation = async (id: string, data: UpdateStationDto, role: StationMemberRole): Promise<StationEntity> => {
      let updatePayload = data;

      if (role === "MANAGER") {
          if (!data.status) {
              throw new AppError("Managers can only update the status of the station", 403);
          }
          updatePayload = { status: data.status };
      }

      const station = await this.stationRepository.update(id, updatePayload);
      if (!station) {
          throw new AppError("Station not found", 404);
      }
      return station;
  };

  softDelete = async (id: string): Promise<StationEntity> => {
      const station = await this.stationRepository.update(id, { status: "INACTIVE" });
      if (!station) {
          throw new AppError("Station not found", 404);
      }
      return station;
  };
}
