import {
  Register,
  RegisterResponse,
  RegisterResponseSchema,
  Access,
  AccessResponse,
  AccessResponseSchema,
} from "../../types/zod/auth";
import { APIService } from "./api";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export class AuthService extends APIService {
  constructor() {
    super();
  }

  async register(data: Register): Promise<RegisterResponse> {
    try {
      const response = await this.post<Register, any>(`/auth/register/`, data);
      return RegisterResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async login(data: Access): Promise<AccessResponse> {
    try {
      const response = await this.post<Access, any>(`/auth/login/`, data);
      return AccessResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.post<any, any>(`/auth/logout/`);
      await SecureStore.deleteItemAsync("accessToken");
      router.replace("/login");
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }
}
