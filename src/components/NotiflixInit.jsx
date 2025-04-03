"use client";

import { useEffect } from "react";
// Nu mai importăm Notiflix direct aici sus

export default function NotiflixInit() {
  useEffect(() => {
    const initializeNotiflix = async () => {
      try {
        // Importăm dinamic - .default returnează obiectul cu modulele
        const Notiflix = (await import("notiflix")).default;

        // Verificăm dacă obiectul principal și modulele necesare există
        if (
          Notiflix &&
          Notiflix.Confirm &&
          Notiflix.Notify &&
          Notiflix.Loading
        ) {
          console.log("Attempting to initialize Notiflix modules...");

          // --- Inițializare Modul Confirm ---
          if (typeof Notiflix.Confirm.init === "function") {
            Notiflix.Confirm.init({
              // Doar opțiunile specifice pentru Confirm
              className: "genesis-confirm-box",
              position: "right-top",

              timeout: 4000,

              success: { background: "#10b981", textColor: "#ffffff" },
              failure: { background: "#ef4444", textColor: "#ffffff" },
              warning: { background: "#f59e0b", textColor: "#ffffff" },
              info: { background: "#3b82f6", textColor: "#ffffff" },
            });
            console.log("Notiflix Confirm initialized.");
          } else {
            console.error("Notiflix.Confirm.init is not a function.");
          }

          // --- Inițializare Modul Notify ---
          if (typeof Notiflix.Notify.init === "function") {
            Notiflix.Notify.init({
              // Doar opțiunile specifice pentru Notify
            });
            console.log("Notiflix Notify initialized.");
          } else {
            console.error("Notiflix.Notify.init is not a function.");
          }

          // --- Inițializare Modul Loading ---
          if (typeof Notiflix.Loading.init === "function") {
            Notiflix.Loading.init({
              // Doar opțiunile specifice pentru Loading
              customSvgUrl: null,
              svgColor: "#1e40af",
              messageColor: "#1e40af",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            });
            console.log("Notiflix Loading initialized.");
          } else {
            console.error("Notiflix.Loading.init is not a function.");
          }
        } else {
          console.error(
            "Notiflix modules (Confirm, Notify, Loading) not found after dynamic import. Imported module:",
            Notiflix
          );
        }
      } catch (error) {
        console.error(
          "Failed to dynamically import or initialize Notiflix:",
          error
        );
      }
    };

    initializeNotiflix();
  }, []); // [] asigură rularea o singură dată

  return null;
}
