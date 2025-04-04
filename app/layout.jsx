import React, { Suspense } from "react";
import "../src/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthRehydrator from "@/components/AuthRehydrator";
import Loader from "@/components/Loader/Loader";
import NotiflixInit from "@/components/NotiflixInit";

export const metadata = {
  title: "Genesis ERP",
  description: "ERP solution for Genesis Marketing and Distribution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        {/* Inițializări Globale */}
        <NotiflixInit />

        {/* Provideri Globali de Context */}
        <AuthProvider>
          {/* Loader-ul din AuthRehydrator va fi afișat dacă e necesar */}
          <AuthRehydrator>
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </AuthRehydrator>
        </AuthProvider>

        {/* Container pentru Modale */}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
