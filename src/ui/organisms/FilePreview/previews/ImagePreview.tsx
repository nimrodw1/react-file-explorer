import { Center, Stack, Text } from '@mantine/core';
import { FileCategoryIcon } from '@/ui/atoms/FileCategoryIcon/FileCategoryIcon';
import type { FileNode } from '@/types/fileSystem';
import classes from '../FilePreview.module.css';

interface ImagePreviewProps {
  node: FileNode;
}

export function ImagePreview({ node }: ImagePreviewProps) {
  return (
    <Center className={classes.previewBody}>
      <Stack align="center" gap="md">
        <FileCategoryIcon category="image" size={64} />
        <Text fw={500} size="lg" ta="center">
          {node.name}
        </Text>
        <Text size="sm" c="dimmed">
          Image viewer coming soon
        </Text>
      </Stack>
    </Center>
  );
}
