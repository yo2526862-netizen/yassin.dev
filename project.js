// Project detail pages are rendered locally from the query string; no backend is needed.
const projectData = {
  atmos: {
    number: "001", category: "WEB APP CONCEPT", title: "Atmos Dashboard", subtitle: "A calm, focused dashboard concept for useful daily information.", year: "2026", mark: "A/",
    overview: "Atmos explores how a dashboard can make everyday information feel clear instead of overwhelming. The current portfolio card is a visual concept, not a live weather service.",
    problem: "Dashboards can become noisy when every metric competes for attention. This concept gives one primary status visual room to breathe and groups supporting information into a consistent layout.",
    features: ["A clear visual hierarchy for the primary status", "Responsive card-based layout concept", "Weather-inspired visual language and status labels", "A foundation for adding a real data API later"],
    stack: ["HTML5", "CSS3", "JavaScript", "Responsive UI"],
    next: "Connect a trusted weather API, add loading and error states, and let visitors choose their city before calling this a functional weather dashboard."
  },
  "neon-runner": {
    number: "002", category: "MINI GAME CONCEPT", title: "Neon Runner", subtitle: "An arcade-inspired visual concept built around speed, contrast, and motion.", year: "2026", mark: "NR",
    overview: "Neon Runner is a game UI concept with a retro-futuristic arcade mood. The current portfolio artwork is illustrative; it does not represent a fully playable game yet.",
    problem: "A small arcade game needs to communicate the player, obstacles, and score instantly. The design tests a limited visual system so gameplay elements can stay readable while the screen feels energetic.",
    features: ["Arcade-style title and score treatment", "High-contrast player and obstacle visuals", "Canvas-friendly concept for future animation", "A clear direction for start, pause, and game-over states"],
    stack: ["JavaScript", "Canvas API", "CSS Animation", "Game UI"],
    next: "Build the game loop, keyboard controls, collision detection, scoring, restart behavior, and mobile touch controls before publishing it as a playable game."
  },
  orbit: {
    number: "003", category: "UI CONCEPT", title: "Orbit Assistant", subtitle: "A futuristic chat interface concept designed to feel clear, friendly, and focused.", year: "2026", mark: "OAI",
    overview: "Orbit Assistant explores a modern chat layout with message bubbles, a status header, and a compact composer. It is a front-end design concept and is not connected to an AI model.",
    problem: "Chat interfaces need to keep the conversation readable and the next action obvious. Orbit uses spacing, message contrast, and a restrained set of accents to organize the conversation.",
    features: ["Distinct visual styles for assistant and user messages", "Compact conversation header and online status", "Input composer concept with a send affordance", "A layout that can later connect to a real backend"],
    stack: ["HTML5", "CSS3", "JavaScript", "UI Design"],
    next: "Add a working message composer, accessible loading/error states, and a secure server-side integration with an AI provider. Never put private API keys in browser JavaScript."
  }
};

const content = document.getElementById("project-content");
const key = new URLSearchParams(window.location.search).get("project") || "";
const project = projectData[key];
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

if (!project) {
  content.innerHTML = `<section class="detail-missing panel"><span class="detail-eyebrow">404 / PROJECT NOT FOUND</span><h1>This project isn't in the index.</h1><p>Choose one of the available concept projects from the portfolio page.</p><a class="button button-primary" href="index.html#projects">BACK TO PROJECTS <span>↗</span></a></section>`;
} else {
  document.title = `${project.title} // Yassin.dev`;
  const list = (items) => items.map((item) => `<li>${escapeHTML(item)}</li>`).join("");
  const tags = project.stack.map((item) => `<span>${escapeHTML(item)}</span>`).join("");
  content.innerHTML = `
    <div class="detail-eyebrow">PROJECT / ${escapeHTML(project.number)} — ${escapeHTML(project.category)}</div>
    <h1 class="detail-title">${escapeHTML(project.title)}<span class="gradient-text">.</span></h1>
    <p class="detail-lead">${escapeHTML(project.subtitle)}</p>
    <div class="detail-meta"><span class="detail-pill">YEAR / ${escapeHTML(project.year)}</span><span class="detail-pill">STATUS / CONCEPT</span><span class="detail-pill">BY / YASSIN.DEV</span></div>
    <div class="detail-hero-art" aria-label="Abstract project artwork"><span class="detail-art-mark">${escapeHTML(project.mark)}</span></div>
    <div class="detail-content-grid">
      <div class="detail-panel panel"><span class="section-index">01 / OVERVIEW</span><h2>What is it?</h2><p>${escapeHTML(project.overview)}</p><h2 style="margin-top:26px">The design challenge</h2><p>${escapeHTML(project.problem)}</p><h2 style="margin-top:26px">Concept features</h2><ul>${list(project.features)}</ul><div class="detail-note"><strong>Honest status:</strong> this is a portfolio concept. The features above describe the design direction and future plan, not a claim that every feature is already implemented.</div></div>
      <aside class="detail-panel panel"><span class="section-index">02 / STACK</span><h2>Technologies</h2><p>The tools planned or represented in this concept.</p><div class="detail-stack">${tags}</div><h2 style="margin-top:28px">Next iteration</h2><p>${escapeHTML(project.next)}</p><div class="detail-actions"><a class="button button-primary" href="index.html#contact">DISCUSS THIS IDEA <span>↗</span></a><a class="button button-ghost" href="index.html#projects">ALL PROJECTS</a></div></aside>
    </div>`;
}

// Reuse the portfolio's theme preference on the detail page.
const themeToggle = document.getElementById("theme-toggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const light = theme === "light";
  themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.setAttribute("aria-pressed", String(light));
  themeToggle.querySelector(".theme-icon").textContent = light ? "☾" : "☼";
  themeToggle.querySelector(".theme-label").textContent = light ? "DARK" : "LIGHT";
  try { localStorage.setItem("yassin-theme", theme); } catch {}
}
let savedTheme = null;
try { savedTheme = localStorage.getItem("yassin-theme"); } catch {}
applyTheme(savedTheme === "light" ? "light" : "dark");
themeToggle.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));

const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");
let width = 0, height = 0, drops = [];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drops = Array.from({ length: Math.ceil(width / 18) }, () => Math.random() * -40);
}
resizeCanvas(); window.addEventListener("resize", resizeCanvas);
function drawMatrix() {
  ctx.fillStyle = "rgba(7,9,16,.14)"; ctx.fillRect(0, 0, width, height); ctx.font = "11px monospace";
  drops.forEach((y, i) => { ctx.fillStyle = i % 5 === 0 ? "rgba(167,139,250,.5)" : "rgba(84,244,255,.4)"; ctx.fillText("01<>/{}"[Math.floor(Math.random() * 7)], i * 18, y * 18); if (y * 18 > height && Math.random() > .975) drops[i] = 0; drops[i] += .45; });
  if (!reducedMotion) requestAnimationFrame(drawMatrix);
}
if (!reducedMotion) drawMatrix(); else { ctx.fillStyle = "#070910"; ctx.fillRect(0, 0, width, height); }
const progress = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => { const max = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`; }, { passive: true });
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("back-top").addEventListener("click", (event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }); });
