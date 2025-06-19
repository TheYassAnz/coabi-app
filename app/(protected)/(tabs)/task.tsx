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

  const [modalVisible, setModalVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: new Date(),
  });
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const resetForm = () => {
    setFormData({ name: "", description: "", dueDate: new Date() });
    setSelectedUserId(members[0]?._id || user?._id || "");
  };

  const handleCreateTask = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Task name is required");
      return;
    }

    try {
      setFormLoading(true);

      await taskService.createTask({
        name: formData.name,
        description: formData.description,
        dueDate: formData.dueDate,
        userId: selectedUserId,
        accommodationId: user.accommodationId,
      });

      resetForm();
      setModalVisible(false);
      await fetchTasksAndMembers();
      Alert.alert("Success", "Task created successfully");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create task");
    } finally {
      setFormLoading(false);
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
          <Text style={styles.emptyText}>Aucune tâche en retard</Text>
        ) : (
          overdueTasks.map((task) => (
            <Text key={task._id} style={styles.taskText}>
              • {task.name}
            </Text>
          ))
        )}
      </TaskCard>

      <TaskCard title="Tâches à venir">
        {upcomingTasks.length === 0 ? (
          <Text style={styles.emptyText}>Aucune tâche à venir</Text>
        ) : (
          upcomingTasks.map((task) => (
            <Text key={task._id} style={styles.taskText}>
              • {task.name}
            </Text>
          ))
        )}
      </TaskCard>

      <TaskCard title="Tâches complétées">
        {completedTasks.length === 0 ? (
          <Text style={styles.emptyText}>Aucune tâche complétée</Text>
        ) : (
          completedTasks.map((task) => (
            <Text key={task._id} style={styles.taskText}>
              • {task.name}
            </Text>
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
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scroll: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1f2937",
  },
  taskText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 4,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#9ca3af",
  },
});
