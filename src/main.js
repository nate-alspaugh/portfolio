import './style.css'
import './components/key-card.js'
import './components/main-nav.js'
import './components/home-bio.js'
import './components/work-list.js'
import './components/contact-links.js'
import './pages/case-study.js'
import { parseRoute, onRouteChange } from './router.js'
import { projects } from './data/projects.js'

const app = document.querySelector('#app');
const BASE_TITLE = 'Nathan Alspaugh | AI-Native Sr. Product Designer';

function setTitle(route) {
  if (route.name === 'case-study') {
    const project = projects.find((p) => p.slug === route.slug);
    document.title = project ? `Nathan Alspaugh | ${project.title}` : BASE_TITLE;
  } else {
    document.title = BASE_TITLE;
  }
}

function renderHome() {
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
  app.innerHTML = `<case-study-page slug="${slug}"></case-study-page>`;
}

function render(route) {
  setTitle(route);
  if (route.name === 'case-study') {
    renderCaseStudy(route.slug);
  } else {
    renderHome();
  }
}

render(parseRoute());
onRouteChange(render);
