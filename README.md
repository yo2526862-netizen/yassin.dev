# Yassin.dev V3 — Interactive Portfolio

A responsive dark-neon portfolio built with plain HTML, CSS, and JavaScript. No build tools or packages are required.

## Run it in VS Code
1. Extract the ZIP file.
2. Open the `the-s-portfolio` folder in Visual Studio Code.
3. (Recommended) Install the **Live Server** extension.
4. Right-click `index.html` and choose **Open with Live Server**.
5. The terminal's `open` command and project detail links use `project.html`, so run the site through Live Server for the smoothest experience.

## New in V3
- Interactive simulated terminal with `help`, `about`, `skills`, `projects`, `open`, `contact`, `date`, `whoami`, `echo`, and `clear` commands.
- Command history with the up/down arrow keys.
- Dedicated project detail page at `project.html?project=atmos`, `project.html?project=neon-runner`, or `project.html?project=orbit`.
- Project detail pages include an overview, design challenge, concept features, technology stack, and honest next-step notes.
- Shared theme preference across the main page and project details.

## Try the terminal
- Type `help` and press Enter to see all commands.
- Type `projects` to list the sample projects.
- Type `open atmos`, `open neon-runner`, or `open orbit` to view a project detail page.
- Type `clear` to reset the output.

The terminal is a safe local simulation. It does **not** execute operating-system commands or access the visitor's computer.

## Customize before publishing
- **Email:** In `script.js`, replace `your-email@example.com` with your real email. The contact form opens the visitor's default mail application; it does not send or store messages itself.
- **Projects:** The three included projects are clearly labeled concepts. Replace them with real projects and links as you build them.
- **Skills:** Update the skill descriptions and visual levels in `index.html`.
- **About and location:** Edit the copy directly in `index.html`.
- **Colors:** Edit the CSS variables in the `:root` block near the top of `style.css`.

## Files
- `index.html` — main portfolio and interactive terminal section
- `style.css` — main and project detail styling
- `script.js` — portfolio interactions and terminal simulator
- `project.html` — shared template for project details
- `project.js` — project data and detail page behavior

Google Fonts load when internet access is available; the site still works without them.


## V4: Connect your public GitHub profile

1. Open `script.js`.
2. The GitHub username is already configured as `yo2526862` in `script.js`.
3. No GitHub token or password is needed; the section uses GitHub’s public API.
4. Save the file and refresh the site while connected to the internet.
5. The GitHub section will load your public profile details and up to six of your most recently updated/high-starred non-fork repositories from GitHub's public API.

No password or API token is required. This uses the public GitHub API, so it needs an internet connection and can be affected by GitHub's anonymous API rate limits. The repository cards only show repositories that already exist publicly; demo project cards elsewhere on the site remain portfolio concepts until replaced with your real work.
