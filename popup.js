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
    // UI updated, content_script.js receives the change via onChanged listener automatically.
  });
});

reloadBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    chrome.tabs.reload(tabs[0].id);
  });
});
