// js/cart.js
import { getCart, updateCartQty, removeFromCart, getCartTotal, showToast } from "./state.js";
import { renderNav } from "./nav.js";

renderNav("cart");

const root = document.getElementById("cart-root");

// Set this to your store's WhatsApp number, country code first, digits only
// e.g. "201234567890" for an Egyptian number. Leave blank to let WhatsApp
// ask the user to pick a contact instead.
const WHATSAPP_NUMBER = "201061218980";

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function render() {
  const cart = getCart();

  if (cart.length === 0) {
    root.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty.</p>
        <a href="index.html"><button class="btn">Browse laptops</button></a>
      </div>
    `;
    return;
  }

  const total = getCartTotal();

  root.innerHTML = `
    <h1 class="cart-title">Your cart</h1>
    <div class="cart-items">
      ${cart
        .map(
          (item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-thumb"></div>
          <div class="cart-info">
            <div class="name">${escapeHtml(item.name)}</div>
            <div class="unit">$${item.price} each</div>
          </div>
          <select class="qty-select" data-id="${item.id}">
            ${Array.from({ length: Math.min(item.stock || 6, 6) }, (_, i) => i + 1)
              .map((n) => `<option value="${n}" ${n === item.qty ? "selected" : ""}>${n}</option>`)
              .join("")}
          </select>
          <div class="cart-line-total price">$${(item.price * item.qty).toLocaleString()}</div>
          <button class="remove-btn" data-remove="${item.id}" aria-label="Remove item">×</button>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="cart-summary">
      <span>Total</span>
      <span class="price">$${total.toLocaleString()}</span>
    </div>
    <button class="btn btn-full" id="checkout-btn">Checkout via WhatsApp</button>
    <p class="checkout-note">We'll confirm your order and arrange payment over WhatsApp.</p>
  `;

  root.querySelectorAll(".qty-select").forEach((sel) => {
    sel.addEventListener("change", () => {
      updateCartQty(Number(sel.dataset.id), Number(sel.value));
      render();
      renderNav("cart");
    });
  });

  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(Number(btn.dataset.remove));
      showToast("Removed from cart");
      render();
      renderNav("cart");
    });
  });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    const lines = cart.map((i) => `${i.qty}x ${i.name} ($${i.price * i.qty})`).join("\n");
    const message = `Order request:\n${lines}\n\nTotal: $${total.toLocaleString()}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    showToast("Opening WhatsApp checkout…");
    window.open(url, "_blank");
  });
}

render();
