import type { ComponentType } from "react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: ComponentType;
  exact?: boolean;
};

function ProjectsIcon() {
  return (
    <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export const navigationItems: NavigationItem[] = [
  { label: "All projects", href: "/projects", icon: ProjectsIcon, exact: true },
];

export type DashboardUser = {
  name: string;
  username?: string | null;
  email: string;
};
