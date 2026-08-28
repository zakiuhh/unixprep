/* ===================== [CONFIG] =====================
   All card content (tests + beyond) now lives as static HTML
   directly in index.html — edit it there to add, remove, or
   re-word a card. REPO_URL below is only used to point the
   nav/hero/footer "View on GitHub" buttons at the repo root. */
const REPO_URL = "https://github.com/zakiuhh/unixprep";

// Point the nav/hero/footer GitHub buttons at the repo root
// (guarded — not every page has all three, e.g. about.html has no hero)
["repo-link-nav", "repo-link-hero", "repo-link-footer"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = REPO_URL;
});

/* ===================== [NAV-JS] =====================
   Mobile hamburger: toggles the .nav-links list open/closed
   and flips aria-expanded (the CSS uses that to animate the
   icon into an X). Also closes the menu after a link is tapped. */
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ===================== [THEME-JS] =====================
   Reads saved preference from localStorage, falls back to
   the visitor's OS-level light/dark setting, then persists
   whatever they pick via the toggle button. */
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggleBtn.setAttribute("aria-pressed", theme === "dark");
}

const saved = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(saved || (prefersDark ? "dark" : "light"));

toggleBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});
