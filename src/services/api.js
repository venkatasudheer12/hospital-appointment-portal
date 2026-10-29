const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(resource, options = {}) {
  const response = await fetch(`${API_BASE}/${resource}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  list: (resource) => request(resource),
  create: (resource, data) => request(resource, { method: 'POST', body: JSON.stringify(data) }),
  update: (resource, id, data) => request(`${resource}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (resource, id) => request(`${resource}/${encodeURIComponent(id)}`, { method: 'DELETE' })
};
