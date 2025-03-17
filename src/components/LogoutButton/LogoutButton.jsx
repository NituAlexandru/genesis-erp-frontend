"use client";

import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function LogoutButton({ className, children }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Logout"}
    </button>
  );
}
