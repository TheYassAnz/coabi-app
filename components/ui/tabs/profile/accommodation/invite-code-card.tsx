import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Key, Copy, CheckCircle } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import type { AccommodationResponse } from "@/types/zod/accommodation";

interface InviteCodeCardProps {
  accommodation: AccommodationResponse;
}

export const InviteCodeCard = ({ accommodation }: InviteCodeCardProps) => {
  const [codeCopied, setCodeCopied] = useState(false);

  const copyInviteCode = () => {
    if (accommodation?.code) {
      Clipboard.setStringAsync(accommodation.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <TouchableOpacity
      onPress={copyInviteCode}
      className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-cyan-100"
    >
      <HStack className="items-center justify-between">
        <HStack className="items-center">
          <Key size={20} color="#0891b2" />
          <Text className="font-medium text-gray-800 ml-2">
            Code d'invitation
          </Text>
        </HStack>
        {codeCopied ? (
          <CheckCircle size={20} color="#10b981" />
        ) : (
          <Copy size={20} color="#64748b" />
        )}
      </HStack>
      <Text className="text-lg font-bold text-cyan-700 mt-2 text-center">
        {accommodation.code}
      </Text>
      <Text className="text-xs text-gray-500 mt-1 text-center">
        {codeCopied
          ? "Copié dans le presse-papiers !"
          : "Appuyez pour copier et partager avec vos colocataires"}
      </Text>
    </TouchableOpacity>
  );
};
