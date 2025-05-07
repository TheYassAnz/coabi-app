import type { AccommodationResponse } from "@/types/zod/accommodation";
import type { UserResponse } from "@/types/zod/user";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { AccommodationService } from "@/services/server/accommodation";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";
import { HStack } from "@/components/ui/hstack";
import {
  ArrowLeftIcon,
  Home,
  MapPin,
  Globe,
  Key,
  Calendar,
  User,
  Users,
  Copy,
  CheckCircle,
} from "lucide-react-native";
import { format } from "date-fns";

export default function AccommodationScreen() {
  const [accommodation, setAccommodation] =
    useState<AccommodationResponse | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [members, setMembers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setLoading(true);
        const userData = await getUserByAccessToken();
        if (!userData || !userData.accommodationId) {
          Alert.alert("Erreur", "Vous ne faites partie d'aucune colocation");
          router.replace("/profile");
          return;
        }

        const accommodationId = userData.accommodationId;
        const accommodationService = new AccommodationService();
        const userService = new UserService();

        const accommodationData =
          await accommodationService.getAccommodationById(accommodationId);
        const membersData = await userService.getAllUsers();

        setAccommodation(accommodationData);
        setUser(userData);
        setMembers(membersData);
      } catch (error: any) {
        Alert.alert(
          "Erreur",
          error.message || "Échec du chargement des données de la colocation",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, []);

  const handleMemberPress = (username: string) => {
    if (user && username !== user.username) {
      router.replace(`./roommate/${username}`);
    } else {
      router.replace(`/profile/edit`);
    }
  };

  const copyInviteCode = () => {
    if (accommodation?.code) {
      Clipboard.setStringAsync(accommodation.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return "Date inconnue";
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="mt-4 text-gray-600">
            Chargement des détails de la colocation...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {accommodation ? (
          <>
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
                <Text className="text-gray-500 ml-1">
                  {accommodation.country}
                </Text>
              </HStack>
            </View>

            {user && (user.role === "moderator" || user.role === "admin") && (
              <TouchableOpacity
                onPress={copyInviteCode}
                className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-cyan-100"
              >
                <HStack className="items-center justify-between">
                  <HStack className="items-center">
                    <Key size={20} color="#0891b2" />
                    <Text className="font-medium text-gray-800 ml-2">
                      Code d'invitation
                    </Text>
                  </HStack>
                  {codeCopied ? (
                    <CheckCircle size={20} color="#10b981" />
                  ) : (
                    <Copy size={20} color="#64748b" />
                  )}
                </HStack>
                <Text className="text-lg font-bold text-cyan-700 mt-2 text-center">
                  {accommodation.code}
                </Text>
                <Text className="text-xs text-gray-500 mt-1 text-center">
                  {codeCopied
                    ? "Copié dans le presse-papiers !"
                    : "Appuyez pour copier et partager avec vos colocataires"}
                </Text>
              </TouchableOpacity>
            )}

            <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Détails
              </Text>

              <HStack className="items-center mb-3">
                <Calendar size={20} color="#0891b2" />
                <Text className="text-gray-700 ml-2">
                  Créé le {formatDate(accommodation.createdAt)}
                </Text>
              </HStack>

              <HStack className="items-center">
                <Users size={20} color="#0891b2" />
                <Text className="text-gray-700 ml-2">
                  {members.length} {members.length === 1 ? "Membre" : "Membres"}
                </Text>
              </HStack>
            </View>

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
                      user && member.username === user.username
                        ? "bg-cyan-50 border border-cyan-100"
                        : "bg-gray-50"
                    }`}
                    activeOpacity={0.7}
                  >
                    <HStack className="items-center">
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center ${
                          user && member.username === user.username
                            ? "bg-cyan-200"
                            : "bg-gray-200"
                        }`}
                      >
                        <User
                          size={20}
                          color={
                            user && member.username === user.username
                              ? "#0891b2"
                              : "#64748b"
                          }
                        />
                      </View>
                      <View className="ml-3">
                        <Text
                          className={`font-medium ${
                            user && member.username === user.username
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
                    {user && member.username === user.username && (
                      <Text className="text-xs font-medium text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
                        Vous
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-500">Aucune colocation trouvée</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
