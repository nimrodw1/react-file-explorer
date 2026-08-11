import { Center, Stack, Text } from '@mantine/core';
import { FileCategoryIcon } from '@/ui/atoms/FileCategoryIcon/FileCategoryIcon';
import type { FileNode } from '@/types/fileSystem';
import classes from '../FilePreview.module.css';

interface VideoPreviewProps {
  node: FileNode;
}

export function VideoPreview({ node }: VideoPreviewProps) {
  return (
    <Center className={classes.previewBody}>
      <Stack align="center" gap="md">
        <FileCategoryIcon category="video" size={64} />
        <Text fw={500} size="lg" ta="center">
          {node.name}
        </Text>
        <Text size="sm" c="dimmed">
          Video player coming soon
        </Text>
      </Stack>
    </Center>
  );
}
