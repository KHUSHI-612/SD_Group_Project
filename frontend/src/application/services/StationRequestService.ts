import { apiClient } from "../../core/api/apiClient";

export type WorkingDays = Record<string, boolean>;

export type StationRequestPayload = {
  station_name: string;
  latitude: string;
  longitude: string;
  address: string;
  helpline_number: string;
  working_days: WorkingDays;
  opensAt: string;
  closesAt: string;
  documents: File[];
};

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export class StationRequestService {
  async createRequest(payload: StationRequestPayload): Promise<unknown> {
    const formData = new FormData();

    formData.append("station_name", payload.station_name);
    formData.append("latitude", payload.latitude);
    formData.append("longitude", payload.longitude);
    formData.append("address", payload.address);
    formData.append("helpline_number", payload.helpline_number);
    formData.append("working_days", JSON.stringify(payload.working_days));
    formData.append("opensAt", payload.opensAt);
    formData.append("closesAt", payload.closesAt);

    payload.documents.forEach((file) => {
      formData.append("documents", file);
    });

    const response = await apiClient.post<ApiResponse<unknown>>(
      "/station-request",
      formData
    );

    return response.data;
  }

  async getMyRequests(): Promise<unknown[]> {
    const response =
      await apiClient.get<ApiResponse<unknown[]>>("/station-request");

    return response.data;
  }

  async getRequestsByStatus(status: string): Promise<unknown[]> {
  const response = await apiClient.get<ApiResponse<unknown[]>>(
    `/station-request/status?status=${status}`
  );

  return response.data;
}

async approveRequest(requestId: string): Promise<unknown> {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    `/station-request/${requestId}/approve`,
    {}
  );

  return response.data;
}

async rejectRequest(requestId: string): Promise<unknown> {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    `/station-request/${requestId}/reject`,
    {}
  );

  return response.data;
}
}

