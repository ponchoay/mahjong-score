import { faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigate } from "react-router";
import { GoogleLoginButton } from "../components/auth/googleLoginButton.tsx";
import { useAuth } from "../hooks/useAuth.ts";

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-teal-50">
      <div className="rounded-panel bg-white p-10 shadow-panel text-center">
        <FontAwesomeIcon
          icon={faDice}
          className="text-4xl text-brand-600 mb-3"
        />
        <h1 className="text-2xl font-bold text-brand-800 mb-2">
          麻雀スコア管理
        </h1>
        <p className="text-gray-500 mb-8 text-sm">スコアを記録・管理</p>
        <GoogleLoginButton />
      </div>
    </div>
  );
}
