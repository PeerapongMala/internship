# Node 2:38451 - Detail Views 1 (Side-by-Side Comparison States)

## Overview
This screenshot shows two side-by-side views of the "Reconciliation Transaction UNFIT" page. Both views display the same page layout but in slightly different states, representing comparison views for reconciliation data.

## Layout Structure

### Left View
- **Header**: Dark blue/navy top bar with the bank logo on the left and "Reconciliation" breadcrumb navigation. A bell notification icon is visible on the right side.
- **Page Title**: "Reconciliation Transaction UNFIT" in large bold text, with Thai text subtitle below (describing the UNFIT transaction reconciliation).
- **Filter Section**:
  - A text label instructs the user to enter a Header Card for searching UNFIT transactions (in Thai).
  - **Header Card** input field: A dark blue bordered text input on the left.
  - **Transaction count display**: Shows "100" as the total count with Thai labels for the count description and date range (KC-1).
  - **Action buttons**: "Filter" button (blue outlined), "Refresh" button (blue outlined with refresh icon).
  - **Secondary filters row**: Dropdowns for "Header Card" (with "Please select" placeholder), another dropdown with "Please select", and a "Clear Filter" text link.
- **Tab Navigation**: Three tabs at the top right area: "OverView", "Holding", and "Holding Detail" - with "OverView" appearing to be active.
- **Preparation Table (Left side)**:
  - Table header: "Preparation"
  - Columns: Header Card, TransDate, eMatch, Action
  - Multiple rows of data with:
    - Header Card IDs (e.g., OD04040104, OD04040125, etc.)
    - Transaction dates in DD/MM/YYYY HH:MM format
    - eMatch column showing colored status badges (red "100" badges indicating unmatched/error states)
    - Action column with eye icon (view) and document icon buttons
- **Preparation - Data from Machine Table (Right side)**:
  - Table header: "Preparation - Data from Machine"
  - Columns: Header Card, TransDate, TransDate, eMatch, Action
  - Similar data rows with matching Header Card IDs
  - eMatch badges showing "100" in blue/dark badges
  - Action column with checkbox and eye/document icons
  - Some rows are highlighted in red/pink background indicating discrepancies or errors

### Right View
- The same overall page structure as the left view.
- Slight differences in the state:
  - The right view shows a different data state or interaction state.
  - The "Preparation" table and "Preparation - Data from Machine" table layouts remain the same.
  - Some rows have different highlight colors - rows with red/pink backgrounds in the "Data from Machine" section indicate mismatched or flagged records.
  - The right side panel "Reader Card from Machine" shows additional detail columns including reader card numbers, dates, and action icons.
  - One row is highlighted in a pink/red background in the Preparation table as well, indicating a selected or flagged item.

### Right View - Additional Detail Panel
- A narrower panel on the far right shows "Reader Card from Machine" header.
- Contains columns: reader card, some date fields, eMatch, Action.
- Lists several reader card entries (e.g., RC0641003, RC045020, etc.) with associated dates and action icons.

## Visual Design Elements
- **Color Scheme**: Primarily white background with dark navy/blue header bar and blue accent colors for buttons, links, and active states.
- **Status Badges**: Small rectangular badges with numbers (e.g., "100") in red (error/unmatched) and blue/dark (matched or info).
- **Table Styling**: Alternating white rows with subtle borders, red/pink highlighted rows for discrepancies.
- **Icons**: Eye icons for viewing details, document/edit icons for actions, checkboxes for selection.
- **Typography**: Standard sans-serif font, with bold headers and regular weight for data cells. Mix of English and Thai text throughout.

## Functional Purpose
These two views represent different states of a reconciliation transaction comparison screen where:
1. Users can search and filter UNFIT (unmatched) transactions by Header Card.
2. The left "Preparation" table shows expected/planned transaction data.
3. The right "Data from Machine" table shows actual data captured from machines.
4. Color-coded status badges and row highlights indicate matching status and discrepancies between the two data sources.
5. Users can take actions (view details, edit, select) on individual records.
