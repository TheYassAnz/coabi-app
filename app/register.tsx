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
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AuthService } from "@/services/server/auth";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, SafeAreaView } from "react-native";

export default function RegisterPage() {
  const [inputValue, setInputValue]: any = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [isInvalid, setIsInvalid] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((state) => {
      return !state;
    });
  };

  const handleSubmit = () => {
    const updatedInvalidState = {
      email: inputValue.email === "",
      username: inputValue.username === "",
      password: inputValue.password === "",
      confirmPassword: inputValue.confirmPassword === "",
    };
    setIsInvalid(updatedInvalidState);
    const registration = new AuthService();
    registration
      .register(inputValue)
      .then(() => {
        Alert.alert("Congratulations!", "Account created");
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <SafeAreaView>
      <Center className="h-full w-full">
        <VStack className="w-full px-10" space="xl">
          <VStack>
            <Heading size="4xl">Sign Up</Heading>
            <Text>Sign up to start using COABI app</Text>
          </VStack>

          <FormControl size="lg" isInvalid={isInvalid.email}>
            <FormControlLabel>
              <FormControlLabelText size="xl">Email</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="xl">
              <InputField
                autoCapitalize="none"
                type="text"
                value={inputValue.email}
                onChangeText={(text) =>
                  setInputValue((prev: any) => ({ ...prev, email: text }))
                }
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Email is required.</FormControlErrorText>
            </FormControlError>
          </FormControl>
          <FormControl size="lg" isInvalid={isInvalid.username}>
            <FormControlLabel>
              <FormControlLabelText size="xl">Username</FormControlLabelText>
            </FormControlLabel>
            <HStack space="md" className="w-full items-center">
              <Text size="2xl">@</Text>
              <Input className="my-1 flex-1" size="xl">
                <InputField
                  autoCapitalize="none"
                  type="text"
                  value={inputValue.username}
                  onChangeText={(text) =>
                    setInputValue((prev: any) => ({ ...prev, username: text }))
                  }
                />
              </Input>
            </HStack>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Username is required.</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl size="lg" isInvalid={isInvalid.password}>
            <FormControlLabel>
              <FormControlLabelText size="xl">Password</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="xl">
              <InputField
                autoCapitalize="none"
                type={showPassword ? "text" : "password"}
                value={inputValue.password}
                onChangeText={(text) =>
                  setInputValue((prev: any) => ({ ...prev, password: text }))
                }
              />
              <InputSlot className="pr-3" onPress={handleShowPassword}>
                {showPassword ? (
                  <MaterialCommunityIcons name="eye-outline" size={24} />
                ) : (
                  <MaterialCommunityIcons name="eye-off-outline" size={24} />
                )}
              </InputSlot>
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Password is required.</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl size="lg" isInvalid={isInvalid.confirmPassword}>
            <FormControlLabel>
              <FormControlLabelText size="xl">
                Confirm Password
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="xl">
              <InputField
                autoCapitalize="none"
                type={showPassword ? "text" : "password"}
                value={inputValue.confirmPassword}
                onChangeText={(text) =>
                  setInputValue((prev: any) => ({
                    ...prev,
                    confirmPassword: text,
                  }))
                }
              />
              <InputSlot className="pr-3" onPress={handleShowPassword}>
                {showPassword ? (
                  <MaterialCommunityIcons name="eye-outline" size={24} />
                ) : (
                  <MaterialCommunityIcons name="eye-off-outline" size={24} />
                )}
              </InputSlot>
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                Confirm Password is required.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <VStack space="sm">
            <Button className=" rounded-md" size="lg" onPress={handleSubmit}>
              <ButtonText>Sign Up</ButtonText>
            </Button>
            <Button
              className=""
              size="lg"
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
