#!/usr/bin/env node
/**
 * Generates src/services/mock/mockData.json
 *
 * Constraints:
 *  - Max depth 4 (root = depth 0, deepest leaf = depth 3; no folders at depth 3)
 *  - Less than 4% of folders are empty
 *  - Category distribution: document-heavy (40% doc / 30% img / 20% music / 10% video)
 *
 * Run: node scripts/generateMockData.mjs [--entries <number>]
 */

import { faker } from '@faker-js/faker';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

faker.seed(42);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const entriesIdx = args.indexOf('--entries');
const TARGET = entriesIdx !== -1 ? parseInt(args[entriesIdx + 1], 10) : 10_000;
if (isNaN(TARGET) || TARGET < 1) {
  console.error('--entries must be a positive integer');
  process.exit(1);
}

// ─── Name pools ──────────────────────────────────────────────────────────────

const EXTENSIONS = {
  document: ['.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.md', '.csv'],
  music: ['.mp3', '.flac', '.wav', '.m4a', '.aac', '.ogg'],
  image: ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif'],
  video: ['.mp4', '.mov', '.webm', '.avi', '.mkv'],
};

// Weighted category pool: 4× document, 3× image, 2× music, 1× video
const CATEGORY_POOL = [
  'document', 'document', 'document', 'document',
  'image', 'image', 'image',
  'music', 'music',
  'video',
];

const ROOT_FOLDER_NAMES = [
  'Projects', 'Documents', 'Media', 'Archive', 'Downloads',
  'Work', 'Personal', 'Backup', 'Shared', 'Clients',
  'Resources', 'Assets', 'Library', 'Portfolio', 'Research',
  'Design', 'Engineering', 'Finance', 'Legal', 'Marketing',
  'Product', 'Sales', 'HR', 'Operations', 'Support',
];

const POOL_SIZE = 1_000;

const FOLDER_NAME_POOL = Array.from({ length: POOL_SIZE }, () =>
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

function buildFileNamePool(category) {
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

const FILE_NAME_POOLS = {
  document: buildFileNamePool('document'),
  music: buildFileNamePool('music'),
  image: buildFileNamePool('image'),
  video: buildFileNamePool('video'),
};

// ─── Fast inline PRNG (Mulberry32) ───────────────────────────────────────────

let _rng = 0xdeadbeef;
function rng() {
  _rng |= 0;
  _rng = (_rng + 0x6d2b79f5) | 0;
  let t = Math.imul(_rng ^ (_rng >>> 15), 1 | _rng);
  t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
}
function rngInt(lo, hi) {
  return lo + Math.floor(rng() * (hi - lo + 1));
}
function pickFrom(arr) {
  return arr[Math.floor(rng() * arr.length)];
}
function randDate() {
  return new Date(Date.now() - rng() * 3 * 365 * 86_400_000).toISOString();
}

// ─── Node factory ────────────────────────────────────────────────────────────

let idCounter = 0;
const allNodes = [];
const childCountMap = new Map();

function createFolder(name, parentId) {
  const id = `f-${++idCounter}`;
  if (parentId !== null) {
    childCountMap.set(parentId, (childCountMap.get(parentId) ?? 0) + 1);
  }
  const node = { id, name, type: 'folder', parentId, childCount: 0, updatedAt: randDate() };
  allNodes.push(node);
  return node;
}

function createFile(parentId) {
  const category = pickFrom(CATEGORY_POOL);
  const id = `fi-${++idCounter}`;
  if (parentId !== null) {
    childCountMap.set(parentId, (childCountMap.get(parentId) ?? 0) + 1);
  }
  allNodes.push({
    id,
    name: pickFrom(FILE_NAME_POOLS[category]),
    type: 'file',
    category,
    parentId,
    size: rngInt(1_024, 100 * 1_024 * 1_024),
    updatedAt: randDate(),
  });
}

// ─── Phase 1: Build folder skeleton (3 levels of folders, depth 0–2) ─────────
//
// Depth 0 → root folders (parentId = null)
// Depth 1 → children of root folders
// Depth 2 → children of depth-1 folders  ← leaf folders (no sub-folders)
//
// Files can live at any depth (0–3); depth-3 files are children of depth-2 folders.
//
// All counts scale proportionally with TARGET so --entries works at any size.
// At TARGET=10,000 the defaults reproduce the original fixed values.

const numRoot = Math.min(ROOT_FOLDER_NAMES.length, Math.max(2, Math.round(TARGET / 400)));
const d1Min = Math.max(1, Math.round(TARGET / 1_600));
const d1Max = Math.max(d1Min + 1, Math.round(TARGET / 1_000));
const d2Min = Math.max(1, Math.round(TARGET / 2_900));
const d2Max = Math.max(d2Min + 1, Math.round(TARGET / 1_500));

const rootFolders = ROOT_FOLDER_NAMES.slice(0, numRoot).map((name) => createFolder(name, null));

const depth1Folders = [];
for (const root of rootFolders) {
  const count = rngInt(d1Min, d1Max);
  for (let i = 0; i < count; i++) {
    depth1Folders.push(createFolder(pickFrom(FOLDER_NAME_POOL), root.id));
  }
}

const depth2Folders = [];
for (const f of depth1Folders) {
  const count = rngInt(d2Min, d2Max);
  for (let i = 0; i < count; i++) {
    depth2Folders.push(createFolder(pickFrom(FOLDER_NAME_POOL), f.id));
  }
}

const allFolders = [...rootFolders, ...depth1Folders, ...depth2Folders];

// ─── Phase 2: Guarantee ≥ 1 file per folder (ensures 0% empty folders) ───────

for (const folder of allFolders) {
  createFile(folder.id);
}

// ─── Phase 3: Fill remaining slots with files distributed across all folders ─

const filesRemaining = TARGET - allNodes.length;
for (let i = 0; i < filesRemaining; i++) {
  createFile(pickFrom(allFolders).id);
}

// ─── Back-fill childCount ─────────────────────────────────────────────────────

for (const node of allNodes) {
  if (node.type === 'folder') {
    node.childCount = childCountMap.get(node.id) ?? 0;
  }
}

// ─── Verify constraints ───────────────────────────────────────────────────────

const folders = allNodes.filter((n) => n.type === 'folder');
const files = allNodes.filter((n) => n.type === 'file');
const emptyFolders = folders.filter((n) => n.childCount === 0);
const emptyPct = ((emptyFolders.length / folders.length) * 100).toFixed(2);
const depths = new Map();
function getDepth(nodeId) {
  let d = 0;
  let cur = allNodes.find((n) => n.id === nodeId);
  while (cur?.parentId) {
    cur = allNodes.find((n) => n.id === cur.parentId);
    d++;
  }
  return d;
}
// spot-check max depth using a sample of leaf files
const sampleFiles = files.slice(-50);
let maxDepth = 0;
const nodeById = new Map(allNodes.map((n) => [n.id, n]));
for (const file of sampleFiles) {
  let d = 0;
  let cur = file;
  while (cur?.parentId) {
    cur = nodeById.get(cur.parentId);
    d++;
  }
  if (d > maxDepth) maxDepth = d;
}

console.log('=== Generation summary ===');
console.log(`Total nodes  : ${allNodes.length}`);
console.log(`  Folders    : ${folders.length}`);
console.log(`  Files      : ${files.length}`);
console.log(`Empty folders: ${emptyFolders.length} (${emptyPct}%)`);
console.log(`Max depth (sampled): ${maxDepth}`);
console.log(`Depth-0 folders : ${rootFolders.length}  (range: ${numRoot})`);
console.log(`Depth-1 folders : ${depth1Folders.length}  (${d1Min}–${d1Max} per root)`);
console.log(`Depth-2 folders : ${depth2Folders.length}  (${d2Min}–${d2Max} per depth-1)`);

const outPath = join(__dirname, '../src/services/mock/mockData.json');
writeFileSync(outPath, JSON.stringify(allNodes, null, 2), 'utf-8');
console.log(`\nWritten → ${outPath}`);
