import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  useSelectedId,
  useExpandedIds,
  useSetSelectedId,
  useToggleExpanded,
} from '@/hooks/useExplorer';
import { useFilterParams } from '@/hooks/useFilterParams';
import { useNodeChildren } from '@/hooks/useNodeChildren';
import { useService } from '@/services/ServiceContext';
import { isFolder, type FSNode, type NodeId } from '@/types/fileSystem';
import { serializeFilter, isFilterActive } from '@/types/filters';
import { FileTree, type VirtualRow } from '@/ui/organisms/FileTree/FileTree';

function flattenTree(
  roots: FSNode[],
  expandedIds: Set<NodeId>,
  loadingIds: Set<NodeId>,
  childrenMap: Map<NodeId, FSNode[]>
): VirtualRow[] {
  const rows: VirtualRow[] = [];
  // Stack-based traversal: avoids call-stack limits on deep trees
  const stack: [FSNode, number][] = [...roots].reverse().map((n) => [n, 0]);

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) {
      break;
    }
    const [node, depth] = item;
    const isExpanded = isFolder(node) && expandedIds.has(node.id);
    const isLoading = isFolder(node) && loadingIds.has(node.id);

    rows.push({ node, depth, isExpanded, isLoading });

    if (isExpanded) {
      const children = childrenMap.get(node.id) ?? [];
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push([children[i], depth + 1]);
      }
    }
  }

  return rows;
}

export function FileTreeContainer() {
  const selectedId = useSelectedId();
  const expandedIds = useExpandedIds();
  const setSelectedId = useSetSelectedId();
  const toggleExpanded = useToggleExpanded();
  const { activeFilter } = useFilterParams();
  const service = useService();
  const filterKey = serializeFilter(activeFilter);
  const filterActive = isFilterActive(activeFilter);

  const rootQuery = useNodeChildren(null, activeFilter);

  const expandedList = useMemo(() => [...expandedIds], [expandedIds]);

  // Child queries are only meaningful in tree-browse mode. When a filter is
  // active the service returns a global flat result set and ignores parentNodeId,
  // so dispatching per-folder queries would populate childrenMap with wrong data.
  const childQueries = useQueries({
    queries: filterActive
      ? []
      : expandedList.map((id) => ({
          queryKey: ['explore', id, filterKey],
          queryFn: () => service.explore(activeFilter, { parentNodeId: id }),
          staleTime: 30_000,
        })),
  });

  const { childrenMap, loadingIds } = useMemo(() => {
    const map = new Map<NodeId, FSNode[]>();
    const loading = new Set<NodeId>();

    expandedList.forEach((id, idx) => {
      const q = childQueries[idx];
      if (q?.data) {
        map.set(id, q.data);
      }
      if (q?.isLoading) {
        loading.add(id);
      }
    });

    return { childrenMap: map, loadingIds: loading };
  }, [expandedList, childQueries]);

  const flatRows = useMemo(() => {
    if (!rootQuery.data) {
      return [];
    }
    return flattenTree(
      rootQuery.data,
      filterActive ? new Set<NodeId>() : expandedIds,
      loadingIds,
      childrenMap
    );
  }, [rootQuery.data, expandedIds, loadingIds, childrenMap, filterActive]);

  return (
    <FileTree
      flatRows={flatRows}
      selectedId={selectedId}
      isFiltered={filterActive}
      isRootLoading={rootQuery.isLoading}
      onSelect={setSelectedId}
      onToggle={toggleExpanded}
    />
  );
}
