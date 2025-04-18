import { Button, ButtonText } from "@/components/ui/button";
import { AuthContext } from "@/utils/authContext";
import { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function SettingScreen() {
  const authState = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings screen</Text>
      <Button className="mt-5" onPress={authState.logOut}>
        <ButtonText>Log Out</ButtonText>
      </Button>
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
