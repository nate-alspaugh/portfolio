// Pure HTML-string renderers for case study pages.
// Used both at runtime (case-study-page custom element) and at build time
// (vite prerender plugin). Image / video / carousel sections render media
// only when src URLs are present, so the same code works for SSR text-only
// data and runtime data with hashed asset URLs.

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderItems(items) {
  if (!items || !items.length) return '';
  const lis = items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<ul class="cs-section-list">${lis}</ul>`;
}

function renderSection(section) {
  switch (section.type) {
    case 'hero-placeholder':
      return `<div class="cs-hero-placeholder">${escapeHtml(section.label ?? '')}</div>`;
    case 'section':
      return `
        <section class="cs-section">
          <h2 class="cs-section-heading">${escapeHtml(section.heading)}</h2>
          ${section.body ? `<p class="cs-section-body">${escapeHtml(section.body)}</p>` : ''}
          ${renderItems(section.items)}
        </section>
      `;
    case 'paragraph':
      return `
        <p class="cs-paragraph-body">${escapeHtml(section.body)}</p>
        ${renderItems(section.items)}
      `;
    case 'callout':
      return `
        <aside class="cs-callout">
          ${section.eyebrow ? `<div class="cs-callout-eyebrow">${escapeHtml(section.eyebrow)}</div>` : ''}
          <p class="cs-callout-body">${escapeHtml(section.body)}</p>
          ${section.quote ? `
            <div class="cs-callout-quote">
              ${section.quoteLabel ? `<div class="cs-callout-quote-label">${escapeHtml(section.quoteLabel)}</div>` : ''}
              <div class="cs-callout-quote-text">${escapeHtml(section.quote)}</div>
            </div>
          ` : ''}
        </aside>
      `;
    case 'image': {
      const ratio = section.aspectRatio ? ` style="aspect-ratio: ${section.aspectRatio};"` : '';
      if (!section.image) return '';
      return `<img class="cs-bare-image" src="${section.image}" alt="${escapeHtml(section.label ?? '')}"${ratio} />`;
    }
    case 'feature': {
      const ratio = section.aspectRatio ? ` style="aspect-ratio: ${section.aspectRatio};"` : '';
      let media = '';
      if (section.video) {
        media = `<video class="cs-feature-image" autoplay loop muted playsinline preload="auto"${ratio}><source src="${section.video}" type="video/mp4" /></video>`;
      } else if (section.image) {
        media = `<img class="cs-feature-image" src="${section.image}" alt="${escapeHtml(section.caption ?? section.label ?? '')}"${ratio} />`;
      }
      // No media (prerender / text-only): render caption-only figure so crawlers see context.
      return `
        <figure class="cs-feature">
          ${media}
          ${section.caption ? `<figcaption class="cs-feature-caption">${escapeHtml(section.caption)}</figcaption>` : ''}
        </figure>
      `;
    }
    case 'carousel': {
      const images = section.images ?? [];
      if (!images.length) {
        // Prerender / text-only fallback.
        return section.caption
          ? `<figure class="cs-feature"><figcaption class="cs-feature-caption">${escapeHtml(section.caption)}</figcaption></figure>`
          : '';
      }
      const slides = images
        .map(
          (img) => `
            <div class="cs-carousel-slide">
              <img src="${img.src}" alt="${escapeHtml(img.alt ?? '')}" />
            </div>
          `
        )
        .join('');
      const dots = images
        .map((_, i) => `<button class="cs-carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`)
        .join('');
      return `
        <figure class="cs-feature">
          <div class="cs-carousel" data-count="${images.length}">
            <div class="cs-carousel-track">${slides}</div>
            <button class="cs-carousel-arrow prev" aria-label="Previous slide" disabled>
              <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button class="cs-carousel-arrow next" aria-label="Next slide"${images.length <= 1 ? ' disabled' : ''}>
              <svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
            </button>
            <div class="cs-carousel-dots">${dots}</div>
          </div>
          ${section.caption ? `<figcaption class="cs-feature-caption">${escapeHtml(section.caption)}</figcaption>` : ''}
        </figure>
      `;
    }
    default:
      return '';
  }
}

export function renderCaseStudyContent(project) {
  if (!project) {
    return `<div class="cs-not-found">Project not found — <a href="/" style="color: #99cc00">back home</a></div>`;
  }

  const hero = project.heroVideo
    ? `<video class="cs-hero-image" autoplay loop muted playsinline preload="auto"><source src="${project.heroVideo}" type="video/mp4" /></video>`
    : project.heroImage
    ? `<img class="cs-hero-image" src="${project.heroImage}" alt="${escapeHtml(project.title)}" />`
    : '';

  const body = project.sections
    ? `<div class="cs-sections">${project.sections.map(renderSection).join('')}</div>`
    : '<div class="cs-coming-soon">Coming soon</div>';

  const intro = project.intro
    ? `<p class="cs-intro">${escapeHtml(project.intro)}</p>`
    : '';

  return `
    <div class="cs-eyebrow">Case study · ${escapeHtml(project.year ?? '')}</div>
    <h1 class="cs-title">${escapeHtml(project.title)}</h1>
    ${intro}
    ${hero}
    ${body}
  `;
}

export function renderCaseStudyPage(project) {
  const accentStyle = project?.accent ? ` style="--accent: ${project.accent};"` : '';
  return `
    <case-study-page slug="${escapeHtml(project?.slug ?? '')}"${accentStyle}>
      <div class="cs-wrap">
        <div class="cs-back-rail">
          <button class="cs-back" data-back aria-label="Back to home">
            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            Back
          </button>
        </div>
        <div class="cs-content">${renderCaseStudyContent(project)}</div>
      </div>
    </case-study-page>
  `;
}
