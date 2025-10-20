import { redirect } from "next/navigation";

export default function DashboardPage() {

  // Redirect to analytics page
  redirect("/dashboard/analytics");
}
