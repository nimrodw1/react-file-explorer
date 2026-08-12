import { useEffect, useRef, type ComponentProps } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Center, Loader, ScrollArea, Text } from '@mantine/core';
import type { FSNode, NodeId } from '@/types/fileSystem';
import { EmptyState } from '@/ui/molecules/EmptyState/EmptyState';
import { TreeRow } from '@/ui/molecules/TreeRow/TreeRow';
import classes from './FileTree.module.css';

export interface VirtualRow {
  node: FSNode;
  depth: number;
  isExpanded: boolean;
  isLoading: boolean;
}

export interface FileTreeProps {
  flatRows: VirtualRow[];
  selectedId: NodeId | null;
  /** True when a search/category filter is active — changes the empty-state copy. */
  isFiltered: boolean;
  isRootLoading: boolean;
  /** Total number of matching results across all pages (for the result count footer). */
  totalCount?: number;
  /** True while the next page of infinite-scroll results is being fetched. */
  isFetchingNextPage?: boolean;
  /** Called when the user scrolls within OVERSCAN rows of the end of the loaded list. */
  onNearEnd?: () => void;
  /** When false, hides the expand/collapse toggle on folder rows (used in filter mode). */
  expandable?: boolean;
  /** When true, renders an error state instead of the tree/list. */
  isError?: boolean;
  onSelect: (id: NodeId) => void;
  onToggle: (id: NodeId) => void;
}

const ROW_HEIGHT = 36;
const OVERSCAN = 10;

export function FileTree({
  flatRows,
  selectedId,
  isFiltered,
  isRootLoading,
  isError = false,
  totalCount,
  isFetchingNextPage = false,
  onNearEnd,
  expandable = true,
  onSelect,
  onToggle,
}: FileTreeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: flatRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const lastVirtualIndex = virtualItems[virtualItems.length - 1]?.index ?? -1;

  // Trigger the next-page fetch when the user scrolls to within OVERSCAN rows of the end.
  useEffect(() => {
    if (onNearEnd && flatRows.length > 0 && lastVirtualIndex >= flatRows.length - OVERSCAN) {
      onNearEnd();
    }
  }, [lastVirtualIndex, flatRows.length, onNearEnd]);

  if (isError) {
    return (
      <Center className={classes.loading}>
        <EmptyState
          title="Something went wrong"
          description="Files could not be loaded. Try refreshing the page."
        />
      </Center>
    );
  }

  if (isRootLoading) {
    return (
      <Center
        className={classes.loading}
        role="status"
        aria-label="Loading files…"
        data-testid="tree-loading"
      >
        <Loader type="dots" aria-hidden />
      </Center>
    );
  }

  if (flatRows.length === 0) {
    return (
      <Center className={classes.loading}>
        <EmptyState
          title={isFiltered ? 'No results' : 'This folder is empty'}
          description={
            isFiltered
              ? 'Try a different search term or category.'
              : 'There are no files or folders here.'
          }
        />
      </Center>
    );
  }

  const totalSize = virtualizer.getTotalSize();
  const showResultCount = isFiltered && totalCount !== undefined;

  return (
    <ScrollArea
      className={classes.root}
      viewportRef={scrollRef}
      scrollbarSize={6}
      role="tree"
      aria-label="File explorer"
      data-testid="file-tree"
      viewportProps={{ 'data-testid': 'file-tree-viewport' } as unknown as ComponentProps<'div'>}
    >
      {showResultCount && (
        <Text size="xs" c="dimmed" className={classes.resultCount} data-testid="result-count">
          {flatRows.length === totalCount
            ? `${totalCount} result${totalCount !== 1 ? 's' : ''}`
            : `${flatRows.length} of ${totalCount} results`}
        </Text>
      )}
      <div style={{ height: totalSize, position: 'relative' }} className={classes.listWrapper}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
          }}
        >
          {virtualItems.map((virtualItem) => {
            const row = flatRows[virtualItem.index];
            return (
              <div key={row.node.id} data-index={virtualItem.index} style={{ height: ROW_HEIGHT }}>
                <TreeRow
                  node={row.node}
                  depth={row.depth}
                  isExpanded={row.isExpanded}
                  isSelected={row.node.id === selectedId}
                  isLoading={row.isLoading}
                  expandable={expandable}
                  onSelect={onSelect}
                  onToggle={onToggle}
                />
              </div>
            );
          })}
        </div>
      </div>
      {isFetchingNextPage && (
        <Center py="sm" data-testid="tree-loading-more">
          <Loader size="xs" type="dots" aria-hidden />
        </Center>
      )}
    </ScrollArea>
  );
}
