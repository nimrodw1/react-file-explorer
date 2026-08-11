import { Center, Stack, Text } from '@mantine/core';
import { FileCategoryIcon } from '@/ui/atoms/FileCategoryIcon/FileCategoryIcon';
import type { FileNode } from '@/types/fileSystem';
import classes from '../FilePreview.module.css';

interface DocumentPreviewProps {
  node: FileNode;
}

export function DocumentPreview({ node }: DocumentPreviewProps) {
  return (
    <Center className={classes.previewBody}>
      <Stack align="center" gap="md">
        <FileCategoryIcon category="document" size={64} />
        <Text fw={500} size="lg" ta="center">
          {node.name}
        </Text>
        <Text size="sm" c="dimmed">
          Document preview coming soon
        </Text>
      </Stack>
    </Center>
  );
}
