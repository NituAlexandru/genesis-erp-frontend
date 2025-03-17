"use client";

import { useRouter } from "next/navigation";

export default function NoAccessPage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Acces Interzis</h1>
      <p>Nu aveți permisiunea necesară pentru a accesa această pagină.</p>
      <button onClick={handleRedirect}>Mergi la Dashboard</button>
    </div>
  );
}
