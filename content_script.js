// content_script.js
// Reemplaza imgs, videos y elementos con background-image por placeholders.
// Permite click para ver el original.
// Observa cambios dinámicos.

const PLACEHOLDER_CLASS = 'bm-placeholder';
const ATTR_ORIG = 'data-bm-orig';
const STORAGE_KEY = 'bm_block_enabled';


// SVG placeholder as data URL (keeps file count low)
const svgPlaceholder = encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'>
  <rect width='100%' height='100%' fill='#f2f2f2'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='16' fill='#888'>
    Content blocked — click to show
  </text>
</svg>`);

function isElementProcessed(el) {
  return el.classList && el.classList.contains(PLACEHOLDER_CLASS);
}

function makePlaceholderElement(width, height, extraClass = '') {
  const div = document.createElement('div');
  div.className = `bm-placeholder ${extraClass}`.trim();
  div.style.display = 'inline-block';
  if (width) div.style.width = (typeof width === 'number' ? width + 'px' : width);
  if (height) div.style.height = (typeof height === 'number' ? height + 'px' : height);
  div.style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,${svgPlaceholder}")`;
  div.style.backgroundRepeat = 'no-repeat';
  div.style.backgroundPosition = 'center';
  div.style.backgroundSize = 'contain';
  div.style.cursor = 'pointer';
  div.style.border = '1px solid rgba(0,0,0,0.04)';
  return div;
}

function replaceImage(img) {
  if (!img || isElementProcessed(img)) return;
  const rect = img.getBoundingClientRect();
  const w = rect.width || img.width || img.naturalWidth || img.style.width;
  const h = rect.height || img.height || img.naturalHeight || img.style.height;

  const placeholder = makePlaceholderElement(w + 'px', h + 'px');
  placeholder.setAttribute(ATTR_ORIG, img.src || '');
  img.style.display = 'none';
  img.parentNode && img.parentNode.insertBefore(placeholder, img);

  placeholder.addEventListener('click', async (e) => {
    // restore image: remove placeholder and show image
    img.style.display = '';
    placeholder.remove();
  });

  placeholder.addEventListener('contextmenu', (e) => {
    // allow right-click menu on placeholder
    e.stopPropagation();
  }, true);

  // mark original element in case we need it later
  img.classList.add('bm-original-hidden');
}

function replaceVideo(video) {
  if (!video || isElementProcessed(video)) return;
  const rect = video.getBoundingClientRect();
  const w = rect.width || video.width || video.style.width;
  const h = rect.height || video.height || video.style.height;
  const placeholder = makePlaceholderElement(w + 'px', h + 'px', 'bm-video-placeholder');
  placeholder.setAttribute(ATTR_ORIG, video.currentSrc || video.src || '');
  video.style.display = 'none';
  video.parentNode && video.parentNode.insertBefore(placeholder, video);

  placeholder.addEventListener('click', (e) => {
    // show a simple lightbox with video
    showMediaLightbox(video);
  });

  video.classList.add('bm-original-hidden');
}

function replaceBackground(el, bgUrl) {
  if (!el || isElementProcessed(el)) return;
  const rect = el.getBoundingClientRect();
  const w = rect.width || el.style.width;
  const h = rect.height || el.style.height;
  const placeholder = makePlaceholderElement(w + 'px', h + 'px', 'bm-bg-placeholder');
  placeholder.setAttribute(ATTR_ORIG, bgUrl);
  // copy positioning so placeholder sits where the element is
  placeholder.style.display = 'block';
  // insert placeholder as first child so layout similar
  el.dataset.bmHasPlaceholder = '1';
  el.style.backgroundImage = 'none';
  el.insertBefore(placeholder, el.firstChild);

  placeholder.addEventListener('click', (e) => {
    // restore background
    el.style.backgroundImage = `url("${bgUrl}")`;
    placeholder.remove();
  });
}

function showMediaLightbox(mediaEl) {
  // create overlay
  const overlay = document.createElement('div');
  overlay.className = 'bm-lightbox-overlay';
  overlay.style.position = 'fixed';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.zIndex = 2147483647;
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.background = 'rgba(0,0,0,0.85)';

  // clone the video element to the overlay (so we can play)
  const clone = mediaEl.cloneNode(true);
  clone.style.maxWidth = '90%';
  clone.style.maxHeight = '90%';
  clone.controls = true;
  clone.autoplay = true;

  // close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.appendChild(clone);
  document.body.appendChild(overlay);
}

function processAll() {
  // images
  document.querySelectorAll('img').forEach(img => {
    // ignore if invisible or data URLs already
    if (!img.src) return;
    replaceImage(img);
  });

  // videos
  document.querySelectorAll('video').forEach(video => {
    replaceVideo(video);
  });

  // background images (inline or computed)
  // check all elements with background-image style
  const all = Array.from(document.querySelectorAll('*'));
  all.forEach(el => {
    try {
      const style = window.getComputedStyle(el);
      const bg = style.getPropertyValue('background-image');
      if (bg && bg !== 'none' && bg.includes('url')) {
        // extract url
        const m = /url\((['"]?)(.*?)\1\)/.exec(bg);
        if (m && m[2]) {
          const url = m[2];
          replaceBackground(el, url);
        }
      }
    } catch (e) {
      // computed style may throw for some elements (SVG etc)
    }
  });
}

function startObserver() {
  const mo = new MutationObserver(mutations => {
    for (const mut of mutations) {
      // new nodes
      if (mut.addedNodes && mut.addedNodes.length) {
        mut.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          if (node.tagName === 'IMG') replaceImage(node);
          else if (node.tagName === 'VIDEO') replaceVideo(node);
          else {
            // images inside node
            node.querySelectorAll && node.querySelectorAll('img').forEach(replaceImage);
            node.querySelectorAll && node.querySelectorAll('video').forEach(replaceVideo);
            // background images
            try {
              const style = window.getComputedStyle(node);
              const bg = style && style.getPropertyValue('background-image');
              if (bg && bg.includes('url')) {
                const m = /url\\((['"]?)(.*?)\\1\\)/.exec(bg);
                if (m && m[2]) replaceBackground(node, m[2]);
              }
            } catch (e) {}
          }
        });
      }

      // attribute changes (e.g., img.src updated)
      if (mut.type === 'attributes' && mut.target) {
        if (mut.target.tagName === 'IMG') replaceImage(mut.target);
        if (mut.target.tagName === 'VIDEO') replaceVideo(mut.target);
      }
    }
  });

  mo.observe(document.documentElement || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style'] });
}

// check storage to see if blocking enabled
function checkAndRun() {
  chrome.storage.sync.get([STORAGE_KEY], (res) => {
    const enabled = (res[STORAGE_KEY] !== false); // default true
    if (enabled) {
      processAll();
      startObserver();
    } else {
      // if disabled, remove placeholders and show originals
      document.querySelectorAll('.bm-placeholder').forEach(ph => {
        const orig = ph.getAttribute(ATTR_ORIG);
        const next = ph.nextElementSibling;
        // try to unhide original elements with class 'bm-original-hidden'
        const original = ph.parentNode && ph.parentNode.querySelector('.bm-original-hidden');
        if (original) original.style.display = '';
        ph.remove();
      });
    }
  });
}

// run immediately
checkAndRun();

// also listen to storage changes so popup can toggle live
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes[STORAGE_KEY]) {
    checkAndRun();
  }
});
