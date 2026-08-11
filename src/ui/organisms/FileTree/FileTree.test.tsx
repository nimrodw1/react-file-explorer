import { render, screen } from '@test-utils';
import { FileTree, type VirtualRow } from './FileTree';
import type { FileNode } from '@/types/fileSystem';

const makeRow = (id: string, name: string): VirtualRow => ({
  node: {
    id,
    name,
    type: 'file',
    category: 'document',
    parentId: null,
    size: 1024,
    updatedAt: '2026-01-01T00:00:00Z',
  } as FileNode,
  depth: 0,
  isExpanded: false,
  isLoading: false,
});

const rows: VirtualRow[] = [
  makeRow('f1', 'Alpha.pdf'),
  makeRow('f2', 'Beta.docx'),
  makeRow('f3', 'Gamma.mp3'),
];

describe('FileTree', () => {
  it('renders loading state', () => {
    render(
      <FileTree
        flatRows={[]}
        selectedId={null}
        expandedIds={new Set()}
        isRootLoading
        onSelect={vi.fn()}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByRole('status', { name: /loading files/i })).toBeInTheDocument();
  });

  it('renders empty state when no rows and not loading', () => {
    render(
      <FileTree
        flatRows={[]}
        selectedId={null}
        expandedIds={new Set()}
        isRootLoading={false}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByText(/no files match/i)).toBeInTheDocument();
  });

  it('renders tree role', () => {
    render(
      <FileTree
        flatRows={rows}
        selectedId={null}
        expandedIds={new Set()}
        isRootLoading={false}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });
});
