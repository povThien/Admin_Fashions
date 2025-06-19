import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to dashboard when accessing root URL
  redirect("/dashboard")
}
