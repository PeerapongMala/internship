# Design Spec: Revoke — Parent Frame Overview

**Figma Node:** `2:51049`
**Date:** 2026-02-20

---

## Overall Layout

- **Page Size:** 1440 x 900 px (per variant frame)
- **Background:** Full-width gradient (variant-specific) via `body::before`
- **Font Family:** Pridi (registered as `bss-pridi` in CSS)
- **Layout:** Single-column (ต่างจาก Verify 6-panel)

---

## Variant Frames

| Node ID | Variant | CSS Class | Nav Color | BG Gradient |
|---------|---------|-----------|-----------|-------------|
| `2:51051` | Unsort CC | `revoke-unsort-cc` | `nav-orange` (#F2B091) | `#f5a986 → #f8d4ba` |
| `2:52386` | UNFIT | `revoke-unfit` | `nav-blue-light` (#BFD7E1) | TBD |
| `2:51248` | CA Member | `revoke-ca-member` | `nav-green` | `#afc5aa → #d3e3cd` |
| `2:51641` | CA Non-Member | `revoke-ca-non-member` | `nav-purple` | `#bac0d1 → #c3d0de` |

---

## Page Structure (1440 x 900 px)

### 1. Navigation Header (h=40px)
- Full-width, variant-colored background
- Logo + system name + menu items + user profile

### 2. Title Bar (h=62px)
- Left: "Revoke {VARIANT}" — Pridi SemiBold 30px, color #212121
- Right: Date + Supervisor info

### 3. Filter Bar
- 3-4 dropdowns depending on variant
- CC/CA Member: ธนาคาร, Zone, Cashpoint, ชนิดราคา
- UNFIT/CA Non-Member: ธนาคาร, ศูนย์เงินสด, ชนิดราคา
- Filter button (right): `#003366` bg, white icon + text

### 4. Table 1: รายการ Header Card
- Card: white bg, 1px border #CBD5E1, border-radius 12px
- Section header: "รายการ Header Card" (Pridi SemiBold 16px)
- Column headers: bg #D6E0E0, Pridi Medium 13px, sortable
- Row height: ~33px
- **CC/CA Member columns (8):** ☐ | Header Card | ธนาคาร | Zone | Cashpoint | วันเวลาเตรียม | วันเวลานับคัด | shift
- **UNFIT/CA Non-Member columns (10):** ☐ | บาร์โค้ดรายห่อ | บาร์โค้ดรายมัด | Header Card | ธนาคาร | ศูนย์เงินสด | วันเวลาเตรียม | วันเวลานับคัด | shift

### 5. Table 2: แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้
- Card: white bg, 1px border #CBD5E1, border-radius 12px
- Column headers: bg #D6E0E0, h=30px
- **Columns (4):** ชนิดราคา | ประเภท | แบบ | จำนวนฉบับ
- Row height: 40px
- Zebra striping: odd #F2F6F6, even white
- Denomination badge: สี่เหลี่ยม (no border-radius), bold 700

### 6. Action Row
- Flex row, justify-end, padding 8px vertical
- Revoke button: 229px, bg #003366, border-radius 8px, text "Revoke" (Pridi 20px white)

---

## Confirm Modal (node 2:52202)

- Table showing selected HC items
- Manager dropdown selector
- Confirm + Cancel buttons
- Max-height ~500px with scroll

---

## Key Differences from Verify Auto Selling

| Aspect | Verify | Revoke |
|--------|--------|--------|
| Layout | 6-panel (2 columns x 3 rows) | Single-column (2 stacked tables) |
| Right panel | Detail + Adjustment + Summary tables | ไม่มี |
| Scan bar | มี (Header Card scan input) | ไม่มี |
| Edit/Delete modals | มี (Edit, OTP, Delete) | ไม่มี |
| Print report | มี | ไม่มี |
| Action | Send to CBMS / Cancel Send | Revoke only |
| Table 1 checkbox | มี | มี |
| Table 2 checkbox | ไม่มี | ไม่มี |
