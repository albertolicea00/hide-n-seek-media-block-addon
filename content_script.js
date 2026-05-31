const STORAGE_KEY = 'bm_block_enabled';

function applyState(enabled) {
  if (enabled) {
    document.documentElement.classList.add('bm-active');
  } else {
    document.documentElement.classList.remove('bm-active');
    // Remove all revealed states so they hide again if toggled ON
    document.querySelectorAll('.bm-revealed').forEach(el => {
      el.classList.remove('bm-revealed');
    });
  }
}

// 1. Initialize state
chrome.storage.sync.get([STORAGE_KEY], (res) => {
  applyState(res[STORAGE_KEY] !== false); // default to true
});

// 3. Listen to toggles from popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes[STORAGE_KEY]) {
    applyState(changes[STORAGE_KEY].newValue);
  }
});

// 4. Global click listener to reveal content on demand
document.addEventListener('click', (e) => {
  if (!document.documentElement.classList.contains('bm-active')) return;
  
  // Find if we clicked on a blocked element
  // Elements missing .bm-revealed are blocked by CSS
  const target = e.target.closest('img, video, iframe, [style*="background-image"]');
  
  if (target && !target.classList.contains('bm-revealed')) {
    // Intercept the click so we don't open the image link by accident (on first click)
    e.preventDefault();
    e.stopPropagation();
    
    // Reveal it
    target.classList.add('bm-revealed');
    
    // If it is a video, optionally try to add controls or play it
    if (target.tagName === 'VIDEO') {
      target.controls = true;
    }
  }
}, true); // Use capture phase to intercept the click before it reaches links

