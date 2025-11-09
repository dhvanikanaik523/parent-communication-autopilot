export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function (optional but nice)
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res;
};

