import { AlertTriangle } from "lucide-react-native";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteAccountModal({
  visible,
  onClose,
  onDelete,
}: DeleteAccountModalProps) {
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
            <View className="bg-red-100 p-3 rounded-full mb-2">
              <AlertTriangle size={28} color="#ef4444" />
            </View>
            <Text className="text-xl font-bold text-gray-800">
              Supprimer le compte
            </Text>
          </View>
          <Text className="text-gray-600 mb-6 text-center">
            Cette action ne peut pas être annulée. Toutes vos données seront
            définitivement supprimées.
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="flex-1 mr-2 bg-gray-200 py-3 rounded-lg items-center"
              onPress={onClose}
            >
              <Text className="font-medium text-gray-800">Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-2 bg-red-600 py-3 rounded-lg items-center"
              onPress={onDelete}
            >
              <Text className="font-medium text-white">Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
