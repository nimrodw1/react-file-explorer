import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useService } from '@/services/ServiceContext';
import type { NodeId } from '@/types/fileSystem';

export function useFilePreview(nodeId: NodeId | null) {
  const service = useService();

  return useQuery({
    queryKey: ['node', nodeId],
    queryFn: () => service.getNodeById(nodeId!),
    enabled: nodeId !== null,
    staleTime: 60_000,
    // Keep showing the previous node's data while the new node is being fetched,
    // so the preview panel never goes blank between selections.
    placeholderData: keepPreviousData,
  });
}
