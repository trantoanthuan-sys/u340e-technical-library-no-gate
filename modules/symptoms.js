/**
 * symptoms.js — Symptom catalog module (mục 5.2)
 *
 * Mirror cấu trúc của dtc.js:
 *   1. renderSymptomList — danh mục 25 triệu chứng theo nhóm
 *   2. renderSymptomDetail — trang chi tiết 1 triệu chứng với 2 tab:
 *      - Sơ đồ step-by-step (1 câu hỏi/lần)
 *      - Sơ đồ tổng quan (cây YES/NO mọc dần kiểu PowerPoint)
 *
 * Tái sử dụng toàn bộ CSS classes `.dtc-*` từ mục 5.1.
 */

import { store } from "../core/store.js";
import { escapeHtml, renderBreadcrumb } from "../core/renderer.js";
import { symptomsData, symptomGroups } from "../data/symptoms-data.js";
import { renderSubConclusion } from "./lesson-outcomes.js";

// ─── List Page ────────────────────────────────────────────────────

export async function renderSymptomList(params, query) {
  const root = document.getElementById("page-root");
  if (!root) return;

  store.set("activeSymptomId", null);

  const all = Object.values(symptomsData);
  const searchQuery = (query?.q || "").toLowerCase().trim();
  const filterGroup = query?.g || "all";

  // Filter by group
  let filtered = all;
  if (filterGroup !== "all") {
    const groupCodes = symptomGroups[filterGroup]?.codes || [];
    filtered = all.filter((s) => groupCodes.includes(s.id));
  }

  // Search filter
  if (searchQuery) {
    filtered = filtered.filter((s) => {
      const haystack =
        `${s.id} ${s.title} ${s.subtitle || ""} ${s.description || ""}`.toLowerCase();
      return haystack.includes(searchQuery);
    });
  }

  // Group filtered for display
  const groupedDisplay = {};
  for (const s of filtered) {
    const g = s.group || "other";
    if (!groupedDisplay[g]) groupedDisplay[g] = [];
    groupedDisplay[g].push(s);
  }

  const html = `
    <div class="dtc-page">
      <header class="dtc-page-header">
        <div class="dtc-page-eyebrow">BÀI 5 · MỤC 5.2</div>
        <h1 class="dtc-page-title">Danh mục triệu chứng</h1>
        <p class="dtc-page-desc">
          25 triệu chứng thường gặp trên hộp số U340E, mỗi triệu chứng đi kèm flowchart chẩn đoán tương tác YES/NO. Click vào triệu chứng để xem chi tiết quy trình.
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
            id="symptom-search-input"
            class="dtc-search-input"
            placeholder="Tìm triệu chứng (vd. giật, trượt, không lùi)..."
            value="${escapeHtml(searchQuery)}"
            autocomplete="off"
          />
        </div>
        <div class="dtc-chips">
          <button class="dtc-chip ${filterGroup === "all" ? "is-active" : ""}" data-group="all">
            Tất cả (${all.length})
          </button>
          ${Object.entries(symptomGroups)
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
          <p>Không tìm thấy triệu chứng phù hợp với từ khóa "<strong>${escapeHtml(searchQuery)}</strong>"</p>
        </div>
      `
          : Object.entries(groupedDisplay)
              .map(
                ([groupKey, items]) => `
        <section class="dtc-group">
          <h2 class="dtc-group-head">${escapeHtml(symptomGroups[groupKey]?.label || "Khác")}</h2>
          <div class="dtc-rows">
            ${items
              .map(
                (s) => `
              <a href="#/symptoms/${s.id}" class="dtc-row">
                <span class="dtc-row-code">${s.id}</span>
                <span class="dtc-row-name">${escapeHtml(s.title)}${
                  s.subtitle
                    ? ` <span class="dtc-row-sub">— ${escapeHtml(s.subtitle)}</span>`
                    : ""
                }</span>
                <span class="dtc-row-mil">${s.steps?.length || 0} bước</span>
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
        <p>📋 Tổng cộng <strong>${all.length} triệu chứng</strong> với flowchart chẩn đoán tương tác</p>
        <p class="dtc-foot-note">
          Tài liệu tham khảo: Toyota Service Manual · Quy trình thực hành nhóm
        </p>
      </footer>

      ${renderSubConclusion(5, "5.2")}
    </div>
  `;

  root.innerHTML = html;
  _wireSymptomListEvents();
}

function _wireSymptomListEvents() {
  // Live search
  const input = document.getElementById("symptom-search-input");
  if (input) {
    let timer;
    input.addEventListener("input", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        _updateSymptomUrl({ q: e.target.value, g: _getCurrentGroup() });
      }, 200);
    });
  }

  // Chip filter
  document.querySelectorAll(".dtc-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const group = chip.getAttribute("data-group");
      _updateSymptomUrl({ q: input?.value || "", g: group });
    });
  });
}

function _getCurrentGroup() {
  const active = document.querySelector(".dtc-chip.is-active");
  return active?.getAttribute("data-group") || "all";
}

function _updateSymptomUrl({ q, g }) {
  const params = [];
  if (q) params.push(`q=${encodeURIComponent(q)}`);
  if (g && g !== "all") params.push(`g=${encodeURIComponent(g)}`);
  const qs = params.length ? "?" + params.join("&") : "";
  window.history.replaceState(null, "", `#/symptoms${qs}`);
  renderSymptomList(null, { q, g });
}

// ─── Detail Page ──────────────────────────────────────────────────

export async function renderSymptomDetail(params) {
  const root = document.getElementById("page-root");
  if (!root) return;

  const id = params.id?.toUpperCase();
  const sym = symptomsData[id];

  // Set breadcrumb up-front so deep-links always show the Trang Chủ link.
  renderBreadcrumb([
    { label: "Trang Chủ", href: "#/" },
    { label: "Bài 5", href: "#/section/5" },
    { label: "5.2 — Danh mục triệu chứng", href: "#/symptoms" },
    { label: id || "?" },
  ]);

  if (!sym) {
    root.innerHTML = `
      <div class="dtc-page">
        <div class="dtc-empty">
          <p>Không tìm thấy triệu chứng <strong>${escapeHtml(id || "?")}</strong>.</p>
          <a href="#/symptoms" class="btn-primary">← Quay lại danh mục</a>
        </div>
      </div>
    `;
    return;
  }

  store.set("activeSymptomId", id);

  const html = `
    <div class="dtc-detail-page">
      <a href="#/symptoms" class="dtc-back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Quay lại Danh mục triệu chứng
      </a>

      <header class="dtc-detail-header">
        <div class="dtc-detail-code-wrap">
          <h1 class="dtc-detail-code">${sym.id}</h1>
          <div class="dtc-detail-titles">
            <p class="dtc-detail-title">${escapeHtml(sym.title)}</p>
            ${sym.subtitle ? `<p class="dtc-detail-subtitle">${escapeHtml(sym.subtitle)}</p>` : ""}
          </div>
        </div>
        <div class="dtc-detail-badges">
          <span class="dtc-detail-badge">📂 ${escapeHtml(symptomGroups[sym.group]?.label || "Khác")}</span>
          ${
            sym.steps
              ? `<span class="dtc-detail-badge">🔧 ${sym.steps.length} bước chẩn đoán</span>`
              : ""
          }
        </div>
      </header>

      <div class="dtc-detail-body">

        <!-- Info section -->
        <section class="dtc-info-section">
          <div class="dtc-info-grid">
            <div class="dtc-info-block">
              <div class="dtc-info-label">📋 Mô tả</div>
              <div class="dtc-info-text">${escapeHtml(sym.description || "")}</div>
            </div>
            <div class="dtc-info-block">
              <div class="dtc-info-label">🔍 Khu vực nghi ngờ</div>
              <ul class="dtc-info-list">
                ${(sym.trouble_area || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </div>
          </div>
        </section>

        ${
          sym.steps
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
              <div id="symptom-interactive-flow"></div>
            </div>

            <div class="dtc-tab-content" data-tab-content="diagram" hidden>
              <p class="dtc-tab-intro">Click YES/NO trên mỗi bước — bước tiếp theo sẽ hiện ra phía dưới theo nhánh bạn chọn. Có thể click lại bất kỳ bước nào ở trên để đổi nhánh.</p>
              <div id="symptom-tree-flow"></div>
            </div>
          </section>
        `
            : ""
        }

      </div>
    </div>
  `;

  root.innerHTML = html;
  _wireSymptomDetailEvents(sym);
}

function _renderImageGallery(images) {
  if (!images || images.length === 0) return "";
  return `
    <div class="symptom-step-images">
      <div class="symptom-step-images-label">📷 HÌNH MINH HỌA</div>
      <div class="symptom-step-images-grid">
        ${images
          .map(
            (img) => `
          <figure class="symptom-step-img">
            <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.caption || "")}" />
            ${img.caption ? `<figcaption>${escapeHtml(img.caption)}</figcaption>` : ""}
          </figure>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function _renderTable(table) {
  if (!table) return "";
  return `
    <table class="dtc-step-table">
      ${
        table.headers
          ? `<thead><tr>${table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`
          : ""
      }
      <tbody>
        ${(table.rows || [])
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

// ─── Tree Flow (Tab "Sơ đồ tổng quan") ───────────────────────────

let _treeState = null;

function _initTreeFlow(sym) {
  if (!sym.steps || sym.steps.length === 0) return;
  _treeState = {
    steps: sym.steps,
    history: [{ stepId: sym.steps[0].id, answer: null, result: null }],
  };
  _renderTreeFlow();
}

function _renderTreeFlow() {
  if (!_treeState) return;
  const container = document.getElementById("symptom-tree-flow");
  if (!container) return;

  const { steps, history } = _treeState;
  const findStep = (id) => steps.find((s) => s.id === id);

  const parts = [];
  history.forEach((entry, idx) => {
    const step = findStep(entry.stepId);
    if (!step) return;

    const isCurrent =
      idx === history.length - 1 && entry.answer === null && !entry.result;
    const isDone = entry.answer !== null || entry.result !== null;

    if (idx > 0) {
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

    parts.push(_renderTreeNode(step, idx, isCurrent, isDone, entry));

    if (entry.result) {
      parts.push(_renderResultArrow(entry.answer));
      parts.push(_renderResultNode(entry.result));
    }
  });

  container.innerHTML = `<div class="dtc-tree-wrap">${parts.join("")}</div>`;

  container.querySelectorAll("[data-tree-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-tree-idx"), 10);
      const answer = btn.getAttribute("data-tree-answer");
      _handleTreeAnswer(idx, answer);
    });
  });
}

function _renderTreeNode(step, idx, isCurrent, isDone, entry) {
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
      ${_renderImageGallery(step.images)}

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
  if (ans.next_step) return ` → Đến Bước ${ans.next_step}`;
  if (ans.result) return ` → Kết quả`;
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

  const entry = history[idx];
  if (!entry) return;
  const step = steps.find((s) => s.id === entry.stepId);
  if (!step) return;
  const ans = step.answers?.[answer];
  if (!ans) return;

  _treeState.history = history.slice(0, idx + 1);
  _treeState.history[idx] = {
    stepId: entry.stepId,
    answer,
    result: ans.result || null,
  };

  if (ans.next_step) {
    _treeState.history.push({
      stepId: ans.next_step,
      answer: null,
      result: null,
    });
  }

  _renderTreeFlow();
}

// ─── Interactive Flow ────────────────────────────────────────────

let _flowState = null;

function _wireSymptomDetailEvents(sym) {
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

  if (sym.steps && sym.steps.length > 0) {
    _flowState = {
      currentStepId: sym.steps[0].id,
      history: [],
      steps: sym.steps,
      sym: sym,
    };
    _renderInteractiveStep();
  }

  _initTreeFlow(sym);
}

function _renderInteractiveStep() {
  if (!_flowState) return;
  const container = document.getElementById("symptom-interactive-flow");
  if (!container) return;

  const step = _flowState.steps.find((s) => s.id === _flowState.currentStepId);
  if (!step) return;

  const totalSteps = _flowState.steps.length;

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
      ${_renderImageGallery(step.images)}

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
  const container = document.getElementById("symptom-interactive-flow");
  if (!container) return;

  container.innerHTML = `
    <div class="dtc-result-card">
      <div class="dtc-result-icon">✅</div>
      <h3 class="dtc-result-title">Kết quả chẩn đoán</h3>
      <p class="dtc-result-action"><strong>${escapeHtml(result)}</strong></p>
      <button class="dtc-btn-restart" id="symptom-btn-restart">↻ Chẩn đoán lại từ đầu</button>
    </div>
    <div class="dtc-flow-history">
      <strong>Đường dẫn:</strong>
      ${_flowState.history.map((h) => `<span class="dtc-history-item">Bước ${h.stepId} → ${h.answer.toUpperCase()}</span>`).join("")}
    </div>
  `;

  document
    .getElementById("symptom-btn-restart")
    ?.addEventListener("click", () => {
      _flowState.currentStepId = _flowState.steps[0].id;
      _flowState.history = [];
      _renderInteractiveStep();
    });
}
