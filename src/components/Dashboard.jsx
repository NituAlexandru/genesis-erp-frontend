import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      // Verifică permisiunile
      // Daca userul nu are "VIEW_ALL_PAGES", redirecționează
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null; // sau un loading spinner
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold">Bine ai venit în Dashboard!</h2>
      {/* conținutul pentru Dashboard */}
    </Layout>
  );
}
