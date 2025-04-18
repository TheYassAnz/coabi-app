import { Text, View, StyleSheet } from "react-native";

export default function AgendaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Agenda screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#000000",
  },
});
