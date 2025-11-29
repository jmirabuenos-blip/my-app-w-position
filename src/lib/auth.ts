// auth.ts

// Import getToken if it's in a separate file
export const getToken = () => {
  return localStorage.getItem("accessToken"); // Get token from localStorage
};

export const apiFetch = async (url: string, options: RequestInit) => {
  const token = getToken(); // Get the token from localStorage
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }), // Add token in headers if available
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers, // Merge the token headers with the request headers
        ...options.headers, // Allow custom headers to override default headers
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return { ok: response.ok, data };
  } catch (error: any) {
    console.error('API Fetch Error:', error.message);
    return { ok: false, error: error.message };
  }
};
