# Navbar Design Specs — Node 2:49546

> Source: Figma MCP `get_screenshot` (2026-02-20). `get_design_context` returned fetch error; specs derived from screenshot visual analysis.

---

## Screenshot

![Navbar Screenshot](navbar-screenshot-2-49546.png)

Visible content (left to right):
- **Logo area**: Thai flag icon + Thai text "ธนาคารแห่งประเทศไทย / ระบบตรวจสอบการปันผลครบัตร" + "Version 1.0.0"
- **Menu items**: Pre - Preparation Unsort (dropdown), Auto Selling (dropdown), Revoke, Approve Manual Key-in (active), Report (dropdown)
- **User section**: "พัสมา โรโ" / "Officer" + avatar icon

---

## Colors

| Role                  | Value (estimated from screenshot) | CSS Variable           |
|-----------------------|-----------------------------------|------------------------|
| Navbar background     | `#1a3a5c` (dark navy blue)        | `--navbar-bg`          |
| Logo text (primary)   | `#ffffff`                         | `--navbar-logo-text`   |
| Logo text (secondary) | `#aac4e0` (light blue-gray)       | `--navbar-logo-sub`    |
| Menu item text        | `#ffffff`                         | `--navbar-menu-text`   |
| Active menu item      | `#ffffff` (with underline or bold)| `--navbar-active-text` |
| Active menu indicator | `#ffffff` or accent highlight     | `--navbar-active-line` |
| User name text        | `#ffffff`                         | `--navbar-user-name`   |
| User role text        | `#aac4e0` (muted)                 | `--navbar-user-role`   |
| Dropdown arrow        | `#ffffff`                         | `--navbar-arrow`       |

> Note: Exact hex values require `get_design_context` or `get_variable_defs`. Values above are visual estimates from screenshot. Confirm with variable defs when MCP is available.

---

## Typography

| Element              | Font Family     | Size     | Weight   | Color     |
|----------------------|-----------------|----------|----------|-----------|
| Logo bank name (TH)  | Sarabun / Noto Sans Thai | ~14px | 600 (SemiBold) | `#ffffff` |
| Logo system name (TH)| Sarabun / Noto Sans Thai | ~12px | 400 (Regular)  | `#aac4e0` |
| Version text         | Sarabun / Noto Sans Thai | ~11px | 400 (Regular)  | `#aac4e0` |
| Menu items           | Sarabun / Noto Sans Thai | ~14px | 500 (Medium)   | `#ffffff` |
| Active menu item     | Sarabun / Noto Sans Thai | ~14px | 600 (SemiBold) | `#ffffff` |
| User name            | Sarabun / Noto Sans Thai | ~13px | 500 (Medium)   | `#ffffff` |
| User role            | Sarabun / Noto Sans Thai | ~11px | 400 (Regular)  | `#aac4e0` |

---

## Layout

| Property              | Value           |
|-----------------------|-----------------|
| Navbar height         | `40px` (confirmed per task brief) |
| Navbar width          | `100%` (full width)               |
| Display               | `flex`                            |
| Align items           | `center`                          |
| Justify content       | `space-between`                   |
| Padding (horizontal)  | `~16px` left, `~16px` right       |
| Gap between menu items| `~24px`                           |

---

## Component Positions (left to right)

### 1. Logo Section (left)
```css
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.navbar-logo img {
  width: 32px;
  height: 32px;
}

.navbar-logo-text {
  display: flex;
  flex-direction: column;
}

.navbar-logo-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  font-family: 'Sarabun', sans-serif;
}

.navbar-logo-system {
  font-size: 12px;
  font-weight: 400;
  color: #aac4e0;
  font-family: 'Sarabun', sans-serif;
}

.navbar-version {
  font-size: 11px;
  font-weight: 400;
  color: #aac4e0;
  margin-left: 4px;
  font-family: 'Sarabun', sans-serif;
}
```

### 2. Navigation Menu (center)
Menu items (in order):
- Pre - Preparation Unsort (has dropdown arrow)
- Auto Selling (has dropdown arrow)
- Revoke
- **Approve Manual Key-in** (currently active page)
- Report (has dropdown arrow)

```css
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  justify-content: center;
}

.navbar-menu-item {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  font-family: 'Sarabun', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
  height: 40px;
  border-bottom: 2px solid transparent;
}

.navbar-menu-item:hover {
  border-bottom: 2px solid #ffffff;
}

.navbar-menu-item.active {
  font-weight: 600;
  border-bottom: 2px solid #ffffff;
}

.navbar-menu-item .dropdown-arrow {
  width: 12px;
  height: 12px;
  color: #ffffff;
}
```

### 3. User Section (right)
```css
.navbar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.navbar-user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.navbar-user-name {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  font-family: 'Sarabun', sans-serif;
}

.navbar-user-role {
  font-size: 11px;
  font-weight: 400;
  color: #aac4e0;
  font-family: 'Sarabun', sans-serif;
}

.navbar-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #2c5f8a;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## Full Navbar CSS (ready-to-use)

```css
/* ===== NAVBAR — Node 2:49546 ===== */

.navbar {
  width: 100%;
  height: 40px;
  background-color: #1a3a5c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.navbar-logo-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}
.navbar-logo-system {
  font-size: 12px;
  font-weight: 400;
  color: #aac4e0;
  line-height: 1.2;
}
.navbar-version {
  font-size: 11px;
  color: #aac4e0;
  margin-left: 6px;
}

/* Menu */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  justify-content: center;
}
.navbar-menu-item {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  border-bottom: 2px solid transparent;
  text-decoration: none;
}
.navbar-menu-item:hover,
.navbar-menu-item.active {
  border-bottom: 2px solid #ffffff;
  font-weight: 600;
}

/* User */
.navbar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.navbar-user-name {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  text-align: right;
}
.navbar-user-role {
  font-size: 11px;
  font-weight: 400;
  color: #aac4e0;
  text-align: right;
}
.navbar-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #2c5f8a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}
```

---

## Notes

- `get_design_context` returned a fetch error on both attempts. All color/typography values are visually estimated from the screenshot.
- To get exact design tokens, call `get_variable_defs` on node `2:49546` or retry `get_design_context` when MCP is available.
- The active page in the screenshot is **Approve Manual Key-in**, which matches the current domain page `g01-d03-p04-approve-manual-key-in`.
- Thai font: confirm whether project uses `Sarabun` (Google Fonts) or a local `Noto Sans Thai`.
