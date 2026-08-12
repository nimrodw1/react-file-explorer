# React File Explorer

A high-performance file explorer built with React 19 and Mantine 9. Features a resizable two-panel layout — a virtualized tree on the left and a file preview panel on the right — backed by a fully typed service layer with a mock implementation.

## Features

- **Tree explorer** — lazy-loaded, virtualized ([@tanstack/react-virtual](https://tanstack.com/virtual)) file tree supporting 10,000+ nodes with expand/collapse and keyboard navigation
- **File preview panel** — category-aware preview area (document, image, music, video) with skeleton loading and smooth transitions
- **Omnibar** — search by name and filter by file category, synchronized with URL query parameters
- **Atomic design UI** — components organized as atoms → molecules → organisms → templates under `src/ui/`
- **Service abstraction** — `IFileSystemService` interface with a mock implementation powered by [@faker-js/faker](https://fakerjs.dev/), swappable for a real backend
- **URL-driven filter state** — filter query params parsed and validated with [Zod](https://zod.dev/)
- **Global state** — selected node and expanded folders managed with [Zustand](https://zustand-demo.pmnd.rs/)
- **Data fetching** — [TanStack Query](https://tanstack.com/query) with `keepPreviousData` for flicker-free re-fetches

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

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

### Development

| Script | Description |
|---|---|
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build locally |

### Testing

| Script | Description |
|---|---|
| `yarn vitest` | Run Vitest unit tests |
| `yarn vitest:watch` | Run Vitest in watch mode |
| `yarn typecheck` | Check TypeScript types |
| `yarn lint` | Run oxlint + stylelint |
| `yarn format:test` | Check formatting with oxfmt |
| `yarn format:write` | Auto-format all `.ts`/`.tsx` files |
| `yarn test` | Run all of the above + production build |

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
├── pages/            # Explorer.page.tsx
├── services/         # IFileSystemService interface + mock implementation
├── store/            # Zustand store (selectedId, expandedIds)
├── types/            # fileSystem.ts, filters.ts (Zod schema)
└── ui/
    ├── atoms/        # FileCategoryIcon, NodeName
    ├── molecules/    # TreeRow, PreviewHeader, EmptyState
    ├── organisms/    # FileTree, FilePreview, Omnibar
    └── templates/   # ExplorerLayout
```

---

## Technical implementation

### Component architecture

The UI follows [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/): **atoms** (icon, name label) compose into **molecules** (tree row, preview header), which compose into **organisms** (file tree, preview panel, omnibar), which are arranged by a **template** (`ExplorerLayout`). Pure UI components live entirely under `src/ui/` and receive only props — they hold no state and make no service calls.

**Containers** (`src/containers/`) are the boundary between state/data and UI. Each container subscribes to exactly the store slices and queries it needs, derives its view model, and passes it down to a pure organism:

```
ExplorerPage
└── ExplorerLayout (template: nav + main slots)
    ├── OmnibarContainer      →  Omnibar
    ├── FileTreeContainer     →  FileTree
    └── FilePreviewContainer  →  FilePreview
```

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

### Data fetching & caching

All remote calls go through `IFileSystemService` and are cached by TanStack Query. Key decisions:

- **`staleTime: 30s`** for folder children — avoids redundant refetches during a browsing session while still allowing background refresh.
- **`staleTime: Infinity`** for node paths (`details`) — paths are immutable; once fetched they never need to be re-fetched.
- **`keepPreviousData`** in `useFilePreview` — the preview panel shows the previous node's content while a new selection is loading, eliminating skeleton flicker between selections.
- **`useQueries` with `combine`** for batch path fetching in filter mode — results are aggregated directly inside `useQueries` without a separate `useMemo`, so the component re-renders once per resolved query instead of rebuilding the entire map on every array reference change.

### Tree rendering & virtualization

The file tree is rendered with [@tanstack/react-virtual](https://tanstack.com/virtual). Only the rows visible in the viewport (plus an overscan buffer of 10) are in the DOM at any time, keeping render cost constant regardless of the total node count.

The tree is stored as a **pre-flattened array of `VirtualRow`** objects computed by `flattenTree` in `FileTreeContainer`. This iterative stack-based DFS traversal (no recursion, no call-stack risk on deep trees) produces a flat list where each row carries its own `depth`, `isExpanded`, `isLoading`, and optional `breadcrumb`. The virtualizer indexes directly into this array — no tree structure exists in the DOM.

```
expandedIds (Set)  +  childrenMap (Map<id, FSNode[]>)
          │
          ▼
     flattenTree()    ← iterative DFS, O(visible nodes)
          │
          ▼
  VirtualRow[]  →  useVirtualizer  →  only viewport rows rendered
```

**Filter mode** bypasses the tree entirely. When `query` or `category` is set, `explore()` returns a global flat list and `flattenTree` receives an empty `expandedIds` — no folder expansion is honoured, preventing search results from being duplicated under previously-expanded folders.

### Data structures

`src/services/mock/mockData.ts` builds three module-level lookup structures at startup from the 10,000-node JSON dataset:

| Structure | Type | Purpose |
|---|---|---|
| `NODE_MAP` | `Map<NodeId, FSNode>` | O(1) node lookup by id |
| `CHILDREN_MAP` | `Map<NodeId, NodeId[]>` | O(1) child list for any folder |
| `ROOT_IDS` | `string[]` | Top-level node ids (`parentId === null`) |

`computeNodePath` walks `NODE_MAP` upward from a node to the root, collecting ancestor names with `push`, then calls `reverse()` in one pass — O(depth) total.

`TreeRow` is wrapped in `React.memo` with a custom comparator that checks only the fields that affect its output (`id`, `name`, `isExpanded`, `isSelected`, `isLoading`, `breadcrumb`, `depth`), so sibling rows do not re-render when an unrelated row changes.

### Service layer & dependency injection

`IFileSystemService` defines the two-method contract:

```ts
explore(filter, options?) → Promise<FSNode[]>    // folder children or global search
details(nodeId)           → Promise<NodeDetails>  // node + slash-separated ancestor path
```

`ServiceContext` provides the implementation via React context. The default is `MockFileSystemService`, but any conforming implementation can be injected at the `ServiceProvider` level — in tests, in Storybook, or when swapping in a real HTTP backend. `MockFileSystemService` validates its inputs with Zod (`NodeFilterSchema.parse`) before processing, ensuring the service contract is enforced regardless of call origin.

## Developer

**Nimrod Wagner** — nimrod7676@gmail.com