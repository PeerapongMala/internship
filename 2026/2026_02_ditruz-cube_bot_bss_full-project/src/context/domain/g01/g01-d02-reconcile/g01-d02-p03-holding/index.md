# Holding Detail UNFIT

หน้ารายละเอียด Holding สำหรับธนบัตร UNFIT — แสดง 6 ตาราง (2 cols × 3 rows) สรุปสถานะมัดธนบัตร

- **Route:** `/Holding/Unfit`
- **API Route:** ยังไม่มี (ใช้ mock data — `USE_MOCK = true`)

## เอกสาร

| ส่วน | Frontend | Backend |
|------|----------|---------|
| File Map | [frontend/file-map.md](./frontend/file-map.md) | [backend/file-map.md](./backend/file-map.md) |
| Business Logic | [frontend/business-logic.md](./frontend/business-logic.md) | [backend/business-logic.md](./backend/business-logic.md) |
| Changelog | [frontend/changelog.md](./frontend/changelog.md) | [backend/changelog.md](./backend/changelog.md) |

## สรุปย่อ

- 6-panel layout: 2 columns × 3 rows
  - **Left column (มัดครบ):** มัดครบจำนวน ครบมูลค่า (P1), มัดรวมครบจำนวน ครบมูลค่า (P2), รายละเอียดตาม Header Card (P3)
  - **Right column (มัดขาด-เกิน):** มัดขาด-เกิน (P4), มัดรวมขาด-เกิน (P5), มัดเกินโดยยอดจากเครื่องจักร (P6)
- Left column = 60%, Right column = 40%
- Title bar: Date (highlighted pink), Sorting Machine, Supervisor, Shift — 2×2 flex pairs
- Panel 1 click → load P3 detail for selected Header Card
- Nav buttons: Reconcile Transaction, Holding
- ปัจจุบันใช้ mock data เต็ม (USE_MOCK = true)

## Figma

- **File:** `Figma_BSS---Reconciliation--rev_1-`
- **URL:** https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=1-18004&m=dev
- **Reconcile - Unfit:** node-id=`1-18004`
- **Design docs:** [design/README.md](./design/README.md) | [node-1-18004-reconcile-unfit/](./design/node-1-18004-reconcile-unfit/)

## งานค้าง (Pending Tasks)

### 1. เชื่อม API จริง
**สถานะ:** ค้าง — backend ยังไม่มี API สำหรับ Holding Detail
- เปลี่ยน `USE_MOCK = false` ใน JS
- สร้าง API endpoints ที่ backend
- เชื่อม `loadAllPanels()` กับ API จริง
- เชื่อม `loadP3Detail(headerCard)` กับ API จริง

### 2. Backend Controller/Service/Repository
**สถานะ:** ค้าง — ยังไม่ได้สร้าง
- สร้าง API endpoints สำหรับ Holding Detail
- ปัจจุบัน frontend controller (`HoldingController`) มีแค่ action `Unfit()` ที่ return view

### 3. รองรับ BnType variants อื่น
**สถานะ:** ค้าง — ปัจจุบันมีแค่ Unfit
- Unsort CC, Unsort CA Member, Unsort CA Non-Member
- ต้องเพิ่ม CSS gradient variants + controller actions
