import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import type { FileNode, FolderNode } from '@/types/fileSystem';
import { TreeRow } from './TreeRow';

const fileNode: FileNode = {
  id: 'f1',
  name: 'Project Brief.pdf',
  type: 'file',
  category: 'document',
  parentId: null,
  size: 204800,
  updatedAt: '2026-01-01T00:00:00Z',
};

const folderNode: FolderNode = {
  id: 'folder1',
  name: 'Documents',
  type: 'folder',
  parentId: null,
  childCount: 3,
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('TreeRow', () => {
  it('renders file name', () => {
    render(
      <TreeRow
        node={fileNode}
        depth={0}
        isExpanded={false}
        isSelected={false}
        onToggle={vi.fn()}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Project Brief.pdf')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <TreeRow
        node={fileNode}
        depth={0}
        isExpanded={false}
        isSelected={false}
        onToggle={vi.fn()}
        onSelect={onSelect}
      />
    );
    await user.click(screen.getByRole('treeitem'));
    expect(onSelect).toHaveBeenCalledWith('f1');
  });

  it('calls onToggle when chevron clicked on folder', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TreeRow
        node={folderNode}
        depth={0}
        isExpanded={false}
        isSelected={false}
        onToggle={onToggle}
        onSelect={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: /expand documents/i }));
    expect(onToggle).toHaveBeenCalledWith('folder1');
  });

  it('shows aria-selected when selected', () => {
    render(
      <TreeRow
        node={fileNode}
        depth={0}
        isExpanded={false}
        isSelected
        onToggle={vi.fn()}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole('treeitem')).toHaveAttribute('aria-selected', 'true');
  });

  it('shows aria-expanded on folders', () => {
    render(
      <TreeRow
        node={folderNode}
        depth={0}
        isExpanded
        isSelected={false}
        onToggle={vi.fn()}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole('treeitem')).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not show aria-expanded on files', () => {
    render(
      <TreeRow
        node={fileNode}
        depth={0}
        isExpanded={false}
        isSelected={false}
        onToggle={vi.fn()}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole('treeitem')).not.toHaveAttribute('aria-expanded');
  });

  it('calls onToggle on ArrowRight when folder is collapsed', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <TreeRow
        node={folderNode}
        depth={0}
        isExpanded={false}
        isSelected={false}
        onToggle={onToggle}
        onSelect={vi.fn()}
      />
    );
    await user.type(screen.getByRole('treeitem'), '{ArrowRight}');
    expect(onToggle).toHaveBeenCalledWith('folder1');
  });
});
