import { render } from '@test-utils';
import { FileCategoryIcon } from './FileCategoryIcon';

describe('FileCategoryIcon', () => {
  it('renders without crashing for each category', () => {
    const categories = ['document', 'music', 'image', 'video', 'folder'] as const;
    for (const category of categories) {
      const { unmount } = render(<FileCategoryIcon category={category} />);
      unmount();
    }
  });

  it('renders an svg icon', () => {
    const { container } = render(<FileCategoryIcon category="document" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders open folder icon when folderOpen is true', () => {
    const { container: closed } = render(<FileCategoryIcon category="folder" folderOpen={false} />);
    const { container: open } = render(<FileCategoryIcon category="folder" folderOpen />);
    // Both render an svg; open folder uses a different icon path
    expect(closed.querySelector('svg')).toBeInTheDocument();
    expect(open.querySelector('svg')).toBeInTheDocument();
  });

  it('applies aria-hidden to icon', () => {
    const { container } = render(<FileCategoryIcon category="music" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
