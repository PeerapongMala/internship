# BSS Shared JS Modules

JavaScript utilities ที่ใช้ซ้ำกันข้ามหน้า (Verify, Revoke, Reconcile)
แยกออกมาเป็น module namespace เพื่อลด duplication

## Modules

| File | Namespace | Functions | Used By |
|------|-----------|-----------|---------|
| `bss-datetime.js` | `BssDateTime` | `.format()`, `.formatDateOnly()`, `.showCurrent()`, `.startClock()` | All pages |
| `bss-formatters.js` | `BssFormat` | `.numberWithCommas()`, `.getDenomBadgeClass()`, `.denomBadgeHtml()` | All pages |
| `bss-modal.js` | `BssModal` | `.setStep()`, `.chain()`, `.showInlineError()`, `.hideInlineError()`, `.showSuccess()`, `.showError()` | Verify, Reconcile |
| `bss-sort.js` | `BssSort` | `.createState()`, `.toggle()`, `.updateIcons()`, `.compare()` | All pages |
| `bss-dom.js` | `BssDom` | `.setText()`, `.setHtml()`, `.show()`, `.hide()`, `.toggleFilter()`, `.escapeHtml()` | All pages |

## How to Use

ใน `.cshtml` view ให้เพิ่ม `<script>` ก่อนไฟล์ page-specific:

```html
<!-- Shared JS modules -->
<script src="~/js/shared/bss-datetime.js"></script>
<script src="~/js/shared/bss-formatters.js"></script>
<script src="~/js/shared/bss-sort.js"></script>
<script src="~/js/shared/bss-dom.js"></script>
<script src="~/js/shared/bss-modal.js"></script>

<!-- Page-specific -->
<script src="~/js/revoke/revokeTransaction.js"></script>
```

## Usage Examples

### DateTime

```javascript
// แทน formatDateTime(dateStr)
var formatted = BssDateTime.format('2025-07-21T14:00:00');
// → "21/7/2568 14:00"

// แทน showCurrentDateTime()
BssDateTime.showCurrent('infoDate');

// Auto-update clock ทุก 1 นาที
BssDateTime.startClock('infoDate', 60000);
```

### Formatters

```javascript
// แทน numberWithCommas(x)
var text = BssFormat.numberWithCommas(1000000);
// → "1,000,000"

// แทน getDenomBadgeClass(price)
var cls = BssFormat.getDenomBadgeClass(1000);
// → "qty-badge qty-1000"

// สร้าง badge HTML สำเร็จ
var html = BssFormat.denomBadgeHtml(500);
// → '<span class="qty-badge qty-500">500</span>'
```

### Sort

```javascript
// สร้าง state
var sortState = BssSort.createState();

// Toggle sort
BssSort.toggle(sortState, 'HeaderCardCode');
// sortState = { column: 'HeaderCardCode', direction: 'asc' }

// Update icons
BssSort.updateIcons('hcTable', sortState.column, sortState.direction);

// Sort data
data.sort(function(a, b) {
    return BssSort.compare(a, b, sortState.column, sortState.direction);
});
```

### Modal

```javascript
// แทน setModalStep(modalId, stepId)
BssModal.setStep('otpModal', 'step-supervisor');

// แทน chainModal(closeModalId, openCallback)
BssModal.chain('editModal', function() {
    new bootstrap.Modal(document.getElementById('otpModal')).show();
});

// Success / Error
BssModal.showSuccess('successModal', 'successMessage', 'Revoke สำเร็จ');
BssModal.showError('errorModal', 'errorMessage', 'เกิดข้อผิดพลาด');
```

### DOM

```javascript
// แทน document.getElementById(...).textContent = ...
BssDom.setText('totalCount', '100');

// แทน toggleFilter()
BssDom.toggleFilter('filterSection');

// Escape HTML
var safe = BssDom.escapeHtml(userInput);
```

## Migration Guide

เมื่อ migrate หน้าใดไปใช้ shared JS:

1. เพิ่ม `<script>` ของ shared module ใน view (ก่อน page-specific JS)
2. Replace function calls:
   - `formatDateTime(x)` → `BssDateTime.format(x)`
   - `numberWithCommas(x)` → `BssFormat.numberWithCommas(x)`
   - `getDenomBadgeClass(x)` → `BssFormat.getDenomBadgeClass(x)`
   - `updateSortIcons(...)` → `BssSort.updateIcons(...)`
   - `setModalStep(...)` → `BssModal.setStep(...)`
   - `chainModal(...)` → `BssModal.chain(...)`
   - `toggleFilter()` → `BssDom.toggleFilter()`
3. ลบ function definitions ที่ซ้ำกันออกจาก page-specific JS
4. ทดสอบให้ทำงานเหมือนเดิม

**สำคัญ:** ยังไม่ต้อง migrate ทุกหน้าพร้อมกัน — ทำทีละหน้าได้
Page-specific JS ที่ยัง define function เดิมก็จะ override shared ได้ไม่มีปัญหา
