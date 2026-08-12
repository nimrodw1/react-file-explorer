import { useExplorerStore } from '@/store/explorerStore';

// Granular selectors: each hook subscribes only to the slice it needs.
// Zustand actions are stable references and never trigger re-renders.
export const useSelectedId = () => useExplorerStore((s) => s.selectedId);
export const useExpandedIds = () => useExplorerStore((s) => s.expandedIds);
export const useSetSelectedId = () => useExplorerStore((s) => s.setSelectedId);
export const useToggleExpanded = () => useExplorerStore((s) => s.toggleExpanded);
