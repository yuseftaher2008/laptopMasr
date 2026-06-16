// js/product.js
import { api } from "./api.js";
import { addToCart, showToast } from "./state.js";
import { renderNav } from "./nav.js";

renderNav("home");

const root = document.getElementById("product-root");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderProduct(p) {
  const specs = [
    ["Brand", p.brand],
    ["CPU", p.cpu],
    ["RAM", p.ram ? `${p.ram} GB` : "-"],
    ["Storage", p.storage ? `${p.storage} GB` : "-"],
    ["GPU", p.gpu],
    ["Display", p.screen_size ? `${p.screen_size}″` : "-"],
    ["Stock", p.stock > 0 ? `${p.stock} units` : "Out of stock"],
  ];
  const tags = (p.tags || "").split(",").filter(Boolean);
  const maxQty = Math.min(p.stock, 6);

  root.innerHTML = `
    <a href="index.html" class="back-link">← Back to browse</a>
    <div class="product-detail">
      <div class="product-image">${p.screen_size ? p.screen_size + "″ display" : ""}</div>
      <div>
        <div class="product-brand">${escapeHtml(p.brand)}</div>
        <h1 class="product-name">${escapeHtml(p.name)}</h1>
        <span class="price">$${Number(p.price).toLocaleString()}</span>
        <p class="product-desc">${escapeHtml(p.description || "")}</p>
        <div class="card-tags" style="margin-bottom:24px">
          ${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
        </div>
        <div class="spec-table">
          ${specs
            .map(
              ([k, v]) => `
            <div class="spec-row"><span class="k">${k}</span><span class="v">${escapeHtml(String(v))}</span></div>
          `
            )
            .join("")}
        </div>
        ${
          p.stock > 0
            ? `
          <div class="qty-add">
            <select id="qty-select">
              ${Array.from({ length: maxQty }, (_, i) => i + 1)
                .map((n) => `<option value="${n}">${n}</option>`)
                .join("")}
            </select>
            <button class="btn btn-full" id="add-to-cart-btn">Add to cart</button>
          </div>
        `
            : `<button class="btn btn-full" disabled>Out of stock</button>`
        }
      </div>
    </div>
  `;

  const addBtn = document.getElementById("add-to-cart-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const qty = Number(document.getElementById("qty-select").value);
      addToCart(p, qty);
      showToast(`Added ${p.name} to cart`);
      renderNav("home");
    });
  }
}

async function load() {
  const id = getProductId();
  if (!id) {
    root.innerHTML = `<div class="state-msg error">No product specified.</div>`;
    return;
  }
  try {
    const product = await api.getProduct(id);
    renderProduct(product);
  } catch (err) {
    root.innerHTML = `
      <div class="state-msg error">Product not found.</div>
      <div style="text-align:center"><a href="index.html"><button class="btn">Back to browse</button></a></div>
    `;
  }
}

load();
