# Spec: Voze Case Study Content Update

## Goal
Overhaul the content and structure of the Voze Mobile App Redesign case study. This involves removing the standalone "Problem Space" heading and implementing a comprehensive narrative flow including Background, Goals, Discovery, Ideation, and Conclusion.

## Requirements

### 1. Content Structure
The project should follow this narrative flow:

#### Introduction / Context
- **Content:** "Voze is a 20+ year-old voice-first CRM that lets field reps in heavy-duty trucking and parts sales document customer interactions by voice. These reps aren't at a desk — they drive planned routes while fielding inbound calls from other customers, and depending on the industry, sometimes handle parts delivery too. That leaves little time or mental energy to document their interactions. They also work closely with other teams like inside sales, fulfillment, and their managers."
- **Placement:** Directly under the top hero image.

#### Background
- **Heading:** Background
- **Content:** "Voze's archaic codebase was riddled with bugs and experience issues that were starting to get in the way of growth — a big problem once you've taken on VC investment. To gauge the impact, my PM reviewed every ticket labeled "bug" for the quarter and found 60%+ of our effort went there instead of new feature work. Leadership decided to rewrite the mobile app as a first step to overhaul the code and fix those bugs, and had our team address any UX issues we could along the way. We had about a month to finish the designs so engineers had the rest of the time to build (a quarter total to ship)."

#### Goals
- **Heading:** Goals
- **Content:** 
  - Refresh the general style of the app
  - Find prominent UX issues, then determine which levers gave us the most "bang for our buck" to focus the redesign

#### Discovery - Internal
- **Heading:** Discovery - Internal
- **Content:** "We knew there were problems, but wanted to understand how they affected our team members, so we talked with teams across the company. We also wanted a sense of how it was affecting our customers."
- **Sub-section: What we needed to find out**
  - What existing UX issues were prevalent?
  - How was it affecting our company?
  - What teams were being affected?
- **Sub-section: Emerging insights**
  - Customer churn — clients left to find alternatives, straining our CX team
  - Deals getting dropped — sales couldn't reliably demo to prospects; mid-demo snags
  - Mixed bag of retention — many failed to adopt the app, but those who did loved it
  - Strained engineering — lots of resources spent on bugs
- **Sub-section: Key takeaway**
  - Mixed bag of retention — why did some adopt it and love it while others failed to?

#### Discovery - Users
- **Heading:** Discovery - Users
- **Content:** "This clue showed our users falling into a couple of camps:"
- **Segment 1: Adopters** (Those who successfully began using it and found value in it)
  - **Question:** Identify force multipliers — anywhere we could pour gas on the fire? Why were they able to adopt it? What exact value were they getting?
  - **Visual:** [Placeholder for screenshot of slide - Adopters]
- **Segment 2: Inactive users** (Those who failed to incorporate it into their workflows — new or existing)
  - **Question:** New users: what barriers kept it out of their workflow? Existing users: why didn't they return to using it?
  - **Visual:** [Placeholder for screenshot of slide - Inactive]

#### Prioritization
- **Heading:** Prioritization
- **Content:** "Based on what we found, we focused on the "Note Creation" flow. To get the biggest bang for our buck, this area had the most surface that touched both optimization and adoption issues."

#### Ideation - Brainstorming
- **Heading:** Ideation - Brainstorming
- **Question:** "HMW: Make it easy for reps to quickly create a voice note?"
- **Solutions:**
  - Leverage AI to handle the metadata (label their notes)
  - Unified flow — no up-front branching between note types (type vs voice)
  - Slash any underused functionality

#### Ideation - Comparison
- **Visual A:** [Placeholder for screen recording of existing voice note] - Label: "Before"
- **Visual B:** [Placeholder for screen recording of new flow] - Label: "After"

#### Demo Feedback
- **Heading:** Demo Feedback
- **Content:** "We showcased the flow for impression testing with some adopters and inactive users. Here are the insights we initially got:"
- **Visual:** [Placeholder for screenshot of highlights]

#### Conclusion & Takeaways
- **Heading:** Conclusion & Takeaways
- **Content:**
  - While I wasn't with the company at release, I stayed connected with Andrew. The launch was well received based on early feedback.
  - Dealing with constraints. We couldn't leverage automation for everything we'd like, so making the manual path easier was the next best thing: "When you can't remove a step, make it almost free."
  - Contextual inquiry is a game changer. Having the full context of a rep's day let us identify that through-line a bit better.

### 2. Layout Requirements
- Remove the existing "Problem Space" heading.
- Implement placeholders for images/videos where indicated in brackets.
- Maintain consistent spacing and typography as per `DESIGN.md`.

## Acceptance Criteria
- [x] "Problem Space" heading is removed.
- [x] All content from "Introduction" through "Conclusion" is present.
- [x] Placeholders are implemented for:
  - Adopters slide screenshot
  - Inactive users slide screenshot
  - Before screen recording
  - After screen recording
  - Demo highlights screenshot
- [x] The flow follows the specified narrative order.
- [x] Visual styling matches the rest of the portfolio.

---

# Spec: Wave 2 — Remove Bold Marker Stars & Reorder

## Goal

The Voze case study's "Discovery — Users" section renders visible `*` (asterisk) characters floating alongside words like "Adopters" and "Inactive users." The `**text**` markers in the data are simply plain text (the content was written in another LLM chat where `**bold**` was the formatting shorthand). They pass through `escapeHtml()` without any processing, and the literal `*` characters show on the page.

Additionally, the Adopters section appears below the Inactive section within "Discovery — Users" — the order is reversed.

## Requirements

### 1. Bold Marker Removal (Voze Discovery sections only)

Five `**text**` markers exist across two Voze sections:
- Discovery — Internal (one section, line 130): `**What we needed to find out:**` and `**Emerging insights:**`
- Discovery — Users (two paragraphs, lines 144-156): `**Adopters:**`, `**Inactive users:**`, and two instances of `**What we needed to find out:**`

Fix: Replace `**text**` with `<strong>text</strong>` in the data, and strip HTML tags before the content is escaped for output.

### 2. Reorder Discovery — Users Placeholders (Voze)

- **Current (wrong):** Inactive section/paragraph appears before Adopters section/paragraph
- **Fixed:** Adopters feature placeholder + Adopters paragraph → Inactive feature placeholder + Inactive paragraph

### 3. Design Token Update (DESIGN.md)

Add a BoldText typography token with `fontWeight: 600` (Geist Mono variable font) for bold inline text in body paragraphs.

## Acceptance Criteria
- [ ] All `**text**` markers in Voze discovery sections are stripped and replaced with `<strong>` HTML.
- [ ] The "Discovery — Users" section lists Adopters above Inactive.
- [ ] No visible `*` characters appear on screen.
- [ ] DESIGN.md includes a BoldText token.
- [ ] Build passes.
