// js/state.js
// Tiny shared state layer. Cart lives in localStorage so it survives
// page navigation (since this is plain multi-page HTML, not an SPA).

const CART_KEY = "cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      qty,
    });
  }
  saveCart(cart);
}

export function updateCartQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  } else {
    cart = cart.map((i) => (i.id === id ? { ...i, qty } : i));
  }
  saveCart(cart);
}

export function removeFromCart(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

export function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.qty * i.price, 0);
}

export function clearCart() {
  saveCart([]);
}

// ---------- auth ----------

export function getUser() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  if (!token) return null;
  return { token, username, role };
}

export function setUser({ token, username, role }) {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  localStorage.setItem("role", role);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  window.location.href = "index.html";
}

// ---------- toast ----------

export function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
