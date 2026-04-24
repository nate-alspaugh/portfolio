import gsap from 'gsap';
import { projects } from '../data/projects.js';
import { navigate } from '../router.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: var(--font-geist-mono);
    }

    .label {
      display: block;
      font-size: 16px;
      line-height: 1;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      margin: 0 0 28px;
    }

    .list {
      display: flex;
      flex-direction: column;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 0;
      font-size: 16px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.9);
      text-transform: uppercase;
      text-decoration: none;
      border-bottom: 0.5px solid rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: color 140ms ease;
    }

    .row-thumb {
      display: none;
      flex-shrink: 0;
      width: 44px;
      aspect-ratio: 4 / 3;
      border-radius: 4px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.06);
    }

    .row-thumb img,
    .row-thumb video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .row:first-child {
      border-top: 0.5px solid rgba(255, 255, 255, 0.6);
    }

    .row:hover,
    .row:focus-visible {
      color: #99cc00;
      outline: none;
    }

    .row--disabled {
      cursor: default;
      color: rgba(255, 255, 255, 0.5);
      position: relative;
    }

    .row--disabled:hover,
    .row--disabled:focus-visible {
      color: rgba(255, 255, 255, 0.5);
    }

    .row-title {
      display: inline-flex;
      align-items: center;
      gap: 12px;
    }

    .coming-soon {
      margin-left: auto;
      font-size: 12px;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.5);
      border: 0.5px solid rgba(255, 255, 255, 0.35);
      border-radius: 999px;
      padding: 3px 10px;
      text-transform: uppercase;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 140ms ease;
    }

    .row--disabled:hover .coming-soon,
    .row--disabled:focus-visible .coming-soon {
      opacity: 1;
    }

    @media (hover: none), (max-width: 1023px) {
      .coming-soon {
        opacity: 1;
      }
    }

    .hover-preview {
      position: fixed;
      top: 0;
      left: 0;
      width: 190px;
      aspect-ratio: 4 / 3;
      display: block;
      opacity: 0;
      pointer-events: none;
      border-radius: 10px;
      overflow: hidden;
      will-change: transform, opacity;
      filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.45));
      z-index: 9999;
    }

    .hover-preview img,
    .hover-preview video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: none;
    }

    .hover-preview.show-image img,
    .hover-preview.show-video video {
      display: block;
    }

    @media (hover: none), (max-width: 1023px) {
      .hover-preview {
        display: none;
      }
    }

    @media (max-width: 1023px) {
      .label {
        font-size: 14px;
        margin-bottom: 18px;
      }

      .row {
        font-size: 14px;
        padding: 12px 0;
      }

      .row-thumb {
        display: block;
      }
    }
  </style>

  <span class="label">Featured work</span>
  <div class="list"></div>
  <div class="hover-preview" aria-hidden="true">
    <img alt="" />
    <video muted loop playsinline preload="auto"></video>
  </div>
`;

class WorkList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._list = this.shadowRoot.querySelector('.list');
    this._preview = this.shadowRoot.querySelector('.hover-preview');
    this._previewImg = this._preview.querySelector('img');
    this._previewVideo = this._preview.querySelector('video');
    this._activeRow = null;
    this._rowHandlers = [];
    this._onClick = this._onClick.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onDocLeave = this._onDocLeave.bind(this);
  }

  connectedCallback() {
    this._list.innerHTML = projects
      .map((p) => {
        let thumb = '';
        if (p.heroVideo) {
          thumb = `<span class="row-thumb" aria-hidden="true"><video src="${p.heroVideo}" autoplay loop muted playsinline preload="auto"></video></span>`;
        } else if (p.heroImage) {
          thumb = `<span class="row-thumb" aria-hidden="true"><img src="${p.heroImage}" alt="" /></span>`;
        }
        if (p.comingSoon) {
          return `<div class="row row--disabled" data-slug="${p.slug}" aria-disabled="true"><span class="row-title">${thumb}<span>${p.title}</span></span><span class="coming-soon">Coming soon</span></div>`;
        }
        return `<a class="row" href="/work/${p.slug}" data-slug="${p.slug}"><span class="row-title">${thumb}<span>${p.title}</span></span></a>`;
      })
      .join('');
    this._list.addEventListener('click', this._onClick);

    this._quickX = gsap.quickTo(this._preview, 'x', { duration: 0.35, ease: 'power3.out' });
    this._quickY = gsap.quickTo(this._preview, 'y', { duration: 0.35, ease: 'power3.out' });

    const rows = this._list.querySelectorAll('.row');
    rows.forEach((row) => {
      const project = projects.find((p) => p.slug === row.dataset.slug);
      if (!project || project.comingSoon || (!project.heroImage && !project.heroVideo)) return;
      const enter = (e) => this._onRowEnter(e, project);
      const leave = () => this._onRowLeave();
      row.addEventListener('mouseenter', enter);
      row.addEventListener('mouseleave', leave);
      this._rowHandlers.push({ row, enter, leave });
    });

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseleave', this._onDocLeave);
  }

  disconnectedCallback() {
    this._list.removeEventListener('click', this._onClick);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseleave', this._onDocLeave);
    this._rowHandlers.forEach(({ row, enter, leave }) => {
      row.removeEventListener('mouseenter', enter);
      row.removeEventListener('mouseleave', leave);
    });
    this._rowHandlers = [];
    gsap.killTweensOf(this._preview);
  }

  _onRowEnter(e, project) {
    this._activeRow = e.currentTarget;
    if (project.heroVideo) {
      if (this._previewVideo.getAttribute('src') !== project.heroVideo) {
        this._previewVideo.src = project.heroVideo;
      }
      this._preview.classList.remove('show-image');
      this._preview.classList.add('show-video');
      this._previewVideo.play().catch(() => {});
    } else if (project.heroImage) {
      if (this._previewImg.getAttribute('src') !== project.heroImage) {
        this._previewImg.src = project.heroImage;
      }
      this._preview.classList.remove('show-video');
      this._preview.classList.add('show-image');
      this._previewVideo.pause?.();
    }
    const { x, y } = this._cursorOffset(e.clientX, e.clientY);
    gsap.set(this._preview, { x, y });
    gsap.to(this._preview, {
      opacity: 1,
      duration: 0.18,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  _onRowLeave() {
    this._activeRow = null;
    this._previewVideo.pause();
    gsap.to(this._preview, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
      overwrite: 'auto',
    });
  }

  _onMouseMove(e) {
    if (!this._activeRow) return;
    const { x, y } = this._cursorOffset(e.clientX, e.clientY);
    this._quickX(x);
    this._quickY(y);
  }

  _onDocLeave() {
    if (!this._activeRow) return;
    this._onRowLeave();
  }

  _cursorOffset(cx, cy) {
    const gap = 16;
    const w = this._preview.offsetWidth || 190;
    const h = this._preview.offsetHeight || 142;
    return { x: cx - w - gap, y: cy - h - gap };
  }

  _onClick(e) {
    const row = e.target.closest('.row');
    if (!row) return;
    if (row.classList.contains('row--disabled')) {
      e.preventDefault();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    navigate('/work/' + row.dataset.slug);
  }
}

customElements.define('work-list', WorkList);
