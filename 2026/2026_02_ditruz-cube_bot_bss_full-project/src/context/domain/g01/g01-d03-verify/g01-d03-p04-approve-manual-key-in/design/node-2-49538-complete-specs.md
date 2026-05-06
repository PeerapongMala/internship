# Complete Design Specifications — Node 2-49538 (Background)
**Page**: g01-d03-p04-approve-manual-key-in
**Figma Node**: 2-49538 (Background layer only)
**Main Content Node**: 2-49537 (Approve Manual Key-in)
**Extraction Date**: 2026-02-20

---

## Overview

Node 2-49538 contains ONLY the background layer. The actual page content is in node 2-49537 and its children. This document provides complete specifications for:
- Background gradient and colors
- Typography for ALL text elements
- Icon specifications
- Spacing and layout

---

## 1. Background Colors/Gradients

### Page Background (Node 2-49539)
- **Color**: `#EDEDED` (Light gray)
- **Size**: 1440.5px × 900px
- **Position**: Full page background

### Header Gradient (Node 2-49540)
- **Type**: Linear gradient with mask
- **Size**: 1440px × 450px
- **Position**: Top of page (y: 0)
- **Gradient**:
  ```css
  background: linear-gradient(117.593deg, #003366 0%, #8B9DAF 100%);
  ```
  - Start color: `#003366` (Navy blue - Primary color)
  - End color: `#8B9DAF` (Light blue-gray)
  - Direction: 117.593deg

### Background Images
- Two decorative images with 20% opacity masked by gradient
- Left image: positioned at left: -450px, top: -440px
- Right image: positioned at left: 949px, top: -476px
- Both use `mask-image` with SVG mask
- **Implementation**: Use the gradient SVG mask from Figma export

---

## 2. Typography Specifications

### 2.1 Page Header Section (Node 2-49769)

#### Page Title: "Approve Manual Key-in"
- **Text**: "Approve Manual Key-in"
- **Font-family**: Pridi SemiBold (map to `bss-pridi`)
- **Font-size**: 30px
- **Font-weight**: 600
- **Color**: `#FFFFFF` (White)
- **Letter-spacing**: 0.675px
- **Line-height**: 1.2 (36px)
- **Position**: Left-aligned in header

#### Date Label: "Date:"
- **Text**: "Date:"
- **Font-family**: Pridi Regular
- **Font-size**: 16px
- **Font-weight**: 400
- **Color**: `#FFFFFF` (White)
- **Letter-spacing**: 0.4px
- **Line-height**: 1.5 (24px)

#### Date Value: "21/7/2568 16:26"
- **Font-family**: Pridi Regular
- **Font-size**: 16px
- **Font-weight**: 400
- **Color**: `#FFFFFF` (White)
- **Letter-spacing**: 0.4px
- **Line-height**: 1.5 (24px)
- **Text-align**: right

#### ธปท Label & Value
- **Same specs as Date label/value**
- **Font-family**: Pridi Regular
- **Font-size**: 16px
- **Font-weight**: 400
- **Color**: `#FFFFFF` (White)

#### Filter Button
- **Background**: `#003366` (Primary blue)
- **Border-radius**: 4px
- **Padding**: 4px 16px
- **Size**: 92px × 36px
- **Icon**: Filter icon (16×16px, white)
- **Text**: "Filter"
  - Font-family: Pridi Medium
  - Font-size: 14px
  - Font-weight: 500
  - Color: `#FFFFFF`
  - Letter-spacing: 0.35px
  - Line-height: 1.5 (21px)

---

### 2.2 Filter Section (Node 2-49792)

#### Container
- **Background**: `#FFFFFF` (White)
- **Border-radius**: 12px
- **Padding**: 16px
- **Gap between rows**: 8px

#### Filter Labels (All filters)
- **Font-family**: Pridi Regular
- **Font-size**: 14px
- **Font-weight**: 400
- **Color**: `#212121` (Neutral text primary)
- **Letter-spacing**: 0.35px
- **Line-height**: normal

**Filter Label Text Values**:
Row 1:
- "Header Card:"
- "Type:"
- "ธนาคาร:"
- "Zone"
- "ศูนย์เงินสด/Cashpoint:"

Row 2:
- "Operator - Prepare:"
- "Operator - Reconsile:"
- "Supervisor(s):"
- "สถานะ:"

#### Select Dropdown
- **Background**: `#FFFFFF`
- **Border**: 1px solid `#CED4DA` (Gray/400)
- **Border-radius**: 4px
- **Padding**: 5px 9px 5px 13px
- **Height**: 31px
- **Placeholder text**: "ทั้งหมด"
  - Font-family: Pridi Regular
  - Font-size: 14px
  - Font-weight: 400
  - Color: `#212529` (Body color)
  - Letter-spacing: 0.35px
  - Line-height: 1.5 (21px)

#### Dropdown Icon
- **Icon**: Down arrow (chevron)
- **Size**: 16×16px
- **Color**: Inherit from Bootstrap
- **SVG source**: Available from Figma export

---

### 2.3 Detail Breakdown Table (Node 2-49832)

#### Table Container
- **Background**: `#FFFFFF`
- **Border**: 1px solid `#CBD5E1` (Separator opaque)
- **Border-radius**: 12px
- **Width**: 900px
- **Height**: 249px

#### Table Header Title
- **Text**: "แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้"
- **Font-family**: Pridi Medium
- **Font-size**: 16px
- **Font-weight**: 500
- **Color**: `#212121` (Neutral text primary)
- **Letter-spacing**: 0.4px
- **Line-height**: 1.2 (19.2px)
- **Padding**: 8px 16px
- **Min-height**: 45px
- **Border-bottom**: 1px solid `#CBD5E1`

#### Column Headers (Row background: `#D6E0E0`)
- **Background**: `#D6E0E0` (Light teal-gray)
- **Height**: 30px
- **Padding**: 8px
- **Border-bottom**: 1px solid `#CBD5E1`

**Column Header Text**:
1. "ชนิดราคา" (Denomination)
2. "ประเภท" (Type)
3. "แบบ" (Form)
4. "จำนวนฉบับ" (Quantity) - right-aligned

- **Font-family**: Pridi Medium
- **Font-size**: 13px
- **Font-weight**: 500
- **Color**: `#212121`
- **Letter-spacing**: 0.299px
- **Line-height**: normal

#### Sort Icon (in headers)
- **Size**: 12×12px
- **Color**: Neutral
- **Position**: Next to header text

#### Table Body Rows

**Odd rows** (1st, 3rd row - white):
- **Background**: `#FFFFFF`

**Even rows** (2nd row - light gray):
- **Background**: `#F2F6F6`

**Row specs**:
- **Height**: 40px
- **Border-bottom**: 1px solid `#CBD5E1`
- **Padding**: 6px 8px

#### Cell Text (ประเภท, แบบ columns)
- **Font-family**: Pridi Regular
- **Font-size**: 12px
- **Font-weight**: 400
- **Color**: `#212529`
- **Letter-spacing**: 0.3px
- **Line-height**: 13px
- **Text**: "ดี", "เสีย", "Reject"

#### Cell Text (จำนวนฉบับ column - right-aligned)
- **Font-family**: Pridi Regular
- **Font-size**: 14px
- **Font-weight**: 400
- **Color**: `#212529`
- **Letter-spacing**: 0.35px
- **Line-height**: 1.5 (21px)
- **Text-align**: right
- **Values**: "4", "995", "1"

#### Denomination Badge (ชนิดราคา column)
- **Background**: `#FBF8F4` (Cream)
- **Border**: 2px solid `#9F7D57` (Brown)
- **Size**: 47px × 24px
- **Image**: Banknote image with 30% opacity, color-burn blend mode
- **Text on badge**: "1000"
  - Font-family: Pridi Bold
  - Font-size: 13px
  - Font-weight: 700
  - Color: `#4F3E2B` (Dark brown)
  - Text-align: center
  - Letter-spacing: 0.325px

---

### 2.4 Action Panel (Node 2-49964)

#### Container
- **Background**: `#FFFFFF`
- **Border**: 1px solid `#CBD5E1`
- **Border-radius**: 12px
- **Padding**: 16px
- **Width**: 500px
- **Height**: 249px
- **Gap**: 16px (between elements)

#### Label "หมายเหตุ:"
- **Font-family**: Pridi Regular
- **Font-size**: 14px
- **Font-weight**: 400
- **Color**: `#212121`
- **Letter-spacing**: 0.35px
- **Line-height**: normal

#### Notes Textarea
- **Background**: `#FFFFFF`
- **Border**: 1px solid `#E0DFE2` (Light gray)
- **Border-radius**: 8px
- **Padding**: 8px 12px
- **Height**: 36px
- **Width**: 468px

**Placeholder/Sample text**:
- **Text**: "นี่คือรายละเอียดที่พิมพ์เพื่อกดปุ่ม Denied"
- **Font-family**: Pridi Regular
- **Font-size**: 13px
- **Font-weight**: 400
- **Color**: `#212121`
- **Letter-spacing**: 0.325px
- **Line-height**: normal

#### Approve Button
- **Background**: `#198754` (Success green)
- **Border**: none
- **Border-radius**: 8px
- **Padding**: 8px 16px
- **Size**: 468px × 46px
- **Gap**: 8px (between icon and text)

**Button Text**: "Approve"
- **Font-family**: Pridi Medium
- **Font-size**: 20px
- **Font-weight**: 500
- **Color**: `#FFFFFF`
- **Letter-spacing**: 0.5px
- **Line-height**: 1.5 (30px)

**Icon**: Check circle fill (green circle with checkmark)
- **Size**: 16×16px
- **Color**: White
- **Position**: Left of text

#### Separator Line
- **Background**: `#D9D9D9` (Light gray)
- **Height**: 1px
- **Width**: 468px

#### Deny Button
- **Background**: `#DC3545` (Danger red)
- **Border**: 1px solid `#DC3545`
- **Border-radius**: 8px
- **Padding**: 9px 17px
- **Size**: 468px × 48px
- **Gap**: 8px (between icon and text)

**Button Text**: "Deny"
- **Font-family**: Pridi Medium
- **Font-size**: 20px
- **Font-weight**: 500
- **Color**: `#FFFFFF`
- **Letter-spacing**: 0.5px
- **Line-height**: 1.5 (30px)

**Icon**: X octagon fill (red octagon with X)
- **Size**: 16×16px
- **Color**: White
- **Position**: Left of text

---

## 3. Icon Specifications

### 3.1 Icons to Export from Figma

All icons are stored on localhost MCP server. Need to download and save to project:

#### Filter Icon (in page header)
- **Node**: Part of button in 2-49787
- **Size**: 16×16px
- **Color**: White
- **Source**: `http://localhost:3845/assets/644ead23ca44d1497406d40ddf05b95296e5fa74.svg`
- **Filename**: `filter-icon.svg`
- **Usage**: Filter button in page header

#### Dropdown Arrow (chevron down)
- **Size**: 16×16px
- **Color**: Inherit (dark gray)
- **Source**: `http://localhost:3845/assets/9b46f694587bc0ce3a4bf4af6b8d3588f93a95fa.svg`
- **Filename**: `chevron-down.svg`
- **Usage**: All select dropdowns in filter section

#### Sort Icon (up/down arrows)
- **Size**: 12×12px
- **Color**: Neutral
- **Source**: `http://localhost:3845/assets/f62dd8b85c73bc0e18ba5b29901a3b1f37a463bd.svg`
- **Filename**: `sort-icon.svg`
- **Usage**: Table column headers (detail table)

#### Check Circle Fill (Approve icon)
- **Size**: 16×16px
- **Color**: White
- **Source**: `http://localhost:3845/assets/edd7b986b7208136d6e364f394dd25ccb5f67293.svg`
- **Filename**: `check-circle-fill.svg`
- **Usage**: Approve button

#### X Octagon Fill (Deny icon)
- **Size**: 16×16px
- **Color**: White
- **Source**: `http://localhost:3845/assets/f3e89c54ef29d07db64189814a696f5f70d2cbb2.svg`
- **Filename**: `x-octagon-fill.svg`
- **Usage**: Deny button

#### Gradient Mask SVG
- **Source**: `http://localhost:3845/assets/7c2dae952643f037eb7ef41b19ec5540a88f7177.svg`
- **Filename**: `gradient-forground-mask.svg`
- **Usage**: Background gradient mask

#### Banknote Image
- **Source**: `http://localhost:3845/assets/df40e539ba3b64f6b86cf092de6bc7980e96c99d.png`
- **Filename**: `banknote-1000.png`
- **Usage**: Denomination badge in detail table (with opacity and blend mode)

---

## 4. Color Palette (Complete)

### Primary Colors
- **Primary**: `#003366` (Navy blue)
- **Primary Light**: `#8B9DAF` (Light blue-gray - gradient end)

### Background Colors
- **Page Background**: `#EDEDED` (Light gray)
- **White**: `#FFFFFF`
- **Card Background**: `#FFFFFF`

### Text Colors
- **Neutral Primary**: `#212121` (Dark gray - main text)
- **Body Color**: `#212529` (Bootstrap default)
- **White**: `#FFFFFF` (on colored backgrounds)

### Border/Separator Colors
- **Separator Opaque**: `#CBD5E1` (Light gray)
- **Gray 400**: `#CED4DA` (Input borders)
- **Light Gray**: `#E0DFE2` (Textarea border)

### Table Colors
- **Header Background**: `#D6E0E0` (Light teal-gray)
- **Even Row**: `#F2F6F6` (Very light gray)
- **Odd Row**: `#FFFFFF` (White)

### Button Colors
- **Success**: `#198754` (Green)
- **Danger**: `#DC3545` (Red)

### Badge Colors
- **Banknote Background**: `#FBF8F4` (Cream)
- **Banknote Border**: `#9F7D57` (Brown)
- **Banknote Text**: `#4F3E2B` (Dark brown)

### Other
- **Separator Line**: `#D9D9D9` (Light gray)

---

## 5. Spacing & Layout

### Page Layout
- **Content width**: 1408px (16px margins on each side)
- **Page header**: 62px height
- **Filter section**: 102px height (2 rows @ 31px + padding)
- **Bottom section**: 249px height
- **Gap between detail table and action panel**: 8px

### Filter Section
- **Padding**: 16px
- **Border-radius**: 12px
- **Gap between rows**: 8px
- **Gap between filters**: 24px (row 1), varies (row 2)

### Detail Table
- **Border-radius**: 12px
- **Header padding**: 8px 16px
- **Cell padding**: 6px 8px
- **Column gap**: Equal flex distribution

### Action Panel
- **Padding**: 16px
- **Border-radius**: 12px
- **Gap between elements**: 16px
- **Button height**: 46px (Approve), 48px (Deny)

---

## 6. Missing Visual Elements

Based on the Figma extraction, the following elements are NOT included in node 2-49538:

1. **Navigation Header** (Node 2-49545) - Contains logo, menu, user profile
2. **Main Transaction Table** (Node 2-49830) - Large data table
3. **Modals** (Approve confirmation, Success message)

These components should be queried separately for complete specs.

---

## 7. Implementation Checklist

### Background & Gradients
- [ ] Apply page background `#EDEDED`
- [ ] Implement linear gradient (117.593deg, #003366 to #8B9DAF) for header area
- [ ] Download and apply gradient mask SVG
- [ ] Add decorative background images with 20% opacity

### Typography
- [ ] Map 'Pridi' font to 'bss-pridi' in project
- [ ] Apply page title: 30px SemiBold, white, 0.675px letter-spacing
- [ ] Apply filter labels: 14px Regular, #212121, 0.35px letter-spacing
- [ ] Apply table headers: 13px Medium, #212121, 0.299px letter-spacing
- [ ] Apply table body text: 12px Regular (type/form), 14px Regular (quantity)
- [ ] Apply button text: 20px Medium, white, 0.5px letter-spacing

### Icons
- [ ] Download and save filter icon (16×16px)
- [ ] Download and save dropdown chevron (16×16px)
- [ ] Download and save sort icon (12×12px)
- [ ] Download and save check-circle-fill icon (16×16px)
- [ ] Download and save x-octagon-fill icon (16×16px)
- [ ] Download banknote image for denomination badges

### Colors
- [ ] Define CSS variables for all colors listed in section 4
- [ ] Apply table row alternating colors (#FFFFFF, #F2F6F6)
- [ ] Apply button colors (Success: #198754, Danger: #DC3545)
- [ ] Apply denomination badge colors (background, border, text)

### Layout & Spacing
- [ ] Set content width to 1408px with 16px margins
- [ ] Apply filter section layout (2 rows, proper gaps)
- [ ] Set detail table dimensions (900px × 249px)
- [ ] Set action panel dimensions (500px × 249px)
- [ ] Apply 8px gap between detail table and action panel

### Components
- [ ] Build filter dropdown component (white bg, #CED4DA border)
- [ ] Build denomination badge component (with image, border, text overlay)
- [ ] Build Approve button (green, with check icon)
- [ ] Build Deny button (red, with X icon)
- [ ] Build notes textarea component

---

## 8. CSS Class Naming Suggestions

Based on existing project patterns:

```css
/* Page */
.page-approve-manual-key-in { }
.page-background { background: #EDEDED; }
.page-gradient-header { background: linear-gradient(117.593deg, #003366 0%, #8B9DAF 100%); }

/* Page Header */
.page-title { font-size: 30px; font-weight: 600; color: #FFFFFF; }
.filter-button { background: #003366; }

/* Filter Section */
.filter-container { background: #FFFFFF; border-radius: 12px; padding: 16px; }
.filter-label { font-size: 14px; color: #212121; }
.filter-select { border: 1px solid #CED4DA; border-radius: 4px; }

/* Detail Table */
.detail-table-container { border: 1px solid #CBD5E1; border-radius: 12px; }
.detail-table-header { background: #D6E0E0; height: 30px; }
.detail-table-row-odd { background: #FFFFFF; }
.detail-table-row-even { background: #F2F6F6; }
.denomination-badge { background: #FBF8F4; border: 2px solid #9F7D57; }

/* Action Panel */
.action-panel { background: #FFFFFF; border-radius: 12px; padding: 16px; }
.notes-textarea { border: 1px solid #E0DFE2; border-radius: 8px; }
.btn-approve { background: #198754; color: #FFFFFF; }
.btn-deny { background: #DC3545; color: #FFFFFF; }
```

---

## 9. Related Node IDs for Further Extraction

- **2-49537**: Main layout frame (parent of all content)
- **2-49545**: Navigation header
- **2-49769**: Page header section ✓ (extracted)
- **2-49792**: Filter section ✓ (extracted)
- **2-49830**: Main transaction table (needs separate extraction)
- **2-49832**: Detail breakdown table ✓ (extracted)
- **2-49964**: Action panel ✓ (extracted)
- **2-50280**: Approve modal
- **2-50270**: Success modal

---

## Notes

1. **Font Mapping**: All instances of 'Pridi' in Figma should map to 'bss-pridi' in the project
2. **Icon Library**: Icons appear to be from Bootstrap Icons, but should verify with existing project icons first
3. **Responsive**: This spec is for 1440px desktop view; mobile/tablet specs not included
4. **Background Images**: The decorative images use complex masking; may need to simplify for production
5. **Letter Spacing**: Figma reports letter-spacing in %, but CSS should use px values (already converted)

---

## Version History

- **2026-02-20**: Initial complete extraction from Figma MCP
  - Extracted node 2-49538 (background)
  - Extracted node 2-49769 (page header)
  - Extracted node 2-49792 (filter section)
  - Extracted node 2-49832 (detail table)
  - Extracted node 2-49964 (action panel)
