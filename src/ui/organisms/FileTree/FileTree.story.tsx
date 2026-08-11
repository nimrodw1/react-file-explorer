import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box } from '@mantine/core';
import { FileTree, type VirtualRow } from './FileTree';
import type { FileNode, FolderNode } from '@/types/fileSystem';

const meta: Meta<typeof FileTree> = {
  title: 'organisms/FileTree',
  component: FileTree,
  decorators: [
    (Story) => (
      <Box style={{ height: 400, display: 'flex', flexDirection: 'column', border: '1px solid #eee' }}>
        <Story />
      </Box>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof FileTree>;

const makeFile = (id: string, name: string, depth: number): VirtualRow => ({
  node: {
    id,
    name,
    type: 'file',
    category: 'document',
    parentId: null,
    size: 1024,
    updatedAt: '2026-01-01T00:00:00Z',
  } as FileNode,
  depth,
  isExpanded: false,
  isLoading: false,
});

const makeFolder = (id: string, name: string, depth: number, isExpanded = false): VirtualRow => ({
  node: {
    id,
    name,
    type: 'folder',
    parentId: null,
    childCount: 2,
    updatedAt: '2026-01-01T00:00:00Z',
  } as FolderNode,
  depth,
  isExpanded,
  isLoading: false,
});

const sampleRows: VirtualRow[] = [
  makeFolder('f1', 'Documents', 0, true),
  makeFile('d1', 'Project Brief.pdf', 1),
  makeFile('d2', 'Meeting Notes.docx', 1),
  makeFolder('f2', 'Media', 0),
  makeFolder('f3', 'Music Library', 0, true),
  makeFile('m1', 'Chill Vibes.mp3', 1),
  makeFile('m2', 'Focus Mode.flac', 1),
];

// 1000-item list for perf demo
const largeRows: VirtualRow[] = Array.from({ length: 1000 }, (_, i) =>
  makeFile(`item-${i}`, `File ${String(i + 1).padStart(4, '0')}.txt`, 0),
);

export const Default: Story = {
  args: {
    flatRows: sampleRows,
    selectedId: null,
    expandedIds: new Set(['f1', 'f3']),
    isRootLoading: false,
    onSelect: () => {},
    onToggle: () => {},
  },
};

export const Loading: Story = {
  args: {
    flatRows: [],
    selectedId: null,
    expandedIds: new Set(),
    isRootLoading: true,
    onSelect: () => {},
    onToggle: () => {},
  },
};

export const Empty: Story = {
  args: {
    flatRows: [],
    selectedId: null,
    expandedIds: new Set(),
    isRootLoading: false,
    onSelect: () => {},
    onToggle: () => {},
  },
};

export const LargeList: Story = {
  args: {
    flatRows: largeRows,
    selectedId: null,
    expandedIds: new Set(),
    isRootLoading: false,
    onSelect: () => {},
    onToggle: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    return (
      <FileTree
        flatRows={sampleRows}
        selectedId={selectedId}
        expandedIds={new Set(['f1', 'f3'])}
        isRootLoading={false}
        onSelect={setSelectedId}
        onToggle={() => {}}
      />
    );
  },
};
