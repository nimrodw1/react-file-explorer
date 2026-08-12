import type { FSNode, NodeId } from '@/types/fileSystem';
import type { NodeFilter } from '@/types/filters';

export interface NodeDetails {
  node: FSNode;
  /** Slash-separated ancestor path, e.g. "Media / Photos". Empty string for root nodes. */
  path: string;
}

export interface SearchPage {
  nodes: FSNode[];
  /** Opaque cursor for the next page. Null when this is the last page. */
  nextCursor: string | null;
  /** Total number of nodes matching the filter (across all pages). */
  totalCount: number;
}

export interface IFileSystemService {
  /** Lists the immediate children of a folder, or root items when parentNodeId is omitted. */
  explore(filter: NodeFilter, options?: { parentNodeId?: NodeId }): Promise<FSNode[]>;

  /** Returns full node data plus its slash-separated ancestor path. */
  details(nodeId: NodeId): Promise<NodeDetails>;

  /**
   * Paginated search across the entire tree.
   * Returns one page of results plus a cursor for the next page.
   * Use with useInfiniteQuery for infinite-scroll UX.
   */
  search(filter: NodeFilter, options?: { cursor?: string; limit?: number }): Promise<SearchPage>;
}
