import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: "Change Password",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Profile",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="accommodation"
        options={{
          title: "See Accommodation",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="roommate/[username]"
        options={{
          title: "See roommate",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
