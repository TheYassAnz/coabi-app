import type { RuleResponse, RulePatch } from "@/types/zod/rule";
import { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { HStack } from "@/components/ui/hstack";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react-native";
import { UpdateRuleModal } from "./update-rule";

interface RuleCardProps {
  rule: RuleResponse;
  isModeratorOrAdmin: boolean;
  onUpdate: (id: string, data: RulePatch) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function RuleCard({
  rule,
  isModeratorOrAdmin,
  onUpdate,
  onDelete,
}: RuleCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
      <View className="p-4">
        <HStack space="sm" className="mb-2 items-center">
          <FileText size={20} color="#0891b2" />
          <Text className="text-lg font-semibold text-gray-800">
            {rule.title}
          </Text>
        </HStack>

        {rule.description && (
          <Text className="text-gray-600 ml-6 mt-1 mb-1 leading-5">
            {rule.description}
          </Text>
        )}

        {isModeratorOrAdmin && (
          <HStack className="mt-4 justify-end border-t border-gray-100 pt-3">
            {confirmDelete ? (
              <>
                <AlertTriangle size={18} color="#ef4444" className="mr-1" />
                <Text className="text-red-600 mr-3 self-center font-medium">
                  Confirmer la suppression ?
                </Text>
                <TouchableOpacity
                  onPress={() => setConfirmDelete(false)}
                  className="bg-gray-200 px-4 py-1.5 rounded-lg mr-2 flex-row items-center"
                >
                  <XCircle size={16} color="#374151" className="mr-1" />
                  <Text className="text-gray-700 font-medium">Non</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(rule._id)}
                  className="bg-red-500 px-4 py-1.5 rounded-lg flex-row items-center"
                >
                  <CheckCircle2 size={16} color="white" className="mr-1" />
                  <Text className="text-white font-medium">Oui</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setConfirmDelete(true)}
                  className="bg-red-50 px-4 py-1.5 rounded-lg mr-2 flex-row items-center"
                >
                  <XCircle size={16} color="#b91c1c" className="mr-1" />
                  <Text className="text-red-700 font-medium">Supprimer</Text>
                </TouchableOpacity>
                <UpdateRuleModal ruleData={rule} onUpdate={onUpdate} />
              </>
            )}
          </HStack>
        )}
      </View>
    </View>
  );
}
