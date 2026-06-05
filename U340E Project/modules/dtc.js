/**
 * dtc.js — DTC (Diagnostic Trouble Codes) module
 *
 * Provides two pages:
 * 1. renderDtcList — danh mục 18 mã DTC theo nhóm
 * 2. renderDtcDetail — trang chi tiết 1 mã với 2 tab:
 *    - Sơ đồ step-by-step (interactive Q&A)
 *    - Sơ đồ tổng quan (linear list view)
 */

import { store } from "../core/store.js";
import { escapeHtml, renderBreadcrumb } from "../core/renderer.js";
import { dtcData, dtcGroups } from "../data/dtc-data.js";
import { renderSubConclusion } from "./lesson-outcomes.js";

// ─── List Page ────────────────────────────────────────────────────

export async function renderDtcList(params, query) {
  const root = document.getElementById("page-root");
  if (!root) return;

  store.set("activeDtcCode", null);

  const allCodes = Object.values(dtcData);
  const searchQuery = (query?.q || "").toLowerCase().trim();
  const filterGroup = query?.g || "all";

  // Filter by group
  let filtered = allCodes;
  if (filterGroup !== "all") {
    const groupCodes = dtcGroups[filterGroup]?.codes || [];
    filtered = allCodes.filter((c) => groupCodes.includes(c.code));
  }

  // Search filter (by code or title)
  if (searchQuery) {
    filtered = filtered.filter((c) => {
      const haystack = `${c.code} ${c.title} ${c.subtitle || ""}`.toLowerCase();
      return haystack.includes(searchQuery);
    });
  }

  // Group filtered codes by their group for display
  const groupedDisplay = {};
  for (const code of filtered) {
    const g = code.group || "other";
    if (!groupedDisplay[g]) groupedDisplay[g] = [];
    groupedDisplay[g].push(code);
  }

  const html = `
    <div class="dtc-page">
      <header class="dtc-page-header">
        <div class="dtc-page-eyebrow">BÀI 5 · MỤC 5.1</div>
        <h1 class="dtc-page-title">Danh mục mã lỗi DTC</h1>
        <p class="dtc-page-desc">
          Hệ thống 18 mã chẩn đoán hộp số tự động U340E. Click vào mã bất kỳ để xem chi tiết quy trình chẩn đoán tương tác.
        </p>
      </header>

      <div class="dtc-toolbar">
        <div class="dtc-search-wrap">
          <svg class="dtc-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            id="dtc-search-input"
            class="dtc-search-input"
            placeholder="Tìm mã P0705 hoặc keyword..."
            value="${escapeHtml(searchQuery)}"
            autocomplete="off"
          />
        </div>
        <div class="dtc-chips">
          <button class="dtc-chip ${filterGroup === "all" ? "is-active" : ""}" data-group="all">
            Tất cả (${allCodes.length})
          </button>
          ${Object.entries(dtcGroups)
            .map(
              ([key, g]) => `
            <button class="dtc-chip ${filterGroup === key ? "is-active" : ""}" data-group="${key}">
              ${escapeHtml(g.label)} (${g.codes.length})
            </button>
          `,
            )
            .join("")}
        </div>
      </div>

      ${
        filtered.length === 0
          ? `
        <div class="dtc-empty">
          <p>Không tìm thấy mã DTC phù hợp với từ khóa "<strong>${escapeHtml(searchQuery)}</strong>"</p>
        </div>
      `
          : Object.entries(groupedDisplay)
              .map(
                ([groupKey, codes]) => `
        <section class="dtc-group">
          <h2 class="dtc-group-head">${escapeHtml(dtcGroups[groupKey]?.label || "Khác")}</h2>
          <div class="dtc-rows">
            ${codes
              .map(
                (c) => `
              <a href="#/dtc/${c.code}" class="dtc-row">
                <span class="dtc-row-code">${c.code}</span>
                <span class="dtc-row-name">${escapeHtml(c.title)}${
                  c.subtitle
                    ? ` <span class="dtc-row-sub">— ${escapeHtml(c.subtitle)}</span>`
                    : ""
                }</span>
                ${
                  c.grouped_with
                    ? `
                  <span class="dtc-row-grouped" title="Cùng quy trình với ${c.grouped_with.join(", ")}">
                    Nhóm: ${c.grouped_with.length + 1} mã
                  </span>
                `
                    : ""
                }
                <span class="dtc-row-mil">MIL</span>
                <span class="dtc-row-arrow">›</span>
              </a>
            `,
              )
              .join("")}
          </div>
        </section>
      `,
              )
              .join("")
      }

      <footer class="dtc-page-foot">
        <p>📋 Tổng cộng <strong>${allCodes.length} mã DTC</strong> phổ biến trên U340E</p>
        <p class="dtc-foot-note">
          Tài liệu tham khảo: Toyota Service Manual · ATSG Diagnostic Guide
        </p>
      </footer>

      ${renderSubConclusion(5, "5.1")}
    </div>
  `;

  root.innerHTML = html;
  _wireDtcListEvents();
}

function _wireDtcListEvents() {
  // Live search
  const input = document.getElementById("dtc-search-input");
  if (input) {
    let timer;
    input.addEventListener("input", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        _updateDtcUrl({ q: e.target.value, g: _getCurrentGroup() });
      }, 200);
    });
  }

  // Chip filter
  document.querySelectorAll(".dtc-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const group = chip.getAttribute("data-group");
      _updateDtcUrl({ q: input?.value || "", g: group });
    });
  });
}

function _getCurrentGroup() {
  const active = document.querySelector(".dtc-chip.is-active");
  return active?.getAttribute("data-group") || "all";
}

function _updateDtcUrl({ q, g }) {
  const params = [];
  if (q) params.push(`q=${encodeURIComponent(q)}`);
  if (g && g !== "all") params.push(`g=${encodeURIComponent(g)}`);
  const qs = params.length ? "?" + params.join("&") : "";
  // Update hash without navigation (push new state)
  window.history.replaceState(null, "", `#/dtc${qs}`);
  // Re-render
  renderDtcList(null, { q, g });
}

// ─── Detail Page ──────────────────────────────────────────────────

export async function renderDtcDetail(params) {
  const root = document.getElementById("page-root");
  if (!root) return;

  const code = params.code?.toUpperCase();
  const dtc = dtcData[code];

  // Set breadcrumb even before content renders, so the Trang Chủ link is always
  // present — also covers direct deep-links to /#/dtc/P0705 from outside the SPA.
  renderBreadcrumb([
    { label: "Trang Chủ", href: "#/" },
    { label: "Bài 5", href: "#/section/5" },
    { label: "5.1 — Danh mục mã lỗi DTC", href: "#/dtc" },
    { label: code || "?" },
  ]);

  if (!dtc) {
    root.innerHTML = `
      <div class="dtc-page">
        <div class="dtc-empty">
          <p>Không tìm thấy mã DTC <strong>${escapeHtml(code || "?")}</strong>.</p>
          <a href="#/dtc" class="btn-primary">← Quay lại danh mục</a>
        </div>
      </div>
    `;
    return;
  }

  store.set("activeDtcCode", code);

  // Find related codes (grouped_with)
  const relatedCodes = (dtc.grouped_with || [])
    .map((rc) => dtcData[rc])
    .filter(Boolean);

  const html = `
    <div class="dtc-detail-page">
      <a href="#/dtc" class="dtc-back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Quay lại Danh mục mã lỗi
      </a>

      <header class="dtc-detail-header">
        <div class="dtc-detail-code-wrap">
          <h1 class="dtc-detail-code">${dtc.code}</h1>
          <div class="dtc-detail-titles">
            <p class="dtc-detail-title">${escapeHtml(dtc.title)}</p>
            ${dtc.subtitle ? `<p class="dtc-detail-subtitle">${escapeHtml(dtc.subtitle)}</p>` : ""}
          </div>
        </div>
        <div class="dtc-detail-badges">
          <span class="dtc-detail-badge"><span class="dot-red"></span> MIL: ${dtc.mil || "Sáng"}</span>
          ${
            dtc.detection_logic?.summary
              ? `
            <span class="dtc-detail-badge">📋 ${escapeHtml(dtc.detection_logic.summary)}</span>
          `
              : ""
          }
          ${
            dtc.steps
              ? `
            <span class="dtc-detail-badge">🔧 ${dtc.steps.length} bước chẩn đoán</span>
          `
              : ""
          }
        </div>
        ${
          relatedCodes.length > 0
            ? `
          <div class="dtc-related">
            <span class="dtc-related-label">Cùng quy trình với:</span>
            ${relatedCodes
              .map(
                (rc) => `
              <a href="#/dtc/${rc.code}" class="dtc-related-chip">${rc.code}</a>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
      </header>

      <div class="dtc-detail-body">

        <!-- Info section -->
        <section class="dtc-info-section">
          <div class="dtc-info-grid">
            <div class="dtc-info-block">
              <div class="dtc-info-label">📋 Mô tả</div>
              <div class="dtc-info-text">${escapeHtml(dtc.description || "")}</div>
            </div>
            <div class="dtc-info-block">
              <div class="dtc-info-label">🔍 Khu vực nghi ngờ</div>
              <ul class="dtc-info-list">
                ${(dtc.trouble_area || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </div>
          </div>

          ${dtc.detection_logic ? _renderDetectionLogic(dtc.detection_logic) : ""}
        </section>

        ${
          dtc.wiring_image
            ? `
          <section class="dtc-wiring-section">
            <h3 class="dtc-section-head">⚡ Wiring Diagram</h3>
            <img src="${dtc.wiring_image}" alt="Wiring diagram ${dtc.code}" class="dtc-wiring-img" />
          </section>
        `
            : ""
        }

        ${
          dtc.steps
            ? `
          <section class="dtc-diagnosis-section">
            <div class="dtc-tabs-nav" role="tablist">
              <button class="dtc-tab-btn is-active" data-tab="interactive" role="tab">
                ⚡ Sơ đồ step-by-step
                <span class="dtc-tab-beta">Beta</span>
              </button>
              <button class="dtc-tab-btn" data-tab="diagram" role="tab">
                📋 Sơ đồ tổng quan
              </button>
            </div>

            <div class="dtc-tab-content" data-tab-content="interactive">
              <p class="dtc-tab-intro">Trả lời các câu hỏi để được hướng dẫn cách xử lý phù hợp với tình huống thực tế.</p>
              <div id="dtc-interactive-flow"></div>
            </div>

            <div class="dtc-tab-content" data-tab-content="diagram" hidden>
              <p class="dtc-tab-intro">Click YES/NO trên mỗi bước — bước tiếp theo sẽ hiện ra phía dưới theo nhánh bạn chọn. Có thể click lại bất kỳ bước nào ở trên để đổi nhánh.</p>
              <div id="dtc-tree-flow"></div>
            </div>
          </section>
        `
            : ""
        }

      </div>
    </div>
  `;

  root.innerHTML = html;
  _wireDtcDetailEvents(dtc);
}

function _renderDetectionLogic(logic) {
  if (!logic) return "";

  let html = '<div class="dtc-logic-block">';
  html += `<div class="dtc-info-label">⚙️ Điều kiện phát hiện lỗi</div>`;

  if (logic.summary) {
    html += `<p class="dtc-logic-summary"><strong>${escapeHtml(logic.summary)}</strong></p>`;
  }
  if (logic.time) {
    html += `<p class="dtc-logic-meta">⏱️ Thời gian: ${escapeHtml(logic.time)}</p>`;
  }
  if (logic.preconditions?.length) {
    html += `<p class="dtc-logic-meta"><strong>Điều kiện kích hoạt:</strong></p>`;
    html += `<ul class="dtc-logic-list">${logic.preconditions.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>`;
  }
  if (logic.conditions?.length) {
    html += `<p class="dtc-logic-meta"><strong>Điều kiện lỗi cụ thể:</strong></p>`;
    html += `<ul class="dtc-logic-list">${logic.conditions.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>`;
  }
  if (logic.tables) {
    html += `<div class="dtc-logic-table-wrap">`;
    if (logic.tables.title) {
      html += `<p class="dtc-logic-meta"><em>${escapeHtml(logic.tables.title)}</em></p>`;
    }
    html += _renderTable(logic.tables);
    html += `</div>`;
  }
  if (logic.note) {
    html += `<p class="dtc-logic-note">📝 ${escapeHtml(logic.note)}</p>`;
  }
  html += "</div>";
  return html;
}

function _renderTable(table) {
  if (!table) return "";
  return `
    <table class="dtc-step-table">
      ${
        table.headers
          ? `
        <thead>
          <tr>${table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
        </thead>
      `
          : ""
      }
      <tbody>
        ${(table.rows || [])
          .map(
            (row) => `
          <tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>
        `,
          )
          .join("")}
      </tbody>
      ${table.footnote ? `<caption class="dtc-table-footnote">${escapeHtml(table.footnote)}</caption>` : ""}
    </table>
  `;
}

// ─── Tree Flow (Tab "Sơ đồ tổng quan") ───────────────────────────
// State machine giống interactive nhưng PUSH node mới xuống dưới
// thay vì replace. Click lại 1 node ở trên → cắt bỏ tất cả node phía dưới
// rồi rebuild theo nhánh mới.

let _treeState = null;

function _initTreeFlow(dtc) {
  if (!dtc.steps || dtc.steps.length === 0) return;
  _treeState = {
    steps: dtc.steps,
    // history: mảng các bước đã hiển thị, mỗi item:
    //   { stepId, answer: null | 'yes' | 'no', result: null | string }
    history: [{ stepId: dtc.steps[0].id, answer: null, result: null }],
  };
  _renderTreeFlow();
}

function _renderTreeFlow() {
  if (!_treeState) return;
  const container = document.getElementById("dtc-tree-flow");
  if (!container) return;

  const { steps, history } = _treeState;
  const findStep = (id) => steps.find((s) => s.id === id);

  // Build HTML cho từng node theo thứ tự history
  const parts = [];
  history.forEach((entry, idx) => {
    const step = findStep(entry.stepId);
    if (!step) return;

    const isCurrent =
      idx === history.length - 1 && entry.answer === null && !entry.result;
    const isDone = entry.answer !== null || entry.result !== null;

    // Arrow giữa các node (trừ node đầu tiên)
    if (idx > 0) {
      // Arrow màu theo answer của node TRƯỚC (đứng trên)
      const prevAnswer = history[idx - 1].answer;
      const arrowClass =
        prevAnswer === "yes" ? "is-yes" : prevAnswer === "no" ? "is-no" : "";
      const arrowLabel =
        prevAnswer === "yes" ? "YES" : prevAnswer === "no" ? "NO" : "";
      parts.push(`
        <div class="dtc-tree-arrow ${arrowClass}">
          ${arrowLabel ? `<span class="dtc-tree-arrow-label">${arrowLabel}</span>` : ""}
        </div>
      `);
    }

    // Render node
    parts.push(_renderTreeNode(step, idx, isCurrent, isDone, entry));

    // Nếu node này có result → render kết quả + dừng
    if (entry.result) {
      parts.push(_renderResultArrow(entry.answer));
      parts.push(_renderResultNode(entry.result));
    }
  });

  container.innerHTML = `<div class="dtc-tree-wrap">${parts.join("")}</div>`;

  // Wire YES/NO buttons trong tree
  container.querySelectorAll("[data-tree-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-tree-idx"), 10);
      const answer = btn.getAttribute("data-tree-answer");
      _handleTreeAnswer(idx, answer);
    });
  });
}

function _renderTreeNode(step, idx, isCurrent, isDone, entry) {
  const totalSteps = _treeState.steps.length;
  let classes = "dtc-tree-node";
  if (isCurrent) classes += " is-current";
  if (isDone) classes += " is-done";

  const badgeText = isDone
    ? `BƯỚC ${step.id} · Đã làm`
    : `BƯỚC ${step.id} · Hiện tại`;
  const badgeClass = isDone ? "is-done" : "";

  return `
    <div class="${classes}" data-tree-step-id="${step.id}">
      <span class="dtc-tree-node-badge ${badgeClass}">${badgeText}</span>
      <h4 class="dtc-tree-node-title">${escapeHtml(step.title)}</h4>
      ${step.purpose ? `<p class="dtc-tree-node-purpose">${escapeHtml(step.purpose)}</p>` : ""}

      ${step.image ? `<img src="${step.image}" alt="Step ${step.id}" class="dtc-tree-node-img" />` : ""}

      ${
        step.actions
          ? `
        <div class="dtc-tree-node-actions">
          <div class="dtc-tree-node-actions-label">CÁC BƯỚC THỰC HIỆN</div>
          <ol>${step.actions.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ol>
        </div>
      `
          : ""
      }

      ${step.note ? `<p class="dtc-tree-node-note">📝 ${escapeHtml(step.note)}</p>` : ""}

      ${step.table ? _renderTable(step.table) : ""}

      ${
        step.question
          ? `
        <div class="dtc-tree-node-question">
          <span class="dtc-tree-node-question-icon">❓</span>
          <span>${escapeHtml(step.question)}</span>
        </div>
        <div class="dtc-tree-node-buttons">
          ${
            step.answers?.yes
              ? `
            <button class="dtc-tree-btn-yes ${entry.answer === "yes" ? "is-selected" : ""}"
                    data-tree-idx="${idx}" data-tree-answer="yes">
              ✓ YES
            </button>
          `
              : ""
          }
          ${
            step.answers?.no
              ? `
            <button class="dtc-tree-btn-no ${entry.answer === "no" ? "is-selected" : ""}"
                    data-tree-idx="${idx}" data-tree-answer="no">
              ✗ NO
            </button>
          `
              : ""
          }
        </div>
        ${
          entry.answer
            ? `
          <div class="dtc-tree-answer-tag ${entry.answer === "no" ? "is-no" : ""}">
            ${entry.answer === "yes" ? "✓" : "✗"} Đã chọn ${entry.answer.toUpperCase()}
            ${_describeNextAction(step, entry.answer)}
          </div>
        `
            : ""
        }
      `
          : ""
      }
    </div>
  `;
}

function _describeNextAction(step, answer) {
  const ans = step.answers?.[answer];
  if (!ans) return "";
  if (ans.next_step) {
    return ` → Đến Bước ${ans.next_step}`;
  }
  if (ans.result) {
    return ` → Kết quả`;
  }
  return "";
}

function _renderResultArrow(answer) {
  const cls = answer === "yes" ? "is-yes" : answer === "no" ? "is-no" : "";
  const label = answer === "yes" ? "YES" : answer === "no" ? "NO" : "";
  return `
    <div class="dtc-tree-arrow ${cls}">
      ${label ? `<span class="dtc-tree-arrow-label">${label}</span>` : ""}
    </div>
  `;
}

function _renderResultNode(result) {
  return `
    <div class="dtc-tree-node is-result">
      <div class="dtc-tree-result-icon">✅</div>
      <h4 class="dtc-tree-result-title">Kết quả chẩn đoán</h4>
      <p class="dtc-tree-result-text"><strong>${escapeHtml(result)}</strong></p>
      <p class="dtc-tree-result-hint">
        💡 Có thể click lại bất kỳ nút YES/NO ở các bước phía trên để đổi nhánh — các bước phía dưới sẽ tự cập nhật.
      </p>
    </div>
  `;
}

function _handleTreeAnswer(idx, answer) {
  if (!_treeState) return;
  const { steps, history } = _treeState;

  // 1) Cập nhật entry tại idx với answer mới
  const entry = history[idx];
  if (!entry) return;
  const step = steps.find((s) => s.id === entry.stepId);
  if (!step) return;
  const ans = step.answers?.[answer];
  if (!ans) return;

  // Re-route: cắt bỏ tất cả các entry phía sau idx
  _treeState.history = history.slice(0, idx + 1);
  _treeState.history[idx] = {
    stepId: entry.stepId,
    answer: answer,
    result: ans.result || null,
  };

  // 2) Nếu next_step → push entry mới
  if (ans.next_step) {
    _treeState.history.push({
      stepId: ans.next_step,
      answer: null,
      result: null,
    });
  }
  // Nếu ans.result → đã set ở trên, dừng

  _renderTreeFlow();
}

// ─── Interactive Flow State ───────────────────────────────────────

let _flowState = null;

function _wireDtcDetailEvents(dtc) {
  // Tab switching
  document.querySelectorAll(".dtc-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      document
        .querySelectorAll(".dtc-tab-btn")
        .forEach((b) => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll("[data-tab-content]").forEach((el) => {
        const matches = el.getAttribute("data-tab-content") === tab;
        el.hidden = !matches;
      });
    });
  });

  // Initialize interactive flow (Tab 1)
  if (dtc.steps && dtc.steps.length > 0) {
    _flowState = {
      currentStepId: dtc.steps[0].id,
      history: [],
      steps: dtc.steps,
      dtc: dtc,
    };
    _renderInteractiveStep();
  }

  // Initialize tree flow (Tab 2)
  _initTreeFlow(dtc);
}

function _renderInteractiveStep() {
  if (!_flowState) return;
  const container = document.getElementById("dtc-interactive-flow");
  if (!container) return;

  const step = _flowState.steps.find((s) => s.id === _flowState.currentStepId);
  if (!step) return;

  const totalSteps = _flowState.steps.length;

  // Step progress dots
  const dotsHtml = _flowState.steps
    .map((s) => {
      let cls = "dtc-step-dot";
      if (s.id === _flowState.currentStepId) cls += " is-active";
      else if (_flowState.history.find((h) => h.stepId === s.id))
        cls += " is-done";
      return `<div class="${cls}" title="Bước ${s.id}">${s.id}</div>`;
    })
    .join("");

  const html = `
    <div class="dtc-step-card">
      <div class="dtc-step-progress">${dotsHtml}</div>
      <span class="dtc-step-badge">BƯỚC ${step.id} / ${totalSteps}</span>
      <h3 class="dtc-step-title">${escapeHtml(step.title)}</h3>
      ${step.purpose ? `<p class="dtc-step-purpose"><strong>Mục đích:</strong> ${escapeHtml(step.purpose)}</p>` : ""}

      ${step.image ? `<img src="${step.image}" alt="Step ${step.id}" class="dtc-step-image" />` : ""}

      ${
        step.actions
          ? `
        <div class="dtc-step-actions-box">
          <div class="dtc-step-actions-label">CÁC BƯỚC THỰC HIỆN</div>
          <ol>${step.actions.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ol>
        </div>
      `
          : ""
      }

      ${step.note ? `<p class="dtc-step-note">📝 ${escapeHtml(step.note)}</p>` : ""}

      ${step.table ? _renderTable(step.table) : ""}

      ${
        step.question
          ? `
        <div class="dtc-step-question">
          <span class="dtc-step-question-icon">❓</span>
          <span>${escapeHtml(step.question)}</span>
        </div>
        <div class="dtc-step-buttons">
          ${step.answers?.yes ? `<button class="dtc-btn-yes" data-answer="yes">✓ YES</button>` : ""}
          ${step.answers?.no ? `<button class="dtc-btn-no" data-answer="no">✗ NO</button>` : ""}
        </div>
      `
          : ""
      }
    </div>

    ${
      _flowState.history.length > 0
        ? `
      <div class="dtc-flow-history">
        <strong>Lịch sử:</strong>
        ${_flowState.history.map((h) => `<span class="dtc-history-item">Bước ${h.stepId} → ${h.answer.toUpperCase()}</span>`).join("")}
      </div>
    `
        : ""
    }
  `;

  container.innerHTML = html;

  // Wire answer buttons
  container.querySelectorAll("[data-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.getAttribute("data-answer");
      _handleAnswer(answer);
    });
  });
}

function _handleAnswer(answer) {
  if (!_flowState) return;
  const step = _flowState.steps.find((s) => s.id === _flowState.currentStepId);
  if (!step) return;
  const result = step.answers[answer];
  if (!result) return;

  _flowState.history.push({ stepId: _flowState.currentStepId, answer });

  if (result.next_step) {
    _flowState.currentStepId = result.next_step;
    _renderInteractiveStep();
  } else if (result.result) {
    _renderInteractiveResult(result.result);
  }
}

function _renderInteractiveResult(result) {
  const container = document.getElementById("dtc-interactive-flow");
  if (!container) return;

  container.innerHTML = `
    <div class="dtc-result-card">
      <div class="dtc-result-icon">✅</div>
      <h3 class="dtc-result-title">Kết quả chẩn đoán</h3>
      <p class="dtc-result-action"><strong>${escapeHtml(result)}</strong></p>
      <button class="dtc-btn-restart" id="dtc-btn-restart">↻ Chẩn đoán lại từ đầu</button>
    </div>
    <div class="dtc-flow-history">
      <strong>Đường dẫn:</strong>
      ${_flowState.history.map((h) => `<span class="dtc-history-item">Bước ${h.stepId} → ${h.answer.toUpperCase()}</span>`).join("")}
    </div>
  `;

  document.getElementById("dtc-btn-restart")?.addEventListener("click", () => {
    _flowState.currentStepId = _flowState.steps[0].id;
    _flowState.history = [];
    _renderInteractiveStep();
  });
}
