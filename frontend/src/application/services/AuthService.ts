import { apiClient } from "../../core/api/apiClient";
import { UserFactory } from "../../domain/factories/UserFactory";
import { User } from "../../domain/models/User";

type RawUser = {
  id: string;
  firstName?: string;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
};

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

type LoginPayload = {
  email?: string;
  phoneNumber?: string;
  password: string;
};

export class AuthService {
  async register(formData: FormData): Promise<User> {
    const response = await apiClient.post<ApiResponse<RawUser>>(
      "/auth/register",
      formData
    );

    return UserFactory.create(response.data);
  }

  async login(payload: LoginPayload): Promise<User> {
    const response = await apiClient.post<ApiResponse<RawUser>>(
      "/auth/login",
      {
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
      }
    );

    return UserFactory.create(response.data);
  }

  async getCurrentUser(): Promise<User> {
    const response =
      await apiClient.get<ApiResponse<RawUser>>("/auth/me");

    return UserFactory.create(response.data);
  }

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout", {});
  }

  async refreshTokens(): Promise<void> {
    await apiClient.post("/auth/refresh-tokens", {});
  }

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.patch("/auth/change-password", payload);
  }

  async deactivateAccount(): Promise<void> {
    await apiClient.delete("/auth/deactivate-account");
  }

  async activateAccount(payload: {
    email?: string;
    phoneNumber?: string;
  }): Promise<void> {
    await apiClient.patch("/auth/activate-account", payload);
  }

  async updateProfile(payload: Record<string, unknown>): Promise<User> {
    const response = await apiClient.patch<ApiResponse<RawUser>>(
      "/user/profile",
      payload
    );

    return UserFactory.create(response.data);
  }

  async uploadGovtId(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("govt_id", file);

    await apiClient.patch("/user/govt-id", formData);
  }
}