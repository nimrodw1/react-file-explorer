import { IconFolderSearch } from '@tabler/icons-react';
import { Stack, Text } from '@mantine/core';
import classes from './EmptyState.module.css';

export interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'Nothing selected',
  description = 'Select a file or folder from the tree to preview it here.',
}: EmptyStateProps) {
  return (
    <Stack
      align="center"
      justify="center"
      gap="sm"
      className={classes.root}
      data-testid="empty-state"
      data-title={title}
    >
      <IconFolderSearch size={48} stroke={1} className={classes.icon} aria-hidden />
      <Text fw={500} size="md" className={classes.title}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" ta="center" className={classes.description}>
        {description}
      </Text>
    </Stack>
  );
}
