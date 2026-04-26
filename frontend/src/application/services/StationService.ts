import { apiClient } from "../../core/api/apiClient";

export type StationStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "MAINTENANCE"
  | "PENDING"
  | "DELETED";

export type Station = {
  station_id?: string;
  id?: string;
  name?: string;
  stationName?: string;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  status?: StationStatus | string;
  price?: string | number;
  ownerId?: string;
  managerId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateStationPayload = Partial<
  Pick<
    Station,
    | "name"
    | "stationName"
    | "address"
    | "city"
    | "state"
    | "latitude"
    | "longitude"
    | "price"
    | "managerId"
  >
>;

export type UpdateStationStatusPayload = {
  status: StationStatus;
};

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export class StationService {
  async getStations(): Promise<Station[]> {
    const response = await apiClient.get<ApiResponse<Station[]>>("/station");
    return response.data;
  }

  async getStationById(stationId: string): Promise<Station> {
    const response = await apiClient.get<ApiResponse<Station>>(
      `/station/${stationId}`
    );

    return response.data;
  }

  async updateStation(
    stationId: string,
    payload: UpdateStationPayload
  ): Promise<Station> {
    const response = await apiClient.patch<ApiResponse<Station>>(
      `/station/${stationId}`,
      payload
    );

    return response.data;
  }

  async updateStationStatus(
    stationId: string,
    payload: UpdateStationStatusPayload
  ): Promise<Station> {
    const response = await apiClient.patch<ApiResponse<Station>>(
      `/station/${stationId}/status`,
      payload
    );

    return response.data;
  }

  async deleteStation(stationId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/station/${stationId}`);
  }
}