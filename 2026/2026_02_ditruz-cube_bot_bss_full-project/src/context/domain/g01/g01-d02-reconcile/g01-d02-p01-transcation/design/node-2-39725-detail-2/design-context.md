# Design Context: Node 2:39725 - Error Case - Can't Reconcile

> Figma Node ID: `2:39725`
> Source: Figma MCP `get_design_context` (sub-node `2:39726`)
> Parameters: `clientLanguages="html,css,javascript"`, `clientFrameworks="jquery"`, `artifactType="COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN"`
> Note: Full node (section 3264x1610) and sub-node were too large for inline code generation; result saved to file. Structure below is from metadata.xml analysis and partial design context.

## Section Overview

Section `2:39725` ("Error Case - Can't Reconcile") at 3264x1610 contains the frame `2:39726` ("Reconciliation Transaction - Unfit - Error Case - Can't Reconcile") at 1440x900. This shows the error state when reconciliation cannot be completed.

## Design Structure (Metadata)

### Root Frame (`2:39726`) - 1440x900

#### Background Layer (`2:39727`) - hidden
- Same background pattern as base layout (gradient foreground with decorative images)
- Marked as `hidden="true"` in metadata

#### Navigation Header (`2:39735`) - 1440x40
- Full navigation header (not an instance here, fully expanded)
- Logo area (`2:39738`): BSS logo + "Banknote Surveillance System"
  - Version text: "Version 1.0.0"
- Menu area (`2:39947`): "Reconciliation" dropdown with icon-down
- Profile area (`2:39951`):
  - User name display
  - Role: "Operator"
  - Avatar button

#### Main Content Frame (`2:39960`) - 1435x860, y=40

##### Title Bar (`2:39961` "Frame 6126") - 1403x62
- Title: "Reconciliation Transaction UNFIT" + Thai subtitle
- 3 action buttons (same pattern as base layout)

##### Content Area (`2:39982` "Frame 6127") - 1403x774

###### Left Panel (`2:39983` "Frame 6116") - 1087x774

**Scan Header Section** (`2:39984` "Frame 6115") - 1087x205:
- Title: "Scan Header Card for UNFIT reconciliation"
- Input Row (`2:39986`): 1039x67
  - Header Card input: 390.5x67 with value "0054941201" displayed
  - Summary: "Reconciled total: 100 bundles, Bangkok M7-1, Afternoon shift"
  - Action buttons: Scan (93x41) + additional (109x41)

**Extended Filter Row** (`2:40015` "Frame 6114") - 1039x65:
- **4 dropdown filters** (`2:40016`): 946x57
  - Select 1 (`2:40017`): 218.5x57, Label filter
  - Select 2 (`2:40023`): 218.5x57, different label
  - Select 3 (`2:40029`): 218.5x57, different label
  - Select 4 (`2:40035`): 218.5x57, different label
- **Search button** (`2:40041`): 69x57

**Main Data Table** (`2:40046` "Table") - 1087x268.5:
- Title: "Preparation + Data from Machine"
- **Extended Columns** (wider table than base):
  - Barcode per bundle (171px)
  - Barcode per bundle (230px)
  - Header Card (106px)
  - Bank (72px)
  - Cash Center (118px)
  - Plus additional columns (from metadata continuation)
- Data rows with detailed transaction information

## Key Differences from Base Layout

1. **Extended filter row**: 4 dropdown filters instead of 2
2. **Wider left panel**: 1087px instead of 1071px
3. **Single main table**: Shows "Preparation + Data from Machine" as a combined table with more columns
4. **Header card value pre-filled**: Input shows "0054941201"
5. **Navigation header fully expanded** (not an instance reference)
6. **Error state context**: This represents the state when reconciliation encounters an error (can't reconcile)

## Design Tokens / Styles

- Font family: Pridi
- Body text color: #212529
- Page dimensions: 1440x900
- Extended table columns for detailed data view
- 4-filter layout for advanced search
- Same button, select, and badge component patterns
- Table headers include sortable icon indicators
