# Figma Specifications — Approve Manual Key-in

**Figma Links:**

- [Main Screen](https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49537)
- [Complete Flow](https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=3683-112494)

**Page Dimensions:** 1440×900px  
**Purpose:** Approve manually keyed-in banknote counting transactions

---

## User Flow States

### State 1: Main Screen (Node 2:49537)

- Full approval interface with filters and data tables
- User can select transactions to review
- Shows denomination breakdown of selected transaction
- Includes details panel with note input

### State 2: Approval Confirmation Modal (Node 2:50279)

- Modal overlay asking for confirmation
- Message: "คุณแน่ใจหรือไม่ที่ต้องการ Approve ข้อมูลนี้"
- Two-button choice: Cancel (160×38px) or Confirm (158×38px)

### State 3: Success Notification Modal (Node 2:50269)

- Final confirmation modal
- Shows success icon (48×48px) and "สำเร็จ" title (58×29px)
- Message: "บันทึกข้อมูลสำเร็จ" (146×24px)
- Single OK button (160×38px) to dismiss

---

## Section Breakdown

### 1. Navigation Header (Node 2:49545)

**Dimensions:** Full width × 40px  
**Components:**

- **Left:** BSS logo (30×30px) + "ระบบตรวจสอบการนับคัดธนบัตร" + "Version 1.0.0"
- **Center:** List Menu Nav (1011×25px) — menu items
- **Right:** User profile dropdown (99×34px) — "พัฒนา วิไล" (Officer)

### 2. Page Header (Node 2:49769)

**Dimensions:** Full width × 62px  
**Layout:**

```
[Title: "Approve Manual Key-in" (747px)] [Status 1 (235px)] [Status 2 (250px)] [Back Btn (92×36px)]
```

**Components:**

- **Title:** Left-aligned, large heading
- **Status indicators:** Two label groups (transaction/session info)
- **Back button:** Icon + "กลับ" text (right-aligned at x:1332)

### 3. Filter Panel (Node 2:49792)

**Dimensions:** 1376px × 102px  
**Layout:** 2 rows of filters

**Row 1 (Frame 6201):** Total width 1376px
| Filter | Label Width | Select Width | Total Width |
|--------|-------------|--------------|-------------|
| 1 | 85px | 163px | 256px |
| 2 | 34px | 214px | 256px |
| 3 | 47px | 201px | 256px |
| 4 | 33px | 215px | 256px |
| 5 | 139px | 109px | 256px |

**Row 2 (Frame 6202):** 4 filters, each 326px width
| Filter | Label Width | Select Width | Total Width |
|--------|-------------|--------------|-------------|
| 1 | 130px | 188px | 326px |
| 2 | 142px | 176px | 326px |
| 3 | 92px | 226px | 326px |
| 4 | 40px | 278px | 326px |

### 4. Main Data Table (Node 2:49830)

**Dimensions:** 1408×407px  
**Component:** Table instance "Table - Approve Manual Key In"  
**Purpose:** Display list of manual key-in transactions awaiting approval  
**Features:**

- Scrollable rows
- Selectable rows (radio/checkbox)
- Sortable columns
- Status indicators

### 5. Denomination Details Table (Node 2:49833)

**Dimensions:** 900×249px (left side)  
**Structure:**

```
┌─────────────────────────────────────────────────────────────┐
│ แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้ (45px)    │
├──────────┬──────────┬──────────┬────────────────────────────┤
│ ชนิดราคา │ ประเภท   │ แบบ      │ จำนวนฉบับ                  │
│ (221px)  │ (221px)  │ (221px)  │ (221px, right-aligned)     │
├──────────┼──────────┼──────────┼────────────────────────────┤
│ 20฿ Img  │ ดี       │ 17       │ 4                          │ (40px)
│ 20฿ Img  │ เสีย     │ 17       │ 995                        │ (40px)
│ 20฿ Img  │ Reject   │ 17       │ 1                          │ (40px)
└──────────┴──────────┴──────────┴────────────────────────────┘
```

**Components:**

- **Section header:** 45px height
- **Table header:** 30px height, 4 columns (221px each)
- **Data rows:** 40px height each
- **Banknote images:** 47×24px with label overlay
- **Scrollbar:** 8px width (hidden by default)

### 6. Details Panel (Node 2:49964)

**Dimensions:** 500×249px (right side)  
**Title:** "Unsort - CC"  
**Layout:**

```
┌──────────────────────────────────────┐
│ หมายเหตุ:                            │
│ ┌────────────────────────────────┐   │ (62px)
│ │ นี่คือรายละเอียดที่พิมพ์...    │   │
│ └────────────────────────────────┘   │
├──────────────────────────────────────┤
│ [Button 1 (468×46px)]                │ (46px)
├──────────────────────────────────────┤ (1px divider)
│ [Button 2 (468×48px)]                │ (48px)
└──────────────────────────────────────┘
```

**Components:**

- **Note input (Frame 6200):** 468×62px
  - Label: "หมายเหตุ" (56px width)
  - Text area: 468×36px
- **Button 1:** 468×46px (y:78) — Likely "Deny" action
- **Divider line:** 468×1px (y:140)
- **Button 2:** 468×48px (y:157) — Likely "Approve" action

### 7. Confirmation Modal (Node 2:50279)

**Overlay:** 1346×911px (semi-transparent)  
**Modal:** 560×360px (centered)  
**Layout:**

```
┌─────────────────────────┐
│     [Icon 48×48]        │ (32px from top)
│                         │
│       Approve           │ (97×29px)
│                         │
│ คุณแน่ใจหรือไม่ที่       │ (365×24px)
│ ต้องการ Approve ข้อมูลนี้│
│                         │
│ [Cancel]     [Confirm]  │ (160×38px, 158×38px)
└─────────────────────────┘
```

**Element Positions:**

- Icon: x:256, y:32 (48×48px)
- Title: x:231.5, y:96 (97×29px)
- Message: x:97.5, y:133 (365×24px)
- Cancel button: x:109, y:219 (160×38px)
- Confirm button: x:293, y:219 (158×38px)

### 8. Success Modal (Node 2:50269)

**Overlay:** 1440×900px  
**Modal:** 560×360px (centered at x:440, y:269.5)  
**Layout:**

```
┌─────────────────────────┐
│  [Success Icon 48×48]   │ Top bar (141px)
│                         │
│       สำเร็จ             │ (58×29px)
├─────────────────────────┤
│   บันทึกข้อมูลสำเร็จ     │ Message area (143px)
│                         │ (146×24px text)
├─────────────────────────┤
│       [  OK  ]          │ Action area (70px)
└─────────────────────────┘ (160×38px button)
```

**Element Breakdown:**

- **Top bar:** 560×141px
  - Success icon: 48×48px (x:256, y:32)
  - Title "สำเร็จ": 58×29px (x:251, y:96)
- **Message area:** 560×143px
  - Text: 146×24px (centered at x:207, y:141)
- **Action area:** 560×70px
  - OK button: 160×38px (centered at x:200, y:157)

---

## Component Symbol (Node 2:49978)

**Name:** "Table - Approve Manual Key In"  
**Type:** Reusable component symbol  
**Dimensions:** 2053×421px (design-time size)  
**Instance:** Node 2:49830 in main screen  
**Purpose:** Standard table layout for approval list with sorting, filtering, and selection

---

## Interaction Flow

```
┌─────────────────┐
│  Main Screen    │ ← User views pending approvals
│  (2:49537)      │
└────────┬────────┘
         │ User clicks Approve button
         ↓
┌─────────────────┐
│ Confirm Modal   │ ← "คุณแน่ใจหรือไม่?"
│  (2:50279)      │
└────────┬────────┘
         │ User clicks Confirm
         ↓
┌─────────────────┐
│ Success Modal   │ ← "บันทึกข้อมูลสำเร็จ"
│  (2:50269)      │
└────────┬────────┘
         │ User clicks OK
         ↓
     [Return to main screen with updated data]
```

---

## Implementation Notes

### Backend Requirements

- API endpoint: `POST /api/ApproveManualKeyIn/Approve`
- Request payload: HC number, note, approval status
- Response: Success/error message

### Frontend Requirements

- Filter dropdowns: Auto-load options from backend
- Main table: Selectable rows (single selection)
- Denomination table: Auto-populate when row selected
- Details panel: Editable note field
- Modal handling: Bootstrap modals or custom overlay
- State management: Track selected HC, filter values, approval flow

### Validation Rules

- Must select at least one transaction
- Note field optional (max 500 characters)
- Confirmation required before approval
- Success message auto-dismiss after 3 seconds

### Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management in modals
- High contrast colors for status indicators
