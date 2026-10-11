// Yassin.dev Portfolio — interactions with no external JavaScript libraries.
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Matrix-style background, with reduced-motion and small-screen considerations.
const canvas = $("#matrix-canvas");
const ctx = canvas.getContext("2d");
let drops = [];
let matrixWidth = 0;
let matrixHeight = 0;
const glyphs = "01アイウエオカキクケコ<>/{}[]";

function resizeMatrix() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  matrixWidth = window.innerWidth;
  matrixHeight = window.innerHeight;
  canvas.width = Math.floor(matrixWidth * dpr);
  canvas.height = Math.floor(matrixHeight * dpr);
  canvas.style.width = `${matrixWidth}px`;
  canvas.style.height = `${matrixHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const columns = Math.ceil(matrixWidth / 18);
  drops = Array.from({ length: columns }, () => Math.random() * -50);
}
resizeMatrix();
window.addEventListener("resize", resizeMatrix);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reading progress indicator.
const progressBar = $("#scroll-progress");
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();
function drawMatrix() {
  ctx.fillStyle = "rgba(7, 9, 16, 0.12)";
  ctx.fillRect(0, 0, matrixWidth, matrixHeight);
  ctx.font = "11px monospace";
  drops.forEach((y, i) => {
    const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
    ctx.fillStyle = i % 5 === 0 ? "rgba(167,139,250,.65)" : "rgba(84,244,255,.55)";
    ctx.fillText(glyph, i * 18, y * 18);
    if (y * 18 > matrixHeight && Math.random() > 0.975) drops[i] = 0;
    drops[i] += 0.45;
  });
  if (!reducedMotion) requestAnimationFrame(drawMatrix);
}
if (!reducedMotion) drawMatrix();
else {
  ctx.fillStyle = "#070910";
  ctx.fillRect(0, 0, matrixWidth, matrixHeight);
}

// Cursor glow follows the pointer on devices that have a precise pointer.
const glow = $(".cursor-glow");
window.addEventListener("pointermove", (event) => {
  if (event.pointerType === "mouse") {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
});

// Mobile navigation.
const menuToggle = $("#menu-toggle");
const nav = $("#nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
$$(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Reveal elements when they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((element) => revealObserver.observe(element));

// Live local clock.
function updateClock() {
  const clock = $("#live-clock");
  clock.textContent = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).format(new Date());
}
updateClock();
setInterval(updateClock, 1000);
$("#year").textContent = new Date().getFullYear();

// Typewriter text cycles through a few short phrases.
const roleText = $("#role-text");
const phrases = ["digital experiences", "creative interfaces", "ideas into reality"];
let phraseIndex = 0;
let charIndex = phrases[0].length;
let deleting = true;
function typeRole() {
  if (reducedMotion) return;
  const phrase = phrases[phraseIndex];
  charIndex += deleting ? -1 : 1;
  roleText.textContent = phrase.slice(0, charIndex);
  let delay = deleting ? 42 : 75;
  if (charIndex <= 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 350;
  } else if (charIndex >= phrases[phraseIndex].length) {
    deleting = true;
    delay = 1450;
  }
  setTimeout(typeRole, delay);
}
setTimeout(typeRole, 1800);

// Contact form: prepare an email in the visitor's default mail application.
// Replace the address below with your own email before publishing.
const CONTACT_EMAIL = "your-email@example.com"; // Replace this with your real email before publishing.
$("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  $("#form-note").textContent = "Opening your email app… If nothing opens, check that a default mail app is configured.";
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

// Active navigation item updates as sections become visible.
const sections = $$("main section[id]");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      $$(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach((section) => sectionObserver.observe(section));

// Escape closes the mobile navigation for keyboard users.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  }
});


// Theme switcher: remembers the visitor's preference on this device when storage is available.
const themeToggle = $("#theme-toggle");
const savedTheme = (() => {
  try { return localStorage.getItem("yassin-theme"); } catch { return null; }
})();
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isLight = theme === "light";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.setAttribute("aria-pressed", String(isLight));
  $(".theme-icon", themeToggle).textContent = isLight ? "☾" : "☼";
  $(".theme-label", themeToggle).textContent = isLight ? "DARK" : "LIGHT";
  try { localStorage.setItem("yassin-theme", theme); } catch { /* Private browsing may block storage. */ }
}
applyTheme(savedTheme === "light" ? "light" : "dark");
themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
});

// Search and filter the project cards without reloading the page.
const projectSearch = $("#project-search");
const projectCards = $$(".project-card", $("#projects-grid"));
const filterButtons = $$(".filter-chip");
const filterStatus = $("#filter-status");
let activeProjectFilter = "all";
function updateProjects() {
  const query = projectSearch.value.trim().toLowerCase();
  let visibleCount = 0;
  projectCards.forEach((card) => {
    const matchesCategory = activeProjectFilter === "all" || card.dataset.category === activeProjectFilter;
    const matchesSearch = !query || `${card.dataset.search} ${card.innerText}`.toLowerCase().includes(query);
    const visible = matchesCategory && matchesSearch;
    card.hidden = !visible;
    if (visible) visibleCount++;
  });
  filterStatus.textContent = visibleCount === 0
    ? "No projects match your search. Try another keyword."
    : `Showing ${visibleCount} project${visibleCount === 1 ? "" : "s"}${activeProjectFilter === "all" ? "" : ` in ${activeProjectFilter.toUpperCase()}`}`;
}
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeProjectFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    updateProjects();
  });
});
projectSearch.addEventListener("input", updateProjects);
// Press / to focus project search, unless the visitor is already typing in a field.
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const typing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
  if (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    projectSearch.focus();
  }
});

// Floating back-to-top control appears after the visitor scrolls.
const backToTop = $("#back-to-top");
function updateBackToTop() {
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
}
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));


// V3 interactive terminal: a safe command simulator, not a real system shell.
(() => {
  const form = document.getElementById("terminal-form");
  if (!form) return;
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");
  const clearButton = document.getElementById("terminal-clear");
  const history = [];
  let historyIndex = 0;

  const commands = {
    help: { title: "AVAILABLE COMMANDS", lines: [
      "help                 Show this command list",
      "about                Learn about Yassin",
      "skills               List the current toolkit",
      "projects             List portfolio concept projects",
      "open <project>       Open a project detail page",
      "contact              Jump to the contact section",
      "date                 Show today's local date",
      "whoami               Print the current profile",
      "echo <text>          Print your text",
      "clear                Clear terminal output"
    ] },
    about: { title: "ABOUT YASSIN.DEV", lines: ["A curious developer-in-progress based in Egypt.", "Interested in web development, creative interfaces, and learning by building."] },
    skills: { title: "TOOLKIT", lines: ["HTML5       Structure & accessibility", "CSS3        Layout, visual design & motion", "JavaScript  Browser interaction and logic", "Git/GitHub  Version control — growing in practice"] },
    projects: { title: "PORTFOLIO PROJECTS", lines: ["atmos        Atmos Dashboard — web app concept", "neon-runner  Neon Runner — mini game concept", "orbit        Orbit Assistant — UI concept", "Tip: open <project> to see its detail page."] },
    whoami: { title: "IDENTITY", lines: ["visitor@yassin.dev", "Role: learner / creative developer", "Mode: build, learn, repeat"] }
  };

  function addLine(text, className = "") {
    const p = document.createElement("p");
    if (className) p.className = className;
    p.textContent = text;
    output.appendChild(p);
  }
  function addResult(title, lines) {
    addLine(title, "terminal-result-title");
    lines.forEach((line) => addLine(line));
  }
  function scrollOutput() { output.scrollTop = output.scrollHeight; }
  function clearOutput() {
    output.replaceChildren();
    addLine("YASSIN.DEV SHELL v1.0.0 — local demo, no server connection.", "terminal-welcome");
    addLine("Type help to list available commands.");
  }
  function runCommand(raw) {
    const commandLine = raw.trim();
    if (!commandLine) return;
    addLine(`visitor@yassin:~$ ${commandLine}`, "terminal-command");
    const parts = commandLine.split(/\s+/);
    const command = parts.shift().toLowerCase();
    const argument = parts.join(" ");

    if (command === "clear") { clearOutput(); return; }
    if (command === "date") { addResult("LOCAL DATE", [new Date().toLocaleString()]); return; }
    if (command === "echo") { addLine(argument || "(no text provided)"); return; }
    if (command === "contact") { addLine("Opening the contact section…", "terminal-muted"); document.getElementById("contact")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }); return; }
    if (command === "open") {
      const aliases = { atmos: "atmos", "atmos-dashboard": "atmos", "neon-runner": "neon-runner", neon: "neon-runner", orbit: "orbit", "orbit-assistant": "orbit" };
      const project = aliases[argument.toLowerCase()];
      if (!project) { addLine("Usage: open atmos | neon-runner | orbit", "terminal-error"); return; }
      addLine(`Opening ${project} details…`, "terminal-muted");
      window.location.href = `project.html?project=${encodeURIComponent(project)}`;
      return;
    }
    if (commands[command]) { addResult(commands[command].title, commands[command].lines); return; }
    addLine(`Command not found: ${command}. Type help to see available commands.`, "terminal-error");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value;
    if (value.trim()) { history.push(value.trim()); historyIndex = history.length; runCommand(value); }
    input.value = "";
    scrollOutput();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") { event.preventDefault(); if (history.length) { historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex] || ""; } }
    if (event.key === "ArrowDown") { event.preventDefault(); historyIndex = Math.min(history.length, historyIndex + 1); input.value = history[historyIndex] || ""; }
    if (event.key === "Escape") input.value = "";
  });
  clearButton.addEventListener("click", () => { clearOutput(); input.focus(); });
  document.getElementById("interactive-terminal")?.addEventListener("click", (event) => { if (!event.target.closest("button")) input.focus(); });
})();


// V4 GitHub integration: public GitHub REST API; no token is required.
// Replace YOUR_GITHUB_USERNAME with the username from your github.com/USERNAME URL.
(() => {
  const GITHUB_USERNAME = "yo2526862-netizen";
  const section = document.getElementById("github");
  if (!section) return;

  const status = document.getElementById("github-status");
  const refreshButton = document.getElementById("github-refresh");
  const reposGrid = document.getElementById("github-repos-grid");
  const profileLink = document.getElementById("github-profile-link");
  const usernameLink = document.getElementById("github-username-link");
  const avatar = document.getElementById("github-avatar");
  const profileName = document.getElementById("github-name");
  const profileBio = document.getElementById("github-bio");
  const repoCount = document.getElementById("github-repos-count");
  const followersCount = document.getElementById("github-followers-count");
  const followingCount = document.getElementById("github-following-count");

  function setStatus(message, state = "info") {
    status.textContent = message;
    status.dataset.state = state;
  }
  function formatCount(value) {
    return new Intl.NumberFormat().format(value ?? 0);
  }
  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function renderRepo(repo) {
    const card = makeElement("article", "github-repo panel");
    const titleRow = makeElement("div", "repo-title-row");
    titleRow.append(makeElement("span", "repo-mark", "⌘"));
    titleRow.append(makeElement("h4", "", repo.name || "Untitled repository"));
    titleRow.append(makeElement("span", "repo-visibility", "PUBLIC"));
    card.append(titleRow);

    card.append(makeElement("p", "", repo.description || "No description has been added to this repository yet."));
    const language = makeElement("div", "repo-language", repo.language ? `LANGUAGE / ${repo.language}` : "LANGUAGE / NOT SPECIFIED");
    card.append(language);

    const meta = makeElement("div", "repo-meta");
    const stars = makeElement("span", "", `☆ ${formatCount(repo.stargazers_count)} stars`);
    const forks = makeElement("span", "", `⑂ ${formatCount(repo.forks_count)} forks`);
    const updated = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "Unknown";
    const updatedLabel = makeElement("span", "", `↻ ${updated}`);
    meta.append(stars, forks, updatedLabel);
    card.append(meta);

    const link = makeElement("a", "repo-open", "VIEW REPOSITORY ↗");
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Open ${repo.name} repository on GitHub`);
    card.append(link);
    return card;
  }

  function renderPlaceholder(title, description) {
    reposGrid.replaceChildren();
    const card = makeElement("article", "github-repo panel github-repo-placeholder");
    card.append(makeElement("span", "repo-mark", "⌘"));
    card.append(makeElement("h4", "", title));
    card.append(makeElement("p", "", description));
    reposGrid.append(card);
  }

  async function loadGitHub() {
    if (!GITHUB_USERNAME || GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
      profileName.textContent = "Connect your GitHub profile";
      profileBio.textContent = "Open script.js and replace YOUR_GITHUB_USERNAME with your GitHub username.";
      usernameLink.textContent = "@your-username ↗";
      usernameLink.href = "https://github.com/";
      profileLink.href = "https://github.com/";
      renderPlaceholder("Waiting for GitHub", "Once you add your username in script.js, your public repositories will appear here.");
      setStatus("Setup needed: change GITHUB_USERNAME near the bottom of script.js. No token or password is required.");
      return;
    }

    const username = GITHUB_USERNAME.trim();
    if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
      renderPlaceholder("Check your username", "GitHub usernames can contain letters, numbers, and hyphens.");
      setStatus("The GitHub username format looks incorrect. Update GITHUB_USERNAME in script.js.", "error");
      return;
    }

    refreshButton.disabled = true;
    refreshButton.textContent = "↻ LOADING";
    setStatus(`Connecting to github.com/${username}…`);
    profileLink.href = `https://github.com/${encodeURIComponent(username)}`;
    usernameLink.href = profileLink.href;
    usernameLink.textContent = `@${username} ↗`;

    try {
      const headers = { Accept: "application/vnd.github+json" };
      const [profileResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&type=owner`, { headers })
      ]);
      if (profileResponse.status === 404 || reposResponse.status === 404) {
        throw new Error("That GitHub username was not found. Double-check the spelling in script.js.");
      }
      if (!profileResponse.ok || !reposResponse.ok) {
        if (profileResponse.status === 403 || reposResponse.status === 403) {
          throw new Error("GitHub's public API limit was reached. Wait a little and press REFRESH.");
        }
        throw new Error("GitHub could not load the profile right now. Check your internet connection and try again.");
      }
      const profile = await profileResponse.json();
      const repos = await reposResponse.json();

      avatar.src = profile.avatar_url;
      avatar.alt = `${profile.login}'s GitHub avatar`;
      profileName.textContent = profile.name || profile.login;
      profileBio.textContent = profile.bio || "Public GitHub profile — building, learning, and sharing code.";
      usernameLink.href = profile.html_url;
      usernameLink.textContent = `@${profile.login} ↗`;
      profileLink.href = profile.html_url;
      repoCount.textContent = formatCount(profile.public_repos);
      followersCount.textContent = formatCount(profile.followers);
      followingCount.textContent = formatCount(profile.following);

      const sortedRepos = repos
        .filter((repo) => !repo.fork)
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at)))
        .slice(0, 6);
      reposGrid.replaceChildren();
      if (sortedRepos.length) {
        sortedRepos.forEach((repo) => reposGrid.append(renderRepo(repo)));
      } else {
        renderPlaceholder("No public repositories yet", "When you publish a repository on GitHub, it can show up here automatically.");
      }
      setStatus(`Connected to @${profile.login}. Showing ${sortedRepos.length} public ${sortedRepos.length === 1 ? "repository" : "repositories"}${repos.length > 6 ? " (top 6 shown)" : ""}.`, "success");
    } catch (error) {
      renderPlaceholder("GitHub could not load", error.message || "Something went wrong. Try refreshing.");
      setStatus(error.message || "Could not connect to GitHub. Check your internet connection.", "error");
    } finally {
      refreshButton.disabled = false;
      refreshButton.textContent = "↻ REFRESH";
    }
  }

  refreshButton.addEventListener("click", loadGitHub);
  loadGitHub();
})();
