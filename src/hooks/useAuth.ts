import { useContext } from "react";
import { AuthContext } from "../contexts/authContext.tsx";

export function useAuth() {
  return useContext(AuthContext);
}
