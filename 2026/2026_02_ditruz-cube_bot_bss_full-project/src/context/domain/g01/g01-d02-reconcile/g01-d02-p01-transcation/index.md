# Reconciliation Transaction

จัดการรายการกระทบยอดธนบัตร (Reconciliation Transaction)

- **Route:** `/Reconcilation/ReconcileTransaction`
- **API Route:** `api/ReconcileTransaction`

## เอกสาร

| ส่วน | Frontend | Backend |
|------|----------|---------|
| File Map | [frontend/file-map.md](./frontend/file-map.md) | [backend/file-map.md](./backend/file-map.md) |
| Business Logic | [frontend/business-logic.md](./frontend/business-logic.md) | [backend/business-logic.md](./backend/business-logic.md) |
| Changelog | [frontend/changelog.md](./frontend/changelog.md) | [backend/changelog.md](./backend/changelog.md) |

## สรุปย่อ

- รองรับ 4 variants: Unfit, Unsort CC, Unsort CA Member, Unsort CA Non-Member
- 3-panel layout: Preparation (left), Preparation + Data from Machine (center), Header Card from Machine (right)
- Scan Header Card → สร้าง ReconcileTran
- Reconcile action with OTP verification (Supervisor + Manager)
- Cancel Reconcile with report printing
- Status Flow: Reconciliation(11) → Reconciled(13) → Approved(16) → Verify(17)

## Figma

- Flow ทั้งหมด: node-id=2-34689
- หน้าหลัก: node-id=32-25438
- Unfit variant: node-id=32-26428
- Unsort CC variant: node-id=2-36001
- Unsort CA Member variant: node-id=2-36565
- Unsort CA Non-Member variant: node-id=2-37129
- รายละเอียดเพิ่มเติม: node-id=2-38451, 2-39725, 2-43372
- Popups: node-id=2-41247

## งานค้าง (Pending Tasks)

### 1. Navbar Dropdown — เพิ่ม Holding, Holding Detail
**สถานะ:** ค้าง — ต้องเพิ่ม rows ใน DB

Navbar dropdown (Reconciliation > sub-menu) มาจาก `MenuViewComponent` → `GetMenuItemsAsync()` → DB table `bss_mst_menu`

**ปัจจุบัน** menu_id=3 (Reconciliation) มี children:
| menu_id | menu_name | display_order |
|---------|-----------|---------------|
| 20 | Reconciliation Transaction | 20 |
| 21 | Operation Reconciliation Setting | 21 |

**SQL ที่ต้องเพิ่ม** (append to seed file `project/backend/BSS_API/Database/Insert/bss_mst_menu.sql`):
```sql
INSERT INTO [dbo].[bss_mst_menu]
   ([menu_name], [menu_path], [display_order], [controller_name], [action_name], [parent_menu_id], [is_active], [created_by], [created_date], [updated_by], [updated_date])
VALUES
(N'Holding', N'/Holding/Index', 22, N'Holding', N'Index', 3, 1, 1, CURRENT_TIMESTAMP, NULL, NULL),
(N'Holding Detail', N'/Holding/HoldingDetail', 23, N'Holding', N'HoldingDetail', 3, 1, 1, CURRENT_TIMESTAMP, NULL, NULL);
```

**หมายเหตุ:** ต้องเพิ่ม rows ใน `bss_mst_role_permission` ด้วย เพื่อให้ role ที่ต้องการเห็นเมนูนี้

### 2. Action Button onclick — ยังเป็น TODO stubs
- `openSecondScreen()` — TODO
- `openHoldingPage()` — TODO
- `openHoldingDetailPage()` — TODO
