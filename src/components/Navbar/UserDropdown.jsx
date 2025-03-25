"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import styles from "./UserDropdown.module.css";

export default function UserDropdown({ isOpen, onProfileClick, onClose }) {
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleProfileClick = (e) => {
    e.stopPropagation();
    router.push("/user-profile");
    onClose(); // Închide dropdown-ul după navigare
  };

  // Închide dropdown-ul la click în afara lui
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={dropdownRef}
      className={
        isOpen ? `${styles.dropdown} ${styles.dropdownOpen}` : styles.dropdown
      }
    >
      <div className={styles.dropdownItem} onClick={handleProfileClick}>
        Profil
      </div>
      <div className={styles.dropdownItem}>
        <LogoutButton className={styles.logoutButton} />
      </div>
    </div>
  );
}
