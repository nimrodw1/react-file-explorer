export type NodeId = string;
export type NodeType = 'file' | 'folder';
export type FileCategory = 'document' | 'music' | 'image' | 'video';

export const FILE_CATEGORIES: [FileCategory, ...FileCategory[]] = [
  'document',
  'music',
  'image',
  'video',
];

interface BaseNode {
  id: NodeId;
  name: string;
  type: NodeType;
  parentId: NodeId | null;
  updatedAt: string; // ISO 8601
}

export interface FileNode extends BaseNode {
  type: 'file';
  category: FileCategory;
  size: number; // bytes
}

export interface FolderNode extends BaseNode {
  type: 'folder';
  childCount: number;
}

export type FSNode = FileNode | FolderNode;

export function isFile(node: FSNode): node is FileNode {
  return node.type === 'file';
}

export function isFolder(node: FSNode): node is FolderNode {
  return node.type === 'folder';
}
