import { render, screen } from '@test-utils';
import { NodeName } from './NodeName';

describe('NodeName', () => {
  it('renders the name text', () => {
    render(<NodeName name="Project Brief.pdf" />);
    expect(screen.getByText('Project Brief.pdf')).toBeInTheDocument();
  });

  it('sets title attribute for tooltip on overflow', () => {
    render(<NodeName name="Very Long File Name.pdf" />);
    expect(screen.getByTitle('Very Long File Name.pdf')).toBeInTheDocument();
  });

  it('applies muted class when muted prop is true', () => {
    render(<NodeName name="Archive" muted />);
    const el = screen.getByText('Archive');
    // CSS module class names may be hashed — check by substring
    expect(el.className).toMatch(/muted/);
  });

  it('does not apply muted class by default', () => {
    render(<NodeName name="Document" />);
    const el = screen.getByText('Document');
    expect(el.className).not.toMatch(/muted/);
  });
});
