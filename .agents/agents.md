# Agent Instructions for Hide & Seek

This repository contains **Hide & Seek**, a browser extension built with Manifest V3 designed to automatically blur sensitive media (images, videos, iframes) on websites. When assisting with this project, please adhere to the following rules and context.

## Tech Stack
- **Core:** Vanilla JavaScript (ES6+)
- **Styling:** Pure CSS (heavy use of CSS filters for obfuscation)
- **Markup:** HTML5
- **Architecture:** Chrome Extension Manifest V3
  - `background.js` (Service Worker handling toggle state)
  - `content_script.js` & `styles.css` (Injected scripts/styles for media blurring and click-to-reveal logic)
  - `popup.html` & `popup.js` (Extension popup UI for toggling ON/OFF)

## Development Rules & Guidelines

1. **No Frameworks or Build Tools:**
   - This project uses purely native web technologies. Do not introduce React, Vue, Webpack, Vite, TailwindCSS, or any other libraries/bundlers.
   - Code must be able to run directly in the browser without any transpilation or build step.

2. **Code Style:**
   - Use modern JavaScript syntax (`const`, `let`, arrow functions, destructuring, async/await).
   - Avoid `var`.
   - Implement proper error handling with `try/catch` blocks.
   - Add inline comments for complex logic (especially DOM mutation observers or message passing).

3. **Performance & Security:**
   - Keep the performance footprint minimal. The extension injects into every page, so efficiency in the content script and CSS is critical to avoid lag.
   - Adhere strictly to Manifest V3 security requirements.
   - Avoid requesting unnecessary permissions in `manifest.json`.
   - **Privacy First:** Never collect, track, or store user data externally. All operations must run locally in the browser context.

4. **Debugging:**
   - When adding `console.log` messages for debugging, prefix them clearly with `🙈 Hide & Seek:` so they are easy to identify in the console.

## Workflow
- The project uses a two-branch workflow (`main` for releases, `beta` for active development).
- Ensure any UI additions to the popup match the existing simple and clean aesthetic.
