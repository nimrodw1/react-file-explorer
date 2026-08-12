import { type FSNode, isFile } from '@/types/fileSystem';
import { isFilterActive, type NodeFilter } from '@/types/filters';
import { NODE_MAP } from './mockData';

export { isFilterActive };

export function matchesFilter(node: FSNode, filter: NodeFilter): boolean {
  const { query, category } = filter;
  if (query && !node.name.toLowerCase().includes(query.toLowerCase())) {
    return false;
  }
  // Category only applies to files; folders are excluded when a category is selected
  if (category && (!isFile(node) || node.category !== category)) {
    return false;
  }
  return true;
}

export function searchAll(filter: NodeFilter): FSNode[] {
  return [...NODE_MAP.values()].filter((node) => matchesFilter(node, filter));
}
