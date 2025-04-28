import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "./server/auth";

export async function getUserById(): Promise<string | void> {
  const authService = new AuthService();
  const accessToken = await SecureStore.getItemAsync("accessToken");
  if (!accessToken) {
    return await authService.logout();
  }
  try {
    const decodedToken: { id: string } = jwtDecode(accessToken);
    return decodedToken.id;
  } catch (error) {
    await authService.logout();
    throw {
      message: "Invalid accessToken",
    };
  }
}
