import { InputField, InputIcon, InputSlot, Input } from "@/components/ui/input";
import { Alert as AlertBox, AlertText, AlertIcon } from "@/components/ui/alert";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  Actionsheet,
  ActionsheetIcon,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetFlatList,
  ActionsheetScrollView,
  ActionsheetSectionList,
  ActionsheetSectionHeaderText,
  ActionsheetVirtualizedList,
} from "@/components/ui/actionsheet";

import { z } from "zod";

import React from "react";

import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AccommodationService } from "@/services/server/accommodation";
import { Spinner } from "@/components/ui/spinner";
import { AccommodationResponse } from "@/types/zod/accommodation";
import { InfoIcon } from "@/components/ui/icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserService } from "@/services/server/user";
import { getUserByAccessToken } from "@/services/utils";

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
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [accommodations, setAccommodations] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [accommodation, setAccommodation] = useState<any | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const handleClose = () => {
    setShowActionsheet(false);
  };
  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      try {
        const accommodationService = new AccommodationService();
        const response = await accommodationService.getAllAccommodations();
        setAccommodations(response);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch accommodations");
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);
  const onClick = async (data: {
    _id: string;
    name: string;
    location: string;
    postalCode: string;
    country: string;
    accessCode: string;
  }) => {
    try {
      setAccommodation(data);
      setShowActionsheet(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  const handleJoin = async (data: { accessCode: string }) => {
    try {
      // Validate access code
      if (data.accessCode !== accommodation.code) {
        Alert.alert("Error", "Invalid access code");
        return;
      }
      // Proceed with joining the accommodation
      const userService = new UserService();
      const user = await getUserByAccessToken(); // Await the promise
      if (!user) {
        Alert.alert("Error", "Failed to retrieve user information");
        return;
      }
      await userService.updateUserById(user._id, {
        accommodationId: accommodation._id,
      });
      Alert.alert("Success", "You have joined the accommodation");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <Center className="h-full w-full">
      <Center>
        {accommodation && (
          <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              <VStack className="w-full pt-5">
                <HStack space="md" className="justify-center items-center">
                  <VStack className="flex-1" space="md">
                    <VStack>
                      <Heading>{accommodation.name}</Heading>
                      <Text>
                        {accommodation.location +
                          ", " +
                          accommodation.postalCode}
                      </Text>
                      <Text>{accommodation.country}</Text>
                    </VStack>
                  </VStack>
                </HStack>
                <FormControl className="mt-2.5">
                  <FormControlLabel>
                    <FormControlLabelText size="lg">
                      Access Code
                    </FormControlLabelText>
                  </FormControlLabel>

                  <Input
                    className="w-full"
                    size="lg"
                    isInvalid={!!errors.accessCode}
                  >
                    <InputField
                      placeholder="XXXXXX"
                      autoCapitalize="none"
                      type="text"
                      value={watch("accessCode")}
                      onChangeText={(text) => {
                        setValue("accessCode", text);
                        setAccessCode(text);
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
                    <AlertBox action="error" variant="solid" className="mt-2">
                      <AlertIcon as={InfoIcon} />
                      <AlertText>{errors.accessCode.message}</AlertText>
                    </AlertBox>
                  )}

                  <Button
                    onPress={handleSubmit(handleJoin)}
                    className="mt-52 mb-2"
                    variant="solid"
                    size="lg"
                  >
                    <ButtonText>Join</ButtonText>
                  </Button>
                </FormControl>
              </VStack>
            </ActionsheetContent>
          </Actionsheet>
        )}
      </Center>
      <VStack className="w-full px-10" space="xl">
        <VStack>
          <Heading size="4xl">Join an accommodation</Heading>
          <Text>You are not linked with an accommodation yet</Text>
        </VStack>

        <VStack space="sm">
          <Button
            size="md"
            variant="outline"
            onPress={() => {
              router.replace("/accommodation/create");
            }}
            isDisabled={true}
          >
            <ButtonText>Create an Accommodation</ButtonText>
          </Button>
        </VStack>
        <VStack space="md">
          <Heading size="lg">Available Accommodations</Heading>
          {loading && <Spinner />}
          {!loading && accommodations.length === 0 && (
            <Text>No accommodations available</Text>
          )}
          {!loading &&
            accommodations.length > 0 &&
            accommodations.map((accommodation: any) => (
              <HStack
                key={accommodation._id}
                className="border rounded-md p-4 justify-between items-center"
                space="md"
              >
                <VStack>
                  <Heading size="sm">{accommodation.name}</Heading>
                  <Text>
                    {accommodation.location + ", " + accommodation.postalCode}
                  </Text>
                  <Text>{accommodation.country}</Text>
                </VStack>
                <Button
                  size="sm"
                  variant="solid"
                  onPress={() => onClick(accommodation)}
                >
                  <ButtonText>Join</ButtonText>
                </Button>
              </HStack>
            ))}
        </VStack>
      </VStack>
    </Center>
  );
}
