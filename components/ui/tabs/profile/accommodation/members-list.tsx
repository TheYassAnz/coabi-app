import { View, Text, TouchableOpacity } from "react-native";
import { User } from "lucide-react-native";
import { router } from "expo-router";
import { HStack } from "@/components/ui/hstack";
import type { UserResponse } from "@/types/zod/user";

interface MembersListProps {
  members: UserResponse[];
  currentUser: UserResponse | null;
}

export const MembersList = ({ members, currentUser }: MembersListProps) => {
  const handleMemberPress = (username: string) => {
    if (currentUser && username !== currentUser.username) {
      router.replace(`./roommate/${username}`);
    } else {
      router.replace(`/profile/edit`);
    }
  };

  return (
    <View className="bg-white rounded-xl shadow-sm p-4">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Colocataires
      </Text>

      <View className="space-y-2">
        {members.map((member) => (
          <TouchableOpacity
            key={member._id}
            onPress={() => handleMemberPress(member.username)}
            className={`p-3 rounded-lg flex-row items-center justify-between ${
              currentUser && member.username === currentUser.username
                ? "bg-cyan-50 border border-cyan-100"
                : "bg-gray-50"
            }`}
            activeOpacity={0.7}
          >
            <HStack className="items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  currentUser && member.username === currentUser.username
                    ? "bg-cyan-200"
                    : "bg-gray-200"
                }`}
              >
                <User
                  size={20}
                  color={
                    currentUser && member.username === currentUser.username
                      ? "#0891b2"
                      : "#64748b"
                  }
                />
              </View>
              <View className="ml-3">
                <Text
                  className={`font-medium ${
                    currentUser && member.username === currentUser.username
                      ? "text-cyan-700"
                      : "text-gray-800"
                  }`}
                >
                  {member.firstName || member.lastName
                    ? `${member.firstName || ""} ${member.lastName || ""}`.trim()
                    : member.username}
                </Text>
                <Text className="text-gray-500 text-sm">
                  @{member.username}
                </Text>
              </View>
            </HStack>
            {currentUser && member.username === currentUser.username && (
              <Text className="text-xs font-medium text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
                Vous
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
