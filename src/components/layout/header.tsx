import {
  faRightFromBracket,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { LogoIcon } from "../ui/logoIcon.tsx";

export function Header() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-teal-600 text-white shadow-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold">
          <LogoIcon className="inline-block mr-1 h-8 w-8 -mt-0.5 align-middle" />
          麻雀スコア管理
        </h1>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="relative rounded-btn bg-white px-3 py-1 text-sm text-brand-700 hover:bg-brand-50 transition-colors disabled:opacity-50"
        >
          <span className={isLoggingOut ? "invisible" : ""}>
            <FontAwesomeIcon icon={faRightFromBracket} className="mr-1" />
            ログアウト
          </span>
          {isLoggingOut && (
            <span className="absolute inset-0 flex items-center justify-center">
              <FontAwesomeIcon icon={faSpinner} spin />
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
