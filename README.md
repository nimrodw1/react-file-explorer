# React File Explorer

A high-performance file explorer built with React 19 and Mantine 9. Features a resizable two-panel layout — a virtualized tree on the left and a file preview panel on the right — backed by a fully typed service layer with a mock implementation.

**Live demo:** [nimrodw1.github.io/react-file-explorer](https://nimrodw1.github.io/react-file-explorer/)

## Features

- **Tree explorer** — lazy-loaded, virtualized ([@tanstack/react-virtual](https://tanstack.com/virtual)) file tree supporting 10,000+ nodes with expand/collapse and keyboard navigation
- **Filter results** — a separate flat-list view with paginated search, infinite scroll, and a result-count footer; folder expand toggles are hidden (they are no-ops in a flat list)
- **File preview panel** — category-aware preview (document, image, music, video) with the ancestor path merged into the filename, skeleton loading, and smooth transitions
- **Omnibar** — search by name (300 ms debounce) and filter by file category, synchronized with URL query parameters
- **Error and empty states** — failed `explore` / `search` calls surface an error empty state instead of hanging on a spinner
- **Atomic design UI** — components organized as atoms → molecules → organisms → templates under `src/ui/`
- **Service abstraction** — `IFileSystemService` with a mock implementation powered by [@faker-js/faker](https://fakerjs.dev/), swappable for a real backend
- **URL-driven filter state** — filter query params parsed and validated with [Zod](https://zod.dev/)
- **Global state** — selected node and expanded folders managed with [Zustand](https://zustand-demo.pmnd.rs/)
- **Data fetching** — [TanStack Query](https://tanstack.com/query) (`useQuery` for the tree, `useInfiniteQuery` for search)

## Stack

| Layer | Library |
|---|---|
| UI | [Mantine 9](https://mantine.dev/) + [Tabler Icons](https://tabler-icons.io/) |
| Framework | React 19 + TypeScript |
| Routing | React Router DOM 7 |
| Data fetching | TanStack Query 5 |
| Virtualization | TanStack Virtual 3 |
| State | Zustand 5 |
| Validation | Zod 4 |
| Build | Vite 8 |
| Unit tests | Vitest 4 |
| E2E tests | Cypress |

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:5173](http://localhost:5173).

## Live demo (GitHub Pages)

Every push to `master` builds the production bundle and deploys it to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**One-time repo setup** (required before the first deploy succeeds):

1. GitHub repo → **Settings** → **Pages**
2. **Build and deployment** → **Source:** GitHub Actions

The app is then available at `https://<user>.github.io/<repo>/`. You can also trigger a deploy manually from the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**.

## Scripts

### Development

| Script | Description |
|---|---|
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build locally (port 4173) |
| `yarn generate:mock` | Regenerate `src/services/mock/mockData.json` |

### Testing

| Script | Description |
|---|---|
| `yarn vitest` | Run Vitest unit tests |
| `yarn vitest:watch` | Run Vitest in watch mode |
| `yarn cypress:open` | Open the Cypress UI against the preview server |
| `yarn cypress:run` | Headless Cypress (Chrome) against the preview server |
| `yarn test:e2e` | Start `vite preview` then run Cypress |
| `yarn typecheck` | Check TypeScript types |
| `yarn lint` | Run oxlint + stylelint |
| `yarn format:test` | Check formatting with oxfmt |
| `yarn format:write` | Auto-format all `.ts`/`.tsx` files |
| `yarn test` | Typecheck, format, lint, Vitest, production build, then E2E |

Cypress retries are set to **0** (one attempt per test). Specs live under `cypress/e2e/` and target `data-testid` attributes via `cypress/support/selectors.ts`.

### Storybook

| Script | Description |
|---|---|
| `yarn storybook` | Start Storybook dev server on port 6006 |
| `yarn storybook:build` | Build static Storybook bundle |

## Project structure

```
src/
├── containers/       # Smart components — wire state/queries into pure UI
├── hooks/            # useFilterParams, useFilePreview, useNodeChildren, useExplorer
├── pages/            # Explorer.page.tsx — switches tree vs filter view
├── services/         # IFileSystemService + mock implementation
├── store/            # Zustand store (selectedId, expandedIds)
├── types/            # fileSystem.ts, filters.ts (Zod schema)
└── ui/
    ├── atoms/        # FileCategoryIcon, NodeName
    ├── molecules/    # TreeRow, PreviewHeader, EmptyState
    ├── organisms/    # FileTree, FilePreview, Omnibar
    └── templates/    # ExplorerLayout

cypress/
├── e2e/              # smoke, tree-browse, filtering, scrolling, performance
└── support/          # selectors, custom commands
```

---

## Technical implementation

### Component architecture

The UI follows [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/): **atoms** (icon, name label) compose into **molecules** (tree row, preview header), which compose into **organisms** (file tree, preview panel, omnibar), which are arranged by a **template** (`ExplorerLayout`). Pure UI components live entirely under `src/ui/` and receive only props — they hold no state and make no service calls.

**Containers** (`src/containers/`) are the boundary between state/data and UI. `ExplorerPage` mounts either the hierarchical tree or the filter-results list, never both:

```
ExplorerPage
└── ExplorerLayout (template: nav + main slots)
    ├── OmnibarContainer         →  Omnibar
    ├── FileTreeContainer        →  FileTree     (no filter)
    ├── FilterResultsContainer   →  FileTree     (query or category active)
    └── FilePreviewContainer     →  FilePreview
```

`FileTree` is shared. The two containers pass different props: tree-browse uses expand/collapse and lazy children; filter mode uses `expandable={false}`, a result-count footer, and `onNearEnd` for infinite scroll.

### State management

Three distinct state domains are handled separately:

| Domain | Mechanism | Rationale |
|---|---|---|
| UI selection & expansion | Zustand | Synchronous, no serialization needed |
| Active filter | URL query params (React Router) | Shareable, bookmarkable, browser-history-aware |
| Remote data | TanStack Query | Caching, deduplication, loading/error states |

**Zustand store** (`src/store/explorerStore.ts`) holds `selectedId` and `expandedIds`. The store is accessed exclusively through granular selector hooks exported from `src/hooks/useExplorer.ts`:

```ts
export const useSelectedId     = () => useExplorerStore((s) => s.selectedId);
export const useExpandedIds    = () => useExplorerStore((s) => s.expandedIds);
export const useSetSelectedId  = () => useExplorerStore((s) => s.setSelectedId);
export const useToggleExpanded = () => useExplorerStore((s) => s.toggleExpanded);
```

Each selector creates a subscription only to its own slice, so `FilePreviewContainer` (which reads only `selectedId`) never re-renders when folders are expanded or collapsed.

**URL filter state** is parsed and validated by Zod in `useFilterParams`. Invalid or unknown category values in the URL silently fall back to `EMPTY_FILTER` rather than crashing. Query updates use `replace: true` so that typing never pollutes the browser history; category changes use the default `push` so the back button can undo them.

**Search debounce** lives in `OmnibarContainer`. The input is controlled by a local `draftQuery`; Mantine's `useDebouncedValue` (300 ms) is what gets written to the URL. That way React Query is not invalidated on every keystroke. The draft stays in sync when the URL changes externally (back button, direct navigation).

### Data fetching & caching

All remote calls go through `IFileSystemService` and are cached by TanStack Query. Key decisions:

- **`staleTime: 30s`** for folder children (`explore`) and search pages — avoids redundant refetches during a session while still allowing background refresh.
- **`staleTime: 60s`** for node details — the preview path is cheap to keep around between selections.
- **`placeholderData: keepPreviousData`** in `useFilePreview` — the preview panel shows the previous node's content while a new selection is loading, eliminating skeleton flicker between selections.
- **`useInfiniteQuery`** in `FilterResultsContainer` — pages of 100 results; the next page is fetched when the virtualizer scrolls within 10 rows of the end.
- **`isError`** from both query hooks is passed to `FileTree`, which renders an error empty state instead of a silent spinner.

### Tree browse vs filter results

The two modes are separate containers so neither has to special-case the other.

**Tree browse** (`FileTreeContainer`) lazy-loads children of expanded folders with `useQueries` + `explore()`. The tree is stored as a **pre-flattened array of `VirtualRow`** objects computed by `flattenTree` — an iterative stack-based DFS (no recursion). Each row carries `depth`, `isExpanded`, and `isLoading`. The virtualizer indexes directly into this array.

```
expandedIds (Set)  +  childrenMap (Map<id, FSNode[]>)
          │
          ▼
     flattenTree()    ← iterative DFS, O(visible nodes)
          │
          ▼
  VirtualRow[]  →  useVirtualizer  →  only viewport rows rendered
```

**Filter results** (`FilterResultsContainer`) call `search()` and flatten loaded pages into a depth-0 list. There is no tree traversal, no expand/collapse, and no per-row breadcrumb fetch. Location is shown once, in the preview header, via `details()`.

Only the rows visible in the viewport (plus an overscan of 10) are in the DOM, so render cost stays constant regardless of total node count.

### Search performance

`src/services/mock/mockData.ts` builds lookup structures at module load from the 10,000-node JSON dataset:

| Structure | Type | Purpose |
|---|---|---|
| `NODE_MAP` | `Map<NodeId, FSNode>` | O(1) node lookup by id |
| `CHILDREN_MAP` | `Map<NodeId, NodeId[]>` | O(1) child list for any folder |
| `ROOT_IDS` | `string[]` | Top-level node ids (`parentId === null`) |
| `LOWERCASE_NAME` | `Map<NodeId, string>` | Pre-lowercased names — no allocations in the search loop |
| `CATEGORY_INDEX` | `Map<FileCategory, FileNode[]>` | O(1) candidate set for category-only (and category + query) searches |

`searchAll` uses `CATEGORY_INDEX` when a category is set, then scans that (much smaller) candidate list with `LOWERCASE_NAME`. Results are sliced into pages of 100 by `MockFileSystemService.search()`. The UI never materializes thousands of DOM rows; it virtualizes the loaded pages and fetches the next page on scroll.

`computeNodePath` walks `NODE_MAP` upward from a node to the root — O(depth) — and is only called from `details()`, i.e. for the currently selected node.

`TreeRow` is wrapped in `React.memo` with a custom comparator (`id`, `name`, `isExpanded`, `isSelected`, `isLoading`, `expandable`, `depth`) so sibling rows do not re-render when an unrelated row changes.

### Service layer & dependency injection

`IFileSystemService` defines a three-method contract:

```ts
explore(filter, options?) → Promise<FSNode[]>     // folder children (tree-browse only)
details(nodeId)           → Promise<NodeDetails>  // node + slash-separated ancestor path
search(filter, options?)  → Promise<SearchPage>   // paginated global search
```

`SearchPage` is `{ nodes, nextCursor, totalCount }`. `nextCursor` is `null` on the last page.

`ServiceContext` provides the implementation via React context. The default is `MockFileSystemService`, but any conforming implementation can be injected at the `ServiceProvider` level — in tests, in Storybook, or when swapping in a real HTTP backend. `MockFileSystemService` validates its inputs with Zod (`NodeFilterSchema.parse`) before processing, ensuring the service contract is enforced regardless of call origin.

### Preview header

Selecting a node calls `details()`, which returns the node plus its ancestor path (e.g. `"Media / Photos"`). `PreviewHeader` renders that path dimmed on the same line as the filename: `Media / Photos / sunset.jpg`. Paths are not shown on tree rows, so filter results stay cheap even at thousands of matches.

### E2E coverage

Cypress specs cover the main user flows:

| Spec | What it covers |
|---|---|
| `smoke.cy.ts` | App shell, omnibar, tree, preview empty state |
| `tree-browse.cy.ts` | Expand/collapse, selection, preview name |
| `filtering.cy.ts` | Query, category, combined filters, empty state, result count |
| `scrolling.cy.ts` | Virtualization and infinite-scroll page loading |
| `performance.cy.ts` | Large result sets stay interactive |

Custom commands (`typeSearch`, `clearSearch`, `selectCategory`, `toggleFolder`, …) wait for the debounced URL commit so assertions run against filter results, not the still-visible browse tree.

## Developer

**Nimrod Wagner** — nimrod7676@gmail.com
