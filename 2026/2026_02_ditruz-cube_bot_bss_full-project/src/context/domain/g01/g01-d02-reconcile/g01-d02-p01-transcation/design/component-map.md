# Reconciliation Transaction — Component Map from Figma

## Screen Variants (same page, different colors)

| Variant | Node ID | Nav Color | Background Gradient |
|---------|---------|-----------|---------------------|
| UNFIT | `32:26428` | `nav-blue-light` (#BFD7E1) | blue-grey |
| UNSORT CC | `2:36001` | `nav-orange` (#F2B091) | orange |
| CA MEMBER | `2:36565` | `nav-green` (#B5C9B1) | green/sage |
| CA NON-MEMBER | `2:37129` | `nav-purple` (#BEC3D2) | blue-grey |

## Page Layout (1440x900)

```
┌─ Navigation Header (40px) ─────────────────────────────────────────────┐
├─ Main Frame (9, 40, 1435x860) ─────────────────────────────────────────┤
│ ┌─ Title (16, 8, 1403x62) ────────────────────────────────────────────┐│
│ │ [h1 30px SemiBold] [nav buttons gap=16px]                           ││
│ │ [subtitle 20px Regular]                                             ││
│ └─────────────────────────────────────────────────────────────────────┘│
│ ┌─ Content (11, 77, 1403x774) ──────────────────── gap=16px ─────────┐│
│ │ ┌─ Left Column (1071px) ───────────────┐ ┌─ Right Column (316px) ──┐││
│ │ │ Scanner Section (1071x205)           │ │ Info Card (316x123)     │││
│ │ │  bg-white, rounded-12px              │ │  bg-white, rounded-12px │││
│ │ │  px-24 py-16, gap-8                  │ │  px-12 py-16            │││
│ │ │ ┌─────────────────────────── gap=19px│ │                         │││
│ │ │ │ Prep Table   │ Prep+Machine Table  │ │ HC from Machine Table   │││
│ │ │ │ (445px)      │ (607px)             │ │ (316x635)               │││
│ │ │ │              │                     │ │                         │││
│ │ │ └──────────────┘                     │ │                         │││
│ │ └──────────────────────────────────────┘ └─────────────────────────┘││
│ └─────────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────┘
```

## Components & Figma Node IDs

### 1. Title Section — `32:26438`
- h1: Pridi:SemiBold, 30px, tracking 0.675px, leading 1.2, color #212121
- Subtitle: Pridi:Regular, 20px, tracking 0.45px, leading 1.2
- Nav buttons: gap 16px
  - เปิดหน้าจอ 2: px-8 py-4, rounded-4, text-14px Regular
  - Holding / Holding Detail: px-12 py-6, rounded-6, text-16px Medium

### 2. Scanner Section — `32:26461`
- Container: bg-white, flex-col gap-8, px-24 py-16, rounded-12, overflow-clip
- Title: Pridi:Medium, 16px, tracking 0.352px
- Input wrapper: border-5 rgba(41,126,212,0.5), h-41, w-390.5, rounded-8
- Inner input: bg-#d1e5fa, border-3 #297ed4, rounded-8, px-12 py-8
- Count row: h-30, text-20px, gap-8, count number Pridi:Bold #b45309
- Location row: Pridi:Medium, 16px, gap-32
- Filter/Refresh buttons: bg-#036, h-41, px-16 py-4, rounded-4, text-14px Medium
- Filter row: justify-end, pt-8, gap-24
- Filter selects: w-200 each, small size (pl-9 pr-13 py-5, rounded-4)
- Clear Filter: bg-#036, h-31, px-17 py-5, rounded-4

### 3. Info Card — `32:26512` (pixel-perfect ✓)
- Container: bg-white, flex-col items-center, px-12 py-16, rounded-12, gap-0
- Rows: leading-0 on wrapper, leading-normal on inner p (KEY pattern)
- Date row: bg-#f8d7da, rounded-4, items-center; value area w-175.5px
- Other rows: items-start, value w-100px text-right
- Machine row: whitespace-nowrap
- Font: 13px, tracking 0.325px, color #212121

### 4. Left Table (Preparation) — Header `32:26685`, Row `32:26700`
- Panel header: border-b #cbd5e1, px-16 py-8, title Pridi:Medium 16px leading 1.2
- Table header bg: #d6e0e0, border-b #cbd5e1
- Header cells: Pridi:Medium, 13px, tracking 0.299px, p-8
- Column widths: 105 / 120 / 110 / 78px
- Data cells: 13px, tracking 0.286px, color #013661, py-6 px-8
- Date cells: 12px, leading 13px, w-92px inner text, whitespace-pre-wrap
- Denom cells: px-12 py-6 (wider padding for badge centering)
- Action cells: px-12 py-6, buttons gap-6, each 20x20px
- Row height: 40px, stripes: odd=white, even=#f2f6f6

### 5. Center Table (Prep+Machine) — Header `32:26778`
- Same styling as left table
- Column widths: 105 / 120 / 120 / 105 / 105px
- Extra column: วันเวลานับคัด (120px)

### 6. Right Table (HC from Machine) — Header `32:26538`, Row `32:26552`
- Panel header: same as left/center
- Table header bg: #d6e0e0, px-4 py-0 (container)
- Header cells: **11px** (not 13px), tracking 0.253px, py-8 px-4
- Column widths: 98 / 74 / 68 / flex
- วันเวลา นับคัด header: 2-line, leading-14px
- Data cells: **12px** (not 13px), color **#212529** (not #013661), py-6 px-4
- Rows have border-bottom: 1px solid #e2e8f0 (unlike left/center)
- Warning rows: color #dc3545 (not #991b1b)

### 7. Denomination Badge — `32:26806` (left/center), `32:26559` (right)
- Size: 47x24px, border-2, no border-radius
- Left/center: font 13px Bold
- Right: font 12px Bold
- Colors per denomination:
  - 20: bg #f1f9f1, border #55b254, text #55b254
  - 50: bg #f0f8ff, border #35a0fd, text #015cab
  - 100: bg #fff5f5, border #c07575, text #8f4242
  - 500: bg #f8f5ff, border #6a509d, text #3d2e5b
  - 1000: bg #fbf8f4, border #9f7d57, text #4f3e2b

### 8. Action Buttons — `32:26710`, `32:26562`
- Size: 20x20px, gap 6px
- Border: 1px solid black, transparent bg, rounded-4
- Icon inside: 14x14px

## Popup Section — `2:41247`

| Popup | Node IDs | Description |
|-------|----------|-------------|
| Edit HeaderCard | `2:41248` - `2:41532` | Steps 6-10 flow |
| Edit | `2:41649` - `2:41848` | Steps 7-11 flow |
| Delete | `2:42573` - `2:42847` | Steps 5-8 + Print Cancel Report |
| Delete Multiple | `2:42876` - `2:43309` | Steps 6-10 flow |

## Other Screens

| Screen | Unfit | Unsort CC | CA Member | CA Non-Member |
|--------|-------|-----------|-----------|---------------|
| Holding | `41:28771` | `41:29192` | `41:29597` | `41:30003` |
| Holding Detail | `41:21417` | `41:21890` | `41:22359` | `41:22831` |
| Table Notifications | `32:54692`, `32:55721`, `32:56750` | - | - | - |
| Can't Reconcile Error | `2:39726` | - | - | - |
| Lock Screen | - | `1:16548` | - | - |
