import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { RulePostSchema, RulePost } from "@/types/zod/rule";
import { Plus, Save, X } from "lucide-react-native";

interface CreateRuleFormProps {
  accommodationId: string;
  onCreate: (data: RulePost) => Promise<void>;
}

export function CreateRuleModal({
  accommodationId,
  onCreate,
}: CreateRuleFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<RulePost>({
    resolver: zodResolver(RulePostSchema),
    defaultValues: {
      title: "",
      description: null,
      accommodationId: accommodationId,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const openModal = () => {
    reset({
      title: "",
      description: null,
      accommodationId: accommodationId,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const onSubmit = async (data: RulePost) => {
    setIsLoading(true);
    try {
      await onCreate(data);
      setOpen(false);
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Une erreur est survenue. Veuillez réessayer.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        className="absolute bottom-6 right-6 bg-cyan-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={open}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-gray-50 rounded-t-3xl max-h-[90%]">
            <ScrollView className="px-5 pt-6 pb-10">
              <HStack className="items-center justify-between mb-4">
                <Text className="text-xl font-bold text-gray-800">
                  Créer une règle
                </Text>
                <TouchableOpacity
                  onPress={closeModal}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <X size={20} color="#0f172a" />
                </TouchableOpacity>
              </HStack>

              <Text className="text-gray-600 mb-6">
                Créez une nouvelle règle ici. Cliquez sur enregistrer lorsque
                vous avez terminé.
              </Text>

              <VStack space="lg">
                <View className="bg-white rounded-xl shadow-sm p-4">
                  <Text className="text-lg font-semibold text-gray-800 mb-2">
                    Informations de base
                  </Text>

                  <FormControl
                    size="md"
                    isInvalid={!!errors.title}
                    className="mb-4"
                  >
                    <FormControlLabel>
                      <FormControlLabelText className="text-gray-700">
                        Titre
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input
                      className="my-1 bg-gray-50 border border-gray-200 rounded-lg"
                      size="md"
                    >
                      <InputField
                        placeholder="Titre de la règle"
                        value={watch("title")}
                        onChangeText={(text) => setValue("title", text)}
                        onBlur={() => trigger("title")}
                      />
                    </Input>
                    {errors.title ? (
                      <FormControlError>
                        <FormControlErrorIcon />
                        <FormControlErrorText>
                          {errors.title.message}
                        </FormControlErrorText>
                      </FormControlError>
                    ) : (
                      <FormControlHelper>
                        <FormControlHelperText>
                          Un titre clair et concis pour la règle.
                        </FormControlHelperText>
                      </FormControlHelper>
                    )}
                  </FormControl>

                  <FormControl
                    size="md"
                    isInvalid={!!errors.description}
                    className="mb-4"
                  >
                    <FormControlLabel>
                      <FormControlLabelText className="text-gray-700">
                        Description
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input
                      className="my-1 bg-gray-50 border border-gray-200 rounded-lg h-24"
                      size="md"
                    >
                      <InputField
                        placeholder="Description détaillée de la règle"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={watch("description") || ""}
                        onChangeText={(text) => setValue("description", text)}
                        onBlur={() => trigger("description")}
                        style={{ height: 80 }}
                      />
                    </Input>
                    {errors.description ? (
                      <FormControlError>
                        <FormControlErrorIcon />
                        <FormControlErrorText>
                          {errors.description.message}
                        </FormControlErrorText>
                      </FormControlError>
                    ) : (
                      <FormControlHelper>
                        <FormControlHelperText>
                          Fournissez une explication détaillée de la règle et de
                          son objectif.
                        </FormControlHelperText>
                      </FormControlHelper>
                    )}
                  </FormControl>
                </View>

                <HStack className="mt-6 justify-between">
                  <Button
                    className="rounded-lg bg-gray-200 flex-1 mr-2"
                    size="lg"
                    onPress={closeModal}
                    variant="outline"
                  >
                    <X size={18} color="#64748b" />
                    <ButtonText className="text-gray-700 ml-1">
                      Annuler
                    </ButtonText>
                  </Button>
                  <Button
                    className="rounded-lg bg-cyan-600 flex-1 ml-2"
                    size="lg"
                    onPress={handleSubmit(onSubmit)}
                    isDisabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Save size={18} color="white" />
                        <ButtonText className="ml-1">Enregistrer</ButtonText>
                      </>
                    )}
                  </Button>
                </HStack>
              </VStack>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
