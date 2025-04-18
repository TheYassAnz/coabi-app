import { Redirect, Stack } from "expo-router";

const isLoggedIn = false;

export default function ProtectedLayout() {
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
