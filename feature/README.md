# Frontend features

Each feature uses two files:

```text
feature/project/
  hook.ts
  type.ts
```

`hook.ts` contains the TanStack Query hook for fetching projects. `type.ts` contains the project data type. Page UI and search state stay in `app/`. Shared HTTP handling lives in `core/api.ts` and the protected layout supplies the QueryClient.

The projects page fetches and displays projects with search and simple empty-state text. It has no custom loading/error panels, mutations or create/edit/delete controls. Dates remain ISO strings from the API and are formatted by the page. All styling uses Tailwind utilities.
