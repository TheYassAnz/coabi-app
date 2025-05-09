import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TextInput } from "react-native";
import { Calendar } from "./Calendar";
import { DayEvents } from "./DayEvents";
import { AddEventModal } from "./AddEventModal";
import { format, parseISO } from "date-fns";
import { EventService } from "../../../services/server/event";
import { EventPost, EventPatch } from "../../../types/zod/event";
import { useAuth } from "../../../contexts/AuthContext";
import { Event } from "../../../types/zod/event";

export const AgendaScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const eventService = new EventService();
  const { userId, accommodationId } = useAuth();

  // console.log('Auth values:', { userId, accommodationId });

  useEffect(() => {
    // console.log('useEffect - accommodationId:', accommodationId);
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
        userId: event.userId,
      }));
      setEvents(formattedEvents);
    } catch (error: any) {
      console.error("Failed to load events:", error);
      Alert.alert(
        "Erreur",
        "Échec du chargement des événements. Veuillez réessayer.",
      );
    }
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setIsModalVisible(true);
  };

  const handleEditEvent = (event: Event) => {
    if (event.userId !== userId) {
      Alert.alert(
        "Non autorisé",
        "Vous ne pouvez modifier que vos propres événements",
      );
      return;
    }
    setEditingEvent(event);
    setIsModalVisible(true);
  };

  const handleSaveEvent = async (newEvent: {
    title: string;
    startTime: Date;
    endTime: Date;
    description?: string;
  }) => {
    console.log("handleSaveEvent - auth values:", { userId, accommodationId });

    try {
      if (!userId || !accommodationId) {
        // console.log('Missing auth values:', { userId, accommodationId });
        Alert.alert(
          "Error",
          "Vous devez être connecté et avoir un logement sélectionné pour créer un événement",
        );
        return;
      }

      if (editingEvent) {
        const eventData: EventPatch = {
          title: newEvent.title,
          description: newEvent.description || null,
          plannedDate: newEvent.startTime,
          endDate: newEvent.endTime,
        };

        const updatedEvent = await eventService.updateEventById(
          editingEvent.id,
          eventData,
        );

        setEvents(
          events.map((e) =>
            e.id === editingEvent.id
              ? {
                  id: updatedEvent._id,
                  title: updatedEvent.title,
                  startDate: format(
                    newEvent.startTime,
                    "yyyy-MM-dd'T'HH:mm:ss",
                  ),
                  endDate: format(newEvent.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
                  description: updatedEvent.description,
                  userId: updatedEvent.userId,
                }
              : e,
          ),
        );
      } else {
        const eventData: EventPost = {
          title: newEvent.title,
          description: newEvent.description || null,
          plannedDate: newEvent.startTime,
          endDate: newEvent.endTime,
          userId,
          accommodationId,
        };

        const createdEvent = await eventService.createEvent(eventData);

        const event: Event = {
          id: createdEvent._id,
          title: createdEvent.title,
          startDate: format(newEvent.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
          endDate: format(newEvent.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
          description: createdEvent.description,
          userId: createdEvent.userId, // Add this line
        };

        setEvents([...events, event]);
      }

      setEditingEvent(null);
      setIsModalVisible(false);
    } catch (error: any) {
      console.error("Failed to save event:", error);
      if (error.response) {
        console.error("Error response:", {
          status: error.response.status,
          data: error.response.data,
        });
        Alert.alert(
          "Erreur",
          `Échec de la sauvegarde: ${error.response.data.message || "Veuillez vérifier les données saisies"}`,
        );
      } else {
        Alert.alert("Erreur", "Échec de la sauvegarde. Veuillez réessayer.");
      }
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    if (event.userId !== userId) {
      Alert.alert(
        "Non autorisé",
        "Vous ne pouvez supprimer que vos propres événements",
      );
      return;
    }

    try {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir supprimer cet événement ?",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              await eventService.deleteEventById(event.id);
              setEvents(events.filter((e) => e.id !== event.id));
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert("Erreur", "Échec de la suppression. Veuillez réessayer.");
    }
  };

  const getEventsForSelectedDate = () => {
    return events.filter((event) => {
      const eventDate = format(parseISO(event.startDate), "yyyy-MM-dd");
      const matchesDate = eventDate === selectedDate;
      const matchesSearch = searchQuery
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesDate && matchesSearch;
    });
  };

  const markedDates = events.reduce<
    Record<
      string,
      {
        selected?: boolean;
        selectedColor?: string;
        marked: boolean;
        dots?: { color: string }[];
      }
    >
  >(
    (acc, event) => {
      const date = format(parseISO(event.startDate), "yyyy-MM-dd");
      acc[date] = {
        ...(date === selectedDate
          ? {
              selected: true,
              selectedColor: "#007AFF",
            }
          : {}),
        marked: true,
        dots: [{ color: date === selectedDate ? "white" : "#007AFF" }],
      };
      return acc;
    },
    {
      [selectedDate]: {
        selected: true,
        selectedColor: "#007AFF",
        marked: events.some(
          (event) =>
            format(parseISO(event.startDate), "yyyy-MM-dd") === selectedDate,
        ),
        dots: events.some(
          (event) =>
            format(parseISO(event.startDate), "yyyy-MM-dd") === selectedDate,
        )
          ? [{ color: "white" }]
          : undefined,
      },
    },
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher des événements..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
      <Calendar onDayPress={handleDayPress} markedDates={markedDates} />
      <DayEvents
        date={selectedDate}
        events={getEventsForSelectedDate()}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />
      <AddEventModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        editEvent={editingEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    margin: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: "#000000",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
