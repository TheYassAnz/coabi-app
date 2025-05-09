import React, { useState } from "react";
import { Alert } from "react-native";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
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

const AccessCodeSchema = z.object({
  accessCode: z.string().min(6, "Access code must be at least 6 characters"),
});

export default function JoinPage() {
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
      Alert.alert("Success", "You have joined the accommodation");
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
        <VStack>
          <Heading size="4xl">Join an accommodation</Heading>
          <Text>Enter the access code to join an accommodation</Text>
        </VStack>

        <FormControl className="mt-5">
          <FormControlLabel>
            <FormControlLabelText size="lg">Access Code</FormControlLabelText>
          </FormControlLabel>

          <Input className="w-full" size="lg" isInvalid={!!errors.accessCode}>
            <InputField
              placeholder="XXXXXX"
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
              Enter the access code to join the accommodation
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
          isLoading={loading}
        >
          <ButtonText>Join</ButtonText>
        </Button>
      </VStack>
    </Center>
  );
}
