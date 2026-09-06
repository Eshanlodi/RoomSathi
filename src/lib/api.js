const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Thin wrapper around fetch that:
 * - prefixes the backend base URL
 * - attaches the JWT from localStorage automatically, if present
 * - parses JSON and throws a real Error (with the backend's message) on failure
 */
async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Bubble up the backend's error message (e.g. "Invalid email or password")
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  auth: {
    register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
    login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),
    me: () => request("/auth/me"),
    updateProfile: (payload) => request("/auth/me", { method: "PUT", body: payload }),
  },
  rooms: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/rooms${qs ? `?${qs}` : ""}`, { auth: false });
    },
    get: (id) => request(`/rooms/${id}`, { auth: false }),
    create: (payload) => request("/rooms", { method: "POST", body: payload }),
    update: (id, payload) => request(`/rooms/${id}`, { method: "PUT", body: payload }),
    remove: (id) => request(`/rooms/${id}`, { method: "DELETE" }),
    reviews: (roomId) => request(`/rooms/${roomId}/reviews`, { auth: false }),
    addReview: (roomId, payload) => request(`/rooms/${roomId}/reviews`, { method: "POST", body: payload }),
  },
  roommates: {
    upsertProfile: (payload) => request("/roommates", { method: "POST", body: payload }),
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/roommates${qs ? `?${qs}` : ""}`);
    },
    get: (id) => request(`/roommates/${id}`),
  },
};