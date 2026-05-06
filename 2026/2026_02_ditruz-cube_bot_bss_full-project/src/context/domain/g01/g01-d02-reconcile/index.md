# โดเมน Reconciliation

โดเมน Reconciliation จัดการเรื่องการกระทบยอดธนบัตร ครอบคลุมการตรวจสอบรายการธนบัตรที่ผ่านการคัดแยก และสรุปผลการกระทบยอด

## รายชื่อหน้า

| หน้า | Path | คำอธิบาย |
|------|------|----------|
| [Reconcile Transaction](./g01-d02-p01-transcation/index.md) | `/Reconcilation/ReconcileTransaction` | ตารางรายการกระทบยอดธนบัตร (ดูรายการ, filter, detail popup) |
| [Reconsile](./g01-d02-p02-reconsile/index.md) | `/Reconcilation/Reconsile` | จัดการกระทบยอด (scan, เพิ่ม/แก้ไข/ลบ, สรุปยอด) |
| [Holding (No Detail)](./g01-d02-p04-holding-no-detail/index.md) | `/Reconcilation/Holding` | สรุปยอด Holding + ส่งยอด Reject |

## Shared Frontend Files

p01, p02 ใช้ Controller ร่วมกัน / p04 ใช้ HoldingController (relative จาก `project/frontend/BSS_WEB/`):

| ประเภท | Path | ใช้โดย |
|--------|------|--------|
| Controller | `Controllers/ReconcilationController.cs` | p01, p02, p04 |

## Notes

- p01 (Reconcile Transaction) = หน้าแสดงรายการ + filter + detail popup
- p02 (Reconsile) = หน้ากระทบยอดจริง (scan header card, เพิ่ม/แก้ไข/ลบ denomination, สรุปยอด)
- p04 (Holding No Detail) = สรุปยอด holding + ส่งยอด Reject (UI คล้าย Verify Confirmation)
- Backend แยกคนละ service/repository (ไม่ share)
- "Reconsile" เป็นชื่อ code ภายใน (สะกดตั้งใจ) — display text ใช้ "Reconciliation"
