import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth.ts";

export function GoogleLoginButton() {
  const { login } = useAuth();

  return (
    <GoogleLogin
      onSuccess={async (response) => {
        if (response.credential) {
          await login(response.credential);
        }
      }}
      onError={() => {
        console.error("Google login failed");
      }}
    />
  );
}
