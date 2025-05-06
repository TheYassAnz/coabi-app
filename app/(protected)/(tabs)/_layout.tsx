import { Tabs, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { getUserByAccessToken } from "@/services/utils";

export default function TabLayout() {
  const router = useRouter();
  const [isJoinedAccommodation, setIsJoinedAccommodation] = useState<
    boolean | null
  >(null);
  useEffect(() => {
    getUserByAccessToken()
      .then((user: any) => {
        if (user.accommodationId) {
          setIsJoinedAccommodation(true);
        } else {
          router.replace("/accommodation/join");
        }
      })
      .catch(() => {
        setIsJoinedAccommodation(false);
      });
  }, []);

  if (isJoinedAccommodation === null) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="refund"
        options={{
          title: "Refund",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="attach-money" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="check" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
