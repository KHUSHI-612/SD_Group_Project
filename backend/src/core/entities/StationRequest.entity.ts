import { RequestStatus } from "@prisma/client";

export class StationRequestEntity {
  constructor(
    public readonly request_id: string,
    public readonly owner_id: string,
    public readonly station_name: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly address: string,
    public readonly helpline_number: string,
    public readonly documents: Record<string, string>,
    public readonly working_days: Record<string, boolean>,
    public readonly opensAt: string,
    public readonly closesAt: string,
    public readonly status: RequestStatus,
    public readonly reviewed_by: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isApproved(): boolean {
    return this.status === "APPROVED"
  }
}
