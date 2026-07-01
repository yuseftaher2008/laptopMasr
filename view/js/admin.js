// js/admin.js
import { api } from "./api.js";
import { getUser, showToast } from "./state.js";
import { renderNav } from "./nav.js";

renderNav("admin");

const root = document.getElementById("admin-root");
const user = getUser();

let products = [];
let currentTab = "products";

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function renderGate() {
  root.innerHTML = `
    <div class="state-msg">
      Admin access required.
      <div style="margin-top:16px"><a href="login.html"><button class="btn">Sign in</button></a></div>
    </div>
  `;
}

function renderShell() {
  root.innerHTML = `
    <div class="admin-header">
      <h1 class="admin-title">Admin dashboard</h1>
      <button class="btn" id="new-product-btn">+ New product</button>
    </div>
    <div class="admin-tabs">
      <div class="admin-tab ${currentTab === "products" ? "active" : ""}" data-tab="products">Products</div>
      <div class="admin-tab ${currentTab === "orders" ? "active" : ""}" data-tab="orders">Orders</div>
    </div>
    <div id="tab-content"></div>
  `;

  root.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentTab = tab.dataset.tab;
      renderShell();
      renderTabContent();
    });
  });

  document.getElementById("new-product-btn").addEventListener("click", () => openModal(null));

  renderTabContent();
}

function renderTabContent() {
  const content = document.getElementById("tab-content");
  if (currentTab === "orders") {
    content.innerHTML = `<div class="empty-orders">Orders will show up here once checkout writes to the orders table.</div>`;
    return;
  }

  content.innerHTML = `
    <div class="admin-table">
      <div class="admin-row head">
        <span>Name</span><span>Brand</span><span>Price</span><span>Stock</span><span></span>
      </div>
      <div id="product-rows"></div>
    </div>
  `;
  renderProductRows();
}

function renderProductRows() {
  const rowsEl = document.getElementById("product-rows");
  if (!rowsEl) return;

  if (products.length === 0) {
    rowsEl.innerHTML = `<div class="admin-row"><span style="color:var(--text-faint)">No products yet.</span></div>`;
    return;
  }

  rowsEl.innerHTML = products
    .map(
      (p) => `
    <div class="admin-row" data-id="${p.id}">
      <span>${escapeHtml(p.name)}</span>
      <span class="muted">${escapeHtml(p.brand)}</span>
      <span class="mono">$${p.price}</span>
      <span class="mono ${p.stock === 0 ? "stock-zero" : "muted"}">${p.stock}</span>
      <div class="row-actions">
        <button class="edit" data-edit="${p.id}">Edit</button>
        <button class="delete" data-delete="${p.id}">Delete</button>
      </div>
    </div>
  `
    )
    .join("");

  rowsEl.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = products.find((p) => p.id === Number(btn.dataset.edit));
      openModal(product);
    });
  });

  rowsEl.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.delete);
      if (!confirm("Delete this product?")) return;
      try {
        await api.deleteProduct(id);
        products = products.filter((p) => p.id !== id);
        showToast("Product deleted");
        renderProductRows();
      } catch (err) {
        showToast(err.message);
      }
    });
  });
}

const FIELD_DEFS = [
  { key: "name", label: "Name", required: true },
  { key: "brand", label: "Brand", required: true },
  { key: "price", label: "Price (USD)", type: "number", required: true },
  { key: "cpu", label: "CPU" },
  { key: "ram", label: "RAM (GB)", type: "number", row: "specs1" },
  { key: "storage", label: "Storage (GB)", type: "number", row: "specs1" },
  { key: "gpu", label: "GPU" },
  { key: "screen_size", label: "Screen size", type: "number", row: "specs2" },
  { key: "stock", label: "Stock", type: "number", row: "specs2" },
  { key: "tags", label: "Tags (comma-separated)" },
  { key: "description", label: "Description" },
  { key: "image_url", label: "Image URL" },
];

function openModal(product) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const fieldsHtml = (() => {
    let html = "";
    const rows = {};
    FIELD_DEFS.forEach((f) => {
      const value = product ? product[f.key] ?? "" : "";
      const inputHtml = `<input type="${f.type || "text"}" id="field-${f.key}" value="${escapeHtml(String(value))}" ${f.required ? "required" : ""} />`;
      const fieldHtml = `<div class="field"><label>${f.label}</label>${inputHtml}</div>`;
      if (f.row) {
        rows[f.row] = (rows[f.row] || "") + fieldHtml;
      } else {
        html += fieldHtml;
      }
    });
    // insert paired rows in original order roughly (specs1 after cpu, specs2 after gpu)
    return html.replace(
      '<div class="field"><label>CPU</label>',
      `<div class="field-row">${rows.specs1 || ""}</div><div class="field"><label>CPU</label>`
    ).replace(
      '<div class="field"><label>Tags',
      `<div class="field-row">${rows.specs2 || ""}</div><div class="field"><label>Tags`
    );
  })();

  overlay.innerHTML = `
    <div class="modal">
      <h2>${product ? "Edit product" : "New product"}</h2>
      <form id="product-form">
        ${fieldsHtml}
        <p class="error-text" id="modal-error" style="display:none"></p>
        <div class="modal-actions">
          <button type="submit" class="btn btn-full">Save</button>
          <button type="button" class="btn btn-secondary btn-full" id="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.getElementById("cancel-btn").addEventListener("click", () => overlay.remove());

  document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("modal-error");
    errorEl.style.display = "none";

    const payload = {};
    FIELD_DEFS.forEach((f) => {
      const raw = document.getElementById(`field-${f.key}`).value;
      payload[f.key] = f.type === "number" && raw !== "" ? Number(raw) : raw;
    });

    try {
      if (product) {
        const updated = await api.updateProduct(product.id, payload);
        products = products.map((p) => (p.id === product.id ? updated : p));
        showToast("Product updated");
      } else {
        const created = await api.createProduct(payload);
        products.push(created);
        showToast("Product created");
      }
      overlay.remove();
      renderProductRows();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = "block";
    }
  });
}

async function init() {
  if (!user || user.role !== "admin") {
    renderGate();
    return;
  }
  renderShell();
  try {
    products = await api.getProducts({});
    renderProductRows();
  } catch (err) {
    showToast(`Couldn't load products: ${err.message}`);
  }
}

init();
