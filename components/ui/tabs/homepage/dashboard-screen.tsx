import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { TaskService } from "@/services/server/task";
import { EventService } from "@/services/server/event";
import { RefundService } from "@/services/server/refund";
import { TaskResponse } from "@/types/zod/task";
import { EventResponse } from "@/types/zod/event";
import { RefundResponse } from "@/types/zod/refund";

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [refunds, setRefunds] = useState<RefundResponse[]>([]);

  const refreshDashboardData = async () => {
    try {
      const user = await getUserByAccessToken();
      if (!user) {
        console.warn("Utilisateur non connecté");
        return;
      }

      const taskService = new TaskService();
      const eventService = new EventService();
      const refundService = new RefundService();

      const [userTasks, userEvents, userRefunds] = await Promise.all([
        taskService.filterTasks({ userId: user._id }),
        eventService.filterEvents({ userId: user._id }),
        refundService.filterRefunds({ userId: user._id }),
      ]);

      setTasks(userTasks.slice(0, 2));
      setEvents(userEvents.slice(0, 2));
      setRefunds(userRefunds.slice(0, 2));
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>Tâches</Text>
      {tasks.map((task) => (
        <Text key={task._id}>{task.name}</Text>
      ))}

      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 20 }}>
        Événements
      </Text>
      {events.map((event) => (
        <Text key={event._id}>{event.title}</Text>
      ))}

      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 20 }}>
        Remboursements
      </Text>
      {refunds.map((refund) => (
        <Text key={refund._id}>
          {refund.title} - {refund.toRefund} €
        </Text>
      ))}
    </ScrollView>
  );
}
