import { AppError } from "../../shared/error/AppError.js";
import type { CreateStationdto } from "../dtos/Station.dto.js";
import type { IStationRepository } from "../../core/interfaces/IStationRepository.js";
import { RepositoryFactory } from "../../infrastructure/factories/Repository.factory.js";
import type { StationEntity } from "../../core/entities/Station.entity.js";
import type { Prisma, PrismaClient } from "@prisma/client";

export class StationService {
  private stationRepository: IStationRepository;

  constructor() {
    this.stationRepository = RepositoryFactory.getStationRepository();
  }

  create = async (
    createStationdto: CreateStationdto,
    tx?: PrismaClient | Prisma.TransactionClient
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
}
