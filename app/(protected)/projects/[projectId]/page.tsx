"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useMockRoutes } from "../../../../feature/mock-route/hook";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const statusLabels: Record<number, string> = {
  200: "OK", 201: "Created", 202: "Accepted", 204: "No Content",
  400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found",
  409: "Conflict", 422: "Unprocessable Content", 500: "Internal Server Error",
};

export default function ProjectRoutesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: routes = [] } = useMockRoutes(projectId);
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");
  const term = search.trim().toLowerCase();
  const filteredRoutes = routes.filter((route) =>
    (!method || route.method === method) && `${route.method} ${route.path}`.toLowerCase().includes(term),
  );

  return (
    <section className="mx-auto w-full max-w-300">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 id="routes-title" className="m-0 text-[28px] leading-9 font-semibold tracking-[-0.7px]">Mock routes</h1>
          <p className="m-0 mt-2 text-sm text-[#666663]">Define the responses your frontend needs.</p>
        </div>
        <Link href={`/projects/${projectId}/routes/details`} className="inline-flex min-h-10 items-center rounded-md bg-[#1f1f1f] px-5 py-2 text-[13px] text-white no-underline hover:bg-[#333]">
          Create route
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="relative block w-full max-w-88">
          <span className="sr-only">Search routes</span>
          <svg className="pointer-events-none absolute top-3 left-3 text-[#666663]" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by path or method…" className="h-10 w-full rounded-md border border-solid border-[#e2e2df] bg-white pr-3 pl-10 font-[inherit] text-[13px] placeholder:text-[#777773] focus-visible:outline-2 focus-visible:outline-offset-2" />
        </label>
        <label>
          <span className="sr-only">Filter by method</span>
          <select value={method} onChange={(event) => setMethod(event.target.value)} className="h-10 rounded-md border border-solid border-[#e2e2df] bg-white px-3 font-[inherit] text-[13px] text-[#1f1f1f] focus-visible:outline-2 focus-visible:outline-offset-2">
            <option value="">All methods</option>
            {methods.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <span className="text-xs text-[#666663]">{routes.length} {routes.length === 1 ? "route" : "routes"}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="bg-[#f7f7f6] text-[11px] text-[#666663]">
            <tr>
              {["METHOD", "PATH", "RESPONSE", "REQUIRED BODY"].map((heading) => <th key={heading} scope="col" className="px-4 py-3 font-normal">{heading}</th>)}
              <th scope="col" className="px-4 py-3 font-normal"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route) => (
              <tr key={route.id} className="border-0 border-b border-solid border-[#e2e2df] hover:bg-[#fafaf9]">
                <td className="w-24 px-4 py-4"><span className="inline-block rounded bg-[#f0f0ee] px-2 py-1 font-mono text-[11px]">{route.method}</span></td>
                <td className="min-w-48 px-4 py-4 font-mono text-xs">{route.path}</td>
                <td className="w-40 px-4 py-4 whitespace-nowrap">{route.statusCode} {statusLabels[route.statusCode] ?? ""}</td>
                <td className="px-4 py-4 text-xs text-[#666663]">{route.requiredBody.join(", ") || "None"}</td>
                <td className="px-4 py-4 text-right"><Link href={`/projects/${projectId}/routes/details?routeId=${route.id}`} className="text-xs text-[#1f1f1f] no-underline hover:underline">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRoutes.length === 0 && <p className="py-8 text-center text-sm text-[#666663]">{routes.length === 0 ? "No routes yet." : "No matching routes."}</p>}
      </div>
    </section>
  );
}
