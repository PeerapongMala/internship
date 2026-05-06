# Screenshot: Auto Selling - Unsort CC - Default State

**Figma Node:** `2:20263`
**Date Fetched:** 2026-02-19

Screenshot fetched for node 2:20263 -- Auto Selling Default state.

---

## Visual Description

The screenshot shows the "Auto Selling UNSORT CC" page in its default state. The layout is a full-screen application (1440 x 900 px) with a dark-themed navigation bar at the top and a warm golden/brown gradient background.

### Top Navigation Bar
- Dark navy/black background bar spanning the full width
- Left: BOT (Bank of Thailand) logo with system name in Thai
- Center: Navigation menu items including "Pre - Preparation Unsort", "Auto Selling" (active/dropdown), "Revoke", "Approve Manual Key-in", "Report"
- Right: User profile showing "สมสวัสดิ์ มาดี / Operator" with avatar icon

### Title and Info Bar
- Page title "Auto Selling UNSORT CC" in large dark text on the left
- Center info panel with yellow/gold background containing:
  - Date: "21/7/2568 16:26" with a circular info icon
  - Sorting Machine: "กรุงเทพฯ M7-1 สพท."
  - Supervisor name and Shift info
- Right side: Three action buttons:
  - "Filter" button (teal/dark with filter icon)
  - "เปิดหน้าจอ 2" button (teal/dark with screen icon)
  - "Print Data" button (dark with printer icon)

### Filter Bar
- White/light background strip with 5 filter dropdowns in a row:
  - Header Card (ทั้งหมด)
  - ธนาคาร (ทั้งหมด)
  - Zone (ทั้งหมด)
  - Cashpoint (ทั้งหมด)
  - ชนิดราคา (1000)

### Main Content Area - Two-Panel Layout

#### Left Panel (~60% width) - Two stacked tables:

**Table 1: "มัดครบจำนวน ครบมูลค่า"** (Complete count, complete value)
- Gold/amber section header with count "จำนวน: 1,000 ฉบับ"
- Column headers: checkbox, Header Card, ชนิดราคา (with denomination badge), วันเวลานับคัด, จำนวนฉบับ, มูลค่า, สถานะ, Action
- One data row visible: Header Card 0054941520, denomination 1000 (gold badge), date 21/07/2568 14:00, count 1,000, value 1,000,000, status "Auto Selling" (teal badge), edit + delete action buttons
- Remaining rows are empty

**Table 2: "มัดรวมครบจำนวน ครบมูลค่า"** (Combined complete count)
- Same gold/amber header style with count "จำนวน: 2,000 ฉบับ"
- Two data rows visible:
  - 0054941537: 1000 denomination, 1,995 count, 1,995,000 value, "Auto Selling" status, with action buttons
  - 0054941538: 1000 denomination, 5 count, 5,000 value, "Auto Selling" status, with action buttons

#### Right Panel (~40% width) - Three stacked tables:

**Table A: "มัดขาด-เกิน"** (Shortage/Excess bundles)
- Header with count "จำนวน: 997 ฉบับ"
- One row: 0054941525, 1000 denomination, 21/07/2568 14:00, 997, 997,000, "Edited" status (red/orange badge)

**Table B: "มัดรวมขาด-เกิน"** (Combined shortage/excess)
- Header with count "จำนวน: 1,998 ฉบับ"
- Two rows:
  - 0054941533: 1000, 21/07/2568 14:00, 1,998, 1,998,000, "Auto Se..." (truncated)
  - 0054941534: 1000, 21/07/2568 14:00, 0, (empty value), "Auto Se..." (truncated)

**Table C: "มัดเก็บโดยยอดจากเครื่องจักร"** (Machine-collected bundles)
- Header with count "จำนวน: 1,002 ฉบับ เก็บ: 2 ฉบับ"
- One row: 0054941526, 1000, 21/07/2568 14:00, 1,002, 1,002,000, "Auto Se..." (truncated)

### Footer Buttons
- Bottom of page, three buttons:
  - Left: "Refresh" - green outlined button
  - Center-right: "Manual Key-in" - teal/dark solid button
  - Right: "ดูรายการสรุปทั้งหมด" - gold/amber solid button
