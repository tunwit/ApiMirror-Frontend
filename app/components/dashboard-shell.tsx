"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { authClient } from "../lib/auth";
import styles from "./dashboard-shell.module.css";

type DashboardUser = {
  name: string;
  username?: string | null;
  email: string;
};

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const accountMenu = useRef<HTMLDetailsElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const displayName = user.name.trim() || user.username || "Account";
  const words = displayName.split(/\s+/);
  const initials = (words.length > 1
    ? `${words[0]![0]}${words[words.length - 1]![0]}`
    : displayName.slice(0, 2)
  ).toUpperCase();

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (accountMenu.current) accountMenu.current.open = false;
      if (navigationOpen) {
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
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#dashboard-content">Skip to content</a>

      <header className={styles.topbar}>
        <div className={styles.topbarStart}>
          <button
            ref={menuButton}
            className={styles.navigationToggle}
            type="button"
            aria-label={navigationOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={navigationOpen}
            aria-controls="workspace-sidebar"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d={navigationOpen ? "M6 6l12 12M18 6L6 18" : "M4 6h16M4 12h16M4 18h16"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <Link className={styles.brand} href="/dashboard" aria-label="ApiMirror dashboard">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="11" height="22" rx="3" fill="currentColor" />
              <rect x="16" y="3" width="10" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>ApiMirror</span>
          </Link>
        </div>

        <div className={styles.account}>
          <span className={styles.workspaceName}>Personal workspace</span>
          <details
            className={styles.accountDetails}
            ref={accountMenu}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                event.currentTarget.open = false;
              }
            }}
          >
            <summary className={styles.avatar} aria-label={`Account: ${displayName}`} title={displayName}>
              {initials}
            </summary>
            <div className={styles.accountPopover}>
              <p className={styles.accountName}>{displayName}</p>
              <p className={styles.accountEmail}>{user.email}</p>
              <button className={styles.accountSignOut} type="button" disabled={signingOut} onClick={signOut}>
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </details>
        </div>
      </header>

      {navigationOpen && (
        <button className={styles.backdrop} type="button" aria-label="Close navigation" onClick={() => setNavigationOpen(false)} />
      )}

      <aside id="workspace-sidebar" className={`${styles.sidebar} ${navigationOpen ? styles.sidebarOpen : ""}`}>
        <nav aria-label="Workspace navigation">
          <p className={styles.navigationLabel}>Workspace</p>
          <Link
            href="/dashboard"
            className={`${styles.navigationLink} ${pathname.startsWith("/dashboard") ? styles.activeLink : ""}`}
            aria-current={pathname === "/dashboard" ? "page" : undefined}
            onClick={() => setNavigationOpen(false)}
          >
            <GridIcon />
            <span>All projects</span>
          </Link>
        </nav>

        <button className={styles.sidebarSignOut} type="button" disabled={signingOut} onClick={signOut}>
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </aside>

      <main id="dashboard-content" className={styles.main} tabIndex={-1}>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {children}
      </main>
    </div>
  );
}
