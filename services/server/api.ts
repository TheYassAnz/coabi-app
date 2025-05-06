import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { AccessResponseSchema } from "@/types/zod/auth";

export abstract class APIService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
    });

    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig<any>) => {
        if (!config.headers) {
          config.headers = new axios.AxiosHeaders();
        }
        const url = config.url || "";
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const excludedPaths = ["/register", "/login", "/refresh", "/logout"];
        if (accessToken && !excludedPaths.some((path) => url.includes(path))) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          error.response?.data.message.includes("token") &&
          !originalRequest._retry
        ) {
          try {
            const response = await this.post<any, any>(`/auth/refresh/`);
            const refresh = AccessResponseSchema.parse(response.data);
            await SecureStore.setItemAsync("accessToken", refresh.accessToken);
            originalRequest.headers.Authorization = `Bearer ${refresh.accessToken}`;
            originalRequest._retry = true;
            return this.axiosInstance.request(originalRequest);
          } catch (refreshError) {
            await this.post<any, any>(`/auth/logout/`);
            await SecureStore.deleteItemAsync("accessToken");
            router.replace("/login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  get<ResponseType>(url: string): Promise<AxiosResponse<ResponseType>> {
    return this.axiosInstance.get(url);
  }

  post<RequestType, ResponseType>(
    url: string,
    data?: RequestType,
  ): Promise<AxiosResponse<ResponseType>> {
    return this.axiosInstance.post(url, data);
  }

  patch<RequestType, ResponseType>(
    url: string,
    data?: RequestType,
  ): Promise<AxiosResponse<ResponseType>> {
    return this.axiosInstance.patch(url, data);
  }

  delete(url: string) {
    return this.axiosInstance.delete(url);
  }
}
