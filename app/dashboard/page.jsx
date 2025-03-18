"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import NavBar from "@/components/Navbar/Navbar";

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

  return (
    <div>
      <NavBar />
      <h1>Dashboard</h1>
      <p>Aici este conținutul dashboardului</p>
    </div>
  );
}
