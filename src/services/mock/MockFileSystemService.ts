import { NodeFilterSchema, type NodeFilter } from '@/types/filters';
import { type FSNode, type NodeId, isFile } from '@/types/fileSystem';
import type { IFileSystemService } from '../IFileSystemService';
import { CHILDREN_MAP, NODE_MAP, ROOT_IDS, computeNodePath } from './mockData';

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const randomDelay = () => sleep(500 + Math.random() * 1000);

function isFilterActive(filter: NodeFilter): boolean {
  return !!(filter.query || filter.category);
}

function matchesFilter(node: FSNode, filter: NodeFilter): boolean {
  const { query, category } = filter;
  if (query && !node.name.toLowerCase().includes(query.toLowerCase())) return false;
  // Category only applies to files; folders are excluded when a category is selected
  if (category && (!isFile(node) || node.category !== category)) return false;
  return true;
}

// When a filter is active, search the entire tree and return a flat result list.
// This mirrors standard file-explorer search: results surface regardless of their
// position in the hierarchy, so nested files are never hidden behind unmatched parents.
function searchAll(filter: NodeFilter): FSNode[] {
  return [...NODE_MAP.values()].filter((node) => matchesFilter(node, filter));
}

export class MockFileSystemService implements IFileSystemService {
  async getRootChildren(filter?: NodeFilter): Promise<FSNode[]> {
    await randomDelay();
    const validated = filter ? NodeFilterSchema.parse(filter) : {};
    if (isFilterActive(validated)) {
      return searchAll(validated);
    }
    return ROOT_IDS.map((id) => NODE_MAP.get(id)!).filter(Boolean);
  }

  async getChildren(folderId: NodeId, filter?: NodeFilter): Promise<FSNode[]> {
    await randomDelay();
    const validated = filter ? NodeFilterSchema.parse(filter) : {};
    // When a filter is active, getRootChildren already surfaces all matches globally.
    // Return empty here so the tree doesn't show duplicates under expanded folders.
    if (isFilterActive(validated)) return [];
    const childIds = CHILDREN_MAP.get(folderId) ?? [];
    return childIds.map((id) => NODE_MAP.get(id)!).filter(Boolean);
  }

  async getNodeById(id: NodeId): Promise<FSNode> {
    await randomDelay();
    const node = NODE_MAP.get(id);
    if (!node) throw new Error(`Node not found: ${id}`);
    return node;
  }

  async getNodePath(id: NodeId): Promise<string> {
    await sleep(0); // synchronous data, minimal delay
    return computeNodePath(id);
  }
}
