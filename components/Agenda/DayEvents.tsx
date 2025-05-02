import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Event } from "../../types/event";
import { format, parseISO } from "date-fns";

interface DayEventsProps {
  date: string;
  events: Event[];
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void; // Add this prop
}

export const DayEvents: React.FC<DayEventsProps> = ({
  date,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {format(parseISO(date), "MMMM d, yyyy")}
        </Text>
        <TouchableOpacity onPress={onAddEvent} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Event</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.eventsList}>
        {events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>
                {format(parseISO(event.startDate), "h:mm a")} -{" "}
                {format(parseISO(event.endDate), "h:mm a")}
              </Text>
              {event.description && (
                <Text style={styles.eventDescription}>{event.description}</Text>
              )}
            </View>
            <View style={styles.eventActions}>
              <TouchableOpacity
                onPress={() => onEditEvent(event)}
                style={styles.actionButton}
              >
                <Text style={styles.editButtonText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDeleteEvent(event)}
                style={[styles.actionButton, styles.deleteButton]}
              >
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  addButton: {
    backgroundColor: "#333333",
    padding: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666666",
  },
  eventActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#333333",
  },
  editButtonText: {
    color: "#333333",
    fontWeight: "500",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
