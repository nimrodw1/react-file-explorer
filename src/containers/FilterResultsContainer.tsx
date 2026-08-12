import { useCallback, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSelectedId, useSetSelectedId } from '@/hooks/useExplorer';
import { useFilterParams } from '@/hooks/useFilterParams';
import { useService } from '@/services/ServiceContext';
import { serializeFilter } from '@/types/filters';
import { FileTree, type VirtualRow } from '@/ui/organisms/FileTree/FileTree';

const NOOP_TOGGLE = () => {};

/**
 * Renders search/filter results as a paginated flat list with infinite scroll.
 * Only mounted when a filter (query or category) is active.
 *
 * Separation of concerns vs FileTreeContainer:
 *   - No tree traversal, no expand/collapse state
 *   - Uses useInfiniteQuery to load pages on demand as the user scrolls
 *   - Passes onNearEnd to FileTree so the virtualizer triggers the next page fetch
 */
export function FilterResultsContainer() {
  const selectedId = useSelectedId();
  const setSelectedId = useSetSelectedId();
  const { activeFilter } = useFilterParams();
  const service = useService();
  const filterKey = serializeFilter(activeFilter);

  const query = useInfiniteQuery({
    queryKey: ['search', filterKey],
    queryFn: ({ pageParam }) =>
      service.search(activeFilter, { cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
  });

  const flatRows = useMemo((): VirtualRow[] => {
    if (!query.data) {
      return [];
    }
    return query.data.pages.flatMap((page) =>
      page.nodes.map((node) => ({
        node,
        depth: 0,
        isExpanded: false,
        isLoading: false,
      }))
    );
  }, [query.data]);

  const totalCount = query.data?.pages[0]?.totalCount;

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  const handleNearEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <FileTree
      flatRows={flatRows}
      selectedId={selectedId}
      isFiltered
      expandable={false}
      isRootLoading={query.isLoading}
      totalCount={totalCount}
      isFetchingNextPage={isFetchingNextPage}
      onNearEnd={handleNearEnd}
      onSelect={setSelectedId}
      onToggle={NOOP_TOGGLE}
    />
  );
}
