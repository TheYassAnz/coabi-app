import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export abstract class APIService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
    });
  }

  get<ResponseType>(url: string): Promise<AxiosResponse<ResponseType>> {
    return this.axiosInstance.get(url);
  }

  post<RequestType, ResponseType>(
    url: string,
    data: RequestType,
  ): Promise<AxiosResponse<ResponseType>> {
    return this.axiosInstance.post(url, data);
  }

  patch<RequestType, ResponseType>(
    url: string,
    data: RequestType,
  ): Promise<AxiosResponse<ResponseType>> {
    return this.axiosInstance.patch(url, data);
  }

  delete(url: string) {
    return this.axiosInstance.delete(url);
  }

  request<T>(config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance(config);
  }
}
