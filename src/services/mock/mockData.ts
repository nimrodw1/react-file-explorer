import { isFile, type FileCategory, type FSNode } from '@/types/fileSystem';
import rawNodes from './mockData.json';

export const MOCK_NODES: FSNode[] = rawNodes as FSNode[];

export const ROOT_IDS: string[] = MOCK_NODES.filter((n) => n.parentId === null).map((n) => n.id);

export const NODE_MAP = new Map<string, FSNode>(MOCK_NODES.map((n) => [n.id, n]));

export const CHILDREN_MAP = new Map<string, string[]>();
for (const node of MOCK_NODES) {
  if (node.parentId) {
    const siblings = CHILDREN_MAP.get(node.parentId) ?? [];
    siblings.push(node.id);
    CHILDREN_MAP.set(node.parentId, siblings);
  }
}

/**
 * Pre-computed lowercase name for every node — avoids per-search string allocations
 * inside the hot matchesFilter loop.
 */
export const LOWERCASE_NAME = new Map<string, string>(
  MOCK_NODES.map((n) => [n.id, n.name.toLowerCase()])
);

/**
 * Pre-built inverted index: category → all FileNodes in that category.
 * Turns category-only searches from O(N) full scan to O(1) lookup.
 */
export const CATEGORY_INDEX = new Map<FileCategory, FSNode[]>();
for (const node of MOCK_NODES) {
  if (isFile(node)) {
    const bucket = CATEGORY_INDEX.get(node.category) ?? [];
    bucket.push(node);
    CATEGORY_INDEX.set(node.category, bucket);
  }
}

export function computeNodePath(id: string): string {
  const parts: string[] = [];
  let current = NODE_MAP.get(id);
  while (current?.parentId) {
    const parent = NODE_MAP.get(current.parentId);
    if (!parent) {
      break;
    }
    parts.push(parent.name);
    current = parent;
  }
  return parts.reverse().join(' / ');
}
