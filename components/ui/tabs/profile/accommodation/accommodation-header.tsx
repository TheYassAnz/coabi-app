import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";

export const AccommodationHeader = () => {
  return (
    <HStack className="w-full px-4 py-3 border-b border-gray-200 bg-white items-center justify-between">
      <TouchableOpacity
        onPress={() => router.replace("/profile")}
        className="p-2 rounded-full bg-gray-100"
      >
        <ArrowLeftIcon color="#0f172a" size={20} />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-gray-800">Colocation</Text>
      <View style={{ width: 40 }} />
    </HStack>
  );
};
