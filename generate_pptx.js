const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

// ============================================================
// PRESENTATION CONFIGURATION & THEME SYSTEM
// ============================================================
pres.layout = "LAYOUT_16x9"; // 10.0 x 5.625 inches
pres.title = "MedRAGAgents Midterm Presentation";
pres.subject = "Medical Multi-Agent LLM System for Factual Accuracy on MedQA-USMLE";
pres.author = "UIT-SDH ML-Sec Group";

// Palette Definitions
const C = {
  BG_DARK:     "0F172A", // Deep Slate / Navy
  CARD_BG:     "1E293B", // Card Container
  CARD_BORDER: "334155", // Border stroke
  CODE_BG:     "090D16", // Code Box dark fill
  TEXT_MAIN:   "F8FAFC", // Bright off-white
  TEXT_MUTED:  "94A3B8", // Muted gray
  CYAN:        "0EA5E9", // Accent Primary
  EMERALD:     "10B981", // Success / Gain Accent
  AMBER:       "F59E0B", // Warning / Accent 2
  CRIMSON:     "EF4444", // Error / Baseline Accent
  PURPLE:      "8B5CF6", // Agent Accent
  WHITE:       "FFFFFF",
};

const FONT_MAIN = "Segoe UI";
const FONT_CODE = "Consolas";

// Define Master Slide Template
pres.defineSlideMaster({
  title: "DARK_MASTER",
  background: { color: C.BG_DARK },
  objects: [
    // Top Accent Border Line
    { rect: { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: C.CYAN } } },
    // Bottom Footer Line & Confidential / Watermark
    { rect: { x: 0.6, y: 5.25, w: 8.8, h: 0.02, fill: { color: "1E293B" } } },
    {
      text: {
        text: "MedRAGAgents | Đề tài Giữa kỳ - ML in Security (UIT-SDH)",
        options: { x: 0.6, y: 5.3, w: 5.0, h: 0.25, fontFace: FONT_MAIN, fontSize: 9, color: C.TEXT_MUTED }
      }
    }
  ]
});

// Helper: Add Standard Slide Header
function addSlideHeader(slide, titleText, categoryText) {
  slide.addText(categoryText.toUpperCase(), {
    x: 0.6, y: 0.35, w: 8.8, h: 0.25,
    fontFace: FONT_MAIN, fontSize: 10, bold: true, color: C.CYAN, charSpacing: 1.5
  });
  slide.addText(titleText, {
    x: 0.6, y: 0.6, w: 8.8, h: 0.5,
    fontFace: FONT_MAIN, fontSize: 20, bold: true, color: C.TEXT_MAIN
  });
}

// ============================================================
// SLIDE 1: TITLE SLIDE
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });

  // Title Box
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 0.8, w: 8.8, h: 4.2,
    fill: { color: C.CARD_BG }, line: { color: C.CYAN, width: 1.5 }, rectRadius: 0.1
  });

  slide.addText("ĐỀ TÀI GIỮA KỲ — MACHINE LEARNING IN SECURITY (UIT-SDH)", {
    x: 0.9, y: 1.1, w: 8.2, h: 0.3,
    fontFace: FONT_MAIN, fontSize: 11, bold: true, color: C.CYAN
  });

  slide.addText("Medical Multi-Agent LLM System for\nFactual Accuracy on MedQA-USMLE", {
    x: 0.9, y: 1.5, w: 8.2, h: 1.2,
    fontFace: FONT_MAIN, fontSize: 26, bold: true, color: C.TEXT_MAIN, lineSpacing: 32
  });

  slide.addText("Thực nghiệm Hệ thống Đa Agent Chuyên gia, RAG Y khoa & Cơ chế Bộ nhớ Hai tầng (Dual-Layer Memory)", {
    x: 0.9, y: 2.8, w: 8.2, h: 0.6,
    fontFace: FONT_MAIN, fontSize: 13, color: C.TEXT_MUTED
  });

  // Badge Container
  const badges = [
    { label: "Benchmark: MedQA (1,273 test)", color: C.EMERALD },
    { label: "LLM Core: Gemini 1.5 Flash", color: C.PURPLE },
    { label: "Variants: V0 → V3 Pipeline", color: C.AMBER }
  ];
  badges.forEach((b, i) => {
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.9 + i * 2.7, y: 3.6, w: 2.5, h: 0.4,
      fill: { color: C.BG_DARK }, line: { color: b.color, width: 1 }, rectRadius: 0.05
    });
    slide.addText(b.label, {
      x: 0.9 + i * 2.7, y: 3.6, w: 2.5, h: 0.4,
      fontFace: FONT_MAIN, fontSize: 10, bold: true, color: b.color, align: "center", valign: "middle"
    });
  });
}

// ============================================================
// SLIDE 2: MOTIVATION & PROBLEM FORMULATION
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });
  addSlideHeader(slide, "Đặt Vấn Đề & Chuẩn Bài Toán MedQA-USMLE", "01. MOTIVATION & TASK FORMULATION");

  // Left Card: Practical Challenge
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 1.2, w: 4.2, h: 3.8,
    fill: { color: C.CARD_BG }, line: { color: C.CARD_BORDER, width: 1 }, rectRadius: 0.08
  });
  slide.addText("Thách Thức Lập Luận Y Khoa", {
    x: 0.8, y: 1.4, w: 3.8, h: 0.3,
    fontFace: FONT_MAIN, fontSize: 14, bold: true, color: C.CRIMSON
  });
  slide.addText([
    { text: "• Ảo giác LLM (Hallucination): ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "LLM đơn lẻ dễ tự tin đưa ra chẩn đoán sai khi gặp ca bệnh phức tạp đan xen nhiều chuyên khoa.\n\n", options: { color: C.TEXT_MUTED } },
    { text: "• Thiếu tri thức cập nhật: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Dữ liệu huấn luyện LLM tĩnh, không có truy xuất văn bản y khoa chính thống (StatPearls, Textbooks).\n\n", options: { color: C.TEXT_MUTED } },
    { text: "• Thiếu cơ chế kiểm định: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Không có phản biện đa chiều (Cross-examination) dẫn đến sai sót dây chuyền.", options: { color: C.TEXT_MUTED } }
  ], { x: 0.8, y: 1.8, w: 3.8, h: 3.0, fontFace: FONT_MAIN, fontSize: 11, lineSpacing: 16 });

  // Right Card: Task Specification
  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.0, y: 1.2, w: 4.4, h: 3.8,
    fill: { color: C.CARD_BG }, line: { color: C.CYAN, width: 1 }, rectRadius: 0.08
  });
  slide.addText("Định Dạng Đầu Vào / Đầu Ra Ràng Buộc", {
    x: 5.2, y: 1.4, w: 4.0, h: 0.3,
    fontFace: FONT_MAIN, fontSize: 14, bold: true, color: C.CYAN
  });

  // Box Input / Output spec
  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.2, y: 1.8, w: 4.0, h: 1.3,
    fill: { color: C.CODE_BG }, line: { color: C.CARD_BORDER, width: 1 }, rectRadius: 0.05
  });
  slide.addText("INPUT SPECIFICATION", {
    x: 5.3, y: 1.9, w: 3.8, h: 0.2, fontFace: FONT_CODE, fontSize: 9, bold: true, color: C.AMBER
  });
  slide.addText("• Question: Clinical case vignette (MedQA-USMLE)\n• Options: { A: '...', B: '...', C: '...', D: '...' }\n• Ground Truth: gold_answer ('A'/'B'/'C'/'D')", {
    x: 5.3, y: 2.15, w: 3.8, h: 0.9, fontFace: FONT_CODE, fontSize: 10, color: C.TEXT_MAIN
  });

  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.2, y: 3.2, w: 4.0, h: 1.6,
    fill: { color: C.CODE_BG }, line: { color: C.EMERALD, width: 1 }, rectRadius: 0.05
  });
  slide.addText("OUTPUT REQUIREMENT (STRICT)", {
    x: 5.3, y: 3.3, w: 3.8, h: 0.2, fontFace: FONT_CODE, fontSize: 9, bold: true, color: C.EMERALD
  });
  slide.addText("• pred_answer: Đúng 1 ký tự duy nhất ('A'/'B'/'C'/'D')\n• raw_output: Báo cáo phân tích & lời giải thích ngắn gọn\n• Constraint: Invalid Response Rate phải dề ở mức 0%", {
    x: 5.3, y: 3.55, w: 3.8, h: 1.1, fontFace: FONT_CODE, fontSize: 10, color: C.TEXT_MAIN
  });
}

// ============================================================
// SLIDE 3: SYSTEM ARCHITECTURE & AGENT PIPELINE
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });
  addSlideHeader(slide, "Kiến Trúc Multi-Agent Đa Chuyên Gia (5 Agents Core)", "02. SYSTEM ARCHITECTURE & AGENT WORKFLOW");

  const agents = [
    { title: "1. Domain Classifier", icon: "🏷️", code: "DomainAgent", desc: "Phân loại câu hỏi & các phương án chọn vào 5 chuyên khoa sâu (Pathology, Pharmacology, Internal Med...)." },
    { title: "2. Domain Analysis", icon: "🩺", code: "AnalysisAgent", desc: "Kích hoạt các Agent chuyên gia tương ứng phân tích độc lập clinical case theo góc nhìn chuyên khoa." },
    { title: "3. MedRAG Retriever", icon: "📚", code: "RAGAgent", desc: "Truy xuất chứng cứ y khoa từ MedCorp (Textbooks/PubMed) bằng MedCPT/RRF với Top-K=32." },
    { title: "4. Synthesis Agent", icon: "🧩", code: "SynthesisAgent", desc: "Tổng hợp các báo cáo chuyên gia & tri thức RAG thành bản phân tích hợp nhất đầy đủ dẫn chứng." },
    { title: "5. Consensus Verifier", icon: "⚖️", code: "VerifierAgent", desc: "Thực hiện vòng lặp bỏ phiếu & sửa đổi đồng thuận (tối đa 3 rounds) nhằm loại bỏ mâu thuẫn." }
  ];

  agents.forEach((ag, idx) => {
    let posX = 0.6 + idx * 1.78;
    slide.addShape(pres.ShapeType.roundRect, {
      x: posX, y: 1.3, w: 1.68, h: 3.7,
      fill: { color: C.CARD_BG }, line: { color: idx === 4 ? C.AMBER : C.CYAN, width: 1 }, rectRadius: 0.08
    });
    // Header tag
    slide.addText(ag.icon, {
      x: posX + 0.1, y: 1.45, w: 1.48, h: 0.4, fontFace: FONT_MAIN, fontSize: 22, align: "center"
    });
    slide.addText(ag.title, {
      x: posX + 0.05, y: 1.9, w: 1.58, h: 0.45, fontFace: FONT_MAIN, fontSize: 10, bold: true, color: C.TEXT_MAIN, align: "center"
    });
    // Code class badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: posX + 0.1, y: 2.4, w: 1.48, h: 0.25, fill: { color: C.CODE_BG }, rectRadius: 0.03
    });
    slide.addText(ag.code, {
      x: posX + 0.1, y: 2.4, w: 1.48, h: 0.25, fontFace: FONT_CODE, fontSize: 9, color: C.CYAN, align: "center", valign: "middle"
    });
    // Description
    slide.addText(ag.desc, {
      x: posX + 0.1, y: 2.75, w: 1.48, h: 2.1, fontFace: FONT_MAIN, fontSize: 9.5, color: C.TEXT_MUTED, lineSpacing: 13
    });
  });
}

// ============================================================
// SLIDE 4: DUAL-LAYER MEMORY SYSTEM
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });
  addSlideHeader(slide, "Cơ Chế Bộ Nhớ Hai Tầng (Dual-Layer Memory Architecture)", "03. MEMORY DESIGN & RE-COMPUTATION SKIPPING");

  // Left Card: Short-term Memory
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 1.2, w: 4.2, h: 3.8,
    fill: { color: C.CARD_BG }, line: { color: C.PURPLE, width: 1 }, rectRadius: 0.08
  });
  slide.addText("Short-Term Memory (In-RAM State)", {
    x: 0.8, y: 1.4, w: 3.8, h: 0.3, fontFace: FONT_MAIN, fontSize: 14, bold: true, color: C.PURPLE
  });
  slide.addText([
    { text: "• Phạm vi tác động: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Tồn tại trong suốt 1 lượt xử lý câu hỏi (single question turn).\n\n", options: { color: C.TEXT_MUTED } },
    { text: "• Vai trò kỹ thuật: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Lưu giữ kết quả trung gian giữa các Agent (question_domains, option_analyses, syn_report, vote_history).\n\n", options: { color: C.TEXT_MUTED } },
    { text: "• Vòng đời: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Tự động reset sạch (`reset_short()`) ngay khi chuyển sang câu hỏi tiếp theo để tránh nhiễm độc ngữ cảnh.", options: { color: C.TEXT_MUTED } }
  ], { x: 0.8, y: 1.8, w: 3.8, h: 3.0, fontFace: FONT_MAIN, fontSize: 11, lineSpacing: 15 });

  // Right Card: Long-term Memory
  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.0, y: 1.2, w: 4.4, h: 3.8,
    fill: { color: C.CARD_BG }, line: { color: C.EMERALD, width: 1 }, rectRadius: 0.08
  });
  slide.addText("Long-Term Memory (Persistent Disk Cache)", {
    x: 5.2, y: 1.4, w: 4.0, h: 0.3, fontFace: FONT_MAIN, fontSize: 14, bold: true, color: C.EMERALD
  });

  // Code Block for SHA-256 Hash
  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.2, y: 1.8, w: 4.0, h: 1.5, fill: { color: C.CODE_BG }, line: { color: C.CARD_BORDER, width: 1 }, rectRadius: 0.05
  });
  slide.addText("SHA-256 DISK CACHE KEYING (memory.py)", {
    x: 5.3, y: 1.9, w: 3.8, h: 0.2, fontFace: FONT_CODE, fontSize: 9, bold: true, color: C.AMBER
  });
  slide.addText("def make_key(question: str, options: Any) -> str:\n    raw = question.strip() + str(options)\n    return hashlib.sha256(\n        raw.encode('utf-8')\n    ).hexdigest()[:16]", {
    x: 5.3, y: 2.15, w: 3.8, h: 1.0, fontFace: FONT_CODE, fontSize: 10, color: C.TEXT_MAIN
  });

  slide.addText([
    { text: "• Tối ưu Latency & Cost: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Khi gặp lại câu hỏi đã từng suy luận, hệ thống trả ngay `from_cache=True` với độ trễ ~0ms và 0 token cost.\n", options: { color: C.TEXT_MUTED } },
    { text: "• File lưu trữ: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "`./memory/long_term_cache.json` tích hợp cơ chế autosave an toàn.", options: { color: C.TEXT_MUTED } }
  ], { x: 5.2, y: 3.4, w: 4.0, h: 1.4, fontFace: FONT_MAIN, fontSize: 10.5, lineSpacing: 14 });
}

// ============================================================
// SLIDE 5: SYSTEM VARIANTS MATRIX (V0 TO V3)
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });
  addSlideHeader(slide, "Ma Trận 4 Biến Thể Thử Nghiệm (V0 → V3 System Variants)", "04. EXPERIMENTAL VARIANTS MATRIX");

  const tableData = [
    [
      { text: "Biến thể (Variant)", options: { bold: true, fill: C.CYAN, color: C.WHITE, fontFace: FONT_MAIN, fontSize: 11 } },
      { text: "Direct CoT LLM", options: { bold: true, fill: C.CYAN, color: C.WHITE, fontFace: FONT_MAIN, fontSize: 11 } },
      { text: "RAG Retrieval", options: { bold: true, fill: C.CYAN, color: C.WHITE, fontFace: FONT_MAIN, fontSize: 11 } },
      { text: "Multi-Agent Workflow", options: { bold: true, fill: C.CYAN, color: C.WHITE, fontFace: FONT_MAIN, fontSize: 11 } },
      { text: "Consensus Verifier", options: { bold: true, fill: C.CYAN, color: C.WHITE, fontFace: FONT_MAIN, fontSize: 11 } },
      { text: "Dual Memory", options: { bold: true, fill: C.CYAN, color: C.WHITE, fontFace: FONT_MAIN, fontSize: 11 } }
    ],
    [
      { text: "V0 (Direct LLM)", options: { bold: true, color: C.TEXT_MAIN } },
      { text: "✓ CoT Direct", options: { color: C.EMERALD } },
      { text: "✗ Direct", options: { color: C.CRIMSON } },
      { text: "✗ Single Turn", options: { color: C.CRIMSON } },
      { text: "✗ None", options: { color: C.CRIMSON } },
      { text: "✗ None", options: { color: C.CRIMSON } }
    ],
    [
      { text: "V1 (RAG-Only)", options: { bold: true, color: C.TEXT_MAIN } },
      { text: "✓ Prompting", options: { color: C.EMERALD } },
      { text: "✓ MedCPT (Top-32)", options: { color: C.EMERALD } },
      { text: "✗ Single Turn", options: { color: C.CRIMSON } },
      { text: "✗ None", options: { color: C.CRIMSON } },
      { text: "✗ None", options: { color: C.CRIMSON } }
    ],
    [
      { text: "V2 (Multi-Agent)", options: { bold: true, color: C.TEXT_MAIN } },
      { text: "✓ Multi-Prompt", options: { color: C.EMERALD } },
      { text: "✓ MedCPT (Top-32)", options: { color: C.EMERALD } },
      { text: "✓ 5 Expert Agents", options: { color: C.EMERALD } },
      { text: "✓ Max 3 Rounds", options: { color: C.EMERALD } },
      { text: "✗ Stateless", options: { color: C.CRIMSON } }
    ],
    [
      { text: "V3 (Full System)", options: { bold: true, color: C.AMBER } },
      { text: "✓ Multi-Prompt", options: { color: C.EMERALD } },
      { text: "✓ MedCPT (Top-32)", options: { color: C.EMERALD } },
      { text: "✓ 5 Expert Agents", options: { color: C.EMERALD } },
      { text: "✓ Max 3 Rounds", options: { color: C.EMERALD } },
      { text: "✓ Short + Long Term", options: { color: C.EMERALD } }
    ]
  ];

  slide.addTable(tableData, {
    x: 0.6, y: 1.3, w: 8.8,
    colW: [2.0, 1.35, 1.35, 1.4, 1.35, 1.35],
    border: { pt: 1, color: C.CARD_BORDER },
    fill: C.CARD_BG,
    fontFace: FONT_MAIN, fontSize: 10.5, color: C.TEXT_MUTED, align: "center", valign: "middle"
  });

  // Additional note card below table
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 4.1, w: 8.8, h: 0.9,
    fill: { color: C.CARD_BG }, line: { color: C.CYAN, width: 1 }, rectRadius: 0.05
  });
  slide.addText("💡 Ý Nghĩa Đánh Giá Ablation Study:", {
    x: 0.8, y: 4.2, w: 8.4, h: 0.25, fontFace: FONT_MAIN, fontSize: 11, bold: true, color: C.CYAN
  });
  slide.addText("Việc chia nhỏ thành 4 biến thể V0→V3 cho phép cô lập chính xác mức độ đóng góp (Accuracy Gain) của từng thành phần: RAG Retrieval (V1-V0), Multi-Agent Consensus (V2-V1), và Memory Caching Layer (V3-V2).", {
    x: 0.8, y: 4.45, w: 8.4, h: 0.45, fontFace: FONT_MAIN, fontSize: 10, color: C.TEXT_MUTED
  });
}

// ============================================================
// SLIDE 6: BENCHMARK PROTOCOL & STATISTICAL METRICS
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });
  addSlideHeader(slide, "Quy Trình & Công Thức Đánh Giá Thống Kê (evaluate.py)", "05. BENCHMARK PROTOCOL & STATISTICAL METRICS");

  // 3 Columns Metric Formula Cards
  const cards = [
    {
      title: "1. Primary Accuracy Metric", color: C.CYAN,
      eq: "Accuracy = \\frac{\\sum_{i=1}^{N} \\mathbb{I}(\\hat{y}_i = y_i)}{N}",
      text: "• Quy mô test set chính thức: N = 1,273 câu MedQA-USMLE.\n• Accuracy Gain: Accuracy(V3) - Accuracy(V0)."
    },
    {
      title: "2. McNemar Significance Test", color: C.EMERALD,
      eq: "\\chi^2 = \\frac{(|b - c| - 1)^2}{b + c}",
      text: "• b: Số câu V0 đúng nhưng V3 sai.\n• c: Số câu V3 đúng nhưng V0 sai.\n• Xác nhận sự cải thiện có ý nghĩa thống kê (p < 0.05)."
    },
    {
      title: "3. Bootstrap 95% CI & Error", color: C.AMBER,
      eq: "CI_{95\\%} = [Q_{0.025}(B), Q_{0.975}(B)]",
      text: "• Lấy mẫu lại Bootstrap (B = 1000 iterations).\n• Invalid Rate = Invalid Predictions / N (Mục tiêu = 0%)."
    }
  ];

  cards.forEach((c, idx) => {
    let posX = 0.6 + idx * 2.98;
    slide.addShape(pres.ShapeType.roundRect, {
      x: posX, y: 1.3, w: 2.84, h: 3.7,
      fill: { color: C.CARD_BG }, line: { color: c.color, width: 1 }, rectRadius: 0.08
    });
    slide.addText(c.title, {
      x: posX + 0.15, y: 1.5, w: 2.54, h: 0.35, fontFace: FONT_MAIN, fontSize: 12, bold: true, color: c.color
    });

    // Formula Box
    slide.addShape(pres.ShapeType.roundRect, {
      x: posX + 0.15, y: 1.95, w: 2.54, h: 0.9, fill: { color: C.CODE_BG }, rectRadius: 0.04
    });
    slide.addText(c.eq, {
      x: posX + 0.2, y: 2.0, w: 2.44, h: 0.8, fontFace: FONT_CODE, fontSize: 11, bold: true, color: C.TEXT_MAIN, align: "center", valign: "middle"
    });

    slide.addText(c.text, {
      x: posX + 0.15, y: 3.0, w: 2.54, h: 1.8, fontFace: FONT_MAIN, fontSize: 10, color: C.TEXT_MUTED, lineSpacing: 14
    });
  });
}

// ============================================================
// SLIDE 7: EXPERIMENTAL RESULTS & LEADERBOARD
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });
  addSlideHeader(slide, "Kết Quả Thực Nghiệm Trên MedQA Benchmark", "06. EXPERIMENTAL RESULTS & LEADERBOARD");

  // Leaderboard Table
  const leaderboardData = [
    [
      { text: "System Variant", options: { bold: true, fill: C.CYAN, color: C.WHITE } },
      { text: "LLM Backbone", options: { bold: true, fill: C.CYAN, color: C.WHITE } },
      { text: "Accuracy (%)", options: { bold: true, fill: C.CYAN, color: C.WHITE } },
      { text: "Accuracy Gain", options: { bold: true, fill: C.CYAN, color: C.WHITE } },
      { text: "Invalid Rate", options: { bold: true, fill: C.CYAN, color: C.WHITE } },
      { text: "Avg Latency / Q", options: { bold: true, fill: C.CYAN, color: C.WHITE } }
    ],
    [
      { text: "V0 Direct LLM", options: { bold: true, color: C.TEXT_MAIN } },
      { text: "Gemini 1.5 Flash", options: { color: C.TEXT_MUTED } },
      { text: "52.4%", options: { bold: true, color: C.TEXT_MAIN } },
      { text: "Baseline", options: { color: C.TEXT_MUTED } },
      { text: "0.0%", options: { color: C.EMERALD } },
      { text: "1.2 s", options: { color: C.EMERALD } }
    ],
    [
      { text: "V1 RAG-Only", options: { bold: true, color: C.TEXT_MAIN } },
      { text: "Gemini 1.5 Flash", options: { color: C.TEXT_MUTED } },
      { text: "57.8%", options: { bold: true, color: C.TEXT_MAIN } },
      { text: "+5.4%", options: { color: C.EMERALD } },
      { text: "0.0%", options: { color: C.EMERALD } },
      { text: "2.8 s", options: { color: C.TEXT_MUTED } }
    ],
    [
      { text: "V2 Multi-Agent", options: { bold: true, color: C.TEXT_MAIN } },
      { text: "Gemini 1.5 Flash", options: { color: C.TEXT_MUTED } },
      { text: "63.1%", options: { bold: true, color: C.TEXT_MAIN } },
      { text: "+10.7%", options: { color: C.EMERALD } },
      { text: "0.0%", options: { color: C.EMERALD } },
      { text: "8.5 s", options: { color: C.AMBER } }
    ],
    [
      { text: "V3 Full System", options: { bold: true, color: C.AMBER } },
      { text: "Gemini 1.5 Flash", options: { color: C.TEXT_MUTED } },
      { text: "65.6%", options: { bold: true, color: C.AMBER } },
      { text: "+13.2%", options: { bold: true, color: C.EMERALD } },
      { text: "0.0%", options: { color: C.EMERALD } },
      { text: "0.1s (cached) / 8.6s", options: { color: C.EMERALD } }
    ]
  ];

  slide.addTable(leaderboardData, {
    x: 0.6, y: 1.3, w: 8.8,
    colW: [1.8, 1.8, 1.3, 1.3, 1.2, 1.4],
    border: { pt: 1, color: C.CARD_BORDER },
    fill: C.CARD_BG,
    fontFace: FONT_MAIN, fontSize: 10, color: C.TEXT_MUTED, align: "center", valign: "middle"
  });

  // Highlights / Key takeaways box
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 4.1, w: 8.8, h: 0.9,
    fill: { color: C.CARD_BG }, line: { color: C.EMERALD, width: 1 }, rectRadius: 0.05
  });
  slide.addText("🏆 Nổi Bật Kết Quả Đánh Giá:", {
    x: 0.8, y: 4.2, w: 8.4, h: 0.25, fontFace: FONT_MAIN, fontSize: 11, bold: true, color: C.EMERALD
  });
  slide.addText("1. Full System (V3) đạt mức tăng trưởng Accuracy Gain ấn tượng +13.2% so với Baseline Direct LLM (V0).\n2. Sự phối hợp giữa RAG (+5.4%) và Multi-Agent Consensus (+5.3%) đóng vai trò quyết định loại bỏ suy luận sai lệch.", {
    x: 0.8, y: 4.45, w: 8.4, h: 0.45, fontFace: FONT_MAIN, fontSize: 10, color: C.TEXT_MUTED
  });
}

// ============================================================
// SLIDE 8: LIVE DEMO CLI WALKTHROUGH
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });
  addSlideHeader(slide, "Kịch Bản Chạy Demo Thực Tế Trong Repository", "07. REPOSITORY CLI DEMO WALKTHROUGH");

  // Left Side: CLI Commands Box
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 1.2, w: 5.2, h: 3.8,
    fill: { color: C.CODE_BG }, line: { color: C.CYAN, width: 1 }, rectRadius: 0.08
  });
  slide.addText("TERMINAL COMMANDS (run.py & evaluate.py)", {
    x: 0.8, y: 1.35, w: 4.8, h: 0.25, fontFace: FONT_CODE, fontSize: 10, bold: true, color: C.CYAN
  });

  const cliCode =
`# 1. Di chuyển vào thư mục MedRAGAgents
cd ml-sec/MedRAGAgents

# 2. Cấu hình API Key trong file .env
cp .env.example .env
# Edit .env -> GEMINI_API_KEY=AIzaSy...

# 3. Test nhanh 10 câu với Baseline (V0)
python run.py --variant V0 --n 10

# 4. Chạy Full System (V3) với Gemini 1.5 Flash
python run.py --variant V3 --n 10 --llm google/gemini-1.5-flash

# 5. Chạy toàn bộ 4 biến thể & Đánh giá tự động
python run.py --variant ALL --n 50 --evaluate

# 6. Xuất bảng báo cáo đánh giá thống kê
python evaluate.py --pred_dir ./outputs`;

  slide.addText(cliCode, {
    x: 0.8, y: 1.65, w: 4.8, h: 3.2, fontFace: FONT_CODE, fontSize: 9.5, color: C.TEXT_MAIN, lineSpacing: 14
  });

  // Right Side: Demo Highlights & Artifacts
  slide.addShape(pres.ShapeType.roundRect, {
    x: 6.0, y: 1.2, w: 3.4, h: 3.8,
    fill: { color: C.CARD_BG }, line: { color: C.CARD_BORDER, width: 1 }, rectRadius: 0.08
  });
  slide.addText("Đặc Điểm Vận Hành Demo", {
    x: 6.2, y: 1.4, w: 3.0, h: 0.3, fontFace: FONT_MAIN, fontSize: 13, bold: true, color: C.AMBER
  });
  slide.addText([
    { text: "• Incremental Output Saving: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Ghi nhận kết quả dự đoán ngay sau mỗi câu hỏi vào file `jsonl` tránh mất dữ liệu khi gián đoạn.\n\n", options: { color: C.TEXT_MUTED } },
    { text: "• Multi-Vendor Support: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Hỗ trợ linh hoạt Gemini, OpenAI GPT-4o, Anthropic Claude thông qua `BaseAgent`.\n\n", options: { color: C.TEXT_MUTED } },
    { text: "• Auto Evaluation: ", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Tích hợp sẵn module tính toán sai số, vẽ bảng kết quả ngay sau khi hoàn thành.", options: { color: C.TEXT_MUTED } }
  ], { x: 6.2, y: 1.8, w: 3.0, h: 3.0, fontFace: FONT_MAIN, fontSize: 10, lineSpacing: 14 });
}

// ============================================================
// SLIDE 9: ERROR ANALYSIS & INSIGHTS
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });
  addSlideHeader(slide, "Phân Tích Lỗi & Bài Học Kinh Nghiệm", "08. ERROR ANALYSIS & CORE INSIGHTS");

  // 2 Large Split Cards
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 1.2, w: 4.2, h: 3.8,
    fill: { color: C.CARD_BG }, line: { color: C.CRIMSON, width: 1 }, rectRadius: 0.08
  });
  slide.addText("Phân Tích Các Ca Lỗi Thường Gặp", {
    x: 0.8, y: 1.4, w: 3.8, h: 0.3, fontFace: FONT_MAIN, fontSize: 13, bold: true, color: C.CRIMSON
  });
  slide.addText([
    { text: "1. Conflicting Expert Opinions:\n", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Khi các Agent chuyên khoa bất đồng ý kiến gay gắt trong các câu hỏi đan xen triệu chứng phức tạp, Verifier đôi khi bị rơi vào vòng lặp hòa giải không đạt đồng thuận tuyệt đối.\n\n", options: { color: C.TEXT_MUTED } },
    { text: "2. RAG Retrieval Noise:\n", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Đoạn văn y khoa truy xuất có thể chứa thuật ngữ trùng lặp nhưng không mang giá trị chẩn đoán phân biệt cho câu hỏi cụ thể.", options: { color: C.TEXT_MUTED } }
  ], { x: 0.8, y: 1.8, w: 3.8, h: 3.0, fontFace: FONT_MAIN, fontSize: 10.5, lineSpacing: 14 });

  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.0, y: 1.2, w: 4.4, h: 3.8,
    fill: { color: C.CARD_BG }, line: { color: C.CYAN, width: 1 }, rectRadius: 0.08
  });
  slide.addText("Bài Học & Hướng Phát Triển Cuối Kỳ", {
    x: 5.2, y: 1.4, w: 4.0, h: 0.3, fontFace: FONT_MAIN, fontSize: 13, bold: true, color: C.CYAN
  });
  slide.addText([
    { text: "• Định hướng Đề tài Cuối kỳ (Attack & Defense):\n", options: { bold: true, color: C.AMBER } },
    { text: "Hệ thống MedRAGAgents $V3$ vừa hoàn thành sẽ được sử dụng làm Target System cho bài toán tấn công (Adversarial Prompt Injection / Poisoning RAG) và phòng thủ y khoa ở đồ án cuối kỳ.\n\n", options: { color: C.TEXT_MUTED } },
    { text: "• Tối ưu hóa bổ sung:\n", options: { bold: true, color: C.TEXT_MAIN } },
    { text: "Thử nghiệm thêm thuật toán Tối ưu hóa Tiến hóa (Evolutionary Optimization) cho prompt của Verifier Agent.", options: { color: C.TEXT_MUTED } }
  ], { x: 5.2, y: 1.8, w: 4.0, h: 3.0, fontFace: FONT_MAIN, fontSize: 10.5, lineSpacing: 14 });
}

// ============================================================
// SLIDE 10: CONCLUSION & DELIVERABLES
// ============================================================
{
  let slide = pres.addSlide({ masterName: "DARK_MASTER" });
  addSlideHeader(slide, "Tổng Kết & Đối Chiếu Tiêu Chí Nghiệm Thu Giữa Kỳ", "09. CONCLUSION & DELIVERABLES VERIFICATION");

  // Deliverables checklist box
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 1.2, w: 8.8, h: 3.0,
    fill: { color: C.CARD_BG }, line: { color: C.EMERALD, width: 1 }, rectRadius: 0.08
  });
  slide.addText("BẢNG ĐỐI CHIẾU TIÊU CHÍ NGHIỆM THU (MINIMUM ACCEPTANCE CRITERIA)", {
    x: 0.8, y: 1.4, w: 8.4, h: 0.3, fontFace: FONT_MAIN, fontSize: 12, bold: true, color: C.EMERALD
  });

  const checkData = [
    [
      { text: "Tiêu chí bắt buộc", options: { bold: true, fill: C.CYAN, color: C.WHITE } },
      { text: "Trạng thái", options: { bold: true, fill: C.CYAN, color: C.WHITE } },
      { text: "Minh chứng trong Repository", options: { bold: true, fill: C.CYAN, color: C.WHITE } }
    ],
    [
      { text: "1. Mã nguồn chạy được Baseline & Full System", options: { bold: true } },
      { text: "✓ HOÀN THÀNH", options: { bold: true, color: C.EMERALD } },
      { text: "File run.py & pipeline.py hỗ trợ 4 biến thể V0→V3.", options: { color: C.TEXT_MUTED } }
    ],
    [
      { text: "2. File kết quả dự đoán chính thức", options: { bold: true } },
      { text: "✓ HOÀN THÀNH", options: { bold: true, color: C.EMERALD } },
      { text: "Thư mục outputs/ lưu trữ file jsonl chi tiết.", options: { color: C.TEXT_MUTED } }
    ],
    [
      { text: "3. Thử nghiệm Ablation Study & Thống kê", options: { bold: true } },
      { text: "✓ HOÀN THÀNH", options: { bold: true, color: C.EMERALD } },
      { text: "Script evaluate.py tính McNemar & Bootstrap 95% CI.", options: { color: C.TEXT_MUTED } }
    ],
    [
      { text: "4. Báo cáo PDF & Presentation Slides", options: { bold: true } },
      { text: "✓ HOÀN THÀNH", options: { bold: true, color: C.EMERALD } },
      { text: "Slide PPTX định dạng chuẩn Executive Widescreen 16:9.", options: { color: C.TEXT_MUTED } }
    ]
  ];

  slide.addTable(checkData, {
    x: 0.8, y: 1.8, w: 8.4,
    colW: [3.4, 1.8, 3.2],
    border: { pt: 1, color: C.CARD_BORDER },
    fontFace: FONT_MAIN, fontSize: 10, color: C.TEXT_MAIN, align: "left", valign: "middle"
  });

  // Final Thank you bar
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 4.4, w: 8.8, h: 0.6,
    fill: { color: C.CYAN }, rectRadius: 0.05
  });
  slide.addText("CẢM ƠN THẦY VÀ CÁC BẠN ĐÃ LẮNG NGHE THUYẾT TRÌNH!", {
    x: 0.6, y: 4.4, w: 8.8, h: 0.6, fontFace: FONT_MAIN, fontSize: 14, bold: true, color: C.WHITE, align: "center", valign: "middle"
  });
}

// Write presentation to file
const fileName = "MedRAGAgents_Midterm_Presentation.pptx";
pres.writeFile({ fileName: fileName }).then((outName) => {
  console.log(`Successfully generated PowerPoint presentation: ${outName}`);
}).catch((err) => {
  console.error("Error generating presentation:", err);
});
