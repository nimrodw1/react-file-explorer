import { Stack } from '@mantine/core';
import { PreviewHeader } from '@/ui/molecules/PreviewHeader/PreviewHeader';
import { EmptyState } from '@/ui/molecules/EmptyState/EmptyState';
import type { FSNode } from '@/types/fileSystem';
import { isFile } from '@/types/fileSystem';
import { DocumentPreview } from './previews/DocumentPreview';
import { MusicPreview } from './previews/MusicPreview';
import { ImagePreview } from './previews/ImagePreview';
import { VideoPreview } from './previews/VideoPreview';
import { FilePreviewSkeleton } from './FilePreviewSkeleton';
import classes from './FilePreview.module.css';

export interface FilePreviewProps {
  node: FSNode | null;
  /** True on the very first load — no previous data to show yet. Renders a skeleton. */
  isLoading: boolean;
  /** True while fetching a new node but previous data is still displayed. Adds a dim overlay. */
  isFetching?: boolean;
}

function CategoryPreviewRouter({ node }: { node: FSNode }) {
  if (!isFile(node)) {
    return (
      <EmptyState
        title={node.name}
        description={`This folder contains ${node.childCount} item${node.childCount !== 1 ? 's' : ''}.`}
      />
    );
  }

  switch (node.category) {
    case 'document':
      return <DocumentPreview node={node} />;
    case 'music':
      return <MusicPreview node={node} />;
    case 'image':
      return <ImagePreview node={node} />;
    case 'video':
      return <VideoPreview node={node} />;
  }
}

export function FilePreview({ node, isLoading, isFetching = false }: FilePreviewProps) {
  if (isLoading) {
    return <FilePreviewSkeleton />;
  }

  if (!node) {
    return (
      <Stack className={classes.root}>
        <EmptyState />
      </Stack>
    );
  }

  return (
    <Stack
      gap={0}
      className={`${classes.root} ${isFetching ? classes.fetching : ''}`}
    >
      <PreviewHeader node={node} />
      <div className={classes.body}>
        <CategoryPreviewRouter node={node} />
      </div>
    </Stack>
  );
}
