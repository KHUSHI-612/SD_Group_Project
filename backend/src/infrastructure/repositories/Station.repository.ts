import type { IStationRepository } from "../../core/interfaces/IStationRepository.js";
import DatabaseClient from "../database/prisma.client.js";
import { StationEntity } from "../../core/entities/Station.entity.js";
import type { CreateStationdto, UpdateStationDto } from "../../application/dtos/Station.dto.js";
import { StationStatus, StationMemberRole } from "@prisma/client";
import type { DBTransactionClient } from "../../shared/types/prisma/index.js";

export class StationRepository implements IStationRepository {
    private prisma = DatabaseClient.getInstance();

    private mapToEntity(station: any): StationEntity {
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

    async create(data: CreateStationdto, tx?: DBTransactionClient): Promise<StationEntity> {
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

        return this.mapToEntity(station);
    }

    async delete(id: string, tx?: DBTransactionClient): Promise<StationEntity | null> {
        const client = tx || this.prisma;
        const station = await client.station.delete({
            where: { station_id: id }
        });
        if (!station) return null;
        return this.mapToEntity(station);
    }

    async findAll(filters?: { owner_id?: string; status?: StationStatus }, tx?: DBTransactionClient): Promise<StationEntity[]> {
        const client = tx || this.prisma;
        const where: any = {};
        if (filters?.owner_id) where.owner_id = filters.owner_id;
        if (filters?.status) where.status = filters.status;

        const stations = await client.station.findMany({ where });
        return stations.map(s => this.mapToEntity(s));
    }

    async findById(id: string, tx?: DBTransactionClient): Promise<StationEntity | null> {
        const client = tx || this.prisma;
        const station = await client.station.findUnique({
            where: { station_id: id }
        });
        if (!station) return null;
        return this.mapToEntity(station);
    }

    async update(id: string, data: UpdateStationDto, tx?: DBTransactionClient): Promise<StationEntity | null> {
        const client = tx || this.prisma;
        const station = await client.station.update({
            where: { station_id: id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
        if (!station) return null;
        return this.mapToEntity(station);
    }

    async getMembership(station_id: string, user_id: string, tx?: DBTransactionClient): Promise<StationMemberRole | null> {
        const client = tx || this.prisma;
        const membership = await client.stationMember.findFirst({
            where: { station_id, user_id }
        });
        return membership ? membership.role : null;
    }

    async findNearest(lat: number, lng: number, radius: number, tx?: DBTransactionClient): Promise<StationEntity[]> {
        const client = tx || this.prisma;

        const stations: any[] = await client.$queryRaw`
            SELECT *, (
                6371 * acos(
                    cos(radians(${lat})) * cos(radians(latitude)) * 
                    cos(radians(longitude) - radians(${lng})) + 
                    sin(radians(${lat})) * sin(radians(latitude))
                )
            ) AS distance
            FROM Station
            HAVING distance <= ${radius}
            ORDER BY distance ASC
        `;

        return stations.map(s => this.mapToEntity(s));
    }
}
