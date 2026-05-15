// Text-only project metadata. Single source of truth for case study copy.
// No asset imports — safe to import from Node (e.g. the build-time prerender plugin).
// src/data/projects.js merges this with hashed asset URLs at runtime.

export const projectsMeta = [
  {
    slug: 'particle-finance-research-canvas',
    title: 'Particle — Finance Research Canvas',
    accent: '#99cc00',
    year: '2026',
    description:
      'An AI-powered spatial research canvas that lets investors capture, annotate, and connect company data. Designed at Particle.',
    intro: `Canvas as Collaborator: an AI powered spatial research surface for investors`,
    sections: [
      {
        type: 'section',
        heading: 'Problem Space',
        body: `While we pivoted to our new ICP, something I heard from preliminary research (and ultimately what I couldn't stop thinking about) was that investors were using archaic methods of documenting research like links, screenshots, files/documents, and their thoughts in software like their notes app to document their research. While not the same, I've experienced similar workflows that made the process brittle for maintaining deep work because having to bounce around from place to place made it difficult to flow from thought to thought. Early conversations with Tyler in which we had thought about being able to "grab" an element from any page on the app and then drop it into a "box" to annotate or save for later had given me some early ideas of how to approach this feature.`,
      },
      {
        type: 'section',
        heading: 'Initial Brainstorming',
        body: `I wanted to explore how we could solve this problem, intuitively I thought of some kind of canvas interaction but supercharged with the ability to have AI help you answer your questions, organize your research, and keep you in flow. I used a homegrown skill called /brainstorm that Marcel had cooked up during his work on the API to start teasing out a more solid concept and some base ideas. This allowed me to go back and forth with Claude that ultimately stretched my thinking of what this could be a lot sooner in the process vs "having to see it" before getting to explore those.`,
      },
      {
        type: 'callout',
        eyebrow: 'Initial Brainstorm Summary from Claude Session',
        body: `The canvas feature began in early February 2026 as a loose intuition: what if users could grab research cards — company profiles, data points, artifacts scattered across the app — and drop them onto a shared surface to annotate, cluster, and draw connections between them? The initial reference points were Miro and FigJam, but within the first exchange the framing shifted. Rather than treat the canvas as a blank whiteboard bolted onto the app, the brainstorm pushed toward a "spatial thinking layer" whose value came precisely from the structured data already flowing through the product. That reframing produced the feature's guiding metaphor — canvas as collaborator — an intelligent container that accumulated context and actively looked for patterns across the items placed into it. The most exciting thread to emerge was the idea that the canvas could surface correlations you wouldn't have found on your own, elevating it from a documentation tool into a thinking partner.

From there, a second insight locked the design in: the canvas isn't paired with a conversation, the canvas is the conversation. A query doesn't produce a linear report that you then drag onto a canvas; the response materializes spatially, and every subsequent interaction evolves that spatial artifact. None of this was implementation yet — no code, no components, no routes — but the conceptual scaffolding that shipped was already in place by the end of the brainstorm.`,
        quoteLabel: 'Notable Quote',
        quote: '"Canvas as a collaborator"',
      },
      {
        type: 'section',
        heading: 'Starting Functionality',
        body: `Based on that brainstorming session I had a decent list of functionality. I then could prioritize initial features to start playing around with the feel of the interaction to demo to the team.`,
      },
      {
        type: 'feature',
        caption:
          'Annotation tools — sticky notes, floating text, and lines to annotate your thoughts on the canvas',
      },
      { type: 'feature', caption: 'Add company node from publicly traded company' },
      {
        type: 'carousel',
        caption: 'LLM-driven queries with easy point-and-click context adding',
      },
      {
        type: 'feature',
        caption:
          "Select multiple canvas items to add context to your prompt — helps mitigate typing fatigue when you're in flow researching",
      },
      {
        type: 'feature',
        caption: 'Easily extract insights by highlighting content from a query and creating a sticky note',
      },
      {
        type: 'paragraph',
        body: `Once I had a working prototype on paper, I had presented it to the team during our weekly call. It spurred an awesome conversation with feedback like "this could be our defining feature" and "I feel like you just invented the mouse". A lot of great back and forth around its potential and inspiration of what to add to it. This was actually one of the greatest moments in my career.`,
      },
      { type: 'image', label: 'Quote from Tyler' },
      {
        type: 'section',
        heading: 'Following Additions / Improvements',
        body: `The following weeks were filled with awesome input and collaboration from the team. We got to play with it and identify some improvements and opportunities.`,
      },
      {
        type: 'feature',
        caption: 'Better zero state — gives users an idea of what they could start adding to the canvas',
      },
      { type: 'feature', caption: 'File uploading — query a file and extract insights (shout out to Marcel)' },
      { type: 'feature', caption: "Out-of-the-box company actions from Tyler's work on insights" },
      {
        type: 'section',
        heading: 'Research Feedback Highlights',
        body: `After we went through a round of updates, it was demoed to our design partners and potential customers mostly to gauge market appetite. We noticed some top level themes begin to emerge:`,
      },
      { type: 'feature', caption: 'Emerging feedback trends from our demos' },
      {
        type: 'section',
        heading: 'Outcomes and Learnings',
        body: `While my time at Particle has come to a close before I got to work on this more, I learned a lot about experimenting with product ideas quickly with AI. This feature work got us some really valuable feedback and created a spot for collaborative discussion. Ultimately leadership decided to pivot away from Particle Finance to an API subscription model based on the incredible work they've accumulated over the last couple of years. I loved my time working on this product and team and am excited to tackle more projects like this in the future.`,
      },
      {
        type: 'paragraph',
        body: `What I would try to tackle if I were still working on this:`,
        items: [
          'Context driven insights: What if it could auto surface insights to the user based on the context of the entire canvas?',
          'File authoring: Either using point and click selections or the context of the entire canvas, what if you could make things like slide-shows, reports, etc from it?',
          'Canvas Templates: Give users some ready templates for research use cases that let them see how the product could be utilized.',
          'Auto exploring: Could we "peek ahead" before committing something to the canvas by having nodes "auto explode" off of a node that you have selected to get an idea of what you could explore.',
        ],
      },
    ],
  },
  {
    slug: 'particle-component-forge-skill',
    title: 'Particle — Component-Forge Skill',
    accent: '#00e6c8',
    year: '2025',
    description:
      'A custom Claude skill for accelerating component design at Particle. Case study coming soon.',
    comingSoon: true,
  },
  {
    slug: 'voze-mobile-app-redesign',
    title: 'Voze — Mobile App Redesign',
    accent: '#e6399b',
    year: '2024',
    description: 'A redesign of the Voze mobile app for field workers. Case study coming soon.',
    comingSoon: true,
  },
];

export function findProjectMeta(slug) {
  return projectsMeta.find((p) => p.slug === slug) ?? null;
}
