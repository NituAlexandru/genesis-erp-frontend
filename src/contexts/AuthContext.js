"use client";

import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

// Inițializăm contextul cu valori default
const AuthContext = createContext({
  user: null,
  loading: true, // Începem cu loading true pentru rehidratare
  login: (userData) => {
    console.warn("AuthProvider not yet mounted, login called too early.");
  },
  logout: () => {
    console.warn("AuthProvider not yet mounted, logout called too early.");
  },
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Starea pentru datele userului
  const [loading, setLoading] = useState(true); // Starea de loading pentru rehidratare

  // --- Funcții de actualizare a stării ---

  // Funcția login - primește doar userData
  // useCallback pentru a preveni re-crearea inutilă a funcției
  const login = useCallback((userData) => {
    if (!userData || !userData.userId || !userData.username) {
      console.error(
        "AuthContext.login called with invalid userData:",
        userData
      );
      return;
    }
    console.log("AuthContext: Logging in user:", userData.username);
    setUser(userData); // Setează datele userului
    setLoading(false); // Oprește starea de loading DUPĂ ce userul e setat
  }, []); // Nu are dependențe externe care se schimbă

  // Funcția logout - curăță user-ul
  // useCallback pentru a preveni re-crearea inutilă a funcției
  const logout = useCallback(() => {
    console.log("AuthContext: Logging out user.");
    setUser(null); // Șterge datele userului
    setLoading(false); // Oprește starea de loading și la logout
  }, []); // Nu are dependențe externe care se schimbă

  // --- Valori Derivate ---
  // Calculăm isAuthenticated pe baza existenței user-ului
  // useMemo pentru a recalcula valoarea doar când `user` se schimbă
  const isAuthenticated = useMemo(() => !!user, [user]);

  useEffect(() => {
    console.log("AuthContext State Change:", {
      user,
      loading,
      isAuthenticated,
    });
  }, [user, loading, isAuthenticated]);

  // --- Valoarea Contextului ---
  // Memoizăm obiectul `value` pentru a optimiza performanța
  // Contextul va notifica consumatorii doar dacă una dintre aceste valori se schimbă
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated,
    }),
    [user, loading, login, logout, isAuthenticated]
  ); // Include toate valorile expuse

  // Furnizăm valoarea contextului către componentele copil
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
