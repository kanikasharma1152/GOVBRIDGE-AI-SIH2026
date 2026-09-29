/**
 * GovBridge API Client
 * Uses VITE_API_URL for production (Render backend).
 * Falls back to relative /api/ paths for local dev (Vite proxy handles it).
 */

const BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : '';

export function apiUrl(path) {
  // path should start with /api/...
  return `${BASE}${path}`;
}

export function apiFetch(path, options = {}) {
  return fetch(apiUrl(path), options);
}
