import './style.css'
import './components/key-card.js'
import './components/main-nav.js'
import './components/home-bio.js'
import './components/work-list.js'
import './components/contact-links.js'
import './pages/case-study.js'
import { parseRoute, onRouteChange } from './router.js'
import { findProject } from './data/projects.js'
import { applyMeta, buildRouteMeta } from './lib/meta.js'


const app = document.querySelector('#app');

function renderHome() {
  // If the page was prerendered, reuse the existing markup.
  if (app.querySelector('.hero')) return;
  app.innerHTML = `
    <section class="hero">
      <div class="hero-name" aria-hidden="true">
        <span>Nathan</span>
        <span>Alspaugh</span>
      </div>
      <div class="home-grid">
        <home-bio class="home-grid__bio"></home-bio>
        <div class="home-grid__badge">
          <key-card></key-card>
        </div>
        <div class="home-grid__right">
          <work-list></work-list>
          <contact-links></contact-links>
        </div>
      </div>
    </section>
  `;
}

function renderCaseStudy(slug) {
  const existing = app.querySelector(`case-study-page[slug="${CSS.escape(slug)}"]`);
  if (existing) return; // prerendered or already current
  app.innerHTML = `<case-study-page slug="${slug}"></case-study-page>`;
}

function render(route) {
  const project = route.name === 'case-study' ? findProject(route.slug) : null;
  applyMeta(buildRouteMeta(route, project));
  if (route.name === 'case-study') {
    renderCaseStudy(route.slug);
  } else {
    renderHome();
  }
}

render(parseRoute());
onRouteChange(render);
