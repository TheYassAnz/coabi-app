import {
  UserResponse,
  UserPatch,
  UserResponseSchema,
} from "../../types/zod/user";
import { APIService } from "./api";

export class UserService extends APIService {
  constructor() {
    super();
  }

  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const response = await this.get<any[]>(`/users`);
      return response.data.map((user) => UserResponseSchema.parse(user));
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async getUserById(id: number): Promise<UserResponse> {
    try {
      const response = await this.get<any>(`/users/${id}`);
      return UserResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async updateUserById(id: number, data: UserPatch): Promise<UserResponse> {
    try {
      const response = await this.patch<UserPatch, any>(`/users/${id}`, data);
      return UserResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async deleteUserById(id: number) {
    try {
      const response = await this.delete(`/users/${id}`);
      if (response.status !== 204) {
        throw new Error("Failed to delete user.");
      }
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
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
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }
}
