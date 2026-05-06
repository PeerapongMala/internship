# Screenshot Description - Node 2:23259

**Date:** 2026-02-19
**Node:** Edit & Manual Key-in Unsort CC
**Figma Node ID:** 2:23259

## Visual Description

This is a full-page design (1440x900) for the "Edit & Manual Key-in Unsort CC" screen in a banknote counting verification system (BSS Web).

### Navigation Header (top bar)
- Dark blue/navy background (#003366)
- Left: BSS logo + Thai text "ธนาคารแห่งประเทศไทย ระบบตรวจสอบการนับคัดธนบัตร Version 1.0.0"
- Center: Navigation menu items: "Pre - Preparation Unsort", "Auto Selling", "Revoke", "Approve Manual Key-in", "Report"
- Right: User profile "สมสวัสดิ์ มาดี / Operator" with avatar icon

### Page Title
- Bold text: "Edit & Manual Key-in Unsort CC"
- Below the nav header, left-aligned

### Header Card Row
- White rounded card with border
- Left: "Header Card:" label with grey badge showing "0054941526"
- Right: "Date: 21/7/2568 16:26"

### Form Section (left, ~70% width)
- White rounded card with border, padding 24px
- Title: "เพิ่มผลการนับคัดธนบัตร" (Add banknote counting result)

#### Row 1 - Radio Groups
- **ประเภทธนบัตร (Banknote Type):** Radio buttons - ดี (selected, highlighted with dark bg), เสีย, ทำลาย, Reject, ปลอม, ชำรุด
- **ชนิดราคา (Denomination):** Radio buttons with colored denomination badges - 1000 (selected, brown border), 500 (purple border), 100 (red border), 50 (blue border), 20 (green border)

#### Row 2 - Dropdowns/Inputs
- **แบบ (Series):** Dropdown select showing "17"
- **จำนวน (Quantity):** Text input field with blue focus border and blue glow shadow (focused state shown)

#### Submit Button
- Green button (#198754) with white text "บันทึกผลนับคัด"
- Width: 300px, right-aligned
- Rounded corners (8px)

### Info Panel (right, ~30% width)
- White rounded card with border
- Key-value pairs displayed:
  - บาร์โค้ดรายห่อ: -
  - บาร์โค้ดรายมัด: -
  - ธนาคาร: BBL
  - ศูนย์เงินสด: ธ.กรุงเทพ สีลม
  - วันเวลาเตรียม: 21/07/2568 14:00
  - วันเวลานับคัด: 21/07/2568 14:01
  - Prepare: วิไล บัวงาม
  - Sorter: ประภาส ช่างงาม
  - Reconcile: อาภา เรืองรอง
  - Supervisor ที่แก้ไข: สมสวัสดิ์ มาดี

### Results Table
- Title bar: "แสดงผลการนับคัด" with counts "จำนวนก่อน: 1002 ฉบับ" and "จำนวนหลัง: 0 ฉบับ"
- Column headers (grey bg #d6e0e0): ชนิดราคา, ประเภท, แบบ, ก่อนปรับ (ฉบับ), หลังปรับ (ฉบับ), Action
- 3 data rows shown:
  1. 1000 | ดี | 17 | 993 | (empty) | Edit + Delete buttons
  2. 1000 | ทำลาย | 17 | 8 | (empty) | Edit + Delete buttons (alternating grey bg #f2f6f6)
  3. 1000 | Reject | 17 | 1 | (empty) | Edit + Delete buttons
- Action buttons: 26x26px outlined square buttons with pencil (edit) and trash (delete) icons

### Footer
- Bottom right: Navy button (#003366) "บันทึกข้อมูล" (Save Data), width 229px

### Background
- Page has a gradient/decorative background with warm tones (orange/brown gradient at top, transitioning to white)
