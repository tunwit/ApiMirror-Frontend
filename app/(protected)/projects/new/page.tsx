"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateProject } from "../../../../feature/project/hook";
import { SubmitEventHandler } from "react";

export default function CreateProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  const submitHandler: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (createProject.isPending) return;

    const form = new FormData(event.currentTarget);
    createProject.mutate(
      {
        name: String(form.get("name") ?? "").trim(),
        description: String(form.get("description") ?? "").trim() || null,
      },
      { onSuccess: () => router.push("/projects") },
    );
  };

  return (
    <section
      className="w-full max-w-150"
    >
      <Link
        href="/projects"
        className="text-[13px] text-[#666663] no-underline hover:text-[#1f1f1f]"
      >
        Back to projects
      </Link>

      <h1
        id="create-project-title"
        className="m-0 mt-7 text-[32px] leading-10 font-semibold tracking-[-0.7px]"
      >
        Create a project
      </h1>
      <p className="m-0 mt-2 text-sm text-[#666663]">
        Group related mock routes in one place.
      </p>

      <form className="mt-8" onSubmit={submitHandler}>
        <fieldset
          disabled={createProject.isPending}
          className="m-0 min-w-0 border-0 p-0"
        >
          <label className="mb-2 block text-[13px]">
            Project name
          </label>
          <input
            id="project-name"
            name="name"
            required
            pattern=".*\S.*"
            maxLength={100}
            placeholder="Commerce API"
            className="h-11 w-full rounded-md border border-solid border-[#e2e2df] bg-white px-3 font-[inherit] text-sm placeholder:text-[#777773] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1f1f]"
          />

          <label
            className="mt-6 mb-2 block text-[13px]"
          >
            Description (optional)
          </label>
          <input
            id="project-description"
            name="description"
            maxLength={2000}
            placeholder="Orders, products, and customers"
            className="h-11 w-full rounded-md border border-solid border-[#e2e2df] bg-white px-3 font-[inherit] text-sm placeholder:text-[#777773] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1f1f]"
          />

          <div className="mt-6 rounded-lg bg-[#f7f7f6] p-4">
            <p className="m-0 text-[13px]">A separate space for every API</p>
            <p className="m-0 mt-2 text-xs text-[#666663]">
              Keep related mock routes together in one project.
            </p>
          </div>

          {createProject.error && (
            <p className="mt-4 text-sm text-[#a92d26]">
              {createProject.error.message}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="min-h-10 cursor-pointer rounded-md border-0 bg-[#1f1f1f] px-8 py-2 text-[13px] text-white hover:bg-[#333] disabled:cursor-default disabled:opacity-50"
            >
              {createProject.isPending ? "Creating…" : "Create project"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/projects")}
              className="min-h-10 cursor-pointer rounded-md border border-solid border-[#e2e2df] bg-white px-6 py-2 text-[13px] text-[#1f1f1f] hover:bg-[#f7f7f6] disabled:cursor-default disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
