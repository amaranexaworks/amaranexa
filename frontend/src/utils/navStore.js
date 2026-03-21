const DEFAULT_NAV_LINKS = [
  { id: 1, label: 'Home', href: '/', enabled: true },
  { id: 2, label: 'Courses', href: '/courses', enabled: true },
  { id: 3, label: 'Schools', href: '/schools', enabled: true },
  { id: 4, label: 'Summer Camps', href: '/summer-camps', enabled: true },
  { id: 5, label: 'Blog', href: '/blog', enabled: true },
];

const STORAGE_KEY = 'codeoffice_nav_links';

export function getNavLinks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NAV_LINKS));
    return DEFAULT_NAV_LINKS;
  } catch {
    return DEFAULT_NAV_LINKS;
  }
}

export function saveNavLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function addNavLink(link) {
  const links = getNavLinks();
  const newLink = { ...link, id: Date.now(), enabled: true };
  const updated = [...links, newLink];
  saveNavLinks(updated);
  return updated;
}

export function updateNavLink(id, data) {
  const links = getNavLinks();
  const updated = links.map(l => l.id === id ? { ...l, ...data } : l);
  saveNavLinks(updated);
  return updated;
}

export function deleteNavLink(id) {
  const links = getNavLinks();
  const updated = links.filter(l => l.id !== id);
  saveNavLinks(updated);
  return updated;
}

export function reorderNavLinks(links) {
  saveNavLinks(links);
  return links;
}
