# Design Context — Node 1:22426 (Success Modal)

## Structure

Centered confirmation dialog — same pattern as delete modal:
- **Top section**: Success icon (check-circle-fill, green) + title "สำเร็จ", centered
- **Body**: Success message (dynamic text), centered
- **Footer**: Single "ตกลง" button, centered

## Interaction

- Shown after successful operations (delete, edit, reconcile)
- Message text is dynamic (set via JS)
- Button dismisses modal
