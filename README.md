<div align="left">
  <h1>🙈 Hide & Seek - Media Blocker</h1>
  <p><strong>A high-performance, cross-browser extension designed to help you browse the web safely, discreetly, and custom-tailored to your privacy needs.</strong></p>
  <p>
    <a href="#-from-extension-stores-recommended"><img src="https://img.shields.io/badge/Chrome_Web_Store-Available-4285F4?style=flat-square&logo=google-chrome&logoColor=white" alt="Chrome Web Store" /></a>
    <a href="#-from-extension-stores-recommended"><img src="https://img.shields.io/badge/Firefox_Add--ons-Available-FF7139?style=flat-square&logo=firefox-browser&logoColor=white" alt="Firefox Add-ons" /></a>
    <a href="#-from-extension-stores-recommended"><img src="https://img.shields.io/badge/Edge_Add--ons-Available-0078D7?style=flat-square&logo=microsoft-edge&logoColor=white" alt="Edge Add-ons" /></a>
    <a href="#-from-extension-stores-recommended"><img src="https://img.shields.io/badge/Opera_Add--ons-Available-FF1B2D?style=flat-square&logo=opera&logoColor=white" alt="Opera Add-ons" /></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License MIT" />
  </p>
</div>

---

## 🚀 Why Hide & Seek?

Sometimes you need to browse the web safely, whether in a public space, at work, or simply to protect yourself from unwanted explicit content. **Hide & Seek** automatically hides sensitive images, videos, and thumbnails, allowing you to navigate even the most explicit websites without seeing anything you don't want to.

---

## ✨ Features

- 🛡️ **Instant Protection**: Automatically blurs, blackouts, or overlays placeholder images onto media elements as they load.
- 🖱️ **Direct-Click Toggle**: Activate or deactivate the blocking system immediately by clicking the extension icon in your browser toolbar.
- 🚪 **Quick Exclusion Context Menu**: Right-click the extension toolbar icon and select **"Exclude this website"** to immediately whitelist the current tab's domain.
- 🎨 **Customized Obfuscation**: Choose between three modes of blocking:
  - **Blur**: Mask shapes and explicit details with custom blur intensity.
  - **Solid Blackout**: Turn all media elements completely pitch black.
  - **Custom Placeholder**: Overlay a beautiful abstract image or any URL of your choice over blocked media.
- ⚙️ **Browser Refresh Option**: Opt to automatically reload the active tab when toggling protection on/off.
- 🔍 **Whitelisting & Subdomain Wildcards**: Exclude specific domains where blocking should never be active. Wildcard formats like `*.example.com` automatically match the parent domain and all of its subdomains (e.g., `mail.example.com`).
- 🎯 **Custom CSS Selectors**: Manually block additional elements by class, ID, or custom selector rules (e.g. `.custom-ad`, `#sensitive-media .banner`, etc.) with real-time validation.
- 🖱️ **Click-to-Reveal**: See something you're interested in? Just click once to reveal that specific element instantly.
- ⚡ **High Performance**: Uses lightweight, dynamically-generated stylesheets for zero lag and minimal CPU usage.

---

## 🏗️ Project Structure

```
Hide N Seek/
├── manifest.v3.json     # Chrome-specific config (Manifest V3)
├── manifest.v2.json     # Firefox-specific config (Manifest V2)
├── Makefile             # Compiles manifests & bundles zip packages
├── background.js        # Service Worker/Event Page - handles toolbar toggle & reload
├── content_script.js    # Injected script - dynamically compiles & applies style rules
├── styles.css           # Injected stylesheet - styles cursor & reveal transitions
├── options.html         # Gorgeous preferences UI (system dark/light adaptive)
├── options.js           # Logic for settings saving and live previewing
├── icons/               # Extension branding assets
└── dist/                # Target directory for built store zip packages (ignored)
```

---

## 🛠️ Build & Development Commands

This project uses a `Makefile` to target different browser standard specifications.

| Command | Action |
| --- | --- |
| `make chrome` | Switches the active configuration to **Manifest V3 (Chrome)** |
| `make firefox` | Switches the active configuration to **Manifest V2 (Firefox)** |
| `make build` | Generates browser-ready zip packages in the `dist/` directory |
| `make clean` | Cleans up the `dist/` directory and removes temporary active manifest |

---

## 📥 Installation

### 🌐 From Extension Stores (Recommended)

Installing from the official stores is the easiest way to get **Hide & Seek** and ensure it stays updated automatically.

> ⚠️ **Firefox, Chrome, Edge, Opera versions on the way — review in progress**

<!-- 
- 🟢 **Chrome** (Brave, Vivaldi): [Download from Chrome Web Store](https://chromewebstore.google.com/detail/hideNseek)
- 🔵 **Edge**: [Download from Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/hideNseek)
- 🔴 **Opera**: [Download from Opera Add-ons](https://addons.opera.com/extensions/details/hideNseek)
- 🦊 **Firefox**: [Download from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/hideNseek/)
-->

### 🛠️ Manual Installation (Developer Mode)

To install the extension manually for development, follow these steps:

#### 1. Clone this repository:
```bash
git clone https://github.com/albertolicea00/hide-n-seek-block-media-addon.git
cd hide-n-seek-block-media-addon
```

#### 2. Select your browser profile:
Select the active configuration depending on your browser:
* **For Chrome / Chromium / Edge / Opera / Brave**:
  ```bash
  make chrome
  ```
* **For Mozilla Firefox**:
  ```bash
  make firefox
  ```

#### 3. Load the Extension:

##### For Google Chrome & Chromium-based browsers:
1. Open your browser and navigate to `chrome://extensions/`.
2. Enable **"Developer mode"** in the top right corner.
3. Click **"Load unpacked"** and select the clone directory containing `manifest.json`.

##### For Mozilla Firefox:
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."**.
3. Select the `manifest.json` file inside the clone folder.

---

## 🧑‍💻 Usage

1. **Activate**: Click on the **Hide & Seek** icon in your toolbar. The icon will toggle, and the extension will immediately block media.
2. **Exclusions**: Right-click the extension icon and select **Options** (or Open Extension Preferences) to define whitelist domains, adjust blur intensity, select blackout modes, or set placeholder images.
3. **Reveal Media**: Click directly on any blocked image or video on any page to reveal it instantly.

---

## 🔐 Permissions Explained

| Permission | Why it's needed |
| --- | --- |
| `activeTab` | Access the active page to apply obfuscation styles and click interceptors. |
| `scripting` | Programmatically inject scripts/CSS under Manifest V3. |
| `storage` | Save preferences (whitelists, blocking modes, custom URLs) securely across sessions. |
| `contextMenus` | Create context menu options under the extension toolbar icon (e.g. "Exclude this website"). |

> ⚠️ **No data is ever collected, transmitted, or stored externally.** All operations are performed 100% locally in your browser context.

---

## 🔮 Wishlist / Future Roadmap

- 🧠 **On-Device AI Sensitive Content Detection**: Integrate lightweight, local machine learning models (such as TensorFlow.js or Transformers.js running entirely on-device) to dynamically scan images/videos and block only sensitive content, instead of blocking elements by category or selector.
- 🚫 **Force-Blocked Domains (Blacklist)**: Define a list of specific domains where media blocking is *always* strictly enforced (e.g., blocking cannot be bypassed via toolbar toggles or click-to-reveal on those sites).
- 🎨 **Custom CSS Override Rules**: Provide an input to inject custom CSS styles when elements are blocked, allowing users to customize placeholder layouts or completely hide slot containers and advertisements.
- 🕒 **Scheduled Protection Mode**: Add option to automatically activate/deactivate media blocking during specific times of day or calendar schedules.
- ⌨️ **Panic Key / Global Hotkeys**: Set up a configurable keyboard shortcut to instantly toggle the blocker state or re-hide all revealed media elements immediately.
- 🕵️ **Stealth Icon & Disguise**: Support switching the browser toolbar icon to a stealth/generic icon (e.g. settings gear or generic utility icon) for maximum discretion.


---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⚖️ Legal

- [End User License Agreement (EULA)](EULA.md)
- [Privacy Policy](PRIVACY_POLICY.md)