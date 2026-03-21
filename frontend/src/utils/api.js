const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('admin_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
  }
  return res;
}

export async function apiUpload(path, formData) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return res;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function checkHasAdmin() {
  const res = await apiFetch('/api/auth/has-admin');
  const data = await res.json();
  return data.hasAdmin;
}

export async function registerAdmin(username, password) {
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function loginAdmin(username, password) {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function verifyToken() {
  const res = await apiFetch('/api/auth/me');
  return res.ok;
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export async function fetchBlogPosts() {
  const res = await apiFetch('/api/blog');
  return res.json();
}

export async function createBlogPost(post) {
  const res = await apiFetch('/api/blog', {
    method: 'POST',
    body: JSON.stringify(post),
  });
  return res.json();
}

export async function updateBlogPost(id, post) {
  const res = await apiFetch(`/api/blog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  });
  return res.json();
}

export async function deleteBlogPost(id) {
  const res = await apiFetch(`/api/blog/${id}`, { method: 'DELETE' });
  return res.json();
}

// ── Page Content ──────────────────────────────────────────────────────────────
export async function fetchPageContent(pageKey) {
  const res = await apiFetch(`/api/content/${pageKey}`);
  const data = await res.json();
  return data.content;
}

export async function savePageContent(pageKey, content) {
  const res = await apiFetch(`/api/content/${pageKey}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
  return res.json();
}

// ── Nav Links ─────────────────────────────────────────────────────────────────
export async function fetchNavLinks() {
  const res = await apiFetch('/api/navlinks');
  return res.json();
}

export async function createNavLink(link) {
  const res = await apiFetch('/api/navlinks', {
    method: 'POST',
    body: JSON.stringify(link),
  });
  return res.json();
}

export async function updateNavLinkApi(id, link) {
  const res = await apiFetch(`/api/navlinks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(link),
  });
  return res.json();
}

export async function deleteNavLinkApi(id) {
  const res = await apiFetch(`/api/navlinks/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function reorderNavLinksApi(links) {
  const res = await apiFetch('/api/navlinks/reorder/all', {
    method: 'PUT',
    body: JSON.stringify({ links }),
  });
  return res.json();
}

// ── Media ─────────────────────────────────────────────────────────────────────
export async function fetchMedia(category) {
  const query = category ? `?category=${category}` : '';
  const res = await apiFetch(`/api/media${query}`);
  return res.json();
}

export async function uploadMedia(files, altText = '') {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  if (altText) formData.append('alt_text', altText);
  const res = await apiUpload('/api/media/upload', formData);
  return res.json();
}

export async function deleteMedia(id) {
  const res = await apiFetch(`/api/media/${id}`, { method: 'DELETE' });
  return res.json();
}

export function getMediaUrl(urlPath) {
  if (!urlPath) return '';
  if (urlPath.startsWith('http')) return urlPath;
  return `${API_BASE}${urlPath}`;
}
