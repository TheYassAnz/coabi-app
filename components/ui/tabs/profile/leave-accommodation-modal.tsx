import { AlertTriangle } from "lucide-react-native";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface LeaveAccommodationModalProps {
  visible: boolean;
  onClose: () => void;
  onLeave: () => void;
}

export function LeaveAccommodationModal({
  visible,
  onClose,
  onLeave,
}: LeaveAccommodationModalProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white p-6 rounded-2xl w-5/6 max-w-md">
          <View className="items-center mb-4">
            <View className="bg-amber-100 p-3 rounded-full mb-2">
              <AlertTriangle size={28} color="#f59e0b" />
            </View>
            <Text className="text-xl font-bold text-gray-800">
              Quitter le colocation
            </Text>
          </View>
          <Text className="text-gray-600 mb-6 text-center">
            Êtes-vous sûr de vouloir quitter cette colocation ? Vous devrez être
            invité à nouveau pour le rejoindre.
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="flex-1 mr-2 bg-gray-200 py-3 rounded-lg items-center"
              onPress={onClose}
            >
              <Text className="font-medium text-gray-800">Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-2 bg-amber-500 py-3 rounded-lg items-center"
              onPress={onLeave}
            >
              <Text className="font-medium text-white">Quitter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
