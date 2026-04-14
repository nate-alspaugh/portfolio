/**
 * Tweaker Panel — live editor for key-card properties.
 * Reads/writes directly into the key-card's open Shadow DOM.
 */

const DEFAULTS = {
  // Card
  cardWidth:          { value: 340,    unit: 'px',  min: 200,  max: 600,  step: 1,    label: 'Width' },
  cardRadius:         { value: 24,     unit: 'px',  min: 0,    max: 60,   step: 1,    label: 'Border Radius' },
  cardBg:             { value: '#99cc00', type: 'color',                              label: 'Background' },
  cardPaddingTop:     { value: 56,     unit: 'px',  min: 0,    max: 100,  step: 1,    label: 'Padding Top' },
  cardPaddingSide:    { value: 24,     unit: 'px',  min: 0,    max: 60,   step: 1,    label: 'Padding Side' },
  cardPaddingBottom:  { value: 28,     unit: 'px',  min: 0,    max: 80,   step: 1,    label: 'Padding Bottom' },
  cardShadowOpacity:  { value: 0.08,   unit: '',    min: 0,    max: 0.5,  step: 0.01, label: 'Inner Shadow Opacity' },

  // Notch
  notchWidth:         { value: 48,     unit: 'px',  min: 0,    max: 120,  step: 1,    label: 'Width' },
  notchHeight:        { value: 10,     unit: 'px',  min: 0,    max: 30,   step: 1,    label: 'Height' },
  notchTop:           { value: 20,     unit: 'px',  min: 0,    max: 60,   step: 1,    label: 'Top Offset' },
  notchRadius:        { value: 8,      unit: 'px',  min: 0,    max: 20,   step: 1,    label: 'Border Radius' },
  notchBg:            { value: '#151614', type: 'color',                              label: 'Color' },

  // Photo Frame
  frameRadius:        { value: 16,     unit: 'px',  min: 0,    max: 40,   step: 1,    label: 'Border Radius' },
  framePaddingTop:    { value: 15,     unit: '%',   min: 0,    max: 40,   step: 1,    label: 'Top Padding' },
  frameGradientTop:   { value: '#D4D4D4', type: 'color',                             label: 'Gradient Top' },
  frameGradientBottom:{ value: '#B8B8B8', type: 'color',                             label: 'Gradient Bottom' },

  // Typography — Name
  nameFontSize:       { value: 1.3,    unit: 'rem', min: 0.5,  max: 3,    step: 0.05, label: 'Font Size' },
  nameFontWeight:     { value: 600,    unit: '',    min: 200,  max: 800,  step: 50,   label: 'Font Weight' },
  nameColor:          { value: '#151614', type: 'color',                              label: 'Color' },
  nameText:           { value: 'Nathan Alspaugh', type: 'text',                       label: 'Text' },

  // Typography — Title
  titleFontSize:      { value: 0.85,   unit: 'rem', min: 0.4,  max: 2,    step: 0.05, label: 'Font Size' },
  titleFontWeight:    { value: 500,    unit: '',    min: 100,  max: 900,  step: 100,  label: 'Font Weight' },
  titleLetterSpacing: { value: 0.1,    unit: 'em',  min: 0,    max: 0.5,  step: 0.01, label: 'Letter Spacing' },
  titleOpacity:       { value: 0.6,    unit: '',    min: 0,    max: 1,    step: 0.05, label: 'Opacity' },
  titleTransform:     { value: 'uppercase', type: 'select', options: ['none','uppercase','lowercase','capitalize'], label: 'Text Transform' },
  titleText:          { value: 'Sr. Product Designer', type: 'text',                  label: 'Text' },

  // Holographic
  specularSize:       { value: 265,    unit: 'px',  min: 40,   max: 400,  step: 5,    label: 'Specular Size' },
  specularOpacity:    { value: 0.65,   unit: '',    min: 0,    max: 1,    step: 0.05, label: 'Specular Opacity' },
  blendMode:          { value: 'overlay', type: 'select', options: ['overlay','screen','multiply','soft-light','hard-light','color-dodge','color-burn','normal'], label: 'Blend Mode' },
  edgeDarkening:      { value: 0.22,   unit: '',    min: 0,    max: 0.5,  step: 0.01, label: 'Edge Darkening' },

  // 3D & Animation
  perspective:        { value: 800,    unit: 'px',  min: 200,  max: 2000, step: 50,   label: 'Perspective' },
  tiltX:              { value: 0.15,   unit: '',    min: 0,    max: 0.5,  step: 0.01, label: 'Tilt X Strength' },
  tiltY:              { value: 0.1,    unit: '',    min: 0,    max: 0.5,  step: 0.01, label: 'Tilt Y Strength' },
  parallax:           { value: 0.045,  unit: '',    min: 0,    max: 0.2,  step: 0.005,label: 'Parallax Strength' },
  floatDistance:      { value: 8,      unit: 'px',  min: 0,    max: 30,   step: 1,    label: 'Float Distance' },
  floatDuration:      { value: 2.5,    unit: 's',   min: 0.5,  max: 8,    step: 0.25, label: 'Float Duration' },

  // ASCII Texture
  asciiOpacity:       { value: 0.13,   unit: '',    min: 0,    max: 0.4,  step: 0.01, label: 'Texture Opacity' },
};

const SECTIONS = [
  { key: 'card',   label: 'Card',             props: ['cardWidth','cardRadius','cardBg','cardPaddingTop','cardPaddingSide','cardPaddingBottom','cardShadowOpacity'] },
  { key: 'notch',  label: 'Notch',            props: ['notchWidth','notchHeight','notchTop','notchRadius','notchBg'] },
  { key: 'frame',  label: 'Photo Frame',      props: ['frameRadius','framePaddingTop','frameGradientTop','frameGradientBottom'] },
  { key: 'name',   label: 'Name Typography',  props: ['nameText','nameFontSize','nameFontWeight','nameColor'] },
  { key: 'title',  label: 'Title Typography', props: ['titleText','titleFontSize','titleFontWeight','titleLetterSpacing','titleOpacity','titleTransform'] },
  { key: 'holo',   label: 'Holographic',      props: ['specularSize','specularOpacity','blendMode','edgeDarkening'] },
  { key: 'anim',   label: '3D & Animation',   props: ['perspective','tiltX','tiltY','parallax','floatDistance','floatDuration'] },
  { key: 'ascii',  label: 'ASCII Texture',    props: ['asciiOpacity'] },
];

class TweakerPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._values = {};
    // Deep-clone defaults
    for (const [k, def] of Object.entries(DEFAULTS)) {
      this._values[k] = def.value;
    }
    this._collapsed = {};
    this._panelOpen = true;
  }

  connectedCallback() {
    this._render();
    this._bindEvents();
  }

  /* ── Rendering ────────────────────────────── */

  _render() {
    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <button class="toggle-btn" title="Toggle tweaker panel">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
      <div class="panel ${this._panelOpen ? 'open' : ''}">
        <div class="panel-header">
          <span class="panel-title">Tweaker</span>
          <div class="panel-actions">
            <button class="action-btn copy-btn" title="Copy prompt with changes">Copy Prompt</button>
            <button class="action-btn reset-all-btn" title="Reset all to defaults">Reset All</button>
          </div>
        </div>
        <div class="panel-body">
          ${SECTIONS.map(s => this._renderSection(s)).join('')}
        </div>
      </div>
    `;
  }

  _renderSection(section) {
    const open = !this._collapsed[section.key];
    return `
      <div class="section" data-section="${section.key}">
        <button class="section-header" data-toggle="${section.key}">
          <span class="chevron ${open ? 'open' : ''}">&rsaquo;</span>
          <span>${section.label}</span>
        </button>
        <div class="section-body" style="display:${open ? 'block' : 'none'}">
          ${section.props.map(p => this._renderControl(p)).join('')}
        </div>
      </div>
    `;
  }

  _renderControl(propKey) {
    const def = DEFAULTS[propKey];
    const val = this._values[propKey];
    const changed = val !== def.value;
    const changedClass = changed ? ' changed' : '';

    if (def.type === 'color') {
      return `
        <div class="control${changedClass}" data-prop="${propKey}">
          <div class="control-header">
            <label>${def.label}</label>
            <button class="reset-one" data-reset="${propKey}" title="Reset" ${!changed ? 'disabled' : ''}>&times;</button>
          </div>
          <div class="control-row">
            <input type="color" value="${val}" data-input="${propKey}" />
            <span class="value-display">${val}</span>
          </div>
        </div>`;
    }

    if (def.type === 'select') {
      return `
        <div class="control${changedClass}" data-prop="${propKey}">
          <div class="control-header">
            <label>${def.label}</label>
            <button class="reset-one" data-reset="${propKey}" title="Reset" ${!changed ? 'disabled' : ''}>&times;</button>
          </div>
          <select data-input="${propKey}">
            ${def.options.map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${o}</option>`).join('')}
          </select>
        </div>`;
    }

    if (def.type === 'text') {
      return `
        <div class="control${changedClass}" data-prop="${propKey}">
          <div class="control-header">
            <label>${def.label}</label>
            <button class="reset-one" data-reset="${propKey}" title="Reset" ${!changed ? 'disabled' : ''}>&times;</button>
          </div>
          <input type="text" value="${val}" data-input="${propKey}" class="text-input" />
        </div>`;
    }

    // slider (default)
    return `
      <div class="control${changedClass}" data-prop="${propKey}">
        <div class="control-header">
          <label>${def.label}</label>
          <button class="reset-one" data-reset="${propKey}" title="Reset" ${!changed ? 'disabled' : ''}>&times;</button>
        </div>
        <div class="control-row">
          <input type="range" min="${def.min}" max="${def.max}" step="${def.step}" value="${val}" data-input="${propKey}" />
          <span class="value-display">${val}${def.unit}</span>
        </div>
      </div>`;
  }

  /* ── Styles ───────────────────────────────── */

  _styles() {
    return `
      :host {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 9999;
        font-family: 'Geist Mono', ui-monospace, SFMono-Regular, monospace;
        font-size: 12px;
        color: #e0e0e0;
      }

      .toggle-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(21,22,20,0.92);
        color: #a8e000;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(12px);
        z-index: 2;
        transition: background 0.15s;
      }
      .toggle-btn:hover { background: rgba(40,42,38,0.95); }

      .panel {
        position: absolute;
        top: 0;
        right: 0;
        width: 320px;
        max-height: calc(100vh - 32px);
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(21,22,20,0.94);
        backdrop-filter: blur(20px);
        display: none;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      }
      .panel.open { display: flex; }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px 10px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .panel-title {
        font-weight: 600;
        font-size: 13px;
        color: #a8e000;
        letter-spacing: 0.04em;
      }
      .panel-actions { display: flex; gap: 6px; }

      .action-btn {
        padding: 4px 10px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.04);
        color: #ccc;
        cursor: pointer;
        font-family: inherit;
        font-size: 11px;
        transition: all 0.15s;
      }
      .action-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
      .copy-btn { color: #a8e000; border-color: rgba(168,224,0,0.2); }
      .copy-btn:hover { background: rgba(168,224,0,0.12); }
      .copy-btn.copied { color: #fff; background: rgba(168,224,0,0.25); }

      .panel-body {
        overflow-y: auto;
        padding: 6px 0;
        flex: 1;
      }
      .panel-body::-webkit-scrollbar { width: 5px; }
      .panel-body::-webkit-scrollbar-track { background: transparent; }
      .panel-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

      .section { border-bottom: 1px solid rgba(255,255,255,0.04); }
      .section:last-child { border-bottom: none; }

      .section-header {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        padding: 10px 16px;
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-family: inherit;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        transition: color 0.15s;
      }
      .section-header:hover { color: #ccc; }

      .chevron {
        display: inline-block;
        transition: transform 0.2s;
        font-size: 14px;
        line-height: 1;
      }
      .chevron.open { transform: rotate(90deg); }

      .section-body { padding: 0 16px 10px; }

      .control {
        margin-bottom: 10px;
        padding: 6px 8px;
        border-radius: 6px;
        background: rgba(255,255,255,0.02);
        transition: background 0.15s;
      }
      .control.changed {
        background: rgba(168,224,0,0.05);
        border-left: 2px solid rgba(168,224,0,0.3);
        padding-left: 6px;
      }
      .control:last-child { margin-bottom: 0; }

      .control-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      label {
        font-size: 11px;
        color: #999;
        font-weight: 500;
      }

      .reset-one {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: none;
        background: rgba(255,255,255,0.06);
        color: #666;
        cursor: pointer;
        font-size: 13px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: all 0.15s;
      }
      .reset-one:hover:not([disabled]) { background: rgba(255,80,80,0.2); color: #ff6b6b; }
      .reset-one[disabled] { opacity: 0.2; cursor: default; }

      .control-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      input[type="range"] {
        flex: 1;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        outline: none;
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #a8e000;
        border: 2px solid #151614;
        cursor: pointer;
        box-shadow: 0 0 6px rgba(168,224,0,0.3);
      }

      input[type="color"] {
        -webkit-appearance: none;
        appearance: none;
        width: 32px;
        height: 24px;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 4px;
        background: none;
        cursor: pointer;
        padding: 0;
      }
      input[type="color"]::-webkit-color-swatch-wrapper { padding: 2px; }
      input[type="color"]::-webkit-color-swatch { border: none; border-radius: 2px; }

      select {
        width: 100%;
        padding: 5px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        color: #e0e0e0;
        font-family: inherit;
        font-size: 11px;
        cursor: pointer;
        outline: none;
      }
      select:focus { border-color: rgba(168,224,0,0.3); }

      .text-input {
        width: 100%;
        padding: 5px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        color: #e0e0e0;
        font-family: inherit;
        font-size: 11px;
        outline: none;
        box-sizing: border-box;
      }
      .text-input:focus { border-color: rgba(168,224,0,0.3); }

      .value-display {
        min-width: 52px;
        text-align: right;
        font-size: 11px;
        color: #777;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }
    `;
  }

  /* ── Events ───────────────────────────────── */

  _bindEvents() {
    const root = this.shadowRoot;

    // Toggle panel
    root.querySelector('.toggle-btn').addEventListener('click', () => {
      this._panelOpen = !this._panelOpen;
      root.querySelector('.panel').classList.toggle('open', this._panelOpen);
    });

    // Section collapse
    root.querySelectorAll('.section-header').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.toggle;
        this._collapsed[key] = !this._collapsed[key];
        const body = btn.closest('.section').querySelector('.section-body');
        const chevron = btn.querySelector('.chevron');
        if (this._collapsed[key]) {
          body.style.display = 'none';
          chevron.classList.remove('open');
        } else {
          body.style.display = 'block';
          chevron.classList.add('open');
        }
      });
    });

    // Input changes
    root.querySelectorAll('[data-input]').forEach(input => {
      const event = input.type === 'range' ? 'input' : 'change';
      input.addEventListener(event, () => {
        const key = input.dataset.input;
        const def = DEFAULTS[key];
        let val = input.value;
        if (def.type !== 'color' && def.type !== 'select' && def.type !== 'text') {
          val = parseFloat(val);
        }
        this._values[key] = val;
        this._applyProperty(key);
        this._updateControlState(key);
      });
      // Text inputs also update on input for live preview
      if (input.type === 'text') {
        input.addEventListener('input', () => {
          this._values[input.dataset.input] = input.value;
          this._applyProperty(input.dataset.input);
          this._updateControlState(input.dataset.input);
        });
      }
    });

    // Per-control reset
    root.querySelectorAll('.reset-one').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.dataset.reset;
        this._values[key] = DEFAULTS[key].value;
        this._applyProperty(key);
        // Update the input element
        const input = root.querySelector(`[data-input="${key}"]`);
        if (input) input.value = DEFAULTS[key].value;
        this._updateControlState(key);
      });
    });

    // Reset all
    root.querySelector('.reset-all-btn').addEventListener('click', () => {
      for (const key of Object.keys(DEFAULTS)) {
        this._values[key] = DEFAULTS[key].value;
        this._applyProperty(key);
        const input = root.querySelector(`[data-input="${key}"]`);
        if (input) input.value = DEFAULTS[key].value;
        this._updateControlState(key);
      }
    });

    // Copy prompt
    root.querySelector('.copy-btn').addEventListener('click', () => {
      const prompt = this._buildPrompt();
      navigator.clipboard.writeText(prompt).then(() => {
        const btn = root.querySelector('.copy-btn');
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy Prompt';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  _updateControlState(key) {
    const def = DEFAULTS[key];
    const val = this._values[key];
    const changed = val !== def.value;
    const control = this.shadowRoot.querySelector(`.control[data-prop="${key}"]`);
    if (!control) return;
    control.classList.toggle('changed', changed);
    const resetBtn = control.querySelector('.reset-one');
    if (resetBtn) resetBtn.disabled = !changed;
    const display = control.querySelector('.value-display');
    if (display && def.type !== 'color') {
      display.textContent = `${val}${def.unit || ''}`;
    } else if (display && def.type === 'color') {
      display.textContent = val;
    }
  }

  /* ── Apply to key-card ────────────────────── */

  _getCard() {
    const kc = document.querySelector('key-card');
    return kc ? kc.shadowRoot : null;
  }

  _applyProperty(key) {
    const sr = this._getCard();
    if (!sr) return;

    const card = sr.querySelector('.key-card');
    const notch = sr.querySelector('.notch');
    const frame = sr.querySelector('.photo-frame');
    const name = sr.querySelector('.name');
    const title = sr.querySelector('.title');
    const host = sr.host;
    const v = this._values[key];

    switch (key) {
      // Card
      case 'cardWidth':        card.style.width = `${v}px`; break;
      case 'cardRadius':
        card.style.borderRadius = `${v}px`;
        // Also update pseudo-element radii via a CSS custom property
        card.style.setProperty('--card-radius', `${v}px`);
        break;
      case 'cardBg':           card.style.background = v; break;
      case 'cardPaddingTop':   card.style.paddingTop = `${v}px`; break;
      case 'cardPaddingSide':  card.style.paddingLeft = card.style.paddingRight = `${v}px`; break;
      case 'cardPaddingBottom':card.style.paddingBottom = `${v}px`; break;
      case 'cardShadowOpacity':card.style.boxShadow = `inset 0 0 0 1px rgba(0,0,0,${v})`; break;

      // Notch
      case 'notchWidth':  notch.style.width = `${v}px`; break;
      case 'notchHeight': notch.style.height = `${v}px`; break;
      case 'notchTop':    notch.style.top = `${v}px`; break;
      case 'notchRadius': notch.style.borderRadius = `${v}px`; break;
      case 'notchBg':     notch.style.background = v; break;

      // Photo Frame
      case 'frameRadius':        frame.style.borderRadius = `${v}px`; break;
      case 'framePaddingTop':    frame.style.paddingTop = `${v}%`; break;
      case 'frameGradientTop':
      case 'frameGradientBottom':
        frame.style.background = `linear-gradient(to bottom, ${this._values.frameGradientTop}, ${this._values.frameGradientBottom})`;
        break;

      // Name
      case 'nameFontSize':   name.style.fontSize = `${v}rem`; break;
      case 'nameFontWeight': name.style.fontWeight = v; break;
      case 'nameColor':      name.style.color = v; break;
      case 'nameText':       name.textContent = v; break;

      // Title
      case 'titleFontSize':      title.style.fontSize = `${v}rem`; break;
      case 'titleFontWeight':    title.style.fontWeight = v; break;
      case 'titleLetterSpacing': title.style.letterSpacing = `${v}em`; break;
      case 'titleOpacity':       title.style.color = `rgba(21,22,20,${v})`; break;
      case 'titleTransform':     title.style.textTransform = v; break;
      case 'titleText':          title.textContent = v; break;

      // Holographic — rebuild the ::after background via a style tag injection
      case 'specularSize':
      case 'specularOpacity':
      case 'blendMode':
      case 'edgeDarkening':
        this._applyHolographic(sr);
        break;

      // 3D & Animation
      case 'perspective':
        host.style.perspective = `${v}px`;
        break;
      case 'tiltX':
      case 'tiltY':
      case 'parallax':
        // These are runtime JS values — store on the key-card element for the mousemove handler to pick up
        this._patchMouseHandler();
        break;
      case 'floatDistance':
      case 'floatDuration':
        this._patchFloatAnimation();
        break;

      // ASCII
      case 'asciiOpacity':
        this._applyAsciiOpacity(sr);
        break;
    }
  }

  _applyHolographic(sr) {
    const size = this._values.specularSize;
    const opacity = this._values.specularOpacity;
    const blend = this._values.blendMode;
    const edge = this._values.edgeDarkening;

    let style = sr.querySelector('#tweaker-holo-override');
    if (!style) {
      style = document.createElement('style');
      style.id = 'tweaker-holo-override';
      sr.appendChild(style);
    }
    style.textContent = `
      .key-card::after {
        mix-blend-mode: ${blend} !important;
        background:
          radial-gradient(circle ${size}px at var(--mx) var(--my), rgba(255,255,255,${opacity}) 0%, transparent 60%),
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
          radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,${edge}) 100%) !important;
      }
    `;
  }

  _applyAsciiOpacity(sr) {
    const opacity = this._values.asciiOpacity;
    let style = sr.querySelector('#tweaker-ascii-override');
    if (!style) {
      style = document.createElement('style');
      style.id = 'tweaker-ascii-override';
      sr.appendChild(style);
    }
    style.textContent = `
      .key-card::before {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cstyle%3Etext%7Bfont-family:monospace;font-size:16px;fill:rgba(0,0,0,${opacity})%7D%3C/style%3E%3Ctext x='5' y='12'%3E*%3C/text%3E%3Ctext x='30' y='12'%3E~%3C/text%3E%3Ctext x='58' y='12'%3E%23%3C/text%3E%3Ctext x='85' y='12'%3E+%3C/text%3E%3Ctext x='112' y='12'%3E%25%3C/text%3E%3Ctext x='18' y='28'%3E%40%3C/text%3E%3Ctext x='45' y='28'%3E/%3C/text%3E%3Ctext x='72' y='28'%3E=%3C/text%3E%3Ctext x='100' y='28'%3E%5E%3C/text%3E%3Ctext x='128' y='28'%3E~%3C/text%3E%3Ctext x='8' y='44'%3E%25%3C/text%3E%3Ctext x='35' y='44'%3E*%3C/text%3E%3Ctext x='62' y='44'%3E+%3C/text%3E%3Ctext x='90' y='44'%3E%23%3C/text%3E%3Ctext x='118' y='44'%3E%40%3C/text%3E%3Ctext x='22' y='60'%3E/%3C/text%3E%3Ctext x='48' y='60'%3E%5E%3C/text%3E%3Ctext x='75' y='60'%3E~%3C/text%3E%3Ctext x='105' y='60'%3E=%3C/text%3E%3Ctext x='132' y='60'%3E*%3C/text%3E%3Ctext x='12' y='76'%3E%23%3C/text%3E%3Ctext x='40' y='76'%3E%40%3C/text%3E%3Ctext x='68' y='76'%3E%25%3C/text%3E%3Ctext x='95' y='76'%3E+%3C/text%3E%3Ctext x='122' y='76'%3E/%3C/text%3E%3Ctext x='2' y='92'%3E~%3C/text%3E%3Ctext x='28' y='92'%3E=%3C/text%3E%3Ctext x='55' y='92'%3E%5E%3C/text%3E%3Ctext x='82' y='92'%3E*%3C/text%3E%3Ctext x='110' y='92'%3E%23%3C/text%3E%3Ctext x='15' y='108'%3E+%3C/text%3E%3Ctext x='42' y='108'%3E%25%3C/text%3E%3Ctext x='70' y='108'%3E/%3C/text%3E%3Ctext x='98' y='108'%3E~%3C/text%3E%3Ctext x='125' y='108'%3E%40%3C/text%3E%3Ctext x='8' y='124'%3E%5E%3C/text%3E%3Ctext x='35' y='124'%3E%23%3C/text%3E%3Ctext x='62' y='124'%3E=%3C/text%3E%3Ctext x='88' y='124'%3E+%3C/text%3E%3Ctext x='115' y='124'%3E*%3C/text%3E%3C/svg%3E") repeat !important;
      }
    `;
  }

  _patchMouseHandler() {
    const kc = document.querySelector('key-card');
    if (!kc) return;
    // Store tweaker overrides on the element so the handler can read them
    kc._tweakerTiltX = this._values.tiltX;
    kc._tweakerTiltY = this._values.tiltY;
    kc._tweakerParallax = this._values.parallax;
  }

  _patchFloatAnimation() {
    const kc = document.querySelector('key-card');
    if (!kc || !kc.shadowRoot) return;
    const card = kc.shadowRoot.querySelector('.key-card');
    if (!card) return;

    // Kill existing idle float and restart with new values
    if (kc._floatTween) kc._floatTween.kill();

    const gsapLib = window.gsap || (typeof gsap !== 'undefined' ? gsap : null);
    if (!gsapLib) return;

    kc._floatTween = gsapLib.to(card, {
      y: -this._values.floatDistance,
      duration: this._values.floatDuration,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  /* ── Prompt Builder ───────────────────────── */

  _buildPrompt() {
    const changes = [];
    for (const [key, def] of Object.entries(DEFAULTS)) {
      const val = this._values[key];
      if (val !== def.value) {
        changes.push({ key, label: def.label, from: def.value, to: val, unit: def.unit || '' });
      }
    }

    if (changes.length === 0) {
      return 'No changes have been made to the key-card.';
    }

    // Group by section
    const sectionChanges = {};
    for (const section of SECTIONS) {
      const sectionDiffs = changes.filter(c => section.props.includes(c.key));
      if (sectionDiffs.length) sectionChanges[section.label] = sectionDiffs;
    }

    let prompt = `Update the key-card component with the following changes:\n\n`;
    for (const [sectionLabel, diffs] of Object.entries(sectionChanges)) {
      prompt += `**${sectionLabel}:**\n`;
      for (const d of diffs) {
        prompt += `- ${d.label}: change from \`${d.from}${d.unit}\` to \`${d.to}${d.unit}\`\n`;
      }
      prompt += '\n';
    }

    prompt += `Apply these as the new defaults in the key-card component source code.`;
    return prompt;
  }
}

customElements.define('tweaker-panel', TweakerPanel);
