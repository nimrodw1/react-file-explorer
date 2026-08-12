import type { FSNode } from '@/types/fileSystem';
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

export function computeNodePath(id: string): string {
  const parts: string[] = [];
  let current = NODE_MAP.get(id);
  while (current?.parentId) {
    const parent = NODE_MAP.get(current.parentId);
    if (!parent) break;
    parts.push(parent.name);
    current = parent;
  }
  return parts.reverse().join(' / ');
}
