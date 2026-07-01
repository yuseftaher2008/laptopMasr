// js/login.js
import { api, decodeToken } from "./api.js";
import { setUser, showToast } from "./state.js";
import { renderNav } from "./nav.js";

renderNav("login");

let mode = "login"; // or "register"

const form = document.getElementById("auth-form");
const registerFields = document.getElementById("register-fields");
const authTitle = document.getElementById("auth-title");
const submitBtn = document.getElementById("submit-btn");
const switchText = document.getElementById("switch-text");
const switchLink = document.getElementById("switch-link");
const errorText = document.getElementById("error-text");

function setError(msg) {
  if (msg) {
    errorText.textContent = msg;
    errorText.style.display = "block";
  } else {
    errorText.style.display = "none";
  }
}

switchLink.addEventListener("click", () => {
  mode = mode === "login" ? "register" : "login";
  setError(null);
  if (mode === "register") {
    authTitle.textContent = "Create an account";
    registerFields.style.display = "block";
    submitBtn.textContent = "Register";
    switchText.textContent = "Already have an account?";
    switchLink.textContent = "Sign in";
  } else {
    authTitle.textContent = "Sign in";
    registerFields.style.display = "none";
    submitBtn.textContent = "Sign in";
    switchText.textContent = "No account yet?";
    switchLink.textContent = "Register";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError(null);

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (mode === "login") {
    if (!username || !password) return setError("Username and password are required.");
    try {
      const { token } = await api.login({ username, password });
      const decoded = decodeToken(token);
      setUser({ token, username: decoded?.username || username, role: decoded?.role || "customer" });
      showToast(`Signed in as ${username}`);
      window.location.href = "index.html";
    } catch (err) {
      setError(err.message);
    }
  } else {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    if (!name || !username || !email || !password) return setError("All fields are required.");
    try {
      await api.register({ name, username, email, password });
      showToast("Account created — signing you in…");
      const { token } = await api.login({ username, password });
      const decoded = decodeToken(token);
      setUser({ token, username: decoded?.username || username, role: decoded?.role || "customer" });
      window.location.href = "index.html";
    } catch (err) {
      setError(err.message);
    }
  }
});
