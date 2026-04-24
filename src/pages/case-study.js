import { findProject } from '../data/projects.js';
import { navigate } from '../router.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      min-height: 100vh;
      color: #fff;
      font-family: 'Geist Mono', ui-monospace, monospace;
    }

    @keyframes cs-enter {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .wrap {
      max-width: 960px;
      margin: 0 auto;
      padding: 120px 24px 80px;
      animation: cs-enter 0.45s cubic-bezier(0.33, 1, 0.68, 1) 0.15s both;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 18px;
    }

    .title {
      font-family: 'Panchang', sans-serif;
      font-weight: 600;
      font-size: clamp(2.5rem, 7vw, 4.5rem);
      line-height: 1;
      margin: 0 0 24px;
      color: #fff;
    }

    .intro {
      font-size: 0.95rem;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 48px;
      white-space: pre-line;
    }

    .hero-image {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 16px;
      margin: 0 0 48px;
    }

    .coming-soon {
      border: 1px dashed rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 60px 32px;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .sections {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    .hero-placeholder {
      aspect-ratio: 16 / 10;
      border-radius: 16px;
      background:
        radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.05), transparent 40%),
        linear-gradient(135deg, #1c1e1c 0%, #0e0f0d 100%);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.35);
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-heading {
      font-family: 'Panchang', sans-serif;
      font-weight: 600;
      font-size: 1.5rem;
      line-height: 1.15;
      margin: 0;
      color: #fff;
    }

    .section-body,
    .paragraph-body {
      font-size: 0.95rem;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      white-space: pre-line;
    }

    .section-list {
      font-size: 0.95rem;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.7);
      margin: 12px 0 0;
      padding-left: 1.25rem;
    }

    .section-list li {
      margin-bottom: 6px;
    }

    .section-list li::marker {
      color: rgba(255, 255, 255, 0.35);
    }

    .callout {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      background: rgba(255, 255, 255, 0.02);
    }

    .callout-eyebrow {
      font-size: 0.7rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
    }

    .callout-body {
      font-size: 0.9rem;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.75);
      white-space: pre-line;
      margin: 0;
    }

    .callout-quote {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .callout-quote-label {
      font-size: 0.7rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.4);
    }

    .callout-quote-text {
      font-size: 0.95rem;
      color: var(--accent, #fff);
    }

    .feature {
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: #1a1b19;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 16px 16px 24px;
      margin: 0;
    }

    .feature-image {
      width: 100%;
      aspect-ratio: 16 / 10;
      border-radius: 12px;
      background:
        repeating-linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.02) 0 12px,
          rgba(255, 255, 255, 0.04) 12px 24px
        ),
        #3a3a38;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
      letter-spacing: 0.06em;
    }

    img.feature-image,
    video.feature-image {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: auto;
      background: none;
      object-fit: contain;
    }

    .feature-caption {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      padding: 0 8px;
    }

    .bare-image {
      display: block;
      width: 100%;
      height: auto;
      margin: 0;
    }

    .carousel {
      position: relative;
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      background: #0e0f0d;
    }

    .carousel-track {
      position: absolute;
      inset: 0;
      display: flex;
      transition: transform 0.45s cubic-bezier(0.33, 1, 0.68, 1);
      will-change: transform;
    }

    .carousel-slide {
      flex: 0 0 100%;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .carousel-slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .carousel-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      opacity: 0;
      transition: opacity 0.2s ease, background 0.2s ease;
      z-index: 2;
    }

    .carousel-arrow:hover {
      background: rgba(0, 0, 0, 0.65);
    }

    .carousel-arrow svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    .carousel-arrow.prev { left: 12px; }
    .carousel-arrow.next { right: 12px; }

    .carousel-arrow:disabled {
      opacity: 0 !important;
      pointer-events: none;
    }

    .carousel:hover .carousel-arrow:not(:disabled) {
      opacity: 1;
    }

    @media (hover: none) {
      .carousel-arrow:not(:disabled) {
        opacity: 1;
      }
    }

    .carousel-dots {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 2;
      padding: 6px 10px;
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-radius: 999px;
    }

    .carousel-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.35);
      border: 0;
      padding: 0;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .carousel-dot.active {
      background: #fff;
      transform: scale(1.15);
    }

    .back-rail {
      margin-bottom: 32px;
    }

    .back {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.7);
      padding: 8px 14px 8px 10px;
      border-radius: 999px;
      font-family: inherit;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      animation: cs-enter 0.4s ease-out both;
      transition: color 0.2s, background 0.2s;
    }

    .back:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.09);
    }

    .back svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }

    .not-found {
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      padding-top: 160px;
    }
  </style>

  <div class="wrap">
    <div class="back-rail">
      <button class="back" part="back" aria-label="Back to home">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        Back
      </button>
    </div>
    <div class="content"></div>
  </div>
`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderItems(items) {
  if (!items || !items.length) return '';
  const lis = items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<ul class="section-list">${lis}</ul>`;
}

function renderSection(section) {
  switch (section.type) {
    case 'hero-placeholder':
      return `<div class="hero-placeholder">${escapeHtml(section.label ?? '')}</div>`;
    case 'section':
      return `
        <section class="section">
          <h2 class="section-heading">${escapeHtml(section.heading)}</h2>
          ${section.body ? `<p class="section-body">${escapeHtml(section.body)}</p>` : ''}
          ${renderItems(section.items)}
        </section>
      `;
    case 'paragraph':
      return `
        <p class="paragraph-body">${escapeHtml(section.body)}</p>
        ${renderItems(section.items)}
      `;
    case 'callout':
      return `
        <aside class="callout">
          ${section.eyebrow ? `<div class="callout-eyebrow">${escapeHtml(section.eyebrow)}</div>` : ''}
          <p class="callout-body">${escapeHtml(section.body)}</p>
          ${section.quote ? `
            <div class="callout-quote">
              ${section.quoteLabel ? `<div class="callout-quote-label">${escapeHtml(section.quoteLabel)}</div>` : ''}
              <div class="callout-quote-text">${escapeHtml(section.quote)}</div>
            </div>
          ` : ''}
        </aside>
      `;
    case 'image': {
      const ratio = section.aspectRatio ? ` style="aspect-ratio: ${section.aspectRatio};"` : '';
      return `<img class="bare-image" src="${section.image}" alt="${escapeHtml(section.label ?? '')}"${ratio} />`;
    }
    case 'feature': {
      const ratio = section.aspectRatio ? ` style="aspect-ratio: ${section.aspectRatio};"` : '';
      let media;
      if (section.video) {
        media = `<video class="feature-image" autoplay loop muted playsinline preload="auto"${ratio}><source src="${section.video}" type="video/mp4" /></video>`;
      } else if (section.image) {
        media = `<img class="feature-image" src="${section.image}" alt="${escapeHtml(section.caption ?? section.label ?? '')}"${ratio} />`;
      } else {
        media = `<div class="feature-image"${ratio}>${escapeHtml(section.label ?? '')}</div>`;
      }
      return `
        <figure class="feature">
          ${media}
          ${section.caption ? `<figcaption class="feature-caption">${escapeHtml(section.caption)}</figcaption>` : ''}
        </figure>
      `;
    }
    case 'carousel': {
      const images = section.images ?? [];
      const slides = images
        .map(
          (img) => `
            <div class="carousel-slide">
              <img src="${img.src}" alt="${escapeHtml(img.alt ?? '')}" />
            </div>
          `
        )
        .join('');
      const dots = images
        .map((_, i) => `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`)
        .join('');
      return `
        <figure class="feature">
          <div class="carousel" data-count="${images.length}">
            <div class="carousel-track">${slides}</div>
            <button class="carousel-arrow prev" aria-label="Previous slide" disabled>
              <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button class="carousel-arrow next" aria-label="Next slide"${images.length <= 1 ? ' disabled' : ''}>
              <svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
            </button>
            <div class="carousel-dots">${dots}</div>
          </div>
          ${section.caption ? `<figcaption class="feature-caption">${escapeHtml(section.caption)}</figcaption>` : ''}
        </figure>
      `;
    }
    default:
      return '';
  }
}

class CaseStudyPage extends HTMLElement {
  static get observedAttributes() { return ['slug']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._content = this.shadowRoot.querySelector('.content');
    this._back = this.shadowRoot.querySelector('.back');
  }

  connectedCallback() {
    this._back.addEventListener('click', this._onBack);
    this._render();
  }

  disconnectedCallback() {
    this._back.removeEventListener('click', this._onBack);
    this._teardownVideoPlayback?.();
    this._teardownCarousels?.();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  _onBack = () => navigate('/');

  _render() {
    const slug = this.getAttribute('slug') ?? '';
    const project = findProject(slug);

    if (!project) {
      this._content.innerHTML = `<div class="not-found">Project not found — <a href="/" style="color: #99cc00">back home</a></div>`;
      return;
    }

    this.style.setProperty('--accent', project.accent);
    const hero = project.heroVideo
      ? `<video class="hero-image" autoplay loop muted playsinline preload="auto"><source src="${project.heroVideo}" type="video/mp4" /></video>`
      : project.heroImage
      ? `<img class="hero-image" src="${project.heroImage}" alt="${project.title}" />`
      : '';

    const body = project.sections
      ? `<div class="sections">${project.sections.map(renderSection).join('')}</div>`
      : '<div class="coming-soon">Coming soon</div>';

    const intro = project.intro
      ? `<p class="intro">${escapeHtml(project.intro)}</p>`
      : '';

    this._content.innerHTML = `
      <div class="eyebrow">Case study · ${project.year}</div>
      <h1 class="title">${project.title}</h1>
      ${intro}
      ${hero}
      ${body}
    `;

    this._setupVideoPlayback();
    this._setupCarousels();
  }

  _setupVideoPlayback() {
    this._teardownVideoPlayback?.();
    const videos = Array.from(this._content.querySelectorAll('video'));
    if (!videos.length) return;

    const check = () => {
      const vh = window.innerHeight;
      for (const v of videos) {
        const r = v.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const inCenter = center > 0 && center < vh;
        if (inCenter) {
          if (v.paused) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; check(); });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    videos.forEach((v) => v.addEventListener('loadedmetadata', check));
    check();

    this._teardownVideoPlayback = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      this._teardownVideoPlayback = null;
    };
  }

  _setupCarousels() {
    this._teardownCarousels?.();
    const carousels = Array.from(this._content.querySelectorAll('.carousel'));
    if (!carousels.length) return;

    const cleanups = carousels.map((carousel) => {
      const track = carousel.querySelector('.carousel-track');
      const prev = carousel.querySelector('.carousel-arrow.prev');
      const next = carousel.querySelector('.carousel-arrow.next');
      const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
      const count = Number(carousel.dataset.count) || 0;
      let index = 0;

      const update = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        prev.disabled = index === 0;
        next.disabled = index >= count - 1;
      };

      const go = (i) => {
        index = Math.max(0, Math.min(count - 1, i));
        update();
      };

      const onPrev = () => go(index - 1);
      const onNext = () => go(index + 1);
      const onDot = (e) => {
        const i = Number(e.currentTarget.dataset.index);
        if (!Number.isNaN(i)) go(i);
      };

      prev.addEventListener('click', onPrev);
      next.addEventListener('click', onNext);
      dots.forEach((d) => d.addEventListener('click', onDot));
      update();

      return () => {
        prev.removeEventListener('click', onPrev);
        next.removeEventListener('click', onNext);
        dots.forEach((d) => d.removeEventListener('click', onDot));
      };
    });

    this._teardownCarousels = () => {
      cleanups.forEach((fn) => fn());
      this._teardownCarousels = null;
    };
  }
}

customElements.define('case-study-page', CaseStudyPage);
