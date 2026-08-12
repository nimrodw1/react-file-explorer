import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { FileTree, type VirtualRow } from '@/ui/organisms/FileTree/FileTree';
import { useSelectedId, useExpandedIds, useSetSelectedId, useToggleExpanded } from '@/hooks/useExplorer';
import { useFilterParams } from '@/hooks/useFilterParams';
import { useNodeChildren } from '@/hooks/useNodeChildren';
import { useService } from '@/services/ServiceContext';
import type { NodeDetails } from '@/services/IFileSystemService';
import { serializeFilter, isFilterActive } from '@/types/filters';
import type { FSNode, NodeId } from '@/types/fileSystem';
import { isFolder } from '@/types/fileSystem';

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

  // When filter is active, batch-fetch ancestor paths for all flat results via details.
  // combine() aggregates directly inside useQueries so the component only re-renders
  // once per resolved query — no separate useMemo that invalidates on every array ref change.
  const resultNodes = rootQuery.data ?? [];
  const pathMap = useQueries({
    queries: filterActive
      ? resultNodes.map((node) => ({
          queryKey: ['details', node.id],
          queryFn: () => service.details(node.id),
          // select keeps the cached entry compatible with useFilePreview (full NodeDetails).
          select: (d: NodeDetails) => d.path,
          staleTime: Infinity,
        }))
      : [],
    combine: (results) =>
      new Map<NodeId, string>(
        results.flatMap((r, i) =>
          r.data !== undefined ? [[resultNodes[i].id, r.data]] : [],
        ),
      ),
  });

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
    // In filter mode the results are a global flat list — never expand folders.
    const rows = flattenTree(
      rootQuery.data,
      filterActive ? new Set<NodeId>() : expandedIds,
      loadingIds,
      childrenMap,
    );
    if (!filterActive) return rows;
    // Attach breadcrumb to every row in filtered/search mode
    return rows.map((row) => ({
      ...row,
      breadcrumb: pathMap.get(row.node.id) ?? '',
    }));
  }, [rootQuery.data, expandedIds, loadingIds, childrenMap, filterActive, pathMap]);

  return (
    <FileTree
      flatRows={flatRows}
      selectedId={selectedId}
      hasBreadcrumbs={filterActive}
      isRootLoading={rootQuery.isLoading}
      onSelect={setSelectedId}
      onToggle={toggleExpanded}
    />
  );
}
