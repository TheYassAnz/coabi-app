import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Event } from "../../types/event";
import { format, parseISO, isBefore, startOfDay } from "date-fns";

interface DayEventsProps {
  date: string;
  events: Event[];
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
}

export const DayEvents: React.FC<DayEventsProps> = ({
  date,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  const isPastDate = isBefore(parseISO(date), startOfDay(new Date()));

  const getPriorityColor = (priority?: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "#FF4444";
      case "medium":
        return "#FFB020";
      case "low":
        return "#33CC33";
      default:
        return "#E0E0E0";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {format(parseISO(date), "MMMM d, yyyy")}
        </Text>
        <TouchableOpacity
          onPress={onAddEvent}
          style={[styles.addButton, isPastDate && styles.disabledAddButton]}
          disabled={isPastDate}
        >
          <Text style={styles.addButtonText}>Add Event</Text>
          {isPastDate && <View style={styles.pastDateIndicator} />}
        </TouchableOpacity>
      </View>
      {isPastDate && (
        <Text style={styles.warningText}>
          Cannot create events for past dates
        </Text>
      )}
      <ScrollView style={styles.eventsList}>
        {events.map((event) => (
          <View
            key={event.id}
            style={[
              styles.eventCard,
              event.status && styles[`${event.status}Event`],
            ]}
          >
            <View style={styles.eventHeader}>
              <View
                style={[
                  styles.priorityIndicator,
                  { backgroundColor: getPriorityColor(event.priority) },
                ]}
              />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>
                  {format(parseISO(event.startDate), "HH:mm")} -{" "}
                  {format(parseISO(event.endDate), "HH:mm")}
                </Text>
                {event.description && (
                  <Text style={styles.eventDescription}>
                    {event.description}
                  </Text>
                )}
                {event.status && (
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{event.status}</Text>
                  </View>
                )}
              </View>
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
  eventHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 6,
  },
  eventContent: {
    flex: 1,
  },
  pendingEvent: {
    borderLeftWidth: 4,
    borderLeftColor: "#FFB020",
  },
  completedEvent: {
    borderLeftWidth: 4,
    borderLeftColor: "#33CC33",
  },
  cancelledEvent: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF4444",
  },
  statusContainer: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    color: "#666666",
    textTransform: "capitalize",
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
  disabledAddButton: {
    opacity: 0.5,
    position: "relative",
  },
  pastDateIndicator: {
    position: "absolute",
    right: -4,
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4444",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  warningText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    textAlign: "right",
  },
});
