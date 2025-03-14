import "../src/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthRehydrator from "../src/components/AuthRehydrator";

export const metadata = {
  title: "Genesis ERP",
  description: "ERP solution for Genesis Marketing and Distribution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <AuthProvider>
          <AuthRehydrator>{children}</AuthRehydrator>
        </AuthProvider>
      </body>
    </html>
  );
}
