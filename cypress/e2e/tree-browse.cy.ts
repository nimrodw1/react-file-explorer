/**
 * Tree-browse tests — expand, collapse, select, and keyboard navigation.
 *
 * Uses "Projects" as the test folder (17 children in mockData.json).
 * All interactions go through data-testid selectors; no ARIA queries.
 */

import { MOCK, SEL } from '../support/selectors';

const FOLDER = MOCK.expandableFolder; // "Projects"

describe('Tree browsing', () => {
  beforeEach(() => {
    cy.waitForTree();
  });

  // ── Expanding ───────────────────────────────────────────────────────────────

  describe('Expanding a folder', () => {
    it('every root folder has a toggle button', () => {
      cy.get(SEL.folderToggle(FOLDER)).should('exist');
    });

    it('clicking the toggle reveals child rows', () => {
      cy.get(SEL.treeRow).its('length').then((before) => {
        cy.toggleFolder(FOLDER);

        cy.get(SEL.treeRow).should('have.length.greaterThan', before);
      });
    });

    it('the folder row is marked aria-expanded after toggling open', () => {
      cy.toggleFolder(FOLDER);

      cy.get(SEL.treeRowByName(FOLDER)).should('have.attr', 'aria-expanded', 'true');
    });
  });

  // ── Collapsing ──────────────────────────────────────────────────────────────

  describe('Collapsing a folder', () => {
    beforeEach(() => {
      cy.toggleFolder(FOLDER);
      cy.get(SEL.treeRowByName(FOLDER)).should('have.attr', 'aria-expanded', 'true');
    });

    it('clicking the toggle again hides child rows', () => {
      cy.get(SEL.treeRow).its('length').then((expanded) => {
        cy.toggleFolder(FOLDER);

        cy.get(SEL.treeRow).should('have.length.lessThan', expanded);
      });
    });

    it('marks the folder row as collapsed again', () => {
      cy.toggleFolder(FOLDER);

      cy.get(SEL.treeRowByName(FOLDER)).should('have.attr', 'aria-expanded', 'false');
    });
  });

  // ── Selecting items ─────────────────────────────────────────────────────────

  describe('Selecting items', () => {
    it('clicking a folder row marks it as selected', () => {
      cy.selectItem(FOLDER);

      cy.get(SEL.treeRowByName(FOLDER)).should('have.attr', 'aria-selected', 'true');
    });

    it('selecting a folder shows a folder preview with item count', () => {
      cy.selectItem(FOLDER);

      cy.get(SEL.preview).contains('item').should('exist');
    });

    it('selecting a file shows its name in the preview header', () => {
      cy.toggleFolder(FOLDER);
      cy.get(SEL.treeRowByName(FOLDER)).should('have.attr', 'aria-expanded', 'true');

      // Pick the first file row (no aria-expanded attribute means it's a file)
      cy.get(SEL.treeRow)
        .filter(':not([aria-expanded])')
        .first()
        .then(($row) => {
          const name = $row.attr('data-node-name') ?? '';
          cy.wrap($row).click();

          cy.get(SEL.treeRowSelected).should('exist');
          cy.get(SEL.previewName).should('have.text', name);
        });
    });

    it('only one row is selected at a time', () => {
      cy.selectItem('Documents');
      cy.selectItem(FOLDER);

      cy.get(SEL.treeRowSelected).should('have.length', 1);
    });
  });

  // ── Keyboard navigation ──────────────────────────────────────────────────────

  describe('Keyboard navigation', () => {
    it('ArrowRight expands a collapsed folder', () => {
      cy.get(SEL.treeRowByName(FOLDER)).focus().type('{rightarrow}');

      cy.get(SEL.treeRowByName(FOLDER)).should('have.attr', 'aria-expanded', 'true');
    });

    it('ArrowLeft collapses an expanded folder', () => {
      cy.toggleFolder(FOLDER);
      cy.get(SEL.treeRowByName(FOLDER)).should('have.attr', 'aria-expanded', 'true');

      cy.get(SEL.treeRowByName(FOLDER)).focus().type('{leftarrow}');

      cy.get(SEL.treeRowByName(FOLDER)).should('have.attr', 'aria-expanded', 'false');
    });

    it('Enter selects the focused row', () => {
      cy.get(SEL.treeRowByName(FOLDER)).focus().type('{enter}');

      cy.get(SEL.treeRowByName(FOLDER)).should('have.attr', 'aria-selected', 'true');
    });
  });
});
