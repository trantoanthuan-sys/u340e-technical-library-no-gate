/**
 * modules/home.js — Dashboard (Home Page)
 * =========================================
 * Renders the main dashboard with section cards.
 * Called by router when hash is '#/'.
 */

import { store } from "../core/store.js";
import {
  renderPage,
  renderBreadcrumb,
  escapeHtml,
  showLoading,
} from "../core/renderer.js";

// Accent colors per section (matches sections.json color field)
const SECTION_COLORS = [
  "#1e3a6e", // Section 1 — Navy
  "#065f46", // Section 2 — Emerald
  "#92400e", // Section 3 — Amber/Brown
  "#6b21a8", // Section 4 — Purple
  "#991b1b", // Section 5 — Red (DTC)
];

/**
 * Main entry point — called by router.
 */
export async function renderHome() {
  showLoading();

  // Update breadcrumb to home (still clickable — clicking it just refreshes home)
  renderBreadcrumb([{ label: "Trang Chủ", href: "#/" }]);

  // Update sidebar state
  store.set("activeSectionId", null);
  store.set("activeSubId", null);
  store.set("activeDtcCode", null);

  try {
    const sections = await store.loadSections();
    renderPage(_buildHomeHtml(sections));
    _bindHomeEvents();
  } catch (err) {
    console.error("[Home] Failed to load sections:", err);
    renderPage(_buildErrorHtml());
  }
}

// ─── HTML Builders ───────────────────────────────────────────────

function _buildHomeHtml(sections) {
  const cardsHtml = sections.map((s, i) => _buildSectionCard(s, i)).join("");

  return `
    <div class="content-wrapper animate-fade-in">

      <!-- TRANG GIỚI THIỆU -->
      <div class="home-landing" id="home-landing">

        <!-- HERO -->
        <div class="home-hero-v3">
          <!-- Watermark "U340E" khổng lồ phía sau -->
          <div class="home-hero-watermark" aria-hidden="true">U340E</div>

          <div class="home-hero-grid">
            <!-- Bên trái: text -->
            <div class="home-hero-text">
              <div class="home-hero-eyebrow">TOYOTA · AUTOMATIC TRANSMISSION</div>

              <h1 class="home-hero-title">
                Hộp Số Tự Động<br>
                <span class="home-hero-title-accent">U340E</span>
              </h1>

              <p class="home-hero-desc">
                <strong>U340E</strong> là hộp số tự động 4 cấp kiểu <strong>transaxle</strong> (tích hợp hộp số và vi sai) thuộc họ U của Toyota, phổ biến trên xe dẫn động cầu trước dùng động cơ <strong>1NZ-FE</strong>. Thiết kế gọn nhẹ giúp <strong>tiết kiệm nhiên liệu</strong>, chuyển số êm nhờ kết hợp điều khiển thủy lực và điện tử.
              </p>

              <div class="home-hero-buttons">
                <button class="home-hero-btn-primary" id="btn-start-learning">
                  Bắt đầu học tập
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
                <a href="#/dtc" class="home-hero-btn-secondary">
                  Tra Cứu DTC
                </a>
              </div>
            </div>

            <!-- Bên phải: ảnh hộp số thật + floating spec -->
            <div class="home-hero-visual">
              <div class="home-hero-spec home-hero-spec-tr">
                <span class="home-hero-spec-label">LOẠI</span>
                Hộp số tự động 4 cấp
              </div>
              <div class="home-hero-product-v3">
                <img
                  src="assets/images/hero-u340e-real.png"
                  alt="Mô hình hộp số tự động Toyota U340E thực tế"
                  class="home-hero-product-img"
                  loading="eager"
                />
              </div>
              <div class="home-hero-spec home-hero-spec-bl">
                <span class="home-hero-spec-label">ĐIỀU KHIỂN</span>
                Điện tử + Thủy lực
              </div>
            </div>
          </div>
        </div>

        <!-- STATS BAR -->
        <div class="home-stats-bar">
          <div class="home-stat">
            <div class="home-stat-num">5</div>
            <div class="home-stat-label">BÀI</div>
          </div>
          <div class="home-stat">
            <div class="home-stat-num">19</div>
            <div class="home-stat-label">MỤC HỌC</div>
          </div>
          <div class="home-stat">
            <div class="home-stat-num">18</div>
            <div class="home-stat-label">MÃ DTC</div>
          </div>
          <div class="home-stat">
            <div class="home-stat-num">165+</div>
            <div class="home-stat-label">HÌNH ẢNH</div>
          </div>
        </div>

        <!-- UNIVERSITY CARD -->
        <div class="home-uni-card">
          <div class="home-uni-col">
            <h4 class="home-uni-label">TRƯỜNG ĐẠI HỌC</h4>
            <div class="home-uni-name">Đại học Bách Khoa TP.HCM</div>
            <p class="home-uni-desc">
              Khoa Kỹ thuật Giao thông<br>
              Bộ môn Kỹ thuật Ô tô · Máy động lực
            </p>
          </div>
          <div class="home-uni-col">
            <h4 class="home-uni-label">SINH VIÊN THỰC HIỆN</h4>
            <div class="home-uni-name">Trần Toàn Thuận · MSSV 2213366</div>
            <p class="home-uni-desc">
              GVHD: Nguyễn Đình Hùng<br>
              Năm học 2025 – 2026
            </p>
          </div>
        </div>

      </div>

      <!-- TRANG DANH MỤC HỌC -->
      <div class="home-learning" id="home-learning" hidden>
        <a href="#" class="btn-back-home" id="btn-back-home">
          ← Quay lại trang giới thiệu
        </a>

        <div class="page-title-block">
          <h1 class="page-title">
            Danh Mục Học Tập <span style="color: var(--color-amber-600);">U340E</span>
          </h1>

          <p class="page-subtitle">
            Chọn một bài để bắt đầu học tập và tra cứu nội dung kỹ thuật hộp số tự động U340E.
          </p>
        </div>

        <div class="dashboard-grid" id="dashboard-grid">
          ${cardsHtml}
        </div>

        <div class="home-dtc-banner" id="home-dtc-banner">
          <div class="dtc-banner-left">
            <span class="dtc-banner-icon">⚠</span>
            <div>
              <div class="dtc-banner-title">Tra Cứu Mã Lỗi DTC</div>
              <div class="dtc-banner-sub">
                12 mã lỗi với quy trình chẩn đoán chi tiết
              </div>
            </div>
          </div>

          <a href="#/dtc" class="dtc-banner-btn">
            Xem Danh Mục →
          </a>
        </div>
      </div>

    </div>
  `;
}

function _buildSectionCard(section, index) {
  const color = SECTION_COLORS[index] || "var(--color-navy-500)";
  const count = section.subsections?.length ?? 0;
  const isDtc = section.isDtcSection;
  const href = isDtc ? "#/dtc" : `#/section/${section.id}`;

  return `
    <a href="${href}"
       class="section-card ${isDtc ? "card-dtc" : ""}"
       style="--card-accent: ${color};">
      <div class="section-card-body">

        <div class="section-card-num">
          BÀI ${escapeHtml(String(section.id))}
        </div>

        <div class="section-card-title">
          ${escapeHtml(section.title)}
        </div>

        <div class="section-card-desc">
          ${escapeHtml(section.description)}
        </div>

        <div class="section-card-footer">
          <span class="section-card-count">
            ${isDtc ? "⚠ Danh mục mã lỗi DTC" : `${count} mục học`}
          </span>
          <svg class="section-card-arrow" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

      </div>
    </a>
  `;
}

function _buildErrorHtml() {
  return `
    <div class="content-wrapper">
      <div class="empty-state">
        <div class="empty-state-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <div class="empty-state-title">Không tải được dữ liệu</div>
        <p class="empty-state-text">
          Vui lòng kiểm tra file <code>data/sections.json</code> và thử lại.
        </p>
      </div>
    </div>
  `;
}

// ─── Event Bindings ──────────────────────────────────────────────

function _bindHomeEvents() {
  const startBtn = document.getElementById("btn-start-learning");
  const backBtn = document.getElementById("btn-back-home");
  const landing = document.getElementById("home-landing");
  const learning = document.getElementById("home-learning");

  if (startBtn && landing && learning) {
    startBtn.addEventListener("click", () => {
      landing.hidden = true;
      learning.hidden = false;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  if (backBtn && landing && learning) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();

      learning.hidden = true;
      landing.hidden = false;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}
