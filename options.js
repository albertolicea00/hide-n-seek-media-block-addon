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
  whitelist: 'bm_whitelist',
  customSelectors: 'bm_custom_selectors'
};

// Local Lists State
const state = {
  whitelist: [],
  customSelectors: []
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
  whitelistInput: document.getElementById('whitelist-input'),
  whitelistError: document.getElementById('whitelist-error'),
  selectorsInput: document.getElementById('selectors-input'),
  selectorsError: document.getElementById('selectors-error'),
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

// Render tag chips helper
function renderTags(listId, tagArray, onRemoveCallback) {
  const listEl = document.getElementById(listId);
  if (!listEl) return;
  
  listEl.innerHTML = '';
  tagArray.forEach((tag, index) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.textContent = tag;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-tag-btn';
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
      onRemoveCallback(index);
    });
    
    chip.appendChild(removeBtn);
    listEl.appendChild(chip);
  });
}

function renderWhitelistTags() {
  renderTags('whitelist-tags-list', state.whitelist, (index) => {
    state.whitelist.splice(index, 1);
    renderWhitelistTags();
    saveOptions();
  });
}

function renderSelectorsTags() {
  renderTags('selectors-tags-list', state.customSelectors, (index) => {
    state.customSelectors.splice(index, 1);
    renderSelectorsTags();
    saveOptions();
  });
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
    [STORAGE_KEYS.whitelist]: [],
    [STORAGE_KEYS.customSelectors]: []
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
    
    // Update local state lists
    state.whitelist = items[STORAGE_KEYS.whitelist] || [];
    state.customSelectors = items[STORAGE_KEYS.customSelectors] || [];

    // Render chips
    renderWhitelistTags();
    renderSelectorsTags();

    // Run visibility handler
    handleModeVisibility(items[STORAGE_KEYS.obfuscationMode]);
  });
}

// Save options to chrome.storage.sync
function saveOptions() {
  chrome.storage.sync.set({
    [STORAGE_KEYS.reloadOnToggle]: ui.reloadOnToggle.checked,
    [STORAGE_KEYS.obfuscationMode]: ui.obfuscationMode.value,
    [STORAGE_KEYS.blurLevel]: parseInt(ui.blurLevel.value, 10),
    [STORAGE_KEYS.grayscale]: ui.useGrayscale.checked,
    [STORAGE_KEYS.placeholderUrl]: ui.placeholderUrl.value || DEFAULT_PLACEHOLDER,
    [STORAGE_KEYS.blockImages]: ui.blockImages.checked,
    [STORAGE_KEYS.blockVideos]: ui.blockVideos.checked,
    [STORAGE_KEYS.blockIframes]: ui.blockIframes.checked,
    [STORAGE_KEYS.whitelist]: state.whitelist,
    [STORAGE_KEYS.customSelectors]: state.customSelectors
  }, () => {
    showToast();
  });
}

// Validate CSS Selector using browser native parser, rejecting plain tag names (e.g. 'a', 'div')
function isValidCSSSelector(selector) {
  if (!selector || selector.trim() === '') return false;
  
  // 1. Syntactic validation using browser parser
  try {
    document.createDocumentFragment().querySelector(selector);
  } catch (e) {
    return false;
  }

  // 2. Reject plain HTML tags (like 'a', 'div', 'p') because they are too generic
  // Custom CSS selectors are meant to target specific elements using classes, IDs, attributes, etc.
  const plainTagRegex = /^[a-zA-Z0-9]+$/;
  if (plainTagRegex.test(selector.trim())) {
    return false;
  }

  return true;
}

// Validate Domain (supports standard domains and *.domain wildcards)
function isValidDomain(domain) {
  if (!domain) return false;
  // Regex matches standard domains and subdomains, plus optional leading *. wildcard
  const domainRegex = /^(?:\*\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(?:\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
  return domainRegex.test(domain);
}

// Process tag additions on keystroke or blur with validation
function processTagInput(inputEl, tagArray, renderFn) {
  const val = inputEl.value.trim();
  const isWhitelist = inputEl.id === 'whitelist-input';
  const errorEl = isWhitelist ? ui.whitelistError : ui.selectorsError;

  if (!val) {
    // Clear error style and message if input is empty
    inputEl.classList.remove('invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
    return;
  }

  // Whitelist: split by comma or spaces; Selectors: split ONLY by comma (supporting spaces)
  const splitRegex = isWhitelist ? /[,\s]+/ : /,+/;
  const parts = val.split(splitRegex).map(p => p.trim()).filter(p => p.length > 0);
  
  const invalidParts = [];
  const validParts = [];

  parts.forEach(part => {
    if (isWhitelist) {
      const formatted = part.toLowerCase();
      if (isValidDomain(formatted)) {
        if (!tagArray.includes(formatted)) {
          validParts.push(formatted);
        }
      } else {
        invalidParts.push(part);
      }
    } else {
      if (isValidCSSSelector(part)) {
        if (!tagArray.includes(part)) {
          validParts.push(part);
        }
      } else {
        invalidParts.push(part);
      }
    }
  });

  if (invalidParts.length > 0) {
    console.warn(`🙈 Hide & Seek: Validation failed for input on ${inputEl.id}. Invalid parts:`, invalidParts);
    // Mark input container as invalid
    inputEl.classList.add('invalid');
    
    // Set custom error message
    if (errorEl) {
      errorEl.textContent = isWhitelist 
        ? "Invalid domain format (e.g. *.example.com or example.com)."
        : "Invalid selector (use classes like .banner, IDs like #media, or complex rules. Plain HTML tags like 'a' or 'div' are not allowed).";
      errorEl.style.display = 'block';
    }
    
    // Keep only the invalid parts in the input field for correction
    inputEl.value = invalidParts.join(', ');
  } else {
    inputEl.classList.remove('invalid');
    inputEl.value = '';
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  if (validParts.length > 0) {
    console.log(`🙈 Hide & Seek: Adding new valid entries:`, validParts);
    tagArray.push(...validParts);
    renderFn();
    saveOptions();
  }
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

  // Whitelist chips input handlers
  ui.whitelistInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      processTagInput(ui.whitelistInput, state.whitelist, renderWhitelistTags);
    }
  });
  ui.whitelistInput.addEventListener('blur', () => {
    processTagInput(ui.whitelistInput, state.whitelist, renderWhitelistTags);
  });

  // Custom Selectors chips input handlers
  ui.selectorsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      processTagInput(ui.selectorsInput, state.customSelectors, renderSelectorsTags);
    }
  });
  ui.selectorsInput.addEventListener('blur', () => {
    processTagInput(ui.selectorsInput, state.customSelectors, renderSelectorsTags);
  });
}

// Load option pages
document.addEventListener('DOMContentLoaded', () => {
  loadOptions();
  initEventListeners();
});
