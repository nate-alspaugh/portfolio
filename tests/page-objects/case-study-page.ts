import { Page, expect } from '@playwright/test';

/**
 * Page object for a case study page.
 */
export class CaseStudyPage {
  constructor(private page: Page) {}

  /** The case study page component */
  get caseStudy() {
    return this.page.locator('case-study-page');
  }

  /** Case study heading/eyebrow ("Case study · 2026") */
  get eyebrow() {
    return this.page.locator('.cs-eyebrow');
  }

  /** Case study title */
  get title() {
    return this.page.locator('.cs-title');
  }

  /** Case study intro text (the tagline / description under the title) */
  get intro() {
    return this.page.locator('.cs-intro');
  }

  /** Case study hero (video or image) */
  get hero() {
    return this.page.locator('.cs-hero-image');
  }

  /** All case study sections */
  get sections() {
    return this.page.locator('.cs-sections');
  }

  /** All section headings within the case study */
  get sectionHeadings() {
    return this.page.locator('case-study-page h2.cs-section-heading');
  }

  /** Back button */
  get backButton() {
    return this.page.locator('.cs-back');
  }

  /** "Coming soon" placeholder */
  get comingSoon() {
    return this.page.locator('.cs-coming-soon');
  }

  /**
   * Navigate to a case study by slug and wait for it to load.
   */
  async navigateTo(slug: string) {
    await this.page.goto(`/work/${slug}`);
    await this.waitForLoaded();
  }

  /**
   * Waits for the case study page to be ready.
   */
  async waitForLoaded() {
    await this.caseStudy.waitFor({ state: 'attached' });
  }

  /**
   * Clicks the back button and navigates to the home page.
   */
  async goBack() {
    await this.backButton.click();
  }

  /**
   * Returns the case study title text.
   */
  async getTitle() {
    return this.title.textContent();
  }

  /**
   * Returns the intro (tagline) text.
   */
  async getIntro() {
    return this.intro.textContent();
  }

  /**
   * Returns the section headings as an array.
   */
  async getSectionHeadings() {
    return (await this.sectionHeadings.allTextContents()).filter(Boolean);
  }

  /**
   * Checks if the page has an intro block visible.
   */
  async hasIntro() {
    return this.intro.isVisible();
  }

  /**
   * Checks if the page renders "Coming soon" (unpublished).
   */
  async isComingSoon() {
    return this.comingSoon.isVisible();
  }
}
