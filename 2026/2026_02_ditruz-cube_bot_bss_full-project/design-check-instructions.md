# Design Check Instructions — Figma to Implementation

กฎสำหรับ AI implement UI ตาม Figma design ให้ตรง
ตัวอย่าง/templates อยู่ใน [design-check-examples.md](./design-check-examples.md)

---

## 1. PRE-IMPLEMENTATION

### 1.1 Scan Global CSS ก่อนเขียน CSS ทุกครั้ง

Grep selector ที่เกี่ยวข้องในไฟล์เหล่านี้ก่อน:
- `project/frontend/BSS_WEB/wwwroot/css/master/all.css` — global overrides
- `project/frontend/BSS_WEB/wwwroot/css/Style.css` — page-level overrides

**Known Critical Overrides:**

| Selector | Rule | Impact |
|----------|------|--------|
| `button` (Style.css) | `height: 40px !important` | ทุก `<button>` ถูกบังคับ 40px |
| `.btn-action` (all.css) | `width/height: 28px !important` | Action buttons ถูกล็อคขนาด |
| `.btn-action i` (all.css) | `font-size: 18px !important` | Icons ถูกล็อค |
| `.qty-badge` (all.css) | `background-image !important; width: 55px; height: 28px` | Badge ต้องใช้ pattern |

**เอาชนะ override**: ใช้ higher specificity + `!important` เช่น `.data-table .btn-action` (0-2-0) ชนะ `.btn-action` (0-1-0)

### 1.2 ดึง Figma Spec — ห้ามเดา CSS

ลำดับ: `get_screenshot` → `get_variable_defs` → `get_design_context` (ผ่าน subagent เสมอ)
Figma MCP return Tailwind → ต้องแปลงเป็น CSS (ดูตาราง Tailwind mapping ใน examples)

**ห้ามเดา**: "ตัวหนา" อาจ = `font-weight: 500` ไม่ใช่ 700 เสมอ → เช็ค Figma

### 1.3 Figma Node ใหญ่ → ถาม User ก่อน (Deep Analysis ปิดชั่วคราว)

- ห้าม auto-call `get_metadata` → แตก subagent ซ้อนหลายรอบ
- ถาม user ว่าจะดึง spec node ไหน → ดึงเฉพาะที่จำเป็น
- เช็ค design/ folder ก่อนเรียก MCP ซ้ำ

---

## 2. IMPLEMENTATION

### DO:
- **SVG ใน table**: ใช้ `<img>` + data URI เท่านั้น — ห้าม inline `<svg>` (จะถูกบีบจาก `table-layout: fixed`)
- **SVG/icon**: Glob หาไฟล์ที่ user ดึงจาก Figma มาก่อน → ใช้ Bootstrap Icons ถ้าไม่มี → สร้างเองเป็นทางเลือกสุดท้าย
- **Denomination badge**: ใช้ `qty-badge qty-{price}` class จาก all.css — ห้ามเขียน badge CSS เอง
- **Font**: Figma บอก `'Pridi'` → implement เป็น `'bss-pridi'` เสมอ (ตาม @font-face ในโปรเจค)

### DON'T:
- ใส่ border ซ้อน 2 ชั้น (wrapper + input) — เลือกชั้นเดียว
- เดาค่า width/padding — คำนวณจาก Figma spec (icon 14px + gap 2px = +16px)
- ถ้าไม่แน่ใจค่า → ให้ user เลือกจาก 2-3 ทางเลือก แทนลองทีละค่า

---

## 3. DEBUGGING

### กฎ 2 รอบ
CSS ไม่ work หลัง 2 รอบ → **หยุด เปลี่ยนแนวทาง** ห้ามวน specificity war

| ปัญหา | เปลี่ยนเป็น |
|-------|------------|
| padding ไม่ได้ผล | ใช้ spacer/empty column |
| element selector override | เปลี่ยน HTML element |
| inline SVG ถูกบีบ | ใช้ `<img>` + data URI |
| font-weight ไม่ตรง | เช็ค Figma spec |

### Browser Cache
User บอก "ยังไม่หาย" + grep ไม่เจอ = browser cache → แนะนำ hard refresh ทันที

---

## 4. POST-IMPLEMENTATION

### Checklist ก่อนบอก user ว่าเสร็จ:
- [ ] Colors/Font/Spacing ตรง Figma tokens
- [ ] Icons ไม่ถูกบีบ, ขนาดตรง
- [ ] ไม่มี double border
- [ ] ไม่มี global override ที่ทับค่า
- [ ] เรียก `get_screenshot` เทียบหน้าจริง (ผ่าน subagent)

### บันทึก Design Docs:
- อัพเดท `design/design-tokens.md` ด้วย tokens ที่ใช้
- อัพเดท `design/figma-specs.css` ด้วย CSS specs ใหม่
- อัพเดท `design/README.md` ด้วย node IDs

---

## 5. FIGMA MCP

### กฎเด็ดขาด:
- **ห้ามเรียกจาก main context** → สร้าง Task subagent เสมอ
- Subagent ต้อง return **สรุป** (colors hex, fonts, spacing) ไม่ใช่ raw data
- Node เดียว → รวม calls ใน 1 subagent
- หลาย nodes → ปล่อย subagent แยก parallel
- **บันทึกทุกครั้ง** ที่ได้ข้อมูล node ใหม่ → `design/node-{id}-{name}/` ก่อน implement (rate limit = safety net)

---

## 6. DESIGN DOCS

### โครงสร้าง design/ folder:
```
design/
├── README.md           # node IDs ทั้งหมด
├── design-tokens.md    # colors, fonts, spacing, borders, icons
├── figma-specs.css     # ★ CSS จาก Figma — ไฟล์ .css จริง ใช้ copy ได้เลย
├── node-XXXXX/         # folder ต่อ node (design-context.md, notes.md)
└── session-issues-*.md
```

### figma-specs.css
- บันทึกเป็น **ไฟล์ .css จริง** ไม่ใช่ code block ใน markdown → IDE syntax highlight + copy ตรงได้
- ทุก section ใส่ comment `/* --- Section: [ชื่อ] (Node XX:XXXXX) --- */`
- Header comment ชัดว่าเป็น **reference file** ห้าม link เป็น stylesheet
- `font-family: 'Pridi'` → ใส่ comment `/* → implement เป็น 'bss-pridi' */`

---

## 7. ISSUE HANDLING

### User แจ้ง issues หลายจุด:
1. วิเคราะห์ แยก tasks อิสระ → TaskCreate แต่ละจุด
2. ปล่อย research subagents **parallel** (Figma spec + CSS scan)
3. รอผล → แก้ code ใน main context (sequential ถ้าไฟล์เดียวกัน)
4. Verify ด้วย Figma screenshot subagent

### ห้าม parallel เมื่อ:
- Issues depend กัน (แก้ HTML ก่อน → แล้วค่อย CSS)
- แก้ไฟล์เดียวกัน
- Implementation step (Edit ต้องทำใน main context)

---

## 8. COMMUNICATION

- **Component กำกวม** (dropdown, ปุ่ม, ตาราง) → ถามว่า "หมายถึงตรงไหน?" ก่อนลงมือ
- **ปัญหาอยู่ที่ DB/data** ไม่ใช่ UI → บอก user ทันที ก่อนแก้ code
- **คำนวณก่อนเดา** → ให้ user เลือก 2-3 ค่าถ้าไม่แน่ใจ
- **Figma spec ได้มา → บันทึกทันที** ก่อน implement (rate limit safety net)

---

## QUICK REFERENCE

```
เขียน CSS?
├── scan all.css + Style.css → จด overrides
├── ดึง Figma spec (subagent) → ห้ามเดา
└── specificity > global override + !important

Figma node IDs มา?
├── ถาม user จะดึง node ไหน (ห้าม auto-discover)
├── บันทึก design/ ทุกครั้ง
└── เช็ค design/ ก่อนเรียก MCP ซ้ำ

CSS ไม่ work?
├── 2 รอบ → เปลี่ยนแนวทาง
└── "ยังไม่หาย" + grep ไม่เจอ → browser cache

Issues หลายจุด?
├── research subagents parallel → แก้ code sequential
└── verify ด้วย Figma screenshot

SVG?
├── Glob หา SVG ที่มี → ใช้ Bootstrap Icons → สร้างเอง
└── ใน table → <img> + data URI เท่านั้น

กำกวม?
├── ถามก่อนแก้ (component ไหน?)
├── DB/data → บอกทันที
└── ไม่แน่ใจค่า → ให้เลือก 2-3 ทางเลือก
```
