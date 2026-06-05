/**
 * data/lesson-outcomes.js — Kết quả bài học cho 5 bài U340E
 * =========================================================
 *
 * Mỗi bài (Bài 1-5) có cấu trúc kết quả học tập gồm:
 *
 *   1. objectives    — Mục tiêu học tập (Bloom Level 1-2: Nhớ + Hiểu)
 *                      Mảng các câu "Sau khi học xong, SV có thể..."
 *
 *   2. conclusion    — Kết luận bài học: tóm tắt kiến thức + kỹ năng + bước kế
 *
 *   3. quiz          — Bài trắc nghiệm (Bloom Level 1-3: Nhớ → Áp dụng)
 *                      5-8 câu trắc nghiệm 4 đáp án, có giải thích
 *
 *   4. caseStudy     — Bài tập tình huống (Bloom Level 3-4: Áp dụng + Phân tích)
 *                      1 case study với multi-select đúng/sai + đáp án
 *
 *   5. deliverable   — Sản phẩm cuối bài (Bloom Level 5-6: Đánh giá + Sáng tạo)
 *                      Yêu cầu sản phẩm + Form tải về + Rubric chấm
 *
 * Đặc biệt Bài 3 có thêm:
 *   • truthTable     — Bảng trạng thái phần tử ma sát tương tác
 *                      SV điền ✓/✗ cho 5 tay số × 8 ma sát = 40 ô
 *
 * Bài thi cuối khoá (combined) ở finalExam:
 *   • 10 câu trắc nghiệm xen kẽ 5 bài
 *   • 8 ô truth table (lấy ngẫu nhiên từ bảng 40 ô)
 *   • 1 case chẩn đoán tổng hợp
 */

export const lessonOutcomes = {
  // ═══════════════════════════════════════════════════════════════
  // BÀI 1: KẾT CẤU HỘP SỐ
  // ═══════════════════════════════════════════════════════════════
  1: {
    objectives: [
      "Mô tả được cấu tạo tổng quát của hộp số tự động U340E",
      "Phân biệt được vai trò của biến mô và ly hợp cơ khí",
      "Vẽ được sơ đồ kết cấu CR-CR của 2 bộ truyền hành tinh",
      "Liệt kê đầy đủ 8 phần tử ma sát (3 ly hợp + 3 phanh + 2 khớp 1 chiều) và vai trò chính của từng phần tử",
      'Giải thích được triết lý thiết kế "ít phần tử nhưng đa nhiệm" của U340E',
    ],
    conclusion: {
      knowledge: [
        "Cấu tạo tổng quát U340E gồm 5 cụm chính trong vỏ nhôm 3 khoang chức năng",
        "8 phần tử ma sát: 3 ly hợp (C1, C2, C3) + 3 phanh (B1, B2, B3) + 2 khớp 1 chiều (F1, F2)",
        'Triết lý thiết kế "ít phần tử nhưng đa nhiệm" — C1 tham gia gần như toàn bộ dải số tiến',
        "Cấu hình CR-CR của 2 bộ truyền hành tinh tạo được 4 số tiến + 1 số lùi",
      ],
      skills: [
        "Đọc và phân tích sơ đồ kết cấu hộp số U340E",
        "Nhận biết vị trí và vai trò của từng phần tử ma sát",
        "Phân biệt được U340E với các họ hộp số tự động khác (5-6 cấp)",
      ],
      nextStep:
        "Bài 2 sẽ hướng dẫn quy trình tháo lắp 22 bước + 26 bước trên chính các cụm chi tiết các bạn vừa học.",
    },
    quiz: [
      {
        question: "Hộp số U340E có bao nhiêu cấp số tiến?",
        options: ["3 cấp", "4 cấp", "5 cấp", "6 cấp"],
        correctIndex: 1,
        explanation:
          "U340E là hộp số 4 cấp tiến + 1 cấp lùi. Mã ký hiệu: 'U' = U-series Aisin, '340' = code họ hộp số (cấp số + dung tích), 'E' = electronic control.",
      },
      {
        question: "U340E sử dụng bao nhiêu bộ truyền bánh răng hành tinh?",
        options: [
          "1 bộ",
          "2 bộ đơn giản kiểu CR-CR",
          "3 bộ Ravigneaux",
          "2 bộ Lepelletier",
        ],
        correctIndex: 1,
        explanation:
          "U340E dùng 2 bộ truyền hành tinh đơn giản tổ chức theo kiểu CR-CR — Cần dẫn của bộ này nối với bánh răng bao (Ring) của bộ kia. Đây là cấu hình phổ biến cho hộp số 4 cấp.",
      },
      {
        question: "Phần tử nào KHÔNG có trong hộp số U340E?",
        options: ["Ly hợp C1", "Phanh B2", "Khớp 1 chiều F1", "Ly hợp C4"],
        correctIndex: 3,
        explanation:
          "U340E chỉ có 3 ly hợp (C1, C2, C3), 3 phanh (B1, B2, B3) và 2 khớp 1 chiều (F1, F2). Không có ly hợp C4.",
      },
      {
        question: "Ly hợp C1 đảm nhiệm vai trò chính nào?",
        options: [
          "Tham gia gần như toàn bộ dải số tiến",
          "Chỉ tham gia số lùi",
          "Chỉ tham gia số OD",
          "Khoá biến mô khi tốc độ cao",
        ],
        correctIndex: 0,
        explanation:
          "C1 (Forward Clutch) là ly hợp tham gia gần như toàn bộ dải số tiến (số 1, 2, 3, OD ở chế độ D). Đây là triết lý 'ít phần tử nhưng đa nhiệm' của U340E.",
      },
      {
        question: "Vỏ hộp số U340E được làm bằng vật liệu gì?",
        options: [
          "Thép đúc",
          "Gang xám",
          "Hợp kim nhôm dạng hai nửa",
          "Composite carbon",
        ],
        correctIndex: 2,
        explanation:
          "Vỏ hộp số U340E làm bằng hợp kim nhôm dạng 2 nửa (thân chính + nắp/đai bắt), chia làm 3 khoang chức năng riêng biệt giúp giảm trọng lượng và dễ tản nhiệt.",
      },
      {
        question: "Số phần tử ma sát ROTATING (ly hợp) của U340E là?",
        options: ["1", "2", "3", "4"],
        correctIndex: 2,
        explanation:
          "U340E có 3 ly hợp quay (rotating clutches): C1 (Forward), C2 (Direct), C3 (Reverse). Ngoài ra còn 3 phanh tĩnh (B1, B2, B3) là loại stationary.",
      },
      {
        question: "Khớp 1 chiều F1 trong U340E có chức năng gì?",
        options: [
          "Truyền mô-men từ động cơ vào hộp số",
          "Cho phép quay 1 chiều, chặn chiều ngược lại",
          "Điều khiển áp suất dầu",
          "Khoá biến mô",
        ],
        correctIndex: 1,
        explanation:
          "Khớp 1 chiều (One-Way Clutch / Sprag Clutch) là cơ cấu cơ học cho phép trục quay tự do 1 chiều nhưng chặn ngay khi quay ngược. F1, F2 trong U340E làm việc tự động (không cần điều khiển), hỗ trợ chuyển số mượt và êm.",
      },
      {
        question:
          "Trên hộp số U340E, đường truyền lực ở số 1 (D-1) đi qua những phần tử nào?",
        options: ["C1 + B1", "C1 + F2 (khớp 1 chiều)", "C2 + B3", "C3 + F1"],
        correctIndex: 1,
        explanation:
          "Ở số 1 (D-1), C1 đóng để truyền mô-men từ trục sơ cấp vào mặt trời trước, F2 (khớp 1 chiều) khoá cần dẫn sau giữ vai trò làm điểm tựa. Đây là lý do số 1 chuyển êm — F2 tự động phối hợp không cần điều khiển ECU.",
      },
    ],
    caseStudy: {
      title: "Phân biệt U340E với hộp số tự động khác",
      scenario:
        "Một garage nhận 2 hộp số tự động Toyota đã tháo rời. Hộp số A có 3 ly hợp + 3 phanh + 2 khớp 1 chiều và 2 bộ hành tinh đơn giản. Hộp số B có 2 ly hợp + 4 phanh + 1 bộ hành tinh Ravigneaux. Cả 2 đều có vỏ hợp kim nhôm.",
      question:
        "Theo bạn, đâu là hộp số U340E? Tích vào các đặc điểm đúng với U340E:",
      options: [
        { text: "Hộp số A là U340E", correct: true },
        {
          text: "Hộp số A có 8 phần tử ma sát (3+3+2) — đúng với U340E",
          correct: true,
        },
        {
          text: "Hộp số A dùng 2 bộ hành tinh CR-CR — đúng với U340E",
          correct: true,
        },
        { text: "Hộp số B là U340E", correct: false },
        {
          text: "Hộp số B dùng bộ Ravigneaux — đặc trưng của hộp 5-6 cấp như A350E",
          correct: true,
        },
        { text: "Cả 2 đều có thể là U340E vì cùng vỏ nhôm", correct: false },
      ],
      explanation:
        "U340E có cấu hình đặc trưng: 2 bộ hành tinh đơn giản CR-CR + 3 ly hợp + 3 phanh + 2 khớp một chiều. Hộp số dùng Ravigneaux thường là 5-6 cấp (A350E, U660E).",
    },
    deliverable: {
      title: "📐 Sản phẩm cuối Bài 1: Sơ đồ kết cấu U340E",
      description:
        "Vẽ tay (hoặc dùng phần mềm) sơ đồ kết cấu tổng quát hộp số U340E theo yêu cầu sau:",
      requirements: [
        "Vẽ rõ 3 khoang chức năng (biến mô-bơm dầu, hành tinh-ma sát, truyền lực cuối-vi sai)",
        "Đánh số đầy đủ 13 cụm chính theo bảng đã học",
        "Ghi đầy đủ tên 8 phần tử ma sát (C1, C2, C3, B1, B2, B3, F1, F2) đúng vị trí",
        "Vẽ đường truyền lực ở số 1 (D-1) bằng mũi tên màu đỏ",
        "Ghi chú vai trò chính của từng phần tử ma sát (tối đa 1 dòng/phần tử)",
      ],
      rubric: [
        { criterion: "Đầy đủ 13 cụm chính, đánh số đúng", points: 2 },
        { criterion: "8 phần tử ma sát đúng vị trí và tên", points: 3 },
        { criterion: "Đường truyền lực số 1 vẽ đúng (C1 + F2)", points: 2 },
        { criterion: "Ghi chú vai trò ngắn gọn, chính xác", points: 2 },
        { criterion: "Trình bày sạch, rõ ràng, dễ đọc", points: 1 },
      ],
      maxPoints: 10,
      submitFormat:
        "Nộp file PDF hoặc ảnh JPG/PNG. Đặt tên: HoTen_MSSV_Bai1.pdf",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // BÀI 2: QUY TRÌNH THÁO LẮP
  // ═══════════════════════════════════════════════════════════════
  2: {
    objectives: [
      "Thực hiện được quy trình tháo hộp số U340E theo đúng 22 bước chuẩn",
      "Thực hiện được quy trình lắp hộp số U340E theo đúng 26 bước chuẩn",
      "Sử dụng đúng các SST (Special Service Tool) như SST 09350-32014, SST 09301-30030",
      "Áp dụng đúng momen siết bu lông theo bảng thông số kỹ thuật",
      "Nhận biết được các lỗi thường gặp khi tháo lắp và cách phòng tránh",
    ],
    conclusion: {
      knowledge: [
        "Quy trình tháo hộp số U340E gồm 22 bước theo chuẩn Toyota Service Manual",
        "Quy trình lắp ngược lại gồm 26 bước với các thông số momen siết cụ thể",
        "Vai trò của hơn 10 loại SST chuyên dùng (SST 09350-32014, 09301-30030,...)",
        "Các điểm lưu ý quan trọng: thứ tự bu lông hình chữ thập, ngâm dầu friction trước khi lắp, đo end-play sau khi lắp",
      ],
      skills: [
        "Sử dụng đúng các dụng cụ chuyên dùng (SST) cho hộp số tự động",
        "Áp dụng đúng momen siết cho từng loại bu lông",
        "Thao tác tháo/lắp an toàn, có hệ thống để tránh hỏng chi tiết",
        "Nhận biết và phòng tránh các lỗi thường gặp khi tháo lắp",
      ],
      nextStep:
        "Bài 3 sẽ giải thích chi tiết nguyên lý truyền lực của các cụm chi tiết các bạn vừa tháo lắp — qua từng tay số.",
    },
    quiz: [
      {
        question: "Khi tháo hộp số U340E, bước nào phải làm ĐẦU TIÊN?",
        options: [
          "Tháo valve body",
          "Xả dầu hộp số ra khỏi các-te",
          "Tháo biến mô",
          "Tháo bộ truyền hành tinh",
        ],
        correctIndex: 1,
        explanation:
          "Trước khi tháo bất kỳ chi tiết nào, phải xả hết dầu ATF khỏi các-te để tránh tràn dầu khi tháo. Sau đó mới tháo các-te dầu, lưới lọc, valve body theo thứ tự.",
      },
      {
        question: "Dụng cụ SST 09350-32014 dùng để làm gì?",
        options: [
          "Đo độ vênh drive plate",
          "Tháo/lắp ly hợp C1",
          "Kiểm tra khớp 1 chiều stator biến mô",
          "Đo áp suất dầu hộp số",
        ],
        correctIndex: 2,
        explanation:
          "SST 09350-32014 là bộ dụng cụ chuyên dùng để kiểm tra khớp 1 chiều của stator trong biến mô. Khi lắp đúng chiều phải xoay nhẹ, lắp ngược chiều phải khoá cứng.",
      },
      {
        question:
          "Tháo bu lông trên valve body theo thứ tự nào để tránh cong vênh?",
        options: [
          "Tháo từ trái qua phải",
          "Tháo từ trên xuống dưới",
          "Tháo theo hình chữ thập (X) đối xứng",
          "Tháo bu lông giữa trước, rìa sau",
        ],
        correctIndex: 2,
        explanation:
          "Khi tháo (và lắp) các bu lông trên bề mặt phẳng như valve body, các-te, phải theo thứ tự đối xứng hình chữ thập để tránh cong vênh, đảm bảo bề mặt tiếp xúc đều.",
      },
      {
        question: "Khi tháo biến mô khỏi hộp số, lưu ý nào QUAN TRỌNG nhất?",
        options: [
          "Đeo găng tay cao su",
          "Tháo theo phương ngang để không làm tràn dầu",
          "Tháo theo phương thẳng đứng (phía trên) để biến mô không tuột rơi",
          "Tháo ngay lập tức sau khi mở nắp",
        ],
        correctIndex: 2,
        explanation:
          "Khi tháo biến mô, phải nâng hộp số theo phương thẳng đứng (biến mô hướng lên trên). Nếu tháo phương ngang, biến mô có thể tự tuột ra khỏi shaft do trọng lượng và làm tràn dầu ATF còn lại bên trong.",
      },
      {
        question: "Lưới lọc dầu hộp số (Oil Strainer) thay thế khi nào?",
        options: [
          "Mỗi lần tháo hộp số",
          "Khi có bột kim loại trong dầu hoặc đại tu",
          "Sau mỗi 5000 km",
          "Khi xe hết bảo hành",
        ],
        correctIndex: 1,
        explanation:
          "Lưới lọc dầu (Oil Strainer) chỉ thay khi: (1) có mảnh/bột kim loại trong dầu chứng tỏ ma sát đã bị mài mòn, hoặc (2) đại tu toàn bộ hộp số. Mỗi lần thay phải đổi cả gioăng kín.",
      },
      {
        question: "Khi lắp valve body trở lại, momen siết bu lông là?",
        options: ["5 N.m", "10 N.m", "25 N.m", "50 N.m"],
        correctIndex: 1,
        explanation:
          "Momen siết bu lông valve body là 10 N.m (~7.5 lb-ft) theo Toyota Service Manual. Siết quá lực có thể làm cong valve body hoặc nứt aluminum housing.",
      },
      {
        question: "Trước khi lắp ly hợp C1 trở lại, cần làm gì?",
        options: [
          "Bôi mỡ lithium dày lên các piston",
          "Ngâm các tấm friction trong dầu ATF mới ít nhất 2 giờ",
          "Sấy khô các tấm friction ở 100°C",
          "Phun WD-40 lên các tấm friction",
        ],
        correctIndex: 1,
        explanation:
          "Các tấm friction (giấy ma sát) phải được ngâm trong dầu ATF mới ít nhất 2 giờ trước khi lắp. Nếu lắp khô, lần khởi động đầu tiên các tấm sẽ bị cháy và làm hỏng ly hợp ngay lập tức.",
      },
      {
        question: "Sau khi lắp xong hộp số, kiểm tra cuối cùng nào QUAN TRỌNG?",
        options: [
          "Chỉ kiểm tra mức dầu là đủ",
          "Đo End-play (khe hở dọc trục) bằng đồng hồ so",
          "Đập nhẹ vào vỏ xem có tiếng kêu lạ",
          "Lắc hộp số xem có rung không",
        ],
        correctIndex: 1,
        explanation:
          "End-play (khe hở dọc trục) là thông số quan trọng nhất sau lắp. Đo bằng đồng hồ so, giá trị tiêu chuẩn 0.50-1.00 mm. Nếu sai phải điều chỉnh shim trước khi đóng nắp.",
      },
    ],
    caseStudy: {
      title: "Xử lý lỗi khi tháo lắp",
      scenario:
        "Sau khi tháo lắp hộp số U340E xong, KTV khởi động xe để kiểm tra. Xe vào số D nhưng KHÔNG di chuyển, mặc dù động cơ vẫn nổ bình thường.",
      question: "Theo bạn, các nguyên nhân CÓ THỂ là:",
      options: [
        { text: "Quên đổ dầu hộp số (hoặc đổ thiếu)", correct: true },
        { text: "Lắp ngược chiều stator biến mô", correct: true },
        { text: "Bu lông valve body siết quá lực", correct: true },
        { text: "Quên lắp lưới lọc dầu", correct: true },
        { text: "Đổ nhầm dầu động cơ vào hộp số", correct: true },
        { text: "Bình ắc-quy yếu", correct: false },
        { text: "Lốp xe non hơi", correct: false },
      ],
      explanation:
        "Các nguyên nhân phổ biến khiến xe không di chuyển sau tháo lắp đều liên quan đến hệ thống thủy lực hộp số: thiếu dầu (không đủ áp suất), lắp ngược stator (mất tăng torque), valve body bị kẹt (do siết quá lực), thiếu lưới lọc (dầu bẩn làm kẹt van), hoặc dùng sai loại dầu.",
    },
    deliverable: {
      title: "🎬 Sản phẩm cuối Bài 2: Video thực hành tháo lắp",
      description:
        "Quay video thực hành tháo và lắp lại 1 cụm chi tiết của hộp số U340E trên mô hình bàn thực hành:",
      requirements: [
        "Chọn 1 trong 4 cụm: (a) Valve Body, (b) Các-te + Lưới lọc, (c) Bơm dầu, (d) Bộ ly hợp C1",
        "Video không quá 30 phút, có thuyết minh từng bước",
        "Hiển thị rõ tên các SST đang dùng + momen siết",
        "Tháo xong → lắp lại đầy đủ → kiểm tra cuối cùng",
        "Tự đánh giá ngắn ở cuối video: 'Tôi gặp khó khăn ở bước nào, cách khắc phục'",
      ],
      rubric: [
        { criterion: "Tháo đúng thứ tự, không bỏ bước", points: 2 },
        { criterion: "Lắp đúng thứ tự, momen siết đúng", points: 2 },
        { criterion: "Sử dụng đúng SST cần thiết", points: 2 },
        {
          criterion: "Thuyết minh rõ ràng, dùng đúng thuật ngữ kỹ thuật",
          points: 2,
        },
        {
          criterion: "An toàn lao động (đeo găng, sắp xếp dụng cụ)",
          points: 1,
        },
        { criterion: "Video chất lượng tốt, dễ xem", points: 1 },
      ],
      maxPoints: 10,
      submitFormat:
        "Upload video lên YouTube/Drive (chế độ unlisted), gửi link qua email cho GVHD. Đặt tên: HoTen_MSSV_Bai2_Video.mp4",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // BÀI 3: NGUYÊN LÝ LÀM VIỆC
  // ═══════════════════════════════════════════════════════════════
  3: {
    objectives: [
      "Phân tích được đường truyền lực ở từng tay số (D-1, D-2, D-3, D-4 OD, R)",
      "Điền chính xác Bảng trạng thái phần tử ma sát cho 5 tay số",
      "Tính toán được tỉ số truyền cho từng tay số dựa trên tỉ số bộ truyền hành tinh",
      "Giải thích vai trò của khớp 1 chiều F1, F2 trong quá trình chuyển số",
      "Phân biệt được sự khác nhau giữa chế độ D, 2, L",
    ],
    conclusion: {
      knowledge: [
        "Đường truyền lực qua bộ truyền hành tinh ở 5 tay số (D-1, D-2, D-3, OD, R)",
        'Bảng trạng thái phần tử ma sát — "đặc trưng kỹ thuật" phải thuộc lòng',
        "Vai trò của khớp 1 chiều F1, F2 trong việc chuyển số êm tự động",
        "Cách tính tỉ số truyền dựa trên Z_S (mặt trời) và Z_R (bao) của bộ hành tinh",
        "Sự khác nhau giữa chế độ D, 2, L (đặc biệt trong khả năng phanh động cơ)",
      ],
      skills: [
        "Phân tích được đường truyền lực ở mỗi tay số trên sơ đồ U340E",
        "Tính toán tỉ số truyền cho từng số dựa trên công thức Willis",
        "Vẽ được sơ đồ động học của bộ truyền hành tinh",
      ],
      nextStep:
        "Bài 4 sẽ chuyển từ phần cơ khí sang điều khiển — ECU và 5 solenoid điều khiển thuỷ lực để vận hành chuỗi truyền lực vừa học.",
    },
    quiz: [
      {
        question: "Ở số 1 (D-1), phần tử nào HOẠT ĐỘNG?",
        options: ["C1 + F2", "C1 + B1", "C2 + B3", "C3 + B2"],
        correctIndex: 0,
        explanation:
          "Ở số 1 chế độ D, C1 đóng để truyền mô-men từ trục sơ cấp vào mặt trời trước, F2 (khớp 1 chiều) khoá cần dẫn sau làm điểm tựa. Đây là lý do D-1 vào số rất êm.",
      },
      {
        question:
          "Tỉ số truyền của bộ truyền hành tinh khi cần dẫn được khoá, bao quay là?",
        options: [
          "i = Z_R / Z_S",
          "i = 1 + Z_R / Z_S",
          "i = -Z_R / Z_S (số âm = đảo chiều)",
          "i = Z_S / Z_R",
        ],
        correctIndex: 2,
        explanation:
          "Khi cần dẫn (Carrier) bị khoá, mặt trời (Sun) và bao (Ring) quay ngược chiều nhau. Tỉ số truyền = -Z_R/Z_S (dấu âm thể hiện đảo chiều). Đây chính là nguyên lý hoạt động của SỐ LÙI.",
      },
      {
        question: "Tay số 4 (OD - Overdrive) có tỉ số truyền như thế nào?",
        options: [
          "i > 1 (giảm tốc)",
          "i = 1 (truyền thẳng)",
          "i < 1 (tăng tốc, ~0.71)",
          "i = 0 (số mo)",
        ],
        correctIndex: 2,
        explanation:
          "OD (Overdrive) có tỉ số truyền < 1, thường khoảng 0.71. Đây là tay số tăng tốc — trục ra quay nhanh hơn trục vào → tiết kiệm nhiên liệu khi xe chạy đều ở tốc độ cao trên cao tốc.",
      },
      {
        question: "Vai trò chính của khớp 1 chiều F2 trong U340E là?",
        options: [
          "Truyền mô-men ở tất cả số tiến",
          "Tự động khoá ở số 1 D, tự nhả khi lên số 2",
          "Khoá biến mô khi tốc độ cao",
          "Điều khiển dòng dầu trong valve body",
        ],
        correctIndex: 1,
        explanation:
          "F2 là khớp 1 chiều tự động — ở số 1 chế độ D, F2 tự khoá để giữ cần dẫn sau làm điểm tựa truyền lực. Khi chuyển lên số 2, F2 tự nhả mà không cần điều khiển ECU → chuyển số mượt và không bị giật.",
      },
      {
        question: "Sự khác nhau giữa số 1 ở chế độ D và chế độ L (Low) là gì?",
        options: [
          "Không khác gì",
          "L có C1 + B3 (có phanh động cơ), D chỉ có C1 + F2",
          "L truyền lực nhanh hơn D",
          "D là số tiến, L là số lùi",
        ],
        correctIndex: 1,
        explanation:
          "Ở D-1: chỉ có C1 + F2 (F2 chỉ khoá theo 1 chiều). Khi xuống dốc, bánh xe quay nhanh hơn động cơ → F2 nhả → KHÔNG có phanh động cơ. Ở L-1: thêm B3 đóng vai trò phanh cứng → KHÓA cần dẫn sau cả 2 chiều → CÓ phanh động cơ khi xuống dốc.",
      },
      {
        question:
          "Khi tăng tốc từ 0 đến 100 km/h, hộp số U340E chuyển số theo thứ tự nào?",
        options: [
          "D → 2 → L",
          "D-1 → D-2 → D-3 → D-4 (OD)",
          "Số 1 → Số 2 → Số 3 → Số R",
          "Số lùi → Mo → Số tiến → OD",
        ],
        correctIndex: 1,
        explanation:
          "Khi xe tăng tốc ở chế độ D, ECU tự động chuyển số theo thứ tự: D-1 (khởi hành) → D-2 (10-30 km/h) → D-3 (30-60 km/h) → D-4/OD (>60 km/h). Điểm chuyển số phụ thuộc vào tải động cơ + tốc độ xe.",
      },
      {
        question: "Để vào số lùi (R), phần tử nào hoạt động?",
        options: ["C1 + B1", "C2 + B2", "C3 + B3", "C3 + F1"],
        correctIndex: 2,
        explanation:
          "Số lùi (R) trên U340E sử dụng C3 + B3: C3 nối mặt trời sau với trục sơ cấp, B3 khoá cần dẫn sau. Cấu hình này khiến trục ra quay ngược chiều với trục vào → xe lùi.",
      },
      {
        question:
          "Cho bộ hành tinh có Z_S=30, Z_R=72. Khi cần dẫn được làm điểm tựa, bao được giữ cố định, mặt trời chủ động — tỉ số truyền là?",
        options: [
          "i = 30/72 ≈ 0.42",
          "i = 72/30 = 2.4",
          "i = 1 + 72/30 = 3.4",
          "i = -72/30 = -2.4",
        ],
        correctIndex: 1,
        explanation:
          "Khi bao (Ring) cố định, mặt trời (Sun) chủ động, cần dẫn (Carrier) bị động: i = (Z_R + Z_S) / Z_S = (72+30)/30 = 3.4. Hoặc nếu chỉ tính Z_R/Z_S = 72/30 = 2.4 (tỉ số bộ truyền). Đáp án đúng phụ thuộc cách quy ước trong giáo trình.",
      },
    ],
    caseStudy: {
      title: "Phân tích đường truyền lực thực tế",
      scenario:
        "Xe Toyota Vios 2010 đang chạy 60 km/h ở chế độ D. Sinh viên hỏi: 'Hộp số đang ở tay số nào? Phần tử nào đang hoạt động? Đường truyền lực đi như thế nào?'",
      question: "Hãy tích vào các câu trả lời ĐÚNG:",
      options: [
        { text: "Có thể đang ở D-3 (số 3) tuỳ tải động cơ", correct: true },
        { text: "Có thể đang ở D-4/OD nếu tải nhẹ, đường bằng", correct: true },
        { text: "Ở D-3: C1 + C2 cùng đóng, B1, B2, B3 đều nhả", correct: true },
        { text: "Ở OD: C2 + B1 hoạt động", correct: true },
        { text: "Chắc chắn ở D-1 vì còn tăng tốc", correct: false },
        { text: "Tỉ số truyền hiện tại chắc chắn = 1.0", correct: false },
      ],
      explanation:
        "Tại 60 km/h chế độ D, hộp số có thể ở D-3 hoặc D-4 (OD) tuỳ tải. D-3 là truyền thẳng (i=1) cần C1+C2 đóng, B nhả hết. D-4/OD cần C2+B1 — B1 khoá mặt trời trước, C2 truyền lực trực tiếp tới cần dẫn → tỉ số <1.",
    },
    // ⭐ ĐẶC TRƯNG CỦA BÀI 3: BẢNG TRẠNG THÁI PHẦN TỬ MA SÁT TƯƠNG TÁC
    truthTable: {
      title: "Bảng trạng thái phần tử ma sát U340E (Element Application Chart)",
      description:
        "Điền ✓ nếu phần tử HOẠT ĐỘNG, ✗ nếu KHÔNG hoạt động. Bảng này là cốt lõi của môn học hộp số tự động — phải thuộc nằm lòng.",
      columns: ["C1", "C2", "C3", "B1", "B2", "B3", "F1", "F2"],
      rows: [
        { gear: "Số 1 (D-1)", truth: ["✓", "✗", "✗", "✗", "✗", "✗", "✗", "✓"] },
        { gear: "Số 2 (D-2)", truth: ["✓", "✗", "✗", "✗", "✓", "✗", "✓", "✗"] },
        { gear: "Số 3 (D-3)", truth: ["✓", "✓", "✗", "✗", "✗", "✗", "✗", "✗"] },
        { gear: "Số 4 (OD)", truth: ["✗", "✓", "✗", "✓", "✗", "✗", "✗", "✗"] },
        { gear: "Số lùi (R)", truth: ["✗", "✗", "✓", "✗", "✗", "✓", "✗", "✗"] },
      ],
      explanation: {
        "Số 1 (D-1)":
          "C1 truyền lực vào mặt trời trước, F2 tự động khoá cần dẫn sau làm điểm tựa. Chuyển số êm nhờ F2 tự nhả khi lên D-2.",
        "Số 2 (D-2)":
          "C1 vẫn đóng, thêm B2 khoá mặt trời sau qua F1 (khớp 1 chiều). Khi giảm tốc, F1 nhả tránh hãm bằng động cơ.",
        "Số 3 (D-3)":
          "C1 + C2 cùng đóng → truyền thẳng (i=1). Tất cả phanh và khớp 1 chiều đều nhả.",
        "Số 4 (OD)":
          "C2 truyền lực trực tiếp tới cần dẫn, B1 khoá mặt trời trước → tỉ số truyền <1 (tăng tốc).",
        "Số lùi (R)":
          "C3 nối mặt trời sau với trục sơ cấp, B3 khoá cần dẫn sau → trục ra quay ngược chiều.",
      },
    },
    deliverable: {
      title: "📊 Sản phẩm cuối Bài 3: Phân tích đường truyền lực 5 tay số",
      description:
        "Soạn báo cáo phân tích đường truyền lực của 5 tay số trên U340E:",
      requirements: [
        "Điền chính xác Bảng trạng thái phần tử ma sát cho 5 tay số (D-1, D-2, D-3, OD, R)",
        "Với mỗi tay số: vẽ sơ đồ đường truyền lực bằng mũi tên màu trên sơ đồ U340E",
        "Tính tỉ số truyền cho từng tay số (giả định Z_S1=30, Z_R1=78, Z_S2=27, Z_R2=72)",
        "Giải thích vai trò của F1 và F2 ở số 1 và số 2",
        "So sánh chế độ D-2 và chế độ 2 (chỉ giới hạn 2): khác nhau ở phần tử nào?",
      ],
      rubric: [
        {
          criterion: "Bảng trạng thái đúng 100% (5 tay × 8 ô = 40 ô)",
          points: 3,
        },
        { criterion: "Sơ đồ đường truyền lực vẽ đúng cho 5 tay", points: 2 },
        { criterion: "Tính toán tỉ số truyền chính xác", points: 2 },
        { criterion: "Giải thích vai trò F1, F2 đúng", points: 2 },
        { criterion: "So sánh D-2 và 2-1 chính xác", points: 1 },
      ],
      maxPoints: 10,
      submitFormat: "File PDF báo cáo. Đặt tên: HoTen_MSSV_Bai3.pdf",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // BÀI 4: ĐIỀU KHIỂN ĐIỆN TỬ & THỦY LỰC
  // ═══════════════════════════════════════════════════════════════
  4: {
    objectives: [
      "Phân biệt 5 loại solenoid trên U340E (S1, S2, SLT, SL, SLU) và vai trò từng loại",
      "Đọc được sơ đồ mạch điện điều khiển hộp số (Wiring Diagram)",
      "Mô tả nguyên lý hoạt động của van điều áp chính (Primary Regulator Valve)",
      "Giải thích cách ECU đọc tín hiệu từ cảm biến và ra lệnh chuyển số",
      "Hiểu được vai trò của áp suất line, áp suất throttle, áp suất governor",
    ],
    conclusion: {
      knowledge: [
        "5 loại solenoid trên U340E: 2 Shift Solenoid ON/OFF (S1, S2) + 3 Linear Solenoid PWM (SLT, SL, SLU)",
        "Vai trò ECU: nhận tín hiệu từ cảm biến, tham chiếu Shift Map, điều khiển solenoid để chuyển số",
        "Áp suất line tổng + áp suất throttle + áp suất governor — 3 áp suất cơ bản của hộp số tự động",
        "Cách đọc sơ đồ mạch điện hộp số: connector C20/C28, mã chân ECU, màu dây",
      ],
      skills: [
        "Đọc và phân tích sơ đồ mạch điện điều khiển hộp số (Wiring Diagram)",
        "Phân biệt được tín hiệu ON/OFF và PWM trên oscilloscope",
        "Hiểu cách ECU đưa ra quyết định chuyển số theo điều kiện vận hành",
      ],
      nextStep:
        "Bài 5 — bài cuối cùng — sẽ ứng dụng tất cả kiến thức 4 bài trên vào việc CHẨN ĐOÁN khi xe có sự cố.",
    },
    quiz: [
      {
        question: "Solenoid S1 và S2 trong U340E thuộc loại nào?",
        options: [
          "Linear Solenoid (PWM)",
          "ON/OFF Shift Solenoid",
          "Pressure Sensor",
          "Stepper Motor",
        ],
        correctIndex: 1,
        explanation:
          "S1 và S2 là Shift Solenoid loại ON/OFF — ECU chỉ điều khiển bật/tắt để mở/đóng các van chuyển số. Khác với SLT, SL, SLU là Linear Solenoid điều khiển PWM (Pulse Width Modulation) để thay đổi áp suất theo % duty cycle.",
      },
      {
        question:
          "Solenoid SLT (Linear Solenoid for Throttle pressure) có chức năng gì?",
        options: [
          "Điều khiển áp suất line tổng",
          "Bật/tắt số 3 và 4",
          "Điều khiển van EGR",
          "Khoá biến mô",
        ],
        correctIndex: 0,
        explanation:
          "SLT (Solenoid Linear Throttle) điều khiển áp suất line tổng (Line Pressure). ECU điều chỉnh duty cycle SLT theo tải động cơ → thay đổi áp suất dầu tới các ly hợp/phanh → tối ưu lực ép ma sát.",
      },
      {
        question: "Tổ hợp ON/OFF của S1, S2 ở số 1 (D-1) là?",
        options: [
          "S1 OFF, S2 OFF",
          "S1 ON, S2 OFF",
          "S1 OFF, S2 ON",
          "S1 ON, S2 ON",
        ],
        correctIndex: 3,
        explanation:
          "Bảng truth của S1, S2 trên U340E: D-1: S1 ON + S2 ON; D-2: S1 OFF + S2 ON; D-3: S1 OFF + S2 OFF; D-4(OD): S1 ON + S2 OFF. Đây là 4 tổ hợp 2-bit cho 4 tay số tiến.",
      },
      {
        question: "Solenoid SLU (Linear Solenoid for lock-Up) điều khiển?",
        options: [
          "Số lùi",
          "Áp suất tới ly hợp khoá biến mô (TCC)",
          "Áp suất dầu bôi trơn",
          "Đèn báo lỗi",
        ],
        correctIndex: 1,
        explanation:
          "SLU điều khiển áp suất tới Torque Converter Clutch (TCC) — bộ ly hợp khoá biến mô. Khi xe chạy đều ở tốc độ cao, ECU điều khiển SLU đóng TCC → loại bỏ trượt thuỷ lực → tiết kiệm nhiên liệu.",
      },
      {
        question: "Cảm biến nào báo ECU tốc độ xe đầu ra?",
        options: [
          "ATF Temperature Sensor",
          "Throttle Position Sensor (TPS)",
          "Output Speed Sensor (No.2 / SP2)",
          "Crankshaft Position Sensor",
        ],
        correctIndex: 2,
        explanation:
          "Output Speed Sensor (No.2, ký hiệu SP2) đọc tốc độ trục ra của hộp số → tính ra tốc độ xe thực tế. ECU so sánh với Input Speed Sensor (SP1) để xác định tỉ số truyền hiện tại + phát hiện trượt ly hợp.",
      },
      {
        question:
          "Van điều áp chính (Primary Regulator Valve) trong valve body có chức năng?",
        options: [
          "Bật/tắt từng solenoid",
          "Tạo và duy trì áp suất line tổng từ bơm dầu",
          "Đóng/mở ly hợp C1",
          "Điều khiển van số R",
        ],
        correctIndex: 1,
        explanation:
          "Primary Regulator Valve là van quan trọng nhất trong valve body. Nó nhận dầu từ bơm → tạo áp suất line tổng (line pressure) ổn định để cấp cho toàn bộ hệ thống. Áp suất này được điều chỉnh bởi SLT theo tải.",
      },
      {
        question: "Khi xe đang chạy mà cảm biến ATF Temp báo > 150°C, ECU sẽ?",
        options: [
          "Tắt máy ngay",
          "Bật đèn báo lỗi + nháy đèn O/D OFF + vào chế độ giới hạn",
          "Tăng tốc độ chuyển số",
          "Không làm gì",
        ],
        correctIndex: 1,
        explanation:
          "Khi ATF nóng quá ngưỡng (>150°C), ECU sẽ: (1) Bật đèn 'D' nháy báo lỗi, (2) Tắt chế độ OD, (3) Tăng cường lock-up TCC để giảm sinh nhiệt do trượt biến mô, (4) Hạn chế chuyển số nhiều. Nếu kéo dài có thể vào fail-safe mode.",
      },
      {
        question: "Tín hiệu nào ECU dùng để quyết định ĐIỂM CHUYỂN SỐ?",
        options: [
          "Chỉ tốc độ xe (Vehicle Speed)",
          "Chỉ tải động cơ (Throttle Position)",
          "Cả tốc độ xe + tải động cơ + nhiệt độ ATF",
          "Chỉ vị trí cần số (P/R/N/D/2/L)",
        ],
        correctIndex: 2,
        explanation:
          "ECU dùng bảng 2D (Shift Map) với 2 trục: trục X là tốc độ xe, trục Y là vị trí bướm ga (tải). Bản đồ này được hiệu chỉnh thêm bởi nhiệt độ ATF (lạnh thì lùi điểm chuyển số), tốc độ chuyển ga, và các điều kiện khác.",
      },
    ],
    caseStudy: {
      title: "Phân tích lỗi từ wiring diagram",
      scenario:
        "Khách mang xe đến garage báo: 'Xe vào số D bình thường nhưng KHÔNG bao giờ lên được số 3 và 4, luôn giậm chân ở số 2'. KTV đọc DTC thấy có mã P0750 (Lỗi solenoid S1).",
      question: "Theo bạn, các lý do CÓ THỂ là:",
      options: [
        { text: "Dây điện đến S1 bị đứt", correct: true },
        { text: "Connector C28 (đến hộp số) tiếp xúc kém", correct: true },
        { text: "S1 bị cháy (ngắn mạch hoặc hở mạch)", correct: true },
        { text: "ECU bị hỏng output stage điều khiển S1", correct: true },
        { text: "Hết dầu hộp số", correct: false },
        { text: "Bình ắc-quy yếu", correct: false },
        { text: "Lốp xe non hơi", correct: false },
      ],
      explanation:
        "Khi S1 không hoạt động (do bất kỳ nguyên nhân nào: dây, connector, solenoid, ECU), hộp số sẽ kẹt ở D-2 vì cần S1 ON + S2 OFF để vào số 3. Đây là chế độ fail-safe — ECU buộc xe vào số 2 (tay số an toàn) để khách có thể lái về garage.",
    },
    deliverable: {
      title: "⚡ Sản phẩm cuối Bài 4: Sơ đồ mạch điện 1 solenoid",
      description:
        "Vẽ chi tiết sơ đồ mạch điện cho 1 solenoid trên U340E + giải thích quá trình ECU điều khiển:",
      requirements: [
        "Chọn 1 trong 5 solenoid: S1, S2, SLT, SL hoặc SLU",
        "Vẽ sơ đồ mạch từ ECU → connector C20 → harness → connector C28 → solenoid → mass",
        "Ghi rõ chân ECU, mã connector, màu dây (theo Toyota Service Manual)",
        "Mô tả tín hiệu điều khiển: ON/OFF hay PWM? Duty cycle bao nhiêu?",
        "Vẽ dạng sóng tín hiệu (oscilloscope waveform) khi solenoid hoạt động",
      ],
      rubric: [
        { criterion: "Sơ đồ mạch đầy đủ, đúng chiều dòng điện", points: 3 },
        { criterion: "Ghi đúng connector, chân ECU, màu dây", points: 2 },
        { criterion: "Phân biệt đúng tín hiệu ON/OFF hay PWM", points: 2 },
        {
          criterion: "Vẽ dạng sóng đúng (nếu PWM phải có duty cycle)",
          points: 2,
        },
        { criterion: "Trình bày rõ ràng, có chú thích", points: 1 },
      ],
      maxPoints: 10,
      submitFormat:
        "File PDF (vẽ tay scan hoặc dùng phần mềm). Đặt tên: HoTen_MSSV_Bai4.pdf",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // BÀI 5: CHẨN ĐOÁN & BẢO DƯỠNG
  // ═══════════════════════════════════════════════════════════════
  5: {
    objectives: [
      "Sử dụng được máy chẩn đoán OBD-II để đọc mã DTC",
      "Phân biệt được các nhóm mã DTC (P07xx, P075x, P078x, P097x, P27xx)",
      "Áp dụng quy trình chẩn đoán YES/NO cho từng mã DTC cụ thể",
      "Áp dụng quy trình chẩn đoán theo triệu chứng (không có DTC)",
      "Thực hiện được quy trình bảo dưỡng hộp số định kỳ (thay dầu, kiểm tra)",
    ],
    conclusion: {
      knowledge: [
        "Quy trình đọc và phân tích mã DTC bằng máy chẩn đoán OBD-II",
        "Phân biệt các nhóm mã DTC theo Toyota: P07xx (cảm biến), P075x (solenoid), P27xx (linear solenoid)",
        'Nguyên tắc "sửa trước, xoá sau" và quy trình Reset Memory sau sửa chữa',
        "Quy trình chẩn đoán theo triệu chứng khi không có mã DTC",
        "Kỳ hạn bảo dưỡng định kỳ và loại dầu chuẩn cho U340E (ATF Type T-IV)",
      ],
      skills: [
        "Áp dụng flowchart YES/NO để chẩn đoán logic, có hệ thống",
        "Đo điện trở solenoid, kiểm tra connector, dây dẫn theo Service Manual",
        "Viết báo cáo chẩn đoán chuyên nghiệp cho khách hàng / garage",
      ],
      nextStep:
        "🎓 Các bạn đã hoàn thành toàn bộ 5 bài học về hộp số tự động U340E! Hãy thử làm Bài thi cuối khoá để tự đánh giá năng lực toàn diện.",
    },
    // Sub-conclusions cho 2 mục riêng của Bài 5
    subConclusions: {
      5.1: {
        title: "Kết luận mục 5.1 — Tra cứu mã lỗi DTC",
        knowledge: [
          "Hệ thống 18 mã lỗi DTC chính thức của hộp số U340E theo Toyota Service Manual",
          "Phân loại theo 5 nhóm: Cảm biến vị trí (P0705), Cảm biến nhiệt độ ATF (P0710-P0713), Cảm biến tốc độ (P0717), Van điện từ Shift (P0750-P0755), Van điện từ áp suất (P2714-P2723, P0974-P0976)",
          "Mỗi mã DTC có quy trình chẩn đoán riêng theo flowchart YES/NO 3-5 bước",
          "Mã hardcode (P07xx, P09xx) là lỗi mạch điện gốc — cần sửa trước; mã performance (P075x, P271x) là hậu quả — thường tự khỏi sau khi sửa mã gốc",
        ],
        skills: [
          "Tra cứu nhanh mã DTC bất kỳ qua chip filter hoặc search box",
          "Áp dụng flowchart YES/NO để chẩn đoán theo từng bước",
          "Đọc sơ đồ mạch điện kèm theo từng mã DTC để định vị connector + chân ECU",
          "Phân biệt thứ tự ưu tiên xử lý khi có nhiều mã DTC cùng lúc",
        ],
        nextStep:
          "Mục 5.2 — Triệu chứng kỹ thuật — sẽ hướng dẫn chẩn đoán khi xe có sự cố nhưng KHÔNG có mã DTC nào được ghi nhận.",
      },
      5.2: {
        title: "Kết luận mục 5.2 — Tra cứu triệu chứng",
        knowledge: [
          "Hệ thống 25 triệu chứng thường gặp ở hộp số tự động được phân loại theo 6 nhóm",
          "Mỗi triệu chứng có flowchart chẩn đoán riêng với các bước kiểm tra cụ thể (kiểm tra dầu, đo áp suất, kiểm tra cơ học)",
          "Nguyên tắc DRY (Don't Repeat Yourself) trong tra cứu: các bước kiểm tra chung (Valve Body, ly hợp C1, phanh B2...) được dùng chung giữa nhiều triệu chứng",
          "Khi không có DTC, triệu chứng + cảm giác lái + kết quả đo áp suất là 3 nguồn thông tin quan trọng nhất để chẩn đoán",
        ],
        skills: [
          "Phân loại triệu chứng theo nhóm để khoanh vùng nguyên nhân nhanh",
          "Áp dụng flowchart YES/NO khi chẩn đoán không có mã DTC",
          "Sử dụng hình minh họa kèm theo từng bước (đo điện trở solenoid, kiểm tra SST...) để thao tác chuẩn",
          "Kết hợp tra cứu DTC + Triệu chứng để chẩn đoán toàn diện",
        ],
        nextStep:
          "🎓 Chúc mừng — bạn đã hoàn thành toàn bộ chương trình học U340E! Tổng kết: 5 bài học + 18 mã DTC + 25 triệu chứng + 165+ hình minh hoạ.",
      },
    },
    quiz: [
      {
        question: "Khi đọc mã DTC P0710 — nghĩa là?",
        options: [
          "Lỗi mạch cảm biến vị trí cần số",
          "Lỗi mạch cảm biến nhiệt độ dầu hộp số 'A'",
          "Lỗi solenoid S1",
          "Lỗi áp suất line",
        ],
        correctIndex: 1,
        explanation:
          "P0710 = Transmission Fluid Temperature Sensor 'A' Circuit. Lỗi mạch cảm biến nhiệt độ dầu hộp số 'A' (mạch hở hoặc bất thường). Nhóm P07xx là các lỗi cảm biến hardcode.",
      },
      {
        question: "Mã P2714 vs P0744 — khác nhau cơ bản là gì?",
        options: [
          "Không khác gì",
          "P2714 là lỗi performance solenoid, P0744 là lỗi performance TCC",
          "P2714 cho xe đời cũ, P0744 cho xe đời mới",
          "Cả 2 đều cho cùng một solenoid",
        ],
        correctIndex: 1,
        explanation:
          "P2714 = 'Pressure Control Solenoid D Performance' — lỗi hiệu suất van điện từ điều khiển áp suất D (thường là SLT). P0744 = 'Torque Converter Clutch Circuit Intermittent' — lỗi gián đoạn ly hợp khoá biến mô. Khác hoàn toàn về phần tử.",
      },
      {
        question:
          "Khi xe có triệu chứng 'Giật mạnh khi chuyển từ D vào số' mà KHÔNG có DTC, bước đầu tiên nên làm?",
        options: [
          "Tháo và thay valve body ngay",
          "Đọc DTC một lần nữa với máy có khả năng cao hơn",
          "Kiểm tra mức dầu ATF + chất lượng dầu (màu, mùi)",
          "Thay biến mô",
        ],
        correctIndex: 2,
        explanation:
          "Triệu chứng 'giật khi chuyển số' không có DTC thường do dầu ATF: thiếu (gây trượt và sốc khi đầy áp), bẩn (kẹt valve), hoặc lẫn nước (mất tính nhớt). Luôn kiểm tra dầu là bước đầu tiên — đơn giản, rẻ, hiệu quả 60% trường hợp.",
      },
      {
        question: "Bao lâu cần thay dầu hộp số U340E theo khuyến nghị Toyota?",
        options: [
          "Mỗi 10.000 km (như dầu động cơ)",
          "Mỗi 40.000-60.000 km điều kiện thường, 20.000 km điều kiện khắc nghiệt",
          "Suốt đời xe, không cần thay",
          "Chỉ thay khi có lỗi",
        ],
        correctIndex: 1,
        explanation:
          "Toyota khuyến nghị thay dầu U340E mỗi 40.000-60.000 km cho điều kiện vận hành thường (lái xe trong thành phố, đường tốt). Điều kiện khắc nghiệt (kéo tải, lái đồi núi, kẹt xe nặng, nhiệt độ cao) — thay mỗi 20.000-30.000 km. Quan niệm 'lifetime fluid' của Aisin là MARKETING, không nên tin.",
      },
      {
        question: "Khi xoá mã DTC, lưu ý nào quan trọng nhất?",
        options: [
          "Xoá ngay không cần kiểm tra gì",
          "Phải sửa nguyên nhân TRƯỚC khi xoá, vì xoá xong mã sẽ trở lại",
          "Xoá xong phải khởi động máy 100 lần",
          "Xoá 1 mã sẽ xoá tất cả các mã khác",
        ],
        correctIndex: 1,
        explanation:
          "Quy tắc vàng: SỬA TRƯỚC, XOÁ SAU. Nếu xoá mã mà chưa sửa nguyên nhân, mã sẽ quay lại sau vài lần khởi động xe. Một số mã \"hard code\" cần điều kiện đặc biệt để mới phát hiện lại (drive cycle), nên KTV non kinh nghiệm dễ tưởng 'đã sửa'.",
      },
      {
        question:
          "Triệu chứng 'lock-up khi tốc độ cao có giật' liên quan đến phần tử nào?",
        options: [
          "Solenoid SLU + ly hợp khoá biến mô (TCC)",
          "Ly hợp C1",
          "Phanh B3",
          "Van điều áp chính",
        ],
        correctIndex: 0,
        explanation:
          "Triệu chứng giật khi lock-up thường liên quan đến: (1) Solenoid SLU bị kẹt hoặc cháy, (2) Ly hợp khoá biến mô (TCC) bị mòn/cháy giấy ma sát, (3) Dầu ATF bẩn không cho phép đóng êm. Cần kiểm tra theo flowchart triệu chứng số 9.",
      },
      {
        question:
          "Khi 'Reset Memory' sau khi sửa hộp số U340E, bước nào CẦN làm?",
        options: [
          "Chỉ cần tắt máy 5 phút",
          "Tháo cực âm bình ắc-quy 10 phút",
          "Dùng máy chẩn đoán xoá Initial Memory + Idle Memory + chạy thử drive cycle",
          "Không cần làm gì",
        ],
        correctIndex: 2,
        explanation:
          "Sau khi sửa lớn (như thay solenoid, valve body), cần reset memory bằng máy chẩn đoán để ECU 'quên' các giá trị learning cũ + bắt đầu học lại. Sau đó chạy thử (drive cycle) khoảng 30 phút để ECU calibrate lại điểm chuyển số tối ưu cho xe.",
      },
      {
        question: "Trong các loại dầu sau, đâu là chuẩn cho U340E?",
        options: [
          "ATF Dexron II",
          "ATF Type T-IV (T4) hoặc tương đương",
          "Dầu động cơ 10W-40",
          "Dầu thuỷ lực công nghiệp",
        ],
        correctIndex: 1,
        explanation:
          "U340E dùng dầu ATF Toyota Type T-IV (mã hiệu Toyota 08886-81015) hoặc dầu tương đương từ Aisin, Castrol, Mobil, Total. KHÔNG được dùng Dexron II/III (dầu cũ cho hộp số 3-4 cấp đời 80-90s) — sẽ làm hỏng các ma sát chỉ sau vài ngàn km.",
      },
    ],
    caseStudy: {
      title: "Quy trình chẩn đoán hoàn chỉnh",
      scenario:
        "Xe Toyota Yaris 2010 đến garage với 2 triệu chứng đồng thời: (a) Đèn check engine sáng, (b) Xe không bao giờ chuyển lên số 4 (OD). KTV đọc DTC thấy 2 mã: P0750 (Shift Solenoid A — S1 malfunction) và P0973 (Mạch S1 thấp).",
      question: "Quy trình chẩn đoán đúng theo thứ tự ưu tiên là:",
      options: [
        {
          text: "Đọc và lưu cả 2 mã DTC + đọc Freeze Frame Data",
          correct: true,
        },
        { text: "Kiểm tra mức dầu ATF + chất lượng dầu", correct: true },
        {
          text: "Sửa P0973 (mạch điện) TRƯỚC P0750 vì lỗi mạch điện thường là nguyên nhân gốc",
          correct: true,
        },
        {
          text: "Kiểm tra connector C28 và đo điện trở solenoid S1 (theo flowchart P0973)",
          correct: true,
        },
        { text: "Sửa P0750 trước vì có 4 chữ số nhỏ hơn", correct: false },
        { text: "Thay valve body ngay không cần chẩn đoán", correct: false },
        {
          text: "Bỏ qua DTC, lái thử xe 100 km xem có hết không",
          correct: false,
        },
      ],
      explanation:
        "Quy tắc chẩn đoán DTC: (1) Đọc & lưu tất cả mã + Freeze Frame trước khi xoá. (2) Khi có nhiều mã cùng nhóm, sửa lỗi mạch điện (P09xx, P07xx) TRƯỚC lỗi performance (P075x, P078x) vì lỗi mạch là gốc. P0973 = mạch S1 thấp → kiểm tra dây, connector, đo điện trở solenoid (~11-15Ω). Khi sửa xong P0973, P0750 thường tự khỏi.",
    },
    deliverable: {
      title: "🔧 Sản phẩm cuối Bài 5: Báo cáo chẩn đoán hoàn chỉnh",
      description:
        "Cho 1 tình huống chẩn đoán giả định, sinh viên viết báo cáo chẩn đoán đầy đủ theo mẫu KTV chuyên nghiệp:",
      requirements: [
        "Tình huống: KTV chọn 1 trong 3 đề bài có sẵn (DTC P0710, P2714, hoặc Symptom 'Không vào số R')",
        "Báo cáo phải có: (a) Mô tả triệu chứng, (b) Mã DTC đã đọc, (c) Quy trình chẩn đoán step-by-step",
        "Vẽ flowchart YES/NO cho quy trình chẩn đoán",
        "Liệt kê các nguyên nhân khả dĩ + xác suất ước tính (%)",
        "Đề xuất phương án sửa chữa + chi phí ước tính + thời gian thực hiện",
        "Cuối báo cáo: Kết luận và bài học rút ra",
      ],
      rubric: [
        { criterion: "Đọc đúng và phân tích mã DTC chính xác", points: 2 },
        {
          criterion: "Quy trình chẩn đoán logic, đúng thứ tự ưu tiên",
          points: 3,
        },
        { criterion: "Flowchart YES/NO vẽ rõ ràng, đầy đủ nhánh", points: 2 },
        {
          criterion: "Phương án sửa chữa khả thi, có chi phí hợp lý",
          points: 2,
        },
        {
          criterion: "Trình bày chuyên nghiệp như báo cáo KTV thực tế",
          points: 1,
        },
      ],
      maxPoints: 10,
      submitFormat: "File PDF báo cáo theo mẫu. Đặt tên: HoTen_MSSV_Bai5.pdf",
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// BÀI THI CUỐI KHOÁ
// ═══════════════════════════════════════════════════════════════

export const finalExam = {
  title: "🎓 BÀI THI CUỐI KHOÁ — Hộp Số Tự Động U340E",
  description:
    "Bài thi tổng hợp 3 phần, đánh giá năng lực toàn diện sau khi học xong 5 bài. Thời gian khuyến nghị: 60 phút.",
  duration: 60, // minutes

  parts: [
    {
      id: "trac-nghiem",
      title: "PHẦN 1: TRẮC NGHIỆM (5 điểm)",
      description: "10 câu trắc nghiệm xen kẽ 5 bài. Mỗi câu 0.5 điểm.",
      maxPoints: 5,
      // 2 câu mỗi bài, chọn ngẫu nhiên từ quiz
      sampleFromBais: [1, 2, 3, 4, 5],
      questionsPerBai: 2,
    },
    {
      id: "truth-table",
      title: "PHẦN 2: BẢNG TRẠNG THÁI (2 điểm)",
      description:
        "Điền 8 ô ngẫu nhiên trong bảng trạng thái phần tử ma sát. Mỗi ô 0.25 điểm.",
      maxPoints: 2,
      cellsToFill: 8,
    },
    {
      id: "case-tong-hop",
      title: "PHẦN 3: TÌNH HUỐNG CHẨN ĐOÁN (3 điểm)",
      description:
        "Phân tích tình huống chẩn đoán tổng hợp + viết quy trình xử lý.",
      maxPoints: 3,
      scenario:
        "Xe Toyota Vios 2011 đến garage với các triệu chứng đồng thời: (1) Xe giật khi chuyển từ số 2 lên số 3, (2) Đèn check engine sáng nhưng không nháy O/D, (3) Tốc độ cao xe hơi rung. KTV đọc DTC thấy: P0750 (S1 Performance) + P2716 (SLT Performance). Nhiệt độ dầu hộp số đo được 95°C (trong giới hạn).",
      questions: [
        {
          subQuestion:
            "Câu 3.1 (1 điểm): Phân tích nguyên nhân gốc của tình huống",
          options: [
            {
              text: "P0750 và P2716 đều là lỗi performance — chứng tỏ có vấn đề về thuỷ lực, không phải mạch điện",
              correct: true,
            },
            {
              text: "Nhiệt độ 95°C trong giới hạn → loại trừ lỗi nhiệt",
              correct: true,
            },
            {
              text: "Nguyên nhân khả dĩ nhất: Valve body bẩn/kẹt, dầu ATF xuống cấp",
              correct: true,
            },
            { text: "Cần thay ECU ngay", correct: false },
            { text: "Phải thay cả hộp số", correct: false },
          ],
        },
        {
          subQuestion: "Câu 3.2 (1 điểm): Quy trình xử lý đúng thứ tự ưu tiên",
          options: [
            { text: "Kiểm tra mức + màu + mùi dầu ATF", correct: true },
            { text: "Đọc Freeze Frame Data của cả 2 mã DTC", correct: true },
            {
              text: "Đo áp suất line (Line Pressure) ở các tay số khác nhau",
              correct: true,
            },
            {
              text: "Nếu áp suất bất thường → tháo và vệ sinh valve body",
              correct: true,
            },
            { text: "Lái thử 50 km và xoá mã", correct: false },
            { text: "Thay biến mô trước", correct: false },
          ],
        },
        {
          subQuestion:
            "Câu 3.3 (1 điểm): Dự kiến chi phí và thời gian sửa chữa",
          options: [
            {
              text: "Vệ sinh + thay dầu: 800.000-1.500.000 VNĐ, 4-6 giờ",
              correct: true,
            },
            {
              text: "Đại tu valve body: 3.000.000-5.000.000 VNĐ, 1 ngày",
              correct: true,
            },
            {
              text: "Thay solenoid SLT (nếu vẫn lỗi): 1.500.000-2.500.000 VNĐ, 4 giờ",
              correct: true,
            },
            {
              text: "Thay toàn bộ hộp số: 25.000.000-40.000.000 VNĐ, 2-3 ngày",
              correct: true,
            },
            { text: "Sửa trong 10 phút, miễn phí", correct: false },
          ],
        },
      ],
    },
  ],
};

// Helper: get all subsection IDs of a bài (for back-button to first sub)
export function getBaiSubsections(baiId) {
  const map = {
    1: ["1.1", "1.2", "1.3", "1.4", "1.5"],
    2: ["2.1", "2.2"],
    3: ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7"],
    4: ["4.1", "4.2"],
    5: ["5.1", "5.2"],
  };
  return map[baiId] || [];
}
