import React from 'react';
import { ActionIcon, Group, Loader, Stack, Text } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { FileCategoryIcon } from '@/ui/atoms/FileCategoryIcon/FileCategoryIcon';
import { NodeName } from '@/ui/atoms/NodeName/NodeName';
import type { FSNode } from '@/types/fileSystem';
import { isFolder } from '@/types/fileSystem';
import classes from './TreeRow.module.css';

export interface TreeRowProps {
  node: FSNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  isLoading?: boolean;
  /** Ancestor path shown below the name when results are in flat search mode */
  breadcrumb?: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

function TreeRowInner({
  node,
  depth,
  isExpanded,
  isSelected,
  isLoading = false,
  breadcrumb,
  onToggle,
  onSelect,
}: TreeRowProps) {
  const folder = isFolder(node);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folder) onToggle(node.id);
  };

  const handleSelect = () => onSelect(node.id);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
    if (e.key === 'ArrowRight' && folder && !isExpanded) onToggle(node.id);
    if (e.key === 'ArrowLeft' && folder && isExpanded) onToggle(node.id);
  };

  return (
    <div
      className={`${classes.row} ${isSelected ? classes.selected : ''} ${breadcrumb !== undefined ? classes.withBreadcrumb : ''}`}
      style={{ paddingLeft: `calc(${depth} * var(--tree-indent, 20px) + 8px)` }}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={folder ? isExpanded : undefined}
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      data-testid="tree-row"
      data-node-name={node.name}
      data-node-id={node.id}
    >
      <Group gap={4} wrap="nowrap" className={classes.inner} align="center">
        {folder ? (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xs"
            onClick={handleToggle}
            aria-label={isExpanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
            className={classes.chevron}
            data-testid="tree-row-expand"
          >
            {isLoading ? (
              <Loader size="xs" type="dots" />
            ) : isExpanded ? (
              <IconChevronDown size={12} />
            ) : (
              <IconChevronRight size={12} />
            )}
          </ActionIcon>
        ) : (
          <span className={classes.leafSpacer} aria-hidden />
        )}

        <FileCategoryIcon
          category={folder ? 'folder' : node.category}
          folderOpen={folder && isExpanded}
        />

        <Stack gap={0} className={classes.labelStack}>
          <NodeName name={node.name} />
          {breadcrumb !== undefined && (
            <Text
              size="xs"
              c="dimmed"
              className={classes.breadcrumb}
              title={breadcrumb || 'Root'}
            >
              {breadcrumb || 'Root'}
            </Text>
          )}
        </Stack>
      </Group>
    </div>
  );
}

export const TreeRow = React.memo(
  TreeRowInner,
  (prev, next) =>
    prev.node.id === next.node.id &&
    prev.node.name === next.node.name &&
    prev.isExpanded === next.isExpanded &&
    prev.isSelected === next.isSelected &&
    prev.isLoading === next.isLoading &&
    prev.breadcrumb === next.breadcrumb &&
    prev.depth === next.depth,
);
