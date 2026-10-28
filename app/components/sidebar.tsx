"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useProject } from "../../feature/project/hook";
import type { NavigationItem } from "./navigation";

type SidebarProps = {
  items: NavigationItem[];
  open: boolean;
  onClose: () => void;
  signingOut: boolean;
  onSignOut: () => void;
};

export default function Sidebar({
  items,
  open,
  onClose,
  signingOut,
  onSignOut,
}: SidebarProps) {
  const pathname = usePathname();
  const { projectId } = useParams<{ projectId?: string }>();
  const { data: project } = useProject(projectId);
  const projectItems = projectId
    ? [
        { label: "Mock routes", href: `/projects/${projectId}`, iconPath: "M6 4v16M3 7h6M3 17h6M18 4v16M15 7h6M15 17h6M6 12h12" },
        { label: "Settings", href: `/projects/${projectId}/settings`, iconPath: "M4 7h16M4 17h16M8 4v6M16 14v6" },
      ]
    : [];

  return (
    <>
      {open && (
        <button
          className="fixed inset-x-0 top-16 bottom-0 z-35 hidden cursor-pointer border-0 bg-[#1f1f1f]/16 max-[700px]:block"
          type="button"
          onClick={onClose}
        />
      )}
      <aside
        id="workspace-sidebar"
        className={`sticky top-16 col-start-1 row-start-2 flex h-[calc(100svh-64px)] w-51 flex-col self-start bg-[#f7f7f6] p-5 max-[700px]:fixed max-[700px]:bottom-0 max-[700px]:left-0 max-[700px]:z-40 max-[700px]:w-60 ${open ? "max-[700px]:visible max-[700px]:translate-x-0" : "max-[700px]:invisible max-[700px]:-translate-x-full"}`}
      >
        <nav>
          <p className="m-0 mb-3 text-xs leading-[18px] text-[#666663]">
            Workspace
          </p>
          {items.map(({ label, href, icon: Icon, exact }) => {
            const active =
              pathname === href || (!exact && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-10 items-center gap-2.5 rounded-md p-2.5 text-[13px] leading-5 font-medium no-underline hover:bg-[#f0f0ee] hover:text-[#1f1f1f] ${active ? "bg-[#f0f0ee] text-[#1f1f1f]" : "text-[#666663]"}`}
                onClick={onClose}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            );
          })}
          {project && (
            <div className="mt-8">
              <p className="m-0 mb-2 text-xs font-medium wrap-anywhere">
                {project.name}
              </p>
              {projectItems.map(({ label, href, iconPath }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex min-h-10 items-center gap-2.5 rounded-md p-2.5 text-[13px] font-medium no-underline hover:bg-[#f0f0ee] ${pathname === href ? "bg-[#f0f0ee] text-[#1f1f1f]" : "text-[#666663]"}`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d={iconPath}
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  {label}
                </Link>
              ))}
            </div>
          )}
        </nav>
        <button
          className="mt-auto min-h-9 cursor-pointer self-start border-0 bg-transparent px-0 py-2 text-xs text-[#666663] underline-offset-3 enabled:hover:text-[#1f1f1f] enabled:hover:underline disabled:cursor-default disabled:opacity-60"
          type="button"
          disabled={signingOut}
          onClick={onSignOut}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </aside>
    </>
  );
}
