import { apiClient } from "../../core/api/apiClient";
import { UserFactory } from "../../domain/factories/UserFactory";
import { User } from "../../domain/models/User";

type RawUser = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
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

  async login(credentials: LoginPayload): Promise<User> {
    const response = await apiClient.post<ApiResponse<RawUser>>(
      "/auth/login",
      credentials
    );

    return UserFactory.create(response.data);
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<RawUser>>("/auth/me");
    return UserFactory.create(response.data);
  }

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<null>>("/auth/logout", {});
  }
}