import { StationStatus } from "@prisma/client";

export class StationEntity {
  constructor(
    public readonly station_id: string,
    public readonly owner_id: string,
    public readonly name: string,
    public readonly address: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly helpline_number: string,
    public readonly documents: Record<string, string> | any[],
    public readonly working_days: Record<string, boolean> | any[],
    public readonly opensAt: string,
    public readonly closesAt: string,
    public readonly status: StationStatus,
    public readonly approvedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
