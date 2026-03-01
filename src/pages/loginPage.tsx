import { Navigate } from "react-router";
import { GoogleLoginButton } from "../components/auth/googleLoginButton.tsx";
import { LogoIcon } from "../components/ui/logoIcon.tsx";
import { useAuth } from "../hooks/useAuth.ts";

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-teal-50 px-4">
      <div className="w-full max-w-sm rounded-panel bg-white p-10 shadow-panel text-center">
        <LogoIcon className="mx-auto mb-3 h-16 w-16" showBackground={false} />
        <h1 className="text-2xl font-bold text-brand-800 mb-2">
          麻雀スコア管理
        </h1>
        <p className="text-gray-500 mb-8 text-sm">スコアを記録・管理</p>
        <GoogleLoginButton />
      </div>
    </div>
  );
}
