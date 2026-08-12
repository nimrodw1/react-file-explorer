/**
 * Scrolling + virtualization tests.
 *
 * The tree uses @tanstack/react-virtual with a 36px row height and overscan 10.
 * With a typical Cypress viewport (1000×660 px) that means at most ~28 rows
 * should be in the DOM at once in a long list — not thousands.
 *
 * Strategy: apply the "Images" category filter to get ~2 627 results (far more
 * than the viewport). Then assert that the DOM row count stays bounded and that
 * scrolling replaces which rows are rendered.
 *
 * ⚠ We scroll SEL.treeViewport (the inner scrollable div), not SEL.tree (the
 *   ScrollArea root which has overflow:hidden and does not scroll itself).
 */

import { MOCK, SEL } from '../support/selectors';

const MAX_RENDERED_ROWS = 50;

describe('Scrolling & virtualization', () => {
  beforeEach(() => {
    cy.waitForTree();
  });

  // ── Initial tree (25 root folders) ──────────────────────────────────────────

  describe('Initial tree', () => {
    it('renders only the visible root rows on load — no virtualization bloat', () => {
      cy.get(SEL.treeRow).its('length').should('be.lessThan', MAX_RENDERED_ROWS);
    });
  });

  // ── Virtualization with a large result set ───────────────────────────────────

  describe('Virtualized list with large result set', () => {
    beforeEach(() => {
      cy.selectCategory(MOCK.categories.image.label); // ~2 627 results
      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);
    });

    it('keeps DOM row count well below the total result count', () => {
      cy.get(SEL.treeRow).its('length').should('be.lessThan', MAX_RENDERED_ROWS);
    });

    it('renders different rows after scrolling to the bottom', () => {
      cy.get(SEL.treeRow)
        .first()
        .invoke('attr', 'data-node-name')
        .then((firstName) => {
          cy.scrollTree('bottom');

          cy.get(SEL.treeRow).first().invoke('attr', 'data-node-name').should('not.eq', firstName);
        });
    });

    it('DOM row count stays bounded after scrolling to the bottom', () => {
      cy.scrollTree('bottom');

      cy.get(SEL.treeRow).its('length').should('be.lessThan', MAX_RENDERED_ROWS);
    });

    it('DOM row count stays bounded after scrolling back to the top', () => {
      cy.scrollTree('bottom');
      cy.scrollTree('top');

      cy.get(SEL.treeRow).its('length').should('be.lessThan', MAX_RENDERED_ROWS);
    });
  });

  // ── Selecting after scroll ───────────────────────────────────────────────────

  describe('Selecting after scroll', () => {
    it('clicking a row that entered the viewport via scroll selects it', () => {
      cy.selectCategory(MOCK.categories.image.label);
      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);

      cy.scrollTree('center');

      cy.get(SEL.treeRow).first().click();
      cy.get(SEL.treeRowSelected).should('have.length', 1);
    });
  });
});
