import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getUserByAccessToken } from "@/services/utils";

import { Alert } from "react-native";

export default function ProtectedLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserByAccessToken(); // logout if not found
        if (!userData) {
          router.replace("/login");
          return;
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
