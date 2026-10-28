"use client";

import { useState } from "react";

type RouteTestPanelProps = {
  method: string;
  path: string;
  statusCode: string;
  responseBody: string;
};

export default function RouteTestPanel({
  method,
  path,
  statusCode,
  responseBody,
}: RouteTestPanelProps) {
  const [tab, setTab] = useState<"request" | "curl">("request");
  const [requestBody, setRequestBody] = useState(
    '{\n  "name": "Alex Morgan",\n  "email": "alex@example.com"\n}',
  );
  const routePath = path || "/users/:id";
  const quote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;
  const curl = [
    `curl -X ${method} ${quote(`<BASE_URL>${routePath}`)}`,
    `  -H 'Authorization: Bearer <PROJECT_TOKEN>'`,
    ...(method !== "GET" && method !== "HEAD"
      ? [
          `  -H 'Content-Type: application/json'`,
          `  --data ${quote(requestBody)}`,
        ]
      : []),
  ].join(" \\\n");

  return (
    <aside
      className="min-w-0 self-start rounded-lg bg-[#f7f7f6] p-5 min-[1100px]:sticky min-[1100px]:top-22"
    >
      <div
        className="mb-5 flex gap-5 border-0 border-b border-solid border-[#e2e2df]"
      >
        <button
          id="test-request-tab"
          type="button"
          onClick={() => setTab("request")}
          className={`cursor-pointer border-0 border-b-2 border-solid bg-transparent px-0 pt-0 pb-3 text-xs ${tab === "request" ? "border-[#1f1f1f] text-[#1f1f1f]" : "border-transparent text-[#666663]"}`}
        >
          Test request
        </button>
        <button
          id="curl-example-tab"
          type="button"
          onClick={() => setTab("curl")}
          className={`cursor-pointer border-0 border-b-2 border-solid bg-transparent px-0 pt-0 pb-3 text-xs ${tab === "curl" ? "border-[#1f1f1f] text-[#1f1f1f]" : "border-transparent text-[#666663]"}`}
        >
          cURL example
        </button>
      </div>

      {tab === "request" ? (
        <div
          id="test-request-panel"
        >
          <label className="mb-4 block text-xs">
            Request body
          </label>
          <div className="mb-2 flex items-center justify-between gap-3 text-[11px] text-[#666663]">
            <span className="break-all font-mono">
              {method} {routePath}
            </span>
            <span>JSON</span>
          </div>
          <textarea
            id="test-request-body"
            value={requestBody}
            onChange={(event) => setRequestBody(event.target.value)}
            rows={6}
            spellCheck={false}
            className="w-full resize-y rounded-md border border-[#d8d8d8] bg-[#f1f1f1] p-2 font-mono text-xs leading-6 text-[#1f1f1f]"
          />
          <button
            type="button"
            disabled
            className="mt-3 min-h-10 w-full cursor-not-allowed rounded-md border-0 bg-[#1f1f1f] px-3 py-2 text-xs text-white"
          >
            Send test request
          </button>
          <p
            id="test-preview-note"
            className="mt-2 mb-5 text-[11px] text-[#666663]"
          >
            Preview only. No request is sent.
          </p>
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded bg-[#e9f3ec] px-2 py-1 text-[#286344]">
              {statusCode || "200"}
            </span>
            <span className="text-[#666663]">Configured response</span>
          </div>
          <div className="mb-2 flex items-center justify-between text-[11px] text-[#666663]">
            <span>Response</span>
            <span>JSON</span>
          </div>
          <pre className="m-0 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 wrap-anywhere">
            {responseBody || "{}"}
          </pre>
        </div>
      ) : (
        <div
          id="curl-example-panel"
        >
          <p className="mt-0 mb-4 text-xs leading-5 text-[#666663]">
            Replace the base URL, token, and any path parameters before using
            this example.
          </p>
          <pre className="m-0 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 wrap-anywhere">
            {curl}
          </pre>
        </div>
      )}
    </aside>
  );
}
