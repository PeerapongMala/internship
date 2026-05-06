# Screenshot Description — Node 2:18859

> **Date**: 2026-02-19
> **Figma Node**: `2:18859`
> **Name**: Auto Selling - Unsort CC มัดขาด-เกิน แสดงรายละเอียดการปรับยอดธนบัตร

---

## What I See in the Screenshot

### Overall Layout
The screen is 1440x900px with the standard BSS navigation header at top (dark brown/gold bar with BOT logo, menu items, and user profile "สมสวัสดิ์ มาดี / Operator").

Below the nav is the page title "Auto Selling UNSORT CC" with metadata (Date: 21/7/2568 16:26, Sorting Machine, Supervisor info) and action buttons (Filter, เปิดหน้าจอ 2, Print Data).

A filter row with 5 dropdowns: Header Card, ธนาคาร, Zone, Cashpoint, ชนิดราคา (all showing "ทั้งหมด" / 1000).

### LEFT Panel (roughly 60% width)
Three stacked table sections:

**Top table: "มัดครบจำนวน ครบมูลค่า"** (จำนวน: 1,000 ฉบับ)
- Gold/brown section header
- 1 row visible: 0054941520, denomination badge "1000", 21/07/2568 14:00, 1,000, 1,000,000, green "Auto Selling" badge, edit+delete action icons

**Middle table: "มัดรวมครบจำนวน ครบมูลค่า"** (จำนวน: 2,000 ฉบับ)
- Gold/brown section header
- 2 rows: 0054941537 (1,995 / 1,995,000 / Auto Selling) and 0054941538 (5 / 5,000 / Auto Selling)

**Bottom table (NEW): "แสดงรายละเอียดข้อมูลตาม HeaderCard ที่เลือก"** (จำนวนธนบัตร: 997 ฉบับ)
- This panel is NEW compared to default state
- Section header shows count in brown/orange text
- 8 columns: Header Card, ธนาคาร, Cashpoint, ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ, มูลค่า
- 3 data rows showing breakdown of HeaderCard 0054941525:
  - BBL, สีลม, 1000, ทำลาย, 17, 990, 990,000
  - BBL, สีลม, 1000, ดี, 17, 4, 4,000
  - BBL, สีลม, 1000, Reject, 17, 3, 3,000

### RIGHT Panel (roughly 40% width)
Four stacked sections:

**Top: "มัดขาด-เกิน"** (จำนวน: 997 ฉบับ, title in red)
- 1 row: 0054941525, denomination 1000, 21/07/2568 14:00, 997, 997,000
- **This row is SELECTED** — blue checkbox is checked, badge shows "Edited" in brown/gold instead of "Auto Selling"

**Second: "มัดรวมขาด-เกิน"** (จำนวน: 1,998 ฉบับ)
- 2 rows: 0054941533 and 0054941534

**Third: "มัดเกินโดยขอจากเครื่องจักร"** (จำนวน: 1,002 ฉบับ เกิน: 2 ฉบับ)
- 1 row: 0054941526, 1000, 21/07/2568, 1,002, 1,002,000

**Bottom (NEW): "ปรับข้อมูลผลนับคัด" — Editor/Adjustment Panel**
- This panel is NEW compared to default state
- White card with border, rounded corners
- Form fields in a row:
  - Header Card: "0054941525" (read-only, gray background)
  - ชนิดราคา: dropdown showing "1000"
  - แบบ: dropdown showing "17"
  - จำนวน (ฉบับ): input showing "3"
- หมายเหตุ: empty text input spanning full width
- Radio button row:
  - Left group: "เพิ่ม" (selected, blue) | "ลด"
  - Vertical separator line
  - Right group: "Normal" (selected, blue) | "Add-on" | "Ent. JAM"
  - Vertical separator line
  - Green "บันทึก" button

### Footer Bar
Three buttons across the bottom:
- "Refresh" (light/outline style, left)
- "Manual Key-in" (brown/gold, center-right)
- "ดูรายการสรุปทั้งหมด" (brown/gold, far right)

---

## Key Visual Differences from Default State
1. The bottom-left area now shows the **detail breakdown table** instead of being empty
2. The bottom-right area now shows the **adjustment editor form** instead of being empty
3. One row in the "มัดขาด-เกิน" table is selected (blue checkbox) and shows "Edited" badge
4. The detail table header has a distinct teal/green-gray color (#d6e0e0) different from the brown/gold headers
