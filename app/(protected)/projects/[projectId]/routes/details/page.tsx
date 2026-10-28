"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useMockRoute } from "../../../../../../feature/mock-route/hook";
import MockRouteForm from "../../../../../components/MockRouteForm";

function RouteDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const routeId = useSearchParams().get("routeId") || undefined;
  const { data: route, isPending } = useMockRoute(projectId, routeId);

  if (!routeId) return <MockRouteForm key="new" />;
  if (isPending)
    return <p className="text-sm text-[#666663]">Loading route…</p>;
  if (!route)
    return <p className="text-sm text-[#666663]">Unable to load route.</p>;

  return <MockRouteForm key={route.id} route={route} />;
}

export default function RouteDetailsPage() {
  return (
    <Suspense>
      <RouteDetails />
    </Suspense>
  );
}
