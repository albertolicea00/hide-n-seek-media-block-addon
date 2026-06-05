// options.js

// Configuration Constants
const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
const STORAGE_KEYS = {
  reloadOnToggle: 'bm_reload_on_toggle',
  obfuscationMode: 'bm_obfuscation_mode',
  blurLevel: 'bm_blur_level',
  grayscale: 'bm_grayscale',
  placeholderUrl: 'bm_placeholder_url',
  blockImages: 'bm_block_images',
  blockVideos: 'bm_block_videos',
  blockIframes: 'bm_block_iframes',
  whitelist: 'bm_whitelist'
};

// UI Elements
const ui = {
  reloadOnToggle: document.getElementById('reloadOnToggle'),
  obfuscationMode: document.getElementById('obfuscationMode'),
  blurLevel: document.getElementById('blurLevel'),
  blurIntensityValue: document.getElementById('blurIntensityValue'),
  useGrayscale: document.getElementById('useGrayscale'),
  placeholderUrl: document.getElementById('placeholderUrl'),
  placeholderPreview: document.getElementById('placeholderPreview'),
  btnResetPlaceholder: document.getElementById('btnResetPlaceholder'),
  blockImages: document.getElementById('blockImages'),
  blockVideos: document.getElementById('blockVideos'),
  blockIframes: document.getElementById('blockIframes'),
  whitelist: document.getElementById('whitelist'),
  toast: document.getElementById('toast'),
  
  // Sections
  blurOptionsSection: document.getElementById('blurOptionsSection'),
  placeholderOptionsSection: document.getElementById('placeholderOptionsSection')
};

// Toast notification helper
let toastTimeout;
function showToast() {
  clearTimeout(toastTimeout);
  ui.toast.classList.add('show');
  toastTimeout = setTimeout(() => {
    ui.toast.classList.remove('show');
  }, 2000);
}

// Update UI sections based on obfuscation mode selection
function handleModeVisibility(mode) {
  // Hide sections
  ui.blurOptionsSection.classList.remove('visible');
  ui.placeholderOptionsSection.classList.remove('visible');

  if (mode === 'blur') {
    ui.blurOptionsSection.classList.add('visible');
  } else if (mode === 'placeholder') {
    ui.placeholderOptionsSection.classList.add('visible');
    // Live update preview image
    updatePlaceholderPreview(ui.placeholderUrl.value || DEFAULT_PLACEHOLDER);
  }
}

// Update the placeholder preview thumbnail image
function updatePlaceholderPreview(url) {
  if (url) {
    ui.placeholderPreview.style.backgroundImage = `url('${url}')`;
  } else {
    ui.placeholderPreview.style.backgroundImage = `url('${DEFAULT_PLACEHOLDER}')`;
  }
}

// Load configurations from chrome.storage.sync
function loadOptions() {
  chrome.storage.sync.get({
    [STORAGE_KEYS.reloadOnToggle]: false,
    [STORAGE_KEYS.obfuscationMode]: 'blur',
    [STORAGE_KEYS.blurLevel]: 40,
    [STORAGE_KEYS.grayscale]: true,
    [STORAGE_KEYS.placeholderUrl]: DEFAULT_PLACEHOLDER,
    [STORAGE_KEYS.blockImages]: true,
    [STORAGE_KEYS.blockVideos]: true,
    [STORAGE_KEYS.blockIframes]: true,
    [STORAGE_KEYS.whitelist]: []
  }, (items) => {
    // Populate form fields
    ui.reloadOnToggle.checked = items[STORAGE_KEYS.reloadOnToggle];
    ui.obfuscationMode.value = items[STORAGE_KEYS.obfuscationMode];
    ui.blurLevel.value = items[STORAGE_KEYS.blurLevel];
    ui.blurIntensityValue.textContent = `${items[STORAGE_KEYS.blurLevel]}px`;
    ui.useGrayscale.checked = items[STORAGE_KEYS.grayscale];
    ui.placeholderUrl.value = items[STORAGE_KEYS.placeholderUrl];
    ui.blockImages.checked = items[STORAGE_KEYS.blockImages];
    ui.blockVideos.checked = items[STORAGE_KEYS.blockVideos];
    ui.blockIframes.checked = items[STORAGE_KEYS.blockIframes];
    
    // Whitelist is stored as array, display as newline-separated string
    ui.whitelist.value = (items[STORAGE_KEYS.whitelist] || []).join('\n');

    // Run visibility handler
    handleModeVisibility(items[STORAGE_KEYS.obfuscationMode]);
  });
}

// Save options to chrome.storage.sync
function saveOptions() {
  const whitelistArray = ui.whitelist.value
    .split('\n')
    .map(line => line.trim().toLowerCase())
    .filter(line => line.length > 0);

  chrome.storage.sync.set({
    [STORAGE_KEYS.reloadOnToggle]: ui.reloadOnToggle.checked,
    [STORAGE_KEYS.obfuscationMode]: ui.obfuscationMode.value,
    [STORAGE_KEYS.blurLevel]: parseInt(ui.blurLevel.value, 10),
    [STORAGE_KEYS.grayscale]: ui.useGrayscale.checked,
    [STORAGE_KEYS.placeholderUrl]: ui.placeholderUrl.value || DEFAULT_PLACEHOLDER,
    [STORAGE_KEYS.blockImages]: ui.blockImages.checked,
    [STORAGE_KEYS.blockVideos]: ui.blockVideos.checked,
    [STORAGE_KEYS.blockIframes]: ui.blockIframes.checked,
    [STORAGE_KEYS.whitelist]: whitelistArray
  }, () => {
    showToast();
  });
}

// Event Listeners initialization
function initEventListeners() {
  // Save options on change of simple form controls
  const autoSaveElements = [
    ui.reloadOnToggle,
    ui.useGrayscale,
    ui.blockImages,
    ui.blockVideos,
    ui.blockIframes
  ];

  autoSaveElements.forEach(element => {
    element.addEventListener('change', saveOptions);
  });

  // Mode select change handler
  ui.obfuscationMode.addEventListener('change', () => {
    handleModeVisibility(ui.obfuscationMode.value);
    saveOptions();
  });

  // Blur level slider change handler (saving on mouseup/touchend to avoid excessive storage writes)
  ui.blurLevel.addEventListener('input', () => {
    ui.blurIntensityValue.textContent = `${ui.blurLevel.value}px`;
  });
  ui.blurLevel.addEventListener('change', saveOptions);

  // Placeholder url changes
  ui.placeholderUrl.addEventListener('input', () => {
    const url = ui.placeholderUrl.value.trim();
    updatePlaceholderPreview(url);
  });
  ui.placeholderUrl.addEventListener('change', saveOptions);

  // Reset default placeholder button click
  ui.btnResetPlaceholder.addEventListener('click', () => {
    ui.placeholderUrl.value = DEFAULT_PLACEHOLDER;
    updatePlaceholderPreview(DEFAULT_PLACEHOLDER);
    saveOptions();
  });

  // Save whitelist on blur of textarea (user finished editing)
  ui.whitelist.addEventListener('blur', saveOptions);
}

// Load option pages
document.addEventListener('DOMContentLoaded', () => {
  loadOptions();
  initEventListeners();
});
