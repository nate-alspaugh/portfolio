import { Page } from '@playwright/test';
import { HomePage } from '../page-objects/home-page';
import { CaseStudyPage } from '../page-objects/case-study-page';
import { test, expect } from '../fixtures/test';

/**
 * E2E test suite: Home page smoke tests.
 *
 * Validates that:
 *  - The home page loads
 *  - The work list renders all expected projects
 *  - Clicking a work list item navigates to the corresponding case-study route
 *  - The back button returns to the home page
 */
test.describe('Home Page', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    home = new HomePage(page);
  });

  test('home page loads and work list is populated', async () => {
    await home.waitForLoaded();

    // 3 projects total: 1 published case study + 2 "coming soon"
    const rowCount = await home.getRowCount();
    expect(rowCount).toBe('3');
  });

  test('only Particle Finance Research Canvas is clickable (others are coming soon)', async () => {
    const titles = await home.getClickableRowTitles();
    expect(titles).toEqual(['Particle — Finance Research Canvas']);
  });

  test('coming-soon project row exists and is non-clickable', async () => {
    const rows = await home.comingSoonBadges.all();
    const titles = await Promise.all(rows.map((row) => row.textContent()));
    // Each row's text includes both the title and "Coming soon" badge.
    expect(titles.some((t) => t && t.includes('Component-Forge'))).toBe(true);
  });

  test('navigating to a case study from the work list', async () => {
    // Click the first clickable project row (Particle)
    const rows = home.clickableRows;
    const firstRow = rows.first();
    await firstRow.click();

    // Should navigate to the matching case-study route
    await expect(home.page).toHaveURL(/\/work\/particle-finance-research-canvas/);
  });

  test('back button works: case-study → home', async () => {
    // Voze is currently comingSoon so it won't render as a clickable <a>.
    // Navigate directly to test the post-landing page back button flow.
    await home.page.goto('/work/voze-mobile-app-redesign');
    await expect(home.page).toHaveURL(/\/work\/voze-mobile-app-redesign/);

    // Click the back button on the case study page.
    const csPage = new CaseStudyPage(home.page);
    await csPage.goBack();

    // Back on home, URL should be clean (no routing hash)
    await expect(home.page).toHaveURL('/');
  });
});
