"use client";

import type React from "react";

import {
  Text,
  View,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { RefundService } from "@/services/server/refund";
import { getUserByAccessToken } from "@/services/utils";
import { useEffect } from "react";
import { useState } from "react";
import { Alert } from "react-native";
import { z } from "zod";
import { UserService } from "@/services/server/user";

const RefundBatchPostSchema = z.object({
  title: z.string().max(50, "Keep under 50 characters please"),
  toSplit: z
    .number()
    .min(0, "Refund cannot be inferior to 0")
    .max(1000000, "Not possible"),
  userId: z.string(),
  roommateIds: z.string().array(),
  accommodationId: z.string(),
});

type RefundBatchPost = z.infer<typeof RefundBatchPostSchema>;

export default function RefundScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [ownRefund, setOwnRefund] = useState<any[]>([]);
  const [theirRefund, setTheirRefund] = useState<any[]>([]);
  const [allRefunds, setAllRefunds] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); // Tous les utilisateurs pour le mapping
  const refund = new RefundService();

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    toSplit: "",
    selectedRoommateId: "", // Une seule personne sélectionnée
  });
  const [roommates, setRoommates] = useState<any[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});

  // Fonction pour obtenir le nom d'un utilisateur à partir de son ID
  const getUserName = (userId: string) => {
    // D'abord chercher dans la liste des colocataires (plus fiable)
    const roommateUser = roommates.find((r) => r._id === userId);
    if (roommateUser) {
      // Utiliser firstName + lastName si disponibles, sinon username
      if (roommateUser.firstName && roommateUser.lastName) {
        return `${roommateUser.firstName} ${roommateUser.lastName}`;
      }
      return roommateUser.username || roommateUser._id;
    }

    // Ensuite chercher dans tous les utilisateurs
    const foundUser = allUsers.find((u) => u._id === userId);
    if (foundUser) {
      // Utiliser firstName + lastName si disponibles, sinon username
      if (foundUser.firstName && foundUser.lastName) {
        return `${foundUser.firstName} ${foundUser.lastName}`;
      }
      return foundUser.username || foundUser._id;
    }

    // Si c'est l'utilisateur actuel
    if (user && user._id === userId) {
      // Utiliser firstName + lastName si disponibles, sinon username
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      return user.username || user._id;
    }

    // console.log("Utilisateur non trouvé pour ID:", userId)
    // console.log("Roommates disponibles:", roommates)
    // console.log("AllUsers disponibles:", allUsers)
    return userId; // Fallback sur l'ID si pas trouvé
  };

  const handleRoommateSelect = (roommateId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedRoommateId:
        prev.selectedRoommateId === roommateId ? "" : roommateId,
    }));
  };

  const validateForm = () => {
    try {
      // Adapter les données pour le schéma existant
      const roommateIds = formData.selectedRoommateId
        ? [formData.selectedRoommateId]
        : [];

      const parsedData = {
        title: formData.title,
        toSplit: Number.parseFloat(formData.toSplit) || 0, // Montant exact que VOUS devez
        userId: user?._id || "", // VOUS êtes celui qui doit
        roommateIds: roommateIds, // À qui vous devez
        accommodationId: user?.accommodationId || "",
      };

      RefundBatchPostSchema.parse(parsedData);
      setFormErrors({});
      return parsedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: any = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      }
      return null;
    }
  };

  const refreshAllData = async () => {
    try {
      const userData = await getUserByAccessToken();
      if (userData) {
        // console.log("=== RAFRAÎCHISSEMENT DES DONNÉES ===")
        // console.log("Utilisateur actuel:", userData._id, userData.firstName, userData.lastName)

        const [ownRefundData, theirRefundData, allRefundsData] =
          await Promise.all([
            refund.filterRefunds({ userId: userData._id }),
            refund.filterRefunds({ roommateId: userData._id }),
            refund.getAllRefunds(),
          ]);

        // console.log("=== DONNÉES RÉCUPÉRÉES ===")
        // console.log("Mes dettes (je suis userId):", ownRefundData)
        // console.log("Ils me doivent (je suis roommateId):", theirRefundData)
        // console.log("Tous les remboursements:", allRefundsData)

        // Analyser la structure des données
        // if (ownRefundData.length > 0) {
        //   console.log("Structure d'une dette:", ownRefundData[0])
        // }
        // if (theirRefundData.length > 0) {
        //   console.log("Structure d'une créance:", theirRefundData[0])
        // }

        setOwnRefund(ownRefundData);
        setTheirRefund(theirRefundData);
        setAllRefunds(allRefundsData);
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
    }
  };

  const handleCreateRefund = async () => {
    const validatedData = validateForm();
    if (!validatedData) return;

    if (!formData.selectedRoommateId) {
      setFormErrors({
        selectedRoommateId: "Veuillez sélectionner un colocataire",
      });
      return;
    }

    try {
      setFormLoading(true);
      // console.log("=== CRÉATION D'UNE DETTE ===")
      // console.log("VOUS devez", validatedData.toSplit, "€ à", formData.selectedRoommateId)
      // console.log("Données envoyées:", validatedData)

      await refund.createRefunds(validatedData);

      // Rafraîchir les données
      await refreshAllData();

      // Réinitialiser le formulaire et fermer la modale
      setFormData({ title: "", toSplit: "", selectedRoommateId: "" });
      setModalVisible(false);
      Alert.alert("Succès", "Dette créée avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la création:", error);
      Alert.alert("Erreur", error.message || "Erreur lors de la création");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", toSplit: "", selectedRoommateId: "" });
    setFormErrors({});
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const userData = await getUserByAccessToken();
        if (!userData) {
          Alert.alert("Erreur", "Utilisateur non trouvé");
          return;
        }
        setUser(userData);
        // console.log("=== INITIALISATION ===")
        // console.log("Utilisateur connecté:", userData._id, userData.firstName, userData.lastName)

        // Récupérer tous les utilisateurs et colocataires
        const userService = new UserService();
        const [allUsersData, roommatesData] = await Promise.all([
          userService.getAllUsers(),
          userService.getAllUsers(),
        ]);

        // console.log("Tous les utilisateurs récupérés:", allUsersData.length)
        setAllUsers(allUsersData);

        // Filtrer les colocataires (exclure l'utilisateur actuel)
        const filteredRoommates = roommatesData.filter(
          (roommate: any) => roommate._id !== userData._id,
        );
        // console.log("Colocataires filtrés:", filteredRoommates.length)
        setRoommates(filteredRoommates);

        // Récupérer les données de remboursement
        await refreshAllData();
      } catch (error: any) {
        console.error("Erreur lors de l'initialisation:", error);
        Alert.alert("Erreur", error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Composant pour afficher un élément de remboursement
  const RefundCard = ({
    title,
    children,
    type,
  }: {
    title: string;
    children: React.ReactNode;
    type: "debt" | "credit" | "history";
  }) => {
    const getCardStyle = () => {
      switch (type) {
        case "debt":
          return styles.debtCard;
        case "credit":
          return styles.creditCard;
        case "history":
          return styles.historyCard;
        default:
          return styles.defaultCard;
      }
    };

    const getIconColor = () => {
      switch (type) {
        case "debt":
          return "#ef4444";
        case "credit":
          return "#22c55e";
        case "history":
          return "#6b7280";
        default:
          return "#6b7280";
      }
    };

    return (
      <View style={[styles.card, getCardStyle()]}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getIconColor() + "20" },
            ]}
          >
            <Text style={[styles.icon, { color: getIconColor() }]}>
              {type === "debt" ? "💸" : type === "credit" ? "💰" : "📋"}
            </Text>
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.cardContent}>{children}</View>
      </View>
    );
  };

  // Composant pour afficher un élément de remboursement
  const RefundItem = ({
    item,
    showSwitch = false,
    type = "default",
  }: {
    item: any;
    showSwitch?: boolean;
    type?: string;
  }) => {
    // Déterminer qui afficher selon le contexte
    let fromName = "Utilisateur inconnu";
    let toName = "Utilisateur inconnu";
    let arrow = "→";

    if (type === "debt") {
      // Dans "Je dois rembourser" : Moi → Colocataire
      fromName = getUserName(user?._id || "");
      toName = getUserName(item.roommateId);
      arrow = "→";
    } else if (type === "credit") {
      // Dans "Ils me doivent" : Colocataire → Moi
      fromName = getUserName(item.userId);
      toName = getUserName(user?._id || "");
      arrow = "→";
    } else {
      // Pour l'historique, déterminer selon les IDs
      fromName = getUserName(item.userId);
      toName = getUserName(item.roommateId);
      arrow = "→";
    }

    // console.log(`RefundItem ${type}:`, {
    //   itemId: item._id,
    //   userId: item.userId,
    //   roommateId: item.roommateId,
    //   fromName,
    //   toName,
    //   amount: item.toRefund,
    // })

    return (
      <View style={styles.refundItem}>
        <View style={styles.refundInfo}>
          <View style={styles.refundFlow}>
            <Text style={styles.refundFromUser}>{fromName}</Text>
            <Text style={styles.refundArrow}>{arrow}</Text>
            <Text style={styles.refundToUser}>{toName}</Text>
          </View>
          <Text style={styles.refundDescription}>
            {item.title || "Sans description"}
          </Text>
        </View>
        <View style={styles.refundAmount}>
          <Text style={styles.amountText}>{item.toRefund}€</Text>
          {showSwitch && (
            <Switch
              value={false}
              onValueChange={async () => {
                try {
                  await refund.updateRefundById(item._id, { done: true });
                  await refreshAllData();
                } catch (err: any) {
                  Alert.alert(
                    "Erreur",
                    err.message || "Erreur lors de la mise à jour",
                  );
                }
              }}
              trackColor={{ false: "#e5e7eb", true: "#22c55e" }}
              thumbColor={"#ffffff"}
              style={styles.switch}
            />
          )}
        </View>
      </View>
    );
  };

  // Composant pour afficher un message quand il n'y a pas de données
  const EmptyState = ({ message }: { message: string }) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  // Composant pour afficher un élément de colocataire dans la liste (sélection unique)
  const RoommateItem = ({ roommate }: { roommate: any }) => {
    const isSelected = formData.selectedRoommateId === roommate._id;

    return (
      <TouchableOpacity
        style={styles.radioContainer}
        onPress={() => handleRoommateSelect(roommate._id)}
      >
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected ? <View style={styles.radioDot} /> : null}
        </View>
        <Text style={styles.radioLabel}>
          {roommate.firstName} {roommate.lastName} ({roommate.username})
        </Text>
      </TouchableOpacity>
    );
  };

  // Composant pour afficher la liste des colocataires
  const RoommatesList = () => {
    if (!roommates || roommates.length === 0) {
      return (
        <Text style={styles.emptyStateText}>Aucun colocataire disponible</Text>
      );
    }

    return (
      <>
        {roommates.map((roommate) => (
          <RoommateItem key={roommate._id} roommate={roommate} />
        ))}
      </>
    );
  };

  // Composant pour afficher l'aperçu du calcul
  const CalculationPreview = ({ formData }: { formData: any }) => {
    const amount = Number.parseFloat(formData.toSplit) || 0;
    const hasSelectedRoommate = formData.selectedRoommateId !== "";

    if (amount <= 0 || !hasSelectedRoommate) {
      return null;
    }

    const selectedRoommate = roommates.find(
      (r) => r._id === formData.selectedRoommateId,
    );

    return (
      <View style={styles.calculationPreview}>
        <Text style={styles.calculationTitle}>Aperçu de votre dette</Text>
        <View style={styles.calculationRow}>
          <Text style={styles.calculationLabel}>Vous devez :</Text>
          <Text style={styles.calculationValueHighlight}>
            {amount.toFixed(2)}€
          </Text>
        </View>
        <View style={styles.calculationRow}>
          <Text style={styles.calculationLabel}>À :</Text>
          <Text style={styles.calculationValue}>
            {selectedRoommate?.firstName ||
              selectedRoommate?.username ||
              "Colocataire"}
          </Text>
        </View>
        <Text style={styles.calculationNote}>
          Vous devrez rembourser {amount.toFixed(2)}€ à{" "}
          {selectedRoommate?.firstName ||
            selectedRoommate?.username ||
            "ce colocataire"}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Remboursements</Text>
          <Text style={styles.headerSubtitle}>
            Gérez vos dettes et créances
          </Text>
        </View>

        <RefundCard title="Je dois rembourser" type="debt">
          {ownRefund.filter((item) => item.done === false).length === 0 ? (
            <EmptyState message="Aucun remboursement en attente" />
          ) : (
            ownRefund
              .filter((item) => item.done === false)
              .map((item, index) => (
                <RefundItem key={index} item={item} type="debt" />
              ))
          )}
        </RefundCard>

        <RefundCard title="Ils doivent me rembourser" type="credit">
          {theirRefund.filter((item) => item.done === false).length === 0 ? (
            <EmptyState message="Aucun remboursement en attente" />
          ) : (
            theirRefund
              .filter((item) => item.done === false)
              .map((item, index) => (
                <RefundItem
                  key={index}
                  item={item}
                  showSwitch={true}
                  type="credit"
                />
              ))
          )}
        </RefundCard>

        <RefundCard title="Historique des remboursements" type="history">
          {allRefunds.filter((item) => item.done === true).length === 0 ? (
            <EmptyState message="Aucun historique disponible" />
          ) : (
            allRefunds
              .filter((item) => item.done === true)
              .map((item, index) => (
                <RefundItem key={index} item={item} type="history" />
              ))
          )}
        </RefundCard>

        {/* Espace pour éviter que le contenu soit caché par le bouton flottant */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bouton flottant - maintenant en dehors du ScrollView */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modale de création */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créer une dette</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Titre */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Titre</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    formErrors.title && styles.inputError,
                  ]}
                  value={formData.title}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, title: text }))
                  }
                  placeholder="Description du remboursement"
                  maxLength={50}
                />
                {formErrors.title && (
                  <Text style={styles.errorText}>{formErrors.title}</Text>
                )}
              </View>

              {/* Montant */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Montant que vous devez (€)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    formErrors.toSplit && styles.inputError,
                  ]}
                  value={formData.toSplit}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, toSplit: text }))
                  }
                  placeholder="Montant de votre dette"
                  keyboardType="numeric"
                />
                {formErrors.toSplit && (
                  <Text style={styles.errorText}>{formErrors.toSplit}</Text>
                )}
              </View>

              {/* Option pour s'inclure - SUPPRIMÉ */}

              {/* Aperçu du calcul */}
              <CalculationPreview formData={formData} />

              {/* Sélection du colocataire */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Colocataire concerné</Text>
                <RoommatesList />
                {formErrors.selectedRoommateId && (
                  <Text style={styles.errorText}>
                    {formErrors.selectedRoommateId}
                  </Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  formLoading && styles.disabledButton,
                ]}
                onPress={handleCreateRefund}
                disabled={formLoading}
              >
                {formLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.createButtonText}>Créer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  debtCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  creditCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
  },
  historyCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#6b7280",
  },
  defaultCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#e5e7eb",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  refundItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  refundInfo: {
    flex: 1,
    marginRight: 12,
  },
  refundUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  refundDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  refundAmount: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 12,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  text: {
    color: "#000000",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    width: "50%",
    marginTop: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginVertical: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    marginTop: 4,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#374151",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 10,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  radioSelected: {
    borderColor: "#3b82f6",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
  },
  calculationPreview: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  calculationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 12,
  },
  calculationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  calculationLabel: {
    fontSize: 14,
    color: "#374151",
  },
  calculationValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  calculationValueHighlight: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0369a1",
  },
  calculationNote: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  switchDescription: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  refundFlow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  refundFromUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444", // Rouge pour celui qui doit
  },
  refundArrow: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b7280",
    marginHorizontal: 8,
  },
  refundToUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22c55e", // Vert pour celui qui reçoit
  },
});
