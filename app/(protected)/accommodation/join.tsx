import React, { useState } from "react";
import { Alert } from "react-native";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";
import { router } from "expo-router";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeftIcon, Icon, LogOutIcon } from "lucide-react-native";
import { AuthService } from "@/services/server/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AccessCodeSchema = z.object({
  accessCode: z
    .string()
    .min(6, "Le code d'accès doit faire au moins 6 caractères"),
});

export default function JoinPage() {
  const logout = () => {
    try {
      const authService = new AuthService();
      authService.logout();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(AccessCodeSchema),
    defaultValues: {
      accessCode: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const handleJoin = async (data: { accessCode: string }) => {
    try {
      setLoading(true);
      const user = await getUserByAccessToken();
      const userService = new UserService();
      userService.joinAccommodationByCode(user._id, {
        code: data.accessCode,
      });
      Alert.alert("Bravo!", "Vous avez rejoint le foyer avec succès.");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center className="h-full w-full">
      <VStack className="w-full px-10" space="xl">
        <HStack className="w-full justify-end">
          <Button variant="outline" size="md" onPress={() => logout()}>
            <ButtonText>Se deconnecter</ButtonText>
            <ButtonIcon as={LogOutIcon} />
          </Button>
        </HStack>
        <VStack>
          <Heading size="4xl">Rejoindre un foyer</Heading>
          <Text>Entrer le code d'accès afin de rejoindre le foyer</Text>
        </VStack>

        <FormControl className="mt-5">
          <FormControlLabel>
            <FormControlLabelText size="lg">Code d'accès</FormControlLabelText>
          </FormControlLabel>

          <Input className="w-full" size="lg" isInvalid={!!errors.accessCode}>
            <InputField
              placeholder="Entrez le code d'accès"
              autoCapitalize="none"
              type="text"
              value={watch("accessCode")}
              onChangeText={(text) => {
                setValue("accessCode", text);
              }}
              onBlur={() => trigger("accessCode")}
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText>
              Le code d'accès est un code unique qui vous permet de rejoindre un
              foyer. Il est généralement fourni par l'administrateur du foyer.
            </FormControlHelperText>
          </FormControlHelper>
          {errors.accessCode && (
            <FormControlError>
              <FormControlErrorText>
                {errors.accessCode.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <Button
          onPress={handleSubmit(handleJoin)}
          className="mt-5"
          variant="solid"
          size="lg"
        >
          <ButtonText>Rejoindre</ButtonText>
        </Button>
      </VStack>
    </Center>
  );
}
