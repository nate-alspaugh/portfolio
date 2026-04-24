import gsap from 'gsap';
import cutoutUrl from '../assets/nate-cutout-2025.png';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    @property --mx {
      syntax: '<percentage>';
      inherits: true;
      initial-value: 50%;
    }
    @property --my {
      syntax: '<percentage>';
      inherits: true;
      initial-value: 30%;
    }

    :host {
      display: block;
    }

    @keyframes card-enter {
      from { opacity: 0; transform: translateY(60px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Entrance wrapper owns translate/opacity so it can't fight GSAP's tilt on .key-card */
    .entrance-stage {
      perspective: 800px;
      animation: card-enter 0.9s cubic-bezier(0.33, 1, 0.68, 1) 0.2s both;
    }

    .key-card {
      position: relative;
      width: clamp(220px, min(26vw, 45vh), 400px);
      container-type: inline-size;
      border-radius: 24px;
      background: #99cc00;
      overflow: visible;
      display: flex;
      flex-direction: column;
      padding: 28px 24px 28px;
      transform-style: preserve-3d;
      will-change: transform;
      cursor: default;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
    }

    @media (max-width: 767px) {
      .key-card {
        width: min(72vw, 300px);
      }
    }

    /* Laminate plastic sleeve — pouch extends above the card for lanyard slot */
    .laminate {
      position: absolute;
      top: -36px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      border-radius: 16px 16px 28px 28px;
      pointer-events: none;
      z-index: 8;
      background: linear-gradient(
        175deg,
        rgba(255,255,255,0.05) 0%,
        rgba(255,255,255,0.015) 100%
      );
      /* Edge seam — heat-sealed border of the laminate pouch */
      box-shadow:
        inset 0 0 0 1.5px rgba(255,255,255,0.13),
        inset 0 0 0 3px rgba(255,255,255,0.04),
        0 0 0 1px rgba(0,0,0,0.08);
      /* Subtle plastic refraction */
      backdrop-filter: blur(0.3px);
      -webkit-backdrop-filter: blur(0.3px);
      overflow: hidden;
      /* Lanyard slot punched through the plastic above the card */
      -webkit-mask-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='14'%3E%3Crect width='40' height='14' rx='7' fill='black'/%3E%3C/svg%3E"),
        linear-gradient(#fff,#fff);
      -webkit-mask-size: 40px 14px, 100% 100%;
      -webkit-mask-position: center 11px, center center;
      -webkit-mask-repeat: no-repeat, no-repeat;
      -webkit-mask-composite: destination-out;
      mask-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='14'%3E%3Crect width='40' height='14' rx='7' fill='black'/%3E%3C/svg%3E"),
        linear-gradient(#fff,#fff);
      mask-size: 40px 14px, 100% 100%;
      mask-position: center 11px, center center;
      mask-repeat: no-repeat, no-repeat;
      mask-composite: exclude;
    }

    /* Fresnel rim + micro-scratch texture */
    .laminate::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background:
        /* Fresnel rim — edges more reflective than center */
        radial-gradient(
          ellipse 60% 65% at 50% 50%,
          transparent 50%,
          rgba(255,255,255,0.08) 70%,
          rgba(255,255,255,0.16) 85%,
          rgba(255,255,255,0.22) 100%
        ),
        /* Micro-scratch texture — fine diagonal lines */
        repeating-linear-gradient(
          -35deg,
          transparent 0px,
          transparent 3px,
          rgba(255,255,255,0.02) 3px,
          rgba(255,255,255,0.02) 4px
        ),
        repeating-linear-gradient(
          55deg,
          transparent 0px,
          transparent 7px,
          rgba(255,255,255,0.015) 7px,
          rgba(255,255,255,0.015) 8px
        );
      pointer-events: none;
    }

    /* Mouse-tracking specular hotspot on laminate surface */
    .laminate::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: radial-gradient(
        circle 140px at var(--mx) var(--my),
        rgba(255,255,255,0.2) 0%,
        rgba(255,255,255,0.07) 25%,
        transparent 55%
      );
      mix-blend-mode: overlay;
      pointer-events: none;
      transition: --mx 0.1s ease-out, --my 0.1s ease-out;
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
      font-size: clamp(13px, 7.5cqi, 1.3rem);
      color: #151614;
      margin: 0 0 5px;
      line-height: 1.2;
      white-space: nowrap;
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

    .location {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-family: 'Geist Mono', monospace;
      font-size: 0.65rem;
      font-weight: 500;
      text-transform: uppercase;
      color: rgba(21, 22, 20, 0.45);
      margin: 6px 0 0;
    }

    .location svg {
      width: 12px;
      height: 12px;
      fill: rgba(21, 22, 20, 0.45);
      flex-shrink: 0;
    }

  </style>

  <div class="entrance-stage">
    <div class="key-card">
      <div class="photo-frame">
        <img class="photo" alt="Nathan Alspaugh" />
      </div>
      <div class="info">
        <h1 class="name">Nathan Alspaugh</h1>
        <p class="title">Sr. Product Designer</p>
        <p class="location">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"/></svg>
          Bountiful, UT
        </p>
      </div>
      <div class="laminate"></div>
    </div>
  </div>
`;

class KeyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._card = null;
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  connectedCallback() {
    const photo = this.shadowRoot.querySelector('.photo');
    photo.src = cutoutUrl;

    this._card = this.shadowRoot.querySelector('.key-card');
    this._card.addEventListener('mousemove', this._onMouseMove);
    this._card.addEventListener('mouseleave', this._onMouseLeave);

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

    // 3D tilt (1/8th original intensity)
    const rotateY = (x - 50) * 0.01875;
    const rotateX = (y - 50) * -0.0125;
    gsap.to(this._card, {
      rotateX,
      rotateY,
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
  }

  _animate() {
    // Idle float starts after CSS entrance animation completes (0.2s delay + 0.9s duration)
    setTimeout(() => {
      this._floatTween = gsap.to(this._card, {
        y: -8,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, 1100);
  }
}

customElements.define('key-card', KeyCard);
