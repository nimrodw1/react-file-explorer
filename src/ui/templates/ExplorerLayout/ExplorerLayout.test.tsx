import { render, screen } from '@test-utils';
import { ExplorerLayout } from './ExplorerLayout';

describe('ExplorerLayout', () => {
  const defaultProps = {
    omnibar: <div>Omnibar</div>,
    tree: <div>Tree</div>,
    preview: <div>Preview</div>,
  };

  it('renders omnibar slot', () => {
    render(<ExplorerLayout {...defaultProps} />);
    expect(screen.getByText('Omnibar')).toBeInTheDocument();
  });

  it('renders tree slot', () => {
    render(<ExplorerLayout {...defaultProps} />);
    expect(screen.getByText('Tree')).toBeInTheDocument();
  });

  it('renders preview slot', () => {
    render(<ExplorerLayout {...defaultProps} />);
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });
});
