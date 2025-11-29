export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL; // Use the environment variable for the base URL
  
  const res = await fetch(`${API_URL}/api/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data?.message || "API request failed");

  return data;
}
