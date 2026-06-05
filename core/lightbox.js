/**
 * core/lightbox.js — Image lightbox with prev/next navigation
 * ============================================================
 * Uses event delegation: a single click handler at document level
 * catches clicks on any matching image, no need to attach to each one.
 * Auto-handles new images added by SPA navigation.
 */

const SELECTORS = [
  ".lesson-image-wrap img",
  ".lesson-image-wrap-large img",
  ".step-img img",
  ".lesson-stage img",
  ".symptom-step-img img",
];
const SELECTOR_STRING = SELECTORS.join(", ");

let overlayEl = null;
let imgEl = null;
let captionEl = null;
let counterEl = null;
let prevBtn = null;
let nextBtn = null;
let closeBtn = null;

let images = [];
let currentIndex = 0;

function _buildOverlay() {
  if (overlayEl) return;

  overlayEl = document.createElement("div");
  overlayEl.className = "lightbox-overlay";
  overlayEl.setAttribute("role", "dialog");
  overlayEl.setAttribute("aria-modal", "true");
  overlayEl.setAttribute("aria-label", "Hình ảnh phóng to");
  overlayEl.hidden = true;

  overlayEl.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Đóng">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <button class="lightbox-prev" type="button" aria-label="Ảnh trước">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <button class="lightbox-next" type="button" aria-label="Ảnh sau">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
    <div class="lightbox-stage">
      <img class="lightbox-img" alt="" />
    </div>
    <div class="lightbox-footer">
      <div class="lightbox-counter"></div>
      <div class="lightbox-caption"></div>
    </div>
  `;

  document.body.appendChild(overlayEl);

  imgEl = overlayEl.querySelector(".lightbox-img");
  captionEl = overlayEl.querySelector(".lightbox-caption");
  counterEl = overlayEl.querySelector(".lightbox-counter");
  prevBtn = overlayEl.querySelector(".lightbox-prev");
  nextBtn = overlayEl.querySelector(".lightbox-next");
  closeBtn = overlayEl.querySelector(".lightbox-close");

  closeBtn.addEventListener("click", _close);
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    _showPrev();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    _showNext();
  });
  overlayEl.addEventListener("click", (e) => {
    if (
      e.target === overlayEl ||
      e.target.classList.contains("lightbox-stage")
    ) {
      _close();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (overlayEl.hidden) return;
    if (e.key === "Escape") _close();
    else if (e.key === "ArrowLeft") _showPrev();
    else if (e.key === "ArrowRight") _showNext();
  });
}

function _show(index) {
  if (!images.length) return;
  currentIndex = ((index % images.length) + images.length) % images.length;
  const item = images[currentIndex];
  imgEl.src = item.src;
  imgEl.alt = item.caption || "";
  captionEl.textContent = item.caption || "";
  captionEl.style.display = item.caption ? "" : "none";
  counterEl.textContent =
    images.length > 1 ? `${currentIndex + 1} / ${images.length}` : "";
  prevBtn.style.display = images.length > 1 ? "" : "none";
  nextBtn.style.display = images.length > 1 ? "" : "none";
}

function _showPrev() {
  _show(currentIndex - 1);
}
function _showNext() {
  _show(currentIndex + 1);
}

function _open() {
  overlayEl.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => overlayEl.classList.add("is-open"));
}

function _close() {
  overlayEl.classList.remove("is-open");
  document.body.style.overflow = "";
  setTimeout(() => {
    overlayEl.hidden = true;
    imgEl.src = "";
  }, 200);
}

function _getCaption(img) {
  const wrap = img.closest(".lesson-image-wrap");
  if (wrap) {
    const cap = wrap.querySelector(".image-caption");
    if (cap) return cap.textContent.trim();
  }
  return img.alt || "";
}

/**
 * Initialize the lightbox once. Uses event delegation — no need to
 * re-attach handlers when content changes.
 */
export function initLightbox() {
  _buildOverlay();

  // Single global click handler — works for all current AND future images
  document.addEventListener(
    "click",
    (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      if (!img.matches(SELECTOR_STRING)) return;
      // Don't intercept if image is inside a real link
      if (img.closest("a[href]")) return;

      e.preventDefault();
      e.stopPropagation();

      const allImgs = Array.from(document.querySelectorAll(SELECTOR_STRING));
      images = allImgs.map((i) => ({
        src: i.src,
        caption: _getCaption(i),
      }));

      const idx = allImgs.indexOf(img);
      _show(idx >= 0 ? idx : 0);
      _open();
    },
    true, // capture phase
  );

  if (typeof window !== "undefined" && window.__lightboxDebug) {
    console.log("[Lightbox] initialized with event delegation");
  }
}

// Backward-compat alias (no-op in delegation mode)
export function attachLightboxToImages() {}
