# Node 2:39725 - Detail Views 2 (Warning State + Alert Popup)

## Overview
This screenshot shows two states of the "Reconciliation Transaction UNFIT" page: the main page in a warning/alert state on the left, and a modal alert popup dialog on the right overlaid on a dimmed background.

## Left View - Main Page with Warning State

### Header
- Dark blue/navy top bar with bank logo on the left and "Reconciliation" breadcrumb navigation.
- Bell notification icon on the right side.

### Page Title
- "Reconciliation Transaction UNFIT" in large bold text.
- Thai subtitle text below the title.

### Filter Section
- Instruction text in Thai for entering a Header Card to search UNFIT transactions.
- **Header Card** input field with dark blue border on the left.
- **Transaction count**: Shows "100" with description text and date range (KC-1).
- **Action buttons**: "Filter" (blue outlined) and "Refresh" (blue filled with refresh icon).
- **Secondary filters**: Header Card dropdown ("Please select"), another dropdown ("Please select"), and "Clear Filter" link.

### Tab Navigation
- Three tabs visible: "OverView" (or similar), "Holding", and "Holding Detail".

### Data Panel (Right side of main view)
- A detail panel showing field-value pairs:
  - Date field with timestamp (e.g., 25/17/2566 06:00)
  - Service/Reconciliation related fields
  - Booking Machine reference
  - Cash field
  - Additional Thai-labeled data fields

### Header Card from Machine Table
- Table with columns: Header Card, Date, eMatch, Action
- Multiple rows of data with card IDs and dates
- Action icons (eye, document) for each row

### Preparation and Reconcile Transaction Section
- **Warning banner**: A red/orange triangle warning icon with "Reconcile Transaction" label.
- **Preparation table** on the left:
  - Columns: Header Card, TransDate, eMatch, Action
  - Multiple rows (e.g., OD50401008, OD50401012, etc.)
  - eMatch column showing red "100" badges
  - Action columns with checkboxes and icons
- **Machine data table** on the right (labeled as part of Reconcile Transaction):
  - Contains a prominent warning message in Thai text (yellow/orange highlighted area) explaining reconciliation rules about Quality and Output for Header Cards, with references to specific card IDs and Manual Key-in instructions.
  - Below the warning: rows of machine data with Header Card IDs, dates, and status badges
  - Some rows highlighted in red/pink indicating discrepancies
  - Rows with red text for card IDs (e.g., OD50401208) indicating errors or flagged items

### Machine Table
- Additional columns showing transaction dates and "100" badges in red
- Action icons (checkboxes, view, edit) for each row

## Right View - Alert Popup Dialog

### Overlay
- The entire background is dimmed with a semi-transparent gray overlay, indicating a modal dialog.

### Alert Dialog Box
- Centered white rounded-corner dialog box.
- **Warning icon**: A red circle with white exclamation mark at the top center.
- **Title**: Thai text reading approximately "warning/alert" in bold.
- **Message body**: Thai text describing a warning about Quality and Output for Header Cards. The message references specific card IDs (formatted in brackets like [XXXXXXXXX]) and explains that the system detected issues with Header Card reconciliation, advising about Manual Key-in for transaction reconciliation.
- **Action button**: A single dark blue "OK/Confirm" button at the bottom center of the dialog (Thai text on the button).

## Visual Design Elements
- **Color Scheme**: White background, dark navy header, blue accent buttons, red/orange for warnings and errors.
- **Warning indicators**: Red triangle warning icon in the table section, red circle exclamation icon in the popup.
- **Status badges**: Red "100" badges for unmatched items.
- **Highlighted rows**: Pink/red background rows indicating discrepancies.
- **Modal overlay**: Semi-transparent gray backdrop for the alert popup.
- **Typography**: Mix of English and Thai text, bold for headers and warnings.

## Functional Purpose
This view represents:
1. A warning state during the reconciliation process where the system has detected issues with matching Header Cards between preparation data and machine data.
2. The warning message explains specific problems with Quality and Output matching for certain Header Cards.
3. The alert popup provides a focused warning notification that the user must acknowledge before proceeding.
4. The reconciliation table shows which specific records have discrepancies that need attention.
