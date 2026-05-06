# Frontend Changelog — Reconsile

## [2026-02-21] SVG Comparison Round 2 — Precise Figma Match

**Compared SVG exports (nodes 1:18004, 1:22405, 1:22426) with CSS — fixed all mismatches:**

1. **Scrollbar** — track `6px transparent` → `8px white + border-left: 1px solid #CBD5E1`; thumb `rgba(0,0,0,0.2)` → `#909090` solid 4px centered (via `background-clip: content-box`); radius `3px → 2px`
2. **Row height** — `40px → 36px` for both denom + summary table (SVG coords confirm 36px is dominant)
3. **Table header height** — padding `8px 12px → 5px 12px` to match SVG 30px header height
4. **Bottom buttons** — padding `8px 0 24px → 0 0 16px` (SVG: ~16px from button bottom to canvas edge)
5. **Scroll background stripe** — `#F8FAFC/40px → #FFFFFF/36px` intervals to match row height + white color
6. **Info-item alignment** — `baseline → center` (SVG: badge vertically centered in card)
7. **Info badge** — reverted padding `2px → 4px`, `line-height: 1.2em`, removed `vertical-align`
8. **Success modal** — message `line-height: 1.2em` added (Figma spec), button `min-width: 159px → 160px`

**Files changed:**
- `reconsileTransaction.css` — all above CSS fixes

## [2026-02-21] UI Polish — 7 Issues Fix (Figma QA)

**Issues fixed (from user screenshot comparison):**

1. **Table row borders** — เพิ่ม `border-bottom: 1px solid #CBD5E1` ให้ทั้ง denom + summary tbody tr
2. **Scrollbar styling** — เปลี่ยนจาก 10px gray → 6px thin transparent track + `rgba(0,0,0,0.2)` thumb
3. **Header card alignment** — info badge `padding: 4px → 2px`, `vertical-align: middle`, info-item `align-items: baseline`
4. **Modal spacing** — confirm title `margin-bottom: 40px → 16px`, success title `24px → 16px` (ใกล้เคียง Figma gap)
5. **Table header font weight** — `500 → 600` ทั้ง denom + summary thead th (หนาขึ้นตาม Figma)
6. **Bottom buttons spacing** — padding `0 0 8px → 8px 0 24px` + `flex-shrink: 0` (ไม่ติดขอบล่าง)
7. **Default sorting** — denom table sort by `headerCard asc`, summary sort by `localId desc` (newest first)
   - Refactored sort icon update → `updateSortIcons()` helper function
   - Sort icons reflect default state on page load

**Files changed:**
- `reconsileTransaction.css` — scrollbar, alignment, modal spacing, font weight, bottom padding, row borders
- `reconsileTransaction.js` — default sort fields, `updateSortIcons()` helper, initial icon state

## [2026-02-20] Table Sort — Both Tables Clickable

**Problem:** ลูกศร sort (chevron-expand) บนหัวตารางกดไม่ได้ — denom table มี JS handler แต่ summary table ไม่มี + CSS cursor/hover ขาด

**Fixes:**
- เพิ่ม `summarySortField` / `summarySortDir` state variables
- เพิ่ม sort handler สำหรับ `.reconsile-summary-table .th-sort` ใน `setupSortHandlers()`
- เพิ่ม sorting logic ใน `renderSummaryTable()` (เหมือน denom table)
- เพิ่ม CSS `.reconsile-summary-table thead th.th-sort` — `cursor: pointer`, hover bg `#c5d1d1`

**Files changed:**
- `reconsileTransaction.js` — summary sort state + handlers + render sort
- `reconsileTransaction.css` — summary table th-sort cursor + hover

## [2026-02-20] Table Row Color + Active Row Fix

**Problem:** แถวแรกของ denom table ไม่ขาวตาม Figma เพราะ `.active-row` ใช้ `background: transparent !important` ทำให้ scroll gradient ทะลุมา

**Fixes:**
- `.active-row`: ลบ `background: transparent !important` → ให้ nth-child rule ทำงานปกติ
- Odd rows (1,3,5...): `#F8FAFC` → `#FFFFFF` (ขาว ตาม Figma screenshot)
- Even rows (2,4,6...): `#F2F6F6` (คงเดิม — สลับสี)
- ทั้ง denom table + summary table

**Files changed:**
- `reconsileTransaction.css` — row background + active-row fix

## [2026-02-20] Denom Table Column Width + Panel Gap

**Fixes (from Figma node 1:18004):**
- Column widths: `auto / 110px / 100px` → `33.33% / 33.33% / 33.33%` (ทั้ง 3 column เท่ากัน)
- `.reconsile-main` gap: `8px` → `16px` (ช่องว่างระหว่าง top panel กับ summary table)

**Files changed:**
- `reconsileTransaction.css` — column widths + main gap

## [2026-02-20] Edit Confirmation Flow (Figma nodes 1:21678, 1:22416, 1:22435)

**Changes:**
- เพิ่ม Edit Confirmation Modal HTML (node 1:22416) — "คุณแน่ใจหรือไม่ที่ต้องการแก้ไขข้อมูลนี้"
- JS flow เปลี่ยน: กด "บันทึก" → validate → แสดง confirmation modal → กด "ยืนยัน" → API → success modal
- Edit form body: ใช้ `display: flex; flex-direction: column; gap: 8px` แทน row padding
- Edit form button: `min-width: 119px` → `120px`

**Files changed:**
- `Index.cshtml` — เพิ่ม Edit Confirm Modal HTML
- `reconsileTransaction.js` — เพิ่ม `showEditConfirmation()`, แก้ flow `submitEdit()`
- `reconsileTransaction.css` — edit body gap + button width

## [2026-02-20] Delete + Success Modal Fix (Figma nodes 1:22405, 1:22426)

**Problem:** Delete confirmation modal + Success modal UI ไม่ตรง Figma

**Fixes (from SVG screenshots + Figma MCP specs):**
- เพิ่ม `min-height: 360px` ให้ทั้ง confirm + success `.modal-content` (Figma fixed 360px)
- เพิ่ม `max-width: 560px` ให้ confirm `.modal-dialog`
- Confirm body padding: `32px 32px 16px` → `32px 32px 24px`
- Confirm title margin: `32px` → `40px` (gap = top-bar 16px + body 24px)
- Confirm message margin: `16px` → `0` (padding handles spacing)
- Success modal: ลบ `py-5` + `mt-3` จาก HTML → ใช้ CSS `padding: 32px 32px 24px`
- Success icon: เพิ่ม `display: block; margin-bottom: 16px`
- Success title: เพิ่ม `margin-bottom: 24px`
- เพิ่ม `letter-spacing: 0.025em` ให้ text elements ทุกตัวใน modals
- Button min-width: success `160px` → `159px`

**Files changed:**
- `reconsileTransaction.css` — modal sizing, padding, spacing, letter-spacing
- `Index.cshtml` — ลบ `py-5` และ `mt-3` จาก success modal

## [2026-02-20] Radio/Chip Styling Fix — Match Figma SVG

**Problem:** ชนิดราคา chips + ประเภทธนบัตร radio มี gray bg ตลอด แต่ Figma ต้องมีเฉพาะตอน selected + วงกลม radio ไม่ตรง

**Fixes (from SVG analysis — `Reconcile - Unfit.svg`):**
- `.reconsile-radio-item` bg: `rgba(0,0,0,0.05)` → `transparent` (default)
- `.reconsile-radio-item.selected` bg: `rgba(0,51,102,0.08)` → `rgba(0,0,0,0.05)` (per SVG: `fill="black" fill-opacity="0.05"`)
- `.reconsile-denom-chip` bg: `rgba(0,0,0,0.05)` → `transparent` (default)
- `.reconsile-denom-chip.selected`: removed `outline: 2px solid #003366` → `background: rgba(0,0,0,0.05)`
- Radio button: replaced `accent-color` with custom `appearance: none` styling
  - Unchecked: 15x15px, `background: #FFFFFF`, `border: 1px solid #DEE2E6`
  - Checked: `background: #003366`, `border: 1px solid #003366` + 8x8px white inner dot via `::after`
- Applied same radio styling to both `.reconsile-radio-item` and `.reconsile-denom-chip` radios

**Files changed:**
- `reconsileTransaction.css` — radio/chip background + custom radio circle styling

## [2026-02-20] Layout Gap + Border Fix — Match Figma node 1:18012

**Fixes (from Figma spec comparison):**
- `.reconsile-split` gap: `16px` → `8px` (Figma two-panel row gap between left table and right form)
- `.reconsile-main` gap: `16px` → `8px` (Figma main content gap between top panel / summary / buttons)
- `.reconsile-top-panel`: added `border: 1px solid #CBD5E1` (Figma outer wrapper has border)

**Files changed:**
- `reconsileTransaction.css` — gap + border fixes

## [2026-02-20] Banknote Pattern Fix — Correct Image + Opacity 0.3

**Problem:** ลายธนบัตรไม่ตรง Figma — ใช้รูปผิดตัว + ขาด opacity layer

**Fix (from Figma node `1:18117`):**
- Downloaded correct pattern image from Figma (`image_pattern_figma.png`, imageRef `df40e539ba3b64f6b86cf092de6bc7980e96c99d`)
- Changed from `background-image` on element → `::before` pseudo-element with `opacity: 0.3`
- Pattern positioned at `top: -158px; left: -110px` matching Figma offset (`x: -109.85, y: -158.47`)
- `z-index: -1` on `::before` + `z-index: 0` on parent → pattern renders between bg-color and text
- Applied same fix to table `.qty-badge` elements (removed old `background-image`, added `::before`)

**Files changed:**
- `reconsileTransaction.css` — `::before` pattern overlay for `.denom-badge` and `.qty-badge`
- `wwwroot/images/image_pattern_figma.png` — new pattern image from Figma

## [2026-02-20] Denomination Badge/Chip — Match Figma Spec

**Denom Chips (radio section):**
- Restructured HTML: separated outer container (gray rounded) from inner badge (rectangular colored)
- Added `<span class="denom-badge">` inside each `<label class="reconsile-denom-chip">`
- Outer container: `rgba(0,0,0,0.05)` bg, `border-radius: 8px`, `padding: 4px 8px`, `gap: 8px`
- Inner badge: `47x24px`, `border-radius: 0` (rectangular), `border: 2px solid`
- Pattern image: resized to `445x435px`, repositioned to `-110px -158px` per Figma

**Denom Badge (in tables):**
- Font-weight: `700` → `400` (per Figma)
- Added `letter-spacing: 0.325px`, `line-height: 1.55em`
- Override text color for qty-100: `#8F4242` → `#991B1B` (Figma)
- Override text color for qty-20: `#336C32` → `#3B7E3A` (Figma)

**Files changed:**
- `reconsileTransaction.css` — chip/badge CSS restructured
- `Index.cshtml` — added `<span class="denom-badge">` wrappers

## [2026-02-19] Full Figma MCP Check — All Specs Verified

**Form fields:**
- Select dropdown: custom chevron arrow (SVG data URI), right 12px, padding `8px 12px 8px 16px`
- Quantity input: changed to `type="text"` (no spinner), removed placeholder "0"
- Save button: `align-self: flex-end` (right-aligned per Figma)

**Layout:**
- Top panel: padding `12px` → `8px 8px 16px`, gap `12px` → `8px`
- Denom chips: gap `8px` → `16px`, border-radius `4px` → `8px`, height `28px` → `24px`
- Input field padding: `6px 12px` → `8px 16px`

**Tables:**
- Action column: `14%` → `150px` fixed width
- Action button icon: `12px` → `14px`, gap margin `2px` → `3px`
- Sort icon: `10px` → `12px`, margin `4px` → `2px`, shared rule for both tables

**Modals:**
- Modal title color: `#212121` → `#000000`
- Modal header padding: `16px 24px` → `16px 16px 8px`
- Modal body padding: `24px 31px` → `24px 32px`
- Modal footer padding: fixed to `16px`
- Edit modal body: `16px` → `24px`
- Confirm icon margin: `18px` → `16px` (Figma gap)
- Success modal: message color `#212529` → `#000000`, title color `#212121` → `#000000`
- Success modal button text: "ปิด" → "ตกลง"

## [2026-02-19] Design QA — Modal & Detail Fixes (SVG comparison round 2)

- Edit modal: removed horizontal border lines between key-value rows (not in SVG)
- Delete modal spacing: icon→title gap 16px→18px, title→message gap 8px→32px (per SVG)
- Removed `.reconsile-kv-row:last-of-type` rule (no longer needed)

## [2026-02-19] Design QA — Match Figma spec (SVG comparison)

- Title display text: `Reconsile UNFIT` → `Reconciliation UNFIT` (matches Figma exactly)
- Added Header Card value badge: bg `#E4E6E9`, padding 4px 12px, border-radius 8px
- Radio text color: `#212121` → `#212529` (Body Color per Figma)
- Radio item padding: 6px 12px → 4px 8px (per Figma spec)
- Radio group gap: 12px → 16px
- Input form gap: 12px → 16px
- Table body cell padding: 8px 12px → 6px 8px (per Figma spec)
- Added `border: 1px solid #CBD5E1` to: denom-table-wrapper, input-form, summary-wrapper
- Removed Sorting Machine + Shift from Info Card (not in Figma design — only 3 items: Header Card, จำนวนมัด, Date/Time)
- `dotnet build` passes with 0 errors

## [2026-02-19] Phase 3: Frontend UI from Figma

- Built View (Index.cshtml) from Figma node `1:18004` — 2-section vertical layout:
  - Top: Info Card bar + 2-column split (Denom Table | Input Form with radio groups)
  - Bottom: Summary Table (9 columns) + Cancel/Reconcile action buttons
- Created base CSS (`reconsileTransaction.css`) from Figma design tokens
- Created 4 variant CSS files (unfit, unsort-cc, ca-member, ca-non-member) with gradient overrides
- Created JavaScript (`reconsileTransaction.js`) with `USE_MOCK_DATA = true`
- 5 modals: Edit, Delete, Success, Error, Cancel Reconcile
- All CSS uses `!important` for font-weight (overrides global `* { font-weight: normal !important }`)
- Denomination chips with Figma-spec colors per denomination (20/50/100/500/1000)
- `dotnet build` passes with 0 errors

## [2026-02-19] Initial Creation

- Added Reconsile actions to ReconcilationController (view + 9 AJAX endpoints)
- Created IndexModel (ViewModel) for Reconsile page
- Created IReconsileTransactionService interface (9 methods)
- Created ReconsileTransactionService (API client → api/ReconsileTransaction/)
- Created 7 Object Models (request DTOs)
- Created 5 Service Models (result DTOs) in ServiceModel/Reconsile/
- Registered IReconsileTransactionService in ItemServiceCollectionExtensions
- `dotnet build` passes with 0 errors
