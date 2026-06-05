# Agent Instructions for Hide & Seek

This repository contains **Hide & Seek**, a cross-browser extension designed to automatically blur or replace sensitive media (images, videos, iframes) on websites. When assisting with this project, please adhere to the following rules and context.

## Tech Stack
- **Core:** Vanilla JavaScript (ES6+)
- **Styling:** Pure CSS & Dynamic CSS Injection (heavy use of CSS filters for obfuscation)
- **Markup:** HTML5
- **Architecture:** Dual Manifest V2 / Manifest V3 Compatibility
  - `manifest.v3.json` (Manifest V3 configuration for Google Chrome and Chromium browsers)
  - `manifest.v2.json` (Manifest V2 configuration for Mozilla Firefox compatibility)
  - `Makefile` (Active manifest switcher and release packager)
  - `background.js` (Background service worker / event page using a shim to support both `chrome.action` and `chrome.browserAction`, managing toolbar click toggles)
  - `content_script.js` & `styles.css` (Injected scripts/styles for media blurring, custom placeholders, and click-to-reveal logic)
  - `options.html` & `options.js` (Adaptive light/dark options page to customize blocking modes, blur amount, categories, and exclusions)

## Development Rules & Guidelines

1. **No Frameworks or Build Tools:**
   - This project uses purely native web technologies. Do not introduce React, Vue, Webpack, Vite, TailwindCSS, or any other libraries/bundlers.
   - Code must be able to run directly in the browser. The build system (`Makefile`) is strictly for switching manifest configurations and zipping release packages.

2. **Active Manifest Configuration:**
   - `manifest.json` is generated dynamically by copying `manifest.v2.json` or `manifest.v3.json`.
   - Never edit `manifest.json` directly. Edit `manifest.v2.json` or `manifest.v3.json` and run the appropriate `make` target.
   - `manifest.json` and the `dist/` directory are ignored in Git and must not be committed.

3. **Direct-Click Toolbar Toggle:**
   - The extension toggles ON/OFF directly when clicking the extension icon in the browser toolbar (no popup).
   - State and settings are stored in `chrome.storage.sync`.
   - Dynamic stylesheet rules are generated and injected via `content_script.js`.

4. **Code Style:**
   - Use modern JavaScript syntax (`const`, `let`, arrow functions, destructuring, async/await).
   - Avoid `var`.
   - Implement proper error handling with `try/catch` blocks.
   - Add inline comments for DOM mutation observers, stylesheet compilation, and message passing.

5. **Performance & Security:**
   - Keep the performance footprint minimal. The extension injects into every page, so efficiency in the content script stylesheet generation is critical to avoid layout lag.
   - Adhere strictly to Chrome Web Store Manifest V3 and Firefox AMO Manifest V2 security requirements.
   - **Privacy First:** Never collect, track, or store user data externally. All operations must run locally in the browser context.

6. **Debugging:**
   - When adding `console.log` messages for debugging, prefix them clearly with `🙈 Hide & Seek:` so they are easy to identify in the console.

## Workflow
- The project uses a two-branch workflow (`main` for releases, `beta` for active development).
- Standard build commands:
  - `make chrome`: Switch active configuration to Manifest V3 (Chrome)
  - `make firefox`: Switch active configuration to Manifest V2 (Firefox)
  - `make build`: Bundle zip packages for both extensions in `dist/`
  - `make clean`: Clean up `dist/` and active `manifest.json`
- CI/CD release workflow is automated via GitHub Actions when tags starting with `v` are pushed.
