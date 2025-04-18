import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import AuthProvider from "../utils/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <GluestackUIProvider mode="light">
        <Stack>
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
    </AuthProvider>
  );
}
