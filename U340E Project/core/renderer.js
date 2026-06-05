/**
 * renderer.js — Shared DOM Rendering Utilities
 * ==============================================
 * Handles:
 *   - Page root swaps (with loading state)
 *   - Sidebar navigation tree
 *   - Breadcrumb updates
 *   - Sidebar open/close state
 *   - Generic HTML helpers
 */

import { store } from "./store.js";

// ── DOM References ───────────────────────────────────────────────
const pageRoot = document.getElementById("page-root");
const sidebarNav = document.getElementById("sidebar-nav");
const breadcrumbEl = document.getElementById("header-breadcrumb");
const loadingEl = document.getElementById("content-loading");
const sidebarEl = document.getElementById("sidebar");
const overlayEl = document.getElementById("sidebar-overlay");

// ── Page Rendering ───────────────────────────────────────────────

/**
 * Replace the main content area with new HTML.
 * Triggers a subtle fade-in animation.
 * @param {string} html
 */
export function renderPage(html) {
  hideLoading();
  pageRoot.innerHTML = html;
  // Scroll to top on page change
  window.scrollTo({ top: 0, behavior: "instant" });
}

export function showLoading() {
  loadingEl.hidden = false;
  pageRoot.innerHTML = "";
}

export function hideLoading() {
  loadingEl.hidden = true;
}

// ── Sidebar Navigation ───────────────────────────────────────────

/**
 * Render the full sidebar navigation tree from sections data.
 * Called once after sections.json is loaded.
 * @param {Array} sections
 */
export function renderSidebarNav(sections) {
  if (!sections) return;

  const activeSectionId = store.get("activeSectionId");
  const activeSubId = store.get("activeSubId");
  const activeDtcCode = store.get("activeDtcCode");

  let html = "";

  sections.forEach((section) => {
    const isActive = activeSectionId === section.id;
    const isExpanded = isActive;

    // Section button
    html += `
      <div class="nav-section" data-section-id="${section.id}">
        <button
          class="nav-section-btn ${isActive ? "active-section" : ""}"
          aria-expanded="${isExpanded}"
          data-section-id="${section.id}"
          data-is-dtc="${section.isDtcSection || false}"
        >
          <span class="nav-section-num">${section.id}</span>
          <span class="nav-section-label">${escapeHtml(section.title)}</span>
          <svg class="nav-section-arrow" width="14" height="14" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
    `;

    // Subsection list (only for non-DTC sections with subsections)
    if (!section.isDtcSection && section.subsections?.length > 0) {
      html += `<ul class="nav-subsection-list ${isExpanded ? "is-open" : ""}"
                   id="nav-sub-list-${section.id}">`;

      section.subsections.forEach((sub) => {
        const isActiveSub = activeSubId === sub.id;
        html += `
          <li>
            <a href="#/section/${section.id}/${sub.id}"
               class="nav-subsection-link ${isActiveSub ? "active-sub" : ""}"
               data-sub-id="${sub.id}">
              <span class="nav-sub-id">${escapeHtml(sub.id)}</span>
              <span class="nav-sub-label">${escapeHtml(sub.title)}</span>
            </a>
          </li>
        `;
      });

      html += `</ul>`;
    }

    html += `</div>`; // end nav-section
  });

  // DTC standalone nav link (always at bottom)
  html += `
    <a href="#/dtc"
       class="nav-dtc-link ${activeDtcCode ? "active-dtc" : ""}"
       aria-label="Danh mục mã lỗi DTC">
      <span class="nav-dtc-dot"></span>
      <span class="nav-dtc-label">Tra Cứu Mã Lỗi DTC</span>
    </a>
  `;

  sidebarNav.innerHTML = html;

  // Wire up toggle buttons
  _bindSidebarToggles();
}

/**
 * Update the active highlights in the sidebar without full re-render.
 * More efficient than calling renderSidebarNav() on every nav.
 */
export function updateSidebarActive() {
  const activeSectionId = store.get("activeSectionId");
  const activeSubId = store.get("activeSubId");

  // Update section buttons
  sidebarNav.querySelectorAll(".nav-section-btn").forEach((btn) => {
    const id = parseInt(btn.dataset.sectionId, 10);
    btn.classList.toggle("active-section", id === activeSectionId);

    // Update num badge style (done via class above)
  });

  // Update subsection links
  sidebarNav.querySelectorAll(".nav-subsection-link").forEach((link) => {
    link.classList.toggle("active-sub", link.dataset.subId === activeSubId);
  });

  // Expand/collapse subsection lists
  sidebarNav.querySelectorAll(".nav-subsection-list").forEach((list) => {
    const sectionId = parseInt(list.id.replace("nav-sub-list-", ""), 10);
    list.classList.toggle("is-open", sectionId === activeSectionId);
  });

  // Update section btn aria-expanded
  sidebarNav.querySelectorAll(".nav-section-btn").forEach((btn) => {
    const id = parseInt(btn.dataset.sectionId, 10);
    btn.setAttribute(
      "aria-expanded",
      id === activeSectionId ? "true" : "false",
    );
  });
}

// ── Breadcrumb ───────────────────────────────────────────────────

/**
 * Update the header breadcrumb.
 * @param {Array<{label: string, href?: string}>} items
 *
 * The first item with href === "#/" is ALWAYS rendered as a clickable link,
 * even when it's also the last (current) item. The user must be able to click
 * "Trang Chủ" from anywhere to return home — including the home page itself.
 */
export function renderBreadcrumb(items) {
  if (!items.length) {
    // Defensive fallback: if a route forgets to set a breadcrumb, at least
    // keep a "Trang Chủ" link in the DOM so the user is never stranded.
    breadcrumbEl.innerHTML = `<a href="#/" class="breadcrumb-item">Trang Chủ</a>`;
    return;
  }

  const parts = items.map((item, i) => {
    const isLast = i === items.length - 1;
    const sep = i > 0 ? `<span class="breadcrumb-sep">›</span>` : "";

    // Home link is always clickable — even when it's the only/last item.
    const isHomeLink = item.href === "#/";
    if (isHomeLink) {
      const activeCls = isLast ? " active" : "";
      return `${sep}<a href="${item.href}" class="breadcrumb-item${activeCls}">${escapeHtml(item.label)}</a>`;
    }

    if (isLast || !item.href) {
      return `${sep}<span class="breadcrumb-item active">${escapeHtml(item.label)}</span>`;
    }
    return `${sep}<a href="${item.href}" class="breadcrumb-item">${escapeHtml(item.label)}</a>`;
  });

  breadcrumbEl.innerHTML = parts.join("");
}

// ── Sidebar Open/Close ───────────────────────────────────────────

const SIDEBAR_COLLAPSED_KEY = "u340e:sidebarCollapsed";

export function openSidebar() {
  if (window.innerWidth >= 1024) {
    // Desktop: remove collapsed class to show sidebar
    document.body.classList.remove("sidebar-collapsed");
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, "false");
    store.set("sidebarOpen", true);
  } else {
    // Mobile: slide sidebar in over content
    sidebarEl.classList.add("is-open");
    overlayEl.classList.add("is-visible");
    store.set("sidebarOpen", true);
    document.body.style.overflow = "hidden"; // prevent background scroll
  }
}

export function closeSidebar() {
  if (window.innerWidth >= 1024) {
    // Desktop: add collapsed class to hide sidebar
    document.body.classList.add("sidebar-collapsed");
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, "true");
    store.set("sidebarOpen", false);
  } else {
    // Mobile: hide overlay
    sidebarEl.classList.remove("is-open");
    overlayEl.classList.remove("is-visible");
    store.set("sidebarOpen", false);
    document.body.style.overflow = "";
  }
}

export function toggleSidebar() {
  if (window.innerWidth >= 1024) {
    // Desktop: check body class
    document.body.classList.contains("sidebar-collapsed")
      ? openSidebar()
      : closeSidebar();
  } else {
    // Mobile: check sidebar class
    store.get("sidebarOpen") ? closeSidebar() : openSidebar();
  }
}

// Restore collapsed state on page load (desktop only)
if (typeof window !== "undefined") {
  const restoreSidebarState = () => {
    if (window.innerWidth >= 1024) {
      const wasCollapsed =
        localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
      if (wasCollapsed) {
        document.body.classList.add("sidebar-collapsed");
      }
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restoreSidebarState);
  } else {
    restoreSidebarState();
  }
}

// ── HTML Helpers ─────────────────────────────────────────────────

/**
 * Escape HTML special characters to prevent XSS.
 */
export function escapeHtml(str) {
  if (typeof str !== "string") return String(str ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Format inline content text with minimal, safe markdown support.
 * Escapes HTML FIRST (XSS protection), then converts:
 *   - **bold** → <strong>bold</strong>
 *   - Line breaks (\n) → <br>
 *
 * This is for content block text (explain, stages, etc.) — NOT for
 * headings or user input. Always use escapeHtml() for unformatted text.
 */
export function formatInlineText(str) {
  if (typeof str !== "string") return String(str ?? "");
  // 1. Escape HTML first (XSS safe)
  let safe = escapeHtml(str);
  // 2. Convert **bold** → <strong>
  safe = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // 3. Convert [arrow:color] markers → inline SVG arrow (oil-flow legend)
  //    Supported colors: green, blue, yellow, orange, purple
  safe = safe.replace(
    /\[arrow:(green|blue|yellow|orange|purple)\]/g,
    (_, color) => {
      const colorMap = {
        green: "#22c55e",
        blue: "#3b82f6",
        yellow: "#eab308",
        orange: "#f97316",
        purple: "#a855f7",
      };
      const stroke = colorMap[color];
      return (
        `<svg class="oil-arrow" viewBox="0 0 28 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<polyline points="2,3 14,8 2,13" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<polyline points="9,3 21,8 9,13" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` +
        `</svg>`
      );
    },
  );
  // 4. Convert [sub:text] → <sub>text</sub>  (e.g. T[sub:R1] → T<sub>R1</sub>)
  //    Convert [sup:text] → <sup>text</sup>  (bonus superscript support)
  //    Allowed chars inside: letters, digits, comma, dot, minus, plus, space, parens
  safe = safe.replace(/\[sub:([\w,.\-+ ()]+)\]/g, "<sub>$1</sub>");
  safe = safe.replace(/\[sup:([\w,.\-+ ()]+)\]/g, "<sup>$1</sup>");
  // 5. Convert line breaks → <br>
  safe = safe.replace(/\n/g, "<br>");
  return safe;
}

/**
 * Render LaTeX math string to HTML using KaTeX.
 * Requires KaTeX to be loaded globally (via <script> in index.html).
 *
 * @param {string} latex - LaTeX source string
 * @param {boolean} displayMode - true = block (centered, large), false = inline
 * @returns {string} HTML string (already safe)
 */
export function renderLatex(latex, displayMode = true) {
  if (typeof latex !== "string" || !latex.trim()) return "";
  // KaTeX is loaded globally from vendor/katex/katex.min.js
  if (typeof window === "undefined" || !window.katex) {
    // Fallback: show as code if KaTeX not loaded yet
    return `<code>${escapeHtml(latex)}</code>`;
  }
  try {
    return window.katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: "ignore",
    });
  } catch (err) {
    console.warn("KaTeX render error:", err);
    return `<code>${escapeHtml(latex)}</code>`;
  }
}

/**
 * Build a simple back button HTML string.
 * @param {string} href
 * @param {string} label
 */
export function backButtonHtml(href, label = "Quay lại") {
  return `
    <a href="${href}" class="btn-back">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      ${escapeHtml(label)}
    </a>
  `;
}

/**
 * Image or placeholder if src not provided.
 */
export function imageOrPlaceholder(img) {
  if (img.src) {
    return `
      <figure style="margin: var(--space-6) 0;">
        <img src="${escapeHtml(img.src)}"
             alt="${escapeHtml(img.alt || "")}"
             style="max-width:100%; border-radius: var(--radius-md); border: var(--border-thin);"
             loading="lazy" />
        ${
          img.caption
            ? `<figcaption style="font-size:var(--text-sm); color:var(--color-slate-500);
                                 margin-top:var(--space-2); font-style:italic; text-align:center;">
               ${escapeHtml(img.caption)}
             </figcaption>`
            : ""
        }
      </figure>
    `;
  }

  return `
    <div class="img-placeholder">
      <span class="img-placeholder-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </span>
      <span class="img-placeholder-caption">
        ${escapeHtml(img.caption || "Hình ảnh sẽ được bổ sung")}
      </span>
    </div>
  `;
}

/**
 * Severity badge HTML.
 */
export function severityBadge(severity) {
  const labels = { high: "Nghiêm trọng", medium: "Trung bình", low: "Nhẹ" };
  const label = labels[severity] || severity;
  return `<span class="badge badge-severity-${severity}">${escapeHtml(label)}</span>`;
}

// ── Private ──────────────────────────────────────────────────────

function _bindSidebarToggles() {
  sidebarNav.querySelectorAll(".nav-section-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sectionId = parseInt(btn.dataset.sectionId, 10);
      const isDtc = btn.dataset.isDtc === "true";

      if (isDtc) {
        window.location.hash = "#/dtc";
        closeSidebar();
        return;
      }

      // Navigate to section overview
      window.location.hash = `#/section/${sectionId}`;

      // On mobile, clicking a section doesn't close sidebar
      // (user still needs to pick a sub-section)
    });
  });

  // Close sidebar when a sub-section link is clicked on mobile
  sidebarNav.querySelectorAll(".nav-subsection-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 1024) closeSidebar();
    });
  });
}
