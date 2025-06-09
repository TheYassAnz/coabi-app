"use client";

import { useEffect, useState } from "react";
import { getUserByAccessToken } from "@/services/utils";
import { TaskService } from "@/services/server/task";
import { RefundService } from "@/services/server/refund";
import { EventService } from "@/services/server/event";
import { View, Text } from "react-native";

export default function HomePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [iOwe, setIOwe] = useState<any[]>([]); // je dois
  const [theyOweMe, setTheyOweMe] = useState<any[]>([]); // on me doit

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserByAccessToken();

        if (!user || !user._id) {
          console.warn("Utilisateur non trouvé");
          return;
        }

        const taskService = new TaskService();
        const refundService = new RefundService();
        const eventService = new EventService();

        const [userTasks, userEvents, refundsIOwe, refundsTheyOweMe] =
          await Promise.all([
            taskService.getAllTasks(),
            eventService.getAllEvents(),
            refundService.filterRefunds({ userId: user._id }), // je dois de l'argent
            refundService.filterRefunds({ roommateId: user._id }), // on me doit de l'argent
          ]);

        console.log("==== DONNÉES REMBOURSEMENTS ====");
        // console.log("Ce que je dois (userId):", refundsIOwe)
        // console.log("Ce qu'on me doit (roommateId):", refundsTheyOweMe)
        console.log("Exemple remboursement (je dois) :", refundsIOwe[0]);
        console.log("roommateId complet :", refundsIOwe[0]?.roommateId);

        setTasks(userTasks.slice(0, 2));
        setEvents(userEvents.slice(0, 2));
        setIOwe(refundsIOwe.slice(0, 2));
        setTheyOweMe(refundsTheyOweMe.slice(0, 2));
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "bold" }}>Tâches</Text>
      {tasks.map((task) => (
        <Text key={task._id}>• {task.name}</Text>
      ))}

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Événements</Text>
      {events.map((event) => (
        <Text key={event._id}>• {event.title}</Text>
      ))}

      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>
        Ce que je dois
      </Text>
      {iOwe.map((refund) => (
        <Text key={refund._id.toString()} style={{ marginBottom: 5 }}>
          • Je dois {refund.toRefund} € à{" "}
          {typeof refund.roommateId === "object"
            ? refund.roommateId.username
            : "inconnu"}{" "}
          – {refund.title}
        </Text>
      ))}

      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>
        Ce qu’on me doit
      </Text>
      {theyOweMe.map((refund) => (
        <Text key={refund._id.toString()} style={{ marginBottom: 5 }}>
          •{" "}
          {typeof refund.userId === "object"
            ? refund.userId.username
            : "inconnu"}{" "}
          me doit {refund.toRefund} € – {refund.title}
        </Text>
      ))}
    </View>
  );
}
