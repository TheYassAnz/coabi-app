import { Edit, User } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import type { UserResponse } from "@/types/zod/user";

interface ProfileHeaderProps {
  user: UserResponse | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View className="items-center mb-8">
      <View className="bg-cyan-600 rounded-full w-24 h-24 items-center justify-center mb-3">
        <User size={40} color="white" />
      </View>
      <Text className="text-2xl font-bold text-gray-800">
        {user?.username || "Utilisateur"}
      </Text>
      <Text className="text-gray-500">{user?.email || "Aucun email"}</Text>
      <TouchableOpacity
        className="flex-row items-center mt-2 bg-cyan-50 px-4 py-2 rounded-full"
        onPress={() => router.replace(`/profile/edit`)}
      >
        <Edit size={16} color="#0891b2" />
        <Text className="text-cyan-600 ml-1">Modifier le profil</Text>
      </TouchableOpacity>
    </View>
  );
}
