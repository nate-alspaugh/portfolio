import { test, expect } from '../fixtures/test';
import { HomePage } from '../page-objects/home-page';
import { CaseStudyPage } from '../page-objects/case-study-page';

/**
 * E2E test suite: Case study page validation.
 *
 * Validates that:
 *  - The Particle case study renders with its intro (tagline)
 *  - A case study with "coming soon" shows the correct placeholder
 *  - Navigation from home → case-study → back works correctly
 *  - The route is recognized and the case-study page mounts
 */
test.describe('Case Study Page', () => {
  let home: HomePage;
  let csPage: CaseStudyPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    home = new HomePage(page);
    csPage = new CaseStudyPage(page);
  });

  /**
   * Particle: Finance Research Canvas — published case study.
   */
  test.describe('Particle — Finance Research Canvas', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/work/particle-finance-research-canvas');
      await csPage.waitForLoaded();
    });

    test('renders the case-study-page component', async () => {
      await expect(csPage.caseStudy).toBeVisible();
    });

    test('shows the correct title', async () => {
      const title = await csPage.getTitle();
      expect(title).toContain('Particle');
      expect(title).toContain('Finance Research Canvas');
    });

    test('shows the intro (tagline) under the title', async () => {
      expect(await csPage.hasIntro()).toBe(true);
      const intro = (await csPage.getIntro())?.trim();
      expect(intro).toBe('Canvas as Collaborator: an AI powered spatial research surface for investors');
    });

    test('renders the hero video', async () => {
      await expect(csPage.hero).toBeVisible();
    });

    test('renders multiple case study sections', async () => {
      await expect(csPage.sections).toBeVisible();
      const headings = await csPage.getSectionHeadings();
      expect(headings).toContain('Problem Space');
      // Should have several sections (Problem Space, Initial Brainstorming, Starting Functionality, etc.)
      expect(headings.length).toBeGreaterThan(5);
    });

    test('back button navigates back to home', async () => {
      await csPage.goBack();
      await expect(home.page).toHaveURL('/');
    });
  });

  /**
   * Voze — Mobile App Redesign (coming soon, no sections or intro).
   */
  test.describe('Voze — Mobile App Redesign', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/work/voze-mobile-app-redesign');
      await csPage.waitForLoaded();
    });

    test('renders the case-study-page component', async () => {
      await expect(csPage.caseStudy).toBeVisible();
    });

    test('renders the correct title', async () => {
      const title = await csPage.getTitle();
      expect(title).toContain('Voze');
      expect(title).toContain('Mobile App Redesign');
    });

    test('no intro rendered (comingSoon = true, no intro field)', async () => {
      expect(await csPage.hasIntro()).toBe(false);
    });

    test('has a hero image from project assets', async () => {
      await expect(csPage.hero).toBeVisible();
    });

    test('shows "Coming soon" when no sections are defined', async () => {
      expect(await csPage.isComingSoon()).toBe(true);
    });
  });

  /**
   * Particle — Component-Forge Skill: should NOT be accessible via URL.
   * This simulates a user manually typing the URL of an unpublished project.
   */
  test.describe('Unpublished project accessed directly', () => {
    test('renders case-study-page but shows "Coming soon" placeholder', async () => {
      await csPage.navigateTo('particle-component-forge-skill');

      // The project has comingSoon: true, so no sections render.
      // At the HTML template level, it renders "<div class='cs-coming-soon'>Coming soon</div>".
      expect(await csPage.isComingSoon()).toBe(true);
    });
  });
});
