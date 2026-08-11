import { render, screen } from '@test-utils';
import type { FileNode, FolderNode } from '@/types/fileSystem';
import { FilePreview } from './FilePreview';

const documentNode: FileNode = {
  id: 'd1',
  name: 'Project Brief.pdf',
  type: 'file',
  category: 'document',
  parentId: null,
  size: 204800,
  updatedAt: '2026-06-15T10:30:00Z',
};

const folderNode: FolderNode = {
  id: 'f1',
  name: 'Documents',
  type: 'folder',
  parentId: null,
  childCount: 5,
  updatedAt: '2026-07-01T00:00:00Z',
};

describe('FilePreview', () => {
  it('renders empty state when no node selected', () => {
    render(<FilePreview node={null} isLoading={false} />);
    expect(screen.getByText('Nothing selected')).toBeInTheDocument();
  });

  it('renders skeleton on first load (no data yet)', () => {
    const { container } = render(<FilePreview node={null} isLoading />);
    // Mantine Skeleton renders elements that are present
    expect(container.querySelector('[class*="mantine-Skeleton"]')).toBeInTheDocument();
  });

  it('renders content with fetching state when previous data exists', () => {
    render(<FilePreview node={documentNode} isLoading={false} isFetching />);
    // Content is still shown (not skeleton), but with dimming class
    expect(screen.getAllByText('Project Brief.pdf').length).toBeGreaterThan(0);
  });

  it('renders file header for a file node', () => {
    render(<FilePreview node={documentNode} isLoading={false} />);
    // The name appears in both the header and the preview stub — both are valid
    expect(screen.getAllByText('Project Brief.pdf').length).toBeGreaterThan(0);
  });

  it('renders document preview body', () => {
    render(<FilePreview node={documentNode} isLoading={false} />);
    expect(screen.getByText(/document preview coming soon/i)).toBeInTheDocument();
  });

  it('renders folder empty state with child count', () => {
    render(<FilePreview node={folderNode} isLoading={false} />);
    expect(screen.getByText(/5 items/i)).toBeInTheDocument();
  });
});
