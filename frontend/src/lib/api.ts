/**
 * SAFE API BASE URL
 * - Uses VITE_API_URL if present (Vercel, Railway, local)
 * - Falls back to empty string so relative URLs work locally
 * - NEVER crashes the build
 */
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  // Local dev: use relative URLs (proxy or same origin)
  return '';
};

// Export as constant string (safe for build)
export const API_BASE_URL = getBaseUrl();

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // If we're in local dev (empty base), use relative path
  const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  return res;
};
