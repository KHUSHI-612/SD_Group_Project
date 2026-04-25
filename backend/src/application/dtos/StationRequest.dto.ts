import { RequestStatus } from "@prisma/client";

export interface CreateRequestdto {
    owner_id: string;
    station_name: string;
    latitude: number;
    longitude: number;
    address: string;
    helpline_number: string;
    working_days: Record<string, boolean>;
    opensAt: string;
    closesAt: string;
}

export interface UpdateRequestdto {
    station_name?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    helpline_number?: string;
    working_days?: Record<string, boolean>;
    opensAt?: string;
    closesAt?: string;
    documents?: Record<string, string>;
    status?: RequestStatus;
    reviewed_by?: string;
}