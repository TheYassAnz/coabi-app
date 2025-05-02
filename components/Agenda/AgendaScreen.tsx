import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Calendar } from "./Calendar";
import { DayEvents } from "./DayEvents";
import { AddEventModal } from "./AddEventModal";
import { format, parseISO } from "date-fns";
import { EventService } from "../../services/server/event";
import { EventPost } from "../../types/zod/event";
import { useAuth } from "../../contexts/AuthContext";

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string | null;
}

export const AgendaScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const eventService = new EventService();
  const { userId, accommodationId } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const fetchedEvents = await eventService.getAllEvents();
      const formattedEvents: Event[] = fetchedEvents.map((event) => ({
        id: event._id,
        title: event.title,
        startDate: format(event.plannedDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(event.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        description: event.description,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
      Alert.alert("Error", "Failed to load events. Please try again.");
    }
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setIsModalVisible(true);
  };

  const handleSaveEvent = async (newEvent: {
    title: string;
    startTime: Date;
    endTime: Date;
    description?: string;
  }) => {
    try {
      if (!userId) {
        Alert.alert("Error", "You must be logged in to create an event");
        return;
      }

      // if (!accommodationId) {
      //   Alert.alert("Error", "No accommodation selected");
      //   return;
      // }

      const eventData: EventPost = {
        title: newEvent.title,
        description: newEvent.description || null,
        plannedDate: newEvent.startTime,
        endDate: newEvent.endTime,
        userId,
        accommodationId: "67e922f5f031d41cd1da4fe4", // FIXME get from context
      };

      const createdEvent = await eventService.createEvent(eventData);

      const event: Event = {
        id: createdEvent._id,
        title: createdEvent.title,
        startDate: format(newEvent.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(newEvent.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
        description: createdEvent.description,
      };

      setEvents([...events, event]);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to create event:", error);
      Alert.alert("Error", "Failed to create event. Please try again.");
    }
  };

  const getEventsForSelectedDate = () => {
    return events.filter((event) => {
      const eventDate = format(parseISO(event.startDate), "yyyy-MM-dd");
      return eventDate === selectedDate;
    });
  };

  const markedDates = events.reduce((acc, event) => {
    const date = format(parseISO(event.startDate), "yyyy-MM-dd");
    return {
      ...acc,
      [date]: { marked: true },
    };
  }, {});

  return (
    <View style={styles.container}>
      <Calendar onDayPress={handleDayPress} markedDates={markedDates} />
      <DayEvents
        date={selectedDate}
        events={getEventsForSelectedDate()}
        onAddEvent={handleAddEvent}
      />
      <AddEventModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
