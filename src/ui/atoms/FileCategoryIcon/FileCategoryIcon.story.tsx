import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@mantine/core';
import { FileCategoryIcon } from './FileCategoryIcon';

const meta: Meta<typeof FileCategoryIcon> = {
  title: 'atoms/FileCategoryIcon',
  component: FileCategoryIcon,
  argTypes: {
    category: {
      control: 'select',
      options: ['document', 'music', 'image', 'video', 'folder'],
    },
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
    folderOpen: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof FileCategoryIcon>;

export const Document: Story = { args: { category: 'document' } };
export const Music: Story = { args: { category: 'music' } };
export const Image: Story = { args: { category: 'image' } };
export const Video: Story = { args: { category: 'video' } };
export const Folder: Story = { args: { category: 'folder' } };
export const FolderOpen: Story = { args: { category: 'folder', folderOpen: true } };

export const AllCategories: Story = {
  render: () => (
    <Group gap="lg">
      <FileCategoryIcon category="document" />
      <FileCategoryIcon category="music" />
      <FileCategoryIcon category="image" />
      <FileCategoryIcon category="video" />
      <FileCategoryIcon category="folder" />
      <FileCategoryIcon category="folder" folderOpen />
    </Group>
  ),
};

export const Interactive: Story = {
  args: { category: 'document', size: 18, folderOpen: false },
};
