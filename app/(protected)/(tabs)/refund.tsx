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
import { set } from "date-fns";

export default function RefundScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [refunds, setRefunds] = useState<any[]>([]);
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
    const fetchRefund = async () => {
      try {
        setLoading(true);
        const userData = await getUserByAccessToken();
        if (!userData) {
          Alert.alert("Erreur", "Utilisateur non trouvé");
          return;
        }
        setUser(userData);
        const refundData = await refund.filterRefunds({
          userId: user._id,
        });
        setRefunds(refundData);
        console.log("refundData", refundData);
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRefund();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.firstcontainer}>
        <Text style={styles.text}>Refund</Text>
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
