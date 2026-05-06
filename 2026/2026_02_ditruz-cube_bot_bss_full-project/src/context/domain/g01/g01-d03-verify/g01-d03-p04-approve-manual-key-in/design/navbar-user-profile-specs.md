# Navbar and User Profile Specs - Figma Nodes 2-49758, 2-49761

**Date:** 2026-02-20
**Figma URLs:**
- Navbar: https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49758
- User Profile: https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49761
**Component:** Navbar Menu and User Profile Display

## Navbar Menu (Node 2-49758)

### Menu Items
- **Font:** Pridi SemiBold, 16px, weight 600
- **Color:** #B8D1D1 (for .nav-default class)
- **Padding:** 8px horizontal (left/right)
- **Letter spacing:** 0.025rem

### Dropdown Icons
- **Size:** 16px × 16px
- **Transform:** rotate(-90deg) when closed
- **Transform:** rotate(0deg) when expanded (aria-expanded="true")
- **Margin:** 4px left (gap between text and icon)
- **Transition:** transform 0.2s ease

## User Profile Display (Node 2-49761)

### Layout
- **Container:** `d-flex flex-column align-items-end` (vertical flex, right-aligned)
- **Spacing:** -6px margin-top for role (tight stacking)

### User Name (#user-name-display)
- **Font:** Pridi Regular, 13px, weight 400
- **Color:** #FFFBFB
- **Letter spacing:** 0.286px
- **Line height:** normal
- **Display:** block

### Role (#span-role-display)
- **Font:** Pridi Regular, 11px, weight 400
- **Color:** #F4F4F4
- **Letter spacing:** 0.242px
- **Line height:** normal
- **Margin top:** -6px (tight stacking)
- **Display:** block

## CSS Implementation

```css
/* Navbar Menu Items - Figma Node 2-49758 */
.bot-navbar .navbar-nav .nav-link {
    font-weight: 600; /* SemiBold */
    padding-left: 8px !important;
    padding-right: 8px !important;
    font-size: 16px !important;
    letter-spacing: 0.025rem !important;
}

/* Dropdown icon styling */
.bot-navbar .navbar-nav .dropdown-toggle::after {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    transform: rotate(-90deg);
    transition: transform 0.2s ease;
}

.bot-navbar .navbar-nav .dropdown-toggle[aria-expanded="true"]::after {
    transform: rotate(0deg);
}

/* User Profile Display - Figma Node 2-49761 */
#user-name-display {
    font-family: 'bss-pridi' !important;
    font-weight: 400 !important;
    font-size: 13px !important;
    color: #FFFBFB !important;
    letter-spacing: 0.286px !important;
    line-height: normal !important;
    margin: 0 !important;
}

#span-role-display {
    font-family: 'bss-pridi' !important;
    font-weight: 400 !important;
    font-size: 11px !important;
    color: #F4F4F4 !important;
    letter-spacing: 0.242px !important;
    line-height: normal !important;
    margin-top: -6px !important;
    margin-right: 1em !important;
    display: block !important;
}
```

## HTML Structure

```html
<!-- User Profile Container -->
<div class="d-flex flex-column align-items-end me-2">
    <span id="user-name-display">@User.FindFirst("FirstName")?.Value @User.FindFirst("LastName")?.Value</span>
    <span id="span-role-display">( @User.FindFirst("RoleName")?.Value )</span>
</div>
```

## Files Modified
- `project/frontend/BSS_WEB/wwwroot/css/Style.css` (lines 1066-1086, 206-225)
- `project/frontend/BSS_WEB/Views/Shared/_Layout.cshtml` (lines 68-73)
