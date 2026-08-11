import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { FilterChips } from './FilterChips';

describe('FilterChips', () => {
  it('renders all category chips', () => {
    render(<FilterChips value={undefined} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /documents/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /music/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /images/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /videos/i })).toBeInTheDocument();
  });

  it('calls onChange with the selected category', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterChips value={undefined} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /images/i }));
    expect(onChange).toHaveBeenCalledWith('image');
  });

  it('deselects category when clicking the active chip', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterChips value="image" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /images/i }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('calls onChange with undefined when All is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterChips value="music" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /^all$/i }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('marks active chip with aria-pressed', () => {
    render(<FilterChips value="document" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /documents/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /images/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
