# Node 2:34689 - Flow Overview (Full Reconciliation Flow)

## Overview
This screenshot shows the complete end-to-end flow of the Reconciliation Transaction feature. It is a large vertical canvas containing all screens, popup dialogs, and flow connections arranged top-to-bottom, representing the entire user journey through the reconciliation workflow. The flow is organized into distinct sections connected by lines/arrows showing navigation paths.

## Flow Sections (Top to Bottom)

### Section 1 - Entry Points and Initial Filtering (Top)

#### Top-Left: Main Page Entry
- The "Reconciliation Transaction UNFIT" main page in its initial state.
- Shows the filter section with Header Card input and transaction count display.
- Tab navigation (OverView, Holding, Holding Detail).
- Preparation table and Machine data table below.

#### Top-Center and Top-Right: Filter/Search Result Variations
- Two additional small views showing different filter configurations or search result states.
- These appear to be compact representations of search/filter interactions showing how the page responds to different filter inputs.

### Section 2 - Main Detail Views Row (Second Row)

Four full-page views arranged horizontally:

#### View 1 (Left): Base Detail View
- Full "Reconciliation Transaction UNFIT" page with data populated.
- Preparation table showing multiple Header Card entries with dates and eMatch status badges.
- Machine data table alongside with corresponding data.
- Action icons (view, edit) visible in each row.

#### View 2 (Center-Left): Detail View with Blue Highlight
- Similar page layout with data.
- A section appears to have a blue/highlighted area, possibly indicating a selected or active state.
- Tables populated with transaction data.

#### View 3 (Center-Right): Detail View with Active Comparison
- Page showing side-by-side comparison with both Preparation and Machine data tables active.
- Status badges and row highlights visible.

#### View 4 (Right): Reconciliation Detail with Side Panel
- Full page view with an extended right panel showing "Reader Card from Machine" data.
- Displays the detail information panel with field-value pairs.

### Section 3 - Warning and Alert States (Third Row)

#### Left: Detail View with Warning
- Full page showing the reconciliation view with warning indicators.
- Red/pink highlighted rows indicating discrepancies.
- Warning triangle icon with "Reconcile Transaction" label.

#### Right: Alert Popup State
- The alert/warning popup dialog overlaid on a dimmed background.
- Red circle exclamation icon.
- Warning message in Thai about Header Card matching issues.
- "OK/Confirm" button.

### Section 4 - Reconcile Transaction States (Fourth Row)

Three full-page views showing different states of the Reconcile Transaction workflow:

#### View 1 (Left): Reconcile with Warning Message
- Full page with the Reconcile Transaction warning box containing detailed Thai text.
- Highlighted discrepancy rows in the machine data table.

#### View 2 (Center): Reconcile with Minimal Data
- Reduced data state after some reconciliation actions.
- Reconcile Transaction section with fewer flagged items.

#### View 3 (Right): Reconcile with Expanded Results
- Extended view showing reconciliation results.
- Multiple highlighted rows and status indicators.

### Section 5 - Popup Dialogs Flow (Lower Half)

This section contains all the popup/modal dialogs arranged in a flow pattern with connecting arrows:

#### Row A - Edit and Confirm Popups (4 dialogs across)
1. **Edit Header Card Dialog**: Form with input fields for card data editing. Cancel and Confirm buttons.
2. **Confirm Dialog with Table**: Data table for reviewing reconciliation data before confirmation. Confirm button.
3. **Confirm Dialog Variant**: Simplified confirmation with table data.
4. **Edit Header Card Variant**: Another edit form variant.

#### Row B - Transaction Detail Dialogs (4 dialogs across)
1. **Transaction Detail Step 1**: Multi-step detail view with colored status bar segments. Shows transaction summary data.
2. **Reconciliation Confirm**: Confirmation dialog with data table and colored header. Detail section below.
3. **Reconciliation Confirm Variant**: Similar confirm dialog in different state.
4. **Transaction Detail Variant**: Detail view with status progression.

#### Row C - Further Steps and OTP Flow (4 dialogs across)
1. **Transaction Detail Step 2**: Next step in the detail workflow. Status bar progression.
2. **Reconciliation Confirm with Details**: More detailed confirmation state.
3. **Flow Label: "OTP Supervisor"** with arrow pointing down to "Confirm Success" - indicates supervisor-level OTP verification step.
4. **Transaction Detail Step Variant**: Another detail state.

#### Row D - Confirmation and Success (4 dialogs across)
1. **Transaction Detail Step 3**: Final step before confirmation. Submit/Confirm button highlighted.
2. **Success Dialog**: Green checkmark icon with "Success" message in Thai. OK button.
3. **Flow Label: "OTP Manager"** with arrow pointing down to "Confirm Success" - indicates manager-level OTP verification step.
4. **Transaction Detail Final**: Final detail confirmation state.

#### Row E - Cancel and Report Dialogs (Bottom)
1. **Cancel Success Dialog**: Green checkmark with cancellation confirmation message. References specific Header Card numbers.
2. **Print Cancel Reconcile Report**: Printable report dialog showing "Cancel Reconcile Report" with header data, date fields, and financial data table. Cancel and Print buttons.
3. **Success Dialog Variant**: Another success state with green checkmark.
4. **Cancel Success Variant**: Another cancellation confirmation state.

### Section 6 - Final Reference States (Very Bottom)

#### Bottom-Left: Full Page Reference
- Complete view of the "Reconciliation Transaction UNFIT" page with all data populated.
- Shows the final state after reconciliation actions have been completed.
- All tables populated with processed data.

#### Bottom-Center: Print Report Full View
- Another "Print Cancel Reconcile Report" dialog showing the full report layout.
- Detailed financial table with multiple columns of numeric data.
- Cancel and Print/Export buttons.

## Flow Connections
The screens are connected by lines/arrows showing the user journey:
1. **Main Flow**: Entry (filter/search) -> Detail views -> Reconcile Transaction states -> Popup dialogs
2. **Edit Path**: Detail view -> Edit dialog -> Confirm dialog -> OTP Supervisor -> Success
3. **Confirm Path**: Detail view -> Confirm dialog -> OTP Manager -> Success
4. **Cancel Path**: Any state -> Cancel dialog -> Cancel Success -> Print Cancel Report
5. **Report Path**: Cancel/Complete -> Print Cancel Reconcile Report

## Visual Design Summary
- **Total Screens**: Approximately 30+ distinct screens/states
- **Color Scheme**: Consistent navy/blue header, white content areas, red/pink for errors, green for success
- **Modal Overlays**: Gray dimmed backgrounds for popup dialogs
- **Status Indicators**: Colored badges (red=error, blue=info), colored status bar segments, row highlighting
- **Typography**: Mix of Thai and English text throughout
- **Layout Pattern**: Full-page views connected to popup sequences via flow arrows

## Functional Purpose
This flow overview provides a complete map of the Reconciliation Transaction UNFIT feature, showing:
1. How users enter and navigate the feature (filtering, searching).
2. How data is displayed and compared between Preparation and Machine sources.
3. How warnings and discrepancies are surfaced to users.
4. The complete popup interaction sequence for editing, confirming, and processing transactions.
5. The two-level OTP verification flow (Supervisor then Manager).
6. Success and cancellation paths with their respective confirmation dialogs and report generation.
