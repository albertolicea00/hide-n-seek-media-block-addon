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
  whitelist: 'bm_whitelist',
  customSelectors: 'bm_custom_selectors'
};

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

// Active selectors list used for click interception (updated dynamically)
let activeClickSelectors = 'img, video, iframe, [style*="background-image"]';

// Function to generate and apply dynamic style rules
function updateDynamicStyles(settings) {
  console.debug('🙈 Hide & Seek: Running style updates with settings:', settings);
  
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

  // Check if current site is whitelisted (supports standard domains and *.domain wildcards)
  const isWhitelisted = whitelist.some(rule => {
    if (!rule) return false;
    
    // Normalize rule: remove leading '*.' or '.' if present
    const cleanRule = rule.startsWith('*.') 
      ? rule.substring(2) 
      : (rule.startsWith('.') ? rule.substring(1) : rule);
    
    return hostname === cleanRule || hostname.endsWith('.' + cleanRule);
  });

  if (!enabled || isWhitelisted) {
    styleEl.textContent = '';
    document.documentElement.classList.remove('bm-active');
    // Remove all revealed states when extension is toggled OFF
    document.querySelectorAll('.bm-revealed').forEach(el => {
      el.classList.remove('bm-revealed');
    });
    if (!enabled) {
      console.info('🙈 Hide & Seek: Blocker is disabled globally.');
    } else {
      console.info(`🙈 Hide & Seek: Current domain (${hostname}) is whitelisted. Blocker disabled for this page.`);
    }
    return;
  }

  try {
    document.documentElement.classList.add('bm-active');

  const selectors = [];
  const blockImages = settings[KEYS.blockImages] !== false; // default true
  const blockVideos = settings[KEYS.blockVideos] !== false; // default true
  const blockIframes = settings[KEYS.blockIframes] !== false; // default true
  const customSelectors = settings[KEYS.customSelectors] || [];

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

  // Add custom selectors
  customSelectors.forEach(sel => {
    if (sel) {
      selectors.push(`html.bm-active ${sel}:not(.bm-revealed)`);
    }
  });

  // Re-build active selector list for click-to-reveal target matching
  const baseClickSelectors = [];
  if (blockImages) {
    baseClickSelectors.push('img', '[style*="background-image"]');
  }
  if (blockVideos) {
    baseClickSelectors.push('video');
  }
  if (blockIframes) {
    baseClickSelectors.push('iframe');
  }
  customSelectors.forEach(sel => {
    if (sel) {
      baseClickSelectors.push(sel);
    }
  });
  activeClickSelectors = baseClickSelectors.join(', ');

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

    // Apply generic placeholder style to custom selectors in placeholder mode
    const validCustoms = customSelectors.filter(sel => !!sel);
    if (validCustoms.length > 0) {
      const customSelectorList = validCustoms.map(sel => `html.bm-active ${sel}:not(.bm-revealed)`).join(',\n');
      rules += `
        ${customSelectorList} {
          background-image: url('${placeholderUrl}') !important;
          background-size: cover !important;
          background-position: center !important;
          background-color: #1e293b !important;
          color: transparent !important;
          text-shadow: none !important;
          opacity: 0.85 !important;
        }
      `;
    }
  }

    styleEl.textContent = rules;
    console.info(`🙈 Hide & Seek: Active blocking rules injected. Mode: "${mode}". Selectors count: ${selectors.length}. Active selector list:`, activeClickSelectors);
  } catch (err) {
    console.error('🙈 Hide & Seek: Error applying dynamic styles:', err.message);
  }
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
    [KEYS.whitelist]: [],
    [KEYS.customSelectors]: []
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
  
  // Find if we clicked on a blocked element (dynamic selector matching)
  const target = e.target.closest(activeClickSelectors || 'img, video, iframe, [style*="background-image"]');
  
  if (target && !target.classList.contains('bm-revealed')) {
    console.log('🙈 Hide & Seek: Intercepted click on blocked element. Revealing media:', target);
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
