<div align="center">

![Logo Bách Khoa](assets/images/logo-bk.png)

# 🔧 U340E — Thư Viện Kỹ Thuật

### Hệ thống tra cứu kỹ thuật hộp số tự động Toyota U340E

**Đồ án môn học** — Khoa Kỹ thuật Giao thông
Bộ môn Kỹ thuật Ô tô — Máy Động lực
Trường Đại học Bách Khoa — ĐHQG TP. Hồ Chí Minh

![Status](https://img.shields.io/badge/status-completed-success)
![Tech](https://img.shields.io/badge/JavaScript-ES2020-f7df1e)
![CSS](https://img.shields.io/badge/CSS-Custom_Properties-1572B6)
![License](https://img.shields.io/badge/license-Academic-blue)

</div>

---

## 📖 Giới thiệu

**U340E — Thư Viện Kỹ Thuật** là ứng dụng web dạng **Single Page Application (SPA)** phục vụ tra cứu, học tập và tham khảo kỹ thuật hộp số tự động **Toyota U340E** — hộp số 4 cấp tự động phổ biến trên các dòng xe du lịch cỡ nhỏ và trung bình (Vios, Yaris, Corolla Altis...).

**Mục tiêu:**

- 📚 Hỗ trợ giảng dạy & học tập cho sinh viên ngành Kỹ thuật Ô tô
- 🔍 Tra cứu nhanh nội dung kỹ thuật, mã lỗi DTC và triệu chứng thường gặp
- 🛠️ Tham khảo quy trình tháo lắp dựa trên thực hành mô hình
- 💡 Trực quan hóa cấu tạo bằng sơ đồ tương tác kiểu PowerPoint
- 🩺 Hướng dẫn chẩn đoán với flowchart YES/NO động cho cả mã lỗi và triệu chứng

### 📊 Số liệu

**5 chương** — **18 mục** — **18 mã lỗi DTC** — **25 triệu chứng** — **220+ hình minh họa**

---

## ✨ Tính năng chính

- 🏠 **Dashboard trực quan** — 5 chương dưới dạng thẻ, mỗi chương một màu riêng
- 🧭 **Sidebar + Breadcrumb động** — luôn biết đang ở đâu, nút "Trang Chủ" luôn click được ở mọi tình huống (kể cả deep-link)
- 🔍 **Tìm kiếm toàn cục** — phím tắt `Ctrl+K`, tìm cả nội dung, mã lỗi DTC, triệu chứng — hỗ trợ **tiếng Việt không dấu**
- ⚠️ **Tra cứu mã lỗi DTC** (mục 5.1) — 18 mã DTC theo 5 nhóm, **flowchart chẩn đoán tương tác** kiểu PowerPoint
- 🩺 **Tra cứu triệu chứng** (mục 5.2) — 25 triệu chứng theo 6 nhóm, mỗi triệu chứng có flowchart YES/NO theo từng bộ phận nghi ngờ
- 🎯 **Sơ đồ tương tác** — click số thứ tự trên hình để xem chi tiết bộ phận
- 🔎 **Lightbox** — click bất kỳ ảnh kỹ thuật nào để phóng to xem chi tiết, có prev/next
- 📐 **Render công thức LaTeX** — hiển thị công thức đẹp như sách giáo khoa (KaTeX, offline)
- 🔗 **Liên kết chéo** — bài học và mã lỗi DTC liên kết hai chiều (`relatedDTC` ↔ `relatedSections`)
- 🎓 **Hệ thống chuẩn đầu ra bài học** — mỗi bài có khối Mục tiêu, Kết luận (kiến thức + kỹ năng), Trắc nghiệm tương tác, Bài tập tình huống và Rubric chấm sản phẩm
- 📷 **Layout 2 cột** (Chương 2) — so sánh trực quan **hình kỹ thuật** từ tài liệu Toyota với **ảnh thực tế** khi nhóm tháo lắp
- 📱 **Responsive** — tối ưu cho desktop, tablet và mobile
- ♿ **Accessible** — ARIA labels, phím tắt, keyboard navigation

### 🚀 Điểm khác biệt

Project này khác các tài liệu kỹ thuật truyền thống (Word/PDF/slide) ở **5 điểm cốt lõi**:

|     | Đặc điểm                       | Giá trị                                                      |
| :-: | ------------------------------ | ------------------------------------------------------------ |
| 🎯  | **Dual Interactive Diagnosis** | DTC + Triệu chứng — cả hai đều có flowchart YES/NO tương tác |
| 📦  | **JSON Content System**        | Nội dung tách khỏi code, dễ mở rộng sang U440E/U660E         |
| ⚙️  | **Vanilla JS SPA**             | Tự viết router + store + lightbox, không phụ thuộc framework |
| 📐  | **LaTeX Math Rendering**       | Công thức tính toán đẹp như sách giáo khoa (KaTeX)           |
| 📷  | **Documentation + Reality**    | 2 cột song song: tài liệu Toyota vs ảnh thực hành nhóm       |

---

## 📚 Cấu trúc nội dung

| Chương | Tiêu đề               | Số mục | Trọng tâm                                           |
| :----: | --------------------- | :----: | --------------------------------------------------- |
| **1**  | Kết Cấu Hộp Số        |   5    | Biến mô, bơm dầu, bộ hành tinh, ly hợp - phanh      |
| **2**  | Quy Trình Tháo Lắp    |   2    | 22 bước tháo + 26 bước lắp, ảnh thực tế             |
| **3**  | Nguyên Lý Làm Việc    |   7    | Tổng quan + 6 chế độ tay số (1, 2, 3, 4 OD, lùi)    |
| **4**  | Điều Khiển & Thủy Lực |   2    | Hệ thống thủy lực, hệ thống điện tử (cảm biến, ECU) |
| **5**  | Chẩn Đoán & Bảo Dưỡng |   2    | 18 mã DTC + 25 triệu chứng với flowchart YES/NO     |

### Chương 5.1 — Database mã lỗi DTC

Phân loại theo **5 nhóm** dựa trên Toyota Service Manual:

|             Nhóm              | Mã lỗi                                          | Phạm vi                                         |
| :---------------------------: | ----------------------------------------------- | ----------------------------------------------- |
|       **P07** Cảm Biến        | `P0705` `P0710` `P0711` `P0712` `P0713` `P0717` | Cảm biến vị trí cần số, nhiệt độ ATF, tốc độ NT |
| **P0750** Solenoid Hiệu Suất  | `P0751` `P0756`                                 | Solenoid chuyển số S1, S2 (performance)         |
|   **P0780** Solenoid ON/OFF   | `P0787` `P0788`                                 | Solenoid chuyển đổi ST (mạch thấp/cao)          |
|   **P0970** Solenoid S1/S2    | `P0973` `P0974` `P0976` `P0977`                 | Mạch S1, S2 (thấp/cao)                          |
| **P2700** Solenoid Tuyến Tính | `P2714` `P2716` `P2757` `P2759`                 | SLT (line pressure), SLU (lock-up)              |

Mỗi mã lỗi có: **Symptom · Possible Causes · Diagnosis · Interactive Flowchart · Related Sections**

### Chương 5.2 — Database triệu chứng

Phân loại **25 triệu chứng** theo **6 nhóm**:

|           Nhóm            | Số TC | Phạm vi                                                        |
| :-----------------------: | ----- | -------------------------------------------------------------- |
|  **Xe không di chuyển**   | 2     | Không tiến/lùi được, không vào số R                            |
| **Không chuyển / hạ số**  | 6     | Kẹt số 1→2, 2→3, 3→4 / không downshift 4→3, 3→2, 2→1           |
|        **Lock-up**        | 1     | Không đóng/mở được lock-up clutch                              |
|       **Giật mạnh**       | 6     | Khi vào D từ N, khi up/downshift, khi gạt luân phiên D/2/L     |
|   **Trượt / Rung lắc**    | 5     | Trượt dãy D / số 1 / 2 / 3 / 4                                 |
| **Mất phanh / Hiệu suất** | 5     | Mất phanh động cơ dãy L/2, đạp ga chậm, tăng tốc kém, chết máy |

Mỗi triệu chứng có flowchart YES/NO với 1–9 bước kiểm tra (theo chuẩn Toyota Service Manual). Một số triệu chứng kèm hình minh họa cho các bước đo điện trở solenoid, kiểm tra biến mô…

---

## 🚀 Hướng dẫn chạy

> ⚠️ **QUAN TRỌNG**: Project dùng `fetch()` để load JSON nên **không chạy được qua `file://`**. Cần mở qua local HTTP server.

### Cách 1 — Live Server (khuyến nghị) ⭐

1. Mở project trong [VS Code](https://code.visualstudio.com/)
2. Cài extension **Live Server** (Ritwick Dey)
3. Chuột phải vào `index.html` → **"Open with Live Server"**
4. Trình duyệt tự mở tại `http://127.0.0.1:5500`

### Cách 2 — Python

```bash
cd "đường/dẫn/đến/U340E Project"
python -m http.server 8000
# Truy cập: http://localhost:8000
```

### Cách 3 — Node.js

```bash
npx serve
# hoặc: npx http-server -p 8000
```

### Yêu cầu trình duyệt

Chrome ≥ 61, Firefox ≥ 60, Safari ≥ 11, Edge ≥ 16 (hỗ trợ ES Modules + CSS Custom Properties)

---

## 🧭 Hướng dẫn sử dụng

### Điều hướng

- **Trang chủ** — click logo hoặc **"Trang Chủ"** trên breadcrumb (luôn click được ở mọi trang)
- **Chọn chương/bài học** — click thẻ ở dashboard hoặc mục trong sidebar
- **Quay lại** — dùng nút "← Quay lại" hoặc breadcrumb
- **Xem ảnh chi tiết** — click ảnh để mở lightbox, dùng phím ← → để duyệt

### Phím tắt

|        Phím tắt        | Chức năng                          |
| :--------------------: | ---------------------------------- |
|    `Ctrl+K` / `⌘+K`    | Mở tìm kiếm                        |
|         `Esc`          | Đóng sidebar / lightbox / tìm kiếm |
| `← →` (trong lightbox) | Ảnh trước / sau                    |
|         `Tab`          | Di chuyển giữa các phần tử         |

### Tra cứu mã lỗi DTC (mục 5.1)

1. Vào **"Chương 5 — Chẩn Đoán & Bảo Dưỡng"** → **"5.1 — Danh mục mã lỗi DTC"**
2. Lọc theo **5 nhóm** hoặc dùng search box
3. Click vào mã lỗi → trang chi tiết với sơ đồ mạch điện
4. Tại block **"Chẩn Đoán Tương Tác"**:
   - **Tab "Sơ đồ step-by-step"**: trả lời từng câu hỏi YES/NO theo wizard
   - **Tab "Sơ đồ tổng quan"**: cây flowchart mọc dần khi click YES/NO

### Tra cứu triệu chứng (mục 5.2)

1. Vào **"Chương 5"** → **"5.2 — Danh mục triệu chứng"**
2. Lọc theo **6 nhóm** triệu chứng hoặc dùng search box
3. Click vào triệu chứng → trang chi tiết với mô tả, khu vực nghi ngờ
4. 2 tab tương tự DTC để chẩn đoán theo từng bước

### Sơ đồ tương tác (Chương 1, 3, 4)

Click vào **số thứ tự** trên sơ đồ để xem chi tiết bộ phận. Dùng nút **Trước/Sau** để duyệt lần lượt.

---

## 🛠️ Công nghệ sử dụng

| Lĩnh vực           | Công nghệ                                     | Lý do chọn                                            |
| ------------------ | --------------------------------------------- | ----------------------------------------------------- |
| **Frontend**       | Vanilla JavaScript (ES Modules)               | Hiểu sâu nền tảng, không phụ thuộc framework          |
| **Kiến trúc**      | Hash-based SPA Router tự viết                 | Học cách routing hoạt động từ zero                    |
| **State**          | Custom Store (Pub/Sub pattern)                | Mô phỏng Redux/Zustand thu nhỏ                        |
| **Lightbox**       | Tự viết với event delegation                  | 1 handler cho toàn bộ ảnh, tự xử lý nav SPA           |
| **Styling**        | CSS3 với Custom Properties                    | Design system có thể mở rộng                          |
| **Typography**     | IBM Plex Sans / Serif / Mono + Be Vietnam Pro | Phù hợp ngữ cảnh kỹ thuật, học thuật                  |
| **Data**           | JSON + ES module exports (lazy-loaded)        | Tách nội dung khỏi code, dễ cập nhật                  |
| **Math Rendering** | [KaTeX 0.16.11](https://katex.org/) (offline) | Render công thức LaTeX nhanh, đẹp, không cần Internet |
| **Flowchart**      | HTML/CSS tự render                            | Custom animation kiểu PowerPoint, tương tác YES/NO    |

> **Không dùng** React/Vue/Angular hay build tool (Webpack/Vite). Toàn bộ code chạy trực tiếp trên trình duyệt hỗ trợ ES Modules.
>
> **Thư viện duy nhất là KaTeX** — được tải về trong thư mục `vendor/katex/` để đảm bảo hoạt động offline 100%.

---

## 📁 Cấu trúc thư mục

```
U340E Project/
│
├── index.html              # Entry HTML + app shell (header, sidebar, breadcrumb)
├── app.js                  # Bootstrap, router setup, global search index
├── README.md
│
├── core/                   # 🧩 Hạ tầng dùng chung (5 file)
│   ├── router.js          #   Hash-based SPA router
│   ├── store.js           #   State + data fetching + cache
│   ├── renderer.js        #   DOM helpers, breadcrumb, sidebar
│   ├── lightbox.js        #   Image lightbox với event delegation
│   └── highlight.js       #   Đánh dấu từ khóa từ URL ?highlight=...
│
├── modules/                # 🎨 Các module tính năng (5 file)
│   ├── home.js            #   Trang chủ với 5 chương
│   ├── section.js         #   Trang chương + bài học + cross-chapter nav
│   ├── dtc.js             #   Danh mục + chi tiết DTC + flowchart
│   ├── symptoms.js        #   Danh mục + chi tiết triệu chứng + flowchart
│   └── lesson-outcomes.js #   Mục tiêu, kết luận, quiz, case study, rubric
│
├── data/                   # 📊 Nội dung (JSON + ES module) — 9 file
│   ├── sections.json      #   Metadata 5 chương + sidebar
│   ├── section-1.json     #   Chương 1 — Kết Cấu Hộp Số (5 mục)
│   ├── section-2.json     #   Chương 2 — Quy Trình Tháo Lắp (2 mục: tháo + lắp)
│   ├── section-3.json     #   Chương 3 — Nguyên Lý Làm Việc (7 mục)
│   ├── section-4.json     #   Chương 4 — Điều Khiển & Thủy Lực (2 mục)
│   ├── section-5.json     #   Chương 5 — Chẩn Đoán & Bảo Dưỡng (2 mục)
│   ├── dtc-data.js        #   18 mã DTC + diagnosisFlow + grouping
│   ├── symptoms-data.js   #   25 triệu chứng + IMG library + 6 nhóm
│   └── lesson-outcomes.js #   Mục tiêu, quiz, case study, rubric cho từng bài
│
├── styles/                 # 🎨 CSS (tách 3 tầng)
│   ├── base.css           #   Design tokens, reset, typography
│   ├── layout.css         #   Header, sidebar, app shell
│   └── components.css     #   Card, button, table, flowchart, lightbox...
│
├── assets/images/          # 🖼️ Hình ảnh kỹ thuật (~220 ảnh)
│   ├── hero-u340e.png, logo-bk.png, logo-khoa.png
│   ├── s1/                #   Kết cấu hộp số (24 ảnh)
│   ├── s2/                #   Điều khiển & thủy lực (27 ảnh)
│   ├── s3/                #   Nguyên lý làm việc (7 ảnh)
│   ├── s4/                #   Quy trình tháo lắp — ảnh thực tế nhóm (110 ảnh)
│   ├── dtc/               #   Sơ đồ mạch điện 18 mã DTC (48 ảnh)
│   └── symptoms/          #   Hình minh họa bước kiểm tra (7 ảnh)
│
└── vendor/                 # 📦 Thư viện bên thứ 3 (offline)
    └── katex/             #   KaTeX 0.16.11 — math formula rendering
        ├── katex.min.css  #     CSS (23 KB)
        ├── katex.min.js   #     JS (275 KB)
        └── fonts/         #     60 file font (TTF/WOFF/WOFF2)
```

---

## 🏗️ Kiến trúc

Project áp dụng pattern **tách lớp 3 tầng** rõ ràng:

```
┌─────────────────────────────────────────────────┐
│  index.html  ←  App Shell (header + sidebar)    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  app.js  ←  Bootstrap, routes, search index      │
└─────────────────────────────────────────────────┘
                      ↓
┌──────────────┬──────────────────┬──────────────────────┐
│   core/      │   modules/       │    data/             │
│ (hạ tầng)    │ (tính năng)      │   (nội dung)         │
├──────────────┼──────────────────┼──────────────────────┤
│ • router.js  │ • home.js        │ • sections.json      │
│ • store.js   │ • section.js     │ • section-N.json     │
│ • renderer.js│ • dtc.js         │ • dtc-data.js        │
│ • lightbox.js│ • symptoms.js    │ • symptoms-data.js   │
│ • highlight.js│ • lesson-outcomes.js│ • lesson-outcomes.js│
└──────────────┴──────────────────┴──────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  styles/  ←  Design System (tokens + layers)    │
└─────────────────────────────────────────────────┘
```

### Luồng xử lý một request điều hướng

```
User click link #/symptoms/S10
        ↓
window.hashchange event
        ↓
router.js → match "/symptoms/:id"
        ↓
modules/symptoms.js → renderSymptomDetail({id:"S10"})
        ↓
data/symptoms-data.js → symptomsData["S10"]
        ↓
renderer.js → renderBreadcrumb() + page DOM
        ↓
lightbox.js (đã sẵn sàng cho ảnh mới)
        ↓
DOM updated ✨
```

---

## 🧠 Hệ thống nội dung

### Tách nội dung khỏi code

Toàn bộ nội dung kỹ thuật được lưu trong **JSON files** hoặc **ES module exports** trong thư mục `data/`. Khi cần cập nhật/sửa:

- ✅ **Không cần build, không cần deploy lại**
- ✅ Chỉ cần sửa file dữ liệu và refresh trình duyệt
- ✅ Dễ phân chia công việc (ví dụ: kỹ thuật viên viết nội dung không cần biết JavaScript)

### Cấu trúc một mục nội dung (chương 1–4)

```json
{
  "id": "1.2",
  "title": "Biến mô thủy lực",
  "content": {
    "intro": "Đoạn mở đầu giới thiệu...",
    "keyPoints": ["Điểm chính 1", "Điểm chính 2", "..."],
    "explain": [{ "title": "Cấu tạo", "body": "Mô tả chi tiết..." }],
    "specs": {
      "title": "Thông số kỹ thuật",
      "rows": [{ "param": "Tốc độ stall", "value": "1500 - 2000 rpm" }]
    },
    "relatedDTC": ["P2757", "P2759"]
  }
}
```

### Cấu trúc DTC

```js
// data/dtc-data.js
{
  code: "P0705",
  title: "Lỗi Mạch Công Tắc Vị Trí Cần Số",
  group: "P07",
  symptom: "...",
  possibleCauses: ["..."],
  steps: [
    { id: 1, title: "...", question: "...",
      answers: { yes: { next_step: 2 }, no: { result: "..." } } }
  ]
}
```

### Cấu trúc triệu chứng

```js
// data/symptoms-data.js
{
  id: "S13",
  title: "Giật mạnh khi chuyển số từ 3 → 4",
  group: "harsh-shift",
  description: "...",
  trouble_area: ["..."],
  steps: buildSteps([
    { key: "solenoidST", images: [IMG.stConnectorC28, IMG.stHarnessC20] },
    "valveBody",
    "brakeB1"
  ])
}
```

→ **Kỹ thuật DRY**: các bước kiểm tra phổ biến (valve body, ly hợp C1, phanh B2...) định nghĩa 1 lần trong object `CHECK`, mỗi triệu chứng chỉ reference. Hình ảnh được override per-symptom để chỉ hiện đúng những ảnh có trong tài liệu gốc.

→ Cả 2 module engine **tự render flowchart tương tác** từ data. Mỗi step có `answers.yes`/`answers.no` trỏ đến step tiếp theo hoặc kết quả chẩn đoán.

---

## 🩺 Tính năng nổi bật: Flowchart chẩn đoán tương tác

Đây là **tính năng đặc trưng nhất** của project — áp dụng cho cả **mục 5.1 (DTC)** và **mục 5.2 (Triệu chứng)**.

### 2 chế độ trong cùng 1 block

#### ⚡ Tab "Sơ đồ step-by-step"

- Wizard truyền thống: trả lời 1 câu hỏi tại 1 thời điểm
- Có **progress dots** hiển thị tổng quan luồng
- Lịch sử các bước đã đi, nút **"Quay lại"** / **"Reset"**

#### 📋 Tab "Sơ đồ tổng quan"

- **Animation kiểu PowerPoint**: ban đầu chỉ có Bước 1, click YES/NO → cây mọc thêm node
- Click lại bất kỳ nút YES/NO ở bước phía trên → các bước phía dưới tự cắt & rebuild theo nhánh mới
- Edge label YES (xanh) / NO (đỏ)
- Visited nodes mờ đi, current node nổi bật

→ Dùng được trên cả **desktop và mobile**, hoạt động không cần Internet.

---

## 🤖 Sự đóng góp của AI

### Vai trò của AI trong project

Project này được thực hiện với sự hỗ trợ của **Claude AI** (Anthropic) trong các vai trò:

- 💻 **Code generation** — viết code JavaScript, CSS, parsers
- 🏗️ **Kiến trúc** — đề xuất cấu trúc thư mục, pattern SPA, kỹ thuật DRY (CHECK definitions reuse)
- 🐛 **Debug** — tìm và sửa bug (vd. CSS specificity, breadcrumb deep-link)
- 📝 **Format nội dung** — chuyển nội dung Word → JSON, extract ảnh từ docx, đặt tên có hệ thống
- 🎨 **UI/UX suggestions** — đề xuất layout, animation, responsive

### Nguyên tắc đảm bảo trung thực học thuật

1. **AI là trợ lý, không phải người làm chính** — mọi quyết định kiến trúc và nội dung kỹ thuật do người làm đồ án duyệt
2. **Hiểu code AI sinh ra** — không copy mù, phải đọc hiểu và có khả năng sửa đổi
3. **Kiến thức chuyên ngành là của con người** — AI viết code web, nhưng kiến thức về hộp số U340E đến từ giáo trình và tài liệu kỹ thuật chính thức (Toyota Service Manual)
4. **Nội dung thực hành là của nhóm** — Chương 2 (tháo lắp) gồm 48 bước với 110 ảnh **do nhóm tự thực hiện và chụp** trên mô hình thực tế
5. **Database DTC + triệu chứng** — 18 mã DTC và 25 triệu chứng được nhóm trích xuất, dịch và biên tập từ Toyota Service Manual chính thức
6. **Minh bạch về việc dùng AI** — ghi rõ trong README để đảm bảo trung thực học thuật

---

## ✅ Trạng thái

### Đã hoàn thành (100%)

- ✅ Kiến trúc SPA với router & state management & lightbox
- ✅ 5 chương nội dung — 18 mục
- ✅ 18 mã lỗi DTC từ Toyota Service Manual chính thức
- ✅ 25 triệu chứng thường gặp với flowchart YES/NO tương tác
- ✅ Sơ đồ tổng quan kiểu PowerPoint (cây mọc dần) — dùng chung cho DTC & triệu chứng
- ✅ Sơ đồ tương tác với hotspot (Chương 1, 3, 4)
- ✅ Tìm kiếm toàn cục với hỗ trợ tiếng Việt không dấu (cả nội dung + DTC + triệu chứng)
- ✅ Layout 2 cột Chương 2 (tài liệu vs ảnh thực tế)
- ✅ Liên kết chéo bài học ↔ DTC (`relatedDTC` ↔ `relatedSections`)
- ✅ Render công thức LaTeX (KaTeX offline)
- ✅ Lightbox phóng to ảnh với prev/next navigation
- ✅ Cross-chapter prev/next navigation (chương cuối tự liên kết sang chương sau)
- ✅ Nút "Trang Chủ" luôn click được ở mọi tình huống (kể cả deep-link)
- ✅ Responsive design (desktop/tablet/mobile)
- ✅ 110 ảnh thực hành tháo lắp do nhóm tự chụp

### Có thể mở rộng (không bắt buộc)

- 🔄 Print stylesheet (in trang ra giấy)
- 🔄 Dark mode
- 🔄 QR code động cho từng trang DTC / triệu chứng
- 🔄 Multi-language (Anh/Việt)
- 🔄 Export PDF từng chương

---

## 🎓 Thông tin đồ án

| Mục                      | Nội dung                                           |
| ------------------------ | -------------------------------------------------- |
| **Tên đồ án**            | Thư viện kỹ thuật hộp số tự động U340E             |
| **Môn học**              | Chẩn đoán và bảo dưỡng hộp số                      |
| **Sinh viên thực hiện**  | Trần Toàn Thuận — MSSV: 2213366                    |
| **Giảng viên hướng dẫn** | Nguyễn Đình Hùng                                   |
| **Khoa/Bộ môn**          | Kỹ thuật Giao thông — Kỹ thuật Ô tô — Máy Động lực |
| **Trường**               | Đại học Bách Khoa — ĐHQG TP. Hồ Chí Minh           |
| **Năm học**              | 2025 — 2026                                        |

---

## 📄 License

Đồ án này được thực hiện với mục đích **học thuật**. Nội dung kỹ thuật về hộp số U340E dựa trên tài liệu công khai của Toyota Motor Corporation và các giáo trình chuyên ngành Kỹ thuật Ô tô.

Code có thể dùng cho mục đích học tập và tham khảo. Khi sử dụng lại, vui lòng ghi nguồn.

---

<div align="center">

**Made with ❤️ for Automotive Engineering students**

_Nếu bạn thấy project này hữu ích, hãy để lại một ⭐ trên repository!_

[⬆ Quay lại đầu trang](#-u340e--thư-viện-kỹ-thuật)

</div>
