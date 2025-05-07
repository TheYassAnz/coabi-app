import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "react-native";
import { router } from "expo-router";
import { AccommodationPostSchema } from "@/types/zod/accommodation";

// Validation schema for creating an accommodation

export default function CreateAccommodationScreen() {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(AccommodationPostSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: {
    name: string;
    description: string;
    location: string;
    postcode: string;
    country: string;
  }) => {
    try {
      // Simulate accommodation creation
      Alert.alert(
        "Success",
        `Accommodation "${data.name}" created successfully!`,
      );
      router.replace("/accommodation/join"); // Redirect to dashboard or another page
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Center className="h-full w-full">
      <VStack className="w-full px-10" space="xl">
        <VStack>
          <Heading size="4xl">Create Accommodation</Heading>
          <Heading size="md">
            Enter details to create a new accommodation
          </Heading>
        </VStack>

        {/* Name Field */}
        <FormControl isInvalid={!!errors.name} size="lg">
          <FormControlLabel>
            <FormControlLabelText size="xl">
              Accommodation Name
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="xl">
            <InputField
              autoCapitalize="none"
              type="text"
              value={watch("name")}
              onChangeText={(text) => setValue("name", text)}
              onBlur={() => trigger("name")}
            />
          </Input>
          {errors.name && (
            <FormControlError>
              <FormControlErrorText>{errors.name.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Description Field */}
        <FormControl isInvalid={!!errors.description} size="lg">
          <FormControlLabel>
            <FormControlLabelText size="xl">Description</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="xl">
            <InputField
              autoCapitalize="none"
              type="text"
              value={watch("description")}
              onChangeText={(text) => setValue("description", text)}
              onBlur={() => trigger("description")}
            />
          </Input>
          {errors.description && (
            <FormControlError>
              <FormControlErrorText>
                {errors.description.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Location Field */}
        <FormControl isInvalid={!!errors.location} size="lg">
          <FormControlLabel>
            <FormControlLabelText size="xl">Location</FormControlLabelText>
          </FormControlLabel>
          <Input className="my-1" size="xl">
            <InputField
              autoCapitalize="none"
              type="text"
              value={watch("location")}
              onChangeText={(text) => setValue("location", text)}
              onBlur={() => trigger("location")}
            />
          </Input>
          {errors.location && (
            <FormControlError>
              <FormControlErrorText>
                {errors.location.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <VStack space="sm">
          <Button variant="solid" size="md" onPress={handleSubmit(onSubmit)}>
            <ButtonText>Create</ButtonText>
          </Button>
          <Button
            className=""
            size="md"
            variant="outline"
            onPress={() => {
              router.replace("/(protected)/accommodation/join");
            }}
          >
            <ButtonText>Join an Accommodation</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
}
