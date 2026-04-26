class ApiClient {
  private readonly baseUrl = "http://localhost:8000/api";

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    path: string,
    body?: FormData | Record<string, unknown>
  ): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  async patch<T>(
    path: string,
    body?: FormData | Record<string, unknown>
  ): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      credentials: "include",
    });

    return this.handleResponse<T>(response);
  }

  private async request<T>(
    method: "POST" | "PATCH",
    path: string,
    body?: FormData | Record<string, unknown>
  ): Promise<T> {
    const isFormData = body instanceof FormData;

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      credentials: "include",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body:
        body === undefined
          ? undefined
          : isFormData
          ? body
          : JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }
}

export const apiClient = new ApiClient();