import {
  Register,
  Login,
  LoginResponse,
  LoginResponseSchema,
} from "../../types/zod/auth";
import { UserResponse, UserResponseSchema } from "../../types/zod/user";
import { APIService } from "./api";

export class AuthService extends APIService {
  constructor() {
    super();
  }

  async register(data: Register): Promise<UserResponse> {
    try {
      const response = await this.post<Register, any>(`/auth/register/`, data);
      return UserResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async login(data: Login): Promise<LoginResponse> {
    try {
      const response = await this.post<Login, any>(`/auth/login/`, data);
      return LoginResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }
}
