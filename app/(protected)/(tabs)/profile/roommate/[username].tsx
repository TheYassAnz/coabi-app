import type { UserResponse } from "@/types/zod/user";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import {
  ArrowLeftIcon,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Shield,
  UserMinus,
  AlertTriangle,
} from "lucide-react-native";

export default function RoommateProfile() {
  const { username } = useLocalSearchParams();
  const [roommate, setRoommate] = useState<UserResponse | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [warningLeaveAccommodation, setWarningLeaveAccommodation] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const userService = new UserService();

  useEffect(() => {
    const fetchRoommate = async (username: string) => {
      try {
        const roommateData = await userService.filterUsers({ name: username });
        setRoommate(roommateData[0]);
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
        router.replace("/");
      }
    };

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserByAccessToken();
        if (!userData) {
          Alert.alert("Erreur", "Utilisateur non trouvé");
          return;
        }
        setUser(userData);
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (typeof username === "string") {
      fetchRoommate(username);
    }
    fetchUser();
  }, [username]);

  const updateRoommateRole = async (role: "user" | "moderator") => {
    try {
      setActionLoading(true);
      if (!roommate) return;

      await userService.updateUserById(roommate._id, { role: role });

      setRoommate({
        ...roommate,
        role: role,
      });

      Alert.alert(
        "Succès",
        "Le rôle du colocataire a été mis à jour avec succès",
      );
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const removeRoommate = async () => {
    try {
      setActionLoading(true);
      if (!roommate) return;

      await userService.updateUserById(roommate._id, { accommodationId: null });

      Alert.alert("Succès", "Le colocataire a été retiré de la colocation");
      setWarningLeaveAccommodation(false);

      setTimeout(() => {
        router.replace("/profile/accommodation");
      }, 500);
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="mt-4 text-gray-600">
            Chargement des détails du colocataire...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!roommate || !user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Colocataire non trouvé</Text>
          <Button
            className="mt-4"
            onPress={() => router.replace("/profile/accommodation")}
          >
            <ButtonText>Retour</ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <HStack className="w-full px-4 py-3 border-b border-gray-200 bg-white items-center justify-between">
        <TouchableOpacity
          onPress={() => router.replace("/profile/accommodation")}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeftIcon color="#0f172a" size={20} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">
          Profil du colocataire
        </Text>
        <View style={{ width: 40 }} />
      </HStack>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center my-6">
          <View className="bg-cyan-100 rounded-full w-24 h-24 items-center justify-center">
            <User size={40} color="#0891b2" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mt-4">
            {roommate.firstName || ""} {roommate.lastName || ""}
          </Text>
          <Text className="text-gray-500">@{roommate.username}</Text>

          {roommate.role === "moderator" && (
            <View className="bg-cyan-100 px-3 py-1 rounded-full mt-2 flex-row items-center">
              <Shield size={14} color="#0891b2" />
              <Text className="text-cyan-700 text-xs font-medium ml-1">
                Modérateur
              </Text>
            </View>
          )}
        </View>

        <View className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Informations personnelles
          </Text>

          <View className="space-y-4">
            <InfoItem
              icon={<User size={20} color="#0891b2" />}
              label="Nom complet"
              value={`${roommate.firstName || "Non renseigné"} ${roommate.lastName || ""}`}
            />

            <InfoItem
              icon={<Calendar size={20} color="#0891b2" />}
              label="Âge"
              value={roommate.age ? roommate.age.toString() : "Non renseigné"}
            />

            <InfoItem
              icon={<Mail size={20} color="#0891b2" />}
              label="Email"
              value={roommate.email}
            />

            <InfoItem
              icon={<Phone size={20} color="#0891b2" />}
              label="Numéro de téléphone"
              value={roommate.phoneNumber || "Non renseigné"}
            />
          </View>
        </View>

        {roommate.description && (
          <View className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <HStack className="items-center mb-2">
              <FileText size={20} color="#0891b2" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                À propos
              </Text>
            </HStack>
            <Text className="text-gray-700">
              {roommate.description || "Aucune description fournie."}
            </Text>
          </View>
        )}

        {user.role === "moderator" && (
          <View className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Actions du modérateur
            </Text>

            <View className="space-y-3">
              {roommate.role === "user" && (
                <Button
                  className="bg-cyan-600"
                  onPress={() => updateRoommateRole("moderator")}
                  isDisabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Shield size={18} color="white" />
                      <ButtonText className="ml-2">
                        Promouvoir comme modérateur
                      </ButtonText>
                    </>
                  )}
                </Button>
              )}

              <Button
                className="bg-red-600"
                onPress={() => setWarningLeaveAccommodation(true)}
                isDisabled={actionLoading}
              >
                <UserMinus size={18} color="white" />
                <ButtonText className="ml-2">
                  Retirer de la colocation
                </ButtonText>
              </Button>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        transparent={true}
        visible={warningLeaveAccommodation}
        animationType="fade"
        onRequestClose={() => setWarningLeaveAccommodation(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-2xl w-5/6 max-w-md">
            <View className="items-center mb-4">
              <View className="bg-red-100 p-3 rounded-full mb-2">
                <AlertTriangle size={28} color="#ef4444" />
              </View>
              <Text className="text-xl font-bold text-gray-800">
                Retirer le colocataire
              </Text>
            </View>
            <Text className="text-gray-600 mb-6 text-center">
              Êtes-vous sûr de vouloir que {roommate.username} quitte cette
              colocation ? Il devra être à nouveau invité pour rejoindre.
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-1 mr-2 bg-gray-200 py-3 rounded-lg items-center"
                onPress={() => setWarningLeaveAccommodation(false)}
              >
                <Text className="font-medium text-gray-800">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 ml-2 bg-red-600 py-3 rounded-lg items-center"
                onPress={removeRoommate}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="font-medium text-white">Retirer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <HStack className="items-center">
      <View className="w-8">{icon}</View>
      <View>
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-gray-800">{value}</Text>
      </View>
    </HStack>
  );
}
