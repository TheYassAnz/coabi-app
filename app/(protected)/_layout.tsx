import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { getUserByAccessToken } from "@/services/utils";
import { UserResponse } from "@/types/zod/user";
import { Alert } from "react-native";
import { AuthService } from "@/services/server/auth";

export default function ProtectedLayout() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const authService = new AuthService();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserByAccessToken(); // logout if not found
        if (!userData) {
          return;
        }
        if (userData && !userData.accommodationId) {
          return await authService.logout(); // renvoyer vers la page de création d'accommodation
        }
        setUser(userData);
      } catch (error: any) {
        Alert.alert(error.message);
      }
    };

    checkAuth();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
