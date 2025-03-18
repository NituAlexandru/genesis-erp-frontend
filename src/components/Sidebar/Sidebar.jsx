"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import menuConfig from "@/components/Sidebar/MenuConfig/menuConfig";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNavigation = (path, hasSubItems, index) => {
    if (hasSubItems) {
      toggleMenu(index);
    } else {
      router.push(path);
    }
  };

  return (
    <aside className={styles.sidebar}>
      {menuConfig.map((item, index) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        return (
          <div key={index} className={styles.menuItem}>
            <div
              className={styles.menuTitle}
              onClick={() => handleNavigation(item.path, hasSubItems, index)}
            >
              {item.title}
              {hasSubItems && (
                <span className={styles.arrow}>
                  {openMenus[index] ? "▲" : "▼"}
                </span>
              )}
            </div>
            {hasSubItems && openMenus[index] && (
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
    </aside>
  );
}
