# Changelog — Manual Key-in (Frontend)

## 2026-02-19 — Initial Implementation (Frontend Only)

### Scope
- CTO directive: Frontend UI + Mock Data only
- Backend รอ business logic จากลูกค้า

### ViewModel (Index.cshtml.cs) — Created
- `IndexModel : PageModel` with BnType properties
- Properties: BnTypeName, BnTypeNameDisplay, CssVariantClass, BnTypeCode

### Controller (VerifyController.cs) — Modified
- Added `ManualKeyIn()` action with BnType variant logic
- Pattern matches existing `VerifyAutoSelling()` action
- Returns `View("~/Views/Verify/ManualKeyIn/Index.cshtml", model)`

### View (Index.cshtml) — Created
- ~320 lines, built from Figma PNG screenshots (1.0–1.7)
- Main page: title bar, header card row, form section, info panel, results table, footer
- 4 modals: edit item, confirm save, success, review (2-step with OTP)
- CSS: links all.css + manualKeyIn.css + conditional variant CSS
- Hidden inputs: userId, fullName, cssVariantClass, bnTypeCode

### CSS (manualKeyIn.css) — Created
- ~580 lines with `mk-` class prefix
- All font-weight uses `!important` (Style.css override)
- All button hover uses `!important` (Style.css override)
- Covers: form section, radio groups, denomination badges, info panel, results table, all modals

### JS (manualKeyIn.js) — Created
- ~444 lines with `USE_MOCK_DATA = true`
- Mock data: header card info + 3 result rows
- Core: addCountingResult, renderResultsTable, edit/delete/save flows
- Review flow: 2-step modal (Manager selection → OTP verification)
- OTP countdown: 4:59 timer with resend
