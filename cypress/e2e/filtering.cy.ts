/**
 * Filtering tests — search query, category filter, combined, and empty state.
 *
 * All search terms and category values are verified against mockData.json
 * (faker seed 42, 10 000 nodes):
 *
 *   "song"  → 24 matches, every one category:music
 *   "song" + category:music  → 24 matches (all pass both filters)
 *   "song" + category:image  → 0 matches  → "No results" empty state
 *   category:image alone     → 2 627 matches (large flat list)
 */

import { MOCK, SEL } from '../support/selectors';

describe('Filtering', () => {
  beforeEach(() => {
    cy.waitForTree();
  });

  // ── Search query ─────────────────────────────────────────────────────────────

  describe('Search query', () => {
    it('typing a query returns matching rows', () => {
      cy.typeSearch(MOCK.searchTerm.matchesMusic); // "song"

      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);
    });

    it('every result row contains the search term in its node name', () => {
      cy.typeSearch(MOCK.searchTerm.matchesMusic); // "song"

      cy.get(SEL.treeRow).each(($row) => {
        cy.wrap($row.attr('data-node-name') ?? '').should('match', /song/i);
      });
    });

    it('clearing the search restores the hierarchical tree with folder toggles', () => {
      cy.typeSearch(MOCK.searchTerm.matchesMusic);
      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);

      cy.clearSearch();

      cy.get(SEL.treeRowByName(MOCK.expandableFolder)).should('exist');
      cy.get(SEL.folderToggle(MOCK.expandableFolder)).should('exist');
    });

    it('a query with no matches shows the "No results" empty state', () => {
      cy.typeSearch(MOCK.searchTerm.noResults); // "__no_match_xyz__"

      cy.get(SEL.treeRow).should('not.exist');
      cy.get(SEL.emptyStateNoResults).should('be.visible');
    });
  });

  // ── Category filter ───────────────────────────────────────────────────────────

  describe('Category filter', () => {
    it('selecting a category shows matching file rows', () => {
      cy.selectCategory(MOCK.categories.image.label); // "Images"

      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);
    });

    it('switching back to "All types" restores folder toggle buttons', () => {
      cy.selectCategory(MOCK.categories.music.label);
      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);

      cy.selectCategory('All types');

      cy.get(SEL.folderToggle(MOCK.expandableFolder)).should('exist');
    });
  });

  // ── Combined query + category ─────────────────────────────────────────────────

  describe('Combined query + category', () => {
    it('"song" + Music returns results (every "song" file is music)', () => {
      cy.typeSearch(MOCK.searchTerm.matchesMusic);
      cy.selectCategory(MOCK.categories.music.label);

      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);
    });

    it('"song" + Images returns no results — triggers "No results" empty state', () => {
      cy.typeSearch(MOCK.searchTerm.matchesMusic); // all music files
      cy.selectCategory(MOCK.categories.image.label); // incompatible category

      cy.get(SEL.treeRow).should('not.exist');
      cy.get(SEL.emptyStateNoResults).should('be.visible');
    });

    it('clearing the query while a category is active keeps the filter running', () => {
      cy.typeSearch(MOCK.searchTerm.matchesMusic);
      cy.selectCategory(MOCK.categories.music.label);
      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);

      cy.clearSearch();

      // Category:music still active → results remain but no folder toggle buttons
      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);
      cy.get(SEL.folderToggle(MOCK.expandableFolder)).should('not.exist');
    });
  });

  // ── Preview panel during filtering ────────────────────────────────────────────

  describe('Preview while filtering', () => {
    it('clicking a filtered result shows its name in the preview panel', () => {
      cy.typeSearch(MOCK.searchTerm.matchesMusic);
      cy.get(SEL.treeRow).should('have.length.greaterThan', 0);

      cy.get(SEL.treeRow)
        .first()
        .then(($row) => {
          const name = $row.attr('data-node-name') ?? '';
          cy.wrap($row).click();

          cy.get(SEL.treeRowSelected).should('exist');
          cy.get(SEL.previewName).should('contain.text', name);
        });
    });
  });
});
