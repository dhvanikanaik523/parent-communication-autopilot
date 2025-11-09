const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  return url && url.trim() !== '' ? url : '';
};

export const API_BASE_URL = getBaseUrl();

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  
  return res;
};
