# Design Spec: Revoke UNFIT

**Figma Node:** `2:52386`
**Date:** 2026-02-20
**Source:** User screenshot (Figma MCP rate limited — ยังไม่ได้ดึง raw data)

---

## Overall Layout

- Same single-column layout as Unsort CC
- **Nav color:** `nav-blue-light` (#BFD7E1)
- **BG gradient:** TBD (ยังไม่ได้ดึงจาก Figma)

---

## Differences from Unsort CC

### Filter Bar
- 3 dropdowns (ไม่มี Zone/Cashpoint):
  1. **ธนาคาร:** (Bank)
  2. **ศูนย์เงินสด:** (Cash Center)
  3. **ชนิดราคา:** (Denomination)

### Table 1: รายการ Header Card — 10 columns

| # | Column | Key | Notes |
|---|--------|-----|-------|
| 1 | ☐ (checkbox) | checkbox | Select/deselect row |
| 2 | **บาร์โค้ดรายห่อ** | BarcodeWrap | 18-digit code, same per wrap group |
| 3 | **บาร์โค้ดรายมัด** | BarcodeBundle | 22-digit code, unique per item |
| 4 | Header Card | HeaderCardCode | 10-digit code |
| 5 | ธนาคาร | Bank | Bank name (shortened) |
| 6 | ศูนย์เงินสด | CashCenter | Cash Center name |
| 7 | วันเวลาเตรียม | PrepareDate | Preparation datetime |
| 8 | วันเวลานับคัด | CreatedDate | Counting datetime |
| 9 | shift | ShiftName | Shift name |

> **Note:** CC variant มี Zone + Cashpoint แทน บาร์โค้ด + ศูนย์เงินสด

### Table 2: แสดงผลการนับคัด — Same as CC
- 4 columns: ชนิดราคา | ประเภท | แบบ | จำนวนฉบับ
- No difference from Unsort CC variant

### Sample Data (from screenshot)
```
HC Table:
☑ 002002230000001010  002002230000010100002001  0054231005  ธ.กรุงเทพ  ธ.กรุงเทพ สีลม  21/07/2568 14:00  21/07/2568 14:01  บ่าย
☐ 002002230000001010  002002230000010100002002  0054231006  ธ.กรุงเทพ  ธ.กรุงเทพ สีลม  21/07/2568 14:00  21/07/2568 14:01  บ่าย
...

Detail Table:
1000 | ดี     | 17 | 995
1000 | ทำลาย  | 17 | 1
1000 | Reject | 17 | 4
```

---

## TODO (when Figma MCP available)
- [ ] Fetch `get_design_context` → save `design-context.md`
- [ ] Fetch `get_screenshot` → save `screenshot.md`
- [ ] Fetch `get_variable_defs` → save `variables.md`
- [ ] Extract CSS → save `styles.css`
- [ ] Verify BG gradient color
- [ ] Verify exact column widths
