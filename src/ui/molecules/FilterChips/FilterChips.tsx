import { Badge, Group } from '@mantine/core';
import type { FileCategory } from '@/types/fileSystem';
import { FILE_CATEGORIES } from '@/types/fileSystem';
import classes from './FilterChips.module.css';

const LABELS: Record<FileCategory | 'all', string> = {
  all: 'All',
  document: 'Documents',
  music: 'Music',
  image: 'Images',
  video: 'Videos',
};

const ALL_OPTIONS: (FileCategory | 'all')[] = ['all', ...FILE_CATEGORIES];

export interface FilterChipsProps {
  value: FileCategory | undefined;
  onChange: (category: FileCategory | undefined) => void;
}

export function FilterChips({ value, onChange }: FilterChipsProps) {
  const handleClick = (option: FileCategory | 'all') => {
    if (option === 'all') {
      onChange(undefined);
    } else {
      onChange(value === option ? undefined : option);
    }
  };

  return (
    <Group gap="xs" className={classes.root} role="group" aria-label="Filter by type">
      {ALL_OPTIONS.map((option) => {
        const isActive = option === 'all' ? value === undefined : value === option;
        return (
          <Badge
            key={option}
            variant={isActive ? 'filled' : 'light'}
            color={isActive ? 'blue' : 'gray'}
            className={classes.chip}
            component="button"
            onClick={() => handleClick(option)}
            aria-pressed={isActive}
          >
            {LABELS[option]}
          </Badge>
        );
      })}
    </Group>
  );
}
