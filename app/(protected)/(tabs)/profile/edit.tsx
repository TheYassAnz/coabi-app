import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { UserPatchSchema, type UserPatch } from "@/types/zod/user";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";
import type { UserResponse } from "@/types/zod/user";
import {
  ArrowLeftIcon,
  User,
  Save,
  X,
  Shield,
  AlertTriangle,
} from "lucide-react-native";
import { router } from "expo-router";

export default function EditProfileScreen() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [relinquishRole, setRelinquishRole] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<UserPatch>({
    resolver: zodResolver(UserPatchSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      age: null,
      description: "",
      email: "",
      phoneNumber: "",
      role: "user",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserByAccessToken();
        if (!userData) {
          Alert.alert("Erreur", "Utilisateur non trouvé");
          return;
        }
        setUser(userData);
        reset({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          age: userData.age || null,
          description: userData.description,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: userData.role,
        });
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [reset]);

  const onSubmit = async (data: UserPatch) => {
    try {
      setSaving(true);
      const userService = new UserService();
      if (!user) {
        Alert.alert("Erreur", "Utilisateur non trouvé");
        return;
      }

      if (relinquishRole && user.role === "moderator") {
        data.role = "user";
      }

      await userService.updateUserById(user._id, data);

      if (relinquishRole && user.role === "moderator") {
        setUser({
          ...user,
          role: "user",
        });
        setRelinquishRole(false);
      }

      Alert.alert("Succès", "Profil mis à jour avec succès !");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.replace("/profile");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="mt-4 text-gray-600">
            Chargement de votre profil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <HStack className="w-full px-4 py-3 border-b border-gray-200 bg-white items-center justify-between">
          <TouchableOpacity
            onPress={handleCancel}
            className="p-2 rounded-full bg-gray-100"
          >
            <ArrowLeftIcon color="#0f172a" size={20} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">
            Modifier Profil
          </Text>
          <View style={{ width: 40 }} />
        </HStack>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center my-6">
            <View className="bg-cyan-600 rounded-full w-24 h-24 items-center justify-center mb-2">
              <User size={40} color="white" />
            </View>
            <Text className="text-sm text-cyan-700">
              {watch("firstName")} {watch("lastName")}
            </Text>
            <Text className="text-xs text-gray-500">@{watch("username")}</Text>

            {user?.role === "moderator" && (
              <View className="bg-cyan-100 px-3 py-1 rounded-full mt-2 flex-row items-center">
                <Shield size={14} color="#0891b2" />
                <Text className="text-cyan-700 text-xs font-medium ml-1">
                  Moderator
                </Text>
              </View>
            )}
          </View>

          <VStack className="w-full px-5" space="lg">
            <View className="bg-white rounded-xl shadow-sm p-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Informations Personnelles
              </Text>

              <FormControl
                size="md"
                isInvalid={!!errors.firstName}
                className="mb-4"
              >
                <FormControlLabel>
                  <FormControlLabelText className="text-gray-700">
                    Prénom
                  </FormControlLabelText>
                </FormControlLabel>
                <Input
                  className="my-1 bg-gray-50 border border-gray-200 rounded-lg"
                  size="md"
                >
                  <InputField
                    placeholder="Votre prénom"
                    value={watch("firstName") ?? ""}
                    onChangeText={(text) => setValue("firstName", text)}
                    onBlur={() => trigger("firstName")}
                  />
                </Input>
                {errors.firstName && (
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText>
                      {errors.firstName.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl
                size="md"
                isInvalid={!!errors.lastName}
                className="mb-4"
              >
                <FormControlLabel>
                  <FormControlLabelText className="text-gray-700">
                    Nom
                  </FormControlLabelText>
                </FormControlLabel>
                <Input
                  className="my-1 bg-gray-50 border border-gray-200 rounded-lg"
                  size="md"
                >
                  <InputField
                    placeholder="Votre nom"
                    value={watch("lastName") ?? ""}
                    onChangeText={(text) => setValue("lastName", text)}
                    onBlur={() => trigger("lastName")}
                  />
                </Input>
                {errors.lastName && (
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText>
                      {errors.lastName.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl size="md" isInvalid={!!errors.age} className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText className="text-gray-700">
                    Âge
                  </FormControlLabelText>
                </FormControlLabel>
                <Input
                  className="my-1 bg-gray-50 border border-gray-200 rounded-lg"
                  size="md"
                >
                  <InputField
                    placeholder="Votre âge"
                    keyboardType="numeric"
                    value={watch("age")?.toString() || ""}
                    onChangeText={(text) =>
                      setValue("age", Number.parseInt(text) || null)
                    }
                    onBlur={() => trigger("age")}
                  />
                </Input>
                {errors.age && (
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText>
                      {errors.age.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>

            <View className="bg-white rounded-xl shadow-sm p-4 mt-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Informations du Compte
              </Text>

              <FormControl
                size="md"
                isInvalid={!!errors.username}
                className="mb-4"
              >
                <FormControlLabel>
                  <FormControlLabelText className="text-gray-700">
                    Nom d'utilisateur
                  </FormControlLabelText>
                </FormControlLabel>
                <Input
                  className="my-1 bg-gray-50 border border-gray-200 rounded-lg"
                  size="md"
                >
                  <InputField
                    placeholder="Votre nom d'utilisateur"
                    value={watch("username")}
                    onChangeText={(text) => setValue("username", text)}
                    onBlur={() => trigger("username")}
                  />
                </Input>
                {errors.username && (
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText>
                      {errors.username.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl
                size="md"
                isInvalid={!!errors.email}
                className="mb-4"
              >
                <FormControlLabel>
                  <FormControlLabelText className="text-gray-700">
                    Email
                  </FormControlLabelText>
                </FormControlLabel>
                <Input
                  className="my-1 bg-gray-50 border border-gray-200 rounded-lg"
                  size="md"
                >
                  <InputField
                    placeholder="Votre email"
                    autoCapitalize="none"
                    value={watch("email")}
                    onChangeText={(text) => setValue("email", text)}
                    onBlur={() => trigger("email")}
                  />
                </Input>
                {errors.email && (
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText>
                      {errors.email.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>

            <View className="bg-white rounded-xl shadow-sm p-4 mt-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                À propos de vous
              </Text>

              <FormControl
                size="md"
                isInvalid={!!errors.description}
                className="mb-4"
              >
                <FormControlLabel>
                  <FormControlLabelText className="text-gray-700">
                    Description
                  </FormControlLabelText>
                </FormControlLabel>
                <Input
                  className="my-1 bg-gray-50 border border-gray-200 rounded-lg h-24"
                  size="md"
                >
                  <InputField
                    placeholder="Parlez-nous de vous"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={watch("description") ?? ""}
                    onChangeText={(text) => setValue("description", text)}
                    onBlur={() => trigger("description")}
                    style={{ height: 80 }}
                  />
                </Input>
                {errors.description && (
                  <FormControlError>
                    <FormControlErrorIcon />
                    <FormControlErrorText>
                      {errors.description.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </View>

            {user?.role === "moderator" && (
              <View className="bg-white rounded-xl shadow-sm p-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Rôle de Modérateur
                </Text>

                <View className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-3">
                  <HStack className="items-center mb-2">
                    <AlertTriangle size={18} color="#f59e0b" />
                    <Text className="text-amber-800 font-medium ml-2">
                      Attention
                    </Text>
                  </HStack>
                  <Text className="text-amber-700 text-sm">
                    En renonçant à votre rôle de modérateur, vous perdrez les
                    privilèges associés et ne pourrez pas les récupérer sans
                    l'aide d'un autre modérateur.
                  </Text>
                </View>

                <HStack className="items-center justify-between">
                  <Text className="text-gray-700 font-medium">
                    Renoncer au rôle de modérateur ?
                  </Text>
                  <Switch
                    value={relinquishRole}
                    onValueChange={setRelinquishRole}
                    trackColor={{ false: "#e2e8f0", true: "#fca5a5" }}
                    thumbColor={relinquishRole ? "#ef4444" : "#f8fafc"}
                  />
                </HStack>
              </View>
            )}

            <HStack className="mt-6 px-4 justify-between">
              <Button
                className="rounded-lg bg-gray-200 flex-1 mr-2"
                size="lg"
                onPress={handleCancel}
                variant="outline"
              >
                <X size={18} color="#64748b" />
                <ButtonText className="text-gray-700 ml-1">Annuler</ButtonText>
              </Button>
              <Button
                className={`rounded-lg ${relinquishRole ? "bg-amber-600" : "bg-cyan-600"} flex-1 ml-2`}
                size="lg"
                onPress={handleSubmit(onSubmit)}
                isDisabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Save size={18} color="white" />
                    <ButtonText className="ml-1">
                      {relinquishRole
                        ? "Enregistrer les changements"
                        : "Enregistrer"}
                    </ButtonText>
                  </>
                )}
              </Button>
            </HStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
