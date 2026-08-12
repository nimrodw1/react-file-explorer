import type { FSNode, NodeId } from '@/types/fileSystem';
import { NodeFilterSchema, type NodeFilter } from '@/types/filters';
import type { IFileSystemService, NodeDetails, SearchPage } from '../IFileSystemService';
import { CHILDREN_MAP, NODE_MAP, ROOT_IDS, computeNodePath } from './mockData';
import { searchAll } from './utils';

const SEARCH_PAGE_SIZE = 100;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const randomDelay = () => sleep(150 + Math.random() * 200);

export class MockFileSystemService implements IFileSystemService {
  /**
   * Lists the immediate children of a folder (or root when parentNodeId is omitted).
   * Only used in tree-browse mode — search/filter calls go through search() instead.
   */
  async explore(filter: NodeFilter, options?: { parentNodeId?: NodeId }): Promise<FSNode[]> {
    await randomDelay();
    NodeFilterSchema.parse(filter);

    const { parentNodeId } = options ?? {};

    if (parentNodeId) {
      const childIds = CHILDREN_MAP.get(parentNodeId) ?? [];
      return childIds.map((id) => NODE_MAP.get(id)!).filter(Boolean);
    }

    return ROOT_IDS.map((id) => NODE_MAP.get(id)!).filter(Boolean);
  }

  /**
   * Paginated search across the entire tree.
   * Uses pre-built indices so category + text queries are sub-linear.
   */
  async search(
    filter: NodeFilter,
    options?: { cursor?: string; limit?: number }
  ): Promise<SearchPage> {
    await randomDelay();
    const validated = NodeFilterSchema.parse(filter);
    const all = searchAll(validated);
    const limit = options?.limit ?? SEARCH_PAGE_SIZE;
    const offset = options?.cursor ? parseInt(options.cursor, 10) : 0;
    const nodes = all.slice(offset, offset + limit);
    const nextCursor = offset + limit < all.length ? String(offset + limit) : null;
    return { nodes, nextCursor, totalCount: all.length };
  }

  /**
   * Returns the full node data together with its slash-separated ancestor path.
   */
  async details(nodeId: NodeId): Promise<NodeDetails> {
    await randomDelay();
    const node = NODE_MAP.get(nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }
    return { node, path: computeNodePath(nodeId) };
  }
}
