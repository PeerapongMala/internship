# Node 2:41247 - Popups (Edit, Confirm, OTP, Success, Cancel, Report)

## Overview
This screenshot shows a comprehensive collection of popup/modal dialogs and flow states used in the Reconciliation Transaction workflow. The popups are arranged in a grid-like layout across the canvas, connected by flow arrows indicating the sequence of user interactions. There are approximately 20+ distinct popup/dialog states visible, organized in a logical flow pattern.

## Popup Types and Descriptions

### Row 1 (Top Row) - Edit and Confirm Popups

#### 1. Edit/Settings Header Card (Top-Left)
- White dialog box with gray dimmed background.
- Title in Thai (appears to be "Edit/Settings Header Card" or similar).
- Contains form fields arranged in a row:
  - Multiple input fields with labels (appears to be card-related data fields).
  - Date/time related fields.
- Two buttons at the bottom:
  - "Cancel" button (outlined/gray, left side)
  - "Confirm/Save" button (blue/dark filled, right side)

#### 2. Confirm Dialog - Table View (Top-Center-Left)
- White dialog with Thai title (appears to be "Confirm" or similar).
- Subtitle text: "Confirm Header Card confirmation/reconciliation"
- Contains a data table with columns:
  - Checkbox column
  - Header Card
  - Date fields
  - Status/value columns
- "Confirm" button at bottom right (blue/dark filled).

#### 3. Confirm Dialog - Simplified (Top-Center-Right)
- Similar confirm dialog structure.
- Contains a table with fewer columns.
- "Confirm" button at bottom right.

#### 4. Edit/Settings Header Card - Variant (Top-Right)
- Similar to the first edit dialog but appears to be a variant state.
- Form fields for card editing.
- Cancel and Confirm buttons at bottom.

### Row 2 - Transaction Detail and Reconciliation Popups

#### 5. Transaction Detail Dialog (Left, Row 2)
- Larger white dialog with Thai title (transaction detail/summary).
- Shows "transaction details step 1" or similar header.
- Contains:
  - A colored status bar/tabs at the top (multiple colored segments: red, blue, green, etc.)
  - "Transaction details" section header in Thai
  - Detail fields with labels and values (e.g., "Page Header Card No.")
  - Navigation or action area at bottom
  - "Cancel" and "Confirm/Next" buttons

#### 6. Reconciliation Confirm Dialog (Center, Row 2)
- White dialog with Thai title.
- Header text referencing "Reconcile/Confirm" actions.
- Contains a data table with colored header row.
- "Details/Info" section below the table.
- "Confirm" button at bottom right (green/teal colored).

#### 7. Another Confirm Dialog (Center-Right, Row 2)
- White dialog similar structure to others.
- Contains table data for confirmation.
- "Confirm" button.

#### 8. Transaction Detail - Variant (Right, Row 2)
- Similar to item 5 but in a different state.
- Status bar at top with colored segments.
- Transaction detail fields.
- Action buttons at bottom.

### Row 3 - OTP and Further Confirmation States

#### 9. Transaction Detail - Step 2 (Left, Row 3)
- Transaction detail dialog in another step state.
- Status bar and detail fields.
- "Cancel/Back" and "Confirm/Next" buttons.

#### 10. Reconciliation Confirm - with Detail (Center-Left, Row 3)
- Reconciliation confirm dialog.
- Contains highlighted data fields.
- "Confirm" button (green/teal).

#### 11. Flow Label: "OTP Supervisor" (Center)
- A text label with arrow pointing downward.
- Indicates the flow transitions to OTP verification by a Supervisor role.
- Below it: "Confirm Success" label.

#### 12. Flow Label: "OTP Manager" (Center-Right)
- A text label with arrow pointing downward.
- Indicates OTP verification by a Manager role.
- Below it: "Confirm Success" label.

#### 13. Transaction Detail - Variant (Right, Row 3)
- Another variant of the transaction detail dialog.
- Status bars and detail sections.

### Row 4 - Transaction Detail Steps and Success States

#### 14. Transaction Detail - Step 3 (Left, Row 4)
- Transaction detail dialog showing a further step.
- Colored status bar segments.
- Detail fields.
- "Cancel" and "Confirm" buttons with additional action (appears to be a green "Confirm & Send" button).

#### 15. Success Dialog (Center, Row 4)
- White dialog with dimmed background.
- **Green checkmark circle icon** at the top center.
- Thai text below: appears to say "Success" or "Completed".
- Additional success message text.
- "OK/Close" button (green/teal).

#### 16. Success Dialog - Manager Path (Center-Right, Row 4)
- Similar success dialog.
- Green checkmark icon.
- Success message in Thai.
- "OK/Close" button.

#### 17. Transaction Detail - Step (Right, Row 4)
- Another transaction detail state.
- Colored status bar.
- "Confirm" button highlighted in a different color.

### Row 5 (Bottom Area) - Cancel, Report, and Final States

#### 18. Cancel/Failure Dialog (Bottom-Left)
- White dialog with dimmed background.
- **Green checkmark circle icon** (indicating successful cancellation).
- Thai text indicating cancellation/failure message with specific reference text (e.g., "Header Card XXXX").
- "OK/Close" button (green/teal).

#### 19. Print Cancel Reconcile Report (Bottom-Center-Left)
- Larger white dialog showing a printable report.
- Title: "Print Cancel Reconcile Report"
- Contains:
  - "Cancel Reconcile Report" header
  - Date field
  - Multiple labeled data fields (reference numbers, dates, descriptions) in Thai
  - A data table with multiple columns (appears to be financial data with numeric values)
  - Two buttons at bottom: "Cancel/Close" (outlined) and "Print/Export" (blue filled)

#### 20. Success Dialog - Variant (Bottom-Center-Right)
- Another success dialog state.
- Green checkmark icon.
- Success/completion text.
- "OK" button.

#### 21. Cancel Success Dialog (Bottom-Right)
- Success dialog with green checkmark icon.
- Thai text confirming "Cancel Header Card" success with reference text.
- "OK/Close" button (green/teal).

#### 22. Main Page Reference (Bottom-Left Corner)
- A small reference view of the full "Reconciliation Transaction UNFIT" page.
- Shows the complete page layout with header, filters, tabs, and data tables.
- Provides context for where these popups appear in the overall application.

#### 23. Print Cancel Reconcile Report - Variant (Bottom-Center)
- Another version of the print report dialog.
- "Cancel Reconcile Report" with slightly different data.
- Table with financial data columns.
- "Cancel" and "Print" buttons.

## Flow Connections
- Arrows connect various dialogs showing the user journey:
  - Edit/Confirm -> OTP Supervisor -> Confirm Success (left-center flow)
  - Edit/Confirm -> OTP Manager -> Confirm Success (right-center flow)
  - The flow indicates a two-level approval process: Supervisor OTP verification followed by Manager OTP verification.

## Visual Design Elements
- **Dialog Style**: White rounded-corner cards on gray dimmed overlay backgrounds.
- **Button Styles**:
  - Primary action: Dark blue or green/teal filled buttons
  - Secondary/Cancel: Outlined or gray buttons
- **Icons**: Green checkmark circles for success states, form inputs for edit dialogs.
- **Color Coding**: Status bars with multiple colored segments (red, blue, green, yellow) indicating different states or categories.
- **Typography**: Predominantly Thai text for labels and instructions, English for certain titles and technical terms.
- **Layout**: Dialogs are consistently centered with similar padding and spacing.

## Functional Purpose
This collection of popups represents the complete set of modal interactions in the reconciliation transaction workflow:
1. **Edit Dialogs**: For modifying Header Card data and transaction details.
2. **Confirm Dialogs**: For reviewing and confirming reconciliation actions with data tables.
3. **Transaction Detail Dialogs**: Multi-step detail views with status progression bars.
4. **OTP Verification**: Two-level OTP verification flow (Supervisor then Manager).
5. **Success Dialogs**: Confirmation of successful operations.
6. **Cancel Dialogs**: Confirmation of cancellation with success messages.
7. **Report Dialogs**: Printable Cancel Reconcile Report with detailed financial data tables.
