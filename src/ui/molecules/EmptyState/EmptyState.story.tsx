import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'molecules/EmptyState',
  component: EmptyState,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const NoResults: Story = {
  args: {
    title: 'No results',
    description: 'Try adjusting your search query or removing filters.',
  },
};

export const Interactive: Story = {
  args: {
    title: 'Nothing selected',
    description: 'Select a file or folder from the tree to preview it here.',
  },
};
