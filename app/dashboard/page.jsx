"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import LogoutButton from "@/components/LogoutButton/LogoutButton";

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Loader />;
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    router.push("/auth/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Aici este conținutul dashboardului</p>
      <LogoutButton onClick={handleLogout}></LogoutButton>
    </div>
  );
}
