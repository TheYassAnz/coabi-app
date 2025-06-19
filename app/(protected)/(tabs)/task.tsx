import { Text, View, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { TaskService } from "@/services/server/task";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";

export default function TaskScreen() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const taskService = new TaskService();
  const userService = new UserService();

  const fetchTasksAndMembers = async () => {
    try {
      const userData = await getUserByAccessToken();
      if (!userData) {
        Alert.alert("Erreur", "Utilisateur non trouvé");
        return;
      }
      setUser(userData);

      const allTasks = await taskService.filterTasks({ userId: userData._id });
      setTasks(allTasks);

      const fetchedMembers = await userService.filterUsers({
        accommodationId: userData.accommodationId,
      });
      setMembers(fetchedMembers);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Chargement échoué");
    } finally {
      setLoading(false);
    }
  };

  const markTaskAsDone = async (taskId: string) => {
    try {
      setUpdatingTaskId(taskId);
      await taskService.updateTaskById(taskId, { done: true });
      await fetchTasksAndMembers();
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Impossible de cocher la tâche");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const isPast = (date: Date) => new Date(date) < new Date();

  useEffect(() => {
    fetchTasksAndMembers();
  }, []);

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
