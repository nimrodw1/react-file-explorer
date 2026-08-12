import { useEffect, useState, useTransition } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useFilterParams } from '@/hooks/useFilterParams';
import type { FileCategory } from '@/types/fileSystem';
import { Omnibar } from '@/ui/organisms/Omnibar/Omnibar';

const DEBOUNCE_MS = 300;

export function OmnibarContainer() {
  const { activeFilter, setQueryFilter, setCategoryFilter } = useFilterParams();
  const [, startTransition] = useTransition();

  // draftQuery drives the visible input; debouncedQuery is committed to the URL.
  // This prevents a React Query invalidation on every keystroke.
  const [draftQuery, setDraftQuery] = useState(activeFilter.query ?? '');
  const [debouncedQuery] = useDebouncedValue(draftQuery, DEBOUNCE_MS);

  // Commit the debounced value to the URL (triggers React Query).
  useEffect(() => {
    startTransition(() => setQueryFilter(debouncedQuery));
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the input in sync when the URL changes externally (back button, direct nav).
  useEffect(() => {
    setDraftQuery(activeFilter.query ?? '');
  }, [activeFilter.query]);

  const handleQueryChange = (query: string) => setDraftQuery(query);

  const handleCategoryChange = (category: FileCategory | undefined) => {
    setCategoryFilter(category);
  };

  return (
    <Omnibar
      query={draftQuery}
      category={activeFilter.category}
      onQueryChange={handleQueryChange}
      onCategoryChange={handleCategoryChange}
    />
  );
}
