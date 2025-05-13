import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { AuthService } from "@/services/server/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, SafeAreaView } from "react-native";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/types/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function RegisterPage() {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((state) => !state);
  };

  const onSubmit = async (data: any) => {
    const registration = new AuthService();
    try {
      await registration.register(data);
      Alert.alert("Felicitations!", "Votre compte a été créé avec succès.");
      router.replace("/login");
      reset();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView>
      <Center className="h-full w-full">
        <VStack className="w-full px-10" space="xl">
          <VStack>
            <Heading size="4xl">S'inscrire</Heading>
            <Text>Créez votre compte pour utiliser l'application COABI</Text>
          </VStack>
          <FormControl size="lg" isInvalid={!!errors.username}>
            <FormControlLabel>
              <FormControlLabelText size="xl">Identifiant</FormControlLabelText>
            </FormControlLabel>
            <Input className="" size="xl">
              <InputField
                placeholder="Entrez votre identifiant"
                autoCapitalize="none"
                type="text"
                value={watch("username")}
                onChangeText={(text) => setValue("username", text)}
                onBlur={() => trigger("username")}
              />
            </Input>
            {errors.username && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.username.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl size="lg" isInvalid={!!errors.email}>
            <FormControlLabel>
              <FormControlLabelText size="xl">Email</FormControlLabelText>
            </FormControlLabel>
            <Input size="xl">
              <InputField
                placeholder="Entrez votre email"
                autoCapitalize="none"
                type="text"
                value={watch("email")}
                onChangeText={(text) => setValue("email", text)}
                onBlur={() => trigger("email")}
              />
            </Input>
            {errors.email && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.email.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl size="lg" isInvalid={!!errors.password}>
            <FormControlLabel>
              <FormControlLabelText size="xl">
                Mot de passe
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="xl">
              <InputField
                placeholder="Entrez votre mot de passe"
                autoCapitalize="none"
                type={showPassword ? "text" : "password"}
                value={watch("password")}
                onChangeText={(text) => setValue("password", text)}
                onBlur={() => trigger("password")}
              />
              <InputSlot className="pr-3" onPress={handleShowPassword}>
                {showPassword ? (
                  <MaterialCommunityIcons name="eye-outline" size={24} />
                ) : (
                  <MaterialCommunityIcons name="eye-off-outline" size={24} />
                )}
              </InputSlot>
            </Input>
            {errors.password && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {errors.password.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl size="lg" isInvalid={!!errors.confirmPassword}>
            <FormControlLabel>
              <FormControlLabelText size="xl">
                Confirmation du mot de passe
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="xl">
              <InputField
                placeholder="Confirmez votre mot de passe"
                autoCapitalize="none"
                type={showPassword ? "text" : "password"}
                value={watch("confirmPassword")}
                onChangeText={(text) => setValue("confirmPassword", text)}
                onBlur={() => trigger("confirmPassword")}
              />
              <InputSlot className="pr-3" onPress={handleShowPassword}>
                {showPassword ? (
                  <MaterialCommunityIcons name="eye-outline" size={24} />
                ) : (
                  <MaterialCommunityIcons name="eye-off-outline" size={24} />
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

          <VStack space="sm">
            <Button variant="solid" size="md" onPress={handleSubmit(onSubmit)}>
              <ButtonText>S'inscrire</ButtonText>
            </Button>
            <Button
              className=""
              size="md"
              variant="outline"
              onPress={() => {
                router.replace("/login");
              }}
            >
              <ButtonText>Se connecter</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Center>
    </SafeAreaView>
  );
}
