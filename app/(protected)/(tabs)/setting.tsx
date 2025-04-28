import { Button, ButtonText } from "@/components/ui/button";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, StyleSheet, Alert } from "react-native";
import { AuthService } from "@/services/server/auth";

export default function SettingScreen() {
  const authService = new AuthService();

  const submit = async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings screen</Text>
      <Button className="mt-5" onPress={submit}>
        <ButtonText>Log Out</ButtonText>
        <MaterialIcons name="logout" color="white" size={20} />
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
