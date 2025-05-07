import { Pre } from "@expo/html-elements";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
} from "react-native";

export default function RefundScreen() {
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
