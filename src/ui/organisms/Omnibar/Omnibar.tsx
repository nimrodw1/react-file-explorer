import { Select, Stack, TextInput } from '@mantine/core';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import type { FileCategory } from '@/types/fileSystem';
import classes from './Omnibar.module.css';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'document', label: 'Documents' },
  { value: 'music', label: 'Music' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
];

export interface OmnibarProps {
  query: string;
  category: FileCategory | undefined;
  onQueryChange: (query: string) => void;
  onCategoryChange: (category: FileCategory | undefined) => void;
}

export function Omnibar({ query, category, onQueryChange, onCategoryChange }: OmnibarProps) {
  return (
    <Stack gap="xs" className={classes.root}>
      <TextInput
        placeholder="Search files…"
        leftSection={<IconSearch size={16} aria-hidden />}
        value={query}
        onChange={(e) => onQueryChange(e.currentTarget.value)}
        aria-label="Search files"
        data-testid="search-input"
        classNames={{ input: classes.input }}
      />
      <Select
        data={CATEGORY_OPTIONS}
        value={category ?? ''}
        onChange={(val) => onCategoryChange((val || undefined) as FileCategory | undefined)}
        leftSection={<IconFilter size={14} aria-hidden />}
        aria-label="Filter by type"
        allowDeselect={false}
        size="xs"
        data-testid="category-select"
        classNames={{ input: classes.input }}
      />
    </Stack>
  );
}
