# Privacy Policy

**Hide & Seek — Media Blocker**
**Last updated: June 2026**

---

## Our Commitment to Privacy

**Hide & Seek** was built with privacy as a core principle, not an afterthought. This Privacy Policy explains, in plain language, what data (if any) is accessed, stored, or transmitted when you use the Extension.

**TL;DR — we collect absolutely nothing. Zero. Nada.**

---

## 1. Who We Are

Hide & Seek is an open-source browser extension developed and maintained by its contributors on GitHub:

> https://github.com/albertolicea00/hide-n-seek-media-block-addon

The project is maintained by **albertolicea00** and open-source contributors. There is no company, legal entity, or data processing organization behind this Extension.

---

## 2. Data We Do NOT Collect

We want to be completely transparent. The Extension does **not** collect, store, transmit, share, or sell any of the following:

- ❌ Browsing history or visited URLs
- ❌ Website content or media you view
- ❌ Personal information (name, email, IP address, device identifiers)
- ❌ Crash reports or diagnostic telemetry
- ❌ Analytics or usage statistics
- ❌ Cookies or tracking identifiers of any kind

There are **no servers**, **no databases**, **no third-party SDKs**, and **no analytics platforms** involved in the operation of this Extension.

---

## 3. Data Stored Locally (On Your Device Only)

The Extension stores the following **user preferences** using the browser's native `chrome.storage.sync` / `browser.storage.sync` API. This data lives **only on your device** (and optionally synced to your signed-in browser account by your browser vendor — not by us):

| Setting           | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `enabled`         | Whether the Extension is currently active (ON/OFF)          |
| `mode`            | Active blocking mode (`blur`, `blackout`, or `placeholder`) |
| `blurAmount`      | Blur intensity in pixels                                    |
| `placeholderUrl`  | Custom image URL for placeholder mode                       |
| `autoReload`      | Whether to reload the tab when toggling protection          |
| `whitelist`       | List of domains excluded from blocking                      |
| `customSelectors` | Custom CSS selectors the user added for additional blocking |

This data is **never read, accessed, or transmitted by us**. It is used solely to restore your settings when you reload a tab or reopen your browser.

> **Note on browser sync:** If you are signed into Chrome or Firefox Sync, your browser may sync `storage.sync` data across your devices according to **your browser vendor's own privacy policy**. This sync is performed by your browser, not by Hide & Seek.

---

## 4. Permissions Explained

The Extension requests only the permissions required for its core functionality:

### `activeTab`

Used to inject obfuscation CSS and click-to-reveal JavaScript into the currently active tab when the Extension is enabled. The Extension **does not read** the content of pages or any text/data on them.

### `scripting`

Required under Manifest V3 (Chrome/Edge) to programmatically inject stylesheets. No content is extracted from the page.

### `storage`

Used to save and retrieve your preferences locally via `chrome.storage.sync`. Data is never sent to us.

### `contextMenus`

Used to create the right-click context menu on the Extension toolbar icon (e.g., "Exclude this website"). Clicking this option adds the current site's domain to your local whitelist — it is never logged or transmitted.

---

## 5. No Third Parties

This Extension does **not** integrate with any third-party services, APIs, advertising networks, analytics platforms, or crash reporting tools.

There are no:

- Google Analytics, Mixpanel, or similar trackers
- Firebase or cloud databases
- Remote feature flags or A/B testing services
- Affiliate or monetization networks

---

## 6. Open Source Transparency

The Extension is fully open-source. You can inspect every line of code that runs in your browser:

> https://github.com/albertolicea00/hide-n-seek-media-block-addon

We encourage you to review the source code if you have any concerns about what the Extension does. Community audits and contributions are welcome.

---

## 7. Children's Privacy

The Extension does not knowingly collect data from anyone, including children under the age of 13. Since we collect no data at all, there is no special handling required.

---

## 8. Changes to This Policy

We may update this Privacy Policy if the Extension's behavior changes in a way that affects data handling. Any updates will be reflected in the `Last updated` date at the top of this document and committed to the public GitHub repository.

We encourage you to periodically review this document.

---

## 9. Contact

If you have any questions about this Privacy Policy or the Extension's behavior, please open an issue on GitHub:

> https://github.com/albertolicea00/hide-n-seek-media-block-addon/issues

---

_Hide & Seek respects your privacy completely. What you browse is your business — not ours._
