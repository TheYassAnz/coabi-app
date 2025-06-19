import { Text, View, StyleSheet, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
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

  const upcomingTasks = tasks.filter((t) => !t.done && !isPast(t.dueDate));
  const overdueTasks = tasks.filter((t) => !t.done && isPast(t.dueDate));
  const completedTasks = tasks.filter((t) => t.done);

  return (
    <ScrollView style={{ padding: 20 }}>
      <TaskCard title="Tâches en retard">
        {overdueTasks.length === 0 ? (
          <Text>Aucune tâche en retard</Text>
        ) : (
          overdueTasks.map((task) => <Text key={task._id}>- {task.name}</Text>)
        )}
      </TaskCard>

      <TaskCard title="Tâches à venir">
        {upcomingTasks.length === 0 ? (
          <Text>Aucune tâche à venir</Text>
        ) : (
          upcomingTasks.map((task) => <Text key={task._id}>- {task.name}</Text>)
        )}
      </TaskCard>

      <TaskCard title="Tâches complétées">
        {completedTasks.length === 0 ? (
          <Text>Aucune tâche complétée</Text>
        ) : (
          completedTasks.map((task) => (
            <Text key={task._id}>- {task.name}</Text>
          ))
        )}
      </TaskCard>
    </ScrollView>
  );
}

const TaskCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <View
      style={{
        marginBottom: 20,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </View>
  );
};

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
