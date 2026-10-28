export type ProjectToken = {
  id: string;
  projectId: string;
  prefix: string;
  createdAt: string;
  updatedAt: string;
};

export type IssuedProjectToken = ProjectToken & { token: string };
