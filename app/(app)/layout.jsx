"use client";

import React, { useState, Suspense } from "react";
import NavBar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Loader from "@/components/Loader/Loader";
import styles from "./AppLayout.module.css";

export default function MainAppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={styles.appContainer}>
      <NavBar className={styles.topNavbar} />
      <div className={styles.bodyWrapper}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          className={`${styles.mainContent} ${
            !isSidebarOpen ? styles.mainContentFullWidth : ""
          }`}
        >
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
