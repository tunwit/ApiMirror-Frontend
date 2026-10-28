"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import type { DashboardUser } from "./navigation";

type NavbarProps = {
  user: DashboardUser;
  navigationOpen: boolean;
  onToggleNavigation: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  signingOut: boolean;
  onSignOut: () => void;
};

export default function Navbar({ user, navigationOpen, onToggleNavigation, menuButtonRef, signingOut, onSignOut }: NavbarProps) {
  const accountMenu = useRef<HTMLDetailsElement>(null);
  const displayName = user.name.trim() || user.username || "Account";
  const words = displayName.split(/\s+/);
  const initials = (words.length > 1
    ? `${words[0]![0]}${words[words.length - 1]![0]}`
    : displayName.slice(0, 2)
  ).toUpperCase();
  const accountActions = [
    { id: "sign-out", label: signingOut ? "Signing out…" : "Sign out", onClick: onSignOut, disabled: signingOut },
  ];

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && accountMenu.current) accountMenu.current.open = false;
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="sticky top-0 z-30 col-span-full flex h-16 items-center justify-between gap-6 border-0 border-b border-solid border-[#e2e2df] bg-white px-6 max-[700px]:gap-3 max-[700px]:px-4">
      <div className="flex items-center gap-3">
        <button ref={menuButtonRef} className="hidden size-9 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-inherit max-[700px]:inline-flex" type="button" onClick={onToggleNavigation}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d={navigationOpen ? "M6 6l12 12M18 6L6 18" : "M4 6h16M4 12h16M4 18h16"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <Link className="flex items-center gap-2.5 text-base font-semibold tracking-[-0.2px] text-inherit no-underline" href="/projects">
          <svg className="shrink-0" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="3" width="11" height="22" rx="3" fill="currentColor" />
            <rect x="16" y="3" width="10" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>ApiMirror</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs whitespace-nowrap text-[#666663] max-[700px]:hidden">Personal workspace</span>
        <details className="relative" ref={accountMenu} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) event.currentTarget.open = false;
        }}>
          <summary className="flex size-8 cursor-pointer list-none items-center justify-center rounded-full bg-[#f0f0ee] text-xs [&::-webkit-details-marker]:hidden" title={displayName}>{initials}</summary>
          <div className="absolute top-11 right-0 w-60 rounded-lg border border-solid border-[#e2e2df] bg-white p-4">
            <p className="m-0 mb-1 text-[13px] font-semibold wrap-anywhere">{displayName}</p>
            <p className="m-0 mb-3 text-xs text-[#666663] wrap-anywhere">{user.email}</p>
            {accountActions.map((action) => (
              <button key={action.id} className="min-h-9 w-full cursor-pointer rounded-md border-0 bg-[#f7f7f6] px-2.5 py-2 text-left text-inherit enabled:hover:bg-[#f0f0ee] disabled:cursor-default disabled:opacity-60" type="button" disabled={action.disabled} onClick={action.onClick}>{action.label}</button>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
