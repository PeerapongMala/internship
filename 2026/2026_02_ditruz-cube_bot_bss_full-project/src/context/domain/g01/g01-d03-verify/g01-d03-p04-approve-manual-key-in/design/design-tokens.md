# Design Tokens — Approve Manual Key-in

**Figma Source:**

- Node 2:49537 — Main screen (1440×900px)
- Node 3683:112494 — Complete flow with modals

---

## Colors

### Backgrounds

- **Page background:** White/Light gray (`#FFFFFF`, `#F8F9FA`)
- **Navigation bar:** Dark background (40px height)
- **Modal overlay:** Semi-transparent dark (`rgba(0,0,0,0.5)`)
- **Modal background:** White (`#FFFFFF`)
- **Table header:** Light gray (`#F2F6F6` or `#E9ECEF`)
- **Table row alternate:** White/Light (`#FFFFFF`, `#F8F9FA`)

### Borders

- **Standard border:** Light gray (`#DEE2E6`, `#CED4DA`)
- **Table separator:** Subtle gray (`#E0E0E0`)
- **Input border:** Medium gray (`#CED4DA`)
- **Focus border:** Primary blue (`#0D6EFD`)

### Status/Action Colors

- **Success:** Green (`#198754`, `#28A745`)
- **Danger/Reject:** Red (`#DC3545`)
- **Warning:** Orange/Yellow (`#FFC107`)
- **Info:** Blue (`#0DCAF0`)
- **Primary action:** Blue (`#0D6EFD`)

---

## Typography

### Font Family

- **Primary:** Pridi (Thai-optimized)
- **Fallback:** 'bss-pridi', -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif

### Font Sizes

- **Page title:** 24-30px (large heading)
- **Section headers:** 18-22px
- **Table headers:** 14-16px (font-weight: 600)
- **Body text:** 14px (standard)
- **Small text:** 12px (metadata, hints)
- **Form labels:** 14px (font-weight: 500)

### Font Weights

- **Extra bold:** 700 (page titles)
- **Bold:** 600 (headers, emphasized text)
- **Medium:** 500 (labels, sub-headers)
- **Regular:** 400 (body text)

### Line Heights

- **Headings:** 1.2-1.3
- **Body text:** 1.5
- **Tight spacing:** 1.0-1.2 (table cells, compact layouts)

---

## Spacing

### Component Padding

- **Page container:** 16px horizontal margin
- **Section padding:** 24px vertical, 32px horizontal
- **Table cell:** 8px padding
- **Button padding:** 8px vertical, 16px horizontal
- **Modal padding:** 32px

### Element Gaps

- **Between sections:** 24px vertical gap
- **Filter row gap:** 16px between filter groups
- **Button group gap:** 12px between buttons
- **Table row spacing:** 0px (tight rows, 40px height)
- **Form field gap:** 16px vertical

### Measurements

- **Navigation bar height:** 40px
- **Page header height:** 62px
- **Filter panel height:** 102px (2 rows)
- **Table row height:** 40px
- **Input height:** 36px (standard), 46-48px (larger buttons)
- **Modal title area:** 141px
- **Modal message area:** 143px
- **Modal action area:** 70px
- **Divider line:** 1px

---

## Border Radius

- **Buttons:** 4-6px (standard), 8px (larger buttons)
- **Input fields:** 4px
- **Modals:** 8-12px corners
- **Table container:** 8px
- **Banknote badges:** 4px (47×24px size)
- **Status pills:** 16-20px (fully rounded)

---

## Layout Dimensions

### Main Layout

- **Page dimensions:** 1440×900px
- **Content width:** 1408px (with 16px margins)
- **Right panel width:** 500px
- **Left content area:** 900px (when right panel exists)

### Navigation Header

- **Height:** 40px
- **Logo size:** 30×30px
- **User dropdown:** 99×34px
- **Menu nav width:** 1011×25px

### Page Header

- **Height:** 62px
- **Title width:** 747px
- **Status indicator groups:** 235px + 250px
- **Back button:** 92×36px

### Filter Panel

- **Total height:** 102px
- **Row 1 width:** 1376px (5 filters)
- **Row 2 width:** 1304px (4 filters × 326px each)
- **Filter label-select pairs:** 248-256px each
- **Select dropdown height:** 31px

### Tables

- **Main table:** 1408×407px (below filters)
- **Denomination table:** 900×249px
  - Section header: 45px height
  - Table header: 30px height
  - Data rows: 40px height each
  - Column widths: 221px each (4 columns)
  - Banknote images: 47×24px
  - Scrollbar: 8px width
- **Details panel:** 500×249px
  - Note input: 468×62px
  - Buttons: 468×46px, 468×48px
  - Divider: 468×1px

### Modals

- **Confirmation modal:** 560×360px (centered)
  - Icon area: 48×48px (top center)
  - Title: 97×29px
  - Message: 365×24px
  - Buttons: 160×38px, 158×38px
- **Success modal:** 560×360px (centered at 440,269.5)
  - Top bar: 560×141px
  - Message area: 560×143px
  - Action area: 560×70px
  - OK button: 160×38px

---

## Component Specifications

### Banknote Badge

- **Size:** 47×24px
- **Border:** 2px solid (color varies by status)
- **Border radius:** 4px
- **Text:** 12-14px, centered
- **Background:** White or light color

### Status Badge

- **Height:** 24-28px
- **Border radius:** 16-20px (pill shape)
- **Padding:** 4px horizontal, 8px vertical
- **Text:** 12px, font-weight: 500

### Buttons

- **Standard:** 36-38px height, 12px padding horizontal
- **Large:** 46-48px height, 16px padding horizontal
- **Primary:** Blue background, white text
- **Secondary:** White background, gray border, dark text
- **Success:** Green background, white text
- **Danger:** Red background, white text
- **Back button:** 92×36px with icon
- **Modal buttons:** 160×38px (confirm/cancel)

### Input Fields

- **Standard height:** 36px
- **Text area height:** Variable (min 62px for note input)
- **Border:** 1px solid gray
- **Border radius:** 4px
- **Focus state:** Blue border, box-shadow

### Dropdowns/Selects

- **Height:** 31-36px
- **Width:** Variable (109-278px based on context)
- **Border:** 1px solid gray
- **Border radius:** 4px
- **Arrow icon:** Right-aligned, 12-16px

---

## Interaction States

### Hover

- **Buttons:** Darken background 10%, subtle transform
- **Table rows:** Light gray background (`#F8F9FA`)
- **Links:** Underline, color shift

### Active/Selected

- **Table row:** Border or background highlight
- **Button:** Pressed state (darker, transform: scale(0.98))
- **Input focus:** Blue border, box-shadow glow

### Disabled

- **Buttons:** Gray background, cursor: not-allowed
- **Inputs:** Light gray background, gray text
- **Opacity:** 0.6-0.7

---

## Responsive Breakpoints

⚠️ **Note:** Design is 1440px fixed width. If responsive behavior needed:

- **Desktop:** 1440px+ (default)
- **Laptop:** 1200-1439px (scale proportionally)
- **Tablet:** 768-1199px (stack panels vertically)
- **Mobile:** <768px (single-column layout)

---

## z-index Layers

- **Base content:** 1
- **Fixed header:** 100
- **Dropdown menus:** 200
- **Modal overlay:** 1000
- **Modal content:** 1050
- **Tooltip/Toast:** 2000

---

## Animation/Transitions

- **Button hover:** 0.2s ease
- **Modal fade-in:** 0.3s ease-in-out
- **Table row highlight:** 0.15s ease
- **Dropdown open:** 0.2s ease
- **Toast notification:** 0.3s slide-in, 0.2s fade-out
