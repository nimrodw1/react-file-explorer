import { Group, Skeleton, Stack } from '@mantine/core';
import classes from './FilePreview.module.css';

export function FilePreviewSkeleton() {
  return (
    <Stack gap={0} className={classes.root} data-testid="preview-skeleton">
      {/* Header skeleton — matches PreviewHeader layout */}
      <Group className={classes.skeletonHeader} gap="md" wrap="nowrap">
        <Skeleton circle height={32} width={32} className={classes.skeletonIcon} />
        <Stack gap={6} style={{ flex: 1 }}>
          <Skeleton height={14} width="55%" radius="sm" />
          <Skeleton height={10} width="35%" radius="sm" />
        </Stack>
      </Group>

      {/* Body skeleton — matches the centred icon + label layout */}
      <Stack align="center" justify="center" gap="md" className={classes.skeletonBody}>
        <Skeleton circle height={64} width={64} />
        <Skeleton height={16} width={180} radius="sm" />
        <Skeleton height={12} width={120} radius="sm" />
      </Stack>
    </Stack>
  );
}
