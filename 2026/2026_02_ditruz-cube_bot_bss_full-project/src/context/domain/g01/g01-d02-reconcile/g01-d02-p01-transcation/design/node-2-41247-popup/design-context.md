# Design Context: Node 2:41247 - Popup 20251105

> Figma Node ID: `2:41247`
> Source: Figma MCP `get_design_context` (sub-node `2:41248`)
> Parameters: `clientLanguages="html,css,javascript"`, `clientFrameworks="jquery"`, `artifactType="COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN"`
> Note: Full section contains multiple popup variants. Sub-node `2:41248` returned full code for the success alert popup.

## Section Overview

Section `2:41247` ("Popup 20251105") at 6378x6672 contains multiple popup/modal variants for the Reconciliation Transaction feature. Key child frames include:

1. `2:41248` - **Edit HeaderCard - 6** (Success Alert) - 1440x911
2. `2:41257` - **Edit HeaderCard - 7** (Edit Dialog Form) - 1440x900
3. `2:41300` - **Edit HeaderCard - 8** (OTP/Review Modal) - 1440x900

## Generated Code (Sub-node 2:41248 - Success Alert)

```javascript
// Reconciliation Transaction / Popup / Edit HeaderCard - 6
// Success alert modal after editing Header Card

const imgWrapper = "http://localhost:3845/assets/c8859305fe20a1615876ac508583e6886a4ea930.svg";

// Structure: Modal Alert overlay
// - Background: rgba(12,12,12,0.38) overlay
// - Modal container: white, rounded-12px, min 560x360, max 960x760
//   - Top Bar: success icon (48x48) + title text
//   - Message area: success message text
//   - Action bar: single confirm button (green #198754)
```

### Modal Alert (`2:41249`) - 560x360
- **Overlay**: `rgba(12,12,12,0.38)` background
- **Container**: White, `border-radius: 12px`, `border: 1px solid #eee`
  - Min: 560x360, Max: 960x760
- **Top Bar** (`2:41250`):
  - Success icon (48x48 SVG)
  - Title: "Success" (Thai: "สำเร็จ") - Pridi Medium 24px, #000
- **Message Area** (`2:41253`):
  - Text: "Edit Header Card successful" - Pridi Medium 20px, #000
- **Action Bar** (`2:41255`):
  - Border-top: `#cbd5e1`
  - Single button: "Confirm" (Thai: "ตกลง")
    - Background: `#198754` (Bootstrap success green)
    - Text: white, Pridi Regular 16px
    - Width: 160px, height: 38px, `border-radius: 6px`

## Edit Dialog Form (`2:41257`) - 560x383

### Modal Dialog (`2:41258`)
- **Top Bar** (`2:41259`): Title "Edit Header Card Data" (Thai)
- **Form Area** (`2:41261`) - 560x220:
  - **Row 1** (`2:41262`) - 538x78:
    - Field 1 (`2:41263`): Select dropdown, 163px, label "Bank"
    - Field 2 (`2:41268`): Select dropdown, 163px, label
    - Field 3 (`2:41273`): Text input, 163px, label
  - **Row 2** (`2:41279`) - 538x78:
    - Field 4 (`2:41280`): Select dropdown, 163px, label "Bank"
    - Field 5 (`2:41285`): Select dropdown, 163px, label
    - Field 6 (`2:41290`): Text input, 163px, label
- **Action Bar** (`2:41296`):
  - Cancel button (`2:41297`): left-aligned, 160x38
  - Save button (`2:41298`): right-aligned, 120x38

## OTP/Review Modal (`2:41300`) - 1280x700

### Template - Modal Dialog - OTP (`2:41301`)
- **Top Bar** (`2:41303`): "Review Edit" (Thai: "ตรวจสอบการแก้ไข")
- **Content Area** (`2:41305`) - 1280x577:
  - Info text: "Preparing to edit 2 items"
  - **Review Table** (`41:17042`) - 750x118:
    - Columns: Warning | # | Header Card (old) | Header Card (new) | Price | Container Barcode | Preparator | Source
    - Row 1: #1 | 0054941206 | 0054941209 | [badge] | BK12345 | [name] | Prepare
    - Row 2: #2 | 0054941206 | 0054941210 | [badge] | BK12345 | [name] | Machine
  - **Confirmation Section** (`2:41397` "Frame 6168") - 750x175:
    - Title: "Confirm Edit" (Thai: "ยืนยันการแก้ไข")
    - Form fields for confirmation (from metadata continuation)

## Design Tokens / Styles

```
Body Text/Body Color: #212529
Theme/Success: #198754
HitBox: #FFFFFF
Gray/White: #FFFFFF

Heading/H4: Pridi Medium, 24px, weight 500, line-height 1.2, letter-spacing 0.6px
Heading/H5: Pridi Medium, 20px, weight 500, line-height 1.2, letter-spacing 0.5px
Body/Regular: Pridi Regular, 16px, weight 400, line-height 1.5, letter-spacing 0.4px

Modal overlay: rgba(12,12,12,0.38)
Modal border: #eee (1px solid)
Modal border-radius: 12px
Action bar border-top: #cbd5e1 (slate/300)
Button border-radius: 6px
```

## Component Descriptions (from Figma)

- **icon-wrapper** (Node 1:14): Icon with multi-size support
- **button** (Node 1:7625): Button with styles for actions in forms/dialogs. Supports multiple sizes and states. See: https://getbootstrap.com/docs/5.3/components/buttons/
- **text/text** (Node 1:222): Text Bullet List
