"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // corect pentru App Router
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/Loader";

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // După ce loading e false, dacă userul nu e autentificat sau nu are rolul potrivit, redirecționează
    if (
      !loading &&
      (!isAuthenticated || !["Admin", "Administrator"].includes(user?.role))
    ) {
      router.push("/no-access");
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated || !["Admin", "Administrator"].includes(user?.role)) {
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>
      <p>Gestionați utilizatorii și rolurile.</p>
      {/* Aici adaugi legături către sub-pagini: /admin/users, /admin/roles, etc. */}
    </div>
  );
}
