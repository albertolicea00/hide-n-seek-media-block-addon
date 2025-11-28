# 🙈 Hide & Seek - Block Media Extension

This Chrome extension replaces all images, videos, and background images on websites with a neutral placeholder to hide sensitive content. Users can reveal the original media by clicking on it. The extension includes an ON/OFF toggle available in the popup.

## Features:

- 🖼️ Blocks all images and videos on any website.

- 🔄 Replaces media with a placeholder that keeps the same layout size.

- 👆 Click to reveal the original image or video.

- 🎬 Videos open in a lightbox overlay with playback controls.

- ⚡ Supports dynamic content using MutationObserver (works with infinite scroll and AJAX-loaded content).

- 🔘 Enable/disable toggle using chrome.storage.sync.

- 🧩 Fully compatible with Manifest V3.

## Installation :
1. Go to the provided link: 
    - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/example-extension/) (Firefox 89+)
    - [Chrome Web Store](https://chrome.google.com/webstore/detail/example-extension/abcdefg123456) (Chrome 91+)
    - [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/example-extension/abcdefg123456) (Edge 91+)
    - [Brave Web Store](https://chrome.google.com/webstore/detail/example-extension/abcdefg123456) (Brave 1.27+)
    - [Opera Add-ons](https://addons.opera.com/en/extensions/details/example-extension/) (Opera 77+)
    - [Safari Extensions Gallery](https://apps.apple.com/app/example-extension/id123456789) (Safari 15+)

2. Click Install

### Manual (Development Mode)
1. Download or clone the project folder.

2. Open Google Chrome.

3. Navigate to: [`chrome://extensions`](chrome://extensions)

4. Enable "Developer Mode" (switch at the top right).

5. Click "Load unpacked".

6. Select the `block-media-extension` folder.

The extension will appear in your browser toolbar.

## Usage:

- To enable or disable blocking, click the extension icon and use the toggle.
- To view a blocked image, click on the placeholder.
- To view a blocked video, click it to open it in a lightbox overlay.

The extension automatically blocks newly loaded images and videos on dynamic pages.

The extension starts with blocking enabled by default.

> **NOTE**: No data is collected or transmitted; the extension works entirely locally.



## License:

MIT License. Free to use, modify, and distribute.

## Contributions:

Suggestions and pull requests are welcome.