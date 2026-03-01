import {
  type ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { login as apiLogin, logout as apiLogout } from "../lib/apiClient.ts";
import { SESSION_TOKEN_KEY } from "../lib/constants.ts";

interface AuthState {
  isAuthenticated: boolean;
  login: (googleIdToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem(SESSION_TOKEN_KEY),
  );

  const login = useCallback(async (googleIdToken: string) => {
    await apiLogin(googleIdToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
