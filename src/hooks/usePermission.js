import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";

export default function usePermission(permission) {
  const { user } = useContext(AuthContext);
  return user && user.permissions && user.permissions.includes(permission);
}
