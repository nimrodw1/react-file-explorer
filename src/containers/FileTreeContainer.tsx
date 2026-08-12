import { useMemo, useCallback } from 'react';
import { useQueries } from '@tanstack/react-query';
import { FileTree, type VirtualRow } from '@/ui/organisms/FileTree/FileTree';
import { useExplorer } from '@/hooks/useExplorer';
import { useFilterParams } from '@/hooks/useFilterParams';
import { useNodeChildren } from '@/hooks/useNodeChildren';
import { useService } from '@/services/ServiceContext';
import type { NodeDetails } from '@/services/IFileSystemService';
import { serializeFilter, EMPTY_FILTER } from '@/types/filters';
import type { FSNode, NodeId } from '@/types/fileSystem';
import { isFolder } from '@/types/fileSystem';

function isFilterActive(filter: typeof EMPTY_FILTER): boolean {
  return !!(filter.query || filter.category);
}

function flattenTree(
  roots: FSNode[],
  expandedIds: Set<NodeId>,
  loadingIds: Set<NodeId>,
  childrenMap: Map<NodeId, FSNode[]>,
): VirtualRow[] {
  const rows: VirtualRow[] = [];
  // Stack-based traversal: avoids call-stack limits on deep trees
  const stack: [FSNode, number][] = [...roots].reverse().map((n) => [n, 0]);

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) break;
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
  const { selectedId, expandedIds, setSelectedId, toggleExpanded } = useExplorer();
  const { activeFilter } = useFilterParams();
  const service = useService();
  const filterKey = serializeFilter(activeFilter);
  const filterActive = isFilterActive(activeFilter);

  const rootQuery = useNodeChildren(null, activeFilter);

  const expandedList = useMemo(() => [...expandedIds], [expandedIds]);

  const childQueries = useQueries({
    queries: expandedList.map((id) => ({
      queryKey: ['explore', id, filterKey],
      queryFn: () => service.explore(activeFilter, { parentNodeId: id }),
      staleTime: 30_000,
    })),
  });

  // When filter is active, batch-fetch ancestor paths for all flat results via details
  const resultNodes = rootQuery.data ?? [];
  const pathQueries = useQueries({
    queries: filterActive
      ? resultNodes.map((node) => ({
          queryKey: ['details', node.id],
          queryFn: () => service.details(node.id),
          // select transforms the output to a string without changing what is stored
          // in the cache — keeps this cache entry compatible with useFilePreview,
          // which stores the full NodeDetails under the same key.
          select: (d: NodeDetails) => d.path,
          staleTime: Infinity,
        }))
      : [],
  });

  const pathMap = useMemo(() => {
    if (!filterActive) return new Map<NodeId, string>();
    return new Map(
      resultNodes.map((node, idx) => [node.id, pathQueries[idx]?.data ?? '']),
    );
  }, [filterActive, resultNodes, pathQueries]);

  const { childrenMap, loadingIds } = useMemo(() => {
    const map = new Map<NodeId, FSNode[]>();
    const loading = new Set<NodeId>();

    expandedList.forEach((id, idx) => {
      const q = childQueries[idx];
      if (q?.data) map.set(id, q.data);
      if (q?.isLoading) loading.add(id);
    });

    return { childrenMap: map, loadingIds: loading };
  }, [expandedList, childQueries]);

  const flatRows = useMemo(() => {
    if (!rootQuery.data) return [];
    const rows = flattenTree(rootQuery.data, expandedIds, loadingIds, childrenMap);
    if (!filterActive) return rows;
    // Attach breadcrumb to every row in filtered/search mode
    return rows.map((row) => ({
      ...row,
      breadcrumb: pathMap.get(row.node.id) ?? '',
    }));
  }, [rootQuery.data, expandedIds, loadingIds, childrenMap, filterActive, pathMap]);

  const handleSelect = useCallback(
    (id: NodeId) => setSelectedId(id),
    [setSelectedId],
  );

  const handleToggle = useCallback(
    (id: NodeId) => toggleExpanded(id),
    [toggleExpanded],
  );

  return (
    <FileTree
      flatRows={flatRows}
      selectedId={selectedId}
      expandedIds={expandedIds}
      isRootLoading={rootQuery.isLoading}
      onSelect={handleSelect}
      onToggle={handleToggle}
    />
  );
}
