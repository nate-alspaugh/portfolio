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
    intro: 'Voze is a 20+ year-old voice-first CRM that lets field reps in heavy-duty trucking and parts sales document customer interactions by voice. These reps aren\'t at a desk — they drive planned routes while fielding inbound calls from other customers, and depending on the industry, sometimes handle parts delivery too. That leaves little time or mental energy to document their interactions. They also work closely with other teams like inside sales, fulfillment, and their managers.',
    description: 'A redesign of the Voze mobile app for field workers.',
    comingSoon: false,
    sections: [
      {
        type: 'section',
        heading: 'Background',
        body: 'Voze\'s archaic codebase was riddled with bugs and experience issues that were starting to get in the way of growth — a big problem once you\'ve taken on VC investment. To gauge the impact, my PM reviewed every ticket labeled "bug" for the quarter and found 60%+ of our effort went there instead of new feature work. Leadership decided to rewrite the mobile app as a first step to overhaul the code and fix those bugs, and had our team address any UX issues we could along the way. We had about a month to finish the designs so engineers had the rest of the time to build (a quarter total to ship).',
      },
      {
        type: 'section',
        heading: 'Goals',
        items: [
          'Refresh the general style of the app',
          'Find prominent UX issues, then determine which levers gave us the most "bang for our buck" to focus the redesign',
        ],
      },
      {
        type: 'section',
        heading: 'Discovery — Internal',
        body: 'We knew there were problems, but wanted to understand how they affected our team members, so we talked with teams across the company. We also wanted a sense of how it was affecting our customers.\n\nWhat we needed to find out:\n- What existing UX issues were prevalent?\n- How was it affecting our company?\n- What teams were being affected?\n\nEmerging insights:\n- Customer churn — clients left to find alternatives, straining our CX team\n- Deals getting dropped — sales couldn\'t reliably demo to prospects; mid-demo snags\n- Mixed bag of retention — many failed to adopt the app, but those who did loved it\n- Strained engineering — lots of resources spent on bugs',
      },
      {
        type: 'callout',
        eyebrow: 'Key Takeaway',
        body: 'Mixed bag of retention — why did some adopt it and love it while others failed to?',
      },
      {
        type: 'section',
        heading: 'Discovery — Users',
        body: `This clue showed our users falling into a couple of camps:`,
      },
      {
        type: 'paragraph',
        body: `**Adopters** those who successfully began using it and found value in it.`,
      },
      {
        type: 'inline-text',
        text: 'What we needed to find out:',
      },
      {
        type: 'list-items',
        items: [
          'Identify force multipliers — anywhere we could pour gas on the fire?',
          'Why were they able to adopt it? What exact value were they getting?',
        ],
      },
      {
        type: 'paragraph',
        body: `**Inactive users** those who failed to incorporate it into their workflows — new or existing.`,
      },
      {
        type: 'inline-text',
        text: 'What we needed to find out:',
      },
      {
        type: 'list-items',
        items: [
          'New users: what barriers kept it out of their workflow?',
          'Existing users: why didn\'t they return to using it?',
        ],
      },
      {
        type: 'feature',
        heading: 'Emerging insights — Adopters',
      },
      {
        type: 'feature',
        heading: 'Emerging insights — Inactive',
      },
      {
        type: 'section',
        heading: 'Prioritization',
        body: 'Based on what we found, we focused on the "Note Creation" flow. To get the biggest bang for our buck, this area had the most surface that touched both optimization and adoption issues.',
      },
      {
        type: 'section',
        heading: 'Ideation — Brainstorming',
        body: 'HMW: Make it easy for reps to quickly create a voice note?',
        items: [
          'Leverage AI to handle the metadata (label their notes)',
          'Unified flow — no up-front branching between note types (type vs voice)',
          'Slash any underused functionality',
        ],
      },
      {
        type: 'feature',
        caption: 'Before — existing voice note flow',
      },
      {
        type: 'feature',
        caption: 'After — new unified note creation flow',
      },
      {
        type: 'section',
        heading: 'Demo Feedback',
        body: 'We showcased the flow for impression testing with some adopters and inactive users. Here are the insights we initially got:',
      },
      {
        type: 'feature',
        caption: 'Demo feedback highlights from impression testing',
      },
      {
        type: 'section',
        heading: 'Conclusion — Takeaways',
        items: [
          "While I wasn't with the company at release, I stayed connected with Andrew. The launch was well received based on early feedback.",
          'Dealing with constraints. We couldn\'t leverage automation for everything we\'d like, so making the manual path easier was the next best thing: "When you can\'t remove a step, make it almost free."',
          'Contextual inquiry is a game changer. Having the full context of a rep\'s day let us identify that through-line a bit better.',
        ],
      },
    ],
  },
];

export function findProjectMeta(slug) {
  return projectsMeta.find((p) => p.slug === slug) ?? null;
}
