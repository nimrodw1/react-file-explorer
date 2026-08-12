import { render, screen } from '@test-utils';
import type { FileNode } from '@/types/fileSystem';
import { FileTree, type VirtualRow } from './FileTree';

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
        hasBreadcrumbs={false}
        isRootLoading
        onSelect={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByRole('status', { name: /loading files/i })).toBeInTheDocument();
  });

  it('renders empty folder state when no rows, no filter, and not loading', () => {
    render(
      <FileTree
        flatRows={[]}
        selectedId={null}
        hasBreadcrumbs={false}
        isRootLoading={false}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText(/this folder is empty/i)).toBeInTheDocument();
  });

  it('renders no results state when no rows and filter is active', () => {
    render(
      <FileTree
        flatRows={[]}
        selectedId={null}
        hasBreadcrumbs
        isRootLoading={false}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText(/no results/i)).toBeInTheDocument();
  });

  it('renders tree role', () => {
    render(
      <FileTree
        flatRows={rows}
        selectedId={null}
        hasBreadcrumbs={false}
        isRootLoading={false}
        onSelect={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });
});
