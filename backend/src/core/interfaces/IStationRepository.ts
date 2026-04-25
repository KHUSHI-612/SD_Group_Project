import { StationEntity } from "../entities/Station.entity.js";
import type { CreateStationdto } from "../../application/dtos/Station.dto.js";
import type { PrismaClient, Prisma } from "@prisma/client";

export interface IStationRepository {
    create(data: CreateStationdto, tx?: PrismaClient | Prisma.TransactionClient): Promise<StationEntity>;
}
