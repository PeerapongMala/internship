# Node 32:26428 - Unfit Variant (With Filter)

## Screenshot Description

This is the **Unfit variant** of the Reconciliation Transaction page, showing the **filter panel expanded**. The page is 1440x900 resolution and is nearly identical to the main layout but with an additional filter row visible.

### Top Navigation Bar
- Same dark navy/blue navigation bar across the full width.
- Bank of Thailand logo and system name on the left: "ระบบตรวจสอบการนับคัดธนบัตร Version 1.0.0".
- "Reconciliation" dropdown label in the center of the nav bar (collapsed, not showing sub-menu).
- Top-right buttons: "เปิดหน้าจอ 2", "Holding", "Holding Detail" in dark navy style.

### Page Title
- **"Reconciliation Transaction UNFIT"** as the main title in large serif text.
- Thai subtitle: "กระทบยอดธนบัตรประเภท UNFIT".

### Header Card Input Section
- Instruction text: "สแกน Header Card เพื่อกระทบยอดธนบัตรประเภท UNFIT".
- "Header Card" labeled text input field with blue outline (empty).
- Summary text: "กระทบยอดแล้วทั้งหมด **100** มัด" with location "กรุงเทพฯ M7-1 ศกท." and shift "ผลัดบ่าย".
- "Filter" button (with green/teal fill, indicating active state) and "Refresh" button (white outline).

### Filter Row (Key Difference from Main Layout)
- Below the header card input area, an additional filter row is visible containing:
  - **Header Card** dropdown select field with "Please select" placeholder text.
  - **ชนิดราคา** (Denomination) dropdown select field with "Please select" placeholder text.
  - A **"Clear Filter"** button (white with border) to reset the filter selections.
- This filter row takes up vertical space, pushing the data tables lower on the page.

### Right-Side Info Panel
- Same information card on the top-right:
  - **Date:** 21/7/2568 16:26 (with red alert icon)
  - **Sorter:** โพลาว เลาวลักษณ์
  - **Reconciliator:** สมสวัสดิ์ มาลี
  - **Sorting Machine:** กรุงเทพฯ M7-1 ศกท.
  - **Shift:** ผลัดบ่าย

### Three-Column Data Table Layout

#### Left Column: "Preparation"
- Table with columns: **Header Card** (sortable), **วันเวลาเตรียม** (sortable), **ชนิดราคา** (sortable), **Action**.
- 5 visible rows with Header Card numbers 0054941124 through 0054941128.
- Each row: datetime "21/7/2568 14:00", denomination "100" in teal pill badge, edit and delete action icons.

#### Middle Column: "Preparation + Data from Machine"
- Table with columns: **Header Card** (sortable), **วันเวลาเตรียม** (sortable), **วันเวลานับคัด** (sortable), **ชนิดราคา** (sortable), **Action**.
- 5 visible rows: 0054941201, 0054941203, 0054941205, 0054941212, 0054941206.
- Rows 0054941205 and 0054941212 have pink/red background highlighting (error/warning state).
- Row 0054941205 has only a single lock/shield action icon.
- Row 0054941206 has a red circle alert icon next to the Header Card number.

#### Right Column: "Header Card from Machine"
- Table with columns: **Header Card**, **วันเวลา นับคัด**, **ชนิดราคา**, **Action**.
- 5 visible rows: 0054941220, 0054941226 (with red alert icon), 0054941228, 0054941230, 0054941226 (with red alert icon, time 14:02).
- Each row shows denomination "100" in teal pill and action icons.

### Visual Differences from Main Layout (Node 32:25438)
1. The sub-menu dropdown is **not visible** (closed state).
2. The **filter row** is displayed between the header card input and the data tables, containing two dropdown selects (Header Card, ชนิดราคา) and a "Clear Filter" button.
3. The data tables are pushed lower due to the filter row, resulting in slightly less vertical space for table content.
4. The Filter button appears in a filled/active style (teal/green) rather than outlined.

### Background
- Same gradient background from dark navy-blue at top transitioning to lighter gray-white for the data area.
