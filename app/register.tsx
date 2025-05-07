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
      Alert.alert("Congratulations!", "Account created");
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
          <FormControl size="lg" isInvalid={!!errors.username}>
            <FormControlLabel>
              <FormControlLabelText size="xl">Username</FormControlLabelText>
            </FormControlLabel>
            <HStack space="md" className="w-full items-center">
              <Input className="my-1 flex-1" size="xl">
                <InputField
                  placeholder="Enter your username"
                  autoCapitalize="none"
                  type="text"
                  value={watch("username")}
                  onChangeText={(text) => setValue("username", text)}
                  onBlur={() => trigger("username")}
                />
              </Input>
            </HStack>
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
            <Input className="my-1" size="xl">
              <InputField
                placeholder="Enter your email"
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
              <FormControlLabelText size="xl">Password</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="xl">
              <InputField
                placeholder="Enter your password"
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
                Confirm Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="xl">
              <InputField
                placeholder="Confirm your password"
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
              <ButtonText>Sign Up</ButtonText>
            </Button>
            <Button
              className=""
              size="md"
              variant="outline"
              onPress={() => {
                router.replace("/login");
              }}
            >
              <ButtonText>Sign In</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Center>
    </SafeAreaView>
  );
}
