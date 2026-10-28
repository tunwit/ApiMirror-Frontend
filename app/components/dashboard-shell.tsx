"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { authClient } from "../lib/auth";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { navigationItems, type DashboardUser } from "./navigation";

export default function DashboardShell({ user, children }: { user: DashboardUser; children: ReactNode }) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && navigationOpen) {
        setNavigationOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [navigationOpen]);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError("Unable to sign out. Please try again.");
        setSigningOut(false);
        return;
      }
      window.location.replace("/signin");
    } catch {
      setError("Unable to reach the server. Please try again.");
      setSigningOut(false);
    }
  }

  return (
    <div className="grid min-h-svh grid-cols-[204px_minmax(0,1fr)] grid-rows-[64px_minmax(calc(100svh-64px),auto)] bg-white font-[Inter,Arial,sans-serif] text-sm leading-normal text-[#1f1f1f] max-[700px]:grid-cols-[minmax(0,1fr)] [&_*]:box-border [&_button]:font-[inherit] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-3 [&_a:focus-visible]:outline-[#1f1f1f] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-3 [&_button:focus-visible]:outline-[#1f1f1f] [&_summary:focus-visible]:outline-2 [&_summary:focus-visible]:outline-offset-3 [&_summary:focus-visible]:outline-[#1f1f1f]">
      <a className="fixed -top-25 left-5 z-100 rounded-md border border-solid border-[#e2e2df] bg-white px-4 py-2.5 text-inherit no-underline focus:top-3" href="#dashboard-content">Skip to content</a>
      <Navbar user={user} navigationOpen={navigationOpen} onToggleNavigation={() => setNavigationOpen(!navigationOpen)} menuButtonRef={menuButton} signingOut={signingOut} onSignOut={signOut} />
      <Sidebar items={navigationItems} open={navigationOpen} onClose={() => setNavigationOpen(false)} signingOut={signingOut} onSignOut={signOut} />
      <main id="dashboard-content" className="col-start-2 row-start-2 min-w-0 p-10 focus:outline-none max-[700px]:col-start-1 max-[700px]:px-5 max-[700px]:py-6" tabIndex={-1}>
        {error && <p className="m-0 mb-6 text-[#a92d26]">{error}</p>}
        {children}
      </main>
    </div>
  );
}
