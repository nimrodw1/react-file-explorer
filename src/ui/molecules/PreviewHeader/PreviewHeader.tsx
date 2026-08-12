import { Group, Stack, Text } from '@mantine/core';
import { FileCategoryIcon } from '@/ui/atoms/FileCategoryIcon/FileCategoryIcon';
import type { FSNode } from '@/types/fileSystem';
import { isFile } from '@/types/fileSystem';
import classes from './PreviewHeader.module.css';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export interface PreviewHeaderProps {
  node: FSNode;
}

export function PreviewHeader({ node }: PreviewHeaderProps) {
  const file = isFile(node);

  return (
    <Group className={classes.root} gap="md" wrap="nowrap">
      <FileCategoryIcon
        category={file ? node.category : 'folder'}
        size={32}
        className={classes.icon}
      />
      <Stack gap={2} className={classes.meta}>
        <Text fw={600} size="md" className={classes.name} title={node.name}>
          {node.name}
        </Text>
        <Group gap="sm">
          {file && (
            <Text size="xs" c="dimmed">
              {formatSize(node.size)}
            </Text>
          )}
          <Text size="xs" c="dimmed">
            Modified {formatDate(node.updatedAt)}
          </Text>
          {file && (
            <Text size="xs" c="dimmed" tt="capitalize">
              {node.category}
            </Text>
          )}
        </Group>
      </Stack>
    </Group>
  );
}
