class ApiClient {
  private readonly baseUrl = "http://localhost:8000/api";

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  async post<T>(
    path: string,
    body?: FormData | Record<string, unknown>
  ): Promise<T> {
    const isFormData = body instanceof FormData;

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      credentials: "include",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body:
        body === undefined
          ? undefined
          : isFormData
          ? body
          : JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }
}

export const apiClient = new ApiClient();