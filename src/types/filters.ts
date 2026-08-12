import { z } from 'zod';
import { FILE_CATEGORIES } from './fileSystem';

export const NodeFilterSchema = z.object({
  query: z.string().optional(),
  category: z.enum(FILE_CATEGORIES).optional(),
});

export type NodeFilter = z.infer<typeof NodeFilterSchema>;

export function serializeFilter(filter: NodeFilter): string {
  return JSON.stringify({ query: filter.query ?? '', category: filter.category ?? '' });
}

export const EMPTY_FILTER: NodeFilter = {};

export function isFilterActive(filter: NodeFilter): boolean {
  return !!(filter.query || filter.category);
}
