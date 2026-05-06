# Design Context: Node 2:43372 - Reconciliation Transaction - Unfit - Table Notifications

> Figma Node ID: `2:43372`
> Source: Figma MCP `get_design_context` (sub-node `32:54692`)
> Parameters: `clientLanguages="html,css,javascript"`, `clientFrameworks="jquery"`, `artifactType="COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN"`
> Note: Full section and sub-node were too large for code generation; sparse metadata returned. Structure below represents the layout hierarchy.

## Section Overview

Section `2:43372` ("Reconciliation Transaction - Unfit - Table Notifications") at 4816x1299 contains the frame `32:54692` ("Reconciliation Transaction - Unfit") at 1440x900. This variant shows the table with notification indicators (tooltip/cursor overlays).

## Design Structure (Metadata)

### Root Frame (`32:54692`) - 1440x900

#### Background Layer (`32:54693`)
- Same background pattern (gradient foreground with decorative images)

#### Navigation Header (`32:54700`)
- Instance component, 1440x40

#### Main Content Frame (`32:54701`) - 1435x860, y=40

##### Title Bar (`32:54702` "Frame 6126") - 1403x62
- Title: "Reconciliation Transaction UNFIT" + Thai subtitle
- 3 action buttons (115x36, 85x36, 136x36)

##### Content Area (`32:54723` "Frame 6127") - 1403x774

###### Left Panel (`32:54724` "Frame 6116") - 1071x774

**Scan Header Section** (`32:54725` "Frame 6115") - 1071x205:
- Title: "Scan Header Card for UNFIT reconciliation"
- Input Row: Header Card input + Summary + Action buttons
- Filter Row: 2 select dropdowns + search button

###### Right Panel (`32:54775` "Frame 6117") - 316x774

**Info Panel** (`32:54776` "Frame 6113") - 316x123:
- 5 label-value rows

**Header Card from Machine Table** (`32:54799` "Table") - 316x635:
- Title: "Header Card from Machine"
- Columns: Header Card | Date/Time Count | Price Type | Action
- Data rows:
  - 0054941220 | 21/7/2568 14:00 | [badge] | [edit/delete]
  - 0054941226 (warning) | 21/7/2568 14:00 | [badge] | [edit/delete]
  - 0054941228 | 21/7/2568 14:00 | [badge] | [edit/delete]
  - 0054941230 | 21/7/2568 14:00 | [badge] | [edit/delete]
  - 0054941226 (warning) | 21/7/2568 14:02 | [badge] | [edit/delete]
- Scrollbar present

##### Bottom-Left Table (`32:54945` "Table") - 445x553, y=298
- Title: "Preparation"
- Columns: Header Card | Prepare Date | Price Type | Action
- 5 data rows (0054941124-0054941128)

##### Bottom-Right Table (`32:55038` "Table") - 607x553, y=298
- Title: "Preparation + Data from Machine"
- Columns: Header Card | Prepare Date | Count Date | Price Type | Action
- 5 data rows + 1 row with warning icon (0054941206)

#### Notification Overlay Elements

**Cursor Indicator** (`32:57779` "Cursors / Link & Status"):
- Instance component, 24x24, positioned at x=548, y=495
- Indicates interactive cursor state on a table row

**Tooltip** (`32:57780` "Tool Tip") - 285x197, positioned at x=400, y=301:
- **Header** (`32:57781` "Frame 6163") - 285x50:
  - Icon wrapper (24x24) + Title: "Reconcile Transaction"
- **Body** (`32:57784` "Frame 6164") - 285x140:
  - Error message text explaining the issue with Header Card 0054941212:
    - Thai text describes: "There is an error in Quality and Output data for Header Card 0054941212: there is an Output the system does not recognize [SHREDDED]. If there is a real error, delete this Header Card from the system and manually key-in instead."

## Key Differences from Base Layout (node-32-26428)

1. **Tooltip overlay**: Shows error notification tooltip on hover over a table row
2. **Cursor indicator**: Visual cursor state for link/status interaction
3. **Error notification pattern**: Tooltip with icon-wrapper header + detailed error message body
4. **Same base layout**: All tables and sections are identical to the base unfit layout

## Tooltip Design Pattern

```
Tooltip Container: 285x197
  Header (50px height):
    - Icon: 24x24 icon-wrapper, left-aligned with 14px padding
    - Title: 19px text, "Reconcile Transaction"
  Body (140px height):
    - Message: Multi-line text with 16px padding
    - Font: Body text style
    - Contains error description and recommended action
```

## Design Tokens / Styles

- Font family: Pridi
- Body text color: #212529
- Page dimensions: 1440x900
- Tooltip background: implied white/light
- Tooltip positioning: absolute, near cursor/row
- Same table, button, select, and badge patterns as base layout
- Warning icon: icon-wrapper 12x12 inline with Header Card text
- Error tooltip width: 285px, max 2 sections (header + body)
