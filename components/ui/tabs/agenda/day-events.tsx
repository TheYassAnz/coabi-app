import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Event } from "@/types/zod/event";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

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
  const { userId } = useAuth();
  const isPastDate = isBefore(parseISO(date), startOfDay(new Date()));

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-black">
          {format(parseISO(date), "d MMMM yyyy", { locale: fr })}
        </Text>
        <TouchableOpacity
          onPress={onAddEvent}
          className={`bg-gray-800 p-2 rounded-lg ${isPastDate ? "opacity-50 relative" : ""}`}
          disabled={isPastDate}
        >
          <Text className="text-white font-medium">Ajouter un événement</Text>
          {isPastDate && (
            <View className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-red-500 border border-white" />
          )}
        </TouchableOpacity>
      </View>
      {isPastDate && (
        <Text className="text-red-500 text-xs -mt-3 mb-3 text-right">
          Impossible de créer des événements pour les dates passées
        </Text>
      )}
      <ScrollView className="flex-1">
        {events.length === 0 ? (
          <Text className="text-center text-gray-500 text-base mt-5">
            Aucun événement trouvé pour cette date
          </Text>
        ) : (
          events.map((event) => (
            <View
              key={event.id}
              className={`bg-gray-100 p-4 rounded-xl mb-2 border border-gray-200 shadow ${
                event.status === "pending"
                  ? "border-l-4 border-l-green-500"
                  : event.status === "confirmed"
                    ? "border-l-4 border-l-green-500"
                    : event.status === "cancelled"
                      ? "border-l-4 border-l-red-500"
                      : ""
              }`}
            >
              <View className="flex-row items-start">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-black mb-1">
                    {event.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mb-1">
                    {format(parseISO(event.startDate), "HH:mm")} -{" "}
                    {format(parseISO(event.endDate), "HH:mm")}
                  </Text>
                  {event.description && (
                    <Text className="text-sm text-gray-500">
                      {event.description}
                    </Text>
                  )}
                  {event.status && (
                    <View className="mt-2 self-start">
                      <Text className="text-xs text-gray-500 capitalize">
                        {event.status}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {event.userId === userId && (
                <View className="flex-row justify-end mt-2">
                  <TouchableOpacity
                    onPress={() => onEditEvent(event)}
                    className="p-2 ml-2 rounded-lg"
                  >
                    <Text className="text-gray-800 font-medium">Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDeleteEvent(event)}
                    className="p-2 ml-2 rounded-lg bg-gray-800"
                  >
                    <Text className="text-white font-medium">Supprimer</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};
