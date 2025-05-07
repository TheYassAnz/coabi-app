import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";
import { UserPatchPasswordSchema } from "@/types/zod/user";
import { router } from "expo-router";
import {
  Alert,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  ArrowLeftIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
} from "lucide-react-native";

export default function ChangePasswordScreen() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(UserPatchPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const userService = new UserService();
    try {
      const user = await getUserByAccessToken();
      if (!user) {
        Alert.alert("Erreur", "Utilisateur non trouvé");
        setIsSubmitting(false);
        return;
      }
      await userService.updateUserPasswordById(user._id, data);
      Alert.alert("Succès", "Votre mot de passe a été changé avec succès");
      reset();
      router.replace("/profile");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.replace("/profile");
  };

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
            Changer le mot de passe
          </Text>
          <View style={{ width: 40 }} />
        </HStack>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center my-6">
            <View className="bg-cyan-100 rounded-full w-20 h-20 items-center justify-center">
              <LockIcon size={32} color="#0891b2" />
            </View>
            <Text className="text-lg font-semibold text-gray-800 mt-4">
              Mettre à jour votre mot de passe
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-1 px-8">
              Créez un mot de passe fort pour sécuriser votre compte
            </Text>
          </View>

          <View className="bg-white rounded-xl shadow-sm p-5 mb-4">
            <FormControl
              size="md"
              isInvalid={!!errors.currentPassword}
              className="mb-4"
            >
              <FormControlLabel>
                <FormControlLabelText className="text-gray-700 font-medium">
                  Mot de passe actuel
                </FormControlLabelText>
              </FormControlLabel>
              <Input
                className="my-1 bg-gray-50 border border-gray-200 rounded-lg"
                size="md"
              >
                <InputField
                  placeholder="Entrez votre mot de passe actuel"
                  autoCapitalize="none"
                  type={showCurrentPassword ? "text" : "password"}
                  value={watch("currentPassword")}
                  onChangeText={(text) => setValue("currentPassword", text)}
                  onBlur={() => trigger("currentPassword")}
                />
                <InputSlot
                  className="pr-3"
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOffIcon size={20} color="#64748b" />
                  ) : (
                    <EyeIcon size={20} color="#64748b" />
                  )}
                </InputSlot>
              </Input>
              {errors.currentPassword && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.currentPassword.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <View className="h-px bg-gray-100 my-4" />

            <FormControl
              size="md"
              isInvalid={!!errors.newPassword}
              className="mb-4"
            >
              <FormControlLabel>
                <FormControlLabelText className="text-gray-700 font-medium">
                  Nouveau mot de passe
                </FormControlLabelText>
              </FormControlLabel>
              <Input
                className="my-1 bg-gray-50 border border-gray-200 rounded-lg"
                size="md"
              >
                <InputField
                  placeholder="Entrez votre nouveau mot de passe"
                  autoCapitalize="none"
                  type={showNewPassword ? "text" : "password"}
                  value={watch("newPassword")}
                  onChangeText={(text) => setValue("newPassword", text)}
                  onBlur={() => trigger("newPassword")}
                />
                <InputSlot
                  className="pr-3"
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOffIcon size={20} color="#64748b" />
                  ) : (
                    <EyeIcon size={20} color="#64748b" />
                  )}
                </InputSlot>
              </Input>
              {errors.newPassword && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.newPassword.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl
              size="md"
              isInvalid={!!errors.confirmPassword}
              className="mb-2"
            >
              <FormControlLabel>
                <FormControlLabelText className="text-gray-700 font-medium">
                  Confirmer le mot de passe
                </FormControlLabelText>
              </FormControlLabel>
              <Input
                className="my-1 bg-gray-50 border border-gray-200 rounded-lg"
                size="md"
              >
                <InputField
                  placeholder="Confirmez votre nouveau mot de passe"
                  autoCapitalize="none"
                  type={showConfirmPassword ? "text" : "password"}
                  value={watch("confirmPassword")}
                  onChangeText={(text) => setValue("confirmPassword", text)}
                  onBlur={() => trigger("confirmPassword")}
                />
                <InputSlot
                  className="pr-3"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon size={20} color="#64748b" />
                  ) : (
                    <EyeIcon size={20} color="#64748b" />
                  )}
                </InputSlot>
              </Input>
              {errors.confirmPassword && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors.confirmPassword.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </View>

          <HStack className="mt-4 justify-between">
            <Button
              className="rounded-lg bg-gray-200 flex-1 mr-2"
              size="lg"
              onPress={handleCancel}
              variant="outline"
            >
              <ButtonText className="text-gray-700">Annuler</ButtonText>
            </Button>
            <Button
              className="rounded-lg bg-cyan-600 flex-1 ml-2"
              size="lg"
              onPress={handleSubmit(onSubmit)}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <ButtonText>Mettre à jour</ButtonText>
              )}
            </Button>
          </HStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
