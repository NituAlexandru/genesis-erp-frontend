"use client";

import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import Notiflix from "notiflix";

export default function LogoutButton({ className, children }) {
  const { logout: logoutFromContext } = useAuth();
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogout = async () => {
    Notiflix.Confirm.show(
      "Confirmare Deconectare",
      "Ești sigur că vrei să te deconectezi?",
      "Deconectează-mă",
      "Anulează",
      async () => {
        Notiflix.Loading.standard("Deconectare..."); // Afișează loader

        try {
          // --- PASUL 1: Apel API către backend ---
          console.log("LogoutButton: Calling POST /api/auth/logout");
          await axios.post(
            `${BASE_URL}/api/auth/logout`,
            {}, // Nu trimitem date în body
            { withCredentials: true } // IMPORTANT: Permite trimiterea/primirea cookie-urilor
          );
          console.log("LogoutButton: API call successful.");

          // --- PASUL 2: Curățare stare locală (context) ---
          // Se apelează DOAR DUPĂ ce API-ul a răspuns cu succes
          logoutFromContext();
          console.log("LogoutButton: Context state cleared.");

          Notiflix.Loading.remove();
          Notiflix.Notify.success("Deconectare reușită!");

          // --- PASUL 3: Redirecționare ---
          // Folosim replace pentru a curăța istoricul de navigație
          router.replace("/auth/login");
        } catch (error) {
          Notiflix.Loading.remove();
          console.error(
            "LogoutButton: Logout API call failed:",
            error.response || error
          );
          // Afișează o eroare specifică dacă e posibil
          Notiflix.Notify.failure(
            error.response?.data?.msg ||
              "Deconectarea a eșuat. Vă rugăm încercați din nou."
          );

          // --- Opțional, dar recomandat: Curăță starea locală și redirecționează chiar dacă API-ul eșuează ---
          // Acest lucru previne situația în care utilizatorul rămâne blocat într-o stare inconsistentă.
          logoutFromContext();
          router.replace("/auth/login");
        }
      },
      () => {
        // Nu facem nimic dacă utilizatorul apasă 'Anulează'
        console.log("Logout cancelled by user.");
      },
      {
        // Opțiuni Notiflix
        position: "center",
        // Păstrează restul opțiunilor specifice pentru logout:
        titleColor: "#dc2626",
        okButtonBackground: "#dc2626",
        okButtonColor: "#ffffff",
      }
    );
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children || "Logout"}
    </button>
  );
}
