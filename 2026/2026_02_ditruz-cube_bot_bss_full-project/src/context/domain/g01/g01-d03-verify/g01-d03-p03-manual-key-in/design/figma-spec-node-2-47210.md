# Figma Design Spec -- Node 2:47210 (Edit & Manual Key-in Unsort CC)

Extracted from Figma MCP on 2026-02-20.

---

## 1. Overall Layout

- **Page size**: 1440 x 900 px
- **Structure** (top to bottom):
  1. Navigation Header (40px tall)
  2. Page Title Bar (62px tall)
  3. Header Card Row (48px tall)
  4. Content Area (form left + info panel right) -- 300px tall
  5. Results Table -- 370px+ tall
  6. Footer Bar (64px tall)

---

## 2. Design Tokens (from get_variable_defs)

### Colors
| Token | Value |
|-------|-------|
| Primary | #003366 |
| Gray/White | #FFFFFF |
| Gray/400 | #CED4DA |
| Gray/600 | #6C757D |
| Gray/800 | #343A40 |
| Gray-300 | #cbd5e1 |
| Slate/50 | #f8fafc |
| Body Text/Body Color | #212529 |
| Texts/text-neutral-primary | #212121 |
| Texts/text-warning-primary | #b45309 |
| Theme/Body Background | #FFFFFF |
| Theme/Border | #DEE2E6 |
| Theme/Success | #198754 |
| Components/Input/Focus Border | #86B7FE |
| Icons/icon-black | #000000 |
| Separators/separator-opaque | #cbd5e1 |
| Strokes/stroke-neutral-primary | #cbd5e1 |

### Focus Ring
- `box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.25)` (#0D6EFD40)

### Spacing
| Token | Value |
|-------|-------|
| s-zero | 0 |
| s-xxxxsm | 2px |
| s-xxxsm | 4px |
| s-xsm | 8px |
| s-sm | 12px |
| s-md | 16px |
| s-lg | 24px |

### Border Radius
| Token | Value |
|-------|-------|
| r-sm | 12px |
| r-md | 16px |

### Font Definitions
| Token | Family | Weight | Size | Line Height | Letter Spacing |
|-------|--------|--------|------|-------------|----------------|
| Heading/H5 | Pridi | 500 (Medium) | 20px | 1.2 | 2.5px |
| Heading/H6 | Pridi | 500 (Medium) | 16px | 1.2 | 2.5px |
| Title 1 | Pridi | 500 (Medium) | 16px | 100% | 2.2px |
| Body/Regular | Pridi | 400 (Regular) | 16px | 1.5 | 2.5px |
| Body/Small | Pridi | 400 (Regular) | 14px | 1.5 | 2.5px |
| Body/Lead | Pridi | 300 (Light) | 20px | 1.5 | 2.5px |
| Body | Pridi | 400 (Regular) | 14px | 100% | 2.2px |
| Form Label | Pridi | 400 (Regular) | 13px | 100% | 2.5px |
| Form Label 2 | Pridi | 400 (Regular) | 14px | 100% | 2.5px |
| Form Value 2 | Pridi | 600 (SemiBold) | 16px | 100% | 2.5px |
| Table header | Pridi | 500 (Medium) | 13px | 100% | 2.3px |
| Font Size/text-md-base | 13px | | | | |
| Font Size/text-xs | 11px | | | | |

---

## 3. Navigation Header (node 2:47219)

- **Height**: 40px
- **Background**: #f2b091 (salmon/peach color)
- **Contains**: Logo, menu items, user profile

---

## 4. Page Title Bar (node 2:47442)

- **Height**: 62px
- **Padding**: 0 16px
- **Title text**: "Edit & Manual Key-in Unsort CC"
  - font-family: Pridi
  - font-weight: 600 (SemiBold)
  - font-size: 30px
  - line-height: 1.2
  - color: #212121
  - letter-spacing: 0.675px

---

## 5. Header Card Row (node 2:47489)

- **Height**: 48px (32px inner)
- **Padding**: 8px 24px
- **Layout**: flex, space-between, align-center

### "Header Card:" label
- font-family: Pridi
- font-weight: 400 (Regular)
- font-size: 20px
- line-height: 1.5
- color: #212121
- letter-spacing: 0.5px

### Header Card Badge (node 2:47492)
- **Width**: 152px
- **Background**: #E4E6E9
- **Border-radius**: 8px
- **Padding**: 4px 12px
- **Text** ("0054941520"):
  - font-family: Pridi
  - font-weight: 700 (Bold)
  - font-size: 20px
  - line-height: 1.2
  - color: #212121
  - letter-spacing: 0.5px

### "Date:" text
- Same as "Header Card:" label (Pridi Regular 20px #212121)

---

## 6. Form Section (left side, node 2:47504)

- **Width**: 998px (of 1408px content area)
- **Padding**: 16px 24px
- **Height**: 300px

### Section Title ("เพิ่มผลการนับคัดธนบัตร")
- font-family: Pridi
- font-weight: 500 (Medium)
- font-size: (uses label token -- visible as section heading)

### Form Labels ("ประเภทธนบัตร", "ชนิดราคา", "แบบ", "จำนวน")
- font-family: Pridi
- font-weight: 400 (Regular)
- font-size: 13px (Form Label token) for smaller labels; 22px height text
- color: #212529
- letter-spacing: 2.5px

### Radio Buttons (node 2:47513)
- **Radio group container**: flex row, gap: 0 (items packed side by side)
- **Each radio item**:
  - padding: 4px 8px
  - border-radius: 8px
  - **Selected state background**: rgba(0,0,0,0.05) -- light gray tint
- **Radio circle (outer)**: 16x16px, border: 1px solid #003366, background: #003366 (when selected)
- **Radio circle (inner dot)**: 8x8px, background: #FFFFFF, centered
- **Radio label text**:
  - font-family: Pridi
  - font-weight: 400 (Regular)
  - font-size: 16px
  - line-height: 1.5
  - color: #212529
  - letter-spacing: 0.4px

### Money Type Badge (radio for denominations)
- **Size**: 47 x 24px
- **Background**: #FBF8F4
- **Border**: 2px solid #9F7D57
- **Text** (denomination number e.g. "1000"):
  - font-family: Pridi
  - font-weight: 700 (Bold)
  - font-size: 13px
  - color: #4F3E2B
  - letter-spacing: 0.325px
  - text-align: center

### Select Dropdown (node 2:47563)
- **Height**: 48px
- **Background**: #FFFFFF
- **Border**: 1px solid #CED4DA
- **Border-radius**: 8px
- **Padding**: 9px 13px (right) / 9px 17px (left)
- **Placeholder/value text**:
  - font-family: Pridi
  - font-weight: 300 (Light)
  - font-size: 20px
  - color: #6C757D (placeholder) / #343A40 (value)
  - letter-spacing: 0.5px
- **Chevron icon**: 16px, dropdown arrow SVG

### Input Field
- Same styling as Select (48px height, 1px border #CED4DA, border-radius 8px)

### "บันทึกผลนับคัด" Button (node 2:47570)
- **Width**: 300px
- **Height**: 46px
- **Background**: #198754 (success green)
- **Border-radius**: 8px
- **Padding**: 8px 16px
- **Text**:
  - font-family: Pridi
  - font-weight: 500 (Medium)
  - font-size: 20px
  - line-height: 1.5
  - color: #FFFFFF
  - letter-spacing: 0.5px

---

## 7. Info Panel (right side, node 2:47571/2:47572)

- **Width**: 400px
- **Padding**: 12px 16px
- **Layout**: flex column, gap 4px between rows

### Each info row
- **Layout**: flex, space-between
- **Padding**: 0 4px per row
- **Row height**: 24px

### Info text (labels and values)
- font-family: Pridi
- font-weight: 400 (Regular)
- font-size: 16px
- line-height: 1.5
- color: #212121
- letter-spacing: 0.4px
- Labels left-aligned, values right-aligned

### Info rows content:
- บาร์โค้ดรายห่อ / บาร์โค้ดรายมัด / ธนาคาร / Cashpoint
- วันเวลาเตรียม / วันเวลานับคัด (date/time subsection)
- Prepare / Sorter / Reconcile / Supervisor ที่มีไว้ (names subsection)

---

## 8. Results Table (node 2:47621)

### Table Summary Header (node 2:47622)
- **Height**: 45px
- **Padding**: 8px 16px
- **Border-bottom**: 1px solid #cbd5e1
- **Title** ("แสดงผลการนับคัด"):
  - font-family: Pridi
  - font-weight: 500 (Medium)
  - font-size: 16px
  - line-height: 1.2
  - color: #212121
  - letter-spacing: 0.4px
- **Count labels** ("จำนวนก่อน:", "จำนวนหลัง:"):
  - font-family: Pridi
  - font-weight: 400 (Regular)
  - font-size: 14px
  - color: #212121
  - letter-spacing: 0.308px
- **Count values** (999, 0):
  - font-family: Pridi
  - font-weight: 700 (Bold) for "จำนวนหลัง" value
  - font-size: 14px
  - color: #b45309 (warning amber)

### Column Headers (node 2:47633)
- **Height**: 30px
- **Background**: #D6E0E0 (muted teal-gray)
- **Border-bottom**: 1px solid #cbd5e1
- **Padding**: 0 8px per cell
- **Column header text**:
  - font-family: Pridi
  - font-weight: 500 (Medium)
  - font-size: 13px
  - color: #212121
  - letter-spacing: 0.299px
- **Sort icon**: 12x12px SVG

### Columns:
| Column | Alignment |
|--------|-----------|
| ชนิดราคา | center |
| ประเภท | center |
| แบบ | center |
| ก่อนปรับ (ฉบับ) | right |
| หลังปรับ (ฉบับ) | right |
| Action | center |

### Table Row (node 2:47657 -- selected/highlighted row)
- **Height**: 38px
- **Background**: #D1E5FA (light blue highlight)
- **Border**: 2px solid #297ED4 (blue border for selected)
- **Padding**: 0 8px

### Table Row (normal/unselected)
- **Height**: 38px
- **Background**: #FFFFFF (white)
- **Border**: none or 1px border bottom

### Table Cell Text
- font-family: Pridi
- font-weight: 400 (Regular)
- font-size: 12px (for ประเภท, แบบ columns) / 14px (for ก่อนปรับ values)
- color: #212529
- letter-spacing: 0.3px
- Numeric columns: text-align right
- Text columns: text-align center

### Empty rows
- **Height**: 34px each

### Action Buttons (Edit / Delete)
- **Size**: 26 x 26px each
- **Background**: transparent (rgba(255,255,255,0))
- **Border**: 1px solid #000000 (black)
- **Border-radius**: 4px
- **Padding**: 5px 9px
- **Gap between buttons**: 10px
- **Icons**: 16x16px SVG
  - Edit icon: pencil-fill SVG
  - Delete icon: trash3-fill SVG

---

## 9. Footer Bar (node 2:47842)

- **Height**: 64px
- **Padding**: 8px 16px

### "บันทึกข้อมูล" Button (node 2:47844)
- **Width**: 229px
- **Height**: 48px
- **Background**: #003366 (navy/primary)
- **Border**: 1px solid #003366
- **Border-radius**: 8px
- **Padding**: 9px 17px
- **Alignment**: right side of footer
- **Text**:
  - font-family: Pridi
  - font-weight: 500 (Medium)
  - font-size: 20px
  - line-height: 1.5
  - color: #FFFFFF
  - letter-spacing: 0.5px

---

## 10. Background Layer

- **Base background**: off-white/light
- **Foreground gradient** (top half, 450px):
  - Unsort CC variant: `linear-gradient(98.93deg, #f5a986 0.74%, #f8d4ba 100%)`
  - With decorative watermark images (opacity overlay)
- **Nav header background**: #f2b091
