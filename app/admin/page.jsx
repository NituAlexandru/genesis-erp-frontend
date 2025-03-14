import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "@/components/Layout";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Administrator") {
      // Dacă nu e logat sau nu e Administrator, redirect la /dashboard
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "Administrator") {
    return null;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Panou de Administrare</h1>
      <p>Aici poți gestiona utilizatorii și rolurile.</p>
      {/* un buton "Creează utilizator nou" */}
    </Layout>
  );
}
