"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../Sidebar.module.css";

function MenuItemComponent({ item, level = 0, isSidebarOpen }) {
  const router = useRouter();
  // Fiecare MenuItem își gestionează PROPRIA stare de deschidere a submeniului
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;

  const handleClick = () => {
    if (hasSubItems) {
      // Dacă are sub-iteme, doar deschide/închide submeniul local
      setIsSubMenuOpen((prev) => !prev);
    } else if (item.path) {
      // Dacă nu are sub-iteme și are o cale, navighează
      router.push(item.path);
    }
  };

  return (
    <div
      className={styles.menuItem}
      style={{
        // Aplicăm padding dinamic pentru indentare bazat pe nivel
        marginLeft: `${level * 0.1}rem`,
      }}
    >
      <div className={styles.menuTitle} onClick={handleClick}>
        <span>{item.title}</span>
        {hasSubItems && (
          <span className={styles.arrow}>{isSubMenuOpen ? "▲" : "▼"}</span>
        )}
      </div>

      {hasSubItems && isSubMenuOpen && (
        <div className={styles.subMenu}>
          {" "}
          {item.subItems.map((subItem, subIndex) => (
            <MenuItemComponent
              key={subIndex}
              item={subItem}
              level={level + 1}
              isSidebarOpen={isSidebarOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuItemComponent;
