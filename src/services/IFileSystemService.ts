import type { FSNode, NodeId } from '@/types/fileSystem';
import type { NodeFilter } from '@/types/filters';

export interface IFileSystemService {
  getRootChildren(filter?: NodeFilter): Promise<FSNode[]>;
  getChildren(folderId: NodeId, filter?: NodeFilter): Promise<FSNode[]>;
  getNodeById(id: NodeId): Promise<FSNode>;
  /** Returns a slash-separated ancestor path, e.g. "Media / Photos". Empty string for root nodes. */
  getNodePath(id: NodeId): Promise<string>;
}
