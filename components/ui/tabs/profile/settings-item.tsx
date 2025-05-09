import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  textColor?: string;
}

export function SettingsItem({
  icon,
  title,
  onPress,
  textColor = "text-gray-800",
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        {icon}
        <Text className={`ml-3 font-medium ${textColor}`}>{title}</Text>
      </View>
      <ChevronRight size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
}
