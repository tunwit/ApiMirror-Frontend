"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { authClient, useSession } from "./lib/auth";
import styles from "./signin.module.css";

export default function SignInPage() {
  const { data: session, isPending: checkingSession } = useSession();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) window.location.replace("/projects");
  }, [session]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const fields = new FormData(event.currentTarget);
    setError("");
    setSubmitting(true);

    try {
      const result = await authClient.signIn.username({
        username: String(fields.get("username") || "").trim(),
        password: String(fields.get("password") || ""),
      });

      if (result.error) {
        setError(
          result.error.message || "Unable to sign in. Please try again.",
        );
      }
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <h1 id="signin-heading">
          Sign in to ApiMirror
        </h1>

        {checkingSession || session ? (
          <p>{session ? "Opening your dashboard…" : "Checking your session…"}</p>
        ) : (
          <>
            <p>Enter your username and password.</p>
            <form onSubmit={signIn}>
              <label>Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                disabled={submitting}
              />

              <label>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={submitting}
              />

              <button type="submit" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <p className={styles.switchAccount}>
              Don’t have an account? <Link href="/signup">Create account</Link>
            </p>
          </>
        )}

        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
