# Holding Detail UNFIT — Frontend Changelog

## [2026-02-20] — Session 2: UI Polish & Design Match

- แก้ชื่อ Panel 4/5 จาก "มัดยาด-เกิน" → "มัดขาด-เกิน" / "มัดรวมขาด-เกิน"
- ปรับ column split จาก 50/50 → 60/40 (left wider)
- แก้ table border: เปลี่ยนจาก `border-right` → `border-left` บนทุก cell + `!important` (fix vertical lines ไม่แสดง)
- แก้ title bar: เพิ่ม `margin-bottom: 8px !important` + `z-index: 20` ป้องกัน table ทับ
- แก้ label สีดำ: เปลี่ยน `.title-info-label` จาก `#718096` → `#212121`
- เพิ่ม Date highlight: background `#FEE2E2`, border-radius 6px
- Restructure title info: จาก CSS Grid 4-col spans → `div.info-pair` flex pairs (แก้ gap ไม่เท่ากัน)
- `margin-left: -10px` บน `.date-highlight` ให้ "Date:" ตรงกับ "Sorting Machine:"
- เพิ่ม `.is-green { color: #16a34a }` สำหรับ p1Count / p2Count
- เปลี่ยน sort icon จาก `bi-chevron-expand` → `bi-diamond` (◇) ทุกตาราง

## [2026-02-20] — Session 1: Initial Build

- สร้าง `HoldingController.cs` — action `Unfit()` return View
- สร้าง `Views/holding/unfit/Index.cshtml` — 6-panel layout (2×3)
- สร้าง `wwwroot/css/holding/holdingUnfit.css` — full page styles
- Title bar: h1 + center info grid + nav buttons
- 6 tables with `<colgroup>` explicit widths + `table-layout: fixed`
- Sticky header (`position: sticky` + `border-collapse: separate`)
- Mock data: `USE_MOCK = true`, `MOCK` object with data for all 6 panels
- Client-side sort: `th-sort` click handler, ascending/descending toggle
- P1 row click → `loadP3Detail(headerCard)` to populate P3
- Denomination badge (green bg)
- Alternating row colors, hover highlight, active-row highlight

### งานค้าง
- เชื่อม API จริง (เปลี่ยน `USE_MOCK = false`)
- BnType variants อื่น (CSS gradient + controller actions)
- แยก JS ออกจาก View → `wwwroot/js/holding/holdingDetail.js`
