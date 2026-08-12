import type { FSNode, NodeId } from '@/types/fileSystem';
import type { NodeFilter } from '@/types/filters';

export interface NodeDetails {
  node: FSNode;
  /** Slash-separated ancestor path, e.g. "Media / Photos". Empty string for root nodes. */
  path: string;
}

export interface IFileSystemService {
  explore(filter: NodeFilter, options?: { parentNodeId?: NodeId }): Promise<FSNode[]>;
  details(nodeId: NodeId): Promise<NodeDetails>;
}
