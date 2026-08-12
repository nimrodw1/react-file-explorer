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
import { serializeFilter } from '@/types/filters';
import { FileTree, type VirtualRow } from '@/ui/organisms/FileTree/FileTree';

function flattenTree(
  roots: FSNode[],
  expandedIds: Set<NodeId>,
  loadingIds: Set<NodeId>,
  childrenMap: Map<NodeId, FSNode[]>
): VirtualRow[] {
  const rows: VirtualRow[] = [];
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

/** Renders the hierarchical file tree. Only mounted when no filter is active. */
export function FileTreeContainer() {
  const selectedId = useSelectedId();
  const expandedIds = useExpandedIds();
  const setSelectedId = useSetSelectedId();
  const toggleExpanded = useToggleExpanded();
  const { activeFilter } = useFilterParams();
  const service = useService();
  const filterKey = serializeFilter(activeFilter);

  const rootQuery = useNodeChildren(null, activeFilter);
  const expandedList = useMemo(() => [...expandedIds], [expandedIds]);

  const childQueries = useQueries({
    queries: expandedList.map((id) => ({
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
    return flattenTree(rootQuery.data, expandedIds, loadingIds, childrenMap);
  }, [rootQuery.data, expandedIds, loadingIds, childrenMap]);

  return (
    <FileTree
      flatRows={flatRows}
      selectedId={selectedId}
      isFiltered={false}
      isRootLoading={rootQuery.isLoading}
      onSelect={setSelectedId}
      onToggle={toggleExpanded}
    />
  );
}
