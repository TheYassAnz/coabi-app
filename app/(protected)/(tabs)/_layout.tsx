import { Tabs } from "expo-router";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { UserService } from "@/services/server/user";
import { getUserById } from "@/services/utils";

export default function TabLayout() {
  const userService = new UserService();
  const [isJoinedAccommodation, setIsJoinedAccommodation] = useState(false);
  useEffect(() => {
    // TO DO
  }, []);

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
        name="setting"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
