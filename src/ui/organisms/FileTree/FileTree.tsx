import { useRef, type ComponentProps } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Center, Loader, ScrollArea } from '@mantine/core';
import type { FSNode, NodeId } from '@/types/fileSystem';
import { EmptyState } from '@/ui/molecules/EmptyState/EmptyState';
import { TreeRow } from '@/ui/molecules/TreeRow/TreeRow';
import classes from './FileTree.module.css';

export interface VirtualRow {
  node: FSNode;
  depth: number;
  isExpanded: boolean;
  isLoading: boolean;
  /** Ancestor path shown below the name in filtered/search mode, e.g. "Media / Photos" */
  breadcrumb?: string;
}

export interface FileTreeProps {
  flatRows: VirtualRow[];
  selectedId: NodeId | null;
  hasBreadcrumbs: boolean;
  isRootLoading: boolean;
  onSelect: (id: NodeId) => void;
  onToggle: (id: NodeId) => void;
}

const ROW_HEIGHT = 36;
const ROW_HEIGHT_WITH_BREADCRUMB = 52;
const OVERSCAN = 10;

export function FileTree({
  flatRows,
  selectedId,
  hasBreadcrumbs,
  isRootLoading,
  onSelect,
  onToggle,
}: FileTreeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rowHeight = hasBreadcrumbs ? ROW_HEIGHT_WITH_BREADCRUMB : ROW_HEIGHT;

  const virtualizer = useVirtualizer({
    count: flatRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: OVERSCAN,
  });

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
          title={hasBreadcrumbs ? 'No results' : 'This folder is empty'}
          description={
            hasBreadcrumbs
              ? 'Try a different search term or category.'
              : 'There are no files or folders here.'
          }
        />
      </Center>
    );
  }

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

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
              <div key={row.node.id} data-index={virtualItem.index} style={{ height: rowHeight }}>
                <TreeRow
                  node={row.node}
                  depth={row.depth}
                  isExpanded={row.isExpanded}
                  isSelected={row.node.id === selectedId}
                  isLoading={row.isLoading}
                  breadcrumb={row.breadcrumb}
                  onSelect={onSelect}
                  onToggle={onToggle}
                />
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
