"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../core/api";
import type { CreatedProject, CreateProjectInput, Project, ProjectSettings } from "./type";
import { issuedProjectTokenKey } from "../project-token/hook";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: ({ signal }) => apiRequest<Project[]>("/api/projects", { signal }),
  });
}

export function useProject(projectId?: string) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: ({ signal }) => apiRequest<Project>(`/api/projects/${encodeURIComponent(projectId!)}`, { signal }),
    enabled: Boolean(projectId),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      apiRequest<CreatedProject>("/api/projects", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: ({ token, ...project }) => {
      queryClient.setQueryData(issuedProjectTokenKey(project.id), token);
      queryClient.setQueryData<Project[]>(["projects"], (projects = []) => [
        project,
        ...projects,
      ]);
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useProjectSettings(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId, "settings"],
    queryFn: ({ signal }) => apiRequest<ProjectSettings>(`/api/projects/${encodeURIComponent(projectId)}/settings`, { signal }),
  });
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<CreateProjectInput>) => apiRequest<Project>(`/api/projects/${encodeURIComponent(projectId)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
    onSuccess: (project) => {
      queryClient.setQueryData<Project>(["projects", projectId], (old) => ({ ...old, ...project }));
      queryClient.setQueryData<ProjectSettings>(["projects", projectId, "settings"], (old) => old ? { ...old, project: { ...old.project, ...project } } : old);
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiRequest<void>(`/api/projects/${encodeURIComponent(projectId)}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.setQueryData<Project[]>(["projects"], (old) => old?.filter((project) => project.id !== projectId));
      queryClient.removeQueries({ queryKey: issuedProjectTokenKey(projectId) });
      queryClient.removeQueries({ queryKey: ["projects", projectId] });
      void queryClient.invalidateQueries({ queryKey: ["projects"], exact: true });
    },
  });
}
