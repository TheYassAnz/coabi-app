import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { AlertCircleIcon } from "@/components/ui/icon";
import { useState } from "react";
import { Center } from "@/components/ui/center";
import { View } from "react-native";
import { AuthContext } from "../utils/authContext";
import { useContext } from "react";

export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  const [isInvalid, setIsInvalid] = useState({
    username: false,
    password: false,
  });
  const [inputValue, setInputValue] = useState({
    username: "",
    password: "",
  });
  // const handleSubmit = () => {
  //   const updatedInvalidState = {
  //     username: inputValue.username === "",
  //     password: inputValue.password === "",
  //   };
  //   setIsInvalid(updatedInvalidState);

  //   if (!updatedInvalidState.username && !updatedInvalidState.password) {
  //   }
  // };
  return (
    <Center className="h-full w-full">
      <VStack className="w-full gap-y-6 px-10">
        <FormControl isInvalid={isInvalid.username} size="lg">
          <FormControlLabel>
            <FormControlLabelText size="2xl">Username</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="xl">
            <InputField
              type="text"
              value={inputValue.username}
              onChangeText={(text) =>
                setInputValue({
                  ...inputValue,
                  username: text,
                })
              }
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>Username is required.</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl isInvalid={isInvalid.password} size="lg">
          <FormControlLabel>
            <FormControlLabelText size="2xl">Password</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="xl">
            <InputField
              type="password"
              value={inputValue.password}
              onChangeText={(text) =>
                setInputValue({
                  ...inputValue,
                  password: text,
                })
              }
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>Password is required.</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <View className="flex flex-row gap-x-4">
          <Button className=" rounded-md" size="xl" onPress={authContext.logIn}>
            <ButtonText>Sign In</ButtonText>
          </Button>
          <Button className="" size="xl" variant="link" onPress={() => {}}>
            <ButtonText>Sign Up</ButtonText>
          </Button>
        </View>
      </VStack>
    </Center>
  );
}
