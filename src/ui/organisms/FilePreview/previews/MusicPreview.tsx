import { Center, Stack, Text } from '@mantine/core';
import type { FileNode } from '@/types/fileSystem';
import { FileCategoryIcon } from '@/ui/atoms/FileCategoryIcon/FileCategoryIcon';
import classes from '../FilePreview.module.css';

interface MusicPreviewProps {
  node: FileNode;
}

export function MusicPreview({ node }: MusicPreviewProps) {
  return (
    <Center className={classes.previewBody}>
      <Stack align="center" gap="md">
        <FileCategoryIcon category="music" size={64} />
        <Text fw={500} size="lg" ta="center">
          {node.name}
        </Text>
        <Text size="sm" c="dimmed">
          Audio player coming soon
        </Text>
      </Stack>
    </Center>
  );
}
