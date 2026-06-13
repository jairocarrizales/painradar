import { redirect } from "next/navigation";

// Local single-user tool: skip the landing, go straight to search.
export default function Home() {
  redirect("/dashboard");
}
