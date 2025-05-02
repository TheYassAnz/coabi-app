import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string | null;
}

interface DayEventsProps {
  date: string;
  events: Event[];
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
}

export const DayEvents: React.FC<DayEventsProps> = ({
  date,
  events,
  onAddEvent,
  onEditEvent,
}) => {
  const formattedDate = format(new Date(date), "EEEE d MMMM yyyy", {
    locale: fr,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{formattedDate}</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddEvent}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {events.length === 0 ? (
        <Text style={styles.noEvents}>Aucun événement pour ce jour</Text>
      ) : (
        events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <TouchableOpacity onPress={() => onEditEvent(event)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.eventTime}>
              {format(new Date(event.startDate), "HH:mm")} -{" "}
              {format(new Date(event.endDate), "HH:mm")}
            </Text>
            {event.description && (
              <Text style={styles.eventDescription}>{event.description}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d4150",
  },
  addButton: {
    backgroundColor: "#00adf5",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  noEvents: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
  eventCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d4150",
    marginBottom: 5,
  },
  editButton: {
    color: "#00adf5",
    fontSize: 14,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
  },
});
