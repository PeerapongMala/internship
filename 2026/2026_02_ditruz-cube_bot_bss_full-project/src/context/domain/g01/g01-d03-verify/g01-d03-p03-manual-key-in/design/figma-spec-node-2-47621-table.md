# Figma Design Spec -- Node 2:47621 (Results Table)

Extracted from Figma MCP on 2026-02-20 via `get_screenshot`, `get_design_context`, and `get_variable_defs`.

---

## 1. Table Container (node 2:47621)

- **Background**: #FFFFFF (white)
- **Border**: 1px solid #cbd5e1 (var: --separators/separator-opaque)
- **Border-radius**: 12px (var: --rounded/r-sm)
- **Overflow**: clip
- **Layout**: flex column, items-center
- **Padding-bottom**: 0
- **Width**: 100% (fills parent)

---

## 2. Table Summary Header Bar (node 2:47622)

- **Min-height**: 45px
- **Padding**: 8px 16px (py-8 px-16)
- **Border-bottom**: 1px solid #cbd5e1
- **Layout**: flex row, gap 16px, align-center

### Left side -- Title
- **Text**: "แสดงผลการนับคัด"
- **Font**: Pridi Medium (weight 500)
- **Size**: 16px
- **Line-height**: 1.2
- **Color**: #212121 (var: --texts/text-neutral-primary)
- **Letter-spacing**: 0.4px
- **Flex**: 1 (takes remaining space)

### Right side -- Count labels
Two count groups arranged horizontally:

#### "จำนวนก่อน:" group (node 2:47625)
- **Width**: 288px
- **Layout**: flex, gap 8px, align-center, justify-center
- **Label** "จำนวนก่อน:": Pridi Regular 14px, color #212121, letter-spacing 0.308px
- **Value** "999": Pridi Regular 14px, color #b45309 (warning amber), letter-spacing 0.308px
- **Unit** "ฉบับ": Pridi Regular 14px, color #212121

#### "จำนวนหลัง:" group (node 2:47629)
- **Width**: 362px
- **Layout**: flex, gap 8px, align-center (NOT centered -- left-aligned)
- **Label** "จำนวนหลัง:": Pridi Regular 14px, color #212121, letter-spacing 0.308px
- **Value** "0": Pridi **Bold** (weight 700) 14px, color #b45309 (warning amber)
- **Unit** "ฉบับ": Pridi Regular 14px, color #212121

---

## 3. Column Header Row (node 2:47633)

- **Height**: 30px (fixed)
- **Background**: #D6E0E0 (muted teal-gray)
- **Border-bottom**: 1px solid #cbd5e1
- **Padding**: 0 8px (container-level px)
- **Layout**: flex row

### Column Header Text Style (all columns)
- **Font**: Pridi Medium (weight 500)
- **Size**: 13px
- **Line-height**: normal (100%)
- **Color**: #212121 (var: --texts/text-neutral-primary)
- **Letter-spacing**: 0.299px

### Sort Icon (present in all columns except Action)
- **Size**: 12x12px
- **Background**: transparent (rgba(255,255,255,0))
- **Gap from text**: 2px (var: --space/s-xxxxsm)
- **Content**: Up/down arrow SVG

### Column Definitions

| # | Column Name | Header Text | Width | Header Alignment | Cell Alignment | Sort Icon |
|---|-------------|-------------|-------|------------------|----------------|-----------|
| 1 | ชนิดราคา | "ชนิดราคา" | flex: 1 | center | center | Yes |
| 2 | ประเภท | "ประเภท" | flex: 1 | center | center | Yes |
| 3 | แบบ | "แบบ" | flex: 1 | center | center | Yes |
| 4 | ก่อนปรับ (ฉบับ) | "ก่อนปรับ (ฉบับ)" | **fixed 241px** | **right (justify-end)** | **right** | Yes |
| 5 | หลังปรับ (ฉบับ) | "หลังปรับ (ฉบับ)" | flex: 1 | **right (justify-end)** | **right** | Yes |
| 6 | Action | "Action" | flex: 1 | center | center | **No** |

### Important Notes on Columns:
- Columns 1, 2, 3, 5, 6 use `flex: 1 0 0` (equal flex distribution)
- Column 4 ("ก่อนปรับ") is the ONLY fixed-width column at **241px** (uses `shrink-0 w-[241px]`)
- Each header cell has padding: 8px all sides
- Header cells use gap: 2px between text and sort icon

---

## 4. Table Rows

### Row Layout (all rows)
- **Width**: 100%
- **Padding**: 0 8px (container px, var: --space/s-xsm)
- **Layout**: flex column > inner flex row
- **Cells**: each cell is a flex wrapper matching the header column structure

### Row Types

#### A. Selected/Highlighted Row (node 2:47657)
- **Background**: #D1E5FA (light blue)
- **Border**: 2px solid #297ED4 (blue highlight border)
- **Padding**: 0 8px

#### B. Normal Row - Odd (node 2:47748, white bg)
- **Background**: #FFFFFF (white) -- no explicit bg set
- **Border-bottom**: 1px solid #cbd5e1 (var: --strokes/stroke-neutral-primary)

#### C. Normal Row - Even (node 2:47734, striped)
- **Background**: #F2F6F6 (very light gray-green)
- **Border-bottom**: 1px solid #cbd5e1

#### D. Empty Row
- **Height**: 34px (fixed)
- **Background**: alternating #FFFFFF / #F2F6F6
- **Border-bottom**: 1px solid #cbd5e1
- No content

---

## 5. Cell Content Styling

### Cell Container (all cells)
- **Padding**: 6px 8px (py-6 px-8)
- **Layout**: flex, align-center

### Column 1: ชนิดราคา (Denomination Badge)
- **Alignment**: center (justify-center)
- **Content**: MoneyType badge component
- **Badge size**: 47px x 24px
- **Badge background**: #FBF8F4
- **Badge border**: 2px solid #9F7D57
- **Badge overflow**: clip
- **Badge text** (e.g. "1000"):
  - Font: Pridi Bold (weight 700)
  - Size: 13px
  - Color: #4F3E2B
  - Letter-spacing: 0.325px
  - Text-align: center
- **Decorative image**: watermark pattern, mix-blend-mode: color-burn, opacity: 0.30

### Column 2: ประเภท (Type)
- **Alignment**: center (text-center)
- **Font**: Pridi Regular (weight 400)
- **Size**: 12px
- **Line-height**: 13px
- **Color**: #212529
- **Letter-spacing**: 0.3px
- **Overflow**: hidden, text-ellipsis

### Column 3: แบบ (Format)
- **Alignment**: center (text-center)
- **Font**: Pridi Regular (weight 400)
- **Size**: 12px
- **Line-height**: 13px
- **Color**: #212529
- **Letter-spacing**: 0.3px
- **Overflow**: hidden, text-ellipsis

### Column 4: ก่อนปรับ (ฉบับ) -- Before Adjustment
- **Alignment**: **RIGHT** (text-right)
- **Font**: Pridi Regular (weight 400)
- **Size**: 14px
- **Line-height**: 1.5
- **Color**: #212529
- **Letter-spacing**: 0.35px
- **Text width**: 195px (explicit)
- **Padding**: left 8px, right 36px (extra right padding for spacing from edge)
- **Overflow**: hidden, text-ellipsis

### Column 5: หลังปรับ (ฉบับ) -- After Adjustment
- **Content**: Empty in screenshot (no values yet)
- **Expected alignment**: right (matching header justify-end)
- **Expected styling**: same as Column 4

### Column 6: Action
- **Alignment**: center (justify-center)
- **Layout**: flex, gap 10px
- **Content**: Edit button + Delete button

---

## 6. Action Buttons

### Button Container
- **Layout**: flex, gap 10px, justify-center, align-center
- **Cell padding**: 6px 8px

### Each Button (Edit & Delete)
- **Size**: 26px x 26px
- **Background**: transparent (rgba(255,255,255,0))
- **Border**: 1px solid #000000 (var: --icons/icon-black)
- **Border-radius**: 4px
- **Padding**: 5px 9px
- **Overflow**: clip

### Edit Button Icon (pencil-fill)
- **Size**: 16px x 16px
- **Type**: SVG (pencil-fill from Bootstrap Icons)

### Delete Button Icon (trash3-fill)
- **Size**: 16px x 16px
- **Type**: SVG (trash3-fill from Bootstrap Icons)
- **Inner icon**: Subtract path shape, inset 0 6.25%

---

## 7. Design Variables / CSS Tokens Used

```css
/* Colors */
--texts-text-neutral-primary: #212121;
--texts-text-warning-primary: #b45309;
--icons-icon-black: #000000;
--gray-300: #cbd5e1;
--strokes-stroke-neutral-primary: #cbd5e1;
--separators-separator-opaque: #cbd5e1;

/* Spacing */
--space-s-zero: 0;
--space-s-xxxxsm: 2px;
--space-s-xsm: 8px;
--space-s-md: 16px;

/* Border Radius */
--rounded-r-sm: 12px;

/* Font Stacks */
/* All text uses font-family: 'bss-pridi' (mapped from Figma 'Pridi') */
```

---

## 8. Font Mapping (Figma to Implementation)

| Context | Figma Token | family | weight | size | line-height | letter-spacing |
|---------|-------------|--------|--------|------|-------------|----------------|
| Header title | Heading/H6 | Pridi -> bss-pridi | 500 (Medium) | 16px | 1.2 | 0.4px |
| Count labels | Body | Pridi -> bss-pridi | 400 (Regular) | 14px | normal | 0.308px |
| Count values (before) | Body | Pridi -> bss-pridi | 400 (Regular) | 14px | normal | 0.308px |
| Count values (after) | - | Pridi -> bss-pridi | 700 (Bold) | 14px | normal | 0.308px |
| Column headers | Table header | Pridi -> bss-pridi | 500 (Medium) | 13px | normal | 0.299px |
| Cell text (small) | - | Pridi -> bss-pridi | 400 (Regular) | 12px | 13px | 0.3px |
| Cell text (numeric) | Body/Small | Pridi -> bss-pridi | 400 (Regular) | 14px | 1.5 | 0.35px |
| Badge text | - | Pridi -> bss-pridi | 700 (Bold) | 13px | normal | 0.325px |

---

## 9. Key Implementation Notes

1. **Table uses flexbox, NOT `<table>` element** in Figma -- but implement as HTML `<table>` with matching visual styling
2. **Column proportions**: 5 out of 6 columns are flex:1 (equal width). Column 4 ("ก่อนปรับ") is fixed 241px
3. **Zebra striping**: Even rows have #F2F6F6 background, odd rows are white
4. **Selected row**: Blue highlight #D1E5FA with 2px #297ED4 border (replaces normal border)
5. **Empty rows**: Fill remaining space with 34px-tall alternating stripe rows
6. **Denomination badge**: Use `qty-badge qty-{price}` classes from all.css (per design-check-instructions)
7. **Font mapping**: Figma "Pridi" -> implement as "bss-pridi" (per @font-face in project)
8. **Sort icons**: 12x12px up/down arrow SVGs next to header text with 2px gap
9. **Action buttons**: 26x26px with 1px black border, 4px radius, 10px gap between them
10. **Table container**: 12px border-radius with overflow-clip to round corners
