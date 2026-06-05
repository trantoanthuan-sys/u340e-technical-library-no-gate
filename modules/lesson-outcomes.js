/**
 * modules/lesson-outcomes.js — Render Kết quả bài học UI
 * =======================================================
 *
 * Cung cấp các hàm render:
 *   - renderObjectives(baiId)     → Block "Mục tiêu học tập" (đầu bài)
 *   - renderConclusion(baiId)     → Kết luận: kiến thức + kỹ năng + bước kế (cuối bài)
 *   - renderQuiz(baiId)           → Module trắc nghiệm tương tác
 *   - renderCaseStudy(baiId)      → Bài tập tình huống
 *   - renderDeliverable(baiId)    → Sản phẩm cuối bài + rubric
 *   - renderTruthTable(baiId)     → Bảng trạng thái (chỉ Bài 3)
 *   - renderLessonOutcomes(baiId) → Combo tất cả phần cuối bài
 */

import { lessonOutcomes } from "../data/lesson-outcomes.js";
import { escapeHtml } from "../core/renderer.js";

// ─── Helper: state per-bai (in-memory only, reset on reload) ─────
const _quizState = new Map(); // baiId → { answers: [], submitted: false }
const _caseState = new Map(); // baiId → { picks: Set, submitted: bool }
const _truthState = new Map(); // baiId → 2D array of user answers

// ═══════════════════════════════════════════════════════════════
// 1. MỤC TIÊU HỌC TẬP (đầu bài)
// ═══════════════════════════════════════════════════════════════

export function renderObjectives(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data || !data.objectives) return "";

  const items = data.objectives
    .map((o) => `<li>${escapeHtml(o)}</li>`)
    .join("");

  return `
    <section class="lesson-objectives">
      <div class="lo-header">
        <span class="lo-icon">🎯</span>
        <h3 class="lo-title">Mục tiêu học tập</h3>
      </div>
      <p class="lo-intro">Sau khi học xong bài này, sinh viên có thể:</p>
      <ol class="lo-list">${items}</ol>
    </section>
  `;
}

// ═══════════════════════════════════════════════════════════════
// 2. KẾT LUẬN BÀI HỌC (tổng kết kiến thức + kỹ năng + bước kế tiếp)
// ═══════════════════════════════════════════════════════════════

/**
 * Render conclusion for an entire bài (used at end of last sub-section).
 */
export function renderConclusion(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data || !data.conclusion) return "";
  return _renderConclusionBlock(data.conclusion);
}

/**
 * Render conclusion for a specific sub-section (used in DTC list / Symptoms list).
 * Falls back to bai-level conclusion if sub-specific not defined.
 * @param {number} baiId - parent bai number (e.g. 5)
 * @param {string} subId - sub id like "5.1" or "5.2"
 */
export function renderSubConclusion(baiId, subId) {
  const data = lessonOutcomes[baiId];
  if (!data) return "";

  // Prefer sub-specific conclusion, fall back to bai-level
  const subData = data.subConclusions?.[subId];
  if (!subData) return "";

  return _renderConclusionBlock(subData, subData.title);
}

/**
 * Internal: build the conclusion HTML from a conclusion object.
 * @param {Object} c - { knowledge: [], skills: [], nextStep: string }
 * @param {string} [customTitle] - Optional custom title (defaults to "Kết luận bài học")
 */
function _renderConclusionBlock(c, customTitle) {
  const title = customTitle || "Kết luận bài học";

  const knowledgeHtml =
    c.knowledge && c.knowledge.length
      ? `<div class="conc-block">
         <div class="conc-block-header">
           <span class="conc-block-icon">💡</span>
           <h4 class="conc-block-title">Nắm được kiến thức cốt lõi</h4>
         </div>
         <ul class="conc-list">
           ${c.knowledge.map((k) => `<li>${escapeHtml(k)}</li>`).join("")}
         </ul>
       </div>`
      : "";

  const skillsHtml =
    c.skills && c.skills.length
      ? `<div class="conc-block">
         <div class="conc-block-header">
           <span class="conc-block-icon">🛠️</span>
           <h4 class="conc-block-title">Rèn được kỹ năng</h4>
         </div>
         <ul class="conc-list">
           ${c.skills.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
         </ul>
       </div>`
      : "";

  const nextStepHtml = c.nextStep
    ? `<div class="conc-next">
         <span class="conc-next-icon">➡️</span>
         <div class="conc-next-text">
           <strong>Chuẩn bị cho bài tiếp theo:</strong>
           <p>${escapeHtml(c.nextStep)}</p>
         </div>
       </div>`
    : "";

  return `
    <section class="lesson-conclusion">
      <div class="lo-header">
        <span class="lo-icon">🎓</span>
        <h3 class="lo-title">${escapeHtml(title)}</h3>
      </div>
      <p class="lo-intro">Qua bài học này, các bạn đã:</p>
      <div class="conc-blocks">
        ${knowledgeHtml}
        ${skillsHtml}
      </div>
      ${nextStepHtml}
    </section>
  `;
}

// ═══════════════════════════════════════════════════════════════
// 3. QUIZ TRẮC NGHIỆM
// ═══════════════════════════════════════════════════════════════

export function renderQuiz(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data || !data.quiz) return "";

  const state = _quizState.get(baiId) || {
    answers: new Array(data.quiz.length).fill(null),
    submitted: false,
  };

  const questions = data.quiz
    .map((q, qi) => {
      const userAnswer = state.answers[qi];
      const isSubmitted = state.submitted;

      const options = q.options
        .map((opt, oi) => {
          const checked = userAnswer === oi;
          let resultClass = "";

          if (isSubmitted) {
            if (oi === q.correctIndex) {
              resultClass = "quiz-option-correct";
            } else if (checked && oi !== q.correctIndex) {
              resultClass = "quiz-option-wrong";
            }
          }

          return `
        <label class="quiz-option ${resultClass}">
          <input type="radio"
                 name="quiz-${baiId}-q${qi}"
                 value="${oi}"
                 data-bai="${baiId}"
                 data-q="${qi}"
                 data-opt="${oi}"
                 class="quiz-radio"
                 ${checked ? "checked" : ""}
                 ${isSubmitted ? "disabled" : ""}>
          <span class="quiz-option-text">${escapeHtml(opt)}</span>
          ${
            isSubmitted && oi === q.correctIndex
              ? '<span class="quiz-badge-correct">Đáp án đúng</span>'
              : ""
          }
          ${
            isSubmitted && checked && oi !== q.correctIndex
              ? '<span class="quiz-badge-wrong">Bạn chọn</span>'
              : ""
          }
        </label>
      `;
        })
        .join("");

      return `
      <div class="quiz-question" data-q="${qi}">
        <div class="quiz-question-header">
          <span class="quiz-q-num">Câu ${qi + 1}</span>
          <span class="quiz-q-total">/ ${data.quiz.length}</span>
        </div>
        <p class="quiz-q-text">${escapeHtml(q.question)}</p>
        <div class="quiz-options">${options}</div>
        ${
          isSubmitted
            ? `<div class="quiz-explanation">
               <strong>💡 Giải thích:</strong> ${escapeHtml(q.explanation)}
             </div>`
            : ""
        }
      </div>
    `;
    })
    .join("");

  // Score panel if submitted
  let scoreHtml = "";
  if (state.submitted) {
    const correct = state.answers.reduce(
      (sum, a, i) => sum + (a === data.quiz[i].correctIndex ? 1 : 0),
      0,
    );
    const total = data.quiz.length;
    const pct = Math.round((correct / total) * 100);
    const grade = pct >= 80 ? "Tốt" : pct >= 60 ? "Trung bình" : "Cần ôn lại";
    const gradeClass = pct >= 80 ? "good" : pct >= 60 ? "medium" : "poor";

    scoreHtml = `
      <div class="quiz-score quiz-score-${gradeClass}">
        <div class="quiz-score-main">
          <span class="quiz-score-num">${correct}/${total}</span>
          <span class="quiz-score-pct">(${pct}%)</span>
        </div>
        <div class="quiz-score-label">${grade}</div>
        <button class="btn-secondary quiz-retry" data-bai="${baiId}">🔁 Làm lại</button>
      </div>
    `;
  }

  return `
    <section class="lesson-quiz" data-bai="${baiId}">
      <div class="lo-header">
        <span class="lo-icon">❓</span>
        <h3 class="lo-title">Kiểm tra kiến thức</h3>
      </div>
      <p class="lo-intro">Trả lời ${data.quiz.length} câu trắc nghiệm để kiểm tra mức độ hiểu bài.</p>
      <div class="quiz-questions">${questions}</div>
      ${
        !state.submitted
          ? `<button class="btn-primary quiz-submit" data-bai="${baiId}">✓ Nộp bài</button>`
          : scoreHtml
      }
    </section>
  `;
}

// ═══════════════════════════════════════════════════════════════
// 4. CASE STUDY
// ═══════════════════════════════════════════════════════════════

export function renderCaseStudy(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data || !data.caseStudy) return "";

  const cs = data.caseStudy;
  const state = _caseState.get(baiId) || { picks: new Set(), submitted: false };

  const options = cs.options
    .map((opt, oi) => {
      const isPicked = state.picks.has(oi);
      let resultClass = "";

      if (state.submitted) {
        if (opt.correct && isPicked) resultClass = "case-pick-correct";
        else if (opt.correct && !isPicked) resultClass = "case-pick-missed";
        else if (!opt.correct && isPicked) resultClass = "case-pick-wrong";
      }

      return `
      <label class="case-option ${resultClass}">
        <input type="checkbox"
               data-bai="${baiId}"
               data-opt="${oi}"
               class="case-checkbox"
               ${isPicked ? "checked" : ""}
               ${state.submitted ? "disabled" : ""}>
        <span class="case-option-text">${escapeHtml(opt.text)}</span>
        ${
          state.submitted && opt.correct
            ? '<span class="case-mark case-mark-correct">✓ Đúng</span>'
            : ""
        }
        ${
          state.submitted && !opt.correct && isPicked
            ? '<span class="case-mark case-mark-wrong">✗ Sai</span>'
            : ""
        }
      </label>
    `;
    })
    .join("");

  return `
    <section class="lesson-case" data-bai="${baiId}">
      <div class="lo-header">
        <span class="lo-icon">📂</span>
        <h3 class="lo-title">Bài tập tình huống</h3>
      </div>
      <h4 class="case-subtitle">${escapeHtml(cs.title)}</h4>
      <div class="case-scenario">${escapeHtml(cs.scenario)}</div>
      <p class="case-question">${escapeHtml(cs.question)}</p>
      <div class="case-options">${options}</div>
      ${
        !state.submitted
          ? `<button class="btn-primary case-submit" data-bai="${baiId}">✓ Nộp đáp án</button>`
          : `<div class="case-explanation">
             <strong>💡 Giải thích:</strong>
             <p>${escapeHtml(cs.explanation)}</p>
             <button class="btn-secondary case-retry" data-bai="${baiId}">🔁 Làm lại</button>
           </div>`
      }
    </section>
  `;
}

// ═══════════════════════════════════════════════════════════════
// 5. DELIVERABLE (Sản phẩm cuối bài)
// ═══════════════════════════════════════════════════════════════

export function renderDeliverable(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data || !data.deliverable) return "";

  const d = data.deliverable;

  const requirements = d.requirements
    .map((r, i) => `<li>${escapeHtml(r)}</li>`)
    .join("");

  const rubricRows = d.rubric
    .map(
      (r) => `
    <tr>
      <td>${escapeHtml(r.criterion)}</td>
      <td class="rubric-points">${r.points} điểm</td>
    </tr>
  `,
    )
    .join("");

  return `
    <section class="lesson-deliverable" data-bai="${baiId}">
      <div class="lo-header">
        <span class="lo-icon">📦</span>
        <h3 class="lo-title">${escapeHtml(d.title)}</h3>
      </div>
      <p class="deliverable-desc">${escapeHtml(d.description)}</p>

      <div class="deliverable-section">
        <h4>📝 Yêu cầu cụ thể:</h4>
        <ol class="deliverable-reqs">${requirements}</ol>
      </div>

      <div class="deliverable-section">
        <h4>📊 Tiêu chí chấm điểm (Rubric):</h4>
        <table class="rubric-table">
          <thead>
            <tr><th>Tiêu chí</th><th>Điểm</th></tr>
          </thead>
          <tbody>${rubricRows}</tbody>
          <tfoot>
            <tr><th>TỔNG ĐIỂM</th><th class="rubric-points">${d.maxPoints} điểm</th></tr>
          </tfoot>
        </table>
      </div>

      <div class="deliverable-submit">
        <strong>📤 Hình thức nộp:</strong> ${escapeHtml(d.submitFormat)}
      </div>
    </section>
  `;
}

// ═══════════════════════════════════════════════════════════════
// 6. TRUTH TABLE (Bảng trạng thái — chỉ Bài 3)
// ═══════════════════════════════════════════════════════════════

export function renderTruthTable(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data || !data.truthTable) return "";

  const tt = data.truthTable;
  const state = _truthState.get(baiId) || {
    answers: tt.rows.map(() => new Array(tt.columns.length).fill("")),
    submitted: false,
  };

  const headerCells = tt.columns
    .map((c) => `<th>${escapeHtml(c)}</th>`)
    .join("");

  const bodyRows = tt.rows
    .map((row, ri) => {
      const cells = row.truth
        .map((correct, ci) => {
          const userAnswer = state.answers[ri][ci];
          let cellClass = "";

          if (state.submitted) {
            if (userAnswer === correct) cellClass = "tt-cell-correct";
            else if (userAnswer) cellClass = "tt-cell-wrong";
            else cellClass = "tt-cell-empty";
          }

          return `
        <td class="tt-cell ${cellClass}" data-ri="${ri}" data-ci="${ci}" data-bai="${baiId}">
          ${
            state.submitted
              ? `<span class="tt-user">${escapeHtml(userAnswer || "—")}</span>
               <span class="tt-correct">(${escapeHtml(correct)})</span>`
              : `<button class="tt-toggle" data-ri="${ri}" data-ci="${ci}" data-bai="${baiId}">
                 ${escapeHtml(userAnswer || "?")}
               </button>`
          }
        </td>
      `;
        })
        .join("");

      return `
      <tr>
        <th class="tt-gear">${escapeHtml(row.gear)}</th>
        ${cells}
      </tr>
    `;
    })
    .join("");

  // Score if submitted
  let scoreHtml = "";
  if (state.submitted) {
    let correct = 0;
    const total = tt.rows.length * tt.columns.length;
    state.answers.forEach((row, ri) => {
      row.forEach((a, ci) => {
        if (a === tt.rows[ri].truth[ci]) correct++;
      });
    });
    const pct = Math.round((correct / total) * 100);
    const grade = pct >= 80 ? "Tốt" : pct >= 60 ? "Khá" : "Cần ôn lại";

    // Build explanation list
    const explanationHtml = Object.entries(tt.explanation)
      .map(
        ([gear, exp]) => `
        <div class="tt-explain-row">
          <strong>${escapeHtml(gear)}:</strong> ${escapeHtml(exp)}
        </div>
      `,
      )
      .join("");

    scoreHtml = `
      <div class="tt-score">
        <div class="tt-score-main">
          <span class="tt-score-num">${correct}/${total}</span>
          <span class="tt-score-pct">(${pct}%)</span>
          <span class="tt-score-grade">${grade}</span>
        </div>
        <button class="btn-secondary tt-retry" data-bai="${baiId}">🔁 Làm lại</button>
      </div>
      <div class="tt-explain">
        <h4>📖 Giải thích đường truyền lực:</h4>
        ${explanationHtml}
      </div>
    `;
  }

  return `
    <section class="lesson-truth-table" data-bai="${baiId}">
      <div class="lo-header">
        <span class="lo-icon">📊</span>
        <h3 class="lo-title">${escapeHtml(tt.title)}</h3>
      </div>
      <p class="lo-intro">${escapeHtml(tt.description)}</p>
      <p class="tt-hint">💡 <em>Click vào ô để chuyển đổi: ? → ✓ → ✗ → ?</em></p>
      <div class="tt-wrapper">
        <table class="truth-table">
          <thead>
            <tr>
              <th class="tt-gear-header">Tay số</th>
              ${headerCells}
            </tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      ${
        !state.submitted
          ? `<button class="btn-primary tt-submit" data-bai="${baiId}">✓ Nộp bài</button>`
          : scoreHtml
      }
    </section>
  `;
}

// ═══════════════════════════════════════════════════════════════
// COMBO: All-in-one for end-of-lesson rendering
// ═══════════════════════════════════════════════════════════════

export function renderLessonOutcomes(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data) return "";

  const parts = [];
  parts.push(`<div class="lesson-outcomes-wrapper" data-bai="${baiId}">`);
  parts.push('<h2 class="lo-section-title">📚 Kết quả bài học</h2>');

  // Bài 3 có truth table → đặt trước quiz vì quan trọng nhất
  if (data.truthTable) parts.push(renderTruthTable(baiId));

  parts.push(renderQuiz(baiId));
  parts.push(renderCaseStudy(baiId));
  parts.push(renderConclusion(baiId));

  parts.push("</div>");
  return parts.join("\n");
}

// ═══════════════════════════════════════════════════════════════
// EVENT HANDLERS — register once on app init
// ═══════════════════════════════════════════════════════════════

let _initialized = false;

export function initLessonOutcomesEvents() {
  if (_initialized) return;
  _initialized = true;

  // Delegate all events to document
  document.addEventListener("click", handleClick);
  document.addEventListener("change", handleChange);
}

function handleClick(e) {
  // Quiz submit
  if (e.target.matches(".quiz-submit")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    submitQuiz(baiId);
  }
  // Quiz retry
  else if (e.target.matches(".quiz-retry")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    _quizState.delete(baiId);
    rerender(baiId);
  }
  // Case submit
  else if (e.target.matches(".case-submit")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    submitCase(baiId);
  }
  // Case retry
  else if (e.target.matches(".case-retry")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    _caseState.delete(baiId);
    rerender(baiId);
  }
  // Truth table cell toggle
  else if (e.target.matches(".tt-toggle")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    const ri = parseInt(e.target.dataset.ri, 10);
    const ci = parseInt(e.target.dataset.ci, 10);
    toggleTruthCell(baiId, ri, ci);
  }
  // Truth table submit
  else if (e.target.matches(".tt-submit")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    submitTruthTable(baiId);
  }
  // Truth table retry
  else if (e.target.matches(".tt-retry")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    _truthState.delete(baiId);
    rerender(baiId);
  }
}

function handleChange(e) {
  // Quiz radio
  if (e.target.matches(".quiz-radio")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    const q = parseInt(e.target.dataset.q, 10);
    const opt = parseInt(e.target.dataset.opt, 10);
    const data = lessonOutcomes[baiId];
    if (!data) return;

    let state = _quizState.get(baiId);
    if (!state) {
      state = {
        answers: new Array(data.quiz.length).fill(null),
        submitted: false,
      };
      _quizState.set(baiId, state);
    }
    state.answers[q] = opt;
  }
  // Case checkbox
  else if (e.target.matches(".case-checkbox")) {
    const baiId = parseInt(e.target.dataset.bai, 10);
    const opt = parseInt(e.target.dataset.opt, 10);

    let state = _caseState.get(baiId);
    if (!state) {
      state = { picks: new Set(), submitted: false };
      _caseState.set(baiId, state);
    }
    if (e.target.checked) state.picks.add(opt);
    else state.picks.delete(opt);
  }
}

function submitQuiz(baiId) {
  const data = lessonOutcomes[baiId];
  if (!data) return;

  let state = _quizState.get(baiId);
  if (!state) {
    state = {
      answers: new Array(data.quiz.length).fill(null),
      submitted: false,
    };
    _quizState.set(baiId, state);
  }
  state.submitted = true;
  rerender(baiId);

  // Scroll the quiz section into view after rerender
  setTimeout(() => {
    const el = document.querySelector(`.lesson-quiz[data-bai="${baiId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

function submitCase(baiId) {
  let state = _caseState.get(baiId);
  if (!state) {
    state = { picks: new Set(), submitted: false };
    _caseState.set(baiId, state);
  }
  state.submitted = true;
  rerender(baiId);
  setTimeout(() => {
    const el = document.querySelector(`.lesson-case[data-bai="${baiId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

function toggleTruthCell(baiId, ri, ci) {
  const data = lessonOutcomes[baiId];
  if (!data || !data.truthTable) return;

  let state = _truthState.get(baiId);
  if (!state) {
    state = {
      answers: data.truthTable.rows.map(() =>
        new Array(data.truthTable.columns.length).fill(""),
      ),
      submitted: false,
    };
    _truthState.set(baiId, state);
  }
  // Toggle: "" → "✓" → "✗" → ""
  const current = state.answers[ri][ci];
  state.answers[ri][ci] = current === "" ? "✓" : current === "✓" ? "✗" : "";

  // Update just the button in place (avoid full rerender for performance)
  const btn = document.querySelector(
    `.tt-toggle[data-bai="${baiId}"][data-ri="${ri}"][data-ci="${ci}"]`,
  );
  if (btn) btn.textContent = state.answers[ri][ci] || "?";
}

function submitTruthTable(baiId) {
  let state = _truthState.get(baiId);
  if (!state) return;
  state.submitted = true;
  rerender(baiId);
  setTimeout(() => {
    const el = document.querySelector(
      `.lesson-truth-table[data-bai="${baiId}"]`,
    );
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

// Re-render the entire lesson outcomes section for a bai
function rerender(baiId) {
  const wrapper = document.querySelector(
    `.lesson-outcomes-wrapper[data-bai="${baiId}"]`,
  );
  if (!wrapper) return;
  wrapper.outerHTML = renderLessonOutcomes(baiId);
}
