import React, { Suspense } from "react";
import "../src/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthRehydrator from "../src/components/AuthRehydrator";
import NavBar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Loader from "@/components/Loader/Loader";
import styles from "./AppLayout.module.css";
import NotiflixInit from "@/components/NotiflixInit";

export const metadata = {
  title: "Genesis ERP",
  description: "ERP solution for Genesis Marketing and Distribution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <NotiflixInit />
        <AuthProvider>
          <AuthRehydrator>
            <div className={styles.container}>
              <Sidebar className={styles.sidebar} />
              <div className={styles.content}>
                <NavBar />
                <main className={styles.main}>
                  <Suspense fallback={<Loader />}>{children}</Suspense>
                </main>
              </div>
            </div>
          </AuthRehydrator>
        </AuthProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
