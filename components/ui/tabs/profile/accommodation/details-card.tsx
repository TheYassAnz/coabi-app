import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Calendar, Users, ClipboardList } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import type { AccommodationResponse } from "@/types/zod/accommodation";
import type { UserResponse } from "@/types/zod/user";
import { format } from "date-fns";

interface DetailsCardProps {
  accommodation: AccommodationResponse;
  members: UserResponse[];
}

export const DetailsCard = ({ accommodation, members }: DetailsCardProps) => {
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return "Date inconnue";
    }
  };

  return (
    <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <Text className="text-lg font-semibold text-gray-800 mb-3">Détails</Text>

      <HStack className="items-center mb-3">
        <Calendar size={20} color="#0891b2" />
        <Text className="text-gray-700 ml-2">
          Créé le {formatDate(accommodation.createdAt)}
        </Text>
      </HStack>

      <HStack className="items-center mb-3">
        <Users size={20} color="#0891b2" />
        <Text className="text-gray-700 ml-2">
          {members.length} {members.length === 1 ? "Membre" : "Membres"}
        </Text>
      </HStack>

      <TouchableOpacity
        onPress={() => router.replace("/profile/rules")}
        className="flex-row items-center mt-2 p-2 bg-cyan-50 rounded-lg"
      >
        <ClipboardList size={20} color="#0891b2" />
        <Text className="text-cyan-700 font-medium ml-2">
          Voir les règles de colocation
        </Text>
      </TouchableOpacity>
    </View>
  );
};
