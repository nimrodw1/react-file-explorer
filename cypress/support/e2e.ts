import './commands';

/**
 * Global before-each: visit the app root before every test.
 * Individual tests can override the URL via cy.visit() when needed.
 */
beforeEach(() => {
  cy.visit('/');
});
