import type { UserResponse } from "@/types/zod/user";
import type { RuleResponse, RulePost, RulePatch } from "@/types/zod/rule";
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
import { RuleService } from "@/services/server/rule";
import { getUserByAccessToken } from "@/services/utils";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ArrowLeftIcon, FileText } from "lucide-react-native";
import RuleCard from "@/components/ui/tabs/rule/card";
import { CreateRuleModal } from "@/components/ui/tabs/rule/create-rule";

export default function RulesScreen() {
  const [rules, setRules] = useState<RuleResponse[]>([]);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [rulesChange, setRulesChange] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const ruleService = new RuleService();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const rulesData = await ruleService.getAllRules();
        setRules(rulesData);
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

    fetchRules();
    fetchUser();
  }, [rulesChange]);

  const updateRule = async (ruleId: string, data: RulePatch) => {
    try {
      setActionLoading(true);
      await ruleService.updateRuleById(ruleId, data);

      setRulesChange(!rulesChange);

      Alert.alert("Succès", "La règle a été mise à jour avec succès");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const createRule = async (data: RulePost) => {
    try {
      setActionLoading(true);
      await ruleService.createRule(data);

      setRulesChange(!rulesChange);

      Alert.alert("Succès", "La règle a été créée avec succès");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const removeRule = async (ruleId: string) => {
    try {
      setActionLoading(true);
      await ruleService.deleteRuleById(ruleId);

      setRulesChange(!rulesChange);

      Alert.alert("Succès", "La règle a été supprimée");
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
            Chargement des règles de la colocation...
          </Text>
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
          Règles de la colocation
        </Text>
        <View style={{ width: 40 }} />
      </HStack>

      <ScrollView className="flex-1 px-4 pt-4 pb-20">
        {rules.length === 0 ? (
          <View className="py-10 items-center">
            <FileText size={48} color="#94a3b8" />
            <Text className="text-gray-500 mt-4 text-center">
              Aucune règle n'a encore été créée pour cette colocation.
            </Text>
            {user?.role === "moderator" && (
              <Text className="text-gray-500 text-center">
                Appuyez sur le bouton + pour en ajouter une.
              </Text>
            )}
          </View>
        ) : (
          user && (
            <VStack space="md">
              {rules.map((rule) => (
                <RuleCard
                  key={rule._id}
                  rule={rule}
                  isModeratorOrAdmin={user.role !== "user"}
                  onUpdate={updateRule}
                  onDelete={removeRule}
                />
              ))}
            </VStack>
          )
        )}
      </ScrollView>

      {user && user.role !== "user" && user.accommodationId && (
        <>
          <CreateRuleModal
            accommodationId={user.accommodationId}
            onCreate={createRule}
          />
        </>
      )}
    </SafeAreaView>
  );
}
