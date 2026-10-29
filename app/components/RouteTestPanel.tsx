"use client";

import { useState } from "react";
import { useProjectSettings } from "../../feature/project/hook";

type RouteTestPanelProps = {
  method: string;
  path: string;
  projectId: string;
};

export default function RouteTestPanel({
  method,
  path,
  projectId,
}: RouteTestPanelProps) {
  const settings = useProjectSettings(projectId);
  const [tab, setTab] = useState<"request" | "curl">("request");
  const [language, setLanguage] = useState<"node" | "python">("node");
  const [copying, setCopying] = useState(false);
  const [copyResult, setCopyResult] = useState<{ code: string; success: boolean } | null>(null);
  const [requestBody, setRequestBody] = useState(
    '{\n  "name": "Alex Morgan",\n  "email": "alex@example.com"\n}',
  );
  const [pythonBody, setPythonBody] = useState(
    '{\n  "name": "Alex Morgan",\n  "email": "alex@example.com"\n}',
  );
  const routePath = path || "/users/:id";
  const hasBody = method !== "GET" && method !== "HEAD";
  const requestUrl = `${settings.data?.baseUrl.replace(/\/+$/, "") ?? ""}${routePath.startsWith("/") ? routePath : `/${routePath}`}`;
  const url = JSON.stringify(requestUrl);
  const prefix = language === "python"
    ? `import requests\n\n${hasBody ? "body = (\n" : ""}`
    : hasBody ? "const body = (\n" : "";
  const suffix = language === "python"
    ? [
        ...(hasBody ? [")", ""] : []),
        "response = requests.request(",
        `    ${JSON.stringify(method)}, ${url},`,
        '    headers={"Authorization": "Bearer <PROJECT_TOKEN>"},',
        ...(hasBody ? ["    json=body,"] : []),
        "    timeout=30,", ")",
      ].join("\n")
    : [
        ...(hasBody ? [");", ""] : []),
        `const response = await fetch(${url}, {`,
        `  method: ${JSON.stringify(method)},`,
        "  headers: {",
        '    Authorization: "Bearer <PROJECT_TOKEN>",',
        ...(hasBody ? ['    "Content-Type": "application/json",'] : []),
        "  },",
        ...(hasBody ? ["  body: JSON.stringify(body),"] : []),
        "});",
      ].join("\n");
  const quote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;
  const curl = [
    `curl -X ${method} ${quote(requestUrl)}`,
    `  -H 'Authorization: Bearer <PROJECT_TOKEN>'`,
    ...(method !== "GET" && method !== "HEAD"
      ? [
          `  -H 'Content-Type: application/json'`,
          `  --data ${quote(requestBody)}`,
        ]
      : []),
  ].join(" \\\n");
  const code = prefix + (hasBody ? `${language === "python" ? pythonBody : requestBody}\n` : "") + suffix;
  const currentCopyResult = copyResult?.code === code ? copyResult : null;

  async function copyCode() {
    setCopying(true);
    setCopyResult(null);
    try {
      await navigator.clipboard.writeText(code);
      setCopyResult({ code, success: true });
    } catch {
      setCopyResult({ code, success: false });
    } finally {
      setCopying(false);
    }
  }

  if (!settings.data) {
    return (
      <aside className="min-w-0 self-start rounded-lg bg-[#f7f7f6] p-5">
        <p role="status" className="m-0 text-xs leading-5 text-[#666663]">
          {settings.isError ? "Couldn’t load the project’s mock URL." : "Loading request example…"}
        </p>
        {settings.isError && (
          <button type="button" onClick={() => void settings.refetch()} disabled={settings.isFetching}
            className="mt-3 min-h-10 rounded-md border border-solid border-[#d8d8d8] bg-white px-3 text-xs disabled:opacity-50">
            {settings.isFetching ? "Retrying…" : "Retry"}
          </button>
        )}
      </aside>
    );
  }

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
          <label className="mb-4 flex items-center justify-between gap-3 text-xs">
            Language
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as "node" | "python")}
              className="min-h-10 rounded-md border border-solid border-[#d8d8d8] bg-white px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <option value="node">Node.js</option>
              <option value="python">Python</option>
            </select>
          </label>
          <p className="mt-0 mb-4 text-xs leading-5 text-[#666663]">
            Replace &lt;PROJECT_TOKEN&gt; and any :path parameters before running.
            {language === "python" ? " Install requests with pip install requests." : " Run with Node.js 18+ in a .mjs file."}
          </p>
          <div className="mb-2 flex items-center justify-between gap-3 text-[11px] text-[#666663]">
            <span className="break-all font-mono">
              {method} {routePath}
            </span>
            <span>{hasBody ? "Only body is editable" : "Read only"}</span>
          </div>
          <div className="rounded-md bg-[#f1f1f1] p-3 font-mono text-xs leading-6">
            {prefix && <pre className="m-0 whitespace-pre-wrap wrap-anywhere"><code>{prefix}</code></pre>}
            {hasBody && (
              <textarea
                id="test-request-body"
                aria-label={language === "python" ? "Python request body" : "Node.js request body"}
                aria-describedby="body-edit-help"
                value={language === "python" ? pythonBody : requestBody}
                onChange={(event) => language === "python" ? setPythonBody(event.target.value) : setRequestBody(event.target.value)}
                rows={Math.min(12, Math.max(4, (language === "python" ? pythonBody : requestBody).split("\n").length))}
                spellCheck={false}
                className="block w-full resize-y rounded border border-solid border-[#d8d8d8] bg-white px-2 py-1 font-mono text-xs leading-6 text-[#1f1f1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1f1f]"
              />
            )}
            <pre className="m-0 whitespace-pre-wrap wrap-anywhere"><code>{suffix}</code></pre>
          </div>
          <p id="body-edit-help" className="mt-2 mb-0 text-[11px] leading-5 text-[#666663]">
            {hasBody
              ? language === "python"
                ? "Edit the Python body above (True, False, None). Each language keeps its own body edits."
                : "Edit the JavaScript body above (true, false, null). Each language keeps its own body edits."
              : `${method} requests don’t include a body.`}
          </p>
          <button
            type="button"
            onClick={copyCode}
            disabled={copying}
            className="mt-3 min-h-10 w-full cursor-pointer rounded-md border-0 bg-[#1f1f1f] px-3 py-2 text-xs text-white hover:bg-[#383835] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1f1f] disabled:cursor-wait disabled:opacity-50"
          >
            {copying ? "Copying…" : currentCopyResult?.success ? "Copied!" : "Copy code"}
          </button>
          <p
            id="test-preview-note"
            role="status"
            className={`mt-2 mb-5 text-[11px] ${currentCopyResult?.success === false ? "text-[#a92d26]" : "text-[#666663]"}`}
          >
            {currentCopyResult?.success === false
              ? "Couldn’t copy. Allow clipboard access and try again."
              : currentCopyResult?.success
                ? "Code copied to clipboard."
                : "Copies the full example, including your body edits. No request is sent."}
          </p>
        </div>
      ) : (
        <div
          id="curl-example-panel"
        >
          <p className="mt-0 mb-4 text-xs leading-5 text-[#666663]">
            Replace the token and any path parameters before using
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
