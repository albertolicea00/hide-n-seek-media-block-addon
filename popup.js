// popup.js
const toggle = document.getElementById('toggle');
const reloadBtn = document.getElementById('reload');

const KEY = 'bm_block_enabled';

function setToggleUI(enabled) {
  toggle.checked = !!enabled;
}

chrome.storage.sync.get([KEY], (res) => {
  setToggleUI(res[KEY] !== false);
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ [KEY]: enabled }, () => {
    // inform current tab to re-run immediately by re-injecting content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content_script.js']
      }, () => {
        // done
      });
    });
  });
});

reloadBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    chrome.tabs.reload(tabs[0].id);
  });
});
