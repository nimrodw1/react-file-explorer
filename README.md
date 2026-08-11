# React File Explorer

A high-performance file explorer built with React 19 and Mantine 9. Features a resizable two-panel layout — a virtualized tree on the left and a file preview panel on the right — backed by a fully typed service layer with a mock implementation.

## Features

- **Tree explorer** — lazy-loaded, virtualized ([@tanstack/react-virtual](https://tanstack.com/virtual)) file tree supporting 10,000+ nodes with expand/collapse and keyboard navigation
- **File preview panel** — category-aware preview area (document, image, music, video) with skeleton loading and smooth transitions
- **Omnibar** — search by name and filter by file category, synchronized with URL query parameters
- **Atomic design UI** — components organized as atoms → molecules → organisms → templates under `src/ui/`
- **Service abstraction** — `IFileSystemService` interface with a mock implementation powered by [@faker-js/faker](https://fakerjs.dev/), swappable for a real backend
- **URL-driven filter state** — filter query params parsed and validated with [Zod](https://zod.dev/)
- **Global state** — selected node, expanded folders, and panel width managed with [Zustand](https://zustand-demo.pmnd.rs/)
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
├── store/            # Zustand store (selectedId, expandedIds, navPanelWidth)
├── types/            # fileSystem.ts, filters.ts (Zod schema)
└── ui/
    ├── atoms/        # FileCategoryIcon, NodeName
    ├── molecules/    # TreeRow, FilterChips, PreviewHeader, EmptyState
    ├── organisms/    # FileTree, FilePreview, Omnibar
    └── templates/   # ExplorerLayout
```

## Developer

**Nimrod Wagner** — nimrod7676@gmail.com
