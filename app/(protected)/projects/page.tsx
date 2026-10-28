"use client";

import { useProjects } from "../../../feature/project/hook";
import { useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const { data: projects = [] } = useProjects();
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();
  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.description ?? ""}`.toLowerCase().includes(term),
  );
  return (
    <section
      className="mx-auto w-full max-w-300"
    >
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="projects-title"
            className="m-0 text-[28px] leading-9 font-semibold tracking-[-0.7px]"
          >
            Your projects
          </h1>
          <p className="m-0 mt-2 text-sm text-[#666663]">
            Create and manage your mock APIs.
          </p>
        </div>
        {projects.length > 0 && (
          <Link
            href="/projects/new"
            className="rounded-lg bg-[#1f1f1f] px-4 py-2 text-sm text-white no-underline"
          >
            New project
          </Link>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <label className="relative block w-full max-w-80">
          <span className="sr-only">Search projects</span>
          <svg
            className="pointer-events-none absolute top-2.5 left-3 text-[#666663]"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="10.5"
              cy="10.5"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="m16 16 4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects…"
            className="min-h-10 w-full rounded-md border border-solid border-[#d5d5d1] bg-white py-2 pr-3 pl-10 font-[inherit] text-[13px] text-[#1f1f1f] placeholder:text-[#777773] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1f1f]"
          />
        </label>
        <span className="text-xs text-[#666663]">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="m-0 rounded-lg  px-6 py-16 text-center text-sm text-[#666663]">
          {projects.length === 0 ? (
            <div>
              <p className="font-bold text-black text-2xl">
                Give your API a home
              </p>
              <p>Create a project, add a mock route, and start testing.</p>
              <Link
                href="/projects/new"
                className="inline-block rounded-lg bg-black px-10 py-3 text-white no-underline"
              >
                Create your project
              </Link>
            </div>
          ) : (
            "No matching projects."
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead className="bg-[#f7f7f6] text-xs text-[#666663]">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Project
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Routes
                </th>
                <th scope="col" className=" px-5 py-3 font-medium">
                  Last updated
                </th>
                <th scope="col" className=" px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-0 border-b border-solid border-[#e2e2df] hover:bg-[#fafaf9]"
                >
                  <td className="min-w-48 px-5 py-5">
                    <span className="text-sm font-bold">{project.name}</span>
                    <p className="m-0 mt-1 line-clamp-2 max-w-130 text-xs text-[#666663] wrap-anywhere">
                      {project.description || "No description"}
                    </p>
                  </td>
                  <td className="px-5 py-5">{project.routeCount ?? 0} routes</td>
                  <td className="px-5 py-5 whitespace-nowrap text-[#666663]">
                    <time dateTime={project.updatedAt}>
                      {new Date(project.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </td>
                  <td className="px-5 py-5">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-black decoration-0 underline-none"
                    >
                      <p>Open project</p>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
