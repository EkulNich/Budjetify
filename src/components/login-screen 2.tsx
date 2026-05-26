import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

async function signInWithGoogle() {
  const redirectUrl = Linking.createURL('/');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data?.url) {
    return;
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type !== 'success' || !result.url) {
    return;
  }

  const { queryParams } = Linking.parse(result.url);
  const code = typeof queryParams?.code === 'string' ? queryParams.code : null;

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      throw exchangeError;
    }
  }
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);

    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in right now.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <ThemedView
      style={[
        styles.screen,
        { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + Spacing.four },
      ]}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.contentWrap}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="code" style={styles.kicker}>
            Budgetify
          </ThemedText>

          <ThemedText type="title" style={styles.title}>
            Track money without the noise.
          </ThemedText>

          <ThemedText themeColor="textSecondary" style={styles.description}>
            Sign in with Google to sync your budget data and keep every category in one place.
          </ThemedText>

          <Pressable
            onPress={handleGoogleSignIn}
            disabled={isSigningIn}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.text },
              pressed && !isSigningIn && styles.buttonPressed,
            ]}>
            {isSigningIn ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <ThemedText type="smallBold" style={[styles.buttonLabel, { color: theme.background }]}>
                Continue with Google
              </ThemedText>
            )}
          </Pressable>

          <ThemedText themeColor="textSecondary" style={styles.note}>
            We only use the Google account to authenticate your session.
          </ThemedText>

          {errorMessage ? (
            <ThemedText themeColor="textSecondary" style={styles.errorText}>
              {errorMessage}
            </ThemedText>
          ) : null}
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  contentWrap: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  card: {
    gap: Spacing.three,
    padding: Spacing.five,
    borderRadius: Spacing.five,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128, 128, 128, 0.18)',
  },
  kicker: {
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    maxWidth: 500,
  },
  description: {
    maxWidth: 460,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    marginTop: Spacing.two,
    minHeight: 52,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    letterSpacing: 0.2,
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
  },
  errorText: {
    color: '#b42318',
    fontSize: 12,
    lineHeight: 18,
  },
  glowOne: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: 'rgba(60, 135, 247, 0.16)',
  },
  glowTwo: {
    position: 'absolute',
    bottom: -100,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(240, 103, 166, 0.12)',
  },
});