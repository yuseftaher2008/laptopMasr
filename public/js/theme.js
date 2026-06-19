// js/theme.js
// Defaults to system preference, but remembers a manual override in localStorage.

const STORAGE_KEY = "theme-override";

function getSystemPreference() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getActiveTheme() {
  const override = localStorage.getItem(STORAGE_KEY);
  return override || getSystemPreference();
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function initTheme() {
  applyTheme(getActiveTheme());

  // keep in sync if the user changes their OS theme and hasn't overridden manually
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
}

export function toggleTheme() {
  const current = getActiveTheme();
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
  return next;
}

export function getCurrentTheme() {
  return getActiveTheme();
}
