import { User, Key, LogOut, Home, UserX } from "lucide-react-native";
import { Text, View, Alert, ScrollView, ActivityIndicator } from "react-native";
import { AuthService } from "@/services/server/auth";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";
import type { UserResponse } from "@/types/zod/user";
import { SettingsItem } from "@/components/ui/tabs/profile/settings-item";
import { ProfileHeader } from "@/components/ui/tabs/profile/profile-header";
import { LeaveAccommodationModal } from "@/components/ui/tabs/profile/leave-accommodation-modal";
import { DeleteAccountModal } from "@/components/ui/tabs/profile/delete-account-modal";

export default function ProfileScreen() {
  const authService = new AuthService();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [moderators, setModerators] = useState<UserResponse[]>([]);
  const [warningLeaveAccommodation, setWarningLeaveAccommodation] =
    useState<boolean>(false);
  const [warningDelete, setWarningDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const userService = new UserService();

  useEffect(() => {
    const checkAccommodation = async () => {
      try {
        setLoading(true);
        const userData = await getUserByAccessToken();
        if (!userData) {
          Alert.alert("Non authentifié");
          return authService.logout();
        }
        setUser(userData);
        const moderatorsData = await userService.filterUsers({
          role: "moderator",
        });
        setModerators(moderatorsData);
      } catch (error: any) {
        Alert.alert(
          "Erreur",
          error.message || "Échec de chargement des données utilisateur",
        );
      } finally {
        setLoading(false);
      }
    };

    checkAccommodation();
  }, []);

  const goToChangePassword = () => {
    router.replace("/profile/change-password");
  };

  const cannotLeave = () => {
    Alert.alert(
      "Impossible de quitter",
      "Vous êtes le seul modérateur. Donnez d'abord ce rôle à un autre utilisateur.",
    );
    router.replace("/profile/accommodation");
  };

  const leaveAccommodation = async () => {
    if (!user) {
      return Alert.alert("Erreur", "Utilisateur non trouvé");
    }
    try {
      await userService.updateUserById(user._id, { accommodationId: null });
      Alert.alert("Succès", "Vous avez quitté la colocation");
      setWarningLeaveAccommodation(false);
      return authService.logout();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  const deleteAccount = async () => {
    try {
      const user = await getUserByAccessToken();
      if (!user) {
        return Alert.alert("Erreur", "Utilisateur non trouvé");
      }
      await userService.deleteUserById(user._id);
      Alert.alert("Succès", "Votre compte a été supprimé");
      setWarningDelete(false);
      return authService.logout();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  const handleLeaveAccommodation = () => {
    if (moderators.length === 1 && user && user.role === "moderator") {
      cannotLeave();
    } else {
      leaveAccommodation();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0891b2" />
        <Text className="text-gray-600 mt-4">
          Chargement de votre profil...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-4 py-6">
        <ProfileHeader user={user} />

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Paramètres du compte
          </Text>
          <View className="bg-white rounded-xl shadow-sm overflow-hidden">
            <SettingsItem
              icon={<Home size={20} color="#0891b2" />}
              title="Votre colocation"
              onPress={() => router.replace("/profile/accommodation")}
            />
            <SettingsItem
              icon={<Key size={20} color="#0891b2" />}
              title="Changer le mot de passe"
              onPress={goToChangePassword}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Actions
          </Text>
          <View className="bg-white rounded-xl shadow-sm overflow-hidden">
            <SettingsItem
              icon={<Home size={20} color="#f59e0b" />}
              title="Quitter le colocation"
              textColor="text-amber-600"
              onPress={() => setWarningLeaveAccommodation(true)}
            />
            <SettingsItem
              icon={<LogOut size={20} color="#0891b2" />}
              title="Se déconnecter"
              onPress={logout}
            />
          </View>
        </View>

        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Zone de danger
          </Text>
          <View className="bg-white rounded-xl shadow-sm overflow-hidden">
            <SettingsItem
              icon={<UserX size={20} color="#ef4444" />}
              title="Supprimer votre compte"
              textColor="text-red-600"
              onPress={() => setWarningDelete(true)}
            />
          </View>
        </View>
      </View>

      <LeaveAccommodationModal
        visible={warningLeaveAccommodation}
        onClose={() => setWarningLeaveAccommodation(false)}
        onLeave={handleLeaveAccommodation}
      />

      <DeleteAccountModal
        visible={warningDelete}
        onClose={() => setWarningDelete(false)}
        onDelete={deleteAccount}
      />
    </ScrollView>
  );
}
