const listeners = new Set();

export function parseRoute(pathname = window.location.pathname) {
  const match = pathname.match(/^\/work\/([^/]+)\/?$/);
  if (match) return { name: 'case-study', slug: match[1] };
  return { name: 'home' };
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  emit();
}

export function onRouteChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function emit() {
  const route = parseRoute();
  listeners.forEach((cb) => cb(route));
}

window.addEventListener('popstate', emit);
