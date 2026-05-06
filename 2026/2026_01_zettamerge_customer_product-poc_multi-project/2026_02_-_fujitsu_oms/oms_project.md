# OMS UI Project — Fujitsu Retail Thailand

> **Last updated:** 2026-02-27
> **Rule:** Update this file after every prompt/change to the OMS project.

---

## 1. Overview

Frontend-only Order Management System prototype for Thailand retail enterprise (Fujitsu project). No backend — all state in browser `localStorage`. Fully interactive demo with 6 modules.

**Project path:** `2026_02_-_fujitsu_oms/oms-ui/`
**Dev server:** `npm run dev` → localhost:5173 (or 5174 if 5173 in use)
**Branch:** `user/arm`

---

## 2. Tech Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Build | Vite | 7.3 |
| Framework | React + TypeScript | 19.2 / 5.9 |
| UI Library | Ant Design | 6.3 |
| Routing | React Router | 7.13 |
| Icons | @ant-design/icons | 6.1 |
| Signature | react-signature-canvas | 1.1.0-alpha.2 |
| Dates | dayjs | 1.11 |
| i18n | Custom LanguageContext (EN/TH) | — |
| Theme | CSS variables + antd ConfigProvider | — |
| State | Zustand (per-module) + AppContext bridge | 5.x |
| Animation | Framer Motion | 12.x |

---

## 3. File Structure

```
oms-ui/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
└── src/
    ├── main.tsx                          # Entry point
    ├── App.tsx                           # Providers + Router (7 routes)
    ├── types/
    │   ├── index.ts                      # Core TS interfaces + Marketplace/Shipping types + constants
    │   ├── etax.ts                       # ETax wizard types (QRScanResult, CustomerVerification)
    │   └── epvp10.ts                     # PVP10 types (PassportData, VATRefundApplication, status flow)
    ├── services/
    │   ├── api.types.ts                  # ServiceResult<T>, PaginatedResult<T>, delay() helper
    │   ├── oms.service.ts                # Orders, deliveries, POS sync (mock 2s, 90% success)
    │   ├── reservation.service.ts        # Marketplace address fetch, shipping label generation
    │   ├── etax.service.ts               # QR scan, receipt lookup, customer verify, invoice generate
    │   └── epvp10.service.ts             # Passport scan, immigration/KTB checks, offline sync
    ├── stores/
    │   ├── globalStore.ts                # POS status, user profile, network state (persisted: oms_global)
    │   ├── omsStore.ts                   # Orders/deliveries/invoices/logs (persisted: oms_session)
    │   ├── reservationStore.ts           # Online/offline mode state
    │   ├── etaxStore.ts                  # Wizard step, scan result, verification state
    │   └── epvp10Store.ts                # Applications, offline queue (persisted: oms_epvp10)
    ├── mock/
    │   ├── seedData.ts                   # 12 orders (with marketplace), 4 deliveries, 2 invoices, 2 logs
    │   ├── session.ts                    # localStorage CRUD
    │   ├── reservationMock.ts            # 6 Bangkok addresses, tracking number generator
    │   ├── etaxMock.ts                   # 4 QR results, 4 customer verifications
    │   └── epvp10Mock.ts                 # 5 passports (5 nationalities), 3 applications
    ├── i18n/
    │   ├── en.ts                         # English translations (200+ keys)
    │   ├── th.ts                         # Thai translations
    │   └── LanguageContext.tsx            # t() function + lang state
    ├── context/
    │   ├── AppContext.tsx                 # Bridge → Zustand omsStore (backward compat)
    │   └── ThemeContext.tsx               # isDark toggle
    ├── components/
    │   ├── StatusBadge.tsx                # Color-coded order/delivery status tag
    │   ├── SLABadge.tsx                   # Live countdown timer (green/orange/red)
    │   ├── SignatureCanvas.tsx            # Signature capture in modal
    │   ├── ThemeToggle.tsx                # Dark/light switch
    │   ├── LanguageToggle.tsx             # EN/TH switch
    │   ├── PageHeader.tsx                 # Reusable header (flex title + actions)
    │   ├── PageSkeleton.tsx              # Grayscale wireframe skeleton (6 variants incl. epvp10)
    │   ├── PageTransition.tsx            # Route-change skeleton → fade-in wrapper (400ms)
    │   └── TableSearchBar.tsx            # Reusable search input + optional date range picker
    ├── layouts/
    │   └── MainLayout.tsx                 # Mota sidebar (sub-menu) + header + PageTransition
    ├── features/
    │   ├── oms/
    │   │   ├── DashboardPage.tsx          # Stats cards, status chart, SLA list, branch filter
    │   │   ├── OrdersPage.tsx             # All orders wrapper (no tabs)
    │   │   ├── OrderTable.tsx             # Table + Marketplace column + filter + POS sync
    │   │   ├── OrderDetailDrawer.tsx      # Drawer + marketplace badge + Sync to POS button
    │   │   ├── DeliveryPage.tsx           # 3-col grid, 2 sections
    │   │   ├── DeliveryCard.tsx           # Individual delivery card w/ signature
    │   │   └── MarketplaceBadge.tsx       # Color-coded marketplace tag (Lazada/Shopee/TikTok/etc.)
    │   ├── reservation/
    │   │   ├── ReservationPage.tsx         # Dual mode (online/offline), shipping provider, map picker
    │   │   ├── MapPickerMock.tsx           # Mock map with coordinate display + click-to-pin
    │   │   └── ShippingLabel.tsx           # Shipping label modal (tracking #, barcode, print)
    │   ├── etax/
    │   │   ├── ETaxPage.tsx               # Invoice list + generator + XML preview + wizard launcher
    │   │   ├── ETaxWizard.tsx             # 3-step wizard container (Scan → Verify → Complete)
    │   │   ├── ScanStep.tsx              # Step 1: QR scan / receipt ID lookup
    │   │   ├── VerifyStep.tsx            # Step 2: Customer verification + editable fields
    │   │   ├── SuccessStep.tsx           # Step 3: Success result + PDF view + send to iNet
    │   │   └── xmlGenerator.ts            # Mock Thai tax invoice XML
    │   └── epvp10/
    │       ├── EPvp10Page.tsx             # Main e-PVP10 VAT refund page
    │       ├── OfflineBanner.tsx          # Offline mode warning Alert banner
    │       ├── PassportScanner.tsx        # Passport scan UI with mock OCR
    │       └── ValidationStatusBar.tsx    # Step progress bar for refund flow
    └── styles/
        └── global.css                     # Full Mota design system + dark theme + skeleton CSS
```

---

## 4. Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | DashboardPage | Stats, SLA overview, branch filter with skeleton loading |
| `/orders` | OrdersPage | Tabs + table + drawer |
| `/delivery` | DeliveryPage | 3-col delivery cards, 2 sections |
| `/reservation` | ReservationPage | POS reservation form |
| `/etax` | ETaxPage | e-Tax invoice management |
| `/etax/invoice/:invoiceId` | InvoicePDFViewer | Full-page tax invoice PDF viewer |
| `/epvp10` | EPvp10Page | e-PVP10 VAT refund (passport scan, immigration, KTB) |

All routes wrapped in `<MainLayout>` (sidebar + header + `<PageTransition>`).

---

## 5. TypeScript Types

```typescript
// Core types (types/index.ts)
OrderStatus = 'Pending' | 'Picking' | 'ReadyToShip' | 'OutForDelivery' | 'Delivered' | 'Failed'
OrderType = 'online' | 'reservation'
DeliveryStatus = 'Assigned' | 'InTransit' | 'Delivered' | 'Failed'
MarketplaceSource = 'lazada' | 'shopee' | 'tiktok' | 'walk-in' | 'phone'
ShippingProvider = 'flash' | 'dhl' | 'self-delivery'
POSSyncStatus = 'idle' | 'syncing' | 'success' | 'error'
ReservationMode = 'online' | 'offline'

Order { id, orderNumber, type, status, branch, customer{...}, items[], totalAmount, pdpaConsent, slaDeadline, createdAt, updatedAt,
        marketplace?, shippingProvider?, trackingNumber?, posSyncStatus?, coordinates?,
        paymentStatus?('unpaid'|'paid'), receiptId?, paidAt?, paymentMethod? }
Delivery { id, orderId, driverName, status, signatureBase64, deliveredAt, assignedAt }
Invoice { id, orderId, invoiceNumber, xmlContent, sentToInet, sentAt, createdAt }
ActionLog { id, action, orderId, timestamp, user }
SessionState { orders[], deliveries[], invoices[], logs[] }

// e-Tax types (types/etax.ts)
ETaxWizardStep = 'scan' | 'verify' | 'success'
QRScanResult { receiptId, orderId, amount, scannedAt }
CustomerVerification { receiptId, customerName, taxId, address, verified }

// e-PVP10 types (types/epvp10.ts)
PVP10Status = 'pending_scan' | 'scanned' | 'immigrationCheck' | 'immigrationApproved' | 'ktbProcessing' | 'ktbApproved' | 'refundComplete' | 'rejected_immigration' | 'rejected_ktb'
PassportData { passportNumber, fullName, nationality, dateOfBirth, expiryDate, ... }
VATRefundApplication { id, passportData, purchaseAmount, vatAmount, status, ... }
```

Constants: `MARKETPLACE_COLORS`, `SHIPPING_PROVIDER_COLORS`, `PVP10_STATUS_COLORS`, `PVP10_STATUS_FLOW`

**Status Transitions (state machine):**
```
Pending → [Picking, Failed]
Picking → [ReadyToShip, Failed]
ReadyToShip → [OutForDelivery, Failed]
OutForDelivery → [Failed]  (Delivered only via Delivery page)
Delivered → []
Failed → [Pending]
```

**Branches:** Siam Paragon, CentralWorld, EmQuartier, ICON Siam, The Mall Bangkapi

---

## 6. State Management (Zustand + AppContext Bridge)

### Architecture
**Zustand** is the primary state manager with per-module stores. `AppContext` still exists as a backward-compatibility bridge — it reads from `useOmsStore()` and translates `dispatch()` calls to Zustand methods. Components can use either `useAppContext()` or Zustand hooks directly.

### Zustand Stores
| Store | Key | Persist | Purpose |
|-------|-----|---------|---------|
| `globalStore` | `oms_global` | Yes | POS sync status, user profile, network state |
| `omsStore` | `oms_session` | Yes | Orders, deliveries, invoices, logs + all CRUD actions |
| `reservationStore` | — | No | Online/offline mode toggle |
| `etaxStore` | — | No | Wizard step, scan result, verification state |
| `epvp10Store` | `oms_epvp10` | Yes | VAT refund applications, offline queue |

### AppContext Bridge (backward compat)
**Actions:** INIT, UPDATE_ORDER_STATUS, ADD_ORDER, UPDATE_DELIVERY, ADD_DELIVERY, ADD_INVOICE, MARK_INVOICE_SENT, ADD_LOG, RESET_DATA, MARK_ORDER_PAID
— Each action translates to the corresponding `useOmsStore()` method.

### Service Layer
All mock services (`src/services/`) return `ServiceResult<T>` with simulated latency via `delay()`:
- `oms.service.ts` — CRUD + POS sync (2s delay, 90% success rate)
- `reservation.service.ts` — Address fetch, shipping label generation
- `etax.service.ts` — QR scan, receipt lookup, customer verify, invoice generate + XML
- `epvp10.service.ts` — Passport scan, immigration/KTB checks, offline sync

**Auto-create delivery:** When `UPDATE_ORDER_STATUS` changes to `OutForDelivery`, a new Delivery record is auto-created.
**Delivery → Order sync:** DeliveryCard dispatches both UPDATE_DELIVERY and UPDATE_ORDER_STATUS.
**Persistence:** Zustand `persist` middleware → `localStorage`.

---

## 7. Mock Data

### seedData.ts
- **12 orders** across 5 branches, mixed statuses, each with `marketplace` field (lazada, shopee, tiktok, walk-in, phone)
- **8 online + 4 reservation** orders
- **4 deliveries** (del-001 to del-004) — all OutForDelivery/Delivered orders have matching delivery records
- **2 invoices** (1 sent, 1 not sent), **2 action logs**
- Thai customer names, addresses, phone numbers
- Products: Thai electronics/appliances (฿590 – ฿41,190)
- SLA deadlines: some overdue, some within 2hrs, some 24hrs away

### reservationMock.ts
- **6 Bangkok addresses** with lat/lng coordinates (Siam, Chatuchak, Thonglor, etc.)
- `generateTrackingNumber(provider)` — returns Flash/DHL formatted tracking numbers

### etaxMock.ts
- **4 QR scan results** (receipt IDs, order IDs, amounts)
- **4 customer verifications** (Thai names, tax IDs, addresses)

### epvp10Mock.ts
- **5 passport records** (British, Japanese, Chinese, Korean, German nationals)
- **3 pre-existing VAT refund applications** in various validation states

---

## 8. Design System (Mota-Inspired)

### Layout
- **Sidebar:** Defaults to expanded (220px) with icon + text labels. Collapsible to 72px icon-only with hover tooltips via toggle button. Settings button removed.
  - **Sub-menu:** OMS parent group (AppstoreOutlined) → Dashboard / Orders / Delivery children. Collapsed: click navigates to `/`. Expanded: click toggles sub-menu open/close with chevron indicator.
- **Header:** Sticky white bar with page title, reset button, language/theme toggles, avatar
- **Content:** Centered, max-width 1400px, padding 28px 36px
- **Mobile:** Sidebar shrinks to 56px at 768px breakpoint

### Cards
- 3D layered box-shadows (5 shadow layers)
- Border-radius: 20px
- White inner highlight (inset shadow)
- NO hover animation (removed per user request)

### Typography (Elderly-Friendly)
- `--font-xs: 14px`, `--font-sm: 15px`, `--font-base: 16px`, `--font-md: 17px`
- `--font-lg: 20px`, `--font-xl: 24px`, `--font-2xl: 28px`, `--font-3xl: 36px`
- Font: Inter + Noto Sans Thai fallback

---

## 9. Theme System (CSS Variables)

### Light Theme (`:root`)
```css
--content-bg: #f0f0f3       --card-bg: #ffffff
--text-primary: #1a1a1a     --text-secondary: #6b7280
--border-light: #e5e7eb     --border-subtle: #eee
--surface-secondary: #f5f5f7 --surface-tertiary: #fafafa
--text-muted: #888           --icon-muted: #bbb
--success-color: #16a34a     --accent: #1a1a1a
--skeleton-base: #e8e8e8     --skeleton-shine: #f5f5f5
```

### Dark Theme (`[data-theme='dark']`)
```css
--content-bg: #0a0a0a       --card-bg: #161616
--text-primary: #f0f0f0     --text-secondary: #999
--border-light: #2a2a2a     --border-subtle: #2a2a2a
--surface-secondary: #1e1e1e --surface-tertiary: #1a1a1a
--text-muted: #999           --icon-muted: #666
--success-color: #22c55e     --accent: #fff
--skeleton-base: #222        --skeleton-shine: #333
```

### Dark Theme CSS Overrides
All antd components have `[data-theme='dark']` overrides in global.css:
- Typography, Card titles, Table (header/body/hover/empty)
- Drawer (content/header/title/close), Modal (content/header/title/close)
- Inputs, Select dropdown (selected/active items), DatePicker
- Buttons (default/text/primary, disabled primary)
- Descriptions (bordered labels/content)
- Form labels, Checkbox, Tabs
- Timeline, Pagination, Progress bar
- Popconfirm/Popover
- Stat cards (.mota-stat-value, .mota-stat-icon)

### Theme Toggle
- `ThemeContext.tsx` stores `isDark` in state
- Persisted to `localStorage` key `oms_theme`
- `MainLayout.tsx` sets `data-theme="dark"|"light"` on root div
- `App.tsx` passes `isDark` to antd `ConfigProvider` (`darkAlgorithm` / `defaultAlgorithm`)

---

## 10. Internationalization

- **Languages:** English (en.ts), Thai (th.ts)
- **200+ translation keys** covering all UI text including marketplace, reservation modes, shipping, e-Tax wizard, e-PVP10 statuses, offline mode
- **LanguageContext.tsx:** provides `t(key)` function, `lang`/`setLang` state
- **LanguageToggle.tsx:** antd Switch component EN/TH
- Persisted to `localStorage` key `oms_lang`
- Mock data (names, addresses, products) always in Thai regardless of UI language
- Notable keys: `needToMark`, `markedDelivered`, `resetConfirm`, all status labels

---

## 11. Component Details

### StatusBadge
Maps OrderStatus/DeliveryStatus → antd Tag with predefined colors. Translates label via `t()`.

### SLABadge
- `setInterval` countdown every second
- Thresholds: >2h green, 30m–2h orange, <30m red, past deadline = red pulsing "OVERDUE"
- Format: "Xh Ym remaining"

### SignatureCanvas
- `react-signature-canvas` inside antd Modal
- Canvas: 432×200
- Actions: Clear / Cancel / Save (exports base64 PNG)
- Background uses `var(--card-bg)` for theme support

### DeliveryCard
- Shows order#, customer name/phone/address, items list with prices
- Signature preview (base64 image)
- "Capture Signature" + "Mark Delivered" buttons
- All colors theme-aware via CSS variables

### OrderDetailDrawer
- antd Drawer (width 520)
- Sections: Status+SLA, Customer info (Descriptions), Items table, **Payment section**, Status update buttons (state machine), Timeline
- **Payment section:** If unpaid → green "Customer Pay" button; if paid → receipt info (ID, date, method) + "View Receipt" button
- **Receipt Modal:** Shows receipt ID, order number, customer name/phone, items table, total, payment method, paid date, "Paid" badge
- Status buttons: Picking, ReadyToShip, OutForDelivery, Failed, Retry (no Delivered — only via Delivery page)

### ETaxPage / xmlGenerator
- Select delivered order → generate invoice (INV-YYYYMMDD-XXXX format)
- Table columns: Invoice#, Order#, Customer Name, Sent to iNet, Date, Actions
- Mock XML with Thai tax invoice format (seller/buyer info, items, VAT 7%)
- "Send to iNet" simulated with setTimeout
- XML preview in `<pre>` tag inside Modal
- **Wizard launcher:** "New Invoice Wizard" primary button at top, opens 3-step wizard

### ETaxWizard (3-step wizard)
- Container with Ant Design `Steps` (Scan / Verify / Complete), framer-motion slide animations
- Back button on verify step, Close button always visible
- **ScanStep:** QR scan (pulsing animation, 2s mock delay) or manual receipt ID search
- **VerifyStep:** Auto-fetches customer data, shows Descriptions with editable Tax ID + address, "Confirm & Generate Invoice" button
- **SuccessStep:** Ant Design Result (success), "View PDF" (Modal with XML), "Send to iNet", "Done" buttons
- State managed via `useETaxStore` (Zustand): wizardStep, wizardOpen, scanResult, verification
- All text uses `t()` translations (26 new keys in EN + TH)

### MarketplaceBadge
- Ant Design `Tag` (plain/default — no color) displaying marketplace label
- Labels translated via i18n: lazada, shopee, tiktok, walkIn, phoneOrder

### MapPickerMock
- Mock map with dashed border, grid lines, pin icon, coordinate display
- Two modes: read-only (online mode) and interactive (offline mode, click-to-pin)

### ShippingLabel
- Modal with provider header (Flash/DHL), tracking number, sender/recipient info
- CSS barcode mock, Print button (window.print)

### ReservationPage (dual mode)
- `Segmented` control: Online / Offline mode
- **Online:** "Fetch from Marketplace" button → auto-fills address + coordinates, MapPickerMock (read-only)
- **Offline:** Manual entry + MapPickerMock (interactive click-to-pin)
- Shipping provider Select (Flash / DHL / Self-delivery)
- After submit with Flash/DHL: generates ShippingLabel modal
- Navigates to Orders page after submission with success notification

### EPvp10Page
- OfflineBanner (conditional on offline mode)
- Applications table with expandable rows showing ValidationStatusBar
- "New Application" modal: PassportScanner + amount input + auto VAT calculation
- Offline mode toggle, sync button

### PassportScanner
- Dashed scan area, "Scan" button → 2s mock delay → extracted passport data
- Displays result via Ant Design `Descriptions`

### ValidationStatusBar
- Ant Design `Steps` horizontal: 7-step refund flow (pending_scan → refund_complete)
- Handles rejected states as error steps
- "Process Next Step" button to advance validation

### PageSkeleton
- 6 grayscale wireframe skeleton variants: dashboard, orders, delivery, reservation, etax, epvp10
- Each variant matches the real page layout structure
- Uses shimmer animation (`skeleton-shimmer` keyframe with linear-gradient sweep)
- Reusable `Block` and `SkeletonCard` internal components
- Responsive grid layouts (2/3/4 columns, collapse on mobile)

### PageTransition
- Wraps `<Outlet>` in MainLayout to detect route changes
- Shows page-specific skeleton for 400ms on navigation, then fades in content
- Uses `useRef` for prev-path tracking (avoids re-render loop)
- Route-to-skeleton mapping via `ROUTE_SKELETON_MAP`

---

## 12. Loading & Skeleton System

### Page Navigation Loading (PageTransition)
- **Duration:** 400ms
- **Trigger:** Route change detected via `useLocation()` + `useRef`
- **Display:** `PageSkeleton` with route-matched variant
- **After:** Fade-in with `.page-content-enter` CSS animation

### Dashboard Branch Filter Loading
- **Duration:** 400ms
- **Trigger:** Branch dropdown selection change (skips initial render via `useRef`)
- **Display:** `PageSkeleton variant="dashboard"` below the dropdown
- **After:** Fade-in with `.page-content-enter` CSS animation
- Dropdown stays visible above skeleton during loading

### Skeleton CSS
- Variables: `--skeleton-base`, `--skeleton-shine` (light + dark theme)
- `@keyframes skeleton-shimmer` — gradient sweep animation
- Classes: `.skeleton-block`, `.skeleton-card`, `.skeleton-grid` (2/3/4 col), `.skeleton-table-row`, `.skeleton-page`
- `.page-content-enter` — fade-in + translateY(6px) animation (300ms)

---

## 13. Known Issues & Notes

- Node 22.11.0 vs required 22.12.0+ — does not block builds
- Port 5173 may be in use; Vite auto-uses 5174
- All inline hardcoded colors have been replaced with CSS variables
- antd ConfigProvider theme tokens in App.tsx: `colorPrimary: '#1a1a1a'`, `fontSize: 16`, `borderRadius: 12`
- Primary button: explicit `color: #fff`, disabled state with muted bg/text, hover guard `:hover:not(:disabled)`

---

## 14. Change Log

### 2026-02-25 — Session 1: Theme color fix
- Replaced all hardcoded hex colors in inline styles across 5 TSX files with CSS variables
- Added 6 new CSS variables: `--surface-secondary`, `--surface-tertiary`, `--border-subtle`, `--text-muted`, `--success-color`, `--icon-muted`
- Added comprehensive dark-mode overrides for all antd components in global.css
- Files changed: global.css, DeliveryCard.tsx, DashboardPage.tsx, ETaxPage.tsx, SignatureCanvas.tsx, MainLayout.tsx

### 2026-02-25 — Session 2: Dropdown & button fixes
- Dropdown selected color fix (light theme): `.ant-select-item-option-selected` and `.ant-select-item-option-active` styles
- Primary button: explicit `color: #fff`, `.ant-btn-primary:disabled` style, `:hover:not(:disabled)` guard
- Files changed: global.css

### 2026-02-25 — Session 3: Delivery page redesign
- Changed from single-column mobile to 3-column grid (xs=24, md=12, xl=8)
- Two sections: "Need to Mark" + "Marked as Delivered" with section headers
- Added del-004 for ord-011 (synced all OutForDelivery/Delivered orders with delivery records)
- New translation keys: `needToMark`, `markedDelivered` (EN + TH)
- Files changed: DeliveryPage.tsx, global.css, seedData.ts, en.ts, th.ts

### 2026-02-25 — Session 4: Skeleton loading system
- Created `PageSkeleton.tsx` — 5 skeleton variants matching each page layout
- Created `PageTransition.tsx` — route-change detection with skeleton display
- Added skeleton CSS: shimmer animation, block/card/grid/table-row styles, page-content-enter fade-in
- New CSS variables: `--skeleton-base`, `--skeleton-shine`
- Wrapped `<Outlet>` with `<PageTransition>` in MainLayout.tsx
- Files changed: global.css, MainLayout.tsx; new: PageSkeleton.tsx, PageTransition.tsx

### 2026-02-25 — Session 5: Loading duration & loop fix
- Changed LOADING_DURATION from 600ms → 200ms → 400ms in PageTransition.tsx
- Fixed infinite loop: replaced `useState` with `useRef` for `prevPathRef`
- Files changed: PageTransition.tsx

### 2026-02-25 — Session 6: Dashboard branch filter loading
- Added 400ms skeleton loading when changing branch dropdown selection
- Shows `PageSkeleton variant="dashboard"` during loading, fades in real content
- Uses `useRef` to skip skeleton on initial render
- Files changed: DashboardPage.tsx

### 2026-02-25 — Session 7: Orders redesign + dark theme fix
- **Orders page redesign:**
  - Removed tabs — all orders (online + reservation) shown in single table
  - Added "Order Type" column with color-coded Tag (blue=online, purple=reservation)
  - Added Order Type filter (dropdown) alongside existing Branch/Status filters
  - Updated OrdersSkeleton to match new layout (8 columns, no tabs)
  - New translation keys: `orderType`, `online`, `reservation` (EN + TH)
- **Dashboard StatCard refactor:**
  - Replaced hardcoded `iconBg`/`iconColor` props with CSS class variants (`mota-stat-icon--total`, `--pending`, `--delivery`, `--failed`)
  - Light theme: pastel backgrounds with vibrant icons
  - Dark theme: deep saturated backgrounds with light pastel icons
- **Comprehensive dark theme fixes (30+ new CSS rules):**
  - Table filter dropdown: background, menu items, hover, checkboxes, buttons, border
  - Table column sorter/filter trigger icons
  - Empty state: description text, SVG fill colors
  - Modal body + footer border
  - Form validation error messages (red on dark bg)
  - DatePicker: suffix/clear/separator icons, dropdown bg, disabled/out-of-view cells, today button
  - Select: clear/arrow icon colors
  - Popover/Popconfirm: arrow background, confirm button styles
  - Pagination: disabled state, item borders, options selector
  - Message/notification: dark background + shadow
  - Descriptions bordered: label bg + cell borders
  - Table header border
  - Tabs ink bar
  - Card head border
  - Tag border removal
  - Checkbox inner (checked/unchecked)
  - Textarea background
  - Pre/code block text color
  - Primary button disabled dark state
- Files changed: OrdersPage.tsx, OrderTable.tsx, DashboardPage.tsx, PageSkeleton.tsx, global.css, en.ts, th.ts

### 2026-02-25 — Session 8: SLA column sorting
- Added sorter to SLA column in OrderTable — sorts by priority: overdue/soonest deadline first, Delivered/Failed orders pushed to bottom
- Files changed: OrderTable.tsx

### 2026-02-25 — Session 9: Drawer dark theme fix
- **Root cause:** `data-theme` was only on MainLayout div, but Drawer/Modal render as portals to `<body>` — outside the `[data-theme]` scope
- **Fix:** Added `useEffect` in ThemeContext to set `data-theme` on `document.documentElement` (`<html>`), so all portalled components inherit dark theme
- **Drawer-specific dark overrides:**
  - Table header (thead th): dark bg + light text
  - Table body cells: light text + dark borders
  - Table footer: dark bg + light text
  - `<h4>` headings: light text
  - Descriptions title: light text
- **Danger button dark mode:** Red text (#ff6b6b) + red border on transparent bg, hover with red tint
- Files changed: ThemeContext.tsx, global.css

### 2026-02-25 — Session 10: Collapsible sidebar
- **Sidebar expand/collapse:** Added toggle button (MenuFoldOutlined/MenuUnfoldOutlined) at bottom of sidebar
- **Collapsed state (default):** 72px icon-only sidebar with hover tooltips (existing behavior)
- **Expanded state:** 220px sidebar with icon + text labels, smooth 0.25s CSS transition
- **Content area** transitions `margin-left` to match sidebar width
- Logo changes from "OMS" to "OMS Fujitsu" when expanded
- Active indicator bar repositions for expanded layout
- Tooltips auto-hidden in expanded mode (labels visible)
- Mobile responsive: 56px collapsed / 200px expanded
- Files changed: MainLayout.tsx, global.css

### 2026-02-25 — Session 11: Multi-feature update
- **Reservation page redesign:**
  - 2-column layout: left = Customer Info card, right = Products card
  - Product catalog (12 Thai retail items) with search, add/remove, quantity control
  - Branch selector dropdown (replaces random assignment)
  - Running total calculation
  - New translation keys: `products`, `selectProduct`, `addItem`, `noProductsAdded`, `addProductRequired`, `selectBranch` (EN + TH)
- **ETax page:** Added Customer Name column to invoice table
- **Order → Delivery flow:**
  - Removed `Delivered` from `OutForDelivery` status transitions (only via Delivery page with signature)
  - Auto-create delivery record when order status changes to `OutForDelivery` in AppContext reducer
  - Random driver assignment from pool: สมศักดิ์ ขับดี, ประยุทธ์ รถเร็ว
- **Delivery → Order sync:** Already working — DeliveryCard dispatches `UPDATE_ORDER_STATUS` on mark delivered
- Files changed: ReservationPage.tsx, ETaxPage.tsx, AppContext.tsx, types/index.ts, en.ts, th.ts

### 2026-02-25 — Session 12: Out for Delivery notice
- Added info `Alert` in OrderDetailDrawer when order status is `OutForDelivery`
- Message: "Status will change to Delivered after client captures signature and rider marks delivered."
- New translation key: `outForDeliveryNotice` (EN + TH)
- Files changed: OrderDetailDrawer.tsx, en.ts, th.ts

### 2026-02-25 — Session 13: Reservation success notification
- Replaced `message.success` with `notification.success` (top-right placement) after creating reservation
- Shows order number in description
- Includes "Go to Orders" button that navigates to `/orders` page
- New translation key: `goToOrders` (EN + TH)
- Files changed: ReservationPage.tsx, en.ts, th.ts

### 2026-02-26 — Session 14: 4-Module Pluggable Architecture Restructure
Major architecture evolution from monolithic to 4-module pluggable system:

**Phase 1 — Foundation:**
- Installed `zustand` and `framer-motion`
- Extended `types/index.ts`: MarketplaceSource, ShippingProvider, POSSyncStatus, ReservationMode; optional Order fields
- Created `types/etax.ts` and `types/epvp10.ts`
- Created service layer (`services/`): api.types, oms.service, reservation.service, etax.service, epvp10.service — all with mock latency
- Created 5 Zustand stores: globalStore, omsStore, reservationStore, etaxStore, epvp10Store
- Bridged AppContext → Zustand (zero breakage for existing components)

**Phase 2 — OMS Module:**
- Moved dashboard/orders/delivery files to `features/oms/`
- Created MarketplaceBadge component
- Added marketplace column + filter to OrderTable
- Added "Sync to POS" button to OrderDetailDrawer (4 states: idle/syncing/success/error)
- Updated seedData with marketplace fields on all 12 orders

**Phase 3 — Reservation Module:**
- Added online/offline dual mode with Segmented control
- Created MapPickerMock (read-only + interactive modes)
- Created ShippingLabel modal (tracking number, barcode, print)
- Online mode: fetch from marketplace auto-fills address/coordinates
- Shipping provider selection (Flash/DHL/Self-delivery)

**Phase 4 — e-Tax Wizard:** (ETaxWizard, ScanStep, VerifyStep, SuccessStep — framer-motion animations)

**Phase 5 — e-PVP10 Module:** (EPvp10Page, PassportScanner, ValidationStatusBar, OfflineBanner)

**Phase 6 — Layout + Routing + i18n:**
- MainLayout: sub-menu sidebar (OMS parent → Dashboard/Orders/Delivery children)
- App.tsx: updated imports to features/oms/ paths, added /epvp10 route
- PageSkeleton: added epvp10 variant; PageTransition: added epvp10 route mapping
- Added ~80 new i18n keys (EN + TH): marketplace, reservation modes, shipping, wizard, PVP10
- Added sub-menu CSS, passport scan CSS, wizard transition CSS

**New files (27):** types/etax.ts, types/epvp10.ts, services/*, stores/*, mock/{reservationMock,etaxMock,epvp10Mock}.ts, features/oms/MarketplaceBadge.tsx, features/reservation/{MapPickerMock,ShippingLabel}.tsx, features/etax/{ETaxWizard,ScanStep,VerifyStep,SuccessStep}.tsx, features/epvp10/{EPvp10Page,PassportScanner,ValidationStatusBar,OfflineBanner}.tsx
**Files moved (6):** dashboard/orders/delivery → features/oms/
**Files modified (14+):** types/index.ts, context/AppContext.tsx, App.tsx, MainLayout.tsx, seedData.ts, OrderTable.tsx, OrderDetailDrawer.tsx, ReservationPage.tsx, ETaxPage.tsx, en.ts, th.ts, PageSkeleton.tsx, PageTransition.tsx, global.css, package.json

### 2026-02-26 — Session 15: Orders page UX + Search + Per-page search bars
- **Customer Name column:** Removed `ellipsis: true`, set explicit `width: 200` to prevent truncation
- **Date Range filter:** Added `RangePicker` above orders table in OrdersPage, filters by `createdAt`
- **Reusable `TableSearchBar` component** (`components/TableSearchBar.tsx`): accepts `searchText`, `onSearchChange`, `placeholderKey`, optional `showDateRange` + `onDateRangeChange`. Uses `.table-search-bar` CSS class with proper Ant Design outlined variant styling.
- **Search bar moved from navbar to per-page:**
  - Removed search bar from MainLayout header
  - **OrdersPage** — TableSearchBar + RangePicker, searches by orderNumber, customer name, phone, branch
  - **ETaxPage** — TableSearchBar, searches by invoiceNumber, orderNumber, customer name
  - **EPvp10Page** — TableSearchBar, searches by passport number, full name, nationality
- **New i18n keys (5):** `search`, `searchOrders`, `searchInvoices`, `searchApplications`, `dateRange` (EN + TH)
- New file: TableSearchBar.tsx
- Files changed: OrderTable.tsx, OrdersPage.tsx, MarketplaceBadge.tsx, MainLayout.tsx, ETaxPage.tsx, EPvp10Page.tsx, global.css, en.ts, th.ts

### 2026-02-26 — Session 16: Sidebar fix + Search bar fix + Remove tag colors
- **Sidebar:** Ensured `collapsed` defaults to `true` (already correct), set `omsOpen` default to `false` so OMS sub-menu doesn't auto-expand
- **Search bar UI fix:** Fixed "2 box" appearance — used `variant="outlined"` on Input, added proper `.table-search-bar .ant-input-outlined` CSS with theme-aware border/background. Removed dead `.mota-search` CSS (old navbar search).
- **Tags de-colored:** Removed all color CSS classes from Order Type tags (`tag-online`, `tag-reservation`) and Marketplace tags (`tag-lazada`, `tag-shopee`, `tag-tiktok`, `tag-walkin`, `tag-phone`). Both columns now render plain default Ant Design `<Tag>` with no color styling. Removed all light + dark theme tag overrides from global.css.
- Files changed: MainLayout.tsx, TableSearchBar.tsx, MarketplaceBadge.tsx, OrderTable.tsx, global.css

---

_(The following sessions are pre-restructure entries, preserved for historical reference)_

### 2026-02-26 — Session 14 (pre-restructure): e-PVP10 module UI components
- Created 4 new files in `features/epvp10/`:
  - `OfflineBanner.tsx` — Alert banner shown when offline (warning type, uses epvp10Store + globalStore)
  - `PassportScanner.tsx` — Dashed-border scan area with mock passport OCR, Descriptions display
  - `ValidationStatusBar.tsx` — Ant Design Steps for 7-step refund flow (pending_scan → refund_complete), handles rejected states as error
  - `EPvp10Page.tsx` — Main page with applications table, expandable rows with ValidationStatusBar, New Application modal (passport scan + amount input + auto VAT calc)
- Added 30+ e-PVP10 translation keys to en.ts and th.ts (vatRefund, scanPassport, immigration/KTB status labels, etc.)
- All components use CSS variables for theme-aware styling, elderly-friendly font sizes (15-24px)
- Files changed: en.ts, th.ts; new: OfflineBanner.tsx, PassportScanner.tsx, ValidationStatusBar.tsx, EPvp10Page.tsx

### 2026-02-26 — Session 15: e-Tax Invoice Wizard
- **ETaxWizard.tsx (new):** 3-step wizard container with Ant Design Steps + framer-motion slide animations
  - Steps: Scan → Verify → Complete
  - Back button on verify step, Close button to reset wizard
- **ScanStep.tsx (new):** Step 1 — two modes: QR scan (pulsing CSS animation, 2s mock delay) or manual receipt ID input + search
- **VerifyStep.tsx (new):** Step 2 — auto-fetches customer data via `etaxService.verifyCustomer`, shows Descriptions with editable Tax ID + address, "Confirm & Generate Invoice" button calls `etaxService.generateInvoice`
- **SuccessStep.tsx (new):** Step 3 — Ant Design Result (success), "View PDF" opens Modal with XML content, "Send to iNet" button, "Done" resets wizard
- **ETaxPage.tsx (updated):** Added "New Invoice Wizard" primary button with ThunderboltOutlined icon, conditionally renders ETaxWizard or existing generate section, all existing functionality preserved
- **26 new translation keys** added to en.ts and th.ts: `startWizard`, `wizardStep1-3`, `scanQR`, `enterReceiptId`, `receiptId`, `searchReceipt`, `scanning`, `verifyCustomer`, `customerDetails`, `taxId`, `confirmDetails`, `invoiceCreated`, `invoiceCreatedDesc`, `viewPDF`, `sendToInetBtn`, `done`, `back`, `closeWizard`, `receiptAmount`, `verifying`, `generating`, `sendingToInet`, `sentSuccess`, `invoiceHistory`
- All components use CSS variables for theme support, elderly-friendly font sizes, Mota design patterns
- New files: ETaxWizard.tsx, ScanStep.tsx, VerifyStep.tsx, SuccessStep.tsx
- Files changed: ETaxPage.tsx, en.ts, th.ts

### 2026-02-26 — Session 16: Sidebar fix + Search bar fix + Remove tag colors
- **Sidebar default expanded:** Changed sidebar to default to 220px expanded state; `.mota-sidebar--collapsed` is the modifier. Removed Settings button.
- **Search bar "2 box" fix:** Replaced Ant Design Input with native HTML `<input>` + custom CSS (`.table-search-input`), eliminating double-border issue
- **Search bar corner radius:** Changed from pill (50px) to rounded (10px) to match date range picker
- **Tags de-colored:** Removed all color from Order Type and Marketplace tags — plain default `<Tag>` only
- **Rename:** `menuEPvp10` display text changed from "e-PVP10" to "e-P.P.10" in both EN and TH
- Files changed: MainLayout.tsx, TableSearchBar.tsx, MarketplaceBadge.tsx, OrderTable.tsx, global.css, en.ts, th.ts

### 2026-02-26 — Session 17: Customer Pay + Receipt
- **Payment fields on Order type:** Added `paymentStatus`, `receiptId`, `paidAt`, `paymentMethod` optional fields
- **omsStore action:** `markOrderPaid(orderId)` — sets paid status, generates receipt ID (`RCP-YYYYMMDD-XXXX`), adds log entry
- **AppContext bridge:** Added `MARK_ORDER_PAID` action type
- **OrderDetailDrawer payment section:**
  - Unpaid: Green "Customer Pay" button → dispatches `MARK_ORDER_PAID`, success message
  - Paid: Shows receipt ID, paid date, payment method + "View Receipt" button
  - Receipt Modal: Full receipt with order details, items table, total, "Paid" stamp badge
- **9 new i18n keys:** `customerPay`, `paid`, `unpaid`, `viewReceipt`, `receiptDetail`, `paymentMethod`, `paidAt`, `paymentReceived`, `cash`
- Files changed: types/index.ts, stores/omsStore.ts, context/AppContext.tsx, features/oms/OrderDetailDrawer.tsx, en.ts, th.ts

### 2026-02-26 — Session 18: Language flag dropdown
- **Replaced** Ant Design Switch toggle with custom flag dropdown button
- **Button:** Shows current language flag (inline SVG — UK Union Jack / Thai tricolor) + down chevron, theme-aware border/background
- **Dropdown menu:** Absolute-positioned below button, lists all languages with flag + label, animated slide-in
- **Theme-aware:** Uses CSS variables (`--card-bg`, `--border-light`, `--surface-secondary`, `--text-primary`) for both light and dark themes
- **Click outside** to close (mousedown listener with ref)
- Files changed: LanguageToggle.tsx, global.css

### 2026-02-26 — Session 19: Receipt ID search on e-Tax page
- **Receipt ID input** added to e-Tax generate section (between wizard button and order select)
- Admin enters receipt ID from Customer Pay (Orders page) → finds matching order by `order.receiptId` → auto-selects in dropdown
- Validation: warns if receipt not found or order already has invoice
- **3 new i18n keys:** `searchByReceiptId`, `receiptNotFound`, `orderAlreadyInvoiced` (EN + TH)
- Files changed: ETaxPage.tsx, en.ts, th.ts

### 2026-02-26 — Session 20: Receipt ID sync across project
- **seedData.ts:** Added `paymentStatus: 'paid'`, `receiptId`, `paidAt`, `paymentMethod` to 4 orders (ord-006, ord-007, ord-010, ord-011) — receipt IDs now match etaxMock and epvp10Mock exactly
- **etax.service.ts:** `scanQRCode` now returns real paid orders from store; `lookupByReceiptId` checks real orders first then falls back to mock; `verifyCustomer` pulls real customer data from store when no mock match
- **EPvp10Page.tsx:** Fixed receipt ID format from 3-digit to 4-digit suffix (consistent with omsStore `markOrderPaid`)
- **Receipt ID format standardized:** `RCP-YYYYMMDD-XXXX` (4-digit suffix) across all generators
- **Data sync map:** ord-010→RCP-001, ord-011→RCP-002, ord-006→RCP-003, ord-007→RCP-004
- Files changed: seedData.ts, etax.service.ts, EPvp10Page.tsx

### 2026-02-26 — Session 21: Disable Picking button when unpaid
- **OrderDetailDrawer:** "Picking" button disabled when `paymentStatus !== 'paid'`; tooltip shows "Customer must pay before picking"
- Only the `Picking` transition is gated — `Failed` and other buttons remain enabled
- **1 new i18n key:** `payBeforePicking` (EN + TH)
- Files changed: OrderDetailDrawer.tsx, en.ts, th.ts

### 2026-02-26 — Session 22: e-Tax PDF Viewer + View XML rename
- **SuccessStep:** Renamed existing "View PDF" button → "View XML" (shows XML content); added new "View PDF" button opening `InvoicePDFViewer` modal
- **InvoicePDFViewer (new):** Mock PDF-style modal displaying tax invoice document — header, seller/buyer info, items table, subtotal/VAT/grand total, Print button
- **ETaxPage table:** Added "View PDF" button in actions column (before View XML) opening same `InvoicePDFViewer` modal
- **7 new i18n keys:** `taxInvoice`, `seller`, `buyer`, `subtotal`, `vatRate`, `grandTotal`, `printPDF` (EN + TH)
- New file: InvoicePDFViewer.tsx
- Files changed: SuccessStep.tsx, ETaxPage.tsx, en.ts, th.ts

### 2026-02-27 — Session 23: PDF Viewer → Full Page (not modal)
- **InvoicePDFViewer:** Converted from Ant Design Modal to a full-page route component at `/etax/invoice/:invoiceId`
  - Reads invoice/order from Zustand store via `useParams` — no props needed
  - Top bar with Back button (navigates to `/etax`) and Print button
  - `.no-print` class hides top bar during printing; `.invoice-document` class for print styling
  - If invoice not found, shows fallback with back button
- **App.tsx:** Added route `<Route path="/etax/invoice/:invoiceId" element={<InvoicePDFViewer />} />`
- **ETaxPage:** "View PDF" button now uses `navigate(`/etax/invoice/${record.id}`)` instead of opening modal; removed `pdfInvoiceId` state and `InvoicePDFViewer` import
- **SuccessStep:** "View PDF" button now navigates to full page; removed `pdfModalOpen` state, `InvoicePDFViewer` import, and unused `orders`/`order` variables
- **MainLayout:** Added `getPageTitle()` helper for dynamic path matching — `/etax/invoice/*` shows "Tax Invoice" as header title
- **global.css:** Added `@media print` styles — hides sidebar, header, `.no-print` elements; removes card shadow/border for clean printing
- Files changed: InvoicePDFViewer.tsx, App.tsx, ETaxPage.tsx, SuccessStep.tsx, MainLayout.tsx, global.css
