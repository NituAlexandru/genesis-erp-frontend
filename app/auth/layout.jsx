import "../../src/styles/globals.css";

export const metadata = {
  title: "Autentificare - Genesis ERP",
  description: "Login page for Genesis ERP",
};

// Acest layout va primi automat contextul de la RootLayout
export default function AuthLayout({ children }) {
  // Returnăm direct children sau o structură minimală specifică paginilor de auth.
  // De exemplu, un container centrat:
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {" "}
      {children}
    </div>
  );
}
