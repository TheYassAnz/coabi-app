import {
  User,
  Key,
  LogOut,
  Home,
  UserX,
  AlertTriangle,
  ChevronRight,
  Edit,
} from "lucide-react-native";
import {
  Text,
  View,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AuthService } from "@/services/server/auth";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";
import type { UserResponse } from "@/types/zod/user";

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
          router.replace("/login");
          return;
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
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      router.replace("/login");
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
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
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

      <Modal
        transparent={true}
        visible={warningLeaveAccommodation}
        animationType="fade"
        onRequestClose={() => setWarningLeaveAccommodation(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-2xl w-5/6 max-w-md">
            <View className="items-center mb-4">
              <View className="bg-amber-100 p-3 rounded-full mb-2">
                <AlertTriangle size={28} color="#f59e0b" />
              </View>
              <Text className="text-xl font-bold text-gray-800">
                Quitter le colocation
              </Text>
            </View>
            <Text className="text-gray-600 mb-6 text-center">
              Êtes-vous sûr de vouloir quitter cette colocation ? Vous devrez
              être invité à nouveau pour le rejoindre.
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-1 mr-2 bg-gray-200 py-3 rounded-lg items-center"
                onPress={() => setWarningLeaveAccommodation(false)}
              >
                <Text className="font-medium text-gray-800">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 ml-2 bg-amber-500 py-3 rounded-lg items-center"
                onPress={() =>
                  moderators.length === 1 ? cannotLeave() : leaveAccommodation()
                }
              >
                <Text className="font-medium text-white">Quitter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={warningDelete}
        animationType="fade"
        onRequestClose={() => setWarningDelete(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-2xl w-5/6 max-w-md">
            <View className="items-center mb-4">
              <View className="bg-red-100 p-3 rounded-full mb-2">
                <AlertTriangle size={28} color="#ef4444" />
              </View>
              <Text className="text-xl font-bold text-gray-800">
                Supprimer le compte
              </Text>
            </View>
            <Text className="text-gray-600 mb-6 text-center">
              Cette action ne peut pas être annulée. Toutes vos données seront
              définitivement supprimées.
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-1 mr-2 bg-gray-200 py-3 rounded-lg items-center"
                onPress={() => setWarningDelete(false)}
              >
                <Text className="font-medium text-gray-800">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 ml-2 bg-red-600 py-3 rounded-lg items-center"
                onPress={deleteAccount}
              >
                <Text className="font-medium text-white">Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function SettingsItem({
  icon,
  title,
  onPress,
  textColor = "text-gray-800",
}: {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  textColor?: string;
}) {
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
