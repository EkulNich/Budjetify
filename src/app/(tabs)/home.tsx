import { supabase } from "@/lib/supabase";

import * as Device from "expo-device";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BudgetBar } from "@/components/budget-bar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  useEffect(() => {
    const checkSupabase = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.error("Supabase error:", JSON.stringify(error, null, 2));
      } else {
        console.log("Data:", data);
      }
    };

    checkSupabase();
  }, []);
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.topBar}>
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push("/login")}
          >
            <ThemedText style={{ color: "white" }}>LC</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.heroSection}>
          <Image
            source={require("@/assets/images/budgetify_name.png")}
            style={{ width: 450, height: 150, borderRadius: 0 }}
          />
        </ThemedView>

        <BudgetBar spendingLimit={2000} outflow={157.5} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },

  topBar: {
    alignSelf: "stretch",
    alignItems: "flex-end",
  },

  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2D612A",
    alignItems: "center",
    justifyContent: "center",
  },
});
