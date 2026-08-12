import { useTransition } from 'react';
import { useFilterParams } from '@/hooks/useFilterParams';
import type { FileCategory } from '@/types/fileSystem';
import { Omnibar } from '@/ui/organisms/Omnibar/Omnibar';

export function OmnibarContainer() {
  const { activeFilter, setQueryFilter, setCategoryFilter } = useFilterParams();
  const [, startTransition] = useTransition();

  const handleQueryChange = (query: string) => {
    startTransition(() => setQueryFilter(query));
  };

  const handleCategoryChange = (category: FileCategory | undefined) => {
    setCategoryFilter(category);
  };

  return (
    <Omnibar
      query={activeFilter.query ?? ''}
      category={activeFilter.category}
      onQueryChange={handleQueryChange}
      onCategoryChange={handleCategoryChange}
    />
  );
}
