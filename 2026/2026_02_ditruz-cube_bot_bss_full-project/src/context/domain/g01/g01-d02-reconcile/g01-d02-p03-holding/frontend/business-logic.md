# Holding Detail UNFIT — Frontend Business Logic

บันทึกการตัดสินใจและขอบเขตงานฝั่ง frontend

## In-Scope

- 6-panel layout (2 cols × 3 rows): มัดครบ (P1–P3 left), มัดขาด-เกิน (P4–P6 right)
- Column split: left 60%, right 40%
- Title bar info: Date (pink highlight), Sorting Machine, Supervisor, Shift — flex pairs
- Panel 1 row click → load P3 detail (รายละเอียดตาม Header Card)
- Sort columns via `th-sort` click (client-side sort)
- Mock data (`USE_MOCK = true`) สำหรับทุก panel
- Denomination badge (green `#16a34a`)
- Panel count summary (green สำหรับมัดครบ, orange สำหรับมัดขาด-เกิน)
- Nav buttons: Reconcile Transaction, Holding

## Panel Structure

| Panel | ชื่อ | ตำแหน่ง | Columns | Count สี |
|-------|------|---------|---------|----------|
| P1 | มัดครบจำนวน ครบมูลค่า | Left-Top | Header Card, ชนิดราคา, วันเวลานับคัด, มูลค่า | Green |
| P2 | มัดรวมครบจำนวน ครบมูลค่า | Left-Mid | Header Card, ชนิดราคา, วันเวลานับคัด, มูลค่า | Green |
| P3 | รายละเอียดตาม Header Card | Left-Bot | Header Card, ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ, มูลค่า | Green |
| P4 | มัดขาด-เกิน | Right-Top | Header Card, ชนิดราคา, วันเวลานับคัด, มูลค่า | Orange |
| P5 | มัดรวมขาด-เกิน | Right-Mid | Header Card, ชนิดราคา, วันเวลานับคัด, มูลค่า | Orange |
| P6 | มัดเกินโดยยอดจากเครื่องจักร | Right-Bot | Header Card, ชนิดราคา, วันเวลานับคัด, มูลค่า | Orange |

## Mock Data Summary

| Panel | Key | Count |
|-------|-----|-------|
| P1 (completeBundles) | 1 row | 1,000 ฉบับ |
| P2 (combinedComplete) | 1 row | 1,997 ฉบับ |
| P3 (headerCardDetails) | 3 rows | ทำลาย 990, ดี 6, Reject 4 |
| P4 (excessBundles) | 1 row | 1,997 ฉบับ |
| P5 (combinedExcess) | 2 rows | 1,998 + 1,998 ฉบับ |
| P6 (machineExcess) | 1 row | 1,002 ฉบับ, เกิน 1 |

## Out-of-Scope

- API integration (ยังใช้ mock data)
- BnType variants อื่น (Unsort CC, CA Member, CA Non-Member)
- Popups/Modals
- Export/Print functionality

## การตัดสินใจ / เปลี่ยนแปลง Logic

### [2026-02-20] — Column split ไม่เท่ากัน
- **เปลี่ยนอะไร:** Left 60% / Right 40% (จากเดิม 50/50)
- **ทำไม:** User feedback — ตารางมัดครบ กว้างกว่า มัดขาด-เกิน ตาม design

### [2026-02-20] — Title bar layout เปลี่ยนเป็น flex pairs
- **เปลี่ยนอะไร:** จาก CSS Grid 4 columns → `div.info-pair` flex containers ใน 2-column grid
- **ทำไม:** CSS Grid auto columns ทำให้ "Date:" กับ "Sorting Machine:" share column width เท่ากัน ทำให้ gap หลัง ":" กว้างเกินไป

### [2026-02-20] — Date highlight
- **เปลี่ยนอะไร:** เพิ่ม background `#FEE2E2` + border-radius 6px บน Date pair
- **ทำไม:** ตาม Figma design — Date field มี alert highlight สีชมพู
