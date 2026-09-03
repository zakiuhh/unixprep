/* ===================== [CONFIG] =====================
   All card content (tests + beyond) now lives as static HTML
   directly in index.html — edit it there to add, remove, or
   re-word a card. REPO_URL below points the nav's icon-only
   GitHub button, the homepage hero's primary button, and the
   "Open the Repository" button on download.html/contribute.html
   at the repo root. The footer link is intentionally NOT wired
   to this anymore — it goes to pages/contribute.html instead. */
const REPO_URL = "https://github.com/zakiuhh/unixprep";

// Point the nav/hero/guide-page GitHub buttons at the repo root
// (guarded — not every page has all three, e.g. about.html has none of these)
["repo-link-nav", "repo-link-hero", "repo-link-guide"].forEach(id => {
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
   Light is the default for every first-time visitor, regardless of
   their OS-level dark/light setting — only an explicit click on the
   toggle switches to dark, and that choice is what gets remembered
   via localStorage for next time. Also keeps the browser chrome's
   theme-color meta tag in sync with whichever theme is active. */
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggleBtn.setAttribute("aria-pressed", theme === "dark");
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", theme === "dark" ? "#15171B" : "#F1F3EF");
  }
}

const saved = localStorage.getItem("theme");
applyTheme(saved || "light");

toggleBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});
