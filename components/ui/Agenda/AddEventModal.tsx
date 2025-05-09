import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parseISO } from "date-fns";
import { Event } from "../../../types/zod/event";

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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editEvent ? "Modifier l'événement" : "Nouvel événement"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Titre de l'événement"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#666"
          />

          <View style={styles.timeSection}>
            <Text style={styles.timeSectionTitle}>Horaires</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                Début : {format(startTime, "HH:mm")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                Fin : {format(endTime, "HH:mm")}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description (optionnelle)"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#666"
          />

          {(showStartTimePicker || showEndTimePicker) && (
            <View style={styles.timePickerContainer}>
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxHeight: "90%",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    color: "#000000",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    color: "#000000",
  },
  timeSection: {
    marginBottom: 20,
  },
  timeSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
  },
  timeButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  timeButtonText: {
    fontSize: 16,
    color: "#000000",
  },
  timePickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 0.48,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  saveButton: {
    backgroundColor: "#333333",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  saveButtonText: {
    color: "#FFFFFF",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
});
