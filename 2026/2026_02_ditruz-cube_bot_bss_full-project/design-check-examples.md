# Design Check — Examples & Templates

ตัวอย่างและ templates สำหรับ [design-check-instructions.md](./design-check-instructions.md)

---

## 1. Tailwind → CSS Mapping

Figma MCP return Tailwind classes → ต้องแปลงเป็น CSS:

| Tailwind | CSS |
|----------|-----|
| `text-sm` | `font-size: 14px` |
| `text-xs` | `font-size: 12px` |
| `text-base` | `font-size: 16px` |
| `font-medium` | `font-weight: 500` |
| `font-semibold` | `font-weight: 600` |
| `font-bold` | `font-weight: 700` |
| `leading-tight` | `line-height: 1.25` |
| `leading-normal` | `line-height: 1.5` |
| `tracking-wide` | `letter-spacing: 0.025em` |
| `rounded-sm` | `border-radius: 2px` |
| `rounded` | `border-radius: 4px` |
| `rounded-md` | `border-radius: 6px` |
| `rounded-lg` | `border-radius: 8px` |
| `gap-1` | `gap: 4px` |
| `gap-2` | `gap: 8px` |
| `gap-3` | `gap: 12px` |
| `p-1` / `px-1` / `py-1` | `padding: 4px` / `padding-left/right: 4px` / `padding-top/bottom: 4px` |
| `p-2` / `px-2` / `py-2` | `padding: 8px` / ... |
| `p-3` / `px-3` / `py-3` | `padding: 12px` / ... |
| `border` | `border: 1px solid` |
| `border-slate-200` | `border-color: #e2e8f0` |
| `bg-white` | `background: #ffffff` |
| `text-[#XXXXXX]` | `color: #XXXXXX` |

**หมายเหตุ**: Tailwind spacing unit = 4px (1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px)

---

## 2. Figma MCP Subagent Prompts

### ดึง spec เฉพาะ node:
```
Task(subagent_type="general-purpose", prompt="""
Use get_design_context on node 32:26438 and return:
- Layout (flex/grid, direction, gap, padding)
- Colors (hex values for bg, text, border)
- Typography (font-family, size, weight, line-height, letter-spacing)
- Spacing (margin, padding, gap between elements)
- Border (width, color, radius)
""")
```

### ดึง screenshot เทียบหลัง implement:
```
Task(subagent_type="general-purpose", prompt="""
Use get_screenshot on node 32:25438 and describe what you see:
- Overall layout structure
- Key visual elements and their positions
- Colors and typography visible
""")
```

### ดึง design variables:
```
Task(subagent_type="general-purpose", prompt="""
Use get_variable_defs on node 2:36001 and return a summary table of:
- Color tokens (name → hex value → usage)
- Typography tokens (name → font/size/weight)
- Spacing tokens (name → value)
""")
```

---

## 3. design-tokens.md Template

```markdown
# Design Tokens — [Page Name]

Extracted from Figma MCP `get_variable_defs` (node X:XXXXX)

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#003366` | Primary accent |
| Body Text | `#212529` | Body text color |
| Danger | `#DC3545` | Danger buttons/alerts |

## Typography

| Token | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| Heading | Pridi Medium | 16px | 500 | 1.2 | 2.5px |
| Table header | Pridi Medium | 13px | 500 | 100% | 2.3px |
| Table body | Pridi Regular | 13px | 400 | 100% | 2.2px |

## Spacing

| Token | Value |
|-------|-------|
| s-xxxsm | 4px |
| s-xsm | 8px |
| s-sm | 12px |
| s-md | 16px |

## Border Radius

| Token | Value |
|-------|-------|
| r-sm | 12px |
```

---

## 4. figma-specs.css Format

```css
/* ==========================================================
 * Figma Design Specs — [Page Name]
 * Source: Figma MCP get_design_context
 * Generated: [date]
 *
 * ★ ไฟล์นี้เป็น REFERENCE เท่านั้น — ห้าม link เป็น stylesheet
 * ★ ใช้เป็นต้นฉบับ copy ค่าไปใส่ใน production CSS
 * ★ font-family: 'Pridi' จาก Figma → ต้อง map เป็น 'bss-pridi' ตอน implement
 * ========================================================== */


/* --- Section: Title Bar (Node XX:XXXXX) --- */

.main-title h1 {
    font-family: 'Pridi', sans-serif;   /* → implement เป็น 'bss-pridi' */
    font-weight: 600;
    font-size: 30px;
    color: #212121;
}


/* --- Section: Table Header (Node XX:XXXXX) --- */

.data-table thead th {
    font-family: 'Pridi', sans-serif;   /* → implement เป็น 'bss-pridi' */
    font-weight: 500;
    font-size: 13px;
    color: #013661;
    background: #E2E8F0;
}
```

กฎ:
- ทุก section ใส่ comment `/* --- Section: [ชื่อ] (Node XX:XXXXX) --- */`
- `font-family: 'Pridi'` ต้องมี comment `/* → implement เป็น 'bss-pridi' */`
- Header comment ชัดว่าเป็น reference file

---

## 5. Specificity Calculation

| Selector | Specificity | ชนะ? |
|----------|-------------|-------|
| `button` | 0-0-1 | |
| `.btn-action` | 0-1-0 | ชนะ `button` |
| `.data-table .btn-action` | 0-2-0 | ชนะ `.btn-action` |
| `.data-table tbody td` | 0-1-2 | |
| `#myTable .btn-action` | 1-1-0 | ชนะเกือบทุกอย่าง |
| `!important` | ชนะ specificity ปกติ | ถ้า specificity เท่ากัน ตัวหลังชนะ |

**กฎ**: specificity เท่ากัน + `!important` เท่ากัน → declaration ที่มาทีหลัง (ล่างกว่าใน CSS) ชนะ

---

## 6. Issue Handling Workflow

```
User แจ้ง: "icon ถูกบีบ, สีผิด, font ไม่ตรง"
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
TaskCreate      TaskCreate      TaskCreate
"Fix icon"      "Fix color"     "Fix font"
    │               │               │
    ▼               ▼               ▼
Subagent 1      Subagent 2      Subagent 3     ← parallel research
(Figma spec     (Figma spec     (Figma spec
 + CSS scan)     + CSS scan)     + CSS scan)
    │               │               │
    └───────────────┼───────────────┘
                    ▼
            Implement fixes              ← sequential in main context
            (Edit file 1, Edit file 2)
                    │
                    ▼
            Verify subagent              ← get_screenshot เทียบ
```

**ห้าม parallel implementation** เมื่อแก้ไฟล์เดียวกัน

---

## 7. Common CSS Override Patterns

### ชนะ Style.css `button { height: 40px !important }`:
```css
/* ใช้ class selector (0-1-0) > element selector (0-0-1) + !important */
.my-btn {
    height: 32px !important;
}
```

### ชนะ all.css `.btn-action { width: 28px !important }`:
```css
/* ใช้ 2-class selector (0-2-0) > 1-class (0-1-0) + !important */
.data-table .btn-action {
    width: 24px !important;
    height: 24px !important;
}
```

### ชนะ Style.css `* { font-weight: normal !important }`:
```css
/* * selector = (0-0-0), class selector (0-1-0) ชนะเสมอ */
.panel-title {
    font-family: 'bss-pridi', sans-serif !important;
    font-weight: 500 !important;
}
```

---

## 8. SVG in Table — Correct Pattern

```html
<!-- ถูก: <img> + data URI -->
<td>
    <div class="td-hc-wrap">
        <span class="td-hc-text">Header Card Text</span>
        <img src="data:image/svg+xml,%3Csvg xmlns='...'..."
             width="14" height="14" alt="alert">
    </div>
</td>

<!-- ผิด: inline <svg> จะถูกบีบจาก table-layout:fixed -->
<td>
    <svg width="14" height="14">...</svg>
    Header Card Text
</td>
```

CSS สำหรับ wrapper:
```css
.td-hc-wrap {
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%;
}
.td-hc-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
}
.td-hc-wrap img {
    flex-shrink: 0;
    width: 14px !important;
    height: 14px !important;
    padding: 0 !important;
    box-sizing: content-box !important;
}
```
