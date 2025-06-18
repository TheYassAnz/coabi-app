import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parseISO } from "date-fns";
import { Event } from "@/types/zod/event";

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: {
    title: string;
    startTime: Date;
    endTime: Date;
    description?: string;
  }) => void;
  selectedDate: string;
  editEvent: Event | null;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  visible,
  onClose,
  onSave,
  selectedDate,
  editEvent,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description || "");
      setStartTime(parseISO(editEvent.startDate));
      setEndTime(parseISO(editEvent.endDate));
    }
  }, [editEvent]);

  const handleSave = () => {
    if (!title) return;

    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes());

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

    onSave({
      title,
      startTime: startDateTime,
      endTime: endDateTime,
      description,
    });

    setTitle("");
    setDescription("");
    setStartTime(new Date());
    setEndTime(new Date());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-[90%] max-h-[90%] shadow-md">
          <Text className="text-2xl font-semibold mb-6 text-black text-center">
            {editEvent ? "Modifier l'événement" : "Nouvel événement"}
          </Text>

          <TextInput
            className="border border-gray-200 rounded-xl p-4 mb-4 text-base bg-gray-100 text-black"
            placeholder="Titre de l'événement"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#666"
          />

          <View className="mb-5">
            <Text className="text-base font-medium text-black mb-2">
              Horaires
            </Text>
            <TouchableOpacity
              className="bg-gray-100 rounded-xl p-4 mb-2 border border-gray-200"
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text className="text-base text-black">
                Début : {format(startTime, "HH:mm")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-100 rounded-xl p-4 mb-2 border border-gray-200"
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text className="text-base text-black">
                Fin : {format(endTime, "HH:mm")}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            className="border border-gray-200 rounded-xl p-4 mb-4 text-base bg-gray-100 text-black h-24 align-top"
            placeholder="Description (optionnelle)"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#666"
          />

          {(showStartTimePicker || showEndTimePicker) && (
            <View className="bg-white rounded-xl mb-4 overflow-hidden border border-gray-200">
              <DateTimePicker
                value={showStartTimePicker ? startTime : endTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, selectedTime) => {
                  if (selectedTime) {
                    if (showStartTimePicker) {
                      setStartTime(selectedTime);
                    } else {
                      setEndTime(selectedTime);
                    }
                  }
                  setShowStartTimePicker(false);
                  setShowEndTimePicker(false);
                }}
              />
            </View>
          )}

          <View className="flex-row justify-between mt-2">
            <TouchableOpacity
              className="flex-[0.48] p-4 rounded-xl items-center justify-center bg-gray-100 border border-gray-200"
              onPress={onClose}
            >
              <Text className="text-base font-semibold text-black">
                Annuler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-[0.48] p-4 rounded-xl items-center justify-center bg-gray-800"
              onPress={handleSave}
            >
              <Text className="text-base font-semibold text-white">
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
