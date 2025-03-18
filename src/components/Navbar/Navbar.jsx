"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import UserDropdown from "@/components/Navbar/UserDropdown";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Activează / dezactivează Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleToggleMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Apelăm stopPropagation ca să nu declanșăm evenimentul global
  const handleUserClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    // Poți redirecționa către pagina de profil, ex:
    // router.push("/profil")
    setIsDropdownOpen(false);
  };

  // Funcție de închidere folosită de dropdown când se face click în afara lui
  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>LOGO</div>

      <div className={styles.actions}>
        <button className={styles.toggleButton} onClick={handleToggleMode}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <div className={styles.userContainer} onClick={handleUserClick}>
          <span className={styles.welcome}>
            Bine ai venit, {user?.username || "Utilizator"}
          </span>
          <UserDropdown
            isOpen={isDropdownOpen}
            onProfileClick={handleProfileClick}
            onClose={handleCloseDropdown}
          />
        </div>
      </div>
    </nav>
  );
}
