/**
 * Full DTC data for 18 mã lỗi U340E
 *
 * Cấu trúc:
 * - GROUPS: các mã chia sẻ chung quy trình (vd. P0710/P0712/P0713 cùng flow)
 * - Mỗi entry có: code, title, mil, description, trouble_area, wiring_image,
 *   steps[] với question + answers branching
 *
 * Image folder: assets/images/dtc/
 */

export const dtcData = {
  // ═══════════════════════════════════════════════════════════════
  // P0705 — Cảm biến vị trí hộp số (7 bước, cấu trúc nhiều nhánh)
  // ═══════════════════════════════════════════════════════════════
  P0705: {
    code: "P0705",
    title: "Lỗi mạch cảm biến vị trí hộp số",
    subtitle: "Tín hiệu P-R-N-D-L",
    mil: "Sáng",
    group: "sensor-position",
    wiring_image: "assets/images/dtc/p0705-wiring.png",
    description:
      "Công tắc vị trí Park/Neutral (PNP switch) phát hiện vị trí cần số (P, R, N, D, 2, L) và gửi tín hiệu đến ECM. ECM nhận được 2 hoặc nhiều tín hiệu vị trí cùng lúc, hoặc tất cả tín hiệu đều OFF, hoặc tín hiệu L/3 bật khi đang ở P/R/N → ECM kết luận có lỗi và lưu DTC P0705.",
    detection_logic: {
      summary: "Logic phát hiện: 2-vòng chạy xe",
      time: "2 giây (a, c) hoặc 60 giây (b)",
      preconditions: ["Chìa khóa ON", "Điện áp acquy ≥ 10.5 V"],
      conditions: [
        "(a) Có 2 hoặc nhiều tín hiệu P, R, N, D, 2, L bật cùng lúc",
        "(b) Tất cả tín hiệu P/R/N/D/2/L đều OFF cùng lúc",
        "(c) Tín hiệu L hoặc 3 bật khi cần số đang ở P, R hoặc N",
      ],
    },
    trouble_area: [
      "Mạch hở hoặc ngắn mạch công tắc Park/Neutral Position Switch",
      "Công tắc Park/Neutral Position Switch (PNP switch)",
      "ECU điều khiển khóa cần số (Shift Lock Control ECU)",
      "ECM",
    ],
    steps: [
      {
        id: 1,
        title: "Xem dữ liệu động",
        purpose: "Xem ECM đang nhận biết vị trí cần số như thế nào",
        actions: [
          "Khởi động động cơ nóng lên",
          "Tắt khóa điện OFF",
          "Kết nối máy chẩn đoán",
          "Bật chìa khóa ON",
          "Vào mục đọc dữ liệu động động cơ",
          "Chuyển số theo thứ tự P-R-N-D-2-L và theo dõi chế độ ON/OFF của từng vị trí số",
        ],
        question: "Có vị trí nào không hoạt động không?",
        answers: {
          yes: { next_step: 5, label: "Đến Bước 5" },
          no: { next_step: 2, label: "Đến Bước 2" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra đường dây, giắc nối (Nguồn cấp)",
        purpose:
          "Kiểm tra đường dây, giắc nối có hỏng không, nguồn cấp điện có đủ không",
        image: "assets/images/dtc/p0705-step2.png",
        actions: [
          "Ngắt đầu nối công tắc PNP (C27)",
          "Bật chìa khóa ON",
          "Đo điện áp",
        ],
        table: {
          headers: ["Bộ phận kết nối", "Điện áp cho phép"],
          rows: [["2 (RB) – Mass thân xe", "11 đến 14 V"]],
        },
        question: "Điện áp có đạt 11–14V không?",
        answers: {
          yes: { next_step: 3, label: "Đến Bước 3" },
          no: { result: "Kiểm tra nguồn cấp điện ECM" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra công tắc vị trí P/N",
        purpose: "Kiểm tra công tắc vị trí P/N có hỏng không",
        image: "assets/images/dtc/p0705-step3.png",
        actions: ["Ngắt đầu nối C27", "Đo điện trở theo bảng sau"],
        table: {
          headers: ["Vị trí cần số", "Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["Ở P và N", "4 (B) - 5 (L)", "Dưới 1 Ω"],
            ["Không ở P và N", "4 (B) - 5 (L)", "10 kΩ hoặc cao hơn"],
            ["Ở P", "2 (RB) - 6 (PL)", "Dưới 1 Ω"],
            ["Không ở P", "2 (RB) - 6 (PL)", "10 kΩ hoặc cao hơn"],
            ["Ở R", "1 (RL) - 2 (RB)", "Dưới 1 Ω"],
            ["Không ở R", "1 (RL) - 2 (RB)", "10 kΩ hoặc cao hơn"],
            ["Ở N", "2 (RB) - 9 (NL)", "Dưới 1 Ω"],
            ["Không ở N", "2 (RB) - 9 (NL)", "10 kΩ hoặc cao hơn"],
            ["Ở D và 3", "2 (RB) - 7 (DL)", "Dưới 1 Ω"],
            ["Không ở D và 3", "2 (RB) - 7 (DL)", "10 kΩ hoặc cao hơn"],
            ["Ở 2", "2 (RB) - 3 (2L)", "Dưới 1 Ω"],
            ["Không ở 2", "2 (RB) - 3 (2L)", "10 kΩ hoặc cao hơn"],
            ["Ở L", "2 (RB) - 8 (LL)", "Dưới 1 Ω"],
            ["Không ở L", "2 (RB) - 8 (LL)", "10 kΩ hoặc cao hơn"],
          ],
        },
        question: "Điện trở có đạt giá trị tiêu chuẩn không?",
        answers: {
          yes: { next_step: 4, label: "Đến Bước 4" },
          no: { result: "Thay thế công tắc vị trí P/N" },
        },
      },
      {
        id: 4,
        title: "Kiểm tra đường dây, giắc nối (Công tắc P/N → ECM)",
        purpose: "Kiểm tra dây từ công tắc đến ECM có bị đứt/chập không",
        image: "assets/images/dtc/p0705-step4.png",
        actions: [
          "Kết nối đầu nối công tắc vị trí P/N",
          "Ngắt kết nối đầu nối ECM",
          "Bật ON và đo điện áp khi cần số ở từng vị trí",
        ],
        table: {
          headers: ["Vị trí cần số", "Chân kết nối", "Điện áp tiêu chuẩn"],
          rows: [
            ["Ở P", "73 (P) - Body ground", "11 đến 14 V"],
            ["Không ở P", "73 (P) - Body ground", "Dưới 1 V"],
            ["Ở R", "53 (R) - Body ground", "11 đến 14 V*"],
            ["Không ở R", "53 (R) - Body ground", "Dưới 1 V"],
            ["Ở N", "54 (N) - Body ground", "11 đến 14 V"],
            ["Không ở N", "54 (N) - Body ground", "Dưới 1 V"],
            ["Ở D và 3", "56 (D) - Body ground", "11 đến 14 V"],
            ["Không ở D và 3", "56 (D) - Body ground", "Dưới 1 V"],
            ["Ở 2", "55 (2) - Body ground", "11 đến 14 V"],
            ["Không ở 2", "55 (2) - Body ground", "Dưới 1 V"],
            ["Ở L", "74 (L) - Body ground", "11 đến 14 V"],
            ["Không ở L", "74 (L) - Body ground", "Dưới 1 V"],
          ],
          footnote: "* Điện áp sẽ giảm nhẹ do đèn lùi được bật.",
        },
        question: "Điện áp có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 5, label: "Đến Bước 5" },
          no: { result: "Sửa chữa hoặc thay thế bộ dây điện hoặc đầu nối" },
        },
      },
      {
        id: 5,
        title: "Kiểm tra dây dẫn (Công tắc P/N → ECU khóa cần số)",
        purpose: "Kiểm tra dây từ công tắc P/N đến ECU khóa cần số",
        image: "assets/images/dtc/p0705-step5.png",
        actions: [
          "Ngắt kết nối giắc cắm ECU điều khiển khóa cần số",
          "Bật ON và đo điện áp",
        ],
        table: {
          headers: ["Vị trí cần số", "Chân kết nối", "Điện áp tiêu chuẩn"],
          rows: [
            ["Ở D và 3", "9 (NSSD) - 8 (E)", "11 đến 14 V"],
            ["Không ở D và 3", "9 (NSSD) - 8 (E)", "Dưới 1 V"],
          ],
        },
        question: "Điện áp có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 6, label: "Đến Bước 6" },
          no: { result: "Sửa chữa hoặc thay thế bộ dây điện hoặc đầu nối" },
        },
      },
      {
        id: 6,
        title: "Kiểm tra ECU điều khiển khóa cần số",
        purpose: "Kiểm tra bộ phận ECU khóa cần số",
        image: "assets/images/dtc/p0705-step6.png",
        actions: [
          "Ngắt kết nối đầu nối ECU điều khiển khóa cần số",
          "Đo điện trở khi cần số ở từng vị trí",
        ],
        table: {
          headers: ["Vị trí cần số", "Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["Ở 3", "3 (AT3) - 9 (NSSD)", "Dưới 1 Ω"],
            ["Ở D", "3 (AT3) - 9 (NSSD)", "10 kΩ hoặc cao hơn"],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 7, label: "Đến Bước 7" },
          no: { result: "Thay thế bộ phận điều khiển khóa cần số ECU" },
        },
      },
      {
        id: 7,
        title: "Kiểm tra dây dẫn (ECU khóa cần số → ECM)",
        purpose: "Kiểm tra dây ECU khóa cần số đến ECM",
        image: "assets/images/dtc/p0705-step7.png",
        actions: [
          "Kết nối đầu nối ECU điều khiển khóa cần số",
          "Ngắt kết nối các đầu nối ECM",
          "Bật ON và đo điện áp",
        ],
        table: {
          headers: ["Vị trí cần số", "Chân kết nối", "Điện áp tiêu chuẩn"],
          rows: [
            ["Ở 3", "26 (ODMS) - Body ground", "11 đến 14V"],
            ["Không ở 3", "26 (ODMS) - Body ground", "Dưới 1V"],
          ],
        },
        question: "Điện áp có đạt tiêu chuẩn không?",
        answers: {
          yes: { result: "Thay ECM" },
          no: { result: "Sửa chữa hoặc thay thế bộ dây điện hoặc đầu nối" },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // P0710 / P0712 / P0713 — Cảm biến nhiệt độ ATF (3 mã chung 1 flow)
  // ═══════════════════════════════════════════════════════════════
  P0710: {
    code: "P0710",
    title: 'Lỗi mạch cảm biến nhiệt độ dầu hộp số "A"',
    mil: "Sáng",
    group: "sensor-temp-atf",
    wiring_image: "assets/images/dtc/p0713-wiring-1.png",
    description:
      "Cảm biến nhiệt độ ATF (Transmission Fluid Temperature Sensor) chuyển đổi nhiệt độ dầu hộp số tự động thành giá trị điện trở, sau đó gửi tín hiệu vào ECM. Điện trở cảm biến giảm khi nhiệt độ tăng. ECM cấp điện áp qua terminal THO1 và tính toán nhiệt độ dựa trên tín hiệu điện áp. Khi cảm biến ATF bình thường, hộp số khóa ở số 4 (vị trí D) hoặc số 3 (vị trí 3).",
    detection_logic: {
      summary: "Cả 2 điều kiện (a) + (b) xảy ra momentary trong 0.5s",
      conditions: [
        "(a) Điện trở cảm biến < 79 Ω",
        "(b) Điện trở cảm biến > 156 kΩ",
      ],
      note: "Khi không có P0712/P0713",
    },
    trouble_area: [
      "Mạch hở/ngắn cảm biến ATF",
      "Dây truyền (Transmission wire - ATF temp sensor)",
      "ECM",
    ],
    grouped_with: ["P0712", "P0713"],
    steps: [
      {
        id: 1,
        title: "Đọc dữ liệu động (nhiệt độ dầu hộp số)",
        purpose: "Xác định xem lỗi là hở mạch hay ngắn mạch",
        actions: [
          "Khởi động máy nóng (ATF ~ 80°C)",
          "Kết nối máy chẩn đoán",
          "Đọc A/T OIL TEMP1",
        ],
        note: "Nếu hiển thị ≥150°C → ngắn mạch. Nếu hiển thị -40°C → hở mạch.",
        question:
          "Nhiệt độ hiển thị có ở mức bình thường không (20°C - 100°C)?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: { next_step: 2, label: "Đến Bước 2 (kiểm tra dây)" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra dây dẫn hộp số (Cảm biến nhiệt độ ATF)",
        image: "assets/images/dtc/p0713-step2.png",
        actions: ["Ngắt connector C28 (dây truyền hộp số)", "Đo điện trở"],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["1 (THO) - 6 (E2)", "79 Ω ~ 156 kΩ"],
            ["1 (THO) - Mass", "≥ 10 kΩ"],
            ["6 (E2) - Mass", "≥ 10 kΩ"],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 3, label: "Đến Bước 3" },
          no: { result: "Sửa hoặc thay dây truyền hộp số" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra dây điện và đầu nối (Dây dẫn ↔ ECM)",
        image: "assets/images/dtc/p0713-step3.png",
        actions: ["Kết nối lại C28", "Ngắt connector ECM (C20)", "Đo điện trở"],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["72 (THO1) - 95 (ETHO)", "79 Ω đến 156 kΩ"],
            ["72 (THO1) – Mass", "10 kΩ hoặc cao hơn"],
            ["95 (ETHO) – Mass", "10 kΩ hoặc cao hơn"],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { result: "Thay ECM" },
          no: { result: "Sửa hoặc thay dây điện, đầu nối" },
        },
      },
    ],
  },

  // P0712 — Mạch ngắn (low voltage)
  P0712: {
    code: "P0712",
    title: 'Mạch cảm biến nhiệt độ dầu hộp số "A" – Điện áp thấp',
    mil: "Sáng",
    group: "sensor-temp-atf",
    wiring_image: "assets/images/dtc/p0713-wiring-1.png",
    description:
      "Khi cảm biến nhiệt độ ATF báo điện trở thấp (< 79Ω) trong 0.5s trở lên, ECM xác định là ngắn mạch và lưu DTC P0712. Nhiệt độ 150°C trở lên được hiển thị bất kể nhiệt độ thực.",
    detection_logic: {
      summary: "Điện trở cảm biến < 79 Ω trong 0.5 giây trở lên",
      conditions: ["Điện trở < 79 Ω duy trì ≥ 0.5s"],
    },
    trouble_area: [
      "Ngắn mạch cảm biến ATF",
      "Dây truyền (ATF temp sensor)",
      "ECM",
    ],
    grouped_with: ["P0710", "P0713"],
    note: "Quy trình kiểm tra giống P0710",
    same_flow_as: "P0710",
  },

  // P0713 — Mạch hở (high voltage)
  P0713: {
    code: "P0713",
    title: 'Mạch cảm biến nhiệt độ dầu hộp số "A" – Điện áp cao',
    mil: "Sáng",
    group: "sensor-temp-atf",
    wiring_image: "assets/images/dtc/p0713-wiring-1.png",
    description:
      "Khi cảm biến nhiệt độ ATF báo điện trở cao (> 156 kΩ) trong 0.5s trở lên (sau 15 phút khởi động), ECM xác định là hở mạch. Nhiệt độ -40°C được hiển thị bất kể nhiệt độ thực.",
    detection_logic: {
      summary: "Điện trở cảm biến > 156 kΩ trong 0.5 giây trở lên",
      conditions: ["Điện trở > 156 kΩ", "Sau 15 phút khởi động động cơ"],
    },
    trouble_area: [
      "Mở mạch cảm biến ATF",
      "Dây truyền (ATF temp sensor)",
      "ECM",
    ],
    grouped_with: ["P0710", "P0712"],
    note: "Quy trình kiểm tra giống P0710",
    same_flow_as: "P0710",
  },

  // ═══════════════════════════════════════════════════════════════
  // P0711 — Hiệu suất cảm biến ATF (riêng, 2 bước đơn giản)
  // ═══════════════════════════════════════════════════════════════
  P0711: {
    code: "P0711",
    title: 'Hiệu suất cảm biến nhiệt độ dầu hộp số "A"',
    mil: "Sáng",
    group: "sensor-temp-atf",
    description:
      "Cảm biến nhiệt độ ATF chuyển đổi nhiệt độ dầu thành giá trị điện trở. Khi nhiệt độ tăng, điện trở giảm. ECM tính toán nhiệt độ dựa trên tín hiệu điện áp. Nếu nhiệt độ ATF dưới 20°C sau khi xe vận hành một thời gian, hoặc đạt 100°C+ khi nhiệt độ nước làm mát đạt 60°C → ECM xác định lỗi.",
    detection_logic: {
      summary: "Logic phát hiện 2 chuyến đi",
      conditions: [
        "Điều kiện A: (a) Nhiệt độ không khí nạp + nước làm mát > 10°C khi khởi động + (b) Sau 9 phút lái + 9km, ATF < 20°C + (c) Đã 19 phút từ khởi động",
        "Điều kiện B: (a) Nhiệt độ nước làm mát < 35°C khi khởi động + (b) ATF ≥ 100°C khi nước làm mát đạt 60°C",
      ],
      note: "MIL bật sau 2 chu kỳ lái xe",
    },
    trouble_area: [
      "Mức dầu ATF thấp",
      "Dây truyền (cảm biến nhiệt độ ATF)",
      "ECM",
    ],
    steps: [
      {
        id: 1,
        title: "Kiểm tra các DTC khác (ngoài P0711)",
        purpose: "Xác nhận chỉ có P0711, không có DTC khác đồng thời",
        actions: [
          "Kết nối máy chẩn đoán",
          "Bật chìa khóa ON",
          "Chọn: DIAGNOSIS / ENHANCED OBD II / DTC INFO / CURRENT CODES",
          "Đọc DTC",
        ],
        question: "Có DTC khác ngoài P0711 không?",
        answers: {
          yes: { result: "Xử lý DTC khác trước khi quay lại P0711" },
          no: { next_step: 2, label: "Đến Bước 2" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra mức dầu ATF",
        purpose: "Xác định mức dầu ATF có đúng tiêu chuẩn không",
        actions: [
          "Kiểm tra mức dầu ATF theo quy trình chuẩn trong tài liệu chính thống",
        ],
        note: "Thực hiện sau khi dầu ATF đã nóng (50-80°C). Sau khi thay cảm biến hoặc reset ECM, phải thực hiện chạy thử.",
        question: "Mức dầu ATF có đúng tiêu chuẩn không?",
        answers: {
          yes: { result: "Thay thế dây truyền cảm biến nhiệt độ ATF" },
          no: { result: "Thêm dầu ATF đúng lưu lượng, sau đó kiểm tra lại" },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // P0717 — Cảm biến tốc độ tua bin NT (3 bước)
  // ═══════════════════════════════════════════════════════════════
  P0717: {
    code: "P0717",
    title: "Không có tín hiệu từ cảm biến tốc độ tua bin",
    subtitle: "Speed Sensor NT",
    mil: "Sáng",
    group: "sensor-speed",
    wiring_image: "assets/images/dtc/p0717-wiring.png",
    description:
      "Cảm biến này phát hiện tốc độ quay của trục đầu vào của hộp số. Bằng cách so sánh tín hiệu tốc độ tuabin đầu vào (NT) với tín hiệu cảm biến tốc độ đầu ra (SPD), ECM phát hiện thời điểm chuyển số và điều khiển mô-men xoắn động cơ + áp suất thủy lực phù hợp, từ đó thực hiện việc chuyển số mượt mà.",
    detection_logic: {
      summary: "Logic phát hiện 1 chuyến — MIL bật ngay lập tức",
      conditions: [
        "(a) Không thực hiện chuyển số",
        "(b) Vị trí số: số 3 hoặc số 4",
        "(c) Tốc độ trục đầu vào hộp số: ≤ 300 vòng/phút",
        "(d) Tốc độ trục đầu ra hộp số: ≥ 1000 vòng/phút (tốc độ xe ≥ 50 km/h)",
        "(e) Công tắc vị trí P/N đang tắt",
        "(f) Các van điện từ + công tắc + cảm biến đang hoạt động bình thường",
      ],
      time: "Tất cả điều kiện duy trì trong 5 giây trở lên",
    },
    trouble_area: [
      "Mạch cảm biến tốc độ (NT) bị hở hoặc ngắn mạch",
      "Cảm biến tốc độ hộp số tự động",
      "Hộp số (ly hợp, phanh, bánh răng)",
      "ECM",
    ],
    steps: [
      {
        id: 1,
        title: "Kiểm tra việc lắp đặt cảm biến tốc độ đầu vào (NT)",
        purpose:
          "Kiểm tra bu lông siết chặt + không có khe hở giữa cảm biến và vỏ hộp số",
        image: "assets/images/dtc/p0717-step1.png",
        actions: ["Kiểm tra trực quan bu lông lắp đặt cảm biến NT"],
        question: "Bu lông siết chặt và không có khe hở?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: {
            result: "Lắp đặt hoặc thay thế cảm biến vòng quay hộp số an toàn",
          },
        },
      },
      {
        id: 2,
        title: "Kiểm tra cảm biến tốc độ đầu vào của hộp số",
        image: "assets/images/dtc/p0717-step2.png",
        actions: [
          "Ngắt kết nối đầu nối cảm biến vòng quay hộp số khỏi hộp số",
          "Đo điện trở",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["1 - 2", "560 Ω tới 680 kΩ ở 20°C (68°F)"]],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 3, label: "Đến Bước 3" },
          no: { result: "Thay thế cảm biến tốc độ đầu vào hộp số" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra dây dẫn và đầu nối (Cảm biến NT → ECM)",
        image: "assets/images/dtc/p0717-step3.png",
        actions: [
          "Kết nối đầu nối cảm biến tốc độ đầu vào hộp số",
          "Ngắt kết nối đầu nối ECM",
          "Đo điện trở",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["125 (NT+) - 124 (NT-)", "560 tới 680 kΩ ở 20°C (68°F)"],
            ["125 (NT+) – Mass", "10 kΩ hoặc cao hơn"],
            ["124 (NT-) – Mass", "10 kΩ hoặc cao hơn"],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { result: "Thay thế ECM" },
          no: { result: "Sửa chữa hoặc thay thế dây dẫn và đầu nối" },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // P0751 — Van điện từ S1 (kẹt mở/đóng)
  // ═══════════════════════════════════════════════════════════════
  P0751: {
    code: "P0751",
    title: 'Hiệu suất van điện từ sang số "A"',
    subtitle: "Shift Solenoid Valve S1",
    mil: "Sáng",
    group: "solenoid-shift",
    wiring_image: "assets/images/dtc/p0751-step1.png",
    description:
      'Mã lỗi DTC này cho biết "lỗi kẹt ở trạng thái BẬT" hoặc "lỗi kẹt ở trạng thái TẮT" của van điện từ chuyển số S1. ECM điều khiển việc chuyển số bằng cách bật/tắt các van điện từ. Khi vị trí số do ECM chỉ định và vị trí số thực tế không khớp, ECM bật MIL và lưu DTC. ECM dùng tín hiệu từ cảm biến tốc độ xe + NT để phát hiện vị trí số thực tế (1, 2, 3, 4).',
    detection_logic: {
      summary: "Logic phát hiện 2 vòng lái xe",
      conditions: [
        "S1 kẹt TẮT: ECM điều khiển số 1 → thực tế chuyển sang số 4. ECM điều khiển số 4 → thực tế vẫn số 4.",
        "S1 kẹt BẬT: ECM điều khiển 3→4 → số thực tế không đổi. ECM điều khiển số 4 → tốc độ động cơ tăng đột ngột ≥ 1100 vòng/phút.",
      ],
      tables: {
        title: "Vị trí tay số thực tế khi xảy ra lỗi",
        headers: ["Tay số ECM điều khiển", "1", "2", "3", "4"],
        rows: [
          ["S1 kẹt TẮT", "4", "3", "3", "4"],
          ["S1 kẹt BẬT", "1", "2", "2", "1"],
        ],
      },
    },
    trouble_area: [
      "Van S1 bị kẹt mở/kẹt đóng",
      "Thân van bị tắc",
      "Van điện từ chuyển số S1",
      "Hộp số tự động (ly hợp, phanh, cần số)",
      "ECM",
    ],
    steps: [
      {
        id: 1,
        title: "Kiểm tra van điện từ chuyển số S1",
        actions: ["Tháo van điện từ chuyển số S1", "Đo điện trở"],
        table: {
          headers: ["Cách đo", "Điện trở tiêu chuẩn"],
          rows: [
            [
              "Nối cực (+) vào giắc, cực (-) vào thân van",
              "11 tới 15 Ω ở 20°C (68°F)",
            ],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: { result: "Thay thế van điện từ chuyển số S1" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra cụm thân van hộp số",
        purpose: "Kiểm tra các van trong thân van có vật lạ hoặc kẹt không",
        question: "Các van hoạt động trơn tru, không vật lạ?",
        answers: {
          yes: { result: "Sửa chữa hoặc thay thế hộp số tự động" },
          no: { result: "Sửa chữa hoặc thay thế bộ van hộp số" },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // P0756 — Van điện từ S2 (giống P0751)
  // ═══════════════════════════════════════════════════════════════
  P0756: {
    code: "P0756",
    title: 'Hiệu suất van điện từ sang số "B"',
    subtitle: "Shift Solenoid Valve S2",
    mil: "Sáng",
    group: "solenoid-shift",
    wiring_image: "assets/images/dtc/p0756-step1.png",
    description:
      "Tương tự P0751 nhưng cho van S2. ECM điều khiển chuyển số bằng cách bật/tắt van điện từ. Khi vị trí số ECM chỉ định và thực tế không khớp, ECM bật MIL và lưu DTC.",
    detection_logic: {
      summary: "Logic phát hiện 2 vòng lái xe",
      conditions: [
        "S2 kẹt TẮT: ECM điều khiển 1→ thực tế 2; ECM điều khiển 3→ thực tế 3; ECM điều khiển 4→ thực tế 3.",
        "S2 kẹt BẬT: ECM điều khiển 2→ thực tế 1; ECM điều khiển 3→ thực tế 4; ECM điều khiển 4→ thực tế 4.",
      ],
      tables: {
        title: "Vị trí tay số thực tế khi xảy ra lỗi",
        headers: ["Tay số ECM điều khiển", "1", "2", "3", "4"],
        rows: [
          ["S2 kẹt TẮT", "2", "2", "3", "3"],
          ["S2 kẹt BẬT", "1", "1", "4", "4"],
        ],
      },
    },
    trouble_area: [
      "Van S2 bị kẹt mở/kẹt đóng",
      "Thân van bị tắc",
      "Van điện từ chuyển số S2",
      "Hộp số tự động",
      "ECM",
    ],
    steps: [
      {
        id: 1,
        title: "Kiểm tra van điện từ chuyển số S2",
        actions: ["Tháo van điện từ chuyển số S2", "Đo điện trở"],
        table: {
          headers: ["Cách đo", "Điện trở tiêu chuẩn"],
          rows: [
            [
              "Nối cực (+) vào giắc, cực (-) vào thân van",
              "11 tới 15 Ω ở 20°C (68°F)",
            ],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: { result: "Thay thế van điện từ chuyển số S2" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra cụm thân van hộp số",
        question: "Các van hoạt động trơn tru?",
        answers: {
          yes: { result: "Sửa chữa hoặc thay thế hộp số tự động" },
          no: { result: "Sửa chữa hoặc thay thế bộ van hộp số" },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // P0787 / P0788 — Van ST ngắn/hở mạch (chung flow)
  // ═══════════════════════════════════════════════════════════════
  P0787: {
    code: "P0787",
    title: "Van điện từ thời điểm sang số – Điện áp thấp",
    subtitle: "Shift Solenoid Valve ST — Ngắn mạch",
    mil: "Sáng",
    group: "solenoid-st",
    wiring_image: "assets/images/dtc/p0788-wiring.png",
    description:
      "Khi có hiện tượng hở mạch hoặc ngắn mạch trong mạch van điện từ chuyển số, ECM phát hiện sự cố và đèn MIL sáng lên. Van điện từ chuyển số ST được đóng-mở-tắt theo tín hiệu từ ECM khi chuyển số lên/xuống giữa số 3 và số 4, giúp giảm hiện tượng giật khi chuyển số.",
    detection_logic: {
      summary: "Logic phát hiện 1 vòng lái xe",
      conditions: [
        "ECM phát hiện ngắn mạch trong mạch van điện từ ST 4 lần khi van đang hoạt động",
      ],
    },
    trouble_area: [
      "Ngắn mạch trong mạch van điện từ chuyển số ST",
      "Van điện từ chuyển số ST",
      "ECM",
    ],
    grouped_with: ["P0788"],
    steps: [
      {
        id: 1,
        title: "Kiểm tra dây dẫn hộp số (Van điện từ ST)",
        actions: ["Tháo đầu nối dây truyền động ra khỏi hộp số", "Đo điện trở"],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["2 (ST) – Mass", "11 Ω tới 15 Ω ở 20°C (68°F)"]],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: { next_step: 3, label: "Đến Bước 3" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra bộ dây và đầu nối (Dây hộp số → ECM)",
        actions: [
          "Kết nối đầu nối hộp số với trục truyền động",
          "Ngắt kết nối đầu nối ECM",
          "Đo điện trở",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["80 (ST) – Mass", "11 Ω tới 15 Ω ở 20°C (68°F)"]],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { result: "Thay ECM" },
          no: { result: "Sửa chữa hoặc thay thế bộ dây điện hoặc đầu nối" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra van điện từ ST",
        image: "assets/images/dtc/p0788-step3.png",
        actions: [
          "Tháo van điện từ chuyển số ST",
          "Đo điện trở",
          "Nối cực (+) vào đầu cực giắc, cực (-) vào thân van để kiểm tra hoạt động",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["Đầu nối van (ST) - Thân van (ST)", "11 tới 15 Ω ở 20°C (68°F)"],
          ],
        },
        question: "Van điện từ ST có phát ra âm thanh hoạt động không?",
        answers: {
          yes: { result: "Sửa chữa hoặc thay thế dây truyền" },
          no: { result: "Thay thế van điện từ chuyển số ST" },
        },
      },
    ],
  },

  P0788: {
    code: "P0788",
    title: "Van điện từ thời điểm sang số – Điện áp cao",
    subtitle: "Shift Solenoid Valve ST — Hở mạch",
    mil: "Sáng",
    group: "solenoid-st",
    wiring_image: "assets/images/dtc/p0788-wiring.png",
    description:
      "Tương tự P0787 nhưng cho trường hợp hở mạch trong mạch van điện từ ST.",
    detection_logic: {
      summary: "Logic phát hiện 1 vòng lái xe",
      conditions: [
        "ECM phát hiện mạch hở trong van điện từ ST 4 lần khi van không hoạt động",
      ],
    },
    trouble_area: [
      "Hở mạch trong mạch van điện từ chuyển số ST",
      "Van điện từ chuyển số ST",
      "ECM",
    ],
    grouped_with: ["P0787"],
    same_flow_as: "P0787",
  },

  // ═══════════════════════════════════════════════════════════════
  // P0973 / P0974 — Mạch điều khiển van S1 (chung)
  // ═══════════════════════════════════════════════════════════════
  P0973: {
    code: "P0973",
    title: 'Mạch điều khiển van điện từ "A" – Điện áp thấp',
    subtitle: "S1 — Ngắn mạch",
    mil: "Sáng",
    group: "solenoid-circuit",
    wiring_image: "assets/images/dtc/p0974-wiring.png",
    description:
      "Việc chuyển số từ số 1 sang số 4 được thực hiện kết hợp BẬT/TẮT các van điện từ S1 và S2, do ECM điều khiển. Nếu xảy ra hở/ngắn mạch ở một trong hai van, ECM điều khiển van còn lại hoạt động bình thường để xe vận hành trơn tru (ngừng cấp dòng đến mạch bị lỗi). Van S1 thường được bật/tắt khi cần số ở vị trí D.",
    detection_logic: {
      summary: "Trạng thái van S1 theo vị trí số ECM điều khiển",
      tables: {
        headers: ["Vị trí số ECM điều khiển", "1", "2", "3", "4"],
        rows: [["Van điện từ S1", "Mở", "Mở", "Đóng", "Đóng"]],
      },
    },
    trouble_area: ["Mạch ngắn van điện từ S1", "Van S1", "ECM"],
    grouped_with: ["P0974"],
    steps: [
      {
        id: 1,
        title: "Kiểm tra dây dẫn hộp số (Van điện từ S1)",
        actions: ["Tháo đầu nối dây điện ra khỏi hộp số", "Đo điện trở"],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["5 (S1) – Mass", "11 Ω tới 15 Ω ở 20°C (68°F)"]],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: { next_step: 3, label: "Đến Bước 3" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra bộ dây và đầu nối (Dây hộp số → ECM)",
        actions: [
          "Kết nối đầu nối hộp số",
          "Ngắt kết nối đầu nối ECM",
          "Đo điện trở",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["79 (S1) – Mass", "11 Ω tới 15 Ω ở 20°C (68°F)"]],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { result: "Thay thế ECM" },
          no: { result: "Sửa chữa hoặc thay thế bộ dây điện" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra van điện từ S1",
        image: "assets/images/dtc/p0974-step3.png",
        actions: [
          "Tháo van điện từ S1",
          "Đo điện trở",
          "Nối cực (+) vào giắc, cực (-) vào thân van",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["Đầu nối van (S1) - Thân van (S1)", "11 tới 15 Ω ở 20°C (68°F)"],
          ],
        },
        question: "Van điện từ có phát ra âm thanh không?",
        answers: {
          yes: { result: "Sửa chữa hoặc thay thế dây truyền động" },
          no: { result: "Thay thế van điện từ chuyển số S1" },
        },
      },
    ],
  },

  P0974: {
    code: "P0974",
    title: 'Mạch điều khiển van điện từ "A" – Điện áp cao',
    subtitle: "S1 — Hở mạch",
    mil: "Sáng",
    group: "solenoid-circuit",
    wiring_image: "assets/images/dtc/p0974-wiring.png",
    description:
      "Tương tự P0973 nhưng cho trường hợp hở mạch ở van điện từ S1.",
    trouble_area: ["Mạch hở van điện từ S1", "Van S1", "ECM"],
    grouped_with: ["P0973"],
    same_flow_as: "P0973",
  },

  // ═══════════════════════════════════════════════════════════════
  // P0976 / P0977 — Mạch điều khiển van S2 (chung, giống P0973/P0974)
  // ═══════════════════════════════════════════════════════════════
  P0976: {
    code: "P0976",
    title: 'Mạch điều khiển van điện từ "B" – Điện áp thấp',
    subtitle: "S2 — Ngắn mạch",
    mil: "Sáng",
    group: "solenoid-circuit",
    wiring_image: "assets/images/dtc/p0977-wiring.png",
    description:
      "Tương tự P0973 nhưng cho van S2. Khi xảy ra hở mạch hoặc ngắn mạch trong mạch van S2, ECM phát hiện và bật MIL. Khi đó, ECM thực hiện cơ chế an toàn và bật/tắt van còn lại bình thường.",
    detection_logic: {
      summary: "Trạng thái van S2 theo vị trí số ECM điều khiển",
      tables: {
        headers: ["Vị trí số ECM điều khiển", "1", "2", "3", "4"],
        rows: [["Van điện từ S2", "Mở", "Đóng", "Đóng", "Mở"]],
      },
    },
    trouble_area: ["Mạch ngắn van điện từ S2", "Van S2", "ECM"],
    grouped_with: ["P0977"],
    steps: [
      {
        id: 1,
        title: "Kiểm tra dây dẫn hộp số (Van điện từ S2)",
        actions: ["Tháo đầu nối dây truyền động ra khỏi hộp số", "Đo điện trở"],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["10 (S2) – Mass", "11 Ω tới 15 Ω ở 20°C (68°F)"]],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: { next_step: 3, label: "Đến Bước 3" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra bộ dây và đầu nối (Dây hộp số → ECM)",
        actions: [
          "Kết nối đầu nối hộp số",
          "Ngắt kết nối đầu nối ECM",
          "Đo điện trở",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["78 (S2) – Mass", "11 Ω tới 15 Ω ở 20°C (68°F)"]],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { result: "Thay thế ECM" },
          no: { result: "Sửa chữa hoặc thay thế bộ dây điện" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra van điện từ chuyển số S2",
        image: "assets/images/dtc/p0977-step3.png",
        actions: [
          "Tháo van điện từ S2",
          "Đo điện trở",
          "Nối cực (+) vào giắc, cực (-) vào thân van để kiểm tra",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["Đầu nối van (S2) - Thân van (S2)", "11 tới 15 Ω ở 20°C (68°F)"],
          ],
        },
        question: "Van điện từ có phát ra âm thanh không?",
        answers: {
          yes: { result: "Sửa chữa hoặc thay thế dây truyền động" },
          no: { result: "Thay thế van điện từ chuyển số S2" },
        },
      },
    ],
  },

  P0977: {
    code: "P0977",
    title: 'Mạch điều khiển van điện từ "B" – Điện áp cao',
    subtitle: "S2 — Hở mạch",
    mil: "Sáng",
    group: "solenoid-circuit",
    wiring_image: "assets/images/dtc/p0977-wiring.png",
    description:
      "Tương tự P0976 nhưng cho trường hợp hở mạch ở van điện từ S2.",
    trouble_area: ["Mạch hở van điện từ S2", "Van S2", "ECM"],
    grouped_with: ["P0976"],
    same_flow_as: "P0976",
  },

  // ═══════════════════════════════════════════════════════════════
  // P2714 — Van SLT (kẹt mở/đóng)
  // ═══════════════════════════════════════════════════════════════
  P2714: {
    code: "P2714",
    title: 'Hiệu suất van điện từ điều khiển áp suất "D"',
    subtitle: "Van điện từ SLT — Kẹt mở/đóng",
    mil: "Sáng",
    group: "solenoid-pressure",
    wiring_image: "assets/images/dtc/p2714-wiring.png",
    description:
      "Solenoid SLT kiểm soát áp suất dòng (line pressure) bằng cách điều chỉnh áp suất tiết lưu (throttle pressure) theo góc mở bướm ga và công suất động cơ. ECM gửi tín hiệu duty ratio đến SLT để tạo áp suất mượt mà khi sang số. Khi SLT kẹt mở/đóng → áp suất dầu giảm → lực ép ly hợp giảm → ECM phát hiện chênh lệch tốc độ turbine và trục đầu ra vượt ngưỡng → bật MIL.",
    trouble_area: [
      "Van SLT bị kẹt mở/kẹt đóng",
      "Van thân bị tắc",
      "Ly hợp biến mô",
      "Hộp số tự động",
      "ECM",
    ],
    steps: [
      {
        id: 1,
        title: "Kiểm tra van điện từ SLT",
        image: "assets/images/dtc/p2714-step1.png",
        actions: [
          "Tháo van điện từ SLT",
          "Đo điện trở",
          "Nối cực (+) có bóng đèn 21W vào cực 2 và cực (-) vào cực 1 để kiểm tra",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["1 - 2", "5.0 tới 5.6 Ω ở 20°C (68°F)"]],
        },
        question: "Van điện từ SLT có phát ra âm thanh hoạt động không?",
        answers: {
          yes: { result: "Thay thế van điện từ SLT" },
          no: { next_step: 3, label: "Đến Bước 3" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra cụm thân van hộp số",
        question: "Các van hoạt động trơn tru, không vật lạ?",
        answers: {
          yes: { next_step: 3, label: "Đến Bước 3" },
          no: { result: "Sửa chữa hoặc thay thế bộ van hộp số" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra bộ ly hợp biến đổi mô-men xoắn",
        question: "Bộ ly hợp biến mô hoạt động bình thường?",
        answers: {
          yes: { result: "Sửa chữa hoặc thay thế hộp số tự động" },
          no: { result: "Thay thế bộ ly hợp" },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // P2716 — Van SLT hở/ngắn mạch
  // ═══════════════════════════════════════════════════════════════
  P2716: {
    code: "P2716",
    title: 'Lỗi điện van điện từ điều khiển áp suất "D"',
    subtitle: "Van điện từ SLT — Hở/Ngắn mạch",
    mil: "Sáng",
    group: "solenoid-pressure",
    wiring_image: "assets/images/dtc/p2716-wiring-1.png",
    description:
      "Solenoid SLT điều khiển áp suất dầu chính bằng tín hiệu duty ratio từ ECM. Khi có hở mạch hoặc chập mạch kéo dài ≥ 1 giây trong lúc xe chạy, ECM nhận biết lỗi → bật MIL ngay và lưu DTC.",
    trouble_area: ["Mạch hở/ngắn mạch van SLT", "Van điện từ SLT", "ECM"],
    steps: [
      {
        id: 1,
        title: "Kiểm tra dây dẫn hộp số (Van điện từ SLT)",
        image: "assets/images/dtc/p2716-step1.png",
        actions: ["Tháo đầu nối dây truyền động ra khỏi hộp số", "Đo điện trở"],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["3 (SLT+) - 8 (SLT-)", "5.0 Ω tới 5.6 Ω ở 20°C (68°F)"],
            ["3 (SLT+) – Mass", "10 kΩ hoặc cao hơn"],
            ["8 (SLT-) – Mass", "10 kΩ hoặc cao hơn"],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: { next_step: 3, label: "Đến Bước 3" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra bộ dây và đầu nối (Dây điện hộp số → ECM)",
        image: "assets/images/dtc/p2716-step2.png",
        actions: [
          "Kết nối đầu nối hộp số",
          "Ngắt kết nối đầu nối ECM",
          "Đo điện trở",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["76 (SLT+) – 75 (SLT-)", "5.0 Ω tới 5.6 Ω ở 20°C (68°F)"],
            ["76 (SLT+) – Mass", "10 kΩ hoặc cao hơn"],
            ["75 (SLT–) – Mass", "10 kΩ hoặc cao hơn"],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { result: "Thay thế ECM" },
          no: { result: "Sửa chữa hoặc thay thế bộ dây điện" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra van điện từ SLT",
        image: "assets/images/dtc/p2716-step3.png",
        actions: [
          "Tháo van điện từ SLT",
          "Đo điện trở",
          "Nối cực (+) có bóng đèn 21W vào cực 2 và cực (-) vào cực 1",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["1 - 2", "5.0 tới 5.6 Ω ở 20°C (68°F)"]],
        },
        question: "Van điện từ có phát ra âm thanh hoạt động không?",
        answers: {
          yes: { result: "Sửa chữa hoặc thay thế dây điện" },
          no: { result: "Thay thế van điện từ SLT" },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // P2757 — Van SLU (kẹt mở/đóng — lock-up)
  // ═══════════════════════════════════════════════════════════════
  P2757: {
    code: "P2757",
    title: "Hiệu suất van điện từ điều khiển áp suất ly hợp biến mô",
    subtitle: "Van điện từ SLU — Kẹt mở/đóng",
    mil: "Sáng",
    group: "solenoid-lockup",
    wiring_image: "assets/images/dtc/p2757-wiring.png",
    description:
      "Solenoid SLU kiểm soát áp suất lock-up clutch (khóa torque converter). ECM dùng tín hiệu từ cảm biến vị trí bướm ga, tốc độ turbine (NT), tốc độ xe, tốc độ trục khuỷu để giám sát tình trạng lock-up. Khi có lỗi OFF malfunction (Lock-up không xảy ra khi đang ở vùng lock-up, chênh lệch NE-NT ≥ 100 rpm) hoặc ON malfunction (Lock-up vẫn còn khi phải OFF, chênh lệch NE-NT < 35 rpm) → ECM nhận biết lỗi → bật MIL.",
    trouble_area: [
      "Van SLU bị kẹt mở/kẹt đóng",
      "Van thân bị tắc",
      "Van SLU",
      "Ly hợp biến mô",
      "Hộp số tự động",
      "Áp suất đường dầu thấp",
      "ECM",
    ],
    steps: [
      {
        id: 1,
        title: "Kiểm tra van điện từ SLU",
        image: "assets/images/dtc/p2757-step1.png",
        actions: [
          "Tháo van điện từ SLU",
          "Đo điện trở",
          "Nối cực (+) có bóng đèn 21W vào cực 2 và cực (-) vào cực 1",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["1 - 2", "5.0 Ω tới 5.6 Ω ở 20°C (68°F)"]],
        },
        question: "Van điện từ SLU có phát ra âm thanh hoạt động không?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: { result: "Thay thế van điện từ SLU" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra cụm thân van hộp số",
        question: "Các van hoạt động trơn tru, không vật lạ?",
        answers: {
          yes: { next_step: 3, label: "Đến Bước 3" },
          no: { result: "Sửa chữa hoặc thay thế bộ van hộp số" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra bộ ly hợp biến đổi mô-men xoắn",
        question: "Bộ ly hợp biến mô hoạt động bình thường?",
        answers: {
          yes: { result: "Sửa chữa hoặc thay thế hộp số tự động" },
          no: { result: "Thay thế bộ ly hợp" },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // P2759 — Van SLU hở/ngắn mạch
  // ═══════════════════════════════════════════════════════════════
  P2759: {
    code: "P2759",
    title: "Lỗi điện mạch điều khiển van điện từ ly hợp biến mô",
    subtitle: "Van điện từ SLU — Hở/Ngắn mạch",
    mil: "Sáng",
    group: "solenoid-lockup",
    wiring_image: "assets/images/dtc/p2579-wiring-1.png",
    description:
      "Solenoid SLU kiểm soát áp suất lock-up clutch. ECM điều khiển bằng tín hiệu duty ratio. Khi có hở/chập mạch kéo dài ≥ 1 giây khi xe chạy → ECM phát hiện lỗi → bật MIL ngay và lưu DTC.",
    trouble_area: ["Mạch hở/ngắn mạch van SLU", "Van điện từ SLU", "ECM"],
    steps: [
      {
        id: 1,
        title: "Kiểm tra dây dẫn truyền động (Van điện từ SLU)",
        image: "assets/images/dtc/p2579-step1.png",
        actions: ["Tháo đầu nối dây truyền động ra khỏi hộp số", "Đo điện trở"],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["4 (SLU+) – 9 (SLU-)", "11 Ω tới 15 Ω ở 20°C (68°F)"],
            ["4 (SLU+) – Mass", "10 kΩ hoặc cao hơn"],
            ["9 (SLU-) – Mass", "10 kΩ hoặc cao hơn"],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { next_step: 2, label: "Đến Bước 2" },
          no: { next_step: 3, label: "Đến Bước 3" },
        },
      },
      {
        id: 2,
        title: "Kiểm tra bộ dây và đầu nối (Dây hộp số → ECM)",
        image: "assets/images/dtc/p2579-step2.png",
        actions: [
          "Kết nối đầu nối hộp số",
          "Ngắt kết nối đầu nối ECM",
          "Đo điện trở",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [
            ["77 (SLU+) - 57 (SLU-)", "11 Ω tới 15 Ω ở 20°C (68°F)"],
            ["57 (SLU+) – Mass", "10 kΩ hoặc cao hơn"],
            ["77 (SLU-) – Mass", "10 kΩ hoặc cao hơn"],
          ],
        },
        question: "Điện trở có đạt tiêu chuẩn không?",
        answers: {
          yes: { result: "Thay thế ECM" },
          no: { result: "Sửa chữa hoặc thay thế bộ dây điện" },
        },
      },
      {
        id: 3,
        title: "Kiểm tra van điện từ SLU",
        image: "assets/images/dtc/p2579-step3.png",
        actions: [
          "Tháo van điện từ SLU",
          "Đo điện trở",
          "Nối cực (+) có bóng đèn 21W vào cực 2 và cực (-) vào cực 1",
        ],
        table: {
          headers: ["Chân kết nối", "Điện trở tiêu chuẩn"],
          rows: [["1 - 2", "5.0 Ω tới 5.6 Ω ở 20°C (68°F)"]],
        },
        question: "Van điện từ có phát ra âm thanh hoạt động không?",
        answers: {
          yes: { result: "Sửa chữa hoặc thay thế dây điện" },
          no: { result: "Thay thế van điện từ SLU" },
        },
      },
    ],
  },
};

// Resolve "same_flow_as" references
for (const code in dtcData) {
  const entry = dtcData[code];
  if (entry.same_flow_as && dtcData[entry.same_flow_as]) {
    entry.steps = dtcData[entry.same_flow_as].steps;
    entry.detection_logic =
      entry.detection_logic || dtcData[entry.same_flow_as].detection_logic;
  }
}

// Export the 5 groups for chip filter
export const dtcGroups = {
  "sensor-position": { label: "Cảm biến vị trí", codes: ["P0705"] },
  "sensor-temp-atf": {
    label: "Cảm biến nhiệt độ ATF",
    codes: ["P0710", "P0711", "P0712", "P0713"],
  },
  "sensor-speed": { label: "Cảm biến tốc độ", codes: ["P0717"] },
  "solenoid-shift": { label: "Van điện từ Shift", codes: ["P0751", "P0756"] },
  "solenoid-st": { label: "Van điện từ ST", codes: ["P0787", "P0788"] },
  "solenoid-circuit": {
    label: "Mạch điều khiển van",
    codes: ["P0973", "P0974", "P0976", "P0977"],
  },
  "solenoid-pressure": { label: "Van điện từ SLT", codes: ["P2714", "P2716"] },
  "solenoid-lockup": {
    label: "Van điện từ SLU (Lock-up)",
    codes: ["P2757", "P2759"],
  },
};
