"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../core/api";
import type { ProjectSettings } from "../project/type";
import type { IssuedProjectToken } from "./type";

export const issuedProjectTokenKey = (projectId: string) =>
  ["issued-project-token", projectId] as const;

export function useIssuedProjectToken(projectId: string) {
  return useQuery<string | null>({
    queryKey: issuedProjectTokenKey(projectId),
    queryFn: () => null,
    enabled: false,
  });
}

export function useRegenerateProjectToken(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiRequest<IssuedProjectToken>(
        `/api/projects/${encodeURIComponent(projectId)}/token/regenerate`,
        { method: "POST" },
      ),
    onSuccess: ({ token, ...metadata }) => {
      queryClient.setQueryData(issuedProjectTokenKey(projectId), token);
      queryClient.setQueryData<ProjectSettings>(
        ["projects", projectId, "settings"],
        (old) => (old ? { ...old, token: metadata } : old),
      );
    },
  });
}
