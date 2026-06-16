// js/nav.js
import { getCartCount, getUser, logout } from "./state.js";

export function renderNav(activePage) {
  const user = getUser();
  const cartCount = getCartCount();

  const navHtml = `
    <div class="nav">
      <div class="container nav-inner">
        <a href="index.html" class="logo"><span>▣</span> compile&nbsp;/&nbsp;store</a>
        <div class="nav-links">
          <a href="index.html" class="nav-link ${activePage === "home" ? "active" : ""}">Browse</a>
          ${user?.role === "admin" ? `<a href="admin.html" class="nav-link ${activePage === "admin" ? "active" : ""}">Admin</a>` : ""}
          <a href="cart.html" class="nav-link ${activePage === "cart" ? "active" : ""}">
            Cart${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ""}
          </a>
          ${
            user
              ? `<span class="nav-user">${user.username}</span><button class="btn btn-ghost" id="logout-btn">Sign out</button>`
              : `<a href="login.html"><button class="btn btn-secondary">Sign in</button></a>`
          }
        </div>
      </div>
    </div>
  `;

  document.getElementById("nav-root").innerHTML = navHtml;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}
