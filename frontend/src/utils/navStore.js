import { fetchNavLinks, createNavLink, updateNavLinkApi, deleteNavLinkApi, reorderNavLinksApi } from './api';

const DEFAULT_NAV_LINKS = [
  { id: 1, label: 'Home', href: '/', enabled: true },
  { id: 2, label: 'Courses', href: '/courses', enabled: true },
  { id: 3, label: 'Schools', href: '/schools', enabled: true },
  { id: 4, label: 'Summer Camps', href: '/summer-camps', enabled: true },
  { id: 5, label: 'Blog', href: '/blog', enabled: true },
];

function normalize(link) {
  return { ...link, enabled: link.enabled === 1 || link.enabled === true };
}

export async function getNavLinks() {
  try {
    const links = await fetchNavLinks();
    if (Array.isArray(links) && links.length > 0) return links.map(normalize);
  } catch { /* fall through */ }
  return DEFAULT_NAV_LINKS;
}

export async function addNavLink(link) {
  try {
    const created = await createNavLink(link);
    return normalize(created);
  } catch (err) {
    console.error('addNavLink error:', err);
    return null;
  }
}

export async function updateNavLink(id, data) {
  try {
    const updated = await updateNavLinkApi(id, data);
    return normalize(updated);
  } catch (err) {
    console.error('updateNavLink error:', err);
    return null;
  }
}

export async function deleteNavLink(id) {
  try {
    await deleteNavLinkApi(id);
    return true;
  } catch (err) {
    console.error('deleteNavLink error:', err);
    return false;
  }
}

export async function reorderNavLinks(links) {
  try {
    const updated = await reorderNavLinksApi(links);
    return Array.isArray(updated) ? updated.map(normalize) : links;
  } catch (err) {
    console.error('reorderNavLinks error:', err);
    return links;
  }
}

// Sync version for initial render
export function getNavLinksSync() {
  return DEFAULT_NAV_LINKS;
}
