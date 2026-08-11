import { render, screen } from '@test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders default title and description', () => {
    render(<EmptyState />);
    expect(screen.getByText('Nothing selected')).toBeInTheDocument();
    expect(screen.getByText(/select a file or folder/i)).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(<EmptyState title="No results" description="Try adjusting your search." />);
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search.')).toBeInTheDocument();
  });
});
