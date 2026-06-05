/**
 * symptoms-data.js — Database 25 triệu chứng hộp số U340E
 *
 * Cấu trúc tương tự dtc-data.js:
 *   - id: mã định danh (S01..S25)
 *   - title: tên triệu chứng
 *   - subtitle: khu vực nghi ngờ tóm tắt
 *   - group: key khớp với symptomGroups
 *   - description: mô tả ngắn
 *   - trouble_area: danh sách bộ phận có thể gây ra triệu chứng
 *   - steps[]: từng bước kiểm tra với question + yes/no branching
 *
 * Logic flowchart (lấy từ "Giật_mạnh_khi_chuyển_số_từ_N_-D.pdf"):
 *   - Tại mỗi bước hỏi "Bộ phận này có ổn không?"
 *   - YES (ổn)  → sang bước tiếp theo
 *   - NO  (hỏng) → kết quả "Sửa chữa / thay thế bộ phận đó"
 *
 * Nội dung chi tiết các bước lấy từ "26_trieu_chung.docx".
 */

// ─── Common inspection procedures (định nghĩa 1 lần, dùng lại) ───
// Để tránh lặp 20 lần "Kiểm tra Valve Body" với nội dung y hệt,
// các check phổ biến được khai báo ở đây, mỗi symptom chỉ reference.

const CHECK = {
  valveBody: {
    title: "Kiểm tra Valve Body",
    purpose:
      "Valve body là trung tâm điều khiển thủy lực — kẹt valve hoặc bẩn dầu sẽ gây hầu hết các triệu chứng chuyển số bất thường.",
    actions: [
      "Kiểm tra DTC bằng máy chẩn đoán (nếu có mã liên quan → xử lý theo mã trước)",
      "Đo áp suất valve body ở chế độ D và R (Idle: D 372–412 kPa, R 553–623 kPa; Stall: D 1.126–1.226 kPa, R 1.664–1.864 kPa)",
      "Kiểm tra dầu ATF: nếu đen, có mùi khét hoặc nhiều bột mịn → valve body bị bẩn",
      "Tháo và kiểm tra lọc dầu: có cặn, mạt kim loại hay vật thể lạ không",
      "Tháo valve body, kiểm tra tất cả các valve di chuyển mượt mà, không kẹt",
      "Kiểm tra solenoid (SLT, SLU, S1, S2, ST) bằng ắc quy 12V — phải có tiếng 'click' rõ",
    ],
    question:
      "Tất cả các valve và solenoid trên valve body đều hoạt động bình thường?",
    failResult:
      "Kiểm tra các valve và chi tiết của solenoid — Sửa chữa hoặc thay thế valve body.",
  },
  manualValve: {
    title: "Kiểm tra Manual Valve",
    purpose:
      "Manual valve được điều khiển trực tiếp bởi cần số. Nếu kẹt hoặc mòn, hộp số sẽ không vào được số dù cần đã ở đúng vị trí.",
    actions: [
      "Tháo Manual valve ra khỏi valve body",
      "Di chuyển valve bằng tay — phải nhẹ nhàng, không kẹt",
      "Kiểm tra bề mặt valve: không bị mòn, rãnh xước, dị vật",
      "Vệ sinh sạch, lắp lại và test chạy thử",
    ],
    question: "Manual valve di chuyển mượt mà và không có hư hỏng?",
    failResult:
      "Thay Manual valve (nếu mòn nặng hoặc kẹt cứng, thay cả valve body).",
  },
  oilFilter: {
    title: "Kiểm tra lọc dầu",
    purpose:
      "Lọc dầu tắc nghẽn gây thiếu áp dầu cho ly hợp/phanh — dẫn đến trượt, mất lực, giật.",
    actions: [
      "Tháo cạc-te và lọc dầu",
      "Kiểm tra lọc có cặn bẩn, bột kim loại, hay tắc nghẽn không",
      "Lau sạch cạc-te, thay ron mới",
    ],
    question: "Lọc dầu sạch, không tắc nghẽn?",
    failResult:
      "Thay lọc dầu mới (rất hay là nguyên nhân của tăng tốc kém / trượt).",
  },
  planetaryGear: {
    title: "Kiểm tra cụm bánh răng hành tinh",
    purpose:
      "Bánh răng hành tinh bị mòn răng, mẻ răng hoặc carrier hỏng làm xe không truyền được mô-men dù ly hợp đã đóng.",
    actions: [
      "Tháo bộ bánh răng hành tinh ra khỏi hộp số",
      "Kiểm tra răng (front/rear planetary ring gear, sun gear, pinion gear): mẻ, gãy, mòn, cháy xém",
      "Kiểm tra planetary carrier: pinion quay êm không, có kẹt hay lỏng",
      "Kiểm tra thrust bearing/washer: độ dày, tiếng kêu kim loại",
      "Kiểm tra one-way clutch F1 bên trong: phải khóa 1 chiều, quay tự do chiều kia",
    ],
    question: "Tất cả chi tiết bánh răng hành tinh đều đạt tiêu chuẩn?",
    failResult:
      "Kiểm tra chi tiết các bánh răng trong cụm — Thay planetary gear unit nếu có bộ phận hỏng.",
  },
  torqueConverter: {
    title: "Kiểm tra cụm biến mô (Torque Converter)",
    purpose:
      "Biến mô là khâu truyền lực thủy lực giữa động cơ và hộp số. Hỏng one-way clutch, drive plate vênh hoặc ATF bẩn đều gây trượt / chậm / chết máy.",
    actions: [
      "Tháo torque converter clutch ra khỏi hộp số",
      "Lắp SST 09350-32014, kiểm tra one-way clutch stator: xoay thuận êm, xoay ngược khóa cứng",
      "Kiểm tra tiếng kim loại lạ khi quay (trong stall test hoặc N)",
      "Kiểm tra bột kim loại trong ATF — nếu vượt giới hạn → thay biến mô",
      "Đo độ vênh drive plate: tối đa 0.20 mm",
      "Phun khí nén 196 kPa vào đường dầu để vệ sinh, kiểm tra ring gear",
    ],
    question: "Biến mô và one-way clutch còn hoạt động đúng tiêu chuẩn?",
    failResult:
      "Thay cụm torque converter clutch (sau khi thay phải RESET MEMORY bằng máy chẩn đoán + road test).",
  },
  // ─── Ly hợp đa đĩa ─────────────────────────────────────────
  clutchC1: {
    title: "Kiểm tra ly hợp C1",
    purpose:
      "C1 (Forward Clutch) đóng ở mọi tay số tiến (1, 2, 3, 4). Trượt C1 → mất lực toàn dãy D.",
    actions: [
      "Tháo C1 ra khỏi hộp số",
      "Kiểm tra bề mặt đĩa ma sát, đĩa thép, flange: cháy, mòn, lõm, dị vật",
      "Kiểm tra lò xo: nếu xẹp hay giãn quá → thay",
      "Kiểm tra piston: lắc xác nhận check ball không kẹt, bơm khí nén kiểm tra rò rỉ",
      "Thay 2 O-ring piston mới nếu cứng/nứt/mất đàn hồi",
      "Ngâm đĩa mới trong ATF WS ít nhất 15 phút trước khi lắp",
    ],
    question: "Ly hợp C1 còn tốt, không trượt?",
    failResult:
      "Kiểm tra chi tiết các bộ phận C1 — Thay đĩa/piston/O-ring/lò xo theo hư hỏng.",
  },
  clutchC2: {
    title: "Kiểm tra ly hợp C2",
    purpose:
      "C2 (Direct Clutch) đóng ở số 3 và số 4. Trượt C2 → mất lực ở các số cao.",
    actions: [
      "Tháo C2 ra khỏi hộp số",
      "Kiểm tra bề mặt đĩa ma sát, đĩa thép, flange",
      "Kiểm tra lò xo và piston (như C1)",
      "Thay O-ring mới nếu cứng/nứt",
      "Ngâm đĩa mới trong ATF WS ít nhất 15 phút",
    ],
    question: "Ly hợp C2 còn tốt, không trượt?",
    failResult: "Kiểm tra chi tiết ly hợp C2 — Thay theo hư hỏng cụ thể.",
  },
  clutchC3: {
    title: "Kiểm tra ly hợp C3",
    purpose:
      "C3 (Reverse/Underdrive Clutch) đóng ở số lùi R. Hỏng C3 → xe không lùi được hoặc giật khi vào N→D.",
    actions: [
      "Tháo C3 ra khỏi hộp số",
      "Kiểm tra bề mặt đĩa, lò xo, piston",
      "Lắc piston xác nhận check ball không kẹt",
      "Bơm khí nén nhẹ vào lỗ dầu → không được rò rỉ",
      "Thay O-ring nếu cứng/nứt/mất đàn hồi",
    ],
    question: "Ly hợp C3 còn tốt?",
    failResult: "Kiểm tra chi tiết các bộ phận ly hợp C3 — Thay theo hư hỏng.",
  },
  // ─── Phanh dải ─────────────────────────────────────────────
  brakeB1: {
    title: "Kiểm tra phanh B1",
    purpose:
      "B1 (2nd Brake) khóa ring gear ở số 4 OD. Hỏng B1 → không chuyển 3→4 hoặc trượt khi đang ở số 4.",
    actions: [
      "Tháo phanh B1",
      "Kiểm tra mặt trượt của 4 đĩa phanh + 4 đĩa thép + flange: mòn, cháy, lõm",
      "Kiểm tra lò xo: xẹp hay giãn dài bất thường → thay",
      "Kiểm tra piston: nứt, mòn, xước, biến dạng",
      "Thay O-ring và D-ring nếu cứng/nứt/phồng",
      "Ngâm đĩa mới trong ATF WS 15 phút",
    ],
    question: "Phanh B1 còn tốt, không trượt?",
    failResult: "Kiểm tra chi tiết các bộ phận phanh B1 — Thay theo hư hỏng.",
  },
  brakeB2: {
    title: "Kiểm tra phanh B2",
    purpose:
      "B2 (2nd Brake) khóa sun gear ở số 2 và 3. Hỏng B2 → không chuyển 1→2 hoặc giật khi N→D.",
    actions: [
      "Tháo phanh B2",
      "Kiểm tra mặt trượt đĩa phanh, đĩa thép, flange",
      "Kiểm tra lò xo, piston, O-ring/D-ring",
      "Ngâm đĩa mới trong ATF WS 15 phút trước khi lắp",
    ],
    question: "Phanh B2 còn tốt?",
    failResult: "Kiểm tra chi tiết các bộ phận phanh B2 — Thay theo hư hỏng.",
  },
  brakeB3: {
    title: "Kiểm tra phanh B3",
    purpose:
      "B3 (1st & Reverse Brake) khóa carrier ở số lùi và số 1 dãy L. Hỏng B3 → không lùi được / mất phanh động cơ ở dãy L.",
    actions: [
      "Tháo phanh B3",
      "Kiểm tra mặt trượt đĩa, đĩa thép, flange",
      "Kiểm tra lò xo, piston, các seal",
      "Thay đĩa nếu cháy/mòn nặng, thay seal nếu rò rỉ",
    ],
    question: "Phanh B3 còn tốt?",
    failResult: "Kiểm tra chi tiết các bộ phận phanh B3 — Thay theo hư hỏng.",
  },
  // ─── Ly hợp 1 chiều ────────────────────────────────────────
  owcF1: {
    title: "Kiểm tra ly hợp 1 chiều F1",
    purpose:
      "F1 (1st & 2nd Coast One-Way) chỉ cho phép carrier quay theo 1 chiều. Hỏng F1 → không chuyển 1→2 hoặc trượt mạnh.",
    actions: [
      "Tháo F1 ra khỏi cụm bánh răng hành tinh",
      "Giữ inner race cố định, xoay outer race",
      "Thuận chiều kim đồng hồ: phải quay tự do, êm",
      "Ngược chiều kim đồng hồ: phải khóa cứng, không quay được",
      "Kiểm tra bề mặt inner/outer race: mòn, xước, rỗ, cháy",
      "Kiểm tra lò xo và bi (sprag) bên trong",
    ],
    question: "F1 khóa đúng chiều và quay tự do chiều ngược lại?",
    failResult:
      "Kiểm tra chi tiết các bộ phận ly hợp 1 chiều F1 — Thay F1 nếu quay được cả 2 chiều hoặc kẹt cả 2.",
  },
  owcF2: {
    title: "Kiểm tra ly hợp 1 chiều F2",
    purpose:
      "F2 (Direct One-Way Clutch) hoạt động ở số 1 và 2 khi không cần phanh động cơ. Hỏng F2 → trượt khi tăng tốc.",
    actions: [
      "Tháo F2 ra khỏi cụm",
      "Giữ inner race, xoay outer race",
      "Thuận: quay tự do êm — Ngược: khóa cứng",
      "Kiểm tra bề mặt mòn, xước, cháy",
      "Kiểm tra bột kim loại bám trên F2 → nghi mòn nặng",
    ],
    question: "F2 hoạt động đúng nguyên lý 1 chiều?",
    failResult: "Kiểm tra chi tiết các bộ phận ly hợp 1 chiều F2 — Thay F2.",
  },
  // ─── Bộ tích áp (Accumulator) ─────────────────────────────
  accumB2: {
    title: "Kiểm tra bộ tích áp B2",
    purpose:
      "Tích áp B2 làm mềm áp dầu khi đóng phanh B2 ở chuyển 1→2. Hỏng tích áp → giật mạnh khi chuyển 1→2.",
    actions: [
      "Tháo bộ tích áp B2 ra khỏi valve body",
      "Kiểm tra piston: nứt, xước, kẹt",
      "Thay 2 O-ring trên piston nếu cứng/nứt/phồng",
      "Kiểm tra lò xo: xẹp/giãn → thay",
      "Lắp tạm piston + lò xo, nhấn tay → phải di chuyển mượt",
    ],
    question: "Bộ tích áp B2 hoạt động bình thường?",
    failResult:
      "Kiểm tra các chi tiết của bộ tích áp B2 — Thay piston/O-ring/lò xo theo hư hỏng.",
  },
  accumC2: {
    title: "Kiểm tra bộ tích áp C2",
    purpose: "Tích áp C2 làm mềm áp dầu khi đóng ly hợp C2 ở chuyển 2→3.",
    actions: [
      "Tháo bộ tích áp C2 ra khỏi valve body",
      "Kiểm tra piston, O-ring (2 cái), lò xo",
      "Thay các chi tiết hỏng",
      "Lắp tạm, nhấn tay xác nhận di chuyển mượt",
    ],
    question: "Bộ tích áp C2 hoạt động bình thường?",
    failResult: "Kiểm tra các chi tiết của bộ tích áp C2 — Thay theo hư hỏng.",
  },
  // ─── Solenoid ST ───────────────────────────────────────────
  solenoidST: {
    title: "Kiểm tra van solenoid ST",
    purpose:
      "Solenoid ST điều khiển độ êm khi chuyển 3↔4. Kẹt/hỏng ST → chuyển 3↔4 giật mạnh hoặc thay đổi liên tục giữa 2 số.",
    actions: [
      "Tháo đầu nối dây hộp số (connector C28)",
      "Đo điện trở chân 2 (ST) – Mass: tiêu chuẩn 11–15 Ω ở 20°C",
      "Nếu điện trở OK → kiểm tra bộ dây và đầu nối ECM (connector C20, chân 80 ST – Mass)",
      "Tháo solenoid ST, đo lại điện trở giữa đầu nối và thân solenoid",
      "Cấp 12V vào solenoid → phải nghe tiếng 'click' rõ",
    ],
    question:
      "Solenoid ST có điện trở chuẩn và phát ra tiếng click khi cấp điện?",
    failResult:
      "Kiểm tra hoạt động của van solenoid ST — Sửa chữa dây/đầu nối hoặc thay solenoid ST.",
  },
};

// ─── Image library — pulled from 26_trieu_chung.docx ─────────────
// Ảnh được gắn per-symptom (không gắn chung vào CHECK), để mỗi triệu chứng
// chỉ hiển thị đúng những ảnh có trong docx gốc cho section của nó.
const IMG = {
  // — Biến mô (4 ảnh, dùng khác nhau theo section trong docx) —
  bienMoSstStator: {
    src: "assets/images/symptoms/bien-mo-sst-stator.jpeg",
    caption:
      "Lắp SST 09350-32014 vào one-way clutch stator — xoay 2 chiều kiểm tra hướng khóa (chỉ section 'Không lock-up' trong docx)",
  },
  bienMoDrivePlate: {
    src: "assets/images/symptoms/bien-mo-drive-plate.png",
    caption:
      "Bước 6: Đo độ vênh drive plate (tối đa 0.20 mm) và kiểm tra ring gear (chỉ section 'Không lock-up' trong docx)",
  },
  bienMoSst2views: {
    src: "assets/images/symptoms/bien-mo-sst-2views.png",
    caption: "Hai góc đặt SST trên bộ biến mô — kiểm tra one-way clutch stator",
  },
  // — Solenoid ST (3 ảnh, dùng cho S13 + S14) —
  stConnectorC28: {
    src: "assets/images/symptoms/solenoid-st-connector-c28.png",
    caption:
      "Bước 1: Connector C28 (Component side) — đo điện trở chân 2 (ST) – Mass",
  },
  stHarnessC20: {
    src: "assets/images/symptoms/solenoid-st-harness-c20.png",
    caption:
      "Bước 2: Connector C20 (Wire harness — dây tới ECM) — đo chân 80 (ST) – Mass",
  },
  stTest: {
    src: "assets/images/symptoms/solenoid-st-test.png",
    caption:
      "Bước 3: Đo điện trở giữa đầu nối và thân solenoid + cấp 12V phải nghe tiếng 'click'",
  },
  // — Solenoid SLU (chỉ S25 trong docx) —
  sluTest: {
    src: "assets/images/symptoms/solenoid-slu-test.png",
    caption:
      "Kiểm tra solenoid SLU (lock-up) — đo điện trở chân 1-2 + cấp 12V kiểm tra",
  },
};

// Helper: build a step. Accepts:
//   - plain string "valveBody"  → no images
//   - object { key: "torqueConverter", images: [IMG.x, IMG.y] }  → with per-symptom images
function makeStep(id, spec, nextStepId) {
  const checkKey = typeof spec === "string" ? spec : spec.key;
  const check = CHECK[checkKey];
  const step = {
    id,
    title: check.title,
    purpose: check.purpose,
    actions: check.actions.slice(),
    question: check.question,
    answers: {
      yes: nextStepId
        ? { next_step: nextStepId, label: `Đến Bước ${nextStepId}` }
        : {
            result:
              "✓ Đã kiểm tra hết các nguyên nhân khả dĩ. Nếu vẫn còn triệu chứng — liên hệ kỹ thuật viên chuyên môn hoặc kiểm tra hệ thống điện điều khiển ECM.",
          },
      no: { result: check.failResult },
    },
  };
  // Per-symptom override: only attach images explicitly listed for this symptom
  if (typeof spec === "object" && spec.images) {
    step.images = spec.images;
  }
  if (typeof spec === "object" && spec.table) {
    step.table = spec.table;
  }
  return step;
}

// Helper: build full step chain from a list of spec items (string or object)
function buildSteps(specs) {
  return specs.map((spec, idx) => {
    const isLast = idx === specs.length - 1;
    return makeStep(idx + 1, spec, isLast ? null : idx + 2);
  });
}

// ═══════════════════════════════════════════════════════════════
// 25 SYMPTOMS
// ═══════════════════════════════════════════════════════════════

export const symptomsData = {
  // ─── G1: Xe không di chuyển ─────────────────────────────
  S01: {
    id: "S01",
    title: "Xe không di chuyển ở vị trí tiến hay R",
    subtitle:
      "Khu vực nghi ngờ: Manual valve · Valve body · Bánh răng hành tinh · C1 · F2 · C3 · B3",
    group: "no-motion",
    description:
      "Cần số đã ở D hoặc R nhưng xe không tiến hay lùi được. Đây là triệu chứng nghiêm trọng — liên quan đến cả hệ thống thủy lực (manual valve, valve body) lẫn cụm cơ khí (bánh răng hành tinh, ly hợp C1/F2/C3, phanh B3).",
    trouble_area: [
      "Manual valve kẹt hoặc mòn",
      "Valve body bẩn, valve kẹt, solenoid hỏng",
      "Bánh răng hành tinh mòn răng, hỏng carrier",
      "Ly hợp C1 trượt",
      "Ly hợp 1 chiều F2 hỏng",
      "Ly hợp C3 hỏng",
      "Phanh B3 hỏng",
    ],
    steps: buildSteps([
      "manualValve",
      "valveBody",
      "planetaryGear",
      "clutchC1",
      "owcF2",
      "clutchC3",
      "brakeB3",
    ]),
  },

  S02: {
    id: "S02",
    title: "Xe không di chuyển ở vị trí R",
    subtitle:
      "Khu vực nghi ngờ: Manual valve · Valve body · Bánh răng hành tinh · Ly hợp C3",
    group: "no-motion",
    description:
      "Xe tiến được bình thường nhưng không lùi được. Khoanh vùng vào các bộ phận chỉ kích hoạt ở số lùi — đặc biệt C3 (Reverse clutch) và B3.",
    trouble_area: [
      "Manual valve kẹt ở vị trí R",
      "Valve body có vấn đề",
      "Bánh răng hành tinh có hư hỏng",
      "Ly hợp C3 (Reverse) hỏng",
    ],
    steps: buildSteps([
      "manualValve",
      "valveBody",
      "planetaryGear",
      "clutchC3",
    ]),
  },

  // ─── G2: Không chuyển số / Không hạ số ──────────────────
  S03: {
    id: "S03",
    title: "Không chuyển số lên (từ số 1 → số 2)",
    subtitle: "Khu vực nghi ngờ: Valve body · Phanh B2 · Ly hợp 1 chiều F1",
    group: "no-shift",
    description:
      "Xe chạy ở số 1 nhưng không upshift lên số 2. Bộ phận chính chịu trách nhiệm cho transition 1→2 là phanh B2 (đóng ở số 2) và F1 (cho phép sun gear lock).",
    trouble_area: [
      "Solenoid S1 trong valve body hỏng",
      "Phanh B2 trượt",
      "Ly hợp 1 chiều F1 hỏng",
    ],
    steps: buildSteps(["valveBody", "brakeB2", "owcF1"]),
  },

  S04: {
    id: "S04",
    title: "Không chuyển số lên (từ số 2 → số 3)",
    subtitle: "Khu vực nghi ngờ: Valve body · Ly hợp C2",
    group: "no-shift",
    description:
      "Xe kẹt ở số 2, không upshift lên số 3. C2 (Direct Clutch) đóng để vào số 3 — nếu C2 trượt thì không vào được số.",
    trouble_area: ["Solenoid S2 trong valve body hỏng", "Ly hợp C2 trượt"],
    steps: buildSteps(["valveBody", "clutchC2"]),
  },

  S05: {
    id: "S05",
    title: "Không chuyển số lên (từ số 3 → số 4)",
    subtitle: "Khu vực nghi ngờ: Valve body · Phanh B1",
    group: "no-shift",
    description:
      "Xe kẹt ở số 3, không vào được số 4 OD. B1 đóng ở số 4 (lock ring gear).",
    trouble_area: ["Solenoid trong valve body (S2/ST) hỏng", "Phanh B1 trượt"],
    steps: buildSteps(["valveBody", "brakeB1"]),
  },

  S06: {
    id: "S06",
    title: "Không hạ số được (từ 4 → 3)",
    subtitle: "Khu vực nghi ngờ: Valve body / Solenoid",
    group: "no-shift",
    description:
      "Xe kẹt ở số 4 OD, không downshift về số 3 khi giảm tốc hoặc đạp ga sâu (kick-down). Thường do solenoid kẹt mở.",
    trouble_area: ["Valve body / Solenoid ST kẹt"],
    steps: buildSteps(["valveBody"]),
  },

  S07: {
    id: "S07",
    title: "Không hạ số được (từ 3 → 2)",
    subtitle: "Khu vực nghi ngờ: Valve body / Solenoid",
    group: "no-shift",
    description: "Xe kẹt ở số 3, không downshift về số 2 khi giảm tốc.",
    trouble_area: ["Valve body / Solenoid S2 kẹt"],
    steps: buildSteps(["valveBody"]),
  },

  S08: {
    id: "S08",
    title: "Không hạ số được (từ 2 → 1)",
    subtitle: "Khu vực nghi ngờ: Valve body / Solenoid",
    group: "no-shift",
    description: "Xe kẹt ở số 2, không downshift về số 1 khi xe dừng/chậm.",
    trouble_area: ["Valve body / Solenoid S1 kẹt"],
    steps: buildSteps(["valveBody"]),
  },

  // ─── G3: Lock-up ────────────────────────────────────────
  S09: {
    id: "S09",
    title: "Không lock-up hay mở được lock-up",
    subtitle: "Khu vực nghi ngờ: Valve body · Ly hợp biến mô",
    group: "lockup",
    description:
      "Lock-up clutch trong biến mô không đóng được (hoặc đã đóng nhưng không mở được). Triệu chứng: tua máy cao bất thường khi chạy đều ở tốc độ cao, hoặc động cơ chết khi dừng xe.",
    trouble_area: [
      "Solenoid SLU trong valve body hỏng",
      "Ly hợp lock-up trong biến mô mòn/cháy",
    ],
    steps: buildSteps([
      "valveBody",
      {
        key: "torqueConverter",
        images: [IMG.bienMoSstStator, IMG.bienMoDrivePlate],
      },
    ]),
  },

  // ─── G4: Giật mạnh ──────────────────────────────────────
  S10: {
    id: "S10",
    title: "Giật mạnh khi chuyển số từ N → D",
    subtitle: "Khu vực nghi ngờ: Valve body · Phanh B2 · Ly hợp C3 · Phanh B3",
    group: "harsh-shift",
    description:
      "Khi gạt cần số từ N sang D, xe nhảy mạnh / nghe tiếng 'cộp' lớn. Thường do áp dầu khi đóng ly hợp/phanh quá đột ngột.",
    trouble_area: [
      "Solenoid SLT (line pressure) hỏng → áp dầu quá cao",
      "Phanh B2 / Ly hợp C3 / Phanh B3 có ma sát bất thường khi đóng",
    ],
    steps: buildSteps(["valveBody", "brakeB2", "clutchC3", "brakeB3"]),
  },

  S11: {
    id: "S11",
    title: "Giật mạnh khi chuyển số từ 1 → 2",
    subtitle: "Khu vực nghi ngờ: Tích áp B2 · Valve body · Phanh B2 · F1",
    group: "harsh-shift",
    description:
      "Upshift 1→2 bị giật mạnh thay vì mượt. Do tích áp B2 không làm mềm được áp dầu khi đóng phanh B2.",
    trouble_area: [
      "Bộ tích áp B2 hỏng (O-ring, lò xo, piston kẹt)",
      "Valve body / Solenoid SLT",
      "Phanh B2 cháy ma sát",
      "F1 không khóa đúng lúc",
    ],
    steps: buildSteps(["accumB2", "valveBody", "brakeB2", "owcF1"]),
  },

  S12: {
    id: "S12",
    title: "Giật mạnh khi chuyển số từ 2 → 3",
    subtitle: "Khu vực nghi ngờ: Tích áp C2 · Valve body · Ly hợp C2",
    group: "harsh-shift",
    description: "Upshift 2→3 bị giật do tích áp C2 không hoạt động đúng.",
    trouble_area: [
      "Bộ tích áp C2 hỏng",
      "Valve body / Solenoid SLT",
      "Ly hợp C2 mòn",
    ],
    steps: buildSteps(["accumC2", "valveBody", "clutchC2"]),
  },

  S13: {
    id: "S13",
    title: "Giật mạnh khi chuyển số từ 3 → 4",
    subtitle: "Khu vực nghi ngờ: Solenoid ST · Valve body · Phanh B1",
    group: "harsh-shift",
    description:
      "Upshift 3→4 OD bị giật mạnh. Solenoid ST kiểm soát timing chuyển 3↔4 — nếu kẹt thì thời điểm cấp/xả dầu bị sai.",
    trouble_area: [
      "Solenoid ST kẹt hoặc điện trở sai",
      "Valve body bẩn",
      "Phanh B1 cháy",
    ],
    steps: buildSteps([
      {
        key: "solenoidST",
        images: [IMG.stConnectorC28, IMG.stHarnessC20, IMG.stTest],
      },
      "valveBody",
      "brakeB1",
    ]),
  },

  S14: {
    id: "S14",
    title: "Giật mạnh khi chuyển số từ 4 → 3",
    subtitle: "Khu vực nghi ngờ: Solenoid ST · Valve body",
    group: "harsh-shift",
    description:
      "Downshift 4→3 (khi giảm tốc hoặc kick-down) bị giật mạnh. Cùng nguyên nhân với 3→4 — solenoid ST kẹt.",
    trouble_area: ["Solenoid ST kẹt", "Valve body bẩn"],
    steps: buildSteps([
      {
        key: "solenoidST",
        images: [IMG.stConnectorC28, IMG.stHarnessC20, IMG.stTest],
      },
      "valveBody",
    ]),
  },

  S15: {
    id: "S15",
    title: "Giật mạnh khi chuyển số luân phiên D, 2, L",
    subtitle: "Khu vực nghi ngờ: Valve body",
    group: "harsh-shift",
    description:
      "Khi gạt cần số liên tục giữa D, 2, L (như khi đổ đèo hoặc cần phanh động cơ) xe giật mạnh từng lần. Hầu như luôn do valve body bẩn / valve kẹt.",
    trouble_area: [
      "Valve body bẩn, valve kẹt",
      "Solenoid S1/S2 không chuyển đúng",
    ],
    steps: buildSteps(["valveBody"]),
  },

  // ─── G5: Trượt / Rung lắc ───────────────────────────────
  S16: {
    id: "S16",
    title: "Trượt hoặc rung (Số tiến)",
    subtitle:
      "Khu vực nghi ngờ: 9 vị trí — valve body, lọc dầu, biến mô, C1, C2, B1, B2, F1, F2",
    group: "slip",
    description:
      "Cảm giác xe trượt (tua máy lên cao nhưng tốc độ không tăng tương ứng) hoặc rung lắc khi đang ở dãy D. Đây là triệu chứng phức tạp — phải kiểm tra theo thứ tự từ ngoài vào trong.",
    trouble_area: [
      "Valve body / Solenoid SLT (áp line thấp)",
      "Lọc dầu tắc → thiếu áp dầu",
      "Biến mô one-way clutch hỏng",
      "Ly hợp C1 hoặc C2 trượt",
      "Phanh B1 hoặc B2 trượt",
      "Ly hợp 1 chiều F1 hoặc F2 trượt",
    ],
    steps: buildSteps([
      "valveBody",
      "oilFilter",
      { key: "torqueConverter", images: [IMG.bienMoSst2views] },
      "clutchC1",
      "clutchC2",
      "brakeB1",
      "brakeB2",
      "owcF1",
      "owcF2",
    ]),
  },

  S17: {
    id: "S17",
    title: "Trượt hoặc rung lắc (Số 1)",
    subtitle: "Khu vực nghi ngờ: Ly hợp 1 chiều F2",
    group: "slip",
    description:
      "Trượt cụ thể ở số 1. Vì số 1 cần F2 hoạt động đúng để truyền mô-men → F2 là nghi can chính.",
    trouble_area: ["F2 mòn / trượt"],
    steps: buildSteps(["owcF2"]),
  },

  S18: {
    id: "S18",
    title: "Trượt hoặc rung lắc (Số 2)",
    subtitle: "Khu vực nghi ngờ: Phanh B2 · Ly hợp 1 chiều F2",
    group: "slip",
    description:
      "Trượt khi đang ở số 2. B2 đóng ở số 2 — nếu trượt → B2. F2 cũng có thể trượt ở số 2 nếu xe đang tăng tốc.",
    trouble_area: ["Phanh B2 mòn", "F2 mòn"],
    steps: buildSteps(["brakeB2", "owcF2"]),
  },

  S19: {
    id: "S19",
    title: "Trượt hoặc rung lắc (Số 3)",
    subtitle: "Khu vực nghi ngờ: Ly hợp C2",
    group: "slip",
    description:
      "Trượt khi đang ở số 3. Số 3 cần C2 đóng — nếu C2 trượt → mất lực ở số 3.",
    trouble_area: ["Ly hợp C2 mòn / trượt"],
    steps: buildSteps(["clutchC2"]),
  },

  S20: {
    id: "S20",
    title: "Trượt hoặc rung lắc (Số 4)",
    subtitle: "Khu vực nghi ngờ: Phanh B1",
    group: "slip",
    description: "Trượt khi đang ở số 4 OD. B1 đóng ở số 4 — hỏng B1 → trượt.",
    trouble_area: ["Phanh B1 mòn / cháy"],
    steps: buildSteps(["brakeB1"]),
  },

  // ─── G6: Mất phanh / Hiệu suất ──────────────────────────
  S21: {
    id: "S21",
    title: "Mất lực phanh động cơ ở số 1 dãy L",
    subtitle: "Khu vực nghi ngờ: Valve body · Phanh B3",
    group: "perf",
    description:
      "Khi gạt cần về dãy L (lever low), số 1 phải có phanh động cơ — xe phải giảm tốc khi nhả ga. Mất phanh động cơ → B3 không đóng.",
    trouble_area: ["Valve body không cấp áp đến B3", "Phanh B3 trượt"],
    steps: buildSteps(["valveBody", "brakeB3"]),
  },

  S22: {
    id: "S22",
    title: "Mất lực phanh động cơ ở số 2 dãy 2",
    subtitle: "Khu vực nghi ngờ: Valve body · Phanh B1",
    group: "perf",
    description:
      "Khi gạt cần về dãy 2, số 2 phải có phanh động cơ — nếu mất, do B1 không đóng được ở chế độ 2.",
    trouble_area: ["Valve body", "Phanh B1 trượt"],
    steps: buildSteps(["valveBody", "brakeB1"]),
  },

  S23: {
    id: "S23",
    title: "Đạp hết ga nhưng xe vẫn chậm",
    subtitle: "Khu vực nghi ngờ: Valve body",
    group: "perf",
    description:
      "Đạp ga sâu mà xe không tăng tốc / không kick-down. Solenoid SLT có thể không tăng áp đủ, hoặc valve body bẩn.",
    trouble_area: ["Solenoid SLT / valve body"],
    steps: buildSteps(["valveBody"]),
  },

  S24: {
    id: "S24",
    title: "Tăng tốc kém",
    subtitle: "Khu vực nghi ngờ: Valve body · Biến mô",
    group: "perf",
    description:
      "Xe tăng tốc kém ở mọi tốc độ. Có thể do valve body bẩn (áp thấp) hoặc biến mô trượt (stator one-way clutch hỏng).",
    trouble_area: ["Valve body bẩn", "Biến mô one-way clutch hỏng"],
    steps: buildSteps([
      "valveBody",
      { key: "torqueConverter", images: [IMG.bienMoSst2views] },
    ]),
  },

  S25: {
    id: "S25",
    title: "Xe chết máy khi vừa bắt đầu chạy hoặc khi dừng lại",
    subtitle: "Khu vực nghi ngờ: Ly hợp biến mô (Lock-up)",
    group: "perf",
    description:
      "Lock-up không nhả khi xe dừng → động cơ bị kéo dừng theo. Hoặc lock-up khóa vĩnh viễn → khi xe chạy chậm, động cơ chết.",
    trouble_area: ["Solenoid SLU / Lock-up clutch trong biến mô kẹt khóa"],
    steps: buildSteps([
      { key: "torqueConverter", images: [IMG.bienMoSst2views, IMG.sluTest] },
    ]),
  },
};

// ─── Groups for filter chips ──────────────────────────────
export const symptomGroups = {
  "no-motion": {
    label: "Xe không di chuyển",
    codes: ["S01", "S02"],
  },
  "no-shift": {
    label: "Không chuyển / hạ số",
    codes: ["S03", "S04", "S05", "S06", "S07", "S08"],
  },
  lockup: {
    label: "Lock-up",
    codes: ["S09"],
  },
  "harsh-shift": {
    label: "Giật mạnh",
    codes: ["S10", "S11", "S12", "S13", "S14", "S15"],
  },
  slip: {
    label: "Trượt / Rung lắc",
    codes: ["S16", "S17", "S18", "S19", "S20"],
  },
  perf: {
    label: "Mất phanh / Hiệu suất",
    codes: ["S21", "S22", "S23", "S24", "S25"],
  },
};
