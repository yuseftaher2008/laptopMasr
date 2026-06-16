// js/api.js
// Every call to your Express + SQLite backend goes through here.
// If you ever change the base URL or port, this is the only place to update.

const BASE_URL = "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  // your backend returns JSON for both success and error cases
  let data = null;
  try {
    data = await res.json();
  } catch {
    // 204 No Content (e.g. DELETE) has no body
    data = null;
  }
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // ---------- products ----------

  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    const query = params.toString();
    const res = await fetch(`${BASE_URL}/products${query ? `?${query}` : ""}`);
    return handleResponse(res);
  },

  async getProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    return handleResponse(res);
  },

  async createProduct(payload) {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async updateProduct(id, payload) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    // 204 No Content -> handleResponse returns null, that's fine
    return handleResponse(res);
  },

  // ---------- auth ----------

  async register(payload) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async login(payload) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};

// Decode a JWT payload without a library — JWTs are base64url, not encrypted,
// so this is safe for reading our own token's claims (id, username, role).
export function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
