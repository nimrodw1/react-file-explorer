import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { Omnibar } from './Omnibar';

describe('Omnibar', () => {
  it('renders a search input', () => {
    render(
      <Omnibar query="" category={undefined} onQueryChange={vi.fn()} onCategoryChange={vi.fn()} />
    );
    expect(screen.getByRole('textbox', { name: /search files/i })).toBeInTheDocument();
  });

  it('calls onQueryChange when typing', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    render(
      <Omnibar
        query=""
        category={undefined}
        onQueryChange={onQueryChange}
        onCategoryChange={vi.fn()}
      />
    );
    await user.type(screen.getByRole('textbox', { name: /search/i }), 'proj');
    expect(onQueryChange).toHaveBeenCalledTimes(4);
  });

  it('renders a category filter combobox', () => {
    render(
      <Omnibar query="" category={undefined} onQueryChange={vi.fn()} onCategoryChange={vi.fn()} />
    );
    expect(screen.getByRole('combobox', { name: /filter by type/i })).toBeInTheDocument();
  });

  it('calls onCategoryChange when a category is selected', async () => {
    const user = userEvent.setup();
    const onCategoryChange = vi.fn();
    render(
      <Omnibar
        query=""
        category={undefined}
        onQueryChange={vi.fn()}
        onCategoryChange={onCategoryChange}
      />
    );
    await user.click(screen.getByRole('combobox', { name: /filter by type/i }));
    await user.click(screen.getByRole('option', { name: /music/i }));
    expect(onCategoryChange).toHaveBeenCalledWith('music');
  });
});
