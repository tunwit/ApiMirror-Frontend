import "server-only";
import { headers } from "next/headers";
import { createAuthClient } from "better-auth/client";
import { usernameClient } from "better-auth/client/plugins";

const authServer = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  plugins: [usernameClient()],
});

export async function getSession(requestHeaders?: Pick<Headers, "get">) {
  const incomingHeaders = requestHeaders ?? await headers();
  const { data, error } = await authServer.getSession({
    fetchOptions: {
      headers: {
        cookie: incomingHeaders.get("cookie") || "",
      },
      cache: "no-store",
    },
  });

  if (error) throw new Error("Unable to check session.");
  return data;
}
