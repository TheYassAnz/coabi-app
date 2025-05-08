import type { AccommodationResponse } from "@/types/zod/accommodation";
import type { UserResponse } from "@/types/zod/user";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { AccommodationService } from "@/services/server/accommodation";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";
import { AccommodationHeader } from "@/components/ui/tabs/accommodation/accommodation-header";
import { AccommodationInfo } from "@/components/ui/tabs/accommodation/accommodation-info";
import { DetailsCard } from "@/components/ui/tabs/accommodation/details-card";
import { InviteCodeCard } from "@/components/ui/tabs/accommodation/invite-code-card";
import { MembersList } from "@/components/ui/tabs/accommodation/members-list";

export default function AccommodationScreen() {
  const [accommodation, setAccommodation] =
    useState<AccommodationResponse | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [members, setMembers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0891b2" />
        <Text className="mt-4 text-gray-600">
          Chargement des détails de la colocation...
        </Text>
      </View>
    </SafeAreaView>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AccommodationHeader />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {accommodation ? (
          <>
            <AccommodationInfo accommodation={accommodation} />

            {user && (user.role === "moderator" || user.role === "admin") && (
              <InviteCodeCard accommodation={accommodation} />
            )}

            <DetailsCard accommodation={accommodation} members={members} />

            <MembersList members={members} currentUser={user} />
          </>
        ) : (
          <View className="items-center justify-center py-10">
            <View>No accommodation found</View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
