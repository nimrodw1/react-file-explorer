/**
 * Centralized selector constants for the File Explorer E2E suite.
 *
 * All selectors use data-testid attributes, decoupled from CSS class names
 * and Mantine's internal DOM structure.
 *
 * ⚠ Mantine 9 prop-forwarding rules that affect selectors here:
 *   - TextInput / Select extend ElementProps<'input'> →  extra props like
 *     data-testid land on the <input> element itself, not on a wrapper div.
 *     Selectors therefore target the input directly (no ` input` descendant).
 *   - ScrollArea extends ElementProps<'div'> → data-testid on the root wrapper.
 *     The actual scrollable element is the inner viewport div, which we
 *     expose separately via viewportProps={{ 'data-testid': 'file-tree-viewport' }}.
 */

export const SEL = {
  // ── Layout regions ──────────────────────────────────────────────────────────
  nav: '[data-testid="explorer-nav"]',
  preview: '[data-testid="explorer-preview"]',

  // ── Omnibar ─────────────────────────────────────────────────────────────────
  // data-testid goes to the <input> element (ElementProps<'input'>), so these
  // selectors target the input directly — no descendant combinator needed.
  searchInput: '[data-testid="search-input"]',
  categorySelect: '[data-testid="category-select"]',

  // ── Tree ────────────────────────────────────────────────────────────────────
  // data-testid="file-tree" is on the ScrollArea root div (ElementProps<'div'>).
  // data-testid="file-tree-viewport" is on the inner scrollable viewport via viewportProps.
  tree: '[data-testid="file-tree"]',
  treeViewport: '[data-testid="file-tree-viewport"]',
  treeRow: '[data-testid="tree-row"]',
  treeRowSelected: '[data-testid="tree-row"][aria-selected="true"]',
  treeLoading: '[data-testid="tree-loading"]',

  /** A specific row matched by the node's visible name */
  treeRowByName: (name: string) => `[data-testid="tree-row"][data-node-name="${name}"]`,

  /** The expand/collapse toggle button inside a named folder row */
  folderToggle: (folderName: string) =>
    `[data-testid="tree-row"][data-node-name="${folderName}"] [data-testid="tree-row-expand"]`,

  // ── Filter results ───────────────────────────────────────────────────────────
  /** "N results" or "N of M results" counter shown above the list in filter mode */
  resultCount: '[data-testid="result-count"]',

  // ── Preview panel ────────────────────────────────────────────────────────────
  previewSkeleton: '[data-testid="preview-skeleton"]',
  previewName: '[data-testid="preview-name"]',

  // ── Empty states ─────────────────────────────────────────────────────────────
  emptyState: '[data-testid="empty-state"]',
  emptyStateNoResults: '[data-testid="empty-state"][data-title="No results"]',
  emptyStateNothingSelected: '[data-testid="empty-state"][data-title="Nothing selected"]',
} as const;

/**
 * Known data from mockData.json (faker seed 42, 10 000 nodes).
 * Tests reference these constants instead of hard-coding strings.
 */
export const MOCK = {
  /** All root-level folders that exist in mockData.json (faker seed 42, 25 roots) */
  rootFolders: [
    'Projects',
    'Documents',
    'Media',
    'Archive',
    'Downloads',
    'Work',
    'Personal',
    'Backup',
    'Shared',
    'Clients',
    'Resources',
    'Assets',
    'Library',
    'Portfolio',
    'Research',
    'Design',
    'Engineering',
    'Finance',
    'Legal',
    'Marketing',
    'Product',
    'Sales',
    'HR',
    'Operations',
    'Support',
  ] as const,

  /** "Projects" has 17 children — safe to use for expand/collapse tests */
  expandableFolder: 'Projects',

  /**
   * Search terms verified against mockData.json:
   *   "song"  → 24 files, every one category:music
   *   combined with category:image → 0 results (triggers "No results" state)
   */
  searchTerm: {
    matchesMusic: 'song',
    noResults: '__no_match_xyz__',
  },

  categories: {
    music: { label: 'Music', value: 'music' },
    image: { label: 'Images', value: 'image' },
    document: { label: 'Documents', value: 'document' },
    video: { label: 'Videos', value: 'video' },
  },
} as const;
