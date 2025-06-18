import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
