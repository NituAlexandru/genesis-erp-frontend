"use client";

import React from "react"; 
import { useRouter } from "next/navigation";
import menuConfig from "@/components/Sidebar/MenuConfig/menuConfig";
import styles from "./Sidebar.module.css";

// --- Definirea MenuItemComponent aici sau import ---
function MenuItemComponent({ item, level = 0, isSidebarOpen }) {
  const router = useRouter();
  const [isSubMenuOpen, setIsSubMenuOpen] = React.useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;

  const handleClick = () => {
    if (hasSubItems) {
      setIsSubMenuOpen((prev) => !prev);
    } else if (item.path) {
      router.push(item.path);
    }
  };

  return (
    // Stilul pt indentare și containerul menuItem
    <div
      className={styles.menuItem}
      style={{ marginLeft: `${level * 0.1}rem` }}
    >
      <div className={styles.menuTitle} onClick={handleClick}>
        <span>{item.title}</span>
        {hasSubItems && (
          <span className={styles.arrow}>{isSubMenuOpen ? "▲" : "▼"}</span>
        )}
      </div>
      {/* Randare recursivă */}
      {hasSubItems && isSubMenuOpen && (
        <div className={styles.subMenu}>
          {" "}
          {/* Clasa subMenu poate fi scoasă dacă folosim doar paddingLeft */}
          {item.subItems.map((subItem, subIndex) => (
            <MenuItemComponent
              key={subIndex}
              item={subItem}
              level={level + 1}
              isSidebarOpen={isSidebarOpen} // Pasăm starea sidebarului principal
            />
          ))}
        </div>
      )}
    </div>
  );
}
// Componenta Sidebar principală - primește isOpen și toggleSidebar
export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside
      className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ""}`}
    >
      <button
        onClick={toggleSidebar}
        className={styles.toggleButton}
        title={isOpen ? "Restrânge" : "Extinde"}
      >
        {isOpen ? "◀" : "▶"}
      </button>
      {/* Folosim containerul pentru a gestiona vizibilitatea globală */}
      <div className={styles.menuItemsContainer}>
        {/* Mapăm configul și randăm MenuItemComponent pentru fiecare item de nivel 0 */}
        {menuConfig.map((item, index) => (
          <MenuItemComponent
            key={index}
            item={item}
            level={0}
            isSidebarOpen={isOpen} // Pasăm starea sidebarului
          />
        ))}
      </div>
    </aside>
  );
}
