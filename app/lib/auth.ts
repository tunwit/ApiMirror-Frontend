"use client";

import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { env } from "../../configs/configs";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : env.app.url,
  fetchOptions: { credentials: "include" },
  plugins: [usernameClient()],
});

export const { useSession, signOut } = authClient;
