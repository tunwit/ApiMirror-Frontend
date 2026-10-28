"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useDeleteProject,
  useProjectSettings,
  useUpdateProject,
} from "../../../../../feature/project/hook";
import {
  useIssuedProjectToken,
  useRegenerateProjectToken,
} from "../../../../../feature/project-token/hook";
import Modal from "../../../../components/Modal";

const inputClass =
  "h-11 w-full rounded-md border border-solid border-[#e2e2df] bg-white px-3 font-[inherit] text-[13px] text-[#1f1f1f]";
const buttonClass =
  "inline-flex min-h-10 cursor-pointer items-center justify-center rounded-md border border-solid border-[#e2e2df] bg-white px-5 py-2 text-xs text-[#1f1f1f] hover:bg-[#f7f7f6] disabled:cursor-default disabled:opacity-50";

export default function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const { data: settings, error } = useProjectSettings(projectId);
  const { data: token } = useIssuedProjectToken(projectId);
  const updateProject = useUpdateProject(projectId);
  const regenerateToken = useRegenerateProjectToken(projectId);
  const deleteProject = useDeleteProject(projectId);
  const [notice, setNotice] = useState("");
  const [copyError, setCopyError] = useState("");
  const [confirmation, setConfirmation] = useState<
    "regenerate" | "delete" | null
  >(null);
  const busy = regenerateToken.isPending || deleteProject.isPending;
  async function copy(value: string, message: string) {
    setCopyError("");
    try {
      await navigator.clipboard.writeText(value);
      setNotice(message);
    } catch {
      setCopyError(
        "Unable to copy. Please select and copy the value manually.",
      );
    }
  }

  if (!settings)
    return (
      <p className="text-sm text-[#666663]">
        {error?.message || "Loading settings…"}
      </p>
    );

  const { project, baseUrl } = settings;
  const example = [
    `BASE="${baseUrl}"`,
    'TOKEN="<project-token>"',
    "",
    'curl -X POST "$BASE/users" \\',
    '  -H "Authorization: Bearer $TOKEN" \\',
    '  -H "Content-Type: application/json" \\',
    '  -d \'{"name":"Alex","email":"alex@example.com"}\'',
  ].join("\n");
  const actionError =
    updateProject.error || regenerateToken.error || deleteProject.error;

  function confirmHandler() {
    if (busy) return;
    if (confirmation === "delete") {
      deleteProject.mutate(undefined, {
        onSuccess: () => router.replace("/projects"),
      });
    } else if (confirmation === "regenerate") {
      regenerateToken.mutate(undefined, {
        onSuccess: () => {
          setConfirmation(null);
          setNotice("Token regenerated. Copy and save it now.");
        },
      });
    }
  }

  return (
    <section className="w-full max-w-300">
      <h1 className="m-0 text-[28px] leading-9 font-semibold tracking-[-0.7px]">
        Project settings
      </h1>
      <p className="m-0 mt-2 text-sm text-[#666663]">
        Connection details and access for {project.name}.
      </p>
      {notice && <p className="mt-4 text-xs text-[#666663]">{notice}</p>}
      {(actionError || copyError) && (
        <p className="mt-4 text-sm text-[#a92d26]">
          {copyError || actionError?.message}
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 items-start gap-9 min-[1100px]:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
        <div className="min-w-0">
          <form
            className="border-0 border-b border-solid border-[#e2e2df] pb-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (updateProject.isPending) return;
              const form = new FormData(event.currentTarget);
              setNotice("");
              updateProject.mutate(
                { name: String(form.get("name") ?? "").trim() },
                {
                  onSuccess: () => setNotice("Project updated."),
                },
              );
            }}
          >
            <h2 className="m-0 mb-4 text-sm font-medium">Project details</h2>
            <label className="mb-2 block text-xs">Project name</label>
            <input
              key={`${project.id}:${project.name}`}
              name="name"
              defaultValue={project.name}
              required
              pattern=".*\S.*"
              maxLength={100}
              disabled={updateProject.isPending}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={updateProject.isPending}
              className={`${buttonClass} mt-3`}
            >
              {updateProject.isPending ? "Saving…" : "Save changes"}
            </button>
          </form>

          <section className="border-0 border-b border-solid border-[#e2e2df] py-5">
            <h2 className="m-0 mb-3 text-sm font-medium">API access</h2>
            <label className="mb-2 block text-xs">Mock API base URL</label>
            <input
              readOnly
              value={baseUrl}
              className={`${inputClass} font-mono text-xs`}
            />
            <button
              type="button"
              onClick={() => void copy(baseUrl, "Base URL copied.")}
              className={`${buttonClass} mt-2`}
            >
              Copy base URL
            </button>

            <label className="mt-4 mb-2 block text-xs">Project token</label>
            <input
              readOnly
              value={
                token
                  ? token
                  : settings.token
                    ? `${settings.token.prefix}••••••••••••••••`
                    : "No token generated"
              }
              className={`${inputClass} font-mono text-xs`}
            />
            {token && (
              <p className="text-xs my-2 text-red-900">
                This token will not revealed again make sure to copy it
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!token || busy}
                onClick={() => {
                  if (token) void copy(token, "Token copied.");
                }}
                className={buttonClass}
              >
                Copy token
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  regenerateToken.reset();
                  setConfirmation("regenerate");
                }}
                className="min-h-10 cursor-pointer border-0 bg-transparent px-3 py-2 text-xs text-[#1f1f1f] disabled:cursor-default disabled:opacity-50"
              >
                {settings.token ? "Regenerate token" : "Generate token"}
              </button>
            </div>
            <p className="m-0 mt-3 text-[11px] text-[#666663]">
              Send the token as Authorization: Bearer &lt;project-token&gt;.
            </p>
            <p className="m-0 mt-2 text-[11px] leading-4 text-[#666663]">
              {token
                ? "Copy and save this token. The full value is available only in this session."
                : "Only the token prefix is stored for display. Regenerate it if you need a new full token."}
            </p>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div>
              <h2 className="m-0 text-xs font-normal">Delete this project</h2>
              <p className="m-0 mt-2 text-[11px] text-[#666663]">
                Permanently removes all routes and the token.
              </p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                deleteProject.reset();
                setConfirmation("delete");
              }}
              className={buttonClass}
            >
              Delete project
            </button>
          </section>
        </div>

        <aside className="min-w-0 rounded-xl bg-[#f7f7f6] p-6">
          <h2 className="m-0 text-sm font-medium">Make your first request</h2>
          <p className="mt-4 mb-4 text-xs leading-5 text-[#666663]">
            Use the base URL with any route in this project.
          </p>
          <div className="rounded-md bg-[#1f1f1f] p-4 text-white">
            <p className="m-0 mb-4 text-[11px]">cURL</p>
            <pre className="m-0 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-5 wrap-anywhere">
              {example}
            </pre>
          </div>
          <button
            type="button"
            onClick={() =>
              void copy(
                token ? example.replace("<project-token>", token) : example,
                "Example copied.",
              )
            }
            className={`${buttonClass} mt-4`}
          >
            Copy example
          </button>
          <p className="mt-3 mb-7 text-[11px] leading-4 text-[#666663]">
            Replace /users with a route in this project. Add your saved token if
            one is not available here.
          </p>
          <h3 className="m-0 text-xs font-normal">Keep the token private</h3>
          <p className="mt-2 mb-0 text-[11px] leading-4 text-[#666663]">
            Regenerating it immediately invalidates the old token.
          </p>
        </aside>
      </div>

      <Modal
        open={confirmation !== null}
        onClose={() => {
          if (!busy) setConfirmation(null);
        }}
      >
        <h2 className="m-0 pr-8 text-xl font-semibold">
          {confirmation === "delete" ? "Delete project?" : "Regenerate token?"}
        </h2>
        <p className="mt-4 mb-6 text-sm leading-6 text-[#666663]">
          {confirmation === "delete"
            ? `This permanently deletes ${project.name}, its routes, and its token.`
            : "The current token will stop working. Copy and save the new token after regeneration."}
        </p>
        {(deleteProject.error || regenerateToken.error) && (
          <p className="text-sm text-[#a92d26]">
            {deleteProject.error?.message || regenerateToken.error?.message}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirmation(null)}
            className={buttonClass}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={confirmHandler}
            className="min-h-10 cursor-pointer rounded-md border-0 bg-[#1f1f1f] px-5 py-2 text-xs text-white disabled:cursor-default disabled:opacity-50"
          >
            {busy
              ? "Please wait…"
              : confirmation === "delete"
                ? "Delete project"
                : "Regenerate token"}
          </button>
        </div>
      </Modal>
    </section>
  );
}
