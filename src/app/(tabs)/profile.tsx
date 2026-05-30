import { useState } from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";

export default function ProfileScreen() {
  const [monthlyBudget, setMB] = useState("");
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const handleProfile = () => {
    if (!monthlyBudget) return;
    console.log("Adding monthly budget:", {
      monthlyBudget: parseFloat(monthlyBudget),
    });
    // TODO: save to Supabase
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={{ color: colors.backgroundElement }}>
          Profile
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Monthly budget"
          placeholderTextColor="#B0B4BA"
          keyboardType="numeric"
          value={monthlyBudget}
          onChangeText={setMB}
          returnKeyType="done"
        />

        <TouchableOpacity style={styles.button} onPress={handleProfile}>
          <ThemedText style={{ color: "white" }}>Add Info</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: Spacing.three,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2D612A",
    padding: Spacing.three,
    borderRadius: 8,
    alignItems: "center",
  },
});
