const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      font-family: var(--font-geist-mono, 'Geist Mono', monospace);
    }

    @keyframes nav-enter {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .nav-bar {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px;
      gap: 0;
      animation: nav-enter 0.6s cubic-bezier(0.33, 1, 0.68, 1) 0.1s both;
    }

    .nav-pages {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .nav-tab {
      font-family: inherit;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: rgba(255, 255, 255, 0.5);
      background: none;
      border: none;
      padding: 8px 16px;
      border-radius: 999px;
      cursor: pointer;
      transition: color 0.2s, background 0.2s;
    }

    .nav-tab:hover {
      color: rgba(255, 255, 255, 0.8);
    }

    .nav-tab.active {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    .nav-divider {
      width: 1px;
      height: 16px;
      background: rgba(255, 255, 255, 0.1);
      margin: 0 4px;
    }

    .nav-social {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.5);
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.2s, background 0.2s;
      text-decoration: none;
      position: relative;
      padding: 0;
    }

    .nav-icon:hover {
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.06);
    }

    .nav-icon svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
      flex-shrink: 0;
    }

    /* Email button — separate from .nav-icon sizing */
    .email-btn {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 32px;
      width: auto;
      min-width: 32px;
      overflow: hidden;
      border-radius: 999px;
      border: none;
      background: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 0 8px;
      gap: 6px;
      position: relative;
      font-family: inherit;
      transition: color 0.2s, background 0.2s;
    }

    .email-btn:hover {
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.06);
    }

    .email-btn svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
      flex-shrink: 0;
    }

    .email-text-wrap {
      position: relative;
      overflow: hidden;
      max-width: 0;
      transition: max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .email-label {
      display: inline-block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: rgba(255, 255, 255, 0.6);
      white-space: nowrap;
      opacity: 0;
      filter: blur(4px);
      transition: opacity 0.25s ease-out, filter 0.25s ease-out;
    }

    .email-label.is-visible {
      opacity: 1;
      filter: blur(0px);
    }

    .email-highlight {
      color: rgba(255, 255, 255, 0.9);
    }

    .email-copied {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #99cc00;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 4px;
      opacity: 0;
      filter: blur(4px);
      transform: translateY(-16px);
      transition: opacity 0.3s ease-out, filter 0.3s ease-out, transform 0.3s ease-out;
    }

    .email-copied.is-visible {
      opacity: 1;
      filter: blur(0px);
      transform: translateY(0);
    }

    .email-copied svg {
      width: 14px;
      height: 14px;
      fill: #99cc00;
    }
  </style>

  <nav class="nav-bar">
    <div class="nav-pages">
      <button class="nav-tab active" data-page="home">Home</button>
      <button class="nav-tab" data-page="work">Work</button>
      <button class="nav-tab" data-page="thoughts">Thoughts</button>
    </div>
    <div class="nav-divider"></div>
    <div class="nav-social">
      <a class="nav-icon" href="https://www.linkedin.com/in/nathan-alspaugh/" target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a class="nav-icon" href="https://dribbble.com/nathan-alspaugh" target="_blank" rel="noopener" aria-label="Dribbble">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.81zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702A10.005 10.005 0 0012 1.968c-.83 0-1.634.105-2.4.084zm10.335 3.483c-.218.29-1.89 2.478-5.64 4.023.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.4-6.37z"/>
        </svg>
      </a>
      <button class="email-btn" aria-label="Copy email address">
        <svg class="email-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
        </svg>
        <span class="email-text-wrap">
          <span class="email-label">copy <span class="email-highlight">nate.alspaugh18@gmail.com</span> to your clipboard</span>
          <span class="email-copied">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            copied nate.alspaugh18@gmail.com
          </span>
        </span>
      </button>
    </div>
  </nav>
`;

class MainNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Tab click handling
    this.shadowRoot.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.shadowRoot.querySelector('.nav-tab.active')?.classList.remove('active');
        tab.classList.add('active');
        this.dispatchEvent(new CustomEvent('nav-change', {
          detail: { page: tab.dataset.page },
          bubbles: true,
          composed: true,
        }));
      });
    });

    // Email hover + click
    const emailBtn = this.shadowRoot.querySelector('.email-btn');
    const emailLabel = this.shadowRoot.querySelector('.email-label');
    const emailCopied = this.shadowRoot.querySelector('.email-copied');
    const emailIcon = this.shadowRoot.querySelector('.email-icon');
    const emailWrap = this.shadowRoot.querySelector('.email-text-wrap');
    let copyAnimating = false;

    // Measure natural width by temporarily expanding the container
    const measureWidth = (el) => {
      // Disable transition during measurement
      emailWrap.style.transition = 'none';
      emailWrap.style.maxWidth = '9999px';
      const w = el.getBoundingClientRect().width;
      emailWrap.style.maxWidth = '';
      // Force reflow so the transition: none takes effect before restoring
      emailWrap.offsetHeight;
      emailWrap.style.transition = '';
      return Math.ceil(w) + 2;
    };

    emailBtn.addEventListener('mouseenter', () => {
      if (copyAnimating) return;
      const labelWidth = measureWidth(emailLabel);
      emailWrap.style.maxWidth = labelWidth + 'px';
      setTimeout(() => emailLabel.classList.add('is-visible'), 80);
    });

    emailBtn.addEventListener('mouseleave', () => {
      if (copyAnimating) return;
      emailLabel.classList.remove('is-visible');
      emailWrap.style.maxWidth = '0';
    });

    // Email click — swap to copied, then collapse back to icon
    emailBtn.addEventListener('click', () => {
      if (copyAnimating) return;
      copyAnimating = true;

      navigator.clipboard.writeText('nate.alspaugh18@gmail.com').catch(() => {});

      emailLabel.classList.remove('is-visible');

      const copiedWidth = measureWidth(emailCopied);

      // Phase 1: label out, icon out, resize to copied width, copied in
      emailLabel.style.transform = 'translateY(16px)';
      emailLabel.style.opacity = '0';
      emailLabel.style.filter = 'blur(4px)';
      emailIcon.style.transition = 'opacity 0.25s ease-in, filter 0.25s ease-in';
      emailIcon.style.opacity = '0';
      emailIcon.style.filter = 'blur(4px)';

      emailWrap.style.maxWidth = copiedWidth + 'px';

      setTimeout(() => {
        emailCopied.classList.add('is-visible');
      }, 150);

      // Phase 2: after hold, copied out, collapse, icon back
      setTimeout(() => {
        emailCopied.style.transition = 'opacity 0.25s ease-in, filter 0.25s ease-in, transform 0.25s ease-in';
        emailCopied.style.opacity = '0';
        emailCopied.style.filter = 'blur(4px)';
        emailCopied.style.transform = 'translateY(16px)';

        setTimeout(() => {
          emailWrap.style.maxWidth = '0';
        }, 100);

        emailIcon.style.transition = 'opacity 0.3s ease-out 0.1s, filter 0.3s ease-out 0.1s';
        emailIcon.style.opacity = '1';
        emailIcon.style.filter = 'blur(0px)';

        // Clean up after all transitions
        setTimeout(() => {
          copyAnimating = false;
          emailCopied.classList.remove('is-visible');
          emailCopied.removeAttribute('style');
          emailLabel.removeAttribute('style');
          emailIcon.removeAttribute('style');
          emailWrap.removeAttribute('style');
        }, 400);
      }, 1800);
    });

  }
}

customElements.define('main-nav', MainNav);
