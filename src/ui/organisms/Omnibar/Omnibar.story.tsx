import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { FileCategory } from '@/types/fileSystem';
import { Omnibar } from './Omnibar';

const meta: Meta<typeof Omnibar> = {
  title: 'organisms/Omnibar',
  component: Omnibar,
  argTypes: {
    query: { control: 'text' },
    category: {
      control: 'select',
      options: [undefined, 'document', 'music', 'image', 'video'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Omnibar>;

export const Empty: Story = {
  args: { query: '', category: undefined, onQueryChange: () => {}, onCategoryChange: () => {} },
};

export const WithQuery: Story = {
  args: {
    query: 'project',
    category: undefined,
    onQueryChange: () => {},
    onCategoryChange: () => {},
  },
};

export const WithFilter: Story = {
  args: {
    query: '',
    category: 'image',
    onQueryChange: () => {},
    onCategoryChange: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<FileCategory | undefined>(undefined);
    return (
      <Omnibar
        query={query}
        category={category}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
      />
    );
  },
};
