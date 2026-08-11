import { useQuery } from '@tanstack/react-query';
import { useService } from '@/services/ServiceContext';
import { serializeFilter, type NodeFilter } from '@/types/filters';
import type { NodeId } from '@/types/fileSystem';

const ROOT_KEY = '__root__';

export function useNodeChildren(folderId: NodeId | null, filter: NodeFilter) {
  const service = useService();
  const filterKey = serializeFilter(filter);

  return useQuery({
    queryKey: ['children', folderId ?? ROOT_KEY, filterKey],
    queryFn: () =>
      folderId === null
        ? service.getRootChildren(filter)
        : service.getChildren(folderId, filter),
    staleTime: 30_000,
  });
}
