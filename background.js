// background.js
// Minimal service worker - handles any future messages if needed.

chrome.runtime.onInstalled.addListener(() => {
  // default enabled = true
  chrome.storage.sync.get(['bm_block_enabled'], (res) => {
    if (typeof res.bm_block_enabled === 'undefined') {
      chrome.storage.sync.set({ bm_block_enabled: true });
    }
  });
});
