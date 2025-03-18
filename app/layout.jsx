import "../src/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthRehydrator from "../src/components/AuthRehydrator";
import NavBar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";

export const metadata = {
  title: "Genesis ERP",
  description: "ERP solution for Genesis Marketing and Distribution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <AuthProvider>
          <AuthRehydrator>
            <div style={{ display: "flex", height: "100vh" }}>
              <Sidebar />
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <NavBar />
                <main style={{ flex: 1, padding: "1rem" }}>{children}</main>
              </div>
            </div>
          </AuthRehydrator>
        </AuthProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
