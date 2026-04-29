import { defineConfig } from 'vite';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { projectsMeta } from './src/data/projects-meta.js';
import { renderCaseStudyContent, escapeHtml } from './src/lib/case-study-html.js';

const SITE_URL = 'https://nathanalspaugh.com';
const BASE_TITLE = 'Nathan Alspaugh | AI-Native Sr. Product Designer';
const BASE_DESCRIPTION =
  'Senior product designer leveraging AI to ship ambitious work. Case studies, contact, and selected projects.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

function buildRouteList() {
  return [
    {
      path: '/',
      title: BASE_TITLE,
      description: BASE_DESCRIPTION,
      url: `${SITE_URL}/`,
      ogImage: DEFAULT_OG_IMAGE,
      body: renderHomeBody(),
    },
    ...projectsMeta.map((p) => ({
      path: `/work/${p.slug}`,
      title: `Nathan Alspaugh | ${p.title}`,
      description: p.description ?? BASE_DESCRIPTION,
      url: `${SITE_URL}/work/${p.slug}`,
      ogImage: DEFAULT_OG_IMAGE,
      body: renderCaseStudyBody(p),
    })),
  ];
}

function renderCaseStudyBody(project) {
  const accentStyle = project?.accent ? ` style="--accent: ${project.accent};"` : '';
  return `
    <case-study-page slug="${escapeHtml(project.slug)}"${accentStyle}>
      <div class="cs-wrap">
        <div class="cs-back-rail">
          <button class="cs-back" data-back aria-label="Back to home">
            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            Back
          </button>
        </div>
        <div class="cs-content">${renderCaseStudyContent(project)}</div>
      </div>
    </case-study-page>
  `;
}

function renderHomeBody() {
  // Mirrors main.js renderHome() output, but with SEO fallback children inside
  // the shadow-DOM custom elements. Crawlers see the fallback text in the
  // light DOM; humans see the shadow-DOM rendering once JS upgrades the
  // elements (because the shadow root has no <slot>, the light children are
  // not projected — but they remain in the document tree).
  const projectLinks = projectsMeta
    .map((p) =>
      p.comingSoon
        ? `<li>${escapeHtml(p.title)} (case study coming soon)</li>`
        : `<li><a href="/work/${p.slug}">${escapeHtml(p.title)}</a></li>`
    )
    .join('');

  return `
    <section class="hero">
      <div class="hero-name" aria-hidden="true">
        <span>Nathan</span>
        <span>Alspaugh</span>
      </div>
      <div class="home-grid">
        <home-bio class="home-grid__bio">
          <div class="seo-fallback">
            <p>I love collaborating with product and engineering teams to achieve ambitious goals.</p>
            <p>I'm based in the Davis County area with my wife, 5 kids, 2 dogs, and 1 python.</p>
            <p>Bountiful, UT</p>
          </div>
        </home-bio>
        <div class="home-grid__badge">
          <key-card>
            <div class="seo-fallback">
              <h1>Nathan Alspaugh</h1>
              <p>Sr. Product Designer — Bountiful, UT</p>
            </div>
          </key-card>
        </div>
        <div class="home-grid__right">
          <work-list>
            <div class="seo-fallback">
              <h2>Featured work</h2>
              <ul>${projectLinks}</ul>
            </div>
          </work-list>
          <contact-links>
            <div class="seo-fallback">
              <h2>Get in touch</h2>
              <ul>
                <li><a href="https://www.linkedin.com/in/nathan-alspaugh/">LinkedIn</a></li>
                <li><a href="https://dribbble.com/nathan-alspaugh">Dribbble</a></li>
                <li><a href="/nathan-alspaugh-resume.pdf">Resume</a></li>
              </ul>
            </div>
          </contact-links>
        </div>
      </div>
    </section>
  `;
}

function injectMetaIntoHead(html, route) {
  const headReplacements = [
    [/<title>[^<]*<\/title>/, `<title>${route.title}</title>`],
    [/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${route.description}" />`],
    [/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${route.url}" />`],
    [/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${route.title}" />`],
    [/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${route.description}" />`],
    [/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${route.url}" />`],
    [/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${route.ogImage}" />`],
    [/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${route.title}" />`],
    [/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${route.description}" />`],
    [/<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${route.ogImage}" />`],
  ];
  let result = html;
  for (const [re, replacement] of headReplacements) {
    result = result.replace(re, replacement);
  }
  return result;
}

function injectBody(html, body) {
  return html.replace(
    /<div id="app"><\/div>/,
    `<div id="app">${body}</div>`
  );
}

function buildSitemap(routes) {
  const urls = routes
    .map(
      (r) => `  <url>\n    <loc>${r.url}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function prerenderPlugin() {
  return {
    name: 'portfolio-prerender',
    apply: 'build',
    async closeBundle() {
      const distDir = 'dist';
      const indexPath = join(distDir, 'index.html');
      const baseHtml = await readFile(indexPath, 'utf8');
      const routes = buildRouteList();

      // Rewrite the root index.html with home body + meta.
      const homeRoute = routes.find((r) => r.path === '/');
      let homeHtml = injectMetaIntoHead(baseHtml, homeRoute);
      homeHtml = injectBody(homeHtml, homeRoute.body);
      await writeFile(indexPath, homeHtml, 'utf8');

      // Emit per-route directories with index.html so direct URLs serve
      // prerendered content (Vercel rewrite serves these before the SPA
      // fallback because they end with .html).
      for (const route of routes) {
        if (route.path === '/') continue;
        const filePath = join(distDir, route.path.replace(/^\//, ''), 'index.html');
        let html = injectMetaIntoHead(baseHtml, route);
        html = injectBody(html, route.body);
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, html, 'utf8');
      }

      // Sitemap.
      await writeFile(join(distDir, 'sitemap.xml'), buildSitemap(routes), 'utf8');
    },
  };
}

export default defineConfig({
  plugins: [prerenderPlugin()],
});
