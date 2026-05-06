# Screenshot Description — Approve Manual Key-in

**Figma Node**: 2:49536
**Captured**: 2026-02-19

---

## Visual Overview

The screenshot shows the **Approve Manual Key-in** page design in a BSS (Banknote Sorting System) verification interface. The page displays a data table with transaction records and an approval workflow panel.

---

## Layout Description

### Top Section: Navigation & Page Header
- **Navigation bar** (dark background, 40px height):
  - BSS logo and system title on the left
  - Horizontal menu navigation in the center
  - User profile ("พัฒนา วิไล - Officer") with avatar on the right

- **Page header** (white background, 62px height):
  - Left: Page title "Approve Manual Key-in" (large, bold)
  - Right: Export button with icon

### Filter Section (102px height)
Two rows of filter dropdown controls:
- **Row 1** (5 filters): Labels with dropdown selects, aligned horizontally with spacing
- **Row 2** (4 filters): Wider dropdowns spanning the full width

### Main Content Area

#### Primary Data Table (top, full width)
A large data table component showing transaction records with:
- Multiple columns for transaction data
- Row selection capability
- Pagination controls at bottom

#### Bottom Section (2-column layout)

**Left Column (900px)**: Detail Breakdown Table
- Header: "แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้"
- 4 columns: ชนิดราคา (Denomination), ประเภท (Type), แบบ (Form), จำนวนฉบับ (Quantity)
- 3 data rows:
  - Row 1: Denomination badge, "ดี" (Good), 17, 4
  - Row 2: Denomination badge, "เสีย" (Damaged), 17, 995
  - Row 3: Denomination badge, "Reject", 17, 1
- Clean table design with borders and proper alignment

**Right Column (500px)**: Action Panel "Unsort - CC"
- White card with rounded corners
- "หมายเหตุ" (Notes) label
- Text area with placeholder text: "นี่คือรายละเอียดที่พิมพ์เพื่อกดปุ่ม Denied"
- Large "Approve" button (green or primary color, 468×46px)
- Thin separator line (1px)
- Large "Denied" button (red or danger color, 468×48px)

### Background
- Upper half: Blue gradient background with decorative patterns
- Lower half: White/light gray background

---

## Modal Dialogs (shown separately in design)

### Approve Confirmation Modal
- Centered overlay (560×360px)
- Icon at top (warning/question icon)
- Title: "Approve"
- Message: "คุณแน่ใจหรือไม่ที่ต้องการ Approve ข้อมูลนี้" (Are you sure you want to Approve this data?)
- Two buttons at bottom:
  - "Cancel" button (left, 160px)
  - "Confirm" button (right, 158px)

### Success Modal
- Centered overlay (560×360px)
- Success icon at top (checkmark)
- Title: "สำเร็จ" (Success)
- Message: "บันทึกข้อมูลสำเร็จ" (Data saved successfully)
- Single "OK" button centered at bottom (160px)

---

## Color Scheme
- **Primary**: Blue (#003366)
- **Success**: Green (#198754)
- **Danger**: Red (#DC3545)
- **Background gradient**: Blue tones in upper half
- **Text**: Dark gray/black (#212121, #343A40)
- **Borders**: Light gray (#cbd5e1)
- **White backgrounds**: #FFFFFF

---

## Typography
- **Font family**: Pridi (Thai-compatible sans-serif)
- **Page title**: 24px, medium weight (500)
- **Table headers**: 13px, medium weight (500)
- **Table body**: 13px, regular weight (400)
- **Form labels**: 13-14px, regular weight (400)
- **Button text**: 14-16px, medium weight (500)

---

## Key Visual Elements

1. **Denomination badges**: Small rectangular badges with banknote imagery and price labels
2. **Filter dropdowns**: Consistent height (31px), white background, border, chevron icon
3. **Buttons**:
   - Primary buttons: Full-width in action panel, colored backgrounds
   - Secondary buttons: Outlined style in modals
4. **Table rows**: Alternating row backgrounds for readability (subtle if any)
5. **Spacing**: Consistent 16px padding in cards, 8-12px gaps between elements

---

## Responsive Notes
- Page width: 1440px (desktop design)
- Content max-width: 1408px (16px margins on sides)
- Two-column layout at bottom maintains fixed widths (900px + 500px + 8px gap)

---

## Screenshot for Reference

*(To be added: actual screenshot image from Figma MCP `get_screenshot` tool)*

---

## Implementation Checklist

- [ ] Navigation header matches height and layout
- [ ] Page title and export button aligned correctly
- [ ] Filter section uses 2-row layout with correct column widths
- [ ] Main table component matches design (query node 2:49978 separately)
- [ ] Detail table shows 4 columns with proper alignment
- [ ] Denomination badges render correctly (check for existing SVG assets)
- [ ] Action panel buttons use correct colors and sizes
- [ ] Modals center correctly with backdrop overlay
- [ ] Font family uses 'bss-pridi' (project font mapping)
- [ ] Colors match design tokens exactly (no guessing)
- [ ] Spacing follows 8px grid system (8, 12, 16px)
