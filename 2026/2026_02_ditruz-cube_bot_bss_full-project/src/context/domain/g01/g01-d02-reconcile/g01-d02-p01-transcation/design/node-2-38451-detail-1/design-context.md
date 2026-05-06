# Design Context: Node 2:38451 - Filter Expanded Default + Collapse

> Figma Node ID: `2:38451`
> Source: Figma MCP `get_design_context` (sub-node `32:34599`)
> Parameters: `clientLanguages="html,css,javascript"`, `clientFrameworks="jquery"`, `artifactType="COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN"`
> Note: Full node (section 3174x1610) was too large for code generation; sparse metadata returned for sub-node `32:34599`. Structure below represents the layout hierarchy.

## Section Overview

Section `2:38451` ("Filter - Expanded Default + Collapse") at 3174x1610 contains the main frame `32:34599` ("Reconciliation Transaction - Unfit") at 1440x900. This is a variant of the Unfit reconciliation page showing the filter in expanded/default state.

## Design Structure (Metadata)

### Root Frame (`32:34599`) - 1440x900

#### Background Layer (`32:34600`)
- Background rectangle + gradient foreground color with decorative images

#### Navigation Header (`32:34607`)
- Instance component, 1440x40

#### Main Content Frame (`32:34608`) - 1435x860, y=40

##### Title Bar (`32:34609` "Frame 6126") - 1403x62
- **Title** (`32:34611`):
  - English: "Reconciliation Transaction UNFIT" (1035x36)
  - Thai: subtitle (1035x24)
- **Action Buttons** (`32:34614` "Frame 6153") - 368x36:
  - Button 1 (`32:34615`): 115x36, icon + text "Filter" style
  - Button 2 (`32:34620`): 85x36, text only
  - Button 3 (`32:34625`): 136x36, text only

##### Content Area (`32:34630` "Frame 6127") - 1403x774

###### Left Panel (`32:34631` "Frame 6116") - 1071x774

**Scan Header Section** (`32:34632` "Frame 6115") - 1071x205:
- Title: "Scan Header Card for UNFIT reconciliation"
- Input Row (`32:34634` "Frame 6151") - 1023x67:
  - Header Card input (`32:34635`): 390.5x67, Label + barcode input field
  - Summary display (`32:34643` "Frame 6144"): 390.5x67
    - "Reconciled total: 100 bundles"
    - "Bangkok M7-1, Afternoon shift"
  - Action buttons (`32:34652` "Frame 6157"): 226x67
    - Scan button: 93x41
    - Additional button: 109x41

**Filter Row** (`32:34663` "Frame 6114") - 1023x65:
- Dropdown filters (`32:34664`): 425x57
  - Select 1: 200x57 with label
  - Select 2: 150x57 with label
- Search button (`32:34677`): 110x57

###### Right Panel (`32:34682` "Frame 6117") - 316x774

**Info Panel** (`32:34683` "Frame 6113") - 316x123:
- 5 label-value rows (292x20 each)
- Row 1 has Frame 6156 with icon-wrapper for action

**Header Card from Machine Table** (`32:34706` "Table") - 316x635:
- Title: "Header Card from Machine"
- Columns: Header Card | Date/Time Count | Price Type | Action
- Data rows (visible):
  - 0054941220 | 21/7/2568 14:00 | [badge] | [edit/delete]
  - 0054941226 (warning icon) | 21/7/2568 14:00 | [badge] | [edit/delete]
  - 0054941228 | 21/7/2568 14:00 | [badge] | [edit/delete]
  - 0054941230 | 21/7/2568 14:00 | [badge] | [edit/delete]
  - 0054941226 (warning icon) | 21/7/2568 14:02 | [badge] | [edit/delete]
- Scrollbar present

##### Bottom-Left Table (`32:34852` "Table") - 445x553, y=298
- Title: "Preparation"
- Columns: Header Card | Prepare Date | Price Type | Action
- 5 data rows (0054941124-0054941128)
- Scrollbar present

##### Bottom-Right Table (`32:34945` "Table") - 607x553, y=298
- Title: "Preparation + Data from Machine"
- Columns: Header Card | Prepare Date | Count Date | Price Type | Action
- 5 data rows (0054941201, 0054941203, 0054941205, 0054941212, 0054941206)
- Row 0054941206 has warning icon
- Scrollbar present

## Key Differences from Base Layout (node-32-26428)

This section (`2:38451`) contains the same Reconciliation Transaction - Unfit page but represents the "Filter - Expanded Default + Collapse" state variant. The main structure is identical to node `32:26428`, with the filter row visible and expanded by default. The section frame at 3174x1610 suggests this may contain multiple variant states side by side.

## Design Tokens / Styles

- Font family: Pridi
- Body text color: #212529
- Page dimensions: 1440x900
- Tables: 40px row height, 30px header height
- Buttons: icon + text pattern
- Select dropdowns: instance components with labels
- Price badges: Frame 6125 pattern (image bg + label)
- Warning indicators: icon-wrapper (12x12) inline with text
