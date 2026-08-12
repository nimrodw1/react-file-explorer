import { create } from 'zustand';
import type { NodeId } from '@/types/fileSystem';

interface ExplorerState {
  selectedId: NodeId | null;
  expandedIds: Set<NodeId>;

  setSelectedId: (id: NodeId | null) => void;
  toggleExpanded: (id: NodeId) => void;
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  selectedId: null,
  expandedIds: new Set(),

  setSelectedId: (id) => set({ selectedId: id }),

  toggleExpanded: (id) =>
    set((state) => {
      const next = new Set(state.expandedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { expandedIds: next };
    }),
}));
