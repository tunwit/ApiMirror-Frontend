export type MockRoute = {
  id: string;
  projectId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  path: string;
  statusCode: number;
  responseBody: unknown;
  requiredBody: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateMockRouteInput = Pick<MockRoute, "method" | "path" | "statusCode" | "responseBody" | "requiredBody">;
