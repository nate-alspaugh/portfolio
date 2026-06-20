# PLAN: Wave 2 — Remove Bold Marker Stars & Reorder

## Wave 2: Remove Bold Marker Stars & Reorder

### Objective

The Voze Discovery — Users section renders visible `*` (asterisk) characters alongside words like "Adopters" and "Inactive users." The cause: the data contains plain `**text**` (raw `**` wrapped around words), which passes through `escapeHtml()` as-is — no processing, no bold rendering. The fix: strip the `**` markers from the data content and replace them with HTML `<strong>` tags so the browser renders bold text instead of floating `*` stars. Swap the Adopters/Inactive ordering.

The Markdown input was just a way to express formatting hierarchy during content creation in another LLM chat — the case study app is not a markdown processor. This fix handles the `**` markers as static content: convert `**text**` → `<strong>text</strong>` in the data, and strip the HTML tags before rendering so the bold text displays properly.

### Acceptance Criteria

1. All `**text**` markers in the Voze discovery sections are removed and replaced with `<strong>` HTML.
2. The "Discovery — Users" section lists the Adopters feature placeholder ABOVE the Inactive feature placeholder.
3. No visible `*` characters appear where `**text**` markers once were.
4. DESIGN.md includes a BoldText token.
5. Build passes.

---

### Steps

#### Step 1: Strip `**` markers and use `<strong>` in projects-meta.js

**File:** `src/data/projects-meta.js`

The grep showed exactly **five** `**text**` markers across **two Voze sections** (zero in Particle — I was wrong about that).

**Discovery — Internal (line 130):**
- `**What we needed to find out:**`
- `**Emerging insights:**`

**Discovery — Users (lines 144-156):**
- `**Adopters:**`
- `**What we needed to find out:**` (in the Adopters paragraph)
- `**Inactive users:**`
- `**What we needed to find out:**` (in the Inactive paragraph)

Replace all five instances: `**text**` → `<strong>text</strong>`.

**Reordering — Discovery — Users (swap paragraphs)**:

Current (wrong):
```
[feature: "Placeholder for screenshot of slide — Adopters"]
[paragraph: "Inactive users: Those who failed to incorporate it into their workflows..."]
[feature: "Placeholder for screenshot of slide — Inactive"]
[paragraph: "Adopters: Those who successfully began using it and found value in it..."]
```

Fixed:
```
[feature: "Placeholder for screenshot of slide — Adopters"]
[paragraph: "Adopters: Those who successfully began using it and found value in it..."]
[feature: "Placeholder for screenshot of slide — Inactive"]
[paragraph: "Inactive users: Those who failed to incorporate it into their workflows..."]
```

This is lines ~148–160 in the file.

#### Step 2: Update case-study-html.js paragraph rendering

**File:** `src/lib/case-study-html.js`

The data now contains HTML `<strong>` tags. `escapeHtml(currentBody)` turns `<strong>` into `&lt;strong&gt;` → visible on the page as literal `&lt;strong&gt;`.

Fix by stripping HTML tags before escaping. Add a `stripHtmlTags` helper (line ~14):

```js
function stripHtmlTags(html) {
  return String(html ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&');
}
```

And modify the `'paragraph'` case (line ~33):
```diff
- <p class="cs-paragraph-body">${escapeHtml(section.body)}</p>
+ <p class="cs-paragraph-body">${escapeHtml(stripHtmlTags(section.body))}</p>
```

This strips `<strong>text</strong>` down to just `text`, which then renders as body text — no visible stars, no visible HTML tags.

#### Step 3: Add BoldText token to DESIGN.md

**File:** `DESIGN.md` (after typography body-md / body-sm):

```yaml
  boldText:
    fontFamily: Geist Mono
    fontWeight: 600
    fontSize: 0.95rem
    lineHeight: 1.7
```

#### Step 4: Build and verify

```bash
bun run build
```

If dev server available, verify:
- No visible `*` characters
- "Adopters" and "Inactive users" render as bold text on the page
- Adopters paragraph appears above Inactive paragraph