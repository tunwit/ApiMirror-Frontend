"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "../lib/auth";
import styles from "../signin.module.css";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function signUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const fields = new FormData(event.currentTarget);
    setError("");
    setSubmitting(true);

    try {
      const result = await authClient.signUp.email({
        name: String(fields.get("name") || "").trim(),
        email: String(fields.get("email") || "").trim(),
        username: String(fields.get("username") || "").trim(),
        password: String(fields.get("password") || ""),
      });

      if (result.error) {
        setError(result.error.message || "Unable to create your account. Please try again.");
        setSubmitting(false);
        return;
      }

      // Better Auth signs the new user in automatically.
      window.location.replace("/projects");
    } catch {
      setError("Unable to reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <h1 id="signup-heading">Create an account</h1>
        <p>Get started with ApiMirror.</p>

        <form onSubmit={signUp}>
          <label>Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={submitting}
          />

          <label>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={submitting}
          />

          <label>Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9_.]+"
            title="Use 3–30 letters, numbers, underscores or dots."
            required
            disabled={submitting}
          />

          <label>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            disabled={submitting}
          />
          <p id="password-hint" className={styles.hint}>At least 8 characters.</p>

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.switchAccount}>
          Already have an account? <Link href="/signin">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
