import { type FSNode } from '@/types/fileSystem';
import { isFilterActive, type NodeFilter } from '@/types/filters';
import { CATEGORY_INDEX, LOWERCASE_NAME, NODE_MAP } from './mockData';

export { isFilterActive };

/**
 * Full-scan candidate set for a filter:
 *   - category set    → O(1) lookup from CATEGORY_INDEX (pre-built inverted index)
 *   - no category     → all nodes in NODE_MAP
 * Then narrow by query using pre-computed lowercase names — no per-call allocations.
 */
export function searchAll(filter: NodeFilter): FSNode[] {
  const { query, category } = filter;
  const lowerQuery = query ? query.toLowerCase() : null;

  // Category index gives an already-narrowed candidate list in O(1)
  const candidates: Iterable<FSNode> = category
    ? (CATEGORY_INDEX.get(category) ?? [])
    : NODE_MAP.values();

  if (!lowerQuery) {
    return [...candidates];
  }

  const results: FSNode[] = [];
  for (const node of candidates) {
    if (LOWERCASE_NAME.get(node.id)!.includes(lowerQuery)) {
      results.push(node);
    }
  }
  return results;
}
