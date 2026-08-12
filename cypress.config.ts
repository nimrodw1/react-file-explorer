import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    // Mock service adds 500–1500 ms latency on every call
    defaultCommandTimeout: 10_000,
    retries: { runMode: 0, openMode: 0 },
    video: false,
    screenshotOnRunFailure: true,
  },
});
