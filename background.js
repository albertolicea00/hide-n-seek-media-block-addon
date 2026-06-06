// background.js

// Manifest V2 / V3 Compatibility Shim
const isMV3 = typeof chrome.action !== 'undefined';
const actionAPI = isMV3 ? chrome.action : chrome.browserAction;

// Function to update the extension icon based on enabled state
function updateIcon(enabled) {
  const prefix = enabled ? 'icon-hide' : 'icon-show';
  actionAPI.setIcon({
    path: {
      "16": `icons/${prefix}-16.png`,
      "32": `icons/${prefix}-32.png`,
      "48": `icons/${prefix}-48.png`,
      "64": `icons/${prefix}-64.png`,
      "128": `icons/${prefix}-128.png`
    }
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('🙈 Hide & Seek: Error setting icon:', chrome.runtime.lastError.message);
    }
  });
}

// Ensure icon is correct when the service worker starts up
chrome.storage.sync.get(['bm_block_enabled'], (res) => {
  const enabled = res.bm_block_enabled !== false; // default true
  updateIcon(enabled);
  console.info(`🙈 Hide & Seek: Background worker started. Current blocker state (enabled): ${enabled}`);
});

// Listen to changes in storage to update the icon dynamically
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.bm_block_enabled) {
    const enabled = changes.bm_block_enabled.newValue !== false; // default true
    updateIcon(enabled);
    console.info(`🙈 Hide & Seek: Block enabled state changed in storage to: ${enabled}`);

    // Reload active tab if user enabled the auto-reload preference
    chrome.storage.sync.get(['bm_reload_on_toggle'], (res) => {
      if (res.bm_reload_on_toggle === true) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs[0] && tabs[0].id) {
            console.info(`🙈 Hide & Seek: Auto-reloading tab ${tabs[0].id} due to state toggle.`);
            chrome.tabs.reload(tabs[0].id);
          }
        });
      }
    });
  }
});

// Toggle extension state on clicking the toolbar extension icon
actionAPI.onClicked.addListener(() => {
  chrome.storage.sync.get(['bm_block_enabled'], (res) => {
    const currentState = res.bm_block_enabled !== false; // default true
    const newState = !currentState;
    console.log(`🙈 Hide & Seek: Toolbar icon clicked. Toggling state: ${currentState} -> ${newState}`);
    chrome.storage.sync.set({ bm_block_enabled: newState });
  });
});

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item under the extension toolbar icon
  chrome.contextMenus.create({
    id: "excludeCurrentSite",
    title: "Exclude this website",
    contexts: [isMV3 ? "action" : "browser_action"]
  });

  // default enabled = true
  chrome.storage.sync.get(['bm_block_enabled'], (res) => {
    if (typeof res.bm_block_enabled === 'undefined') {
      chrome.storage.sync.set({ bm_block_enabled: true });
    } else {
      // If already installed and setting exists, make sure the icon is updated
      updateIcon(res.bm_block_enabled !== false);
    }
  });
});

// Listen to context menu clicks to exclude current website
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "excludeCurrentSite" && tab && tab.url) {
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      // Filter out internal browser pages
      if (domain && !domain.startsWith('chrome://') && !domain.startsWith('chrome-extension://') && !domain.startsWith('about:')) {
        chrome.storage.sync.get({ bm_whitelist: [] }, (res) => {
          const whitelist = res.bm_whitelist || [];
          if (!whitelist.includes(domain)) {
            whitelist.push(domain);
            chrome.storage.sync.set({ bm_whitelist: whitelist }, () => {
              console.log(`🙈 Hide & Seek: Excluded site: ${domain}`);
            });
          }
        });
      }
    } catch (e) {
      console.error('🙈 Hide & Seek: Error excluding site:', e.message);
    }
  }
});

