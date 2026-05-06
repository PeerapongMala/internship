# Design Context — Node 1:22404 (Delete Modal)

## Structure

Centered confirmation dialog — no standard header bar:
- **Top section**: Warning icon (exclamation-diamond-fill, orange) + title text, centered
- **Body**: Confirmation message, centered
- **Footer**: Cancel + Confirm buttons, centered with 24px gap

## Interaction

- Open: click delete (trash) icon in summary table action column
- Confirm: deletes the row from summary table, shows success modal
- Cancel: closes modal, no changes

## Visual Notes

- No remark/textarea field
- No close (X) button
- Icon color is #FD7E14 (orange), not red
- Confirm button is btn-danger (#DC3545)
