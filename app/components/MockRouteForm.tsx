"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type SubmitEventHandler } from "react";
import {
  useCreateMockRoute,
  useUpdateMockRoute,
} from "../../feature/mock-route/hook";
import type { MockRoute } from "../../feature/mock-route/type";
import Modal from "./Modal";
import RouteTestPanel from "./RouteTestPanel";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const inputClass =
  "h-11 w-full rounded-md border border-solid border-[#e2e2df] bg-white px-3 font-[inherit] text-sm text-[#1f1f1f] placeholder:text-[#777773] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1f1f]";

export default function MockRouteForm({ route }: { route?: MockRoute }) {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const createMutation = useCreateMockRoute(projectId);
  const updateMutation = useUpdateMockRoute(projectId, route?.id);
  const saveRoute = route ? updateMutation : createMutation;
  const projectUrl = `/projects/${projectId}`;
  const [paramHelpOpen, setParamHelpOpen] = useState(false);
  const [method, setMethod] = useState<MockRoute["method"]>(
    route?.method ?? "GET",
  );
  const [path, setPath] = useState(route?.path ?? "");
  const [statusCode, setStatusCode] = useState(
    String(route?.statusCode ?? 200),
  );
  const [responseBody, setResponseBody] = useState(
    route
      ? JSON.stringify(route.responseBody, null, 2)
      : '{\n  "message": "Hello, world!"\n}',
  );
  const [formError, setFormError] = useState("");
  const [requiredBody, setRequiredBody] = useState(
    route?.requiredBody.join(", ") ?? "",
  );
  const allowsRequestBody = method !== "GET" && method !== "HEAD";

  const submitHandler: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (saveRoute.isPending) return;
    setFormError("");
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(responseBody);
    } catch {
      setFormError("Enter valid JSON in the response body.");
      return;
    }
    saveRoute.mutate(
      {
        method,
        path: path.trim(),
        statusCode: Number(statusCode),
        responseBody: parsedBody,
        requiredBody: allowsRequestBody
          ? [...new Set(requiredBody.split(",").map((field) => field.trim()).filter(Boolean))]
          : [],
      },
      { onSuccess: () => router.push(projectUrl) },
    );
  };

  return (
    <section className="w-full max-w-300">
      <Link
        href={projectUrl}
        className="text-[13px] text-[#666663] no-underline hover:text-[#1f1f1f]"
      >
        Back to mock routes
      </Link>
      <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="create-route-title"
            className="m-0 text-[32px] leading-10 font-semibold tracking-[-0.7px]"
          >
            {route ? "Edit mock route" : "Create mock route"}
          </h1>
          <p className="m-0 mt-2 text-sm text-[#666663]">
            Choose a request and define the response it should return.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={projectUrl}
            className="inline-flex min-h-10 items-center rounded-md border border-solid border-[#e2e2df] bg-white px-5 py-2 text-[13px] text-[#1f1f1f] no-underline hover:bg-[#f7f7f6]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="create-route-form"
            disabled={saveRoute.isPending}
            className="min-h-10 cursor-pointer rounded-md border-0 bg-[#1f1f1f] px-6 py-2 text-[13px] text-white disabled:cursor-default disabled:opacity-50"
          >
            {saveRoute.isPending
              ? route
                ? "Saving…"
                : "Creating…"
              : route
                ? "Save changes"
                : "Create route"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-6 min-[1100px]:grid-cols-[minmax(0,1.35fr)_minmax(280px,1fr)]">
        <form
          id="create-route-form"
          className="min-w-0"
          onSubmit={submitHandler}
        >
          <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 max-[500px]:grid-cols-1">
            <label className="flex flex-col gap-2 text-[13px]">
              Method
              <select
                name="method"
                value={method}
                onChange={(event) =>
                  setMethod(event.target.value as MockRoute["method"])
                }
                className={inputClass}
              >
                {methods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[13px]">
              Path
              <input
                name="path"
                value={path}
                onChange={(event) => setPath(event.target.value)}
                required
                pattern="/[^\s?#]*"
                placeholder="/users/:id"
                className={inputClass}
              />
            </label>
          </div>
          <p id="route-path-help" className="m-0 mt-2 text-xs text-[#666663]">
            Start with /. Use :id to describe a path parameter.
          </p>

          <label className="mt-6 flex max-w-50 flex-col gap-2 text-[13px]">
            Response status code
            <input
              name="statusCode"
              type="number"
              required
              min={200}
              max={599}
              value={statusCode}
              onChange={(event) => setStatusCode(event.target.value)}
              className={inputClass}
            />
          </label>

          <label
            className="mt-6 mb-2 block text-[13px]"
          >
            Response body
          </label>
          <textarea
            id="response-body"
            name="responseBody"
            rows={10}
            spellCheck={false}
            value={responseBody}
            onChange={(event) => setResponseBody(event.target.value)}
            className="w-full resize-y rounded-md border border-solid border-[#e2e2df] bg-[#fafaf9] p-4 font-mono text-[13px] leading-6 text-[#1f1f1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1f1f]"
          />

          <button
            type="button"
            onClick={() => setParamHelpOpen(true)}
            className="mt-2 decoration-1 underline cursor-pointer rounded border-0 bg-transparent p-0 py-1 text-xs text-[#666663] underline-offset-4 hover:text-[#1f1f1f] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            How to use path parameters
          </button>

          {allowsRequestBody && (
            <>
              <label
                htmlFor="required-body"
                className="mt-6 mb-2 block text-[13px]"
              >
                Required body fields (optional)
              </label>
              <input
                id="required-body"
                name="requiredBody"
                value={requiredBody}
                onChange={(event) => setRequiredBody(event.target.value)}
                aria-describedby="required-body-help"
                placeholder="name, email"
                className={inputClass}
              />
              <p
                id="required-body-help"
                className="m-0 mt-2 text-xs text-[#666663]"
              >
                Separate field names with commas. A missing required field should
                return 400 Bad Request.
              </p>
            </>
          )}

          {(formError || saveRoute.error) && (
            <p className="mt-4 text-sm text-[#a92d26]">
              {formError || saveRoute.error?.message}
            </p>
          )}
        </form>
        {route && (
          <RouteTestPanel
            method={method}
            path={path}
            projectId={projectId}
          />
        )}
      </div>

      <Modal open={paramHelpOpen} onClose={() => setParamHelpOpen(false)}>
        <h2 className="m-0 pr-8 text-xl font-semibold">
          Using path parameters
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#666663]">
          Add a parameter to the path with a colon, such as{" "}
          <code className="text-[#1f1f1f]">/users/:id</code>. Refer to it in
          your JSON response using{" "}
          <code className="text-[#1f1f1f]">{"{{params.id}}"}</code>.
        </p>
        <p className="mt-5 mb-2 text-[13px] font-medium">Example request</p>
        <pre className="m-0 overflow-x-auto rounded-md bg-[#f7f7f6] p-3 text-xs">
          GET /users/:id
        </pre>
        <p className="mt-5 mb-2 text-[13px] font-medium">Response template</p>
        <pre className="m-0 overflow-x-auto rounded-md bg-[#f7f7f6] p-3 text-xs">
          {'{\n  "id": "{{params.id}}",\n  "name": "Alex"\n}'}
        </pre>
        <p className="mt-5 mb-2 text-[13px] font-medium">Expected response</p>
        <pre className="m-0 overflow-x-auto rounded-md bg-[#f7f7f6] p-3 text-xs">
          {'{\n  "id": "123",\n  "name": "Alex"\n}'}
        </pre>
        <p className="mt-4 mb-0 text-xs leading-5 text-[#666663]">
          Use the same parameter name in both places. For <code>:userId</code>,
          use <code>{"{{params.userId}}"}</code>.
        </p>
      </Modal>
    </section>
  );
}
