import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { FileCategory } from '@/types/fileSystem';
import { FilterChips } from './FilterChips';

const meta: Meta<typeof FilterChips> = {
  title: 'molecules/FilterChips',
  component: FilterChips,
};
export default meta;
type Story = StoryObj<typeof FilterChips>;

export const AllActive: Story = {
  args: { value: undefined, onChange: () => {} },
};

export const DocumentActive: Story = {
  args: { value: 'document', onChange: () => {} },
};

export const MusicActive: Story = {
  args: { value: 'music', onChange: () => {} },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<FileCategory | undefined>(undefined);
    return <FilterChips value={value} onChange={setValue} />;
  },
};
