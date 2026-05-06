# Business Logic — Manual Key-in (Frontend)

## Page Flow
1. User navigates to `/Verify/ManualKeyIn`
2. BnType determines variant (CSS class, gradient, Thai text)
3. Page loads with mock header card info + mock results data
4. User can add, edit, delete counting results
5. Save flow: บันทึกข้อมูล → confirm → success
6. Review flow: ตรวจสอบ → select Manager → OTP → success

## Mock Data Mode
- `USE_MOCK_DATA = true` in `manualKeyIn.js`
- `getMockHeaderCardInfo()` — returns HC details (code, dates, bank, cashpoint, personnel)
- `getMockResultsData()` — returns 3 rows (1000/ดี/17/5, 1000/เสีย/17/993, 1000/Reject/17/1)
- Set to `false` when backend API is available

## State Management
```javascript
let resultsData = [];    // Array of counting result rows
let editingIndex = -1;   // Index being edited in modal
let otpTimer = null;     // OTP countdown interval
```

## Core Functions

### addCountingResult()
1. Read active radio values: bnType, denom
2. Read dropdown: series
3. Read input: qty
4. Validate: bnType + denom + series required, qty > 0
5. Check if row already exists (same denom + type + series)
   - Yes → add qty to existing AfterQty, mark IsChanged
   - No → push new row with BeforeQty=0, AfterQty=qty, IsChanged=true
6. Clear input, re-render table

### renderResultsTable()
- Renders all rows from `resultsData`
- Each row: denom badge, type, series, beforeQty, afterQty, edit/delete buttons
- Changed rows: orange marker + highlighted afterQty cell
- Updates count totals (before/after)

### Edit Flow (Modal 1.1)
1. `openEditItem(index)` → populate modal with row data → show modal
2. User changes qty
3. `submitEditItem()` → update `resultsData[index].AfterQty` → mark IsChanged → re-render

### Delete Flow
1. `deleteItem(index)` → splice row from `resultsData` → re-render

### Save Flow (Modal 1.2 → 1.3)
1. `saveAll()` → validate has data → show confirm modal
2. `confirmSave()` → mock: show success modal / real: call `Verify/ManualKeyInSave` API

### Review & Approval Flow (Modal 1.5 → 1.6 → 1.7)
1. `openReviewModal()` → filter changed items → populate review table → show Step A
2. Step A: review data + select Manager dropdown
3. `submitApprovalRequest()` → validate Manager → go to Step B
4. Step B: reason textarea + OTP input + countdown (4:59)
5. `confirmOtp()` → validate OTP (min 4 chars) → mock: show success

## Radio Selection Pattern
- `.mk-radio-item` / `.mk-denom-item` with `.active` class toggle
- `selectRadio(el)` — toggle within `.mk-radio-options` group
- `selectDenom(el)` — toggle within `.mk-denom-options` group
- `getActiveRadioValue(groupId)` — read `data-value` from active item

## OTP Countdown
- 299 seconds (4:59) countdown
- `startOtpCountdown()` → setInterval every 1s
- `updateOtpDisplay(seconds)` → format as MM:SS
- `resendOtp()` → restart countdown

## AJAX Service Paths (when USE_MOCK_DATA = false)
```javascript
$.requestAjax({
    service: 'Verify/ManualKeyInSave',
    type: 'POST',
    parameter: { items: resultsData }
});
```

## Alert System
- `showSuccess(message)` — Bootstrap modal with checkmark
- `showError(message)` — SweetAlert2 warning (fallback: native alert)
