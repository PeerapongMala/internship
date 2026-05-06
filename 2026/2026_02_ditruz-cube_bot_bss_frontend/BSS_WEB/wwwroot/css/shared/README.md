# BSS Shared CSS Modules

CSS ที่ใช้ซ้ำกันข้ามหน้า (Verify, Revoke, Reconcile, Preparation)
แยกออกมาเป็น module เพื่อลด duplication และให้ทีมทำงานสะดวก

## Modules

| File | Description | Used By |
|------|-------------|---------|
| `bss-modal-popup.css` | Modal base (content, top-bar, action-bar, btn-popup variants, success/error icons) | Verify, Revoke, Reconcile |
| `bss-badges.css` | Status badges (.badge-status--*) + denomination badge + edited badge | Verify, Revoke, Reconcile |
| `bss-scrollbar.css` | Custom webkit/firefox scrollbar (.bss-scrollbar, .bss-scrollbar-transparent) | Verify, Revoke, Reconcile |
| `bss-sort.css` | Sort header indicators (.th-sort, .sort-icon) | Verify, Revoke, Reconcile |
| `bss-table-section.css` | Table section header & count bar | Verify, Revoke |
| `bss-review-table.css` | Review table inside modals (OTP/Delete) | Verify, Reconcile |
| `bss-edit-form-modal.css` | Edit form & alert modals (600px, grid layout) | Verify, Reconcile |
| `bss-otp-modal.css` | OTP template modal + delete confirm | Verify, Reconcile |
| `bss-print-report-modal.css` | Print report modal (1346px) | Verify, Reconcile |

## How to Use

ใน `.cshtml` view ให้เพิ่ม `<link>` ก่อนไฟล์ page-specific:

```html
<!-- Shared modules -->
<link rel="stylesheet" href="~/css/shared/bss-modal-popup.css" />
<link rel="stylesheet" href="~/css/shared/bss-badges.css" />
<link rel="stylesheet" href="~/css/shared/bss-scrollbar.css" />
<link rel="stylesheet" href="~/css/shared/bss-sort.css" />
<link rel="stylesheet" href="~/css/shared/bss-table-section.css" />

<!-- Page-specific (overrides shared if needed) -->
<link rel="stylesheet" href="~/css/verify/verifyTransaction.css" />
```

## Migration Guide

เมื่อ migrate หน้าใดหน้าหนึ่งไปใช้ shared module:

1. เพิ่ม `<link>` ของ shared module ใน view
2. ลบ CSS rules ที่ซ้ำกันออกจากไฟล์ page-specific
3. ทดสอบ UI ให้เหมือนเดิม
4. Page-specific CSS ควรเหลือแค่ layout + overrides เฉพาะหน้า

**สำคัญ:** ยังไม่ต้อง migrate ทุกหน้าพร้อมกัน — ค่อยๆทำทีละหน้าได้
shared module จะไม่กระทบหน้าเดิมที่ยังไม่ได้เพิ่ม `<link>`
