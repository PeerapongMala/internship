# Node 2:43372 - Detail Views 3 (Multiple States with Reconcile Transaction Label)

## Overview
This screenshot shows three side-by-side views of the "Reconciliation Transaction UNFIT" page, each representing a different state in the reconciliation workflow. All three views share the same base layout but differ in their data presentation and interaction states.

## Common Layout Elements (Shared Across All Three Views)

### Header
- Dark blue/navy top bar with bank logo and "Reconciliation" breadcrumb navigation.
- Bell notification icon on the right.

### Page Title
- "Reconciliation Transaction UNFIT" in large bold text.
- Thai subtitle text describing the UNFIT transaction reconciliation.

### Filter Section
- Instruction text in Thai for Header Card search.
- **Header Card** input field with dark blue border.
- **Transaction count**: Displays "100" with date range (KC-1).
- **Action buttons**: "Filter" (outlined) and "Refresh" (filled blue).
- **Secondary filters**: Header Card and status dropdown selectors with "Clear Filter" link.

### Tab Navigation
- Three tabs: appears to show overview/detail options, "Holding", and "Holding Detail".

---

## Left View (State 1) - Reconcile Transaction with Warning Message

### Right Detail Panel
- Shows field-value pairs for the selected record (Date, Service, Reconciliation details, Booking Machine, Cash).

### Preparation Table
- Columns: Header Card, TransDate, eMatch, Action
- Multiple data rows with Header Card IDs and timestamps.
- eMatch column showing red status badges.
- Action columns with checkboxes and icon buttons.

### Reconcile Transaction Section (Center-Right)
- **Red warning triangle icon** with "Reconcile Transaction" label.
- A prominent warning/information box containing Thai text explaining reconciliation rules:
  - Discusses Quality and Output matching for Header Cards.
  - References specific card IDs and provides instructions about Manual Key-in.
  - The warning text area has highlighted sections with specific card IDs in red text.
- Below the warning: Machine data rows with Header Card IDs, dates, and red status badges.
- Some rows highlighted with red/pink background indicating discrepancies.
- Action columns with checkboxes and view/edit icons.

### Reader Card from Machine Table (Far Right)
- Narrow table showing reader card entries with dates and action icons.

---

## Center View (State 2) - Reconcile Transaction with Minimal Entries

### Right Detail Panel
- Similar field-value detail panel as the left view.

### Preparation Table
- Columns: Header Card, TransDate, eMatch, Action
- Fewer data rows compared to the left view (approximately 3-4 visible rows).
- eMatch badges in red showing unmatched status.
- Action columns with checkboxes and icons.

### Preparation - Data from Machine Table
- Adjacent table showing machine-side data.
- Fewer rows visible.

### Reconcile Transaction Section
- **Red circle warning icon** with "Reconcile Transaction" label.
- A smaller warning/reconciliation area below.
- Some rows with red highlighted badges indicating discrepancies.
- Checkboxes and action icons present.

### Reader Card from Machine Table
- Similar narrow reader card table on the far right.

---

## Right View (State 3) - Reconcile Transaction with Expanded Data

### Right Detail Panel
- Shows "Reconciliation Transaction UNFIT" header with slightly different tab state.
- The "Holding Detail" tab appears to be in a different active state.
- Detail panel shows field-value pairs similar to other views.

### Preparation Table
- Columns: Header Card, TransDate, eMatch, Action
- Data rows visible with Header Card IDs and timestamps.

### Preparation - Data from Machine and Reconcile Transaction
- **Reconcile Transaction** label visible with associated data.
- A text block with Thai description/instructions about the reconciliation process.
- Machine data rows showing:
  - Header Card IDs (some in red text indicating issues)
  - Transaction dates
  - Red status badges (e.g., "100")
  - Action icons
- Multiple rows highlighted in pink/red background indicating mismatched or flagged records.

### Reader Card from Machine Table
- Narrow table on far right with reader card data and action icons.

---

## Visual Design Elements
- **Color Scheme**: White background, dark navy header bar, blue buttons and links, red/pink for warnings and errors.
- **Warning Icons**: Red triangle (exclamation) and red circle icons used for Reconcile Transaction warnings.
- **Status Badges**: Small red rectangular badges showing numbers (e.g., "100") for unmatched items.
- **Row Highlighting**: Pink/red background on table rows indicating discrepancies between preparation and machine data.
- **Action Icons**: Checkboxes, eye (view), pencil/document (edit) icons in action columns.
- **Typography**: Mix of English headers and Thai body/instruction text.

## Functional Purpose
These three views represent progressive states of the reconciliation process:
1. **State 1 (Left)**: Full reconciliation view with detailed warning message explaining specific matching issues.
2. **State 2 (Center)**: A simplified state with fewer records, possibly after some reconciliation actions have been taken.
3. **State 3 (Right)**: An expanded data view showing reconciliation results with highlighted discrepancies, possibly representing a different filter or processing stage.

All states feature the "Reconcile Transaction" label as a key workflow element, with warning indicators guiding users through the matching and resolution process.
