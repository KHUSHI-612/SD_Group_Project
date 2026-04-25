import type { IStationRepository } from "../../core/interfaces/IStationRepository.js";
import DatabaseClient from "../database/prisma.client.js";
import { StationEntity } from "../../core/entities/Station.entity.js";
import type { CreateStationdto } from "../../application/dtos/Station.dto.js";
import { StationStatus } from "@prisma/client";
import type { Prisma, PrismaClient } from "@prisma/client";

export class StationRepository implements IStationRepository {
    private prisma = DatabaseClient.getInstance();

    async create(data: CreateStationdto, tx?: PrismaClient | Prisma.TransactionClient): Promise<StationEntity> {
        const client = tx || this.prisma;
        const station = await client.station.create({
            data: {
                station_id: crypto.randomUUID(),
                owner_id: data.owner_id,
                name: data.name,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                helpline_number: data.helpline_number,
                documents: data.documents,
                working_days: data.working_days,
                opensAt: data.opensAt,
                closesAt: data.closesAt,
                status: "ACTIVE", 
                approvedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return new StationEntity(
            station.station_id,
            station.owner_id,
            station.name,
            station.address,
            station.latitude,
            station.longitude,
            station.helpline_number,
            station.documents as Record<string, string>,
            station.working_days as Record<string, boolean>,
            station.opensAt,
            station.closesAt,
            station.status,
            station.approvedAt,
            station.createdAt,
            station.updatedAt
        );
    }
}
