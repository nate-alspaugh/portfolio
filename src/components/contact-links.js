const LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nathan-alspaugh/' },
  { label: 'Dribbble', href: 'https://dribbble.com/nathan-alspaugh' },
];

const ARROW_SVG = `
  <svg class="row__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden="true">
    <line x1="64" y1="192" x2="192" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
    <polyline points="88 64 192 64 192 168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
  </svg>
`;

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      gap: 24px;
      font-family: var(--font-geist-mono);
    }

    .label {
      font-size: 16px;
      line-height: 1;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.9);
      text-transform: uppercase;
      text-decoration: none;
      width: fit-content;
      transition: color 140ms ease;
    }

    .row__label {
      display: inline-block;
    }

    .row__arrow {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      color: rgba(255, 255, 255, 0.4);
      transition: color 140ms ease, transform 180ms ease;
    }

    .row:hover,
    .row:focus-visible {
      color: #99cc00;
      outline: none;
    }

    .row:hover .row__arrow,
    .row:focus-visible .row__arrow {
      color: #99cc00;
      transform: translate(2px, -2px);
    }

    .rows {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    @media (max-width: 1023px) {
      :host {
        gap: 18px;
      }

      .label {
        font-size: 14px;
      }

      .row {
        font-size: 14px;
      }

      .row__arrow {
        width: 20px;
        height: 20px;
      }

      .rows {
        gap: 16px;
      }
    }
  </style>

  <span class="label">Get in touch</span>
  <div class="rows"></div>
`;

class ContactLinks extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const rows = this.shadowRoot.querySelector('.rows');
    rows.innerHTML = LINKS.map((link) => `
      <a class="row" href="${link.href}" target="_blank" rel="noopener noreferrer">
        <span class="row__label">${link.label}</span>
        ${ARROW_SVG}
      </a>
    `).join('');
  }
}

customElements.define('contact-links', ContactLinks);
