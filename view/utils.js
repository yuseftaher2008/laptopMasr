// TechMasr - Shared Utilities
const API = 'http://localhost:8000/api';

// Auth helpers
const auth = {
  getToken: () => localStorage.getItem('token'),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  isLoggedIn: () => !!localStorage.getItem('token'),
  isAdmin: () => {
    const user = auth.getUser();
    return user && user.role === 'admin';
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
};

// API helpers
const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API}${endpoint}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });
    if (res.status === 401) { auth.logout(); return; }
    return res.json();
  },
  post: async (endpoint, body, requireAuth = true) => {
    const headers = { 'Content-Type': 'application/json' };
    if (requireAuth) headers.Authorization = `Bearer ${auth.getToken()}`;
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST', headers, body: JSON.stringify(body)
    });
    return { ok: res.ok, status: res.status, data: await res.json() };
  },
  put: async (endpoint, body) => {
    const res = await fetch(`${API}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.getToken()}` },
      body: JSON.stringify(body)
    });
    return { ok: res.ok, data: await res.json() };
  },
  delete: async (endpoint) => {
    const res = await fetch(`${API}${endpoint}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });
    return { ok: res.ok };
  }
};

// Toast notifications
const toast = {
  show: (msg, type = 'success') => {
    const container = document.getElementById('toast-container') || (() => {
      const el = document.createElement('div');
      el.id = 'toast-container';
      el.className = 'toast-container';
      document.body.appendChild(el);
      return el;
    })();
    const icon = type === 'success' ? '✓' : '✗';
    const color = type === 'success' ? '#34D399' : '#FF6B6B';
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span style="color:${color};font-weight:700;font-size:16px">${icon}</span><span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
  }
};

// Cart count updater
const updateCartCount = async () => {
  if (!auth.isLoggedIn()) return;
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  try {
    const data = await api.get('/cart');
    badge.textContent = Array.isArray(data) ? data.length : 0;
  } catch {}
};

// Render navbar
const renderNavbar = (activePage = '') => {
  const isLoggedIn = auth.isLoggedIn();
  const isAdmin = auth.isAdmin();
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  navbar.innerHTML = `
    <a href="index.html" class="navbar-logo">Tech<span style="color:#b4c5ff">Masr</span></a>
    <div class="navbar-links">
      <a href="index.html" class="navbar-link ${activePage==='home'?'active':''}">Store</a>
      ${isLoggedIn ? `<a href="orders.html" class="navbar-link ${activePage==='orders'?'active':''}">My Orders</a>` : ''}
      ${isAdmin ? `<a href="admin.html" class="navbar-link ${activePage==='admin'?'active':''}">Dashboard</a>` : ''}
    </div>
    <div class="navbar-right">
      ${isLoggedIn ? `
        <button class="cart-btn" onclick="window.location.href='cart.html'">
          <span class="material-symbols-outlined" style="font-size:18px">shopping_cart</span>
          <span class="cart-count" id="cart-count">0</span>
        </button>
        <button class="btn-ghost" onclick="auth.logout()">Logout</button>
      ` : `
        <a href="login.html"><button class="btn-ghost">Login</button></a>
        <a href="register.html"><button class="btn-primary">Register</button></a>
      `}
    </div>
  `;
  updateCartCount();
};

// Ambient background
const renderAmbient = () => {
  const el = document.createElement('div');
  el.className = 'ambient-bg';
  el.innerHTML = `
    <div class="ambient-blob" style="width:50%;height:50%;top:-10%;left:-10%;background:rgba(37,99,235,0.08)"></div>
    <div class="ambient-blob" style="width:40%;height:40%;bottom:-10%;right:-10%;background:rgba(131,67,244,0.08)"></div>
  `;
  document.body.prepend(el);
};
