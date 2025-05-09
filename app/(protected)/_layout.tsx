import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { getUserByAccessToken } from "@/services/utils";

import { Alert } from "react-native";
import { AuthService } from "@/services/server/auth";

export default function ProtectedLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserByAccessToken(); // logout if not found
        if (!userData) {
          const authService = new AuthService();
          return await authService.logout();
        }
        if (userData.accommodationId === null) {
          router.replace("/accommodation/join");
          return;
        }
      } catch (error: any) {
        Alert.alert(error.message);
      }
    };

    checkAuth();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="accommodation/join"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
