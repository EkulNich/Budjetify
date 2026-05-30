import { useState } from "react";
import {
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
  const [monthlyBudget, setMB] = useState("");
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const [loading, setLoading] = useState(false);

  const handleProfile = async () => {
    if (!monthlyBudget) return;
    console.log("Adding monthly budget:", {
      monthlyBudget: parseFloat(monthlyBudget),
    });

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "Not logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ monthly_budget: parseFloat(monthlyBudget) })
      .eq("id", user.id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Saved!", "Monthly budget updated.");
      setMB("");
    }

    setLoading(false);
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
