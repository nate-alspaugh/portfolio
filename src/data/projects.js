import vozeHero from '../assets/voze-dribble-shot.png';
import vozeBeforeFlow from '../assets/voze-before-flow.mp4';
import vozeEmergingInsightsAdopters from '../assets/voze-emerging-insights-adopters.png';
import vozeEmergingInsightsInactive from '../assets/voze-emerging-insights-inactive.png';
import vozeDemoFeedbackHighlights from '../assets/voze-demo-feedback-highlights.png';
import componentForgeHero from '../assets/component-forge-hero-shot.jpg';
import particleCanvasBase from '../assets/canvas-base.mp4';
import particleAnnotationFeatures from '../assets/annotation-features.mp4';
import particleAddCompany from '../assets/add-company.mp4';
import companyAskTrigger from '../assets/company-ask-trigger.png';
import companyAskAsking from '../assets/company-ask-asking.png';
import companyAskResponse from '../assets/company-ask-response.png';
import companyMultiInput from '../assets/company-multi-input.png';
import highlightExtraction from '../assets/highlight-extraction.png';
import improvedEmptyState from '../assets/improved-empty-state.png';
import fileUpload from '../assets/file-upload.png';
import askQuestionActionUpdates from '../assets/ask-question-action-updates.png';
import tylerQuote from '../assets/tyler-quote.png';
import upsellOpportunity from '../assets/upsell-opportunity.png';

import { projectsMeta } from './projects-meta.js';

// Maps text-only sections (in projects-meta.js) to their runtime asset URLs.
// Sections are merged by index — keep these arrays aligned with projects-meta.js.
const projectAssets = {
  'particle-finance-research-canvas': {
    heroVideo: particleCanvasBase,
    sections: {
      4: { video: particleAnnotationFeatures },
      5: { video: particleAddCompany },
      6: {
        images: [
          { src: companyAskTrigger, alt: 'Company ask question trigger' },
          { src: companyAskAsking, alt: 'Company ask question being asked' },
          { src: companyAskResponse, alt: 'Company ask question response' },
        ],
      },
      7: { image: companyMultiInput },
      8: { image: highlightExtraction },
      10: { image: tylerQuote },
      12: { image: improvedEmptyState },
      13: { image: fileUpload },
      14: { image: askQuestionActionUpdates },
      16: { image: upsellOpportunity },
    },
  },
  'particle-component-forge-skill': {
    heroImage: componentForgeHero,
  },
  'voze-mobile-app-redesign': {
    heroImage: vozeHero,
    sections: {
      11: { image: vozeEmergingInsightsAdopters },
      12: { image: vozeEmergingInsightsInactive },
      15: { video: vozeBeforeFlow },
      18: { image: vozeDemoFeedbackHighlights },
    },
  },
};

export const projects = projectsMeta.map((meta) => {
  const overlay = projectAssets[meta.slug] ?? {};
  const { sections: sectionOverlays, ...rest } = overlay;
  const sections = meta.sections?.map((section, i) => ({
    ...section,
    ...(sectionOverlays?.[i] ?? {}),
  }));
  return { ...meta, ...rest, ...(sections ? { sections } : {}) };
});

export function findProject(slug) {
  return projects.find((p) => p.slug === slug) ?? null;
}
