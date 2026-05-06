# Node 32:25438 - Main Layout (No Filter Shown)

## Screenshot Description

This is the main layout of the **Reconciliation Transaction** page for the UNFIT banknote type. The page is designed at 1440x900 resolution.

### Top Navigation Bar
- A dark navy/blue navigation bar spans the full width at the top.
- On the left side, there is a Bank of Thailand logo with text in Thai and English: "ระบบตรวจสอบการนับคัดธนบัตร Version 1.0.0".
- A dropdown menu labeled "Reconciliation" is open, revealing three sub-menu items:
  - **Holding**
  - **Holding Detail**
  - **ตั้งค่าการทำงานเริ่มต้น** (Default work settings)
- On the top-right, there are three dark navy buttons: "เปิดหน้าจอ 2" (Open Screen 2), "Holding", and "Holding Detail".

### Page Title Area
- Below the navigation bar, the page title reads **"Reconciliation Transaction"** in large serif-style text.
- A Thai subtitle reads: "กระทบยอดธนบัตรประเภท UNFIT".

### Header Card Input Section
- A prompt text reads: "สแกน Header Card เพื่อกระทบยอดธนบัตรประเภท UNFIT" (Scan Header Card to reconcile UNFIT banknotes).
- Below it is a labeled input field "Header Card" with a blue-outlined empty text input box.
- To the right of the input field, a summary line reads: "กระทบยอดแล้วทั้งหมด **100** มัด" (Total reconciled: 100 bundles).
- Below the summary: "กรุงเทพฯ M7-1 ศกท." and "ผลัดบ่าย" (Bangkok M7-1 machine, afternoon shift).
- Two action buttons appear: a white "Filter" button with a filter icon, and a white "Refresh" button with a refresh icon.

### Right-Side Info Panel
- A small information card on the top-right corner shows:
  - **Date:** 21/7/2568 16:26 (with a red alert icon)
  - **Sorter:** โพลาว เลาวลักษณ์
  - **Reconciliator:** สมสวัสดิ์ มาลี
  - **Sorting Machine:** กรุงเทพฯ M7-1 ศกท.
  - **Shift:** ผลัดบ่าย

### Three-Column Data Table Layout

#### Left Column: "Preparation"
- A table with columns: **Header Card** (sortable), **วันเวลาเตรียม** (Preparation datetime, sortable), **ชนิดราคา** (Denomination, sortable), **Action**.
- Contains 5 visible data rows with Header Card numbers (e.g., 0054941124 through 0054941128).
- Each row shows datetime "21/7/2568 14:00", denomination badge showing "100" in a green/teal rounded pill, and two action icon buttons (edit and delete).
- A vertical scrollbar on the right indicates more rows are available.

#### Middle Column: "Preparation + Data from Machine"
- A wider table with columns: **Header Card** (sortable), **วันเวลาเตรียม** (sortable), **วันเวลานับคัด** (Count/sort datetime, sortable), **ชนิดราคา** (sortable), **Action**.
- Contains 5 visible data rows with Header Card numbers (e.g., 0054941201, 0054941203, 0054941205, 0054941212, 0054941206).
- Some rows are highlighted in pink/red background (rows for 0054941205 and 0054941212), indicating a warning or mismatch state.
- Row 0054941205 has only one action icon (a lock/shield icon) instead of two.
- Row 0054941206 has a red alert icon next to the Header Card number.
- A vertical scrollbar on the right indicates more rows are available.

#### Right Column: "Header Card from Machine"
- A table with columns: **Header Card** (sortable), **วันเวลา นับคัด** (Count/sort datetime), **ชนิดราคา** (Denomination), **Action**.
- Contains 5 visible data rows with Header Card numbers (e.g., 0054941220, 0054941226, 0054941228, 0054941230, 0054941226).
- Some rows have red alert icons next to the Header Card number (0054941226 appears twice with a red alert icon).
- Each row shows denomination "100" in a teal pill and action icon buttons.
- A vertical scrollbar on the right indicates more rows are available.

### Background
- The background features a gradient from dark navy-blue at the top (behind the header area) transitioning to a lighter gray-white area where the data tables sit. Subtle watermark-style decorative elements appear in the blue header zone.

### Overall Layout
- The page uses a three-panel layout for comparing preparation data, machine data, and combined data side by side, designed for reconciliation workflow of banknote counting/sorting operations.
