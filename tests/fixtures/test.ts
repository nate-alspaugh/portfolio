import { test as base } from '@playwright/test';

/**
 * Base test fixture with custom helpers.
 * Currently extends from Playwright's built-in `test`.
 */
export const test = base.extend({
  // Add whichever custom fixtures you want across all tests.
});

export { expect } from '@playwright/test';
