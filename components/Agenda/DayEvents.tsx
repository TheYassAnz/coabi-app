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
}

export const DayEvents: React.FC<DayEventsProps> = ({
  date,
  events,
  onAddEvent,
  onEditEvent,
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
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => onEditEvent(event)}
          >
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventTime}>
              {format(parseISO(event.startDate), "h:mm a")} -{" "}
              {format(parseISO(event.endDate), "h:mm a")}
            </Text>
            {event.description && (
              <Text style={styles.eventDescription}>{event.description}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "500",
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
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
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
  },
});
