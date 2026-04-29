// Per-route meta tag management. Called by main.js on every route change.

const SITE_URL = 'https://nathanalspaugh.com';
export const BASE_TITLE = 'Nathan Alspaugh | AI-Native Sr. Product Designer';
export const BASE_DESCRIPTION =
  'Senior product designer leveraging AI to ship ambitious work. Case studies, contact, and selected projects.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function buildRouteMeta(route, project) {
  if (route.name === 'case-study' && project) {
    return {
      title: `Nathan Alspaugh | ${project.title}`,
      description: project.description ?? BASE_DESCRIPTION,
      url: `${SITE_URL}/work/${project.slug}`,
      ogImage: DEFAULT_OG_IMAGE,
    };
  }
  return {
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
    url: SITE_URL + '/',
    ogImage: DEFAULT_OG_IMAGE,
  };
}

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [name, val] = selector.replace(/^meta\[|\]$/g, '').split('=');
    el.setAttribute(name, val.replace(/"/g, ''));
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyMeta({ title, description, url, ogImage }) {
  document.title = title;
  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:url"]', 'content', url);
  setMeta('meta[property="og:image"]', 'content', ogImage);
  setMeta('meta[property="og:type"]', 'content', 'website');
  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', 'content', title);
  setMeta('meta[name="twitter:description"]', 'content', description);
  setMeta('meta[name="twitter:image"]', 'content', ogImage);
  setLink('canonical', url);
}
