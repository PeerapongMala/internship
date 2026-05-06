# Figma-to-Code Accuracy Guide

วิธีการ implement UI จาก Figma Design ให้ได้ผลลัพธ์ตรงที่สุด โดยใช้ Figma MCP Tools

---

## ขั้นตอนทั้งหมด

### Step 1: เก็บข้อมูล Design จาก Figma MCP (ทำครั้งเดียว)

สำหรับแต่ละ node ใน Figma ให้ดึงข้อมูล 4 ประเภท:

| # | Tool | Output File | ข้อมูลที่ได้ |
|---|------|-------------|-------------|
| 1 | `get_metadata` | `metadata.xml` | โครงสร้าง element (node IDs, ชื่อ layer, ตำแหน่ง, ขนาด) |
| 2 | `get_screenshot` | `screenshot-description.md` | ภาพ inline (Claude มองเห็นแต่ save เป็นไฟล์ไม่ได้ → เขียนเป็น text description) |
| 3 | `get_design_context` | `design-context.md` | **สำคัญที่สุด** — React+Tailwind code ที่มีค่า CSS ทั้งหมด (สี, font, spacing, border, radius) |
| 4 | `get_variable_defs` | `variables.json` | Design tokens (ตัวแปรสี, font, spacing ที่ใช้ร่วมกัน) |

**สร้าง folder structure:**
```
design/
├── node-{id}-{name}/
│   ├── metadata.xml
│   ├── screenshot-description.md
│   ├── design-context.md      ← ข้อมูล CSS หลัก
│   └── variables.json          ← design tokens
├── popup/
│   ├── popup-inventory.md
│   └── popup-{name}/
│       ├── design-context.md
│       └── variables.json
└── design-tokens.md            ← สรุป tokens ทั้งหมด
```

### Step 2: แปลง Figma Data เป็น CSS Specs

จาก `design-context.md` (React+Tailwind code) → แปลงค่า Tailwind เป็น CSS:

```
Figma (Tailwind)                    →  CSS
──────────────────────────────────────────────────
text-[13px]                         →  font-size: 13px
font-['Pridi:Medium',sans-serif]    →  font-family: 'Pridi', sans-serif; font-weight: 500
text-[#013661]                      →  color: #013661
tracking-[0.286px]                  →  letter-spacing: 0.286px
bg-[#d6e0e0]                        →  background: #d6e0e0
border-[#cbd5e1]                    →  border-color: #cbd5e1
rounded-[12px]                      →  border-radius: 12px
px-[24px] py-[16px]                 →  padding: 16px 24px
gap-[8px]                           →  gap: 8px
w-[390.5px] h-[41px]               →  width: 390.5px; height: 41px
border-2, border-3, border-5        →  border-width: 2px, 3px, 5px
```

### Step 3: สร้าง CSS Comparison Table

ก่อนเขียน CSS ให้เทียบ specs ปัจจุบัน vs Figma:

```markdown
| Element          | Current CSS           | Figma CSS               | ต้องแก้? |
|------------------|-----------------------|-------------------------|----------|
| Table header bg  | #f8f9fa               | #d6e0e0                 | ✅       |
| Table font size  | 12px                  | 13px                    | ✅       |
| Table text color | default (black)       | #013661                 | ✅       |
| Table border     | 1px solid #eee        | 1px solid #cbd5e1       | ✅       |
| Denom badge      | bg: #17a2b8           | bg: #fff5f5             | ✅       |
| Action buttons   | colored bg            | outline (border: 1px)   | ✅       |
```

### Step 4: Implement CSS ตาม Figma Specs

เขียน CSS โดยอ้างอิงค่าจาก Figma ตรงๆ:

```css
/* ❌ อย่าเดา */
.data-table thead th {
    background: #f8f9fa;  /* เดาว่าน่าจะเป็นสีเทาอ่อน */
}

/* ✅ ใช้ค่าจาก Figma */
.data-table thead th {
    background: #d6e0e0;                /* จาก get_design_context node 32:29202 */
    border: 1px solid #cbd5e1;          /* จาก design tokens: Gray-300/Separator */
    font-size: 13px;                    /* จาก Table header token */
    font-weight: 600;
    color: #212121;                     /* จาก text-neutral-primary token */
    letter-spacing: 0.3px;             /* จาก tracking value */
}
```

### Step 5: เทียบผลลัพธ์กับ Figma

หลัง implement เสร็จ ให้เช็คด้วย:

1. **เรียก `get_screenshot`** ของ node ที่ implement → Claude จะเห็นรูปและเทียบได้
2. **ให้ user screenshot** หน้าเว็บจริง → Claude เทียบกับ Figma screenshot
3. **เช็คทีละ component** ไม่ใช่ทั้งหน้า — ย่อย node เป็น sub-components เช่น:
   - Scanner section (node 32:26461)
   - Table header row (node 32:29202)
   - Table body row (node 32:29217)
   - Panel title (node 32:29199)
   - Info card
   - Action buttons

---

## Tips สำหรับความแม่นยำสูงสุด

### 1. ใช้ Sub-nodes แทน Full Page
- Full page node มักใหญ่เกินไป → `get_design_context` จะ return metadata แทน code
- **ให้แยกเป็น sub-nodes** เช่น scanner section, table row, panel header
- ใช้ `get_metadata` ดู node IDs แล้วเรียก `get_design_context` ทีละ sub-node

### 2. ดู `design-context.md` เป็นหลัก ไม่ใช่ screenshot
- Screenshot ให้ภาพรวม แต่ค่าสีอาจเพี้ยน (เพราะ compression)
- `design-context.md` มี **ค่า CSS ที่แม่นยำ** (hex colors, px values, font specs)
- ถ้า screenshot กับ design-context ขัดแย้ง → เชื่อ design-context

### 3. ใช้ Design Tokens จาก `variables.json`
- Design tokens เป็นค่ากลางที่ใช้ทั้ง project
- เช่น `text-neutral-primary: #212121`, `Gray-300/Separator: #cbd5e1`
- ใช้ tokens ทำให้ consistent ทั้งหน้า

### 4. เทียบกับ Preparation page ที่ทำเสร็จแล้ว
- Preparation page ใช้ design system เดียวกัน
- ดู CSS patterns ที่ Preparation ใช้: table header bg `#d6e0e0`, borders `#cbd5e1`, action buttons outline style
- ถ้า Reconcile ใช้ component เดียวกัน → ใช้ CSS เดียวกัน

### 5. อย่าลืม Details เล็กๆ
- `letter-spacing` — Figma กำหนดไว้ทุก text element
- `line-height` — ต่างกันตาม text role (heading vs body)
- Alternating row colors — empty rows ต้องสลับสีด้วย
- Warning row ใช้ `#F8D7DA` bg กับ `#F1AEB5` border (ไม่ใช่ generic pink)

### 6. Figma MCP Parameters ที่ควรใช้
```
get_design_context:
  clientLanguages: "html,css,javascript"
  clientFrameworks: "jquery" (หรือ framework ที่ใช้จริง)
  artifactType: "COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN" (สำหรับ sub-component)
              หรือ "WEB_PAGE_OR_APP_SCREEN" (สำหรับ full page)

get_variable_defs:
  (ไม่ต้องส่ง parameter พิเศษ — ส่ง nodeId อย่างเดียว)
```

---

## Workflow สรุป

```
1. get_metadata(node)     → รู้โครงสร้าง + sub-node IDs
2. get_screenshot(node)   → ดูภาพรวม
3. get_design_context(sub-node) × N → ได้ CSS specs ละเอียด
4. get_variable_defs(node) → ได้ design tokens
5. แปลง Tailwind → CSS
6. สร้าง comparison table (current vs Figma)
7. Implement CSS ตาม Figma
8. เทียบผลกับ get_screenshot
9. Fix discrepancies
```

---

## ตัวอย่างการดึง CSS จาก Figma design-context

**Input (จาก get_design_context):**
```jsx
<div className="bg-[#d6e0e0] border-b border-[#cbd5e1] px-[8px] py-[8px]">
  <p className="font-['Pridi:Medium',sans-serif] text-[13px] text-[#212121] tracking-[0.299px]">
    Header Card
  </p>
</div>
```

**Output (CSS ที่ต้องเขียน):**
```css
.data-table thead th {
    background: #d6e0e0;
    border-bottom: 1px solid #cbd5e1;
    padding: 8px;
    font-family: 'Pridi', sans-serif;
    font-weight: 500;        /* Medium = 500 */
    font-size: 13px;
    color: #212121;
    letter-spacing: 0.299px;
}
```
