import {
  UserResponse,
  UserPatch,
  UserPatchPassword,
  UserResponseSchema,
} from "../../types/zod/user";
import { APIService } from "./api";
import { AuthService } from "./auth";

export class UserService extends APIService {
  constructor() {
    super();
  }

  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const response = await this.get<any[]>(`/users`);
      return response.data.map((user) => UserResponseSchema.parse(user));
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async getUserById(id: string): Promise<UserResponse> {
    try {
      const response = await this.get<any>(`/users/${id}`);
      return UserResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async updateUserById(id: string, data: UserPatch): Promise<UserResponse> {
    try {
      const response = await this.patch<UserPatch, any>(`/users/${id}`, data);
      return UserResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async updateUserPasswordById(
    id: string,
    data: UserPatchPassword,
  ): Promise<UserResponse> {
    try {
      const response = await this.patch<UserPatchPassword, any>(
        `/users/password/${id}`,
        data,
      );
      return UserResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async deleteUserById(id: string) {
    try {
      const authService = new AuthService();
      await authService.logout();
      await this.delete(`/users/${id}`);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async filterUsers(
    filters: Record<string, any> = {},
  ): Promise<UserResponse[]> {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await this.get<any[]>(`/users/filter?${query}`);
      return response.data.map((user) => UserResponseSchema.parse(user));
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }
}
