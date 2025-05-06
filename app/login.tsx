import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Center } from "@/components/ui/center";
import { router } from "expo-router";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { AccessSchema } from "@/types/zod/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/services/server/auth";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

export default function LoginScreen() {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(AccessSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const authService = new AuthService();
      const login = await authService.login(data);
      await SecureStore.setItemAsync("accessToken", login.accessToken);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Center className="h-full w-full">
      <VStack className="w-full px-10" space="xl">
        <VStack>
          <Heading size="4xl">Sign In</Heading>
          <Text>Sign in to start using COABI app</Text>
        </VStack>

        <FormControl isInvalid={!!errors.username} size="lg">
          <FormControlLabel>
            <FormControlLabelText size="xl">Username</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="xl">
            <InputField
              placeholder="Enter your username"
              autoCapitalize="none"
              type="text"
              value={watch("username")}
              onChangeText={(text) => setValue("username", text)}
              onBlur={() => trigger("username")}
            />
          </Input>
          {errors.username && (
            <FormControlError>
              <FormControlErrorText>
                {errors.username.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.password} size="lg">
          <FormControlLabel>
            <FormControlLabelText size="xl">Password</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="xl">
            <InputField
              placeholder="Enter your password"
              type="password"
              value={watch("password")}
              onChangeText={(text) => setValue("password", text)}
              onBlur={() => trigger("password")}
            />
          </Input>
          {errors.password && (
            <FormControlError>
              <FormControlErrorText>
                {errors.password.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <VStack space="sm">
          <Button variant="solid" size="md" onPress={handleSubmit(onSubmit)}>
            <ButtonText>Sign In</ButtonText>
          </Button>
          <Button
            className=""
            size="md"
            variant="outline"
            onPress={() => {
              router.replace("/register");
            }}
          >
            <ButtonText>Sign Up</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
}
