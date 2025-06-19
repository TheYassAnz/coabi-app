"use client";

import {
  Text,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Switch,
  TextInput,
  Platform,
} from "react-native";
import type React from "react";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
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
      setSelectedUserId(fetchedMembers[0]?._id || userData._id);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Chargement échoué");
    } finally {
      setLoading(false);
    }
  };

  const isPast = (date: Date) => new Date(date) < new Date();

  const TaskItem = ({ task }: { task: any }) => {
    const isOverdue = !task.done && isPast(task.dueDate);
    const dueDate = new Date(task.dueDate);

    const assignedUser = members.find((m) => m._id === task.userId);
    const userName = assignedUser
      ? `${assignedUser.firstName} ${assignedUser.lastName}`
      : task.userId;

    return (
      <View style={styles.taskItem}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskName}>{task.name}</Text>
          {task.description ? (
            <Text style={styles.taskDescription}>{task.description}</Text>
          ) : null}
          <View style={styles.taskMeta}>
            <Text style={[styles.taskDate, isOverdue && styles.overdueDate]}>
              {dueDate.toLocaleDateString("fr-FR")}
            </Text>
            <Text style={styles.taskAssignee}>Assigné à: {userName}</Text>
          </View>
        </View>

        <View style={styles.taskActions}>
          {!task.done && (
            <Switch
              value={false}
              onValueChange={() => markTaskAsDone(task._id)}
              disabled={updatingTaskId === task._id}
              trackColor={{ false: "#e5e7eb", true: "#22c55e" }}
              thumbColor={"#ffffff"}
              style={styles.switch}
            />
          )}
          {updatingTaskId === task._id && (
            <ActivityIndicator size="small" color="#3b82f6" />
          )}
        </View>
      </View>
    );
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
      Alert.alert("Erreur", "Le nom de la tâche est requis");
      return;
    }

    try {
      setFormLoading(true);

      await taskService.createTask({
        name: formData.name,
        description: formData.description,
        // dueDate: formData.dueDate,
        userId: selectedUserId,
        accommodationId: user.accommodationId,
        weekly: false,
      });

      resetForm();
      setModalVisible(false);
      await fetchTasksAndMembers();
      Alert.alert("Succès", "Tâche créée avec succès");
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Impossible de créer la tâche");
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndMembers();
  }, []);

  // Composant pour l'état vide
  const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const upcomingTasks = tasks.filter((t) => !t.done && !isPast(t.dueDate));
  const overdueTasks = tasks.filter((t) => !t.done && isPast(t.dueDate));
  const completedTasks = tasks.filter((t) => t.done);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gestion des Tâches</Text>
          <Text style={styles.headerSubtitle}>
            Organisez et suivez vos tâches quotidiennes
          </Text>
        </View>

        <TaskCard title="Tâches en retard" type="overdue">
          {overdueTasks.length === 0 ? (
            <EmptyState message="Aucune tâche en retard" />
          ) : (
            overdueTasks.map((task) => <TaskItem key={task._id} task={task} />)
          )}
        </TaskCard>

        <TaskCard title="Tâches à venir" type="upcoming">
          {upcomingTasks.length === 0 ? (
            <EmptyState message="Aucune tâche à venir" />
          ) : (
            upcomingTasks.map((task) => <TaskItem key={task._id} task={task} />)
          )}
        </TaskCard>

        <TaskCard title="Tâches terminées" type="completed">
          {completedTasks.length === 0 ? (
            <EmptyState message="Aucune tâche terminée" />
          ) : (
            completedTasks
              .slice(0, 5)
              .map((task) => <TaskItem key={task._id} task={task} />)
          )}
        </TaskCard>
        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle tâche</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Nom de la tâche */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom de la tâche</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Nom de la tâche"
                  maxLength={100}
                />
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description (optionnelle)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, description: text }))
                  }
                  placeholder="Description de la tâche"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              {/* Date limite */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date limite</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateButtonText}>
                    {formData.dueDate.toLocaleDateString("fr-FR")}
                  </Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.dueDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date)
                      setFormData((prev) => ({ ...prev, dueDate: date }));
                  }}
                />
              )}

              {/* Assignation */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Assigner à</Text>
                {members.map((member) => {
                  const isSelected = selectedUserId === member._id;
                  const isCurrentUser = member._id === user?._id;

                  return (
                    <TouchableOpacity
                      key={member._id}
                      style={styles.radioContainer}
                      onPress={() => setSelectedUserId(member._id)}
                    >
                      <View
                        style={[
                          styles.radio,
                          isSelected && styles.radioSelected,
                        ]}
                      >
                        {isSelected ? <View style={styles.radioDot} /> : null}
                      </View>
                      <Text style={styles.radioLabel}>
                        {member.firstName} {member.lastName}
                        {isCurrentUser && " (moi)"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  formLoading && styles.disabledButton,
                ]}
                onPress={handleCreateTask}
                disabled={formLoading}
              >
                {formLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.createButtonText}>Créer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const TaskCard = ({
  title,
  children,
  type,
}: {
  title: string;
  children: React.ReactNode;
  type: "overdue" | "upcoming" | "completed";
}) => {
  const getCardStyle = () => {
    switch (type) {
      case "overdue":
        return styles.overdueCard;
      case "upcoming":
        return styles.upcomingCard;
      case "completed":
        return styles.completedCard;
      default:
        return styles.defaultCard;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "overdue":
        return "#ef4444";
      case "upcoming":
        return "#f59e0b";
      case "completed":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "overdue":
        return "⚠️";
      case "upcoming":
        return "📋";
      case "completed":
        return "✅";
      default:
        return "📋";
    }
  };

  return (
    <View style={[styles.card, getCardStyle()]}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getIconColor() + "20" },
          ]}
        >
          <Text style={[styles.icon, { color: getIconColor() }]}>
            {getIcon()}
          </Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  upcomingCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
  },
  defaultCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#e5e7eb",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  overdueDate: {
    color: "#ef4444",
    fontWeight: "600",
  },
  taskAssignee: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginVertical: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#374151",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 10,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  radioSelected: {
    borderColor: "#3b82f6",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
  },
  radioLabel: {
    fontSize: 16,
    color: "#374151",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
});
