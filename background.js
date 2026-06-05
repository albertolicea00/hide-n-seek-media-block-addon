// background.js

// Function to update the extension icon based on enabled state
function updateIcon(enabled) {
  const prefix = enabled ? 'icon-hide' : 'icon-show';
  chrome.action.setIcon({
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
});

// Listen to changes in storage to update the icon dynamically
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.bm_block_enabled) {
    const enabled = changes.bm_block_enabled.newValue !== false; // default true
    updateIcon(enabled);
  }
});

chrome.runtime.onInstalled.addListener(() => {
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

