# Screenshot Description - Node 2:25077

**Node:** Edit Single Item / Preparation - Edit Single Item - 13
**Date:** 2026-02-19

## Visual Description

The screenshot shows a modal dialog overlaid on a dark semi-transparent backdrop (rgba(12,12,12,0.38)). The modal is a white rounded card centered on screen.

### Top Bar
- Title: **"ตรวจสอบการแก้ไข"** (Review Edit) in bold/medium weight, 24px, black text
- Bottom border separator (slate/300)

### Content Area

#### Sub-heading
- **"เตรียมแก้ไขข้อมูล 1 รายการ"** (Prepare to edit 1 item) - 24px medium weight
- **"Header Card  0054941526"** - 16px regular, showing the header card number

#### Summary Table: "แสดงผลการนับคัด" (Show counting results)
- Header row shows: "จำนวนก่อน: **1002** ฉบับ" (Before: 1002 copies) and "จำนวนหลัง: **1002** ฉบับ" (After: 1002 copies) - bold numbers in orange/warning color (#b45309)
- Column headers on teal/gray background (#d6e0e0):
  - ชนิดราคา (Denomination) - with sort icon
  - ประเภท (Type) - with sort icon
  - แบบ (Series) - with sort icon
  - ก่อนปรับ (ฉบับ) (Before adjustment) - right-aligned, with sort icon
  - หลังปรับ (ฉบับ) (After adjustment) - right-aligned, orange header text (#ca6510), with sort icon

#### Table Data Rows (3 rows visible):
1. **Row 1** (white bg): Denomination badge "1000" | ดี (Good) | 17 | 993 | 992 (orange)
2. **Row 2** (alternating gray bg #f2f6f6): Denomination badge "1000" | ทำลาย (Destroy) | 17 | 8 | (empty - no change)
3. **Row 3** (white bg): Denomination badge "1000" | Reject | 17 | 1 | 2 (orange)

#### Denomination Badges
- Each badge is 47px x 24px
- Background: #fbf8f4 (warm cream)
- Border: 2px solid #9f7d57 (golden brown)
- Text: "1000" in bold 13px, color #4f3e2b
- Pattern image overlay at 30% opacity with mix-blend-mode: color-burn

### Confirmation Section: "ยืนยันการแก้ไข" (Confirm Edit)
- Label: "เลือก Manager" (Select Manager) - 14px regular
- Dropdown select: Shows "ดนัย มนีกาล" (a person's name)
  - Bootstrap-style select with border #ced4da, rounded 6px
  - Dropdown chevron icon on the right

### Bottom Bar (Footer)
- Left: **"ย้อนกลับ"** (Go Back) button - gray secondary (#6c757d), 160px min-width, white text, rounded 6px
- Right: **"ส่งคำขออนุมัติแก้ไข"** (Submit Edit Approval Request) button - dark blue primary (#003366), white text, rounded 6px

## Key Observations

- This is a **review/confirmation screen** for editing a single item (1 รายการ)
- It shows before/after comparison of banknote counts per denomination/type
- Only rows with changes show the "หลังปรับ" (after) value in orange
- Manager approval is required via dropdown selection before submission
- Two action buttons: go back or submit for approval
