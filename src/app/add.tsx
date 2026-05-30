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
import { useRef } from "react";

export default function AddScreen() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const descriptionRef = useRef<TextInput>(null);

  const handleAdd = () => {
    if (!amount) return;
    console.log("Adding expense:", { amount: parseFloat(amount), description });
    // TODO: save to Supabase
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={{ color: colors.backgroundElement }}>
          Add Expense
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor="#B0B4BA"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          returnKeyType="next"
          onSubmitEditing={() => descriptionRef.current?.focus()}
        />

        <TextInput
          ref={descriptionRef}
          style={[styles.input, { color: "black" }]}
          placeholder="Description"
          placeholderTextColor="#B0B4BA"
          value={description}
          onChangeText={setDescription}
          returnKeyType="done"
        />

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <ThemedText style={{ color: "white" }}>Add Expense</ThemedText>
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
