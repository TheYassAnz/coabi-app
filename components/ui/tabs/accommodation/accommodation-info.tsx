import { View, Text } from "react-native";
import { Home, MapPin, Globe } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import type { AccommodationResponse } from "@/types/zod/accommodation";

interface AccommodationInfoProps {
  accommodation: AccommodationResponse;
}

export const AccommodationInfo = ({
  accommodation,
}: AccommodationInfoProps) => {
  return (
    <View className="items-center my-6">
      <View className="bg-cyan-100 rounded-full w-20 h-20 items-center justify-center">
        <Home size={32} color="#0891b2" />
      </View>
      <Text className="text-xl font-bold text-gray-800 mt-4">
        {accommodation.name}
      </Text>
      <HStack className="items-center mt-1">
        <MapPin size={16} color="#64748b" />
        <Text className="text-gray-500 ml-1">
          {accommodation.location}, {accommodation.postalCode}
        </Text>
      </HStack>
      <HStack className="items-center mt-1">
        <Globe size={16} color="#64748b" />
        <Text className="text-gray-500 ml-1">{accommodation.country}</Text>
      </HStack>
    </View>
  );
};
