"use client";

import React from "react";
import { useRouter } from "next/navigation";
import menuConfig from "@/components/Sidebar/MenuConfig/menuConfig";
import styles from "./Sidebar.module.css";

// Primește isOpen și toggleSidebar ca props
export default function Sidebar({ isOpen, toggleSidebar }) {
  const router = useRouter();
  // Starea pentru submeniuri - o păstrăm locală în Sidebar
  const [openMenus, setOpenMenus] = React.useState({});

  const toggleLocalMenu = (index) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNavigation = (path, hasSubItems, index) => {
    if (hasSubItems) {
      toggleLocalMenu(index);
    } else if (path) {
      router.push(path);
    }
  };

  return (
    // Aplicăm clasa 'sidebarClosed' condiționat
    <aside
      className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ""}`}
    >
      {/* Butonul de Toggle */}
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {isOpen ? "◀" : "▶"} {/* Sau folosește iconițe */}
      </button>

      <div className={styles.menuItemsContainer}>
        {menuConfig.map((item, index) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isSubMenuOpen = !!openMenus[index]; // Verificăm dacă submeniul e deschis

          return (
            <div
              key={index}
              className={styles.menuItem}
              style={{ display: isOpen ? "block" : "none" }}
            >
              <div
                className={styles.menuTitle}
                onClick={() => handleNavigation(item.path, hasSubItems, index)}
              >
                {item.title}
                {hasSubItems && (
                  <span className={styles.arrow}>
                    {isSubMenuOpen ? "▲" : "▼"}
                  </span>
                )}
              </div>
              {hasSubItems && isSubMenuOpen && (
                <div className={styles.subMenu}>
                  {item.subItems.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      className={styles.subMenuItem}
                      onClick={() => router.push(subItem.path)}
                    >
                      {subItem.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
