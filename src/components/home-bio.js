const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: var(--font-geist-mono);
      text-transform: uppercase;
    }

    .manifesto {
      font-size: 16px;
      line-height: 1.75;
      color: rgba(255, 255, 255, 0.9);
      max-width: 372px;
      margin: 0 0 40px;
    }

    .blurb {
      font-size: 16px;
      line-height: 1.75;
      color: rgba(255, 255, 255, 0.6);
      max-width: 372px;
      margin: 0;
    }

    .footnote {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 16px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.6);
    }

    @media (max-width: 1023px) {
      .manifesto,
      .blurb {
        font-size: 14px;
        line-height: 1.65;
      }

      .manifesto {
        margin-bottom: 20px;
      }

      .footnote {
        display: none;
      }
    }

    @media (max-width: 767px) {
      .manifesto,
      .blurb {
        max-width: none;
      }
    }
  </style>

  <p class="manifesto">I love collaborating with product and engineering teams to achieve ambitious goals.</p>
  <p class="blurb">I'm based in the Davis County area with my wife, 5 kids, 2 dogs, <s>3 guinea pigs</s>(RIP) and 1 python.</p>
  <div class="footnote">
    <span>Bountiful, UT</span>
    <span id="weather">—°F • ——</span>
  </div>
`;

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=40.8894&longitude=-111.8808&current=temperature_2m,weather_code&temperature_unit=fahrenheit';

function codeToLabel(code) {
  if (code === 0) return 'Clear';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Cloudy';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'Rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'Snow';
  if (code === 95 || code === 96 || code === 99) return 'Thunderstorm';
  return '';
}

class HomeBio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    try {
      const res = await fetch(WEATHER_URL);
      if (!res.ok) return;
      const { current } = await res.json();
      const temp = Math.round(current.temperature_2m);
      const label = codeToLabel(current.weather_code);
      const el = this.shadowRoot.getElementById('weather');
      if (el) el.textContent = label ? `${temp}°F • ${label}` : `${temp}°F`;
    } catch {
      /* keep static fallback */
    }
  }
}

customElements.define('home-bio', HomeBio);
