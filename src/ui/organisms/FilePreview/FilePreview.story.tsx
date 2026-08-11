import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mantine/core';
import type { FileNode, FolderNode } from '@/types/fileSystem';
import { FilePreview } from './FilePreview';

const meta: Meta<typeof FilePreview> = {
  title: 'organisms/FilePreview',
  component: FilePreview,
  decorators: [
    (Story) => (
      <Box style={{ height: 500, display: 'flex', border: '1px solid #eee' }}>
        <Story />
      </Box>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof FilePreview>;

const documentNode: FileNode = {
  id: 'd1',
  name: 'Project Brief.pdf',
  type: 'file',
  category: 'document',
  parentId: null,
  size: 204800,
  updatedAt: '2026-06-15T10:30:00Z',
};

const musicNode: FileNode = {
  id: 'm1',
  name: 'Chill Vibes.mp3',
  type: 'file',
  category: 'music',
  parentId: null,
  size: 8388608,
  updatedAt: '2026-05-01T08:00:00Z',
};

const imageNode: FileNode = {
  id: 'i1',
  name: 'Vacation 2025.jpg',
  type: 'file',
  category: 'image',
  parentId: null,
  size: 3145728,
  updatedAt: '2025-08-20T14:00:00Z',
};

const videoNode: FileNode = {
  id: 'v1',
  name: 'Demo Reel.mp4',
  type: 'file',
  category: 'video',
  parentId: null,
  size: 104857600,
  updatedAt: '2026-01-10T09:00:00Z',
};

const folderNode: FolderNode = {
  id: 'f1',
  name: 'Documents',
  type: 'folder',
  parentId: null,
  childCount: 5,
  updatedAt: '2026-07-01T00:00:00Z',
};

export const Empty: Story = { args: { node: null, isLoading: false } };
export const Loading: Story = { args: { node: null, isLoading: true } };
export const DocumentFile: Story = { args: { node: documentNode, isLoading: false } };
export const MusicFile: Story = { args: { node: musicNode, isLoading: false } };
export const ImageFile: Story = { args: { node: imageNode, isLoading: false } };
export const VideoFile: Story = { args: { node: videoNode, isLoading: false } };
export const FolderSelected: Story = { args: { node: folderNode, isLoading: false } };
