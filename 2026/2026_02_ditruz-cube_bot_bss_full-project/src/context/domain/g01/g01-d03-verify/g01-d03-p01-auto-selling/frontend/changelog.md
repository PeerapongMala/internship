# Changelog — Verify Auto Selling (Frontend)

## 2026-02-19 — Frontend Rewrite from Figma

### View (Index.cshtml) — Rewritten
- **Before**: Copied from Reconcile (3-panel scanner layout)
- **After**: Built from Figma spec (6-panel layout, 2 columns x 3 rows)
- Added: Title bar with info panel + 3 action buttons
- Added: Filter bar (5 dropdowns, hidden by default)
- Added: 2-column content panels (flex 845:555)
- Added: Detail panel + Adjustment panel (hidden, shown on HC click)
- Added: Footer bar with Cancel/Verify/SendCBMS buttons
- Removed: Scanner section (not in Figma design)
- Kept: Popup modals (editFormModal, deleteConfirmTableModal, etc.)
- Source: Figma nodes `2:20263` (default) + `2:18859` (detail+adjustment)

### CSS (verifyTransaction.css) — Rewritten
- **Before**: 1631 lines copied from Reconcile
- **After**: 1524 lines built from Figma specs
- Imported styles from `node-2-20263-default/styles.css` and `node-2-18859-detail-adjustment/styles.css`
- All typography uses `'bss-pridi', sans-serif !important`
- Content panels use flex-based proportional sizing (845:555)
- Tables use flex-based div layout (not HTML tables)

### JS (verifyTransaction.js) — Rewritten
- **Before**: 1309 lines for Reconcile 3-table layout with scanner
- **After**: 876 lines for new 6-panel interaction model
- New state: 5 table datasets + detail data + selected row tracking
- Generic `renderTable()` with 3 modes: left, right, right-no-action
- `selectRightRow()` → shows detail + adjustment panels
- Radio button management for adjustment panel
- `saveAdjustment()` with mock mode
- Preserved: Edit/Delete modal flows with OTP steps

## 2026-02-19 — Initial Scaffold (Backend Models + Services)
- Created 7 request models, 5 service result models
- Created service interface + implementation
- Created MVC controller with BnType variant logic + 9 AJAX endpoints
- Created ViewModel (IndexModel)
- Registered in ItemServiceCollectionExtensions.cs
- Pattern: copied from Reconcile Transaction, renamed Reconcile → Verify

## 2026-02-19 — Popup Figma Specs Fetched
- Fetched 4 popup specs (5 files each):
  - `node-2-23259-edit-manual-keyin/` — Edit & Manual Key-in popup
  - `node-2-25046-success-modal/` — Save success modal
  - `node-2-25077-edit-single-item/` — Edit single item popup
  - `node-2-31555-cancel-send-otp/` — Cancel Send OTP popup
