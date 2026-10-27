import type { ReactNode } from "react";
import { getSession } from "../lib/auth-server";
import { redirect } from "next/navigation";
import DashboardShell from "../components/dashboard-shell";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/signin");
  return (
    <DashboardShell user={{
      name: session.user.name,
      username: session.user.username,
      email: session.user.email,
    }}>
      {children}
    </DashboardShell>
  );
}
