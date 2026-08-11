import type { Meta, StoryObj } from '@storybook/react';
import { TreeRow } from './TreeRow';
import type { FileNode, FolderNode } from '@/types/fileSystem';

const meta: Meta<typeof TreeRow> = {
  title: 'molecules/TreeRow',
  component: TreeRow,
  argTypes: {
    depth: { control: { type: 'range', min: 0, max: 5, step: 1 } },
    isExpanded: { control: 'boolean' },
    isSelected: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof TreeRow>;

const fileNode: FileNode = {
  id: 'f1',
  name: 'Project Brief.pdf',
  type: 'file',
  category: 'document',
  parentId: null,
  size: 204800,
  updatedAt: '2026-01-01T00:00:00Z',
};

const folderNode: FolderNode = {
  id: 'folder1',
  name: 'Documents',
  type: 'folder',
  parentId: null,
  childCount: 3,
  updatedAt: '2026-01-01T00:00:00Z',
};

export const FileRow: Story = {
  args: { node: fileNode, depth: 0, isExpanded: false, isSelected: false },
};

export const FolderCollapsed: Story = {
  args: { node: folderNode, depth: 0, isExpanded: false, isSelected: false },
};

export const FolderExpanded: Story = {
  args: { node: folderNode, depth: 0, isExpanded: true, isSelected: false },
};

export const Selected: Story = {
  args: { node: fileNode, depth: 0, isExpanded: false, isSelected: true },
};

export const Nested: Story = {
  args: { node: fileNode, depth: 3, isExpanded: false, isSelected: false },
};

export const FolderLoading: Story = {
  args: { node: folderNode, depth: 0, isExpanded: true, isSelected: false, isLoading: true },
};

export const Interactive: Story = {
  args: {
    node: folderNode,
    depth: 0,
    isExpanded: false,
    isSelected: false,
    isLoading: false,
    onToggle: () => {},
    onSelect: () => {},
  },
};
