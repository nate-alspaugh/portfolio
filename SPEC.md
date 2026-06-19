# Spec: Voze Case Study - Problem Space Heading

## Goal
Add a "Problem Space" section heading to the Voze Mobile App Redesign case study to mirror the structure and styling of the Particle Finance Research Canvas case study.

## Requirements
- **Target Project:** `voze-mobile-app-redesign`
- **Component:** Add a new section to the `sections` array in `projects-meta.js`.
- **Content:**
  - `type`: `'section'`
  - `heading`: `'Problem Space'`
  - `body`: (Leave empty or as a placeholder for now, as the user only requested the heading).
- **Styling:** Must match the `section` type implementation used in the Particle case study to ensure visual consistency (typography, spacing, and alignment).

## Acceptance Criteria
- [ ] The `voze-mobile-app-redesign` project in `projects-meta.js` now has a `sections` array.
- [ ] The first section is of type `section` with the heading "Problem Space".
- [ ] The heading renders on the live site with the same CSS classes/styles as the Particle case study headings.
