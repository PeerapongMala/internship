# Node 2:36001 - Unsort CC Variant

## Screenshot Description

This is the **Unsort CC variant** of the Reconciliation Transaction page. It is named "Reconciliation Transaction - Unsort CC" in Figma. The layout and data are structurally very similar to the Unfit variant with filter (Node 32:26428), but the background styling has a distinct warm orange/peach tone instead of the blue tone.

### Background Difference (Key Visual Distinction)
- The background gradient uses a **warm orange/peach/salmon** color scheme rather than the navy-blue scheme seen in other variants.
- Decorative watermark images in the background have an orange tint, with subtle circular and botanical patterns visible behind the header area.
- The overall color palette of the background shifts from dark orange at the top to lighter cream/white for the content area.

### Top Navigation Bar
- Same dark navy/blue navigation bar across the full width.
- Bank of Thailand logo and system name: "ระบบตรวจสอบการนับคัดธนบัตร Version 1.0.0".
- "Reconciliation" dropdown label (collapsed).
- Top-right buttons: "เปิดหน้าจอ 2", "Holding", "Holding Detail".

### Page Title
- **"Reconciliation Transaction UNFIT"** in large serif text (the title text still says UNFIT even though this is the Unsort CC variant).
- Thai subtitle: "กระทบยอดธนบัตรประเภท UNFIT".

### Header Card Input Section
- Same instruction text: "สแกน Header Card เพื่อกระทบยอดธนบัตรประเภท UNFIT".
- "Header Card" labeled input field with blue outline (empty).
- Summary: "กระทบยอดแล้วทั้งหมด **100** มัด", "กรุงเทพฯ M7-1 ศกท.", "ผลัดบ่าย".
- "Filter" button (teal/green filled) and "Refresh" button (white outline).

### Filter Row
- Visible filter row with:
  - **Header Card** dropdown ("Please select" placeholder).
  - **ชนิดราคา** dropdown ("Please select" placeholder).
  - **"Clear Filter"** button.

### Right-Side Info Panel
- Same info card:
  - **Date:** 21/7/2568 16:26 (red alert icon)
  - **Sorter:** โพลาว เลาวลักษณ์
  - **Reconciliator:** สมสวัสดิ์ มาลี
  - **Sorting Machine:** กรุงเทพฯ M7-1 ศกท.
  - **Shift:** ผลัดบ่าย

### Three-Column Data Table Layout

#### Left Column: "Preparation"
- Same structure: Header Card, วันเวลาเตรียม, ชนิดราคา, Action columns.
- 5 rows: 0054941124 through 0054941128, all with "21/7/2568 14:00", denomination "100", and edit/delete action icons.

#### Middle Column: "Preparation + Data from Machine"
- Same structure: Header Card, วันเวลาเตรียม, วันเวลานับคัด, ชนิดราคา, Action columns.
- 5 rows: 0054941201, 0054941203, 0054941205 (pink/red highlighted), 0054941212 (pink/red highlighted), 0054941206 (with red alert icon).
- Row 0054941205 has a single lock/shield action icon.
- Same error highlighting pattern as the Unfit variant.

#### Right Column: "Header Card from Machine"
- Same structure: Header Card, วันเวลา นับคัด, ชนิดราคา, Action columns.
- 5 rows: 0054941220, 0054941226 (with red alert icon), 0054941228, 0054941230, 0054941226 (with red alert icon, time 14:02).
- Note: This variant does **not** show the row for 0054941226 at the top (index 1) -- only 4 unique visible rows with 0054941226 appearing at bottom.

### Key Differences from Other Variants
1. **Background color scheme**: Warm orange/peach/salmon gradient instead of navy-blue.
2. **Frame name**: "Reconciliation Transaction - Unsort CC" indicating this is for the unsorted CC (Credit Card) banknote category.
3. The data content and layout structure remain the same as the Unfit with filter variant.
4. The decorative background watermark images have an orange/warm tint.
