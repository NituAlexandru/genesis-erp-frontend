"use client";

import NavBar from "@/components/Navbar/Navbar";
import { useRouter } from "next/navigation";

export default function NoAccessPage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div>
      <h2>Acces Interzis</h2>
      <p>Nu aveți permisiunea necesară pentru a accesa această pagină.</p>
      <button onClick={handleRedirect}>Mergi la Dashboard</button>
    </div>
  );
}
