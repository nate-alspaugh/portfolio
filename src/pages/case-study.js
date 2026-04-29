import { findProject } from '../data/projects.js';
import { navigate } from '../router.js';
import { renderCaseStudyContent } from '../lib/case-study-html.js';

class CaseStudyPage extends HTMLElement {
  static get observedAttributes() { return ['slug']; }

  constructor() {
    super();
    this._onBack = this._onBack.bind(this);
  }

  connectedCallback() {
    // Always render: prerendered children are text-only (no images/videos),
    // so we replace them with the full data once JS boots. The cs-enter
    // animation handles the transition.
    this._render();
  }

  disconnectedCallback() {
    this._teardown();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected || oldValue === newValue) return;
    this._render();
  }

  _render() {
    const slug = this.getAttribute('slug') ?? '';
    const project = findProject(slug);
    if (project?.accent) this.style.setProperty('--accent', project.accent);

    this.innerHTML = `
      <div class="cs-wrap">
        <div class="cs-back-rail">
          <button class="cs-back" data-back aria-label="Back to home">
            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            Back
          </button>
        </div>
        <div class="cs-content">${renderCaseStudyContent(project)}</div>
      </div>
    `;
    this._wire();
  }

  _wire() {
    this._teardown();
    const back = this.querySelector('.cs-back');
    if (back) back.addEventListener('click', this._onBack);
    this._setupVideoPlayback();
    this._setupCarousels();
  }

  _teardown() {
    const back = this.querySelector('.cs-back');
    if (back) back.removeEventListener('click', this._onBack);
    this._teardownVideoPlayback?.();
    this._teardownCarousels?.();
  }

  _onBack() {
    navigate('/');
  }

  _setupVideoPlayback() {
    this._teardownVideoPlayback?.();
    const videos = Array.from(this.querySelectorAll('video'));
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
    const carousels = Array.from(this.querySelectorAll('.cs-carousel'));
    if (!carousels.length) return;

    const cleanups = carousels.map((carousel) => {
      const track = carousel.querySelector('.cs-carousel-track');
      const prev = carousel.querySelector('.cs-carousel-arrow.prev');
      const next = carousel.querySelector('.cs-carousel-arrow.next');
      const dots = Array.from(carousel.querySelectorAll('.cs-carousel-dot'));
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
