import {
    GoogleSignin,
    GoogleSigninButton,
    isSuccessResponse,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../lib/supabase";

GoogleSignin.configure({
  webClientId: "YOUR CLIENT ID FROM GOOGLE CONSOLE",
});

export default function LoginScreen() {
  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const response = await GoogleSignin.signIn();
          if (isSuccessResponse(response) && response.data.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.data.idToken,
            });
            console.log(error, data);
          }
        } catch (error: any) {
          if (error.code === statusCodes.IN_PROGRESS) {
            // already in progress
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available
          } else {
            // other error
          }
        }
      }}
    />
  );
}
