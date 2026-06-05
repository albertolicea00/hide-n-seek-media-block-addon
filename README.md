<div align="left">
  <h1>🙈 Hide & Seek - Media Blocker</h1>
  <p><strong>A high-performance browser extension designed to help you browse the web safely and discreetly.</strong></p>
  <p>
    <a href="#-from-extension-stores-recommended"><img src="https://img.shields.io/badge/Chrome_Web_Store-Available-4285F4?style=flat-square&logo=google-chrome&logoColor=white" alt="Chrome Web Store" /></a>
    <a href="#-from-extension-stores-recommended"><img src="https://img.shields.io/badge/Firefox_Add--ons-Available-FF7139?style=flat-square&logo=firefox-browser&logoColor=white" alt="Firefox Add-ons" /></a>
    <a href="#-from-extension-stores-recommended"><img src="https://img.shields.io/badge/Edge_Add--ons-Available-0078D7?style=flat-square&logo=microsoft-edge&logoColor=white" alt="Edge Add-ons" /></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License MIT" />
  </p>
</div>


## 🚀 Why Hide & Seek?

Sometimes you need to browse the web safely, whether in a public space, at work, or simply to protect yourself from unwanted explicit content. **Hide N Seek** automatically hides sensitive images, videos, and thumbnails, allowing you to navigate even the most explicit websites without seeing anything you don't want to.

## ✨ Features

- 🛡️ **Instant Protection**: Automatically blurs images, videos, iframes, and background images as they load.
- 🕶️ **Deep Obfuscation**: Uses extreme blurring and grayscale filters to ensure content is completely unrecognizable, preserving your privacy and peace of mind.
- 🖱️ **Click-to-Reveal**: See something you're interested in? Just click once to reveal the specific piece of media instantly.
- 🧩 **Layout Preserving**: Unlike other blockers that break websites, Hide N Seek maintains the original layout, so the web looks exactly as intended—just blurred.
- ⚡ **High Performance**: Built with pure CSS and efficient JavaScript for zero lag and minimal CPU usage.
- 🎚️ **Easy Toggle**: Turn the protection on or off with a single click from the extension popup.

### What gets hidden

- ✅ `Images` (including background images)
- ✅ `Videos`
- ✅ `Iframes` (embedded content)
- ✅ `Thumbnails`


## 📥 Installation

### 🌐 From Extension Stores (Recommended)

Installing from the official stores is the easiest way to get **Hide N Seek** and ensure it stays updated automatically.
> ⚠️ **Coming soon — currently under review**
<!-- TODO -->
<!-- 1. **Google Chrome & Chromium-based browsers (Brave, Vivaldi, Opera)**
   - 👉 [Download on Chrome Web Store](https://chromewebstore.google.com/)
   - Click **"Add to Chrome"** and confirm.

2. **Microsoft Edge**
   - 👉 [Download on Edge Add-ons](https://microsoftedge.microsoft.com/addons)
   - Click **"Get"** and confirm.

3. **Mozilla Firefox**
   - 👉 [Download on Firefox Add-ons](https://addons.mozilla.org/)
   - Click **"Add to Firefox"** and confirm. -->

### 🛠️ Manual Installation (Developer Mode)

If you want to test the latest features or contribute to the project, you can install the extension manually.

#### 1. 📥 Download or clone this repository:
```bash
git clone https://github.com/albertolicea00/hide-n-seek-block-media-addon.git
```

#### 2. Load the Extension in Your Browser:

##### For Google Chrome & Chromium-based browsers (Edge, Brave, Opera):
1. 🌐 Open your browser and go to `chrome://extensions/` (or `edge://extensions/`).
2. 🔓 Enable **"Developer mode"** in the top right corner.
3. 📂 Click **"Load unpacked"** and select the extension folder.

##### For Mozilla Firefox:
1. 🦊 Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. 📂 Click **"Load Temporary Add-on..."**.
3. 📄 Select the `manifest.json` file in the extension folder.

#### 3. 📌 Pin the **Hide N Seek** icon to your toolbar for easy access!


## 🧑‍💻 Usage

### Standard Protection

1. **Activate**: Click on the **Hide N Seek** icon in your toolbar, and toggle the switch to **"ON"**. 🟢
2. **Browse Safely**: All media on websites will instantly become blurred and unrecognizable.
3. **Reveal Media**: Curious about a specific image or video? Simply **click on it** to reveal the original content. 👁️
4. **Deactivate**: Toggle the switch to **"OFF"** from the popup to return to normal browsing. 🔴


## 🏗️ Project Structure

```
Hide N Seek/
├── manifest.json       # Extension config (Manifest V3)
├── background.js       # Service Worker — manages extension state
├── content_script.js   # Injected script — handles blurring and reveal logic
├── styles.css          # Injected styles — CSS filters for obfuscation
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic — toggles protection on/off
├── icons/              # Extension icons (16, 32, 48, 64, 128)
│   ├── icon-hide-16.png / icon-show-16.png
│   ├── icon-hide-32.png / icon-show-32.png
│   ├── icon-hide-48.png / icon-show-48.png
│   ├── icon-hide-64.png / icon-show-64.png
│   └── icon-hide-128.png / icon-show-128.png
├── LICENSE             # MIT License
└── README.md           # You are here!
```


## 🔐 Permissions Explained

| Permission   | Why it's needed                                        |
| ------------ | ------------------------------------------------------ |
| `activeTab`  | Access the currently active tab to inject CSS and scripts |
| `scripting`  | Inject the CSS filters and reveal logic into the page  |
| `storage`    | Persist your toggle ON/OFF state across sessions       |

> ⚠️ **No data is ever collected, transmitted, or stored externally.** Everything runs locally in your browser.


## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide before submitting a pull request or opening an issue.


## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.


## 👤 Author

**Alberto Licea** — [@albertolicea00](https://github.com/albertolicea00)

---

<p align="center">
  <i>Browse carefully. Reveal only what you want. 🤫</i>
</p>