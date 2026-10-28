"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../core/api";
import type { CreateMockRouteInput, MockRoute } from "./type";

export function useMockRoutes(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId, "routes"],
    queryFn: ({ signal }) => apiRequest<MockRoute[]>(`/api/projects/${encodeURIComponent(projectId)}/routes`, { signal }),
  });
}

export function useMockRoute(projectId: string, routeId?: string) {
  return useQuery({
    queryKey: ["projects", projectId, "routes", routeId],
    queryFn: ({ signal }) => apiRequest<MockRoute>(`/api/projects/${encodeURIComponent(projectId)}/routes/${encodeURIComponent(routeId!)}`, { signal }),
    enabled: Boolean(routeId),
  });
}

export function useUpdateMockRoute(projectId: string, routeId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMockRouteInput) => apiRequest<MockRoute>(`/api/projects/${encodeURIComponent(projectId)}/routes/${encodeURIComponent(routeId!)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
    onSuccess: (route) => {
      queryClient.setQueryData(["projects", projectId, "routes", route.id], route);
      queryClient.setQueryData<MockRoute[]>(["projects", projectId, "routes"], (routes) => routes?.map((existing) => existing.id === route.id ? route : existing));
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useCreateMockRoute(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMockRouteInput) => apiRequest<MockRoute>(`/api/projects/${encodeURIComponent(projectId)}/routes`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
    onSuccess: (route) => {
      queryClient.setQueryData<MockRoute[]>(["projects", projectId, "routes"], (routes = []) => [...routes, route]);
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
