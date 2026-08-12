import { SEL } from './selectors';

/**
 * Custom Cypress commands for the File Explorer suite.
 *
 * Each command encapsulates a common multi-step action so spec files read as
 * high-level descriptions of behaviour rather than chains of low-level DOM ops.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Wait for the initial tree load spinner to disappear and rows to appear. */
      waitForTree(): Chainable<void>;

      /** Type a search query into the omnibar (clears any previous value first). */
      typeSearch(query: string): Chainable<void>;

      /** Clear the search input. */
      clearSearch(): Chainable<void>;

      /** Open the category dropdown and pick an option by its visible label. */
      selectCategory(label: string): Chainable<void>;

      /** Toggle the expand/collapse button on a named folder row. */
      toggleFolder(name: string): Chainable<void>;

      /** Click a tree row by its node name and wait for selection. */
      selectItem(name: string): Chainable<void>;

      /** Scroll the virtualized tree viewport. */
      scrollTree(position: 'top' | 'bottom' | 'center'): Chainable<void>;
    }
  }
}

Cypress.Commands.add('waitForTree', () => {
  cy.get(SEL.treeLoading, { timeout: 12_000 }).should('not.exist');
  cy.get(SEL.tree).should('be.visible');
  cy.get(SEL.treeRow).should('have.length.greaterThan', 0);
});

Cypress.Commands.add('typeSearch', (query: string) => {
  // SEL.searchInput targets the <input> directly (Mantine puts data-testid there)
  cy.get(SEL.searchInput).clear().type(query);
  // Omnibar debounce (300ms) only commits to the URL after typing stops.
  // Wait for that commit so subsequent assertions see filtered results, not the tree.
  cy.location('search').should((search) => {
    expect(new URLSearchParams(search).get('query')).to.eq(query);
  });
});

Cypress.Commands.add('clearSearch', () => {
  cy.get(SEL.searchInput).clear();
  cy.location('search').should((search) => {
    expect(new URLSearchParams(search).get('query')).to.eq(null);
  });
});

Cypress.Commands.add('selectCategory', (label: string) => {
  // SEL.categorySelect targets the <input> trigger directly.
  // Clicking it opens the Mantine Combobox dropdown.
  cy.get(SEL.categorySelect).click();
  // Options render inside a Mantine Combobox — query globally since it may be portaled
  cy.get('[role="option"]').contains(label).click();
});

Cypress.Commands.add('toggleFolder', (name: string) => {
  cy.get(SEL.folderToggle(name)).click();
});

Cypress.Commands.add('selectItem', (name: string) => {
  cy.get(SEL.treeRowByName(name)).click();
  cy.get(SEL.treeRowSelected).should('exist');
});

Cypress.Commands.add('scrollTree', (position) => {
  // Must scroll the viewport div, not the ScrollArea root.
  // The root has overflow:hidden; the viewport is the actual scrollable element.
  cy.get(SEL.treeViewport).scrollTo(position, { duration: 300 });
  cy.wait(300);
});
