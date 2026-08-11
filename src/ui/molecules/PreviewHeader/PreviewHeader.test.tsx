import { render, screen } from '@test-utils';
import type { FileNode, FolderNode } from '@/types/fileSystem';
import { PreviewHeader } from './PreviewHeader';

const fileNode: FileNode = {
  id: 'f1',
  name: 'Project Brief.pdf',
  type: 'file',
  category: 'document',
  parentId: null,
  size: 204800,
  updatedAt: '2026-06-15T10:30:00Z',
};

const folderNode: FolderNode = {
  id: 'folder1',
  name: 'Documents',
  type: 'folder',
  parentId: null,
  childCount: 3,
  updatedAt: '2026-06-15T10:30:00Z',
};

describe('PreviewHeader', () => {
  it('renders file name', () => {
    render(<PreviewHeader node={fileNode} />);
    expect(screen.getByText('Project Brief.pdf')).toBeInTheDocument();
  });

  it('renders file size for files', () => {
    render(<PreviewHeader node={fileNode} />);
    expect(screen.getByText('200.0 KB')).toBeInTheDocument();
  });

  it('renders category label for files', () => {
    render(<PreviewHeader node={fileNode} />);
    expect(screen.getByText('document')).toBeInTheDocument();
  });

  it('renders folder name', () => {
    render(<PreviewHeader node={folderNode} />);
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  it('does not render size for folders', () => {
    render(<PreviewHeader node={folderNode} />);
    expect(screen.queryByText(/KB|MB|B$/)).not.toBeInTheDocument();
  });

  it('renders a modified date', () => {
    render(<PreviewHeader node={fileNode} />);
    expect(screen.getByText(/modified/i)).toBeInTheDocument();
  });
});
