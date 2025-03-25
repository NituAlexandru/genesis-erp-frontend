import "../../src/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthRehydrator from "@/components/AuthRehydrator";

export const metadata = {
  title: "Autentificare - Genesis ERP",
  description: "Login page for Genesis ERP",
};

export default function AuthLayout({ children }) {
  return (
    <AuthProvider>
      <AuthRehydrator>{children}</AuthRehydrator>
    </AuthProvider>
  );
}
