import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { RefundService } from "@/services/server/refund";
import { getUserByAccessToken } from "@/services/utils";
import { useEffect } from "react";
import { useState } from "react";
import { Alert } from "react-native";

export default function RefundScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [ownRefund, setOwnRefund] = useState<any[]>([]);
  const [theirRefund, setTheirRefund] = useState<any[]>([]);
  const [allRefunds, setAllRefunds] = useState<any[]>([]);
  const refund = new RefundService();

  // const readOwnRefund = async () => {
  //   const userId = await getUserByAccessToken();
  //   try {
  //     await refund.filterRefunds({
  //       userId: userId._id,})
  //   }
  //   catch (error) {
  //     console.error("Error creating refund:", error);
  //   }
  // }

  useEffect(() => {
    const fetchOwnRefund = async () => {
      try {
        setLoading(true);
        const userData = await getUserByAccessToken();
        if (!userData) {
          Alert.alert("Erreur", "Utilisateur non trouvé");
          return;
        }
        const refundData = await refund.filterRefunds({
          userId: userData._id,
        });
        setOwnRefund(refundData);
        console.log(ownRefund);
        // console.log("refundData ils me doivent", refundData);
        // console.log("userId", userData._id);
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTheirRefund = async () => {
      try {
        setLoading(true);
        const userData = await getUserByAccessToken();
        if (!userData) {
          Alert.alert("Erreur", "Utilisateur non trouvé");
          return;
        }
        setUser(userData);
        const refundData = await refund.filterRefunds({
          roommateId: userData._id,
        });
        setTheirRefund(refundData);
        // console.log("refundData je dois", refundData);
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
      } finally {
        setLoading(false);
      }
    };

    // const getAllRefunds = async () => {
    //   try{
    //     setLoading(true);
    //     const userData = await getUserByAccessToken();
    //     if (!userData) {
    //       Alert.alert("Erreur", "Utilisateur non trouvé");
    //       return;
    //     }
    //     setUser(userData);
    //     const refundData = await refund.getAllRefunds();
    //     setRefunds(refundData);
    //     console.log("refundData", refunds);
    //   } catch (error: any) {
    //     Alert.alert("Erreur", error.message);
    //   }
    // };
    fetchTheirRefund();
    fetchOwnRefund();
    // getAllRefunds();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.firstcontainer}>
        <Text style={styles.text}>Ils me doivent :</Text>
        {ownRefund.length === 0 ? (
          <Text style={styles.text}>Aucun remboursement</Text>
        ) : (
          ownRefund.map((item, index) => (
            // Bien penser à mettre le style à jour ici.
            <Text key={index} style={styles.text}>
              {item.roommateId} - {item.toRefund}€ -{" "}
              {item.title || "Sans description"}
            </Text>
          ))
        )}
      </View>
      <View style={styles.secondcontainer}>
        <Text style={styles.text}>Je dois :</Text>
        {ownRefund.length === 0 ||
        ownRefund.filter((item) => item.roommateId == user._id).length === 0 ? (
          <Text style={styles.text}>Je ne dois rien</Text>
        ) : (
          ownRefund
            .filter((item) => item.roommateId == user._id)
            .map((item, index) => (
              <Text key={index} style={styles.text}>
                {item.userId} - {item.toRefund}€ -{" "}
                {item.title || "Sans description"}
              </Text>
            ))
        )}
      </View>

      <Text style={styles.text}>Ecran du refund</Text>
      <TextInput
        style={styles.input}
        placeholder="10€"
        keyboardType="numeric"
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          console.log("Refund created");
        }}
      >
        <Text>Create a refund</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firstcontainer: {
    backgroundColor: "red",
    flex: 0.3,
  },
  secondcontainer: {
    backgroundColor: "blue",
    flex: 0.3,
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
});
