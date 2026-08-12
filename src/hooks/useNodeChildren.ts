import { useQuery } from '@tanstack/react-query';
import { useService } from '@/services/ServiceContext';
import type { NodeId } from '@/types/fileSystem';
import { serializeFilter, type NodeFilter } from '@/types/filters';

export function useNodeChildren(folderId: NodeId | null, filter: NodeFilter) {
  const service = useService();
  const filterKey = serializeFilter(filter);

  return useQuery({
    queryKey: ['explore', folderId ?? null, filterKey],
    queryFn: () => service.explore(filter, { parentNodeId: folderId ?? undefined }),
    staleTime: 30_000,
  });
}
