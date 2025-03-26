"use client";

import Image from "next/image";
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

  const handleUserClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image
          src="/images/image.webp"
          alt="Genesis ERP"
          width={150}
          height={50}
          priority
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.toggleButton} onClick={handleToggleMode}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <div className={styles.userContainer} onClick={handleUserClick}>
          <span className={styles.welcome}>
            {user?.username ? (
              <span>Bine ai venit, {user.username}</span>
            ) : (
              <span></span>
            )}
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
