# Contributing to Hide & Seek 🙈

Thank you for your interest in contributing to Hide & Seek! This guide will help you get started.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/hide-n-seek-block-media-addon.git
   ```
3. **Load** the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked" and select the project folder

## Development Workflow

We use a two-branch workflow:
- `main`: Stable release version.
- `beta`: Active development branch.

**All Pull Requests must be directed to the `beta` branch.**

1. Create a new branch from `beta` for your feature or fix:

   ```bash
   git checkout -b feature/your-feature-name beta
   ```

2. Make your changes — the extension uses **Manifest V3** with:
   - `background.js` — Service Worker for state management
   - `content_script.js` / `styles.css` — Core obfuscation and reveal logic
   - `popup.html` / `popup.js` — Extension toggle UI

3. **Test** your changes:
   - Reload the extension from `chrome://extensions/`
   - Test turning the protection ON and OFF via the popup
   - Verify images, videos, and backgrounds are blurred correctly
   - Verify the click-to-reveal functionality works as intended
   - Check the browser console for any errors

4. Commit your changes with a clear message:

   ```bash
   git commit -m "feat: add support for blurring background images"
   ```

5. Push and open a Pull Request

## Code Style

- Use **vanilla JavaScript** and **pure CSS** (no frameworks needed)
- Use `const` and `let` instead of `var`
- Add error handling with `try/catch` blocks
- Include `console.log` messages prefixed with `🙈 Hide & Seek:` for debugging

## Reporting Issues

When reporting a bug, please include:

- Browser name and version
- Steps to reproduce the issue
- Expected vs actual behavior
- Console errors (if any)

## Feature Requests

We welcome ideas! Please open an issue with the `enhancement` label and describe:

- What problem it solves
- How you'd like it to work
- Any alternatives you've considered

---

Thank you for helping make Hide & Seek better! 🙌
