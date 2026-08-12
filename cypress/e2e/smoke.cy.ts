/**
 * Smoke tests — the absolute minimum that must pass for the app to be usable.
 *
 * Verifies that the two-panel layout mounts, the tree loads its initial data,
 * and the omnibar controls are present. No interaction beyond the initial load.
 */

import { MOCK, SEL } from '../support/selectors';

describe('Smoke', () => {
  it('renders the two-panel layout', () => {
    cy.get(SEL.nav).should('be.visible');
    cy.get(SEL.preview).should('be.visible');
  });

  it('shows a loading spinner while the tree is fetching', () => {
    cy.get(SEL.treeLoading).should('exist');
  });

  it('replaces the spinner with root-level rows after loading', () => {
    cy.waitForTree();
    cy.get(SEL.treeLoading).should('not.exist');
    cy.get(SEL.treeRow).should('have.length.greaterThan', 0);
  });

  it('shows all expected root folders', () => {
    cy.waitForTree();

    MOCK.rootFolders.forEach((name) => {
      cy.get(SEL.treeRowByName(name)).should('exist');
    });
  });

  it('renders the search input and category select in the omnibar', () => {
    cy.get(SEL.searchInput).should('be.visible');
    cy.get(SEL.categorySelect).should('be.visible');
  });

  it('shows the empty-selection state in the preview panel on load', () => {
    cy.get(SEL.emptyStateNothingSelected).should('exist');
  });
});
