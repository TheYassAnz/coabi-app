import { View, Text } from "react-native";
import { HStack } from "@/components/ui/hstack";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  return (
    <HStack className="items-center">
      <View className="w-8">{icon}</View>
      <View>
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-gray-800">{value}</Text>
      </View>
    </HStack>
  );
};
