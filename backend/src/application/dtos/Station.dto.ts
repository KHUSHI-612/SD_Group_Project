import { StationStatus } from "@prisma/client";

export interface CreateStationdto {
  owner_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  helpline_number: string;
  documents: Record<string, string>;
  working_days: Record<string, boolean>;
  opensAt: string;
  closesAt: string;
}

export interface UpdateStationDto {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  helpline_number?: string;
  documents?: Record<string, string>;
  working_days?: Record<string, boolean>;
  opensAt?: string;
  closesAt?: string;
  status?: StationStatus;
}
