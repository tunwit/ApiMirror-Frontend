import type { ProjectToken } from "../project-token/type";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  routeCount?: number;
};

export type CreateProjectInput = {
  name: string;
  description?: string | null;
};

export type ProjectSettings = {
  project: Project;
  baseUrl: string;
  token: ProjectToken | null;
};

export type CreatedProject = Project & { token: string };

