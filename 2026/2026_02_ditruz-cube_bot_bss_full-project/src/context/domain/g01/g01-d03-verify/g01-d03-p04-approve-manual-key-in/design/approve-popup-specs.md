# Approve Success Popup Specs - Figma Node 2-50270

**Date:** 2026-02-20
**Figma URL:** https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-50270
**Component:** Approve Manual Key-in Success Modal

## Modal Container

- **Width:** 560px
- **Background:** #FFFFFF (white)
- **Border:** 1px solid #EEEEEE
- **Border radius:** 12px
- **Box shadow:** 0 4px 16px rgba(0, 0, 0, 0.2)

## Top Bar Section

- **Padding:** 32px vertical, 16px horizontal
- **Alignment:** center

### Icon
- **Size:** 48px × 48px
- **Color:** #198754 (green checkmark)
- **Margin:** 0 auto 16px (centered, 16px gap below)

### Title (e.g., "สำเร็จ")
- **Font:** Pridi Medium, 24px, weight 500
- **Color:** #000000 (black)
- **Letter spacing:** 0.6px
- **Line height:** normal

## Message Area

- **Min height:** 143px
- **Padding:** 24px vertical, 32px horizontal
- **Display:** flex (centered vertically and horizontally)
- **Alignment:** center

### Message Text (e.g., "บันทึกข้อมูลสำเร็จ")
- **Font:** Pridi Medium, 20px, weight 500
- **Color:** #000000 (black)
- **Letter spacing:** 0.5px
- **Line height:** normal

## Action Area (Footer)

- **Padding:** 16px
- **Display:** flex, centered
- **Gap:** 24px
- **Border top:** 1px solid var(--separator)

### OK Button (e.g., "ตกลง")
- **Width:** 160px (min-width)
- **Height:** 38px
- **Background:** #198754 (green)
- **Color:** #FFFFFF (white)
- **Border radius:** 6px
- **Font:** Pridi Regular, 16px, weight 400
- **Padding:** 8px 24px
- **Hover:** #157347 (darker green)

## CSS Implementation

```css
/* Figma Node 2-50270 - Success Modal */
.approve-modal,
.approve-modal-success {
  width: 560px;
  background-color: var(--white);
  border-radius: 12px;
  border: 1px solid #EEEEEE;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.approve-modal-top-bar {
  padding: 32px 16px;
  text-align: center;
}

.approve-modal-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  display: block;
}

.approve-modal-title {
  font-family: var(--font-family-base);
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.6px;
  color: #000000;
  margin: 0;
}

.approve-modal-message-area {
  min-height: 143px;
  padding: 24px 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.approve-modal-message {
  font-family: var(--font-family-base);
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.5px;
  color: #000000;
  margin: 0;
}

.approve-modal-action-area {
  padding: 16px;
  display: flex;
  justify-content: center;
  gap: 24px;
  border-top: 1px solid var(--separator);
}

.approve-modal-button-cancel,
.approve-modal-button-confirm,
.approve-modal-button-ok {
  min-width: 160px;
  height: 38px;
  border-radius: 6px;
  font-family: var(--font-family-base);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: normal;
  cursor: pointer;
  border: none;
  padding: 8px 24px;
}

.approve-modal-button-ok {
  background-color: #198754;
  color: #FFFFFF;
}

.approve-modal-button-ok:hover {
  background-color: #157347;
}
```

## HTML Structure (from Index.cshtml)

```html
<!-- Success Modal -->
<div class="approve-modal-overlay" id="successModal" style="display:none;">
    <div class="approve-modal-success">
        <div class="approve-modal-top-bar">
            <img class="approve-modal-icon" src="data:image/svg+xml,..." width="24" height="24" alt="">
            <h3 class="approve-modal-title">Success</h3>
        </div>
        <div class="approve-modal-message-area">
            <p class="approve-modal-message" id="successMessage">บันทึกสำเร็จ</p>
        </div>
        <div class="approve-modal-action-area">
            <button class="approve-modal-button-ok" onclick="closeSuccessModal()">OK</button>
        </div>
    </div>
</div>
```

## Files Modified
- `project/frontend/BSS_WEB/wwwroot/css/approveManualKeyIn/approveManualKeyInTransaction.css` (lines 905-999)

## Design Variables

### Colors
- **Green (Success):** #198754
- **Green (Hover):** #157347
- **Black (Text):** #000000
- **White:** #FFFFFF
- **Border:** #EEEEEE

### Typography
- **Title:** Pridi Medium 24px, letter-spacing 0.6px
- **Message:** Pridi Medium 20px, letter-spacing 0.5px
- **Button:** Pridi Regular 16px

### Spacing
- **Top bar padding:** 32px / 16px
- **Content padding:** 24px / 32px
- **Footer padding:** 16px
- **Button min-width:** 160px
- **Content min-height:** 143px

### Border Radius
- **Modal:** 12px
- **Button:** 6px
