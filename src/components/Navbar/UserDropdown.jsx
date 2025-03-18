"use client";

import React from "react";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import styles from "./UserDropdown.module.css";

export default function UserDropdown({ isOpen, onProfileClick }) {
  return (
    <div
      className={
        isOpen ? `${styles.dropdown} ${styles.dropdownOpen}` : styles.dropdown
      }
    >
      <div className={styles.dropdownItem} onClick={onProfileClick}>
        Profil
      </div>
      <div className={styles.dropdownItem}>
        <LogoutButton className={styles.logoutButton} />
      </div>
    </div>
  );
}
