import { StationRequestEntity } from "../entities/StationRequest.entity.js";
import type { RequestStatus } from "@prisma/client";
import type { DBTransactionClient } from "../../shared/types/prisma/index.js";
import type { CreateRequestdto, UpdateRequestdto } from "../../application/dtos/StationRequest.dto.js";

export interface IStationRequestRepository {
    findById(id: string): Promise<StationRequestEntity | null>;
    delete(id: string): Promise<StationRequestEntity | null>;
    findAll(): Promise<StationRequestEntity[] | null[]>;
    create(data: CreateRequestdto, documents: Record<string, string>): Promise<StationRequestEntity>;
    update(id: string, data: UpdateRequestdto, tx?: DBTransactionClient): Promise<StationRequestEntity | null>;
    findByOwner(owner_id: string): Promise<StationRequestEntity[]>;
    findByStatus(status: RequestStatus): Promise<StationRequestEntity[] | null>;
    findByReviewer(reviewer_id: string | null): Promise<StationRequestEntity[] | null>;
}