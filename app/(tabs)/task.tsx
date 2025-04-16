import { Text, View, StyleSheet } from "react-native";

export default function TaskScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Task screen</Text>
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
