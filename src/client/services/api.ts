import axios from "axios";
import { toast } from "react-toastify";
import type { ApiResponse } from "../types";

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    toast.error(message);

    if (import.meta.env.DEV) {
      console.error("API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message,
      });
    }

    return Promise.reject(error);
  }
);

// The response interceptor returns response.data (ApiResponse<T>),
// so we override the return types of the axios methods.
export interface TypedApi {
  get<T>(url: string): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
}

export default api as unknown as TypedApi;
