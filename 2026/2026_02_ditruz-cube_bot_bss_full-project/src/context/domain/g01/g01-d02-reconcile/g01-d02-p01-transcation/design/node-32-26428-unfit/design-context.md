# Design Context: Node 32:26428 - Reconciliation Transaction - Unfit

> Figma Node ID: `32:26428`
> Full page node - too large for direct code generation
> CSS specs for sub-components are in: `../css-specs-from-figma.md`

## Sub-Component Nodes (with CSS from Figma MCP)

| Node ID | Name | CSS Section |
|---------|------|-------------|
| `32:26438` | Title Bar | Section 1 |
| `32:26461` | Scanner Section | Section 2 |
| `32:26512` | Info Card | Section 7 |
| `32:29199` | Panel Header (List Header) | Section 3 |
| `32:29202` | Table Header Row | Section 4 |
| `32:29217` | Table Body Row | Section 5 |
| `32:26806` | Denomination Badge (100) | Section 6 |

## Design Structure (Metadata)

The root frame `32:26428` ("Reconciliation Transaction - Unfit") is 1440x900 and contains:

### Background Layer (`32:26429`)
- Background rectangle with gradient foreground color layer
- Decorative images

### Navigation Header (`32:26436`)
- Instance component, 1440x40, at top of page

### Main Content Frame (`32:26437`) - 1435x860, offset y=40

#### Title Bar (`32:26438` "Frame 6126") - 1403x62
- **Title Area** (`32:26439`): Contains page title
  - `32:26441` text: "Reconciliation Transaction UNFIT" — Pridi SemiBold 30px #212121 tracking 0.675px
  - `32:26442` text: Thai subtitle — Pridi Regular 20px #212121 tracking 0.45px
- **Action Buttons** (`32:26443` "Frame 6153") - 368x36, gap 16px:
  - Button 1 (`32:26444`): bg #003366, Pridi Regular 14px, padding 4px 8px, rounded 4px
  - Button 2 (`32:26449`): bg #003366, Pridi Medium 16px, padding 6px 12px, rounded 6px
  - Button 3 (`32:26454`): bg #003366, Pridi Medium 16px, padding 6px 12px, rounded 6px

#### Content Area (`32:26459` "Frame 6127") - 1403x774

##### Left Panel (`32:26460` "Frame 6116") - 1071x774

###### Scan Header Section (`32:26461` "Frame 6115") - 1071x205
- Container: bg white, rounded 12px, padding 16px 24px, gap 8px
- Title: Pridi Medium 16px #212121 tracking 0.352px
- Input wrapper: border 5px rgba(41,126,212,0.5), rounded 8px, 390.5x41px
- Input field: bg #d1e5fa, border 3px #297ed4, rounded 8px, padding 8px 12px
- Count row: flex gap 8px, font 20px, "100" is Bold #b45309
- Location row: Pridi Medium 16px, gap 32px, #212121
- Filter/Refresh buttons: bg #003366, h 41px, padding 4px 16px, rounded 4px, gap 24px
- Filter row: gap 24px, pt 8px
- Filter labels: Pridi Regular 14px #212121
- Filter select: border 1px #ced4da, rounded 4px, padding 5px 9px/13px, color #6c757d
- Clear filter btn: bg #003366, border 1px #003366, h 31px, padding 5px 17px

##### Right Panel (`32:26511` "Frame 6117") - 316x774

###### Info Panel (`32:26512` "Frame 6113") - 316x123
- Container: bg white, rounded 12px, padding 16px 12px
- All rows: Pridi Regular 13px #212121, tracking 0.325px, justify-between, px 4px
- First row (Date): bg #f8d7da, rounded 4px, has 14px icon
- Values: text-align right, width 100px, white-space pre-wrap
- Shift value: "ผลัดบ่าย"

###### Header Card from Machine Table (`32:26535` "Table") - 316x635
- Panel header: padding 8px 16px, border-bottom 1px #cbd5e1, bg white
- Table header: bg #d6e0e0, Pridi Medium 13px, tracking 0.299px, sort icons 12px
- Table body: Pridi Regular 13px #013661, tracking 0.286px, row height 40px
- DateTime: 12px, leading 13px, tracking 0.264px
- Action buttons: 20x20px, border 1px black, bg transparent, gap 6px

#### Bottom Tables

##### Preparation (`32:26681` "Table") - 445x553
- Columns: Header Card (105px) | วันเวลา (120px) | ชนิดราคา (110px) | Action (78px)

##### Preparation + Data from Machine (`32:26774` "Table") - 607x553
- 5 columns with วันเวลาเตรียม and วันเวลาบันทึก

## Denomination Badge (`32:26806`)
- Size: 47x24px, border 2px, NO border-radius
- 100 baht: bg #fff5f5, border #c07575, text #8f4242, Pridi Bold 13px
