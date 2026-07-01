// js/home.js
import { api } from "./api.js";
import { addToCart, showToast } from "./state.js";
import { renderNav } from "./nav.js";

renderNav("home");

const grid = document.getElementById("product-grid");
const resultCount = document.getElementById("result-count");
const brandSelect = document.getElementById("filter-brand");
const tagSelect = document.getElementById("filter-tag");
const minInput = document.getElementById("filter-min");
const maxInput = document.getElementById("filter-max");
const sortSelect = document.getElementById("sort-select");

let allProducts = [];

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function renderProducts(products) {
  if (products.length === 0) {
    grid.innerHTML = `<div class="empty-state">No machines match those filters. Try widening your range.</div>`;
    return;
  }

  grid.innerHTML = products
    .map((p) => {
      const tags = (p.tags || "").split(",").filter(Boolean).slice(0, 3);
      const outOfStock = p.stock === 0;
      return `
        <div class="card" data-id="${p.id}">
          <div class="card-thumb">${p.screen_size ? p.screen_size + "″" : ""}</div>
          <div>
            <div class="card-brand">${escapeHtml(p.brand)}</div>
            <div class="card-name">${escapeHtml(p.name)}</div>
          </div>
          <div class="card-specs">
            <span>${escapeHtml(p.cpu || "")}</span>
            <span class="sep">·</span>
            <span>${p.ram ?? "-"}GB</span>
            <span class="sep">·</span>
            <span>${p.storage ?? "-"}GB</span>
          </div>
          <div class="card-tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
          <div class="card-footer">
            <span class="price">$${Number(p.price).toLocaleString()}</span>
            ${
              outOfStock
                ? `<span class="oos">Out of stock</span>`
                : `<button class="add-btn" data-add="${p.id}">Add to cart</button>`
            }
          </div>
        </div>
      `;
    })
    .join("");

  // card click -> product detail page
  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-add]")) return; // don't navigate when clicking "Add to cart"
      window.location.href = `product.html?id=${card.dataset.id}`;
    });
  });

  // add-to-cart buttons
  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = allProducts.find((p) => p.id === Number(btn.dataset.add));
      addToCart(product, 1);
      showToast(`Added ${product.name} to cart`);
      renderNav("home"); // refresh cart count badge
    });
  });
}

function applyClientSort(products) {
  const sorted = [...products];
  if (sortSelect.value === "price_asc") sorted.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "price_desc") sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

async function loadProducts() {
  resultCount.textContent = "Loading products…";
  try {
    const filters = {
      brand: brandSelect.value,
      tag: tagSelect.value,
      minPrice: minInput.value,
      maxPrice: maxInput.value,
    };
    const products = await api.getProducts(filters);
    allProducts = products;

    // populate brand filter once, from the unfiltered first load
    if (brandSelect.options.length === 1) {
      const brands = [...new Set(products.map((p) => p.brand))];
      brands.forEach((b) => {
        const opt = document.createElement("option");
        opt.value = b;
        opt.textContent = b;
        brandSelect.appendChild(opt);
      });
    }

    const sorted = applyClientSort(products);
    resultCount.textContent = `${sorted.length} machine${sorted.length === 1 ? "" : "s"} found`;
    renderProducts(sorted);
  } catch (err) {
    resultCount.textContent = "";
    grid.innerHTML = `<div class="empty-state">Couldn't load products: ${escapeHtml(err.message)}</div>`;
  }
}

[brandSelect, tagSelect, sortSelect].forEach((el) => el.addEventListener("change", loadProducts));
[minInput, maxInput].forEach((el) => el.addEventListener("input", debounce(loadProducts, 400)));

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

loadProducts();
