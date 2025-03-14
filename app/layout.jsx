import "../styles/globals.css"; // import stiluri globale
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Genesis ERP",
  description: "ERP solution using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
