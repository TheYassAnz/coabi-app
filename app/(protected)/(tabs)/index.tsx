"use client";

import { useEffect, useState } from "react";
import { getUserByAccessToken } from "@/services/utils";
import { TaskService } from "@/services/server/task";
import { RefundService } from "@/services/server/refund";
import { EventService } from "@/services/server/event";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import {
  CheckSquare,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
  User,
  Home,
  Plus,
  ChevronRight,
  Clock,
  Euro,
} from "lucide-react-native";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "expo-router";

export default function HomePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [iOwe, setIOwe] = useState<any[]>([]); // je dois
  const [theyOweMe, setTheyOweMe] = useState<any[]>([]); // on me doit
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getUserByAccessToken();

        if (!userData || !userData._id) {
          Alert.alert("Erreur", "Utilisateur non trouvé");
          return;
        }

        setUser(userData);

        const taskService = new TaskService();
        const refundService = new RefundService();
        const eventService = new EventService();

        const [userTasks, userEvents, refundsIOwe, refundsTheyOweMe] =
          await Promise.all([
            taskService.getAllTasks(),
            eventService.getAllEvents(),
            refundService.filterRefunds({ userId: userData._id }), // je dois de l'argent
            refundService.filterRefunds({ roommateId: userData._id }), // on me doit de l'argent
          ]);

        setTasks(userTasks.slice(0, 3));
        setEvents(userEvents.slice(0, 3));
        setIOwe(refundsIOwe.slice(0, 3));
        setTheyOweMe(refundsTheyOweMe.slice(0, 3));
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        Alert.alert("Erreur", "Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMM", { locale: fr });
    } catch (error) {
      return "Date inconnue";
    }
  };

  const getTotalIOwe = () => {
    return iOwe.reduce((total, refund) => total + (refund.toRefund || 0), 0);
  };

  const getTotalTheyOweMe = () => {
    return theyOweMe.reduce(
      (total, refund) => total + (refund.toRefund || 0),
      0,
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="mt-4 text-gray-600">
            Chargement de votre tableau de bord...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <HStack className="items-center mb-2">
            <View className="bg-cyan-100 rounded-full w-12 h-12 items-center justify-center mr-3">
              <Home size={24} color="#0891b2" />
            </View>
            <VStack>
              <Text className="text-2xl font-bold text-gray-800">
                Bonjour {user?.firstName} !
              </Text>
              <Text className="text-gray-500">
                Voici un aperçu de votre colocation
              </Text>
            </VStack>
          </HStack>
        </View>

        {/* Financial Summary Cards */}
        <HStack className="mb-6 justify-between">
          <View className="bg-white rounded-xl shadow-sm p-4 flex-1 mr-2">
            <HStack className="items-center mb-2">
              <ArrowUpCircle size={20} color="#ef4444" />
              <Text className="text-red-600 font-medium ml-2">Je dois</Text>
            </HStack>
            <Text className="text-2xl font-bold text-red-700">
              {getTotalIOwe().toFixed(2)} €
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {iOwe.length} remboursement(s)
            </Text>
          </View>

          <View className="bg-white rounded-xl shadow-sm p-4 flex-1 ml-2">
            <HStack className="items-center mb-2">
              <ArrowDownCircle size={20} color="#10b981" />
              <Text className="text-green-600 font-medium ml-2">
                On me doit
              </Text>
            </HStack>
            <Text className="text-2xl font-bold text-green-700">
              {getTotalTheyOweMe().toFixed(2)} €
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {theyOweMe.length} remboursement(s)
            </Text>
          </View>
        </HStack>

        {/* Tasks Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <HStack className="items-center justify-between mb-3">
            <HStack className="items-center">
              <CheckSquare size={20} color="#0891b2" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Tâches récentes
              </Text>
            </HStack>
            <TouchableOpacity className="flex-row items-center">
              <Text
                className="text-cyan-600 text-sm mr-1"
                onPress={() => router.push("/task")}
              >
                Voir tout
              </Text>
              <ChevronRight size={16} color="#0891b2" />
            </TouchableOpacity>
          </HStack>

          {tasks.length === 0 ? (
            <View className="py-4 items-center">
              <Text className="text-gray-500">Aucune tâche récente</Text>
            </View>
          ) : (
            <VStack space="sm">
              {tasks.map((task) => (
                <TouchableOpacity
                  key={task._id}
                  className="bg-gray-50 rounded-lg p-3 flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <HStack className="items-center flex-1">
                    <View className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                    <Text className="text-gray-800 flex-1" numberOfLines={1}>
                      {task.name}
                    </Text>
                  </HStack>
                  {task.dueDate && (
                    <HStack className="items-center">
                      <Clock size={14} color="#64748b" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {formatDate(task.dueDate)}
                      </Text>
                    </HStack>
                  )}
                </TouchableOpacity>
              ))}
            </VStack>
          )}
        </View>

        {/* Events Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <HStack className="items-center justify-between mb-3">
            <HStack className="items-center">
              <Calendar size={20} color="#0891b2" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Événements à venir
              </Text>
            </HStack>
            <TouchableOpacity className="flex-row items-center">
              <Text
                className="text-cyan-600 text-sm mr-1"
                onPress={() => router.push("/agenda")}
              >
                Voir tout
              </Text>
              <ChevronRight size={16} color="#0891b2" />
            </TouchableOpacity>
          </HStack>

          {events.length === 0 ? (
            <View className="py-4 items-center">
              <Text className="text-gray-500">Aucun événement prévu</Text>
            </View>
          ) : (
            <VStack space="sm">
              {events.map((event) => (
                <TouchableOpacity
                  key={event._id}
                  className="bg-gray-50 rounded-lg p-3 flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <HStack className="items-center flex-1">
                    <View className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                    <Text className="text-gray-800 flex-1" numberOfLines={1}>
                      {event.title}
                    </Text>
                  </HStack>
                  {event.date && (
                    <HStack className="items-center">
                      <Calendar size={14} color="#64748b" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {formatDate(event.date)}
                      </Text>
                    </HStack>
                  )}
                </TouchableOpacity>
              ))}
            </VStack>
          )}
        </View>

        {/* Money I Owe Section */}
        {iOwe.length > 0 && (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <HStack className="items-center justify-between mb-3">
              <HStack className="items-center">
                <ArrowUpCircle size={20} color="#ef4444" />
                <Text className="text-lg font-semibold text-gray-800 ml-2">
                  Ce que je dois
                </Text>
              </HStack>
              <TouchableOpacity className="flex-row items-center">
                <Text
                  className="text-cyan-600 text-sm mr-1"
                  onPress={() => router.push("/refund")}
                >
                  Voir tout
                </Text>
                <ChevronRight size={16} color="#0891b2" />
              </TouchableOpacity>
            </HStack>

            <VStack space="sm">
              {iOwe.map((refund) => (
                <TouchableOpacity
                  key={refund._id.toString()}
                  className="bg-red-50 rounded-lg p-3 border border-red-100"
                  activeOpacity={0.7}
                >
                  <HStack className="items-center justify-between">
                    <VStack className="flex-1">
                      <Text
                        className="text-gray-800 font-medium"
                        numberOfLines={1}
                      >
                        {refund.title}
                      </Text>
                      <HStack className="items-center mt-1">
                        <User size={14} color="#64748b" />
                        <Text className="text-gray-500 text-sm ml-1">
                          à{" "}
                          {typeof refund.roommateId === "object"
                            ? refund.roommateId.username
                            : "inconnu"}
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack className="items-center">
                      <Euro size={16} color="#ef4444" />
                      <Text className="text-red-600 font-bold ml-1">
                        {refund.toRefund}
                      </Text>
                    </HStack>
                  </HStack>
                </TouchableOpacity>
              ))}
            </VStack>
          </View>
        )}

        {/* Money They Owe Me Section */}
        {theyOweMe.length > 0 && (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <HStack className="items-center justify-between mb-3">
              <HStack className="items-center">
                <ArrowDownCircle size={20} color="#10b981" />
                <Text className="text-lg font-semibold text-gray-800 ml-2">
                  Ce qu'on me doit
                </Text>
              </HStack>
              <TouchableOpacity className="flex-row items-center">
                <Text
                  className="text-cyan-600 text-sm mr-1"
                  onPress={() => router.push("/refund")}
                >
                  Voir tout
                </Text>
                <ChevronRight size={16} color="#0891b2" />
              </TouchableOpacity>
            </HStack>

            <VStack space="sm">
              {theyOweMe.map((refund) => (
                <TouchableOpacity
                  key={refund._id.toString()}
                  className="bg-green-50 rounded-lg p-3 border border-green-100"
                  activeOpacity={0.7}
                >
                  <HStack className="items-center justify-between">
                    <VStack className="flex-1">
                      <Text
                        className="text-gray-800 font-medium"
                        numberOfLines={1}
                      >
                        {refund.title}
                      </Text>
                      <HStack className="items-center mt-1">
                        <User size={14} color="#64748b" />
                        <Text className="text-gray-500 text-sm ml-1">
                          de{" "}
                          {typeof refund.userId === "object"
                            ? refund.userId.username
                            : "inconnu"}
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack className="items-center">
                      <Euro size={16} color="#10b981" />
                      <Text className="text-green-600 font-bold ml-1">
                        {refund.toRefund}
                      </Text>
                    </HStack>
                  </HStack>
                </TouchableOpacity>
              ))}
            </VStack>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
