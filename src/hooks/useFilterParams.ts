import { useSearchParams } from 'react-router-dom';
import type { FileCategory } from '@/types/fileSystem';
import { NodeFilterSchema, EMPTY_FILTER, type NodeFilter } from '@/types/filters';

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // safeParse: invalid category values in the URL fall back gracefully
  const result = NodeFilterSchema.safeParse({
    query: searchParams.get('query') ?? undefined,
    category: searchParams.get('category') ?? undefined,
  });
  const activeFilter: NodeFilter = result.success ? result.data : EMPTY_FILTER;

  const setQueryFilter = (query: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (query) {
          next.set('query', query);
        } else {
          next.delete('query');
        }
        return next;
      },
      { replace: true } // typing never adds history entries
    );
  };

  const setCategoryFilter = (category: FileCategory | undefined) => {
    // replace: false (default) → back button can undo a category selection
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (category) {
        next.set('category', category);
      } else {
        next.delete('category');
      }
      return next;
    });
  };

  return { activeFilter, setQueryFilter, setCategoryFilter };
}
