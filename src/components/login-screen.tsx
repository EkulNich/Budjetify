import { ThemedText } from "@/components/themed-text";
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

GoogleSignin.configure({
  iosClientId:
    "530067833499-acm4u36k4a8n3ehni1q9rmchrp6ml4b5.apps.googleusercontent.com",
  webClientId:
    "530067833499-h08hgrh89f2cnf6betq7n45fo7uhu9ib.apps.googleusercontent.com",
  scopes: ["profile", "email"],
});

export default function LoginScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSignedIn(!!session);
    });
  }, []);

  const handleSignOut = async () => {
    await GoogleSignin.signOut();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {isSignedIn ? (
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <ThemedText style={{ color: "white" }}>Sign Out</ThemedText>
        </TouchableOpacity>
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={async () => {
            try {
              if (Platform.OS === "android") {
                await GoogleSignin.hasPlayServices();
              }
              const response = await GoogleSignin.signIn();
              if (isSuccessResponse(response) && response.data.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: "google",
                  token: response.data.idToken,
                });
                if (!error && data.user) {
                  const { error: profileError } = await supabase
                    .from("profiles")
                    .upsert({
                      id: data.user.id,
                      username: data.user.user_metadata.full_name,
                      monthly_budget: 0,
                      monthly_salary: 0,
                    });

                  if (profileError) {
                    console.error("Profile error:", profileError.message);
                  }

                  router.replace("/(tabs)/home");
                }
                console.log(error, data);
              }
            } catch (error: any) {
              if (error.code === statusCodes.IN_PROGRESS) {
                // already in progress
              } else if (
                error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
              ) {
                // play services not available
              } else {
                // other error
                console.error("Google Sign In error:", JSON.stringify(error));
              }
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    minWidth: 160,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D612A",
  },
});
