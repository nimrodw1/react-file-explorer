import { faker } from '@faker-js/faker';
import type { FileCategory, FileNode, FolderNode, FSNode } from '@/types/fileSystem';

faker.seed(42);

// ─── Pre-generated name pools ─────────────────────────────────────────────────
// Calling faker per-node for 500k nodes would add seconds to startup.
// Instead we generate small pools once and pick from them via a fast inline RNG.

const POOL_SIZE = 2_000;

const EXTENSIONS: Record<FileCategory, string[]> = {
  document: ['.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.md', '.csv'],
  music: ['.mp3', '.flac', '.wav', '.m4a', '.aac', '.ogg'],
  image: ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif'],
  video: ['.mp4', '.mov', '.webm', '.avi', '.mkv'],
};

function buildFilePool(category: FileCategory): string[] {
  return Array.from({ length: POOL_SIZE }, () => {
    const ext = faker.helpers.arrayElement(EXTENSIONS[category]);
    switch (category) {
      case 'document': {
        const title = faker.lorem.words(faker.number.int({ min: 2, max: 4 }));
        return title.replace(/\b\w/g, (c) => c.toUpperCase()) + ext;
      }
      case 'music':
        return faker.music.songName() + ext;
      case 'image':
        return `${faker.lorem.word()}_${faker.number.int({ min: 100, max: 9999 })}${ext}`;
      case 'video':
        return faker.lorem.words(2).replace(/ /g, '_') + ext;
    }
  });
}

const FOLDER_POOL = Array.from({ length: POOL_SIZE }, () =>
  faker.helpers.arrayElement([
    faker.commerce.department(),
    `${faker.date.past({ years: 5 }).getFullYear()}`,
    `${faker.word.adjective()} ${faker.word.noun()}`,
    faker.helpers.arrayElement(['Archive', 'Backup', 'Draft', 'Final', 'Review', 'Old', 'New', 'Misc']),
    faker.company.buzzNoun(),
    faker.person.firstName(),
    `v${faker.number.int({ min: 1, max: 9 })}.${faker.number.int({ min: 0, max: 9 })}`,
  ])
);

const FILE_POOLS: Record<FileCategory, string[]> = {
  document: buildFilePool('document'),
  music: buildFilePool('music'),
  image: buildFilePool('image'),
  video: buildFilePool('video'),
};

const ROOT_FOLDERS = [
  'Projects', 'Documents', 'Media', 'Archive', 'Downloads',
  'Work', 'Personal', 'Backup', 'Shared', 'Clients',
  'Resources', 'Assets', 'Library', 'Portfolio', 'Research',
  'Design', 'Engineering', 'Finance', 'Legal', 'Marketing',
  'Product', 'Sales', 'HR', 'Operations', 'Support',
  'Data', 'Reports', 'Templates', 'Exports', 'Imports',
];

// File category distribution weights (document-heavy, like a real disk)
const CATEGORY_POOL: FileCategory[] = [
  'document', 'document', 'document', 'document',
  'image', 'image', 'image',
  'music', 'music',
  'video',
];

// ─── Fast inline PRNG (Mulberry32, seeded) ────────────────────────────────────
// After the faker pool is built (deterministic via faker.seed), we use this fast
// PRNG for structural decisions so node generation stays O(1) per node.
let _rng = 0xdeadbeef;
function rng(): number {
  _rng |= 0;
  _rng = _rng + 0x6d2b79f5 | 0;
  let t = Math.imul(_rng ^ (_rng >>> 15), 1 | _rng);
  t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
}
function rngInt(lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}
function pickPool<T>(pool: T[]): T {
  return pool[Math.floor(rng() * pool.length)];
}

// ─── Generator ────────────────────────────────────────────────────────────────

const TARGET = 10_000;
const MAX_DEPTH = 5; // depth is 0-indexed, so 5 means levels 0–4

let idCounter = 0;
const allNodes: FSNode[] = [];
const childrenCountMap = new Map<string, number>();

function addChild(parentId: string | null): void {
  if (parentId) childrenCountMap.set(parentId, (childrenCountMap.get(parentId) ?? 0) + 1);
}

function createFolder(name: string, parentId: string | null): FolderNode {
  const id = `f-${++idCounter}`;
  addChild(parentId);
  const node: FolderNode = {
    id,
    name,
    type: 'folder',
    parentId,
    childCount: 0,
    updatedAt: new Date(Date.now() - rng() * 3 * 365 * 86400_000).toISOString(),
  };
  allNodes.push(node);
  return node;
}

function createFile(parentId: string | null): void {
  const category = pickPool(CATEGORY_POOL);
  const id = `fi-${++idCounter}`;
  addChild(parentId);
  allNodes.push({
    id,
    name: pickPool(FILE_POOLS[category]),
    type: 'file',
    category,
    parentId,
    size: rngInt(1_024, 100 * 1_024 * 1_024),
    updatedAt: new Date(Date.now() - rng() * 3 * 365 * 86400_000).toISOString(),
  } satisfies FileNode);
}

function generate(parentId: string | null, depth: number): void {
  if (allNodes.length >= TARGET) return;

  const isRoot = depth === 0;
  const atLeaf = depth >= MAX_DEPTH - 1; // depth 4 = 5th level, no more folders

  const numFolders = atLeaf ? 0 : rngInt(
    isRoot ? 20 : 2,
    isRoot ? 25 : 8,
  );
  const numFiles = rngInt(isRoot ? 0 : 3, isRoot ? 2 : 14);

  const folders: FolderNode[] = [];
  for (let i = 0; i < numFolders && allNodes.length < TARGET; i++) {
    const name = isRoot ? ROOT_FOLDERS[i % ROOT_FOLDERS.length] : pickPool(FOLDER_POOL);
    folders.push(createFolder(name, parentId));
  }

  for (let i = 0; i < numFiles && allNodes.length < TARGET; i++) {
    createFile(parentId);
  }

  for (const folder of folders) {
    if (allNodes.length >= TARGET) break;
    generate(folder.id, depth + 1);
  }
}

generate(null, 0);

// Back-fill childCount now that all children are known
for (const node of allNodes) {
  if (node.type === 'folder') {
    node.childCount = childrenCountMap.get(node.id) ?? 0;
  }
}

// ─── Exported maps ────────────────────────────────────────────────────────────

export const MOCK_NODES: FSNode[] = allNodes;

export const ROOT_IDS: string[] = MOCK_NODES
  .filter((n) => n.parentId === null)
  .map((n) => n.id);

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
    parts.unshift(parent.name);
    current = parent;
  }
  return parts.join(' / ');
}
