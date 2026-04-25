import type { IStationRequestRepository } from "../../core/interfaces/IStationRequestRepository.js";
import DatabaseClient from "../database/prisma.client.js";
import { StationRequestEntity } from "../../core/entities/StationRequest.entity.js";
import type { CreateRequestdto, UpdateRequestdto } from "../../application/dtos/StationRequest.dto.js";
import { RequestStatus } from "@prisma/client";
import type { DBTransactionClient } from "../../shared/types/prisma/index.js";

export class StationRequestRepository implements IStationRequestRepository {
    private prisma = DatabaseClient.getInstance();

    async findById(id: string): Promise<StationRequestEntity | null> {
        const request = await this.prisma.stationRequest.findUnique({
            where: {
                request_id: id
            }
        })

        if(request) {
            return new StationRequestEntity (
                request.request_id,
                request.owner_id,
                request.station_name,
                request.latitude,
                request.longitude,
                request.address,
                request.helpline_number,
                request.documents as Record<string, string>,
                request.working_days as Record<string, boolean>,
                request.opensAt,
                request.closesAt,
                request.status,
                request.reviewed_by,
                request.createdAt,
                request.updatedAt
            )
        } else {
            return null
        }
    }

    async delete(id: string): Promise<StationRequestEntity | null> {
        const request = await this.prisma.stationRequest.delete({
            where: {
                request_id: id
            }
        })
        if (request) {
            return new StationRequestEntity (
                request.request_id,
                request.owner_id,
                request.station_name,
                request.latitude,
                request.longitude,
                request.address,
                request.helpline_number,
                request.documents as Record<string, string>,
                request.working_days as Record<string, boolean>,
                request.opensAt,
                request.closesAt,
                request.status,
                request.reviewed_by,
                request.createdAt,
                request.updatedAt
            )
        } else {
            return null
        }
    }

    async findAll(): Promise<StationRequestEntity[] | null[]> {
        const requests = await this.prisma.stationRequest.findMany();
        return requests.map((request) => {
            return new StationRequestEntity (
                request.request_id,
                request.owner_id,
                request.station_name,
                request.latitude,
                request.longitude,
                request.address,
                request.helpline_number,
                request.documents as Record<string, string>,
                request.working_days as Record<string, boolean>,
                request.opensAt,
                request.closesAt,
                request.status,
                request.reviewed_by,
                request.createdAt,
                request.updatedAt
            )
        })
    }

    async create(data: CreateRequestdto, documents: Record<string, string>): Promise<StationRequestEntity> {
        // console.log(data);
        // console.log(documents);
        const request = await this.prisma.stationRequest.create({
            data: {
                request_id: crypto.randomUUID(),
                ...data,
                status: "PENDING",
                documents,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })
        return new StationRequestEntity(
            request.request_id,
            request.owner_id,
            request.station_name,
            request.latitude,
            request.longitude,
            request.address,
            request.helpline_number,
            request.documents as Record<string, string>,
            request.working_days as Record<string, boolean>,
            request.opensAt,
            request.closesAt,
            request.status,
            request.reviewed_by,
            request.createdAt,
            request.updatedAt
        )
    }

    async update(id: string, data: UpdateRequestdto, tx?: DBTransactionClient): Promise<StationRequestEntity | null> {
        const client = tx || this.prisma;
        const request = await client.stationRequest.update({
            where: {
                request_id: id
            },
            data: {
                ...data
            }
        })
        if(request) {
            return new StationRequestEntity(
                request.request_id,
                request.owner_id,
                request.station_name,
                request.latitude,
                request.longitude,
                request.address,
                request.helpline_number,
                request.documents as Record<string, string>,
                request.working_days as Record<string, boolean>,
                request.opensAt,
                request.closesAt,
                request.status,
                request.reviewed_by,
                request.createdAt,
                request.updatedAt
            )
        } else {
            return null
        }
    }

    async findByOwner(owner_id: string): Promise<StationRequestEntity[]> {
        const requests = await this.prisma.stationRequest.findMany({
            where: {
                owner_id
            }
        })
        return requests.map((request) => {
            return new StationRequestEntity(
                request.request_id,
                request.owner_id,
                request.station_name,
                request.latitude,
                request.longitude,
                request.address,
                request.helpline_number,
                request.documents as Record<string, string>,
                request.working_days as Record<string, boolean>,
                request.opensAt,
                request.closesAt,
                request.status,
                request.reviewed_by,
                request.createdAt,
                request.updatedAt
            )
        })
    }

    async findByStatus(status: RequestStatus): Promise<StationRequestEntity[] | null> {
        const requests = await this.prisma.stationRequest.findMany({
            where: {
                status
            }
        })
        return requests.map((request) => {
            return new StationRequestEntity(
                request.request_id,
                request.owner_id,
                request.station_name,
                request.latitude,
                request.longitude,
                request.address,
                request.helpline_number,
                request.documents as Record<string, string>,
                request.working_days as Record<string, boolean>,
                request.opensAt,
                request.closesAt,
                request.status,
                request.reviewed_by,
                request.createdAt,
                request.updatedAt
            )
        }) 
    }

    async findByReviewer(reviewer_id: string | null): Promise<StationRequestEntity[] | null> {
        const requests = await this.prisma.stationRequest.findMany({
            where: {
                reviewed_by: reviewer_id
            }
        })
        return requests.map((request) => {
            return new StationRequestEntity(
                request.request_id,
                request.owner_id,
                request.station_name,
                request.latitude,
                request.longitude,
                request.address,
                request.helpline_number,
                request.documents as Record<string, string>,
                request.working_days as Record<string, boolean>,
                request.opensAt,
                request.closesAt,
                request.status,
                request.reviewed_by,
                request.createdAt,
                request.updatedAt
            )
        })
    }
}