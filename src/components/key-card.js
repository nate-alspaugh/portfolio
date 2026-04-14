import gsap from 'gsap';
import cutoutUrl from '../assets/nate-cutout-2025.png';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    @property --mx {
      syntax: '<percentage>';
      inherits: false;
      initial-value: 50%;
    }
    @property --my {
      syntax: '<percentage>';
      inherits: false;
      initial-value: 30%;
    }

    :host {
      display: block;
      perspective: 800px;
    }

    .key-card {
      position: relative;
      width: 340px;
      border-radius: 24px;
      background: #99cc00;
      overflow: visible;
      display: flex;
      flex-direction: column;
      padding: 56px 24px 28px;
      transform-style: preserve-3d;
      will-change: transform;
      cursor: default;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
    }

    /* Notch cutout at top center — rectangular lanyard slot */
    .notch {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 48px;
      height: 10px;
      background: #151614;
      border-radius: 8px;
      z-index: 10;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
    }

    /* ASCII texture overlay */
    .key-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cstyle%3Etext%7Bfont-family:monospace;font-size:16px;fill:rgba(0,0,0,0.13)%7D%3C/style%3E%3Ctext x='5' y='12'%3E*%3C/text%3E%3Ctext x='30' y='12'%3E~%3C/text%3E%3Ctext x='58' y='12'%3E%23%3C/text%3E%3Ctext x='85' y='12'%3E+%3C/text%3E%3Ctext x='112' y='12'%3E%25%3C/text%3E%3Ctext x='18' y='28'%3E%40%3C/text%3E%3Ctext x='45' y='28'%3E/%3C/text%3E%3Ctext x='72' y='28'%3E=%3C/text%3E%3Ctext x='100' y='28'%3E%5E%3C/text%3E%3Ctext x='128' y='28'%3E~%3C/text%3E%3Ctext x='8' y='44'%3E%25%3C/text%3E%3Ctext x='35' y='44'%3E*%3C/text%3E%3Ctext x='62' y='44'%3E+%3C/text%3E%3Ctext x='90' y='44'%3E%23%3C/text%3E%3Ctext x='118' y='44'%3E%40%3C/text%3E%3Ctext x='22' y='60'%3E/%3C/text%3E%3Ctext x='48' y='60'%3E%5E%3C/text%3E%3Ctext x='75' y='60'%3E~%3C/text%3E%3Ctext x='105' y='60'%3E=%3C/text%3E%3Ctext x='132' y='60'%3E*%3C/text%3E%3Ctext x='12' y='76'%3E%23%3C/text%3E%3Ctext x='40' y='76'%3E%40%3C/text%3E%3Ctext x='68' y='76'%3E%25%3C/text%3E%3Ctext x='95' y='76'%3E+%3C/text%3E%3Ctext x='122' y='76'%3E/%3C/text%3E%3Ctext x='2' y='92'%3E~%3C/text%3E%3Ctext x='28' y='92'%3E=%3C/text%3E%3Ctext x='55' y='92'%3E%5E%3C/text%3E%3Ctext x='82' y='92'%3E*%3C/text%3E%3Ctext x='110' y='92'%3E%23%3C/text%3E%3Ctext x='15' y='108'%3E+%3C/text%3E%3Ctext x='42' y='108'%3E%25%3C/text%3E%3Ctext x='70' y='108'%3E/%3C/text%3E%3Ctext x='98' y='108'%3E~%3C/text%3E%3Ctext x='125' y='108'%3E%40%3C/text%3E%3Ctext x='8' y='124'%3E%5E%3C/text%3E%3Ctext x='35' y='124'%3E%23%3C/text%3E%3Ctext x='62' y='124'%3E=%3C/text%3E%3Ctext x='88' y='124'%3E+%3C/text%3E%3Ctext x='115' y='124'%3E*%3C/text%3E%3C/svg%3E") repeat;
      z-index: 1;
      pointer-events: none;
    }

    /* Holographic foil overlay */
    .key-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      pointer-events: none;
      z-index: 5;
      mix-blend-mode: overlay;
      transition: --mx 0.1s ease-out, --my 0.1s ease-out;
      background:
        /* Specular hotspot - follows mouse */
        radial-gradient(circle 265px at var(--mx) var(--my), rgba(255,255,255,0.65) 0%, transparent 60%),
        /* Highlight band */
        linear-gradient(135deg, transparent 15%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.05) 55%, transparent 75%),
        /* Iridescent color shifts */
        linear-gradient(160deg,
          rgba(200, 255, 0, 0.35) 0%,
          rgba(0, 255, 180, 0.2) 25%,
          rgba(180, 255, 50, 0.1) 45%,
          rgba(0, 230, 200, 0.25) 65%,
          rgba(220, 255, 0, 0.2) 85%,
          rgba(0, 255, 150, 0.15) 100%
        ),
        /* Depth gradient */
        radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.25) 0%, transparent 55%),
        /* Diagonal rainbow refraction */
        linear-gradient(
          200deg,
          transparent 20%,
          rgba(255, 255, 150, 0.12) 35%,
          rgba(150, 255, 200, 0.1) 45%,
          rgba(200, 255, 100, 0.08) 55%,
          transparent 70%
        ),
        /* Edge darkening for 3D depth */
        radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.22) 100%);
    }

    .photo-frame {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      z-index: 6;
      background: linear-gradient(to bottom, #D4D4D4, #B8B8B8);
      padding-top: 15%;
    }

    .photo {
      width: 100%;
      display: block;
      filter: grayscale(100%);
    }

    .info {
      position: relative;
      padding-top: 18px;
      text-align: center;
      z-index: 6;
    }

    .name {
      font-family: 'Panchang', sans-serif;
      font-weight: 600;
      font-size: 1.3rem;
      color: #151614;
      margin: 0 0 5px;
      line-height: 1.2;
    }

    .title {
      font-family: 'Geist Pixel Square', 'Geist Mono', monospace;
      font-weight: 500;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(21, 22, 20, 0.6);
      margin: 0;
    }

    .socials {
      position: relative;
      display: flex;
      gap: 8px;
      justify-content: center;
      padding-top: 16px;
      z-index: 6;
    }

    .social-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 10px;
      border: none;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.10);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #151614;
      font-family: 'Geist Mono', monospace;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease;
      text-decoration: none;
      line-height: 1;
    }

    .social-btn:hover {
      background: rgba(255, 255, 255, 0.20);
    }

    .social-btn svg {
      width: 18px;
      height: 18px;
      fill: #151614;
      flex-shrink: 0;
    }

    .toast {
      position: absolute;
      bottom: -44px;
      left: 50%;
      transform: translateX(-50%) translateY(8px);
      background: #151614;
      color: #fff;
      font-family: 'Geist Mono', monospace;
      font-size: 0.7rem;
      padding: 8px 14px;
      border-radius: 10px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      z-index: 20;
    }
  </style>

  <div class="key-card">
    <div class="notch"></div>
    <div class="photo-frame">
      <img class="photo" alt="Nathan Alspaugh" />
    </div>
    <div class="info">
      <h1 class="name">Nathan Alspaugh</h1>
      <p class="title">Sr. Product Designer</p>
    </div>
    <div class="socials">
      <a class="social-btn" href="https://www.linkedin.com/in/nathan-alspaugh/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M216,20H40A20,20,0,0,0,20,40V216a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V40A20,20,0,0,0,216,20ZM44,44H212V212H44ZM112,176V124a12,12,0,0,1,21.43-7.41A40,40,0,0,1,192,152v24a12,12,0,0,1-24,0V152a16,16,0,0,0-32,0v24a12,12,0,0,1-24,0ZM96,124v52a12,12,0,0,1-24,0V124a12,12,0,0,1,24,0ZM84,92A16,16,0,1,1,100,76,16,16,0,0,1,84,92Z"/></svg>
      </a>
      <a class="social-btn" href="https://dribbble.com/nathan-alspaugh" target="_blank" rel="noopener noreferrer" aria-label="Dribbble">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm83.13,65.27a83.92,83.92,0,0,1,8.17,20.45c-20.11,2.08-42.13,1-60.79-3A175.14,175.14,0,0,0,211.13,85.27Zm-18-17.28A84,84,0,0,1,137.8,44.34a163.18,163.18,0,0,0,27.48,28.76Q175.8,71.74,193.14,68Zm-78-22.45A84.31,84.31,0,0,1,128,44h1.63a187.26,187.26,0,0,1-31.75,33.48A192.52,192.52,0,0,1,115.16,45.54Zm-23.07,9.7A168.52,168.52,0,0,0,73.41,89.75,84.15,84.15,0,0,1,92.09,55.24Zm-38,53A84,84,0,0,1,56.22,96.5a192,192,0,0,0,37-4.93A216.38,216.38,0,0,1,69.14,128h-12C55.57,118.49,54.26,113.55,54.1,108.24Zm2.15,32.27A84.24,84.24,0,0,1,44,128c0-1.22,0-2.43.08-3.64A107.4,107.4,0,0,0,69.14,128h0a216.38,216.38,0,0,1-12.89,12.51Zm99.24,67.68A84,84,0,0,1,82.41,196.7a152.27,152.27,0,0,1,43-43.18,199.91,199.91,0,0,1,30.09,55.67Zm23.27-7.06a199.49,199.49,0,0,0-25.16-48.15c13.3-5,28.32-7.18,44.47-6.38A84.09,84.09,0,0,1,178.76,201.13Zm-56.32-64.25A128.18,128.18,0,0,0,75,181.63a84.24,84.24,0,0,1-14.72-24.14A191.38,191.38,0,0,0,93.14,128a192.61,192.61,0,0,0,29.3,8.88Z"/></svg>
      </a>
      <button class="social-btn" id="copy-email">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z"/></svg>
        Copy email
      </button>
    </div>
    <div class="toast" id="toast">nate.alspaugh18@gmail.com was copied to your clipboard</div>
  </div>
`;

class KeyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._card = null;
    this._photoFrame = null;
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  connectedCallback() {
    const photo = this.shadowRoot.querySelector('.photo');
    photo.src = cutoutUrl;

    this._card = this.shadowRoot.querySelector('.key-card');
    this._photoFrame = this.shadowRoot.querySelector('.photo-frame');
    this._card.addEventListener('mousemove', this._onMouseMove);
    this._card.addEventListener('mouseleave', this._onMouseLeave);

    // Copy email button
    const copyBtn = this.shadowRoot.querySelector('#copy-email');
    const toast = this.shadowRoot.querySelector('#toast');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('nate.alspaugh18@gmail.com');
      gsap.killTweensOf(toast);
      gsap.fromTo(toast,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out',
          onComplete: () => {
            gsap.to(toast, { opacity: 0, y: 8, duration: 0.25, ease: 'power2.in', delay: 2 });
          }
        }
      );
    });

    this._animate();
  }

  disconnectedCallback() {
    if (this._card) {
      this._card.removeEventListener('mousemove', this._onMouseMove);
      this._card.removeEventListener('mouseleave', this._onMouseLeave);
    }
  }

  _onMouseMove(e) {
    const rect = this._card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    this._card.style.setProperty('--mx', `${x}%`);
    this._card.style.setProperty('--my', `${y}%`);

    // 3D tilt (tweaker overrides if present)
    const tiltXStrength = this._tweakerTiltX ?? 0.15;
    const tiltYStrength = this._tweakerTiltY ?? 0.1;
    const rotateY = (x - 50) * tiltXStrength;
    const rotateX = (y - 50) * -tiltYStrength;
    gsap.to(this._card, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    // Parallax offset on photo (tweaker overrides if present)
    const parallaxStrength = this._tweakerParallax ?? 0.045;
    gsap.to(this._photoFrame, {
      x: (x - 50) * -parallaxStrength,
      y: (y - 50) * -parallaxStrength,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  _onMouseLeave() {
    this._card.style.setProperty('--mx', '50%');
    this._card.style.setProperty('--my', '30%');

    gsap.to(this._card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    gsap.to(this._photoFrame, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  _animate() {
    const tl = gsap.timeline();

    // Entrance
    tl.from(this._card, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.2,
    });

    // Idle float
    this._floatTween = tl.to(this._card, {
      y: -8,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }
}

customElements.define('key-card', KeyCard);
