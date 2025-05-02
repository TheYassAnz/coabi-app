import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "./Calendar";
import { DayEvents } from "./DayEvents";
import { AddEventModal } from "./AddEventModal";
import { format, parseISO } from "date-fns";

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export const AgendaScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setIsModalVisible(true);
  };

  const handleSaveEvent = (newEvent: {
    title: string;
    startTime: Date;
    endTime: Date;
    description?: string;
  }) => {
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      startDate: format(newEvent.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      endDate: format(newEvent.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
      description: newEvent.description,
    };

    setEvents([...events, event]);
    setIsModalVisible(false);
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
