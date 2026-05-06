# Screenshot Description - Cancel Send Popup OTP - 3

**Node ID:** 2:31555
**Date:** 2026-02-19
**Source:** Figma MCP `get_screenshot`

## Visual Description

The screenshot shows a **Cancel Send** modal dialog centered on a dimmed overlay background (semi-transparent dark gray).

### Modal Structure (top to bottom):

1. **Title Bar**: White background with bottom border. Title text "Cancel Send" in medium weight, ~24px font size.

2. **Info Section**: Contains three rows of key-value data:
   - **Header Card** (left) --- **0054941525** (right)
   - **ชนิดราคา** (left) --- **[1000]** badge (right) - the denomination badge has a tan/brown border with pattern background
   - **จำนวน (ฉบับ)** (left) --- **997** (right)

3. **Confirmation Section**:
   - Sub-heading: **ยืนยัน Cancel Send** (bold/medium, ~24px)
   - Label: **เลือก Manager** (14px, right-aligned above dropdown)
   - **Dropdown select**: Shows "วทัญญู งานดี" as selected value, with down-chevron icon. Standard Bootstrap-style select with rounded border (#ced4da).

4. **Footer Bar**: White background with top border. Two buttons:
   - **Left button** "ยกเลิก" (Cancel) - Gray background (#6c757d), white text, 160px min-width, rounded 6px
   - **Right button** "ส่งคำขออนุมัติแก้ไข" (Send approval request) - Dark navy (#003366), white text, rounded 6px

### Key Observations

- This is **NOT an OTP input modal** despite the node name containing "OTP". The design shows a **manager selection confirmation modal** for cancel send operations.
- No OTP digit input fields are visible.
- No timer display is visible.
- No resend button is visible.
- The modal name "Cancel Send Popup OTP - 3" may refer to step 3 of a multi-step flow, where OTP was a previous step and this is the manager approval step.
- The modal dimensions are approximately 560px wide x 500px tall.
- Corner radius is 12px on the modal container.
