// Update to live backend URL
const API_URL = 'https://trialnestjs-2-2tyc.onrender.com'; // live backend URL

export const apiFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(`${API_URL}${url}`, options);
  const data = await response.json();
  return { ok: response.ok, data };
};
