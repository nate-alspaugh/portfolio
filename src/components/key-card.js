import gsap from 'gsap';
import { WebHaptics } from 'web-haptics';
import cutoutUrl from '../assets/nate-cutout-2025.png';

// Tap-and-hold tilt activation for ≤768px touch/stylus input.
const HOLD_DELAY_MS = 200;
const IDLE_TOUCH_SCALE = 0.95; // Resting scale on touch viewports.
const ACTIVE_SCALE = 1;        // Pops up to full size on activation.

// Shared with the WebGL foil shader (loaded as a texture).
// 140×140 tile, 5 cols × 8 rows of glyphs; cell pitch ≈ 28 × 17.5 CSS px.
const ASCII_PATTERN_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cstyle%3Etext%7Bfont-family:monospace;font-size:16px;fill:rgba(0,0,0,0.13)%7D%3C/style%3E%3Ctext x='5' y='12'%3E*%3C/text%3E%3Ctext x='30' y='12'%3E~%3C/text%3E%3Ctext x='58' y='12'%3E%23%3C/text%3E%3Ctext x='85' y='12'%3E+%3C/text%3E%3Ctext x='112' y='12'%3E%25%3C/text%3E%3Ctext x='18' y='28'%3E%40%3C/text%3E%3Ctext x='45' y='28'%3E/%3C/text%3E%3Ctext x='72' y='28'%3E=%3C/text%3E%3Ctext x='100' y='28'%3E%5E%3C/text%3E%3Ctext x='128' y='28'%3E~%3C/text%3E%3Ctext x='8' y='44'%3E%25%3C/text%3E%3Ctext x='35' y='44'%3E*%3C/text%3E%3Ctext x='62' y='44'%3E+%3C/text%3E%3Ctext x='90' y='44'%3E%23%3C/text%3E%3Ctext x='118' y='44'%3E%40%3C/text%3E%3Ctext x='22' y='60'%3E/%3C/text%3E%3Ctext x='48' y='60'%3E%5E%3C/text%3E%3Ctext x='75' y='60'%3E~%3C/text%3E%3Ctext x='105' y='60'%3E=%3C/text%3E%3Ctext x='132' y='60'%3E*%3C/text%3E%3Ctext x='12' y='76'%3E%23%3C/text%3E%3Ctext x='40' y='76'%3E%40%3C/text%3E%3Ctext x='68' y='76'%3E%25%3C/text%3E%3Ctext x='95' y='76'%3E+%3C/text%3E%3Ctext x='122' y='76'%3E/%3C/text%3E%3Ctext x='2' y='92'%3E~%3C/text%3E%3Ctext x='28' y='92'%3E=%3C/text%3E%3Ctext x='55' y='92'%3E%5E%3C/text%3E%3Ctext x='82' y='92'%3E*%3C/text%3E%3Ctext x='110' y='92'%3E%23%3C/text%3E%3Ctext x='15' y='108'%3E+%3C/text%3E%3Ctext x='42' y='108'%3E%25%3C/text%3E%3Ctext x='70' y='108'%3E/%3C/text%3E%3Ctext x='98' y='108'%3E~%3C/text%3E%3Ctext x='125' y='108'%3E%40%3C/text%3E%3Ctext x='8' y='124'%3E%5E%3C/text%3E%3Ctext x='35' y='124'%3E%23%3C/text%3E%3Ctext x='62' y='124'%3E=%3C/text%3E%3Ctext x='88' y='124'%3E+%3C/text%3E%3Ctext x='115' y='124'%3E*%3C/text%3E%3C/svg%3E";

// Use solid black for the texture upload so alpha is a clean glyph mask
// (the CSS layer keeps the original 0.13 opacity for the embossed look).
const ASCII_PATTERN_SVG_OPAQUE = ASCII_PATTERN_SVG.replace(/fill:rgba\(0,0,0,0\.13\)/, 'fill:rgba(0,0,0,1)');


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
      /* Suppress browser long-press behaviors that fight our gesture:
         iOS callout menu, text selection rectangle, tap highlight flash. */
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    @media (max-width: 767px) {
      .key-card {
        width: min(72vw, 300px);
      }
    }

    /* On touch viewports, allow vertical scroll during the 150ms grace
       window. After tap-and-hold activation, JS calls preventDefault on
       pointermove to claim the gesture. */
    @media (max-width: 768px) {
      .key-card {
        touch-action: pan-y;
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

/* ASCII texture overlay */
    .key-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      background: url("${ASCII_PATTERN_SVG}") repeat;
      z-index: 1;
      pointer-events: none;
    }

    /* WebGL foil overlay — single fullscreen-quad fragment shader */
    .foil-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border-radius: 24px;
      pointer-events: none;
      z-index: 5;
      mix-blend-mode: overlay;
      display: block;
    }

    :host(.no-webgl) .foil-canvas {
      display: none;
    }

    /* CSS holographic fallback (only when WebGL2 is unavailable) */
    :host(.no-webgl) .key-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      pointer-events: none;
      z-index: 5;
      mix-blend-mode: overlay;
      transition: --mx 0.1s ease-out, --my 0.1s ease-out;
      background:
        radial-gradient(circle 265px at var(--mx) var(--my), rgba(255,255,255,0.65) 0%, transparent 60%),
        linear-gradient(135deg, transparent 15%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.05) 55%, transparent 75%),
        linear-gradient(160deg,
          rgba(200, 255, 0, 0.35) 0%,
          rgba(0, 255, 180, 0.2) 25%,
          rgba(180, 255, 50, 0.1) 45%,
          rgba(0, 230, 200, 0.25) 65%,
          rgba(220, 255, 0, 0.2) 85%,
          rgba(0, 255, 150, 0.15) 100%
        ),
        radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.25) 0%, transparent 55%),
        linear-gradient(
          200deg,
          transparent 20%,
          rgba(255, 255, 150, 0.12) 35%,
          rgba(150, 255, 200, 0.1) 45%,
          rgba(200, 255, 100, 0.08) 55%,
          transparent 70%
        ),
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
      gap: 4px;
      font-family: 'Geist Mono', monospace;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      color: rgba(21, 22, 20, 0.45);
      margin: 6px 0 0;
    }

    .location svg {
      width: 14px;
      height: 14px;
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
      <canvas class="foil-canvas"></canvas>
      <div class="laminate"></div>
    </div>
  </div>
`;

const FOIL_VS = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FOIL_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2      uMouse;          // [0,1] cursor position
uniform vec2      uTilt;           // [-1,1] effective view-direction shift
uniform vec2      uSizePx;         // canvas size in CSS pixels
uniform float     uRadius;         // corner radius in CSS pixels
uniform sampler2D uAscii;          // 140x140-tile glyph mask, REPEAT
uniform float     uHueShift;       // hue movement scale with tilt
uniform float     uSaturation;     // iridescence saturation
uniform float     uHotspot;        // bulk specular intensity
uniform float     uGlintStrength;  // peak brightness of glyph glints
uniform float     uGlintSharpness; // higher = sparser/sharper glints
uniform float     uGlintIntensity; // 0..1 hover envelope for glints

const vec2 ASCII_TILE_PX   = vec2(140.0);
const vec2 ASCII_CELL_GRID = vec2(5.0, 8.0); // glyphs per tile

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)),
           dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float sdRoundedRect(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 uv = vUv;
  vec2 centered = uv - 0.5;

  // Iridescence — hue tracks tilt + radial position
  float baseHue = 0.27;
  float hueShift = dot(centered, uTilt) * uHueShift + length(centered) * 0.55;
  vec3 iridescent = hsv2rgb(vec3(fract(baseHue + hueShift), uSaturation, 1.0));

  // Specular hotspot — soft gaussian, swept slightly along tilt
  vec2 mDelta = uv - uMouse - uTilt * 0.04;
  float hotspot = exp(-dot(mDelta, mDelta) * 16.0);

  // ASCII-glyph flakes: each character is a flake. The ink mask shapes the
  // glint, and a per-cell hash gives every character its own facet normal so
  // it lights up at a different tilt angle than its neighbors.
  vec2 tileUv = uv * uSizePx / ASCII_TILE_PX;
  float ink = texture(uAscii, tileUv).a;
  ink = smoothstep(0.05, 0.55, ink);

  vec2 cellId = floor(tileUv * ASCII_CELL_GRID);
  vec2 facet = hash2(cellId) * 2.0 - 1.0;
  vec2 lightDir = normalize(uMouse - 0.5 + uTilt * 0.6 + vec2(1e-6));
  float facing = clamp(dot(normalize(facet), lightDir), 0.0, 1.0);
  float glint = pow(facing, uGlintSharpness) * ink * mix(0.55, 1.0, hash2(cellId + 17.0).x);
  glint *= uGlintIntensity;

  // Compose
  vec3 foil = iridescent * (0.32 + hotspot * uHotspot) + vec3(glint) * uGlintStrength;
  float edge = smoothstep(0.95, 0.45, length(centered) * 1.4);
  foil *= mix(0.72, 1.0, edge);

  // Rounded-rect alpha mask in pixel space (anti-aliased corners)
  vec2 px = (uv - 0.5) * uSizePx;
  float d = sdRoundedRect(px, uSizePx * 0.5, uRadius);
  float alpha = clamp(0.5 - d, 0.0, 1.0);

  outColor = vec4(foil, alpha * 0.85);
}`;

class KeyCard extends HTMLElement {
  static defaultFoilParams = {
    tiltStrength: 4.0,
    hueShift: 1.4,
    saturation: 0.55,
    hotspot: 0.65,
    glintStrength: 1.0,
    glintSharpness: 18.0,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._card = null;
    this._canvas = null;
    this._gl = null;
    this._program = null;
    this._uniformLocs = null;
    this._rafId = 0;
    this._visible = true;
    this._reducedMotion = false;
    this._sizePx = [0, 0];

    this._uniforms = {
      mouse: [0.5, 0.3],
      mouseTarget: [0.5, 0.3],
      tilt: [0, 0],
      tiltTarget: [0, 0],
      glintIntensity: 0,
      glintIntensityTarget: 0,
    };

    // Public, mutable knobs — read every frame, also exposed to <foil-tweaker>.
    this.foilParams = { ...KeyCard.defaultFoilParams };

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onPointerCancel = this._onPointerCancel.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._tick = this._tick.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onIntersect = this._onIntersect.bind(this);

    this._holdPointerId = null;
    this._holdActive = false;
    this._holdTimerId = 0;
    this._holdLastX = 0;
    this._holdLastY = 0;
    this._smallViewportMQ = null;
    this._haptics = new WebHaptics();
  }

  connectedCallback() {
    const photo = this.shadowRoot.querySelector('.photo');
    photo.src = cutoutUrl;

    this._card = this.shadowRoot.querySelector('.key-card');
    this._canvas = this.shadowRoot.querySelector('.foil-canvas');

    this._card.addEventListener('mousemove', this._onMouseMove);
    this._card.addEventListener('mouseleave', this._onMouseLeave);

    this._smallViewportMQ =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(max-width: 768px)')
        : null;
    this._card.addEventListener('pointerdown', this._onPointerDown);
    this._card.addEventListener('pointermove', this._onPointerMove);
    this._card.addEventListener('pointerup', this._onPointerUp);
    this._card.addEventListener('pointercancel', this._onPointerCancel);
    this._card.addEventListener('contextmenu', this._onContextMenu);

    // On touch viewports, the card sits at 0.95 in idle and pops to 1.0 only
    // while a tap-and-hold tilt is active.
    if (this._smallViewportMQ?.matches) {
      gsap.set(this._card, { scale: IDLE_TOUCH_SCALE });
    }

    this._reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ok = this._initWebGL();
    if (ok) {
      this._resizeObserver = new ResizeObserver(this._onResize);
      this._resizeObserver.observe(this._card);

      this._intersectionObserver = new IntersectionObserver(this._onIntersect, {
        threshold: 0,
      });
      this._intersectionObserver.observe(this._card);

      this._render();
      if (!this._reducedMotion) this._rafId = requestAnimationFrame(this._tick);
    } else {
      this.classList.add('no-webgl');
    }

    this._animate();
  }

  disconnectedCallback() {
    if (this._card) {
      this._card.removeEventListener('mousemove', this._onMouseMove);
      this._card.removeEventListener('mouseleave', this._onMouseLeave);
      this._card.removeEventListener('pointerdown', this._onPointerDown);
      this._card.removeEventListener('pointermove', this._onPointerMove);
      this._card.removeEventListener('pointerup', this._onPointerUp);
      this._card.removeEventListener('pointercancel', this._onPointerCancel);
      this._card.removeEventListener('contextmenu', this._onContextMenu);
    }
    if (this._holdTimerId) {
      clearTimeout(this._holdTimerId);
      this._holdTimerId = 0;
    }
    if (this._haptics) {
      this._haptics.destroy();
      this._haptics = null;
    }
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._intersectionObserver) this._intersectionObserver.disconnect();
    if (this._gl && this._program) {
      this._gl.deleteProgram(this._program);
      const ext = this._gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
    if (this._floatTween) this._floatTween.kill();
  }

  _initWebGL() {
    const gl = this._canvas.getContext('webgl2', {
      antialias: true,
      premultipliedAlpha: true,
      alpha: true,
    });
    if (!gl) return false;
    this._gl = gl;

    const program = this._compileProgram(FOIL_VS, FOIL_FS);
    if (!program) return false;
    this._program = program;

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    this._uniformLocs = {
      uMouse: gl.getUniformLocation(program, 'uMouse'),
      uTilt: gl.getUniformLocation(program, 'uTilt'),
      uSizePx: gl.getUniformLocation(program, 'uSizePx'),
      uRadius: gl.getUniformLocation(program, 'uRadius'),
      uAscii: gl.getUniformLocation(program, 'uAscii'),
      uHueShift: gl.getUniformLocation(program, 'uHueShift'),
      uSaturation: gl.getUniformLocation(program, 'uSaturation'),
      uHotspot: gl.getUniformLocation(program, 'uHotspot'),
      uGlintStrength: gl.getUniformLocation(program, 'uGlintStrength'),
      uGlintSharpness: gl.getUniformLocation(program, 'uGlintSharpness'),
      uGlintIntensity: gl.getUniformLocation(program, 'uGlintIntensity'),
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this._loadAsciiTexture();

    return true;
  }

  _loadAsciiTexture() {
    const gl = this._gl;
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // 1×1 transparent placeholder until the SVG decodes
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    this._asciiTexture = tex;
    gl.uniform1i(this._uniformLocs.uAscii, 0);

    const img = new Image();
    img.onload = () => {
      if (!this._gl) return; // disconnected
      const size = 256; // POT, plenty sharp for 140-px tile glyphs
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      this._gl.activeTexture(this._gl.TEXTURE0);
      this._gl.bindTexture(this._gl.TEXTURE_2D, tex);
      this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, true);
      this._gl.texImage2D(
        this._gl.TEXTURE_2D, 0, this._gl.RGBA,
        this._gl.RGBA, this._gl.UNSIGNED_BYTE, c
      );
      this._asciiReady = true;
      if (this._reducedMotion) this._render();
    };
    img.onerror = () => {
      console.warn('[key-card] ASCII pattern failed to load; foil will render without glyph glints');
    };
    img.src = ASCII_PATTERN_SVG_OPAQUE;
  }

  _compileProgram(vsSrc, fsSrc) {
    const gl = this._gl;
    const vs = this._compileShader(gl.VERTEX_SHADER, vsSrc);
    const fs = this._compileShader(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[key-card] foil shader link failed:', gl.getProgramInfoLog(program));
      return null;
    }
    gl.useProgram(program);
    return program;
  }

  _compileShader(type, src) {
    const gl = this._gl;
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('[key-card] foil shader compile failed:', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  _onResize() {
    const gl = this._gl;
    if (!gl) return;
    const rect = this._card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (this._canvas.width !== w || this._canvas.height !== h) {
      this._canvas.width = w;
      this._canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    this._sizePx = [rect.width, rect.height];
    if (this._reducedMotion) this._render();
  }

  _onIntersect(entries) {
    const entry = entries[0];
    if (!entry) return;
    this._visible = entry.isIntersecting;
    if (this._visible && !this._reducedMotion && !this._rafId) {
      this._rafId = requestAnimationFrame(this._tick);
    } else if (!this._visible && this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
  }

  _onMouseMove(e) {
    this._applyTiltFromClient(e.clientX, e.clientY);
  }

  _onMouseLeave() {
    this._resetTilt();
  }

  _applyTiltFromClient(clientX, clientY) {
    const rect = this._card.getBoundingClientRect();
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;

    // Laminate's specular hotspot still reads these CSS custom props.
    this._card.style.setProperty('--mx', `${xPct}%`);
    this._card.style.setProperty('--my', `${yPct}%`);

    const ux = xPct / 100;
    const uy = yPct / 100;
    this._uniforms.mouseTarget[0] = ux;
    this._uniforms.mouseTarget[1] = uy;
    this._uniforms.tiltTarget[0] = (ux - 0.5) * 2;
    this._uniforms.tiltTarget[1] = (uy - 0.5) * 2;
    this._uniforms.glintIntensityTarget = 1;

    if (this._reducedMotion) {
      this._uniforms.mouse[0] = ux;
      this._uniforms.mouse[1] = uy;
      this._uniforms.tilt[0] = this._uniforms.tiltTarget[0];
      this._uniforms.tilt[1] = this._uniforms.tiltTarget[1];
      this._uniforms.glintIntensity = 1;
      this._render();
    }

    // 3D tilt — base scale × user-tunable strength
    const ts = this.foilParams.tiltStrength;
    const rotateY = (xPct - 50) * 0.01875 * ts;
    const rotateX = (yPct - 50) * -0.0125 * ts;
    gsap.to(this._card, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  _resetTilt() {
    this._card.style.setProperty('--mx', '50%');
    this._card.style.setProperty('--my', '30%');

    this._uniforms.mouseTarget[0] = 0.5;
    this._uniforms.mouseTarget[1] = 0.3;
    this._uniforms.tiltTarget[0] = 0;
    this._uniforms.tiltTarget[1] = 0;
    this._uniforms.glintIntensityTarget = 0;

    if (this._reducedMotion) {
      this._uniforms.mouse[0] = 0.5;
      this._uniforms.mouse[1] = 0.3;
      this._uniforms.tilt[0] = 0;
      this._uniforms.tilt[1] = 0;
      this._uniforms.glintIntensity = 0;
      this._render();
    }

    gsap.to(this._card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  _isTouchEligible(e) {
    return (
      e.pointerType !== 'mouse' &&
      this._smallViewportMQ &&
      this._smallViewportMQ.matches
    );
  }

  _onPointerDown(e) {
    if (!this._isTouchEligible(e)) return;
    if (this._holdPointerId !== null) return;

    this._holdPointerId = e.pointerId;
    this._holdActive = false;
    this._holdLastX = e.clientX;
    this._holdLastY = e.clientY;

    // Card stays at IDLE_TOUCH_SCALE during the grace window — no visual
    // change on press; the only visible transition is the pop on activation.
    // The +150ms scheduled haptic confirms the press registered.

    // Schedule the activation haptic via the library's RAF-based delay so it
    // fires inside the user gesture chain (required by iOS Safari's
    // checkbox-switch path).
    this._haptics.trigger([{ delay: HOLD_DELAY_MS, duration: 25, intensity: 0.7 }]);

    if (this._holdTimerId) clearTimeout(this._holdTimerId);
    this._holdTimerId = setTimeout(() => {
      this._holdTimerId = 0;
      if (this._holdPointerId === null) return;
      this._activateHold();
    }, HOLD_DELAY_MS);
  }

  _onPointerMove(e) {
    if (e.pointerId !== this._holdPointerId) return;

    this._holdLastX = e.clientX;
    this._holdLastY = e.clientY;

    if (!this._holdActive) return;

    if (e.cancelable) e.preventDefault();
    this._applyTiltFromClient(e.clientX, e.clientY);
  }

  _onPointerUp(e) {
    if (e.pointerId !== this._holdPointerId) return;
    const wasActive = this._holdActive;

    if (wasActive) {
      // pointerup is a user gesture, so a fresh trigger() works on iOS.
      this._haptics.trigger('light');
    } else {
      // Tapped and released before activation — abort the pending pop tick.
      this._haptics.cancel();
    }

    this._cancelHold();
    if (wasActive) this._resetTilt();
  }

  _onPointerCancel(e) {
    if (e.pointerId !== this._holdPointerId) return;
    const wasActive = this._holdActive;
    // Browser took over (scroll committed, system gesture, etc.) — abort
    // any pending haptic and settle silently.
    this._haptics.cancel();
    this._cancelHold();
    if (wasActive) this._resetTilt();
  }

  _onContextMenu(e) {
    // Suppress browser long-press menu (DevTools touch emulation, Android
    // Chrome) so the gesture stays ours.
    e.preventDefault();
  }

  _activateHold() {
    this._holdActive = true;

    // Pop scale to 1.0 with a slight overshoot — "clicked into mode."
    gsap.to(this._card, {
      scale: ACTIVE_SCALE,
      duration: 0.22,
      ease: 'back.out(1.7)',
      overwrite: 'auto',
    });

    try {
      this._card.setPointerCapture(this._holdPointerId);
    } catch (_) {}

    this._applyTiltFromClient(this._holdLastX, this._holdLastY);
  }

  _cancelHold() {
    if (this._holdTimerId) {
      clearTimeout(this._holdTimerId);
      this._holdTimerId = 0;
    }
    if (this._holdPointerId !== null) {
      try {
        this._card.releasePointerCapture(this._holdPointerId);
      } catch (_) {}
    }

    // Settle scale back to the idle resting size on touch viewports.
    gsap.to(this._card, {
      scale: IDLE_TOUCH_SCALE,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    this._holdPointerId = null;
    this._holdActive = false;
  }

  _tick() {
    const u = this._uniforms;
    const k = 0.12;
    u.mouse[0] += (u.mouseTarget[0] - u.mouse[0]) * k;
    u.mouse[1] += (u.mouseTarget[1] - u.mouse[1]) * k;
    u.tilt[0]  += (u.tiltTarget[0]  - u.tilt[0])  * k;
    u.tilt[1]  += (u.tiltTarget[1]  - u.tilt[1])  * k;
    // Glints fade in/out a bit slower than position so departures feel calm
    u.glintIntensity += (u.glintIntensityTarget - u.glintIntensity) * 0.07;
    this._render();
    this._rafId = this._visible ? requestAnimationFrame(this._tick) : 0;
  }

  _render() {
    const gl = this._gl;
    if (!gl || !this._program) return;
    const u = this._uniformLocs;
    const p = this.foilParams;
    const radius = 24;
    gl.uniform2f(u.uMouse, this._uniforms.mouse[0], this._uniforms.mouse[1]);
    gl.uniform2f(u.uTilt, this._uniforms.tilt[0], this._uniforms.tilt[1]);
    gl.uniform2f(u.uSizePx, this._sizePx[0] || 1, this._sizePx[1] || 1);
    gl.uniform1f(u.uRadius, radius);
    gl.uniform1f(u.uHueShift, p.hueShift);
    gl.uniform1f(u.uSaturation, p.saturation);
    gl.uniform1f(u.uHotspot, p.hotspot);
    gl.uniform1f(u.uGlintStrength, p.glintStrength);
    gl.uniform1f(u.uGlintSharpness, p.glintSharpness);
    gl.uniform1f(u.uGlintIntensity, this._uniforms.glintIntensity);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  resetFoilParams() {
    this.foilParams = { ...KeyCard.defaultFoilParams };
    if (this._reducedMotion) this._render();
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
