import { redirect } from "next/navigation";

export default function HomePage() {
  // De fiecare dată când cineva accesează "/", îl redirecționezi la "/auth/login"
  redirect("/auth/login");
}
