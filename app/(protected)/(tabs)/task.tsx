import { Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { TaskService } from "@/services/server/task";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";

export default function TaskScreen() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  const taskService = new TaskService();
  const userService = new UserService();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Task screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#000000",
  },
});
