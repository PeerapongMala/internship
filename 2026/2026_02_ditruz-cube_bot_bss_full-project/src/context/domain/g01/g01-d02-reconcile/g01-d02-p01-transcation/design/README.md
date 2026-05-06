# Reconciliation Transaction — Design

Screenshots และ design context จาก Figma

## Main Layout (4 variants)

### Unfit (node-id: 32-26428)
- Background: Blue gradient (linear-gradient from navy to light blue)
- 3-column layout: Preparation | Preparation + Data from Machine | Header Card from Machine
- Scanner input สำหรับ Header Card
- Filter: Header Card dropdown + ชนิดราคา dropdown + Clear Filter
- Summary: กระทบยอดแล้วทั้งหมด X มัด
- Info sidebar: Date, Sorter, Reconciliator, Sorting Machine, Shift
- Warning rows: Pink/red highlight for mismatched data

### Unsort CC (node-id: 2-36001)
- Background: Orange/salmon gradient (linear-gradient from #f5a986 to #f8d4ba)
- Same layout and features as Unfit

### Unsort CA Member (node-id: 2-36565)
- Background: Green gradient (linear-gradient from #afc5aa to #d3e3cd)
- Same layout and features as Unfit

### Unsort CA Non-Member (node-id: 2-37129)
- Background: Blue-grey gradient (linear-gradient from #bac0d1 to #c3d0de)
- Same layout and features as Unfit

## UI Components

### Header Section
- Title: "Reconciliation Transaction UNFIT/CC/CA..."
- Nav dropdown: Reconciliation → Holding, Holding Detail, ตั้งค่าการทำงานเริ่มต้น
- Action buttons: เปิดหน้าจอ 2 | Holding | Holding Detail

### Scanner Section
- Label: "สแกน Header Card เพื่อกระทบยอดธนบัตรประเภท [TYPE]"
- Input: Header Card barcode scanner
- Summary: กระทบยอดแล้วทั้งหมด X มัด + location info

### Filter Section
- Header Card dropdown
- ชนิดราคา (denomination) dropdown
- Filter button + Refresh button + Clear Filter button

### Left Panel (Preparation)
- Columns: Header Card, วันเวลาเตรียม, ชนิดราคา, Action (edit/delete)
- Sortable columns

### Center Panel (Preparation + Data from Machine)
- Columns: Header Card, วันเวลาเตรียม, วันเวลาบันทึก, ชนิดราคา, Action
- Pink/red rows = warning (mismatch detected)
- Warning icon on Header Card

### Right Panel (Info + Header Card from Machine)
- Info card: Date, Sorter, Reconciliator, Sorting Machine, Shift
- Header Card from Machine table
- Columns: Header Card, วันเวลาบันทึก, ชนิดราคา, Action
- Red highlighted rows = warning

## Popups (node-id: 2-41247)

1. **แก้ไข Header Card** - Edit header card code with remark
2. **กระทบยอด (Reconcile Detail)** - Denomination breakdown table with tabs
3. **ตรวจสอบยอด (Reconcile verification)** - Compare preparation vs machine data
4. **OTP Supervisor** - OTP verification for supervisor
5. **Confirm Success** - Success confirmation
6. **OTP Manager** - OTP verification for manager (cancel flow)
7. **Cancel Reconcile Report** - Print cancel reconciliation report
8. **Warning Alert** - Quality/Output mismatch alert for manual key-in
