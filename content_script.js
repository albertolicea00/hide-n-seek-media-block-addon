// content_script.js

const KEYS = {
  enabled: 'bm_block_enabled',
  mode: 'bm_obfuscation_mode',
  blurLevel: 'bm_blur_level',
  grayscale: 'bm_grayscale',
  placeholderUrl: 'bm_placeholder_url',
  blockImages: 'bm_block_images',
  blockVideos: 'bm_block_videos',
  blockIframes: 'bm_block_iframes',
  whitelist: 'bm_whitelist'
};

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

// Function to generate and apply dynamic style rules
function updateDynamicStyles(settings) {
  let styleEl = document.getElementById('bm-dynamic-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'bm-dynamic-styles';
    // Append to documentElement immediately so it runs as early as possible
    document.documentElement.appendChild(styleEl);
  }

  const enabled = settings[KEYS.enabled] !== false; // default true
  const hostname = window.location.hostname;
  const whitelist = settings[KEYS.whitelist] || [];

  // Check if current site is whitelisted
  const isWhitelisted = whitelist.some(domain => {
    if (!domain) return false;
    return hostname === domain || hostname.endsWith('.' + domain);
  });

  if (!enabled || isWhitelisted) {
    styleEl.textContent = '';
    document.documentElement.classList.remove('bm-active');
    // Remove all revealed states when extension is toggled OFF
    document.querySelectorAll('.bm-revealed').forEach(el => {
      el.classList.remove('bm-revealed');
    });
    return;
  }

  document.documentElement.classList.add('bm-active');

  const selectors = [];
  const blockImages = settings[KEYS.blockImages] !== false; // default true
  const blockVideos = settings[KEYS.blockVideos] !== false; // default true
  const blockIframes = settings[KEYS.blockIframes] !== false; // default true

  if (blockImages) {
    selectors.push('html.bm-active img:not(.bm-revealed)');
    selectors.push('html.bm-active [style*="background-image"]:not(.bm-revealed)');
  }
  if (blockVideos) {
    selectors.push('html.bm-active video:not(.bm-revealed)');
  }
  if (blockIframes) {
    selectors.push('html.bm-active iframe:not(.bm-revealed)');
  }

  if (selectors.length === 0) {
    styleEl.textContent = '';
    return;
  }

  const selectorList = selectors.join(',\n');
  const blurLevel = settings[KEYS.blurLevel] ?? 40;
  const useGrayscale = settings[KEYS.grayscale] !== false;
  const mode = settings[KEYS.mode] ?? 'blur';
  const placeholderUrl = settings[KEYS.placeholderUrl] || DEFAULT_PLACEHOLDER;

  let rules = '';

  if (mode === 'blur') {
    rules = `
      ${selectorList} {
        filter: blur(${blurLevel}px) ${useGrayscale ? 'grayscale(100%)' : ''} !important;
        opacity: 0.8 !important;
        transition: filter 0.3s ease, opacity 0.3s ease !important;
      }
    `;
  } else if (mode === 'blackout') {
    rules = `
      ${selectorList} {
        filter: brightness(0) !important;
        background: #000000 !important;
        opacity: 1 !important;
        transition: filter 0.3s ease, background 0.3s ease !important;
      }
    `;
  } else if (mode === 'placeholder') {
    if (blockImages) {
      rules += `
        html.bm-active img:not(.bm-revealed) {
          content: url('${placeholderUrl}') !important;
          object-fit: cover !important;
          filter: none !important;
          opacity: 1 !important;
          transition: opacity 0.3s ease !important;
        }
        html.bm-active [style*="background-image"]:not(.bm-revealed) {
          background-image: url('${placeholderUrl}') !important;
          background-size: cover !important;
          background-position: center !important;
          filter: none !important;
          opacity: 1 !important;
          transition: opacity 0.3s ease !important;
        }
      `;
    }
    if (blockVideos) {
      rules += `
        html.bm-active video:not(.bm-revealed) {
          background-image: url('${placeholderUrl}') !important;
          background-size: cover !important;
          background-position: center !important;
          background-color: #1e293b !important;
          opacity: 0.8 !important;
          filter: none !important;
          transition: opacity 0.3s ease !important;
        }
      `;
    }
    if (blockIframes) {
      rules += `
        html.bm-active iframe:not(.bm-revealed) {
          background-image: url('${placeholderUrl}') !important;
          background-size: cover !important;
          background-position: center !important;
          background-color: #1e293b !important;
          opacity: 0.8 !important;
          filter: none !important;
          transition: opacity 0.3s ease !important;
        }
      `;
    }
  }

  styleEl.textContent = rules;
}

// Helper to refresh settings and update styles
function refreshStyles() {
  chrome.storage.sync.get({
    [KEYS.enabled]: true,
    [KEYS.mode]: 'blur',
    [KEYS.blurLevel]: 40,
    [KEYS.grayscale]: true,
    [KEYS.placeholderUrl]: DEFAULT_PLACEHOLDER,
    [KEYS.blockImages]: true,
    [KEYS.blockVideos]: true,
    [KEYS.blockIframes]: true,
    [KEYS.whitelist]: []
  }, (items) => {
    updateDynamicStyles(items);
  });
}

// 1. Initialize stylesheet
refreshStyles();

// 2. Listen to toggles and preference changes in real-time
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    // If any relevant key changes, refresh styles
    const relevantKeys = Object.values(KEYS);
    const hasChanges = Object.keys(changes).some(key => relevantKeys.includes(key));
    if (hasChanges) {
      refreshStyles();
    }
  }
});

// 3. Global click listener to reveal content on demand
document.addEventListener('click', (e) => {
  if (!document.documentElement.classList.contains('bm-active')) return;
  
  // Find if we clicked on a blocked element
  const target = e.target.closest('img, video, iframe, [style*="background-image"]');
  
  if (target && !target.classList.contains('bm-revealed')) {
    // Intercept the click on first click to reveal the blocked media
    e.preventDefault();
    e.stopPropagation();
    
    // Reveal it
    target.classList.add('bm-revealed');
    
    // If it is a video, optionally try to add controls or play it
    if (target.tagName === 'VIDEO') {
      target.controls = true;
    }
  }
}, true); // Capture phase is critical to intercept click handlers on links
