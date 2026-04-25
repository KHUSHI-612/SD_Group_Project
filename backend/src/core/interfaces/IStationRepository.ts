import { StationEntity } from "../entities/Station.entity.js";
import type { CreateStationdto, UpdateStationDto } from "../../application/dtos/Station.dto.js";
import type { DBTransactionClient } from "../../shared/types/prisma/index.js";
import { StationStatus, StationMemberRole } from "@prisma/client";

export interface IStationRepository {
    create(data: CreateStationdto, tx?: DBTransactionClient): Promise<StationEntity>;
    delete(id: string, tx?: DBTransactionClient): Promise<StationEntity | null>;
    findAll(filters?: { owner_id?: string; status?: StationStatus }, tx?: DBTransactionClient): Promise<StationEntity[]>;
    findById(id: string, tx?: DBTransactionClient): Promise<StationEntity | null>;
    update(id: string, data: UpdateStationDto, tx?: DBTransactionClient): Promise<StationEntity | null>;
    getMembership(station_id: string, user_id: string, tx?: DBTransactionClient): Promise<StationMemberRole | null>;
    findNearest(lat: number, lng: number, radius: number, tx?: DBTransactionClient): Promise<StationEntity[]>;
}
