import type { FSNode, NodeId } from '@/types/fileSystem';
import { NodeFilterSchema, type NodeFilter } from '@/types/filters';
import type { IFileSystemService, NodeDetails } from '../IFileSystemService';
import { CHILDREN_MAP, NODE_MAP, ROOT_IDS, computeNodePath } from './mockData';
import { isFilterActive, searchAll } from './utils';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const randomDelay = () => sleep(150 + Math.random() * 200);

export class MockFileSystemService implements IFileSystemService {
  /**
   * Lists the immediate children of a folder (or root when parentNodeId is omitted).
   * When a filter is active, performs a global flat search across the entire tree
   * instead — results surface regardless of their position in the hierarchy.
   */
  async explore(filter: NodeFilter, options?: { parentNodeId?: NodeId }): Promise<FSNode[]> {
    await randomDelay();
    const validated = NodeFilterSchema.parse(filter);

    if (isFilterActive(validated)) {
      return searchAll(validated);
    }

    const { parentNodeId } = options ?? {};

    if (parentNodeId) {
      const childIds = CHILDREN_MAP.get(parentNodeId) ?? [];
      return childIds.map((id) => NODE_MAP.get(id)!).filter(Boolean);
    }

    return ROOT_IDS.map((id) => NODE_MAP.get(id)!).filter(Boolean);
  }

  /**
   * Returns the full node data together with its slash-separated ancestor path.
   * Combines what used to be two separate calls (getNodeById + getNodePath).
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
