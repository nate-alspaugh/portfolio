import { Page, expect } from '@playwright/test';

/**
 * Page object for the home page.
 */
export class HomePage {
  constructor(private page: Page) {}

  /** The shadow-DOM <work-list> component */
  get workList() {
    return this.page.locator('work-list');
  }

  /** The shadow-DOM <home-bio> component */
  get bio() {
    return this.page.locator('home-bio');
  }

  /** The shadow-DOM <contact-links> component */
  get contactLinks() {
    return this.page.locator('contact-links');
  }

  /** Get the list of project rows (inside work-list shadow DOM) */
  get projectRows() {
    return this.page.locator('work-list >> .list .row');
  }

  /** Get clickable project rows (excludes "coming soon" rows) */
  get clickableRows() {
    return this.page.locator('work-list >> .list > a.row');
  }

  /** Get "coming soon" badge elements */
  get comingSoonBadges() {
    return this.page.locator('work-list >> .row--disabled');
  }

  /** Click the "back" button on a case study page */
  async clickBackButton() {
    await this.page.locator('.cs-back').click();
  }

  /**
   * Waits for the home page to be ready (work list populated).
   */
  async waitForLoaded() {
    await this.workList.waitFor({ state: 'attached' });
  }

  /**
   * Returns the number of project rows rendered in the work list.
   */
  async getRowCount() {
    return (await this.projectRows.count()).toString();
  }

  /**
   * Returns the titles of all project rows (including coming-soon).
   */
  async getAllRowTitles() {
    return this.page.locator('work-list >> .list .row-title span:last-child').allTextContents();
  }

  /**
   * Returns the titles of clickable project rows only.
   */
  async getClickableRowTitles() {
    return this.page.locator('work-list >> .list > a.row .row-title span:last-child').allTextContents();
  }
}
