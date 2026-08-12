/**
 * Performance tests — timing gates and scale assertions.
 *
 * Act as regression guards: fail if the app degrades significantly.
 *
 *   • Tree must be interactive within 5 s of page load
 *     (mock adds 500–1500 ms latency; 5 s is comfortable headroom)
 *   • Filtered results must appear within 3 s of interaction
 *   • DOM row count must stay below MAX_RENDERED_ROWS under any filter
 *     (proves the virtualizer is engaged, not rendering all 10 000 nodes)
 */

import { MOCK, SEL } from '../support/selectors';

const MAX_RENDERED_ROWS = 50;
const TREE_LOAD_BUDGET_MS = 5_000;
const FILTER_RESPONSE_BUDGET_MS = 3_000;

describe('Performance at scale', () => {
  // ── Initial load ─────────────────────────────────────────────────────────────

  describe('Initial load', () => {
    it(`first tree rows appear within ${TREE_LOAD_BUDGET_MS / 1000} s`, () => {
      const start = Date.now();

      cy.get(SEL.treeRow, { timeout: TREE_LOAD_BUDGET_MS }).should('have.length.greaterThan', 0);

      cy.then(() => {
        expect(Date.now() - start).to.be.lessThan(TREE_LOAD_BUDGET_MS);
      });
    });

    it('loading spinner is gone once rows are visible', () => {
      cy.get(SEL.treeRow, { timeout: TREE_LOAD_BUDGET_MS }).should('exist');
      cy.get(SEL.treeLoading).should('not.exist');
    });
  });

  // ── Filter responsiveness ─────────────────────────────────────────────────────

  describe('Filter responsiveness', () => {
    beforeEach(() => {
      cy.waitForTree();
    });

    it(`category filter results appear within ${FILTER_RESPONSE_BUDGET_MS / 1000} s`, () => {
      const start = Date.now();

      cy.selectCategory(MOCK.categories.music.label);

      cy.get(SEL.treeRow, { timeout: FILTER_RESPONSE_BUDGET_MS }).should('have.length.greaterThan', 0);

      cy.then(() => {
        expect(Date.now() - start).to.be.lessThan(FILTER_RESPONSE_BUDGET_MS);
      });
    });

    it(`search results appear within ${FILTER_RESPONSE_BUDGET_MS / 1000} s of typing`, () => {
      const start = Date.now();

      cy.typeSearch(MOCK.searchTerm.matchesMusic); // "song"

      cy.get(SEL.treeRow, { timeout: FILTER_RESPONSE_BUDGET_MS }).should('have.length.greaterThan', 0);

      cy.then(() => {
        expect(Date.now() - start).to.be.lessThan(FILTER_RESPONSE_BUDGET_MS);
      });
    });
  });

  // ── DOM size stays bounded with 10 000-node dataset ──────────────────────────

  describe('DOM size stays bounded', () => {
    beforeEach(() => {
      cy.waitForTree();
    });

    it('virtualizer keeps row count below limit during category filter (~2 627 results)', () => {
      cy.selectCategory(MOCK.categories.image.label);
      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);

      cy.get(SEL.treeRow).its('length').should('be.lessThan', MAX_RENDERED_ROWS);
    });

    it('virtualizer keeps row count below limit during text search (24 results)', () => {
      cy.typeSearch(MOCK.searchTerm.matchesMusic);
      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);

      cy.get(SEL.treeRow).its('length').should('be.lessThan', MAX_RENDERED_ROWS);
    });

    it('expanding multiple folders does not blow up the DOM row count', () => {
      cy.toggleFolder('Projects');  // 17 children
      cy.get(SEL.treeRowByName('Projects')).should('have.attr', 'aria-expanded', 'true');

      cy.toggleFolder('Documents'); // 15 children
      cy.get(SEL.treeRowByName('Documents')).should('have.attr', 'aria-expanded', 'true');

      cy.get(SEL.treeRow).its('length').should('be.lessThan', MAX_RENDERED_ROWS);
    });
  });
});
