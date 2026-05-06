# Design Context — Node 1:21677 (Edit Modal)

## Structure

Standard modal with header + body + footer:
- **Header**: Title "แก้ไขข้อมูล", no close (X) button, border-bottom
- **Body**: 7 key-value rows, only จำนวน (ฉบับ) is editable (number input)
- **Footer**: space-between with Cancel (left) and Save (right) buttons

## Key-Value Fields

1. Header Card — display only
2. เวลานับคัด — display only
3. ชนิดราคา — display only
4. แบบ — display only
5. ประเภท — display only
6. จำนวน (ฉบับ) — **editable** (number input, 87px wide)
7. มูลค่า (บาท) — display only (auto-calculated: qty × denom)

## Interaction

- Open: click edit icon in summary table action column
- Save: recalculates value = qty × denom, updates table row
- Cancel: closes modal, no changes
