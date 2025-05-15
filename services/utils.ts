import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "./server/auth";
import { UserService } from "./server/user";
import { UserResponse } from "@/types/zod/user";

export async function getUserById(): Promise<string | null> {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  if (!accessToken) {
    return null;
  }
  try {
    const decodedToken: { id: string } = jwtDecode(accessToken);
    return decodedToken.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export async function getUserByAccessToken(): Promise<UserResponse | void> {
  const authService = new AuthService();
  const accessToken = await SecureStore.getItemAsync("accessToken");
  if (!accessToken) {
    return await authService.logout();
  }
  try {
    const decodedToken: { id: string } = jwtDecode(accessToken);
    const userService = new UserService();
    const user = await userService.getUserById(decodedToken.id);
    return user;
  } catch (error: any) {
    await authService.logout();
    throw {
      message: error.message,
    };
  }
}

export function loopUntilNumber<T>(list: T[], num: number): T[] {
  return list.slice(0, num);
}
