// Dev-only tweaker panel for the keycard's foil shader.
// Mounted from main.js when import.meta.env.DEV is true.

const PARAMS = [
  { key: 'tiltStrength',   label: 'Tilt strength',   min: 0,   max: 3,   step: 0.05, decimals: 2 },
  { key: 'glintStrength',  label: 'Glint strength',  min: 0,   max: 3,   step: 0.05, decimals: 2 },
  { key: 'glintSharpness', label: 'Glint sharpness', min: 4,   max: 40,  step: 1,    decimals: 0 },
  { key: 'hotspot',        label: 'Hotspot',         min: 0,   max: 1.5, step: 0.05, decimals: 2 },
  { key: 'saturation',     label: 'Saturation',      min: 0,   max: 1,   step: 0.01, decimals: 2 },
  { key: 'hueShift',       label: 'Hue shift',       min: 0,   max: 4,   step: 0.05, decimals: 2 },
];

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 9999;
      font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
      color: #e8e8e8;
    }

    .panel {
      width: 280px;
      background: rgba(20, 20, 20, 0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      overflow: hidden;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 12px;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgba(255,255,255,0.04);
      cursor: pointer;
      user-select: none;
    }

    header .title { color: rgba(255,255,255,0.7); }
    header .chev {
      transition: transform 0.18s ease;
      opacity: 0.5;
    }
    :host(.collapsed) header .chev { transform: rotate(-90deg); }
    :host(.collapsed) .body { display: none; }

    .body {
      padding: 4px 12px 10px;
    }

    .row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
    }

    .row label {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10.5px;
      color: rgba(255,255,255,0.55);
      letter-spacing: 0.04em;
    }

    .row label .val {
      font-variant-numeric: tabular-nums;
      color: rgba(255,255,255,0.85);
    }

    .row .slider-wrap {
      grid-column: 1 / 2;
    }

    input[type=range] {
      width: 100%;
      margin: 0;
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      height: 16px;
      cursor: pointer;
    }
    input[type=range]::-webkit-slider-runnable-track {
      height: 2px;
      background: rgba(255,255,255,0.15);
      border-radius: 1px;
    }
    input[type=range]::-moz-range-track {
      height: 2px;
      background: rgba(255,255,255,0.15);
      border-radius: 1px;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #99cc00;
      margin-top: -5px;
      border: none;
    }
    input[type=range]::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #99cc00;
      border: none;
    }

    button {
      appearance: none;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7);
      font: inherit;
      font-size: 10.5px;
      padding: 3px 8px;
      border-radius: 4px;
      cursor: pointer;
      letter-spacing: 0.04em;
    }
    button:hover { background: rgba(255,255,255,0.1); color: #fff; }
    button:active { transform: translateY(0.5px); }
    button.reset {
      grid-column: 3 / 4;
      grid-row: 2;
      width: 26px;
      height: 22px;
      padding: 0;
      font-size: 13px;
      line-height: 1;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .actions button {
      flex: 1;
      padding: 6px;
      font-size: 10.5px;
      text-transform: uppercase;
    }
  </style>

  <div class="panel">
    <header>
      <span class="title">Foil tweaker</span>
      <span class="chev">▾</span>
    </header>
    <div class="body"></div>
  </div>
`;

class FoilTweaker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._target = null;
    this._inputs = {};
    this._values = {};
    this._onHeaderClick = this._onHeaderClick.bind(this);
  }

  connectedCallback() {
    this._target = this._resolveTarget();
    if (!this._target) {
      // Defer once: keycard might mount after us.
      requestAnimationFrame(() => {
        this._target = this._resolveTarget();
        if (this._target) this._build();
      });
      return;
    }
    this._build();
  }

  disconnectedCallback() {
    const header = this.shadowRoot.querySelector('header');
    if (header) header.removeEventListener('click', this._onHeaderClick);
  }

  _resolveTarget() {
    const sel = this.getAttribute('target') || 'key-card';
    return document.querySelector(sel);
  }

  _build() {
    const body = this.shadowRoot.querySelector('.body');
    body.innerHTML = '';

    PARAMS.forEach((p) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `
        <label>
          <span>${p.label}</span>
          <span class="val" data-val></span>
        </label>
        <div class="slider-wrap">
          <input type="range" min="${p.min}" max="${p.max}" step="${p.step}" />
        </div>
        <button class="reset" title="Reset to default">↺</button>
      `;
      body.appendChild(row);

      const input = row.querySelector('input');
      const valEl = row.querySelector('[data-val]');
      const resetBtn = row.querySelector('button.reset');

      const current = this._target.foilParams[p.key];
      input.value = String(current);
      valEl.textContent = current.toFixed(p.decimals);

      input.addEventListener('input', () => {
        const v = parseFloat(input.value);
        this._target.foilParams[p.key] = v;
        valEl.textContent = v.toFixed(p.decimals);
      });
      resetBtn.addEventListener('click', () => {
        const def = this._target.constructor.defaultFoilParams[p.key];
        this._target.foilParams[p.key] = def;
        input.value = String(def);
        valEl.textContent = def.toFixed(p.decimals);
      });

      this._inputs[p.key] = { input, valEl, decimals: p.decimals };
    });

    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.innerHTML = `<button data-act="reset-all">Reset all</button>`;
    body.appendChild(actions);

    actions.querySelector('[data-act="reset-all"]').addEventListener('click', () => {
      this._target.resetFoilParams();
      this._syncFromTarget();
    });

    this.shadowRoot.querySelector('header').addEventListener('click', this._onHeaderClick);
  }

  _syncFromTarget() {
    PARAMS.forEach((p) => {
      const ref = this._inputs[p.key];
      if (!ref) return;
      const v = this._target.foilParams[p.key];
      ref.input.value = String(v);
      ref.valEl.textContent = v.toFixed(ref.decimals);
    });
  }

  _onHeaderClick() {
    this.classList.toggle('collapsed');
  }
}

customElements.define('foil-tweaker', FoilTweaker);
