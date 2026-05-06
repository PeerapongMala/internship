# Figma Node 2-49793 — Filter Section Specs

**Source**: Figma node `2:49793`
**Date extracted**: 2026-02-20
**Screenshot**: Captured successfully via `get_screenshot`
**Design Context**: `get_design_context` failed (fetch error) — specs below are visually extracted from screenshot

---

## Visual Description

The Filter Section is a 2-row horizontal filter bar containing labeled dropdown fields.

- **Row 1**: Header Card | Type | ธนาคาร | Zone | ศูนย์เงินสด/Cashpoint
- **Row 2**: Operator - Prepare | Operator - Reconcile | Supervisor(s) | สถานะ

All dropdowns show "ทั้งหมด" (all/default) as placeholder text.

---

## Layout

```css
/* Filter Section Container */
.filter-section {
  /* Total height approx 102px based on task spec */
  height: 102px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px; /* gap between row 1 and row 2 — visual estimate */
  padding: 8px 12px; /* visual estimate */
  background-color: #ffffff; /* white background observed */
  border: 1px solid #e0e0e0; /* light grey border — visual estimate */
}

/* Each filter row */
.filter-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px; /* gap between filter items */
  height: 40px; /* approx per row */
}
```

---

## Colors

| Element            | Value (Visual Estimate)  | Notes                             |
|--------------------|--------------------------|-----------------------------------|
| Section background | `#ffffff`                | White / light background          |
| Section border     | `#e0e0e0` or `#d9d9d9`  | Very light grey border            |
| Dropdown background| `#ffffff`                | White fill                        |
| Dropdown border    | `#d9d9d9` or `#bdbdbd`  | Light grey border on dropdown     |
| Dropdown text      | `#333333` or `#212121`  | Dark text for "ทั้งหมด"           |
| Label text         | `#333333` or `#555555`  | Label before dropdowns (e.g. "Type:") |
| Dropdown arrow     | `#757575`                | Chevron/arrow icon color          |

> NOTE: Exact hex values require `get_design_context` confirmation. Values above are visual estimates from screenshot.

---

## Typography

```css
/* Labels (e.g. "Header Card:", "Type:", "ธนาคาร:", "Zone:") */
.filter-label {
  font-family: 'Sarabun', sans-serif; /* Thai UI font assumed */
  font-size: 13px;  /* visual estimate */
  font-weight: 400; /* regular */
  color: #333333;
  white-space: nowrap;
}

/* Dropdown value text (e.g. "ทั้งหมด") */
.filter-dropdown-text {
  font-family: 'Sarabun', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #333333;
  letter-spacing: normal; /* 0 or default */
}
```

---

## Dropdowns

```css
/* Individual dropdown select */
.filter-dropdown {
  height: 32px;          /* visual estimate — typical compact dropdown */
  border-radius: 4px;    /* slight rounding observed */
  border: 1px solid #d9d9d9;
  padding: 4px 8px;
  background-color: #ffffff;
  font-size: 13px;
  color: #333333;
  cursor: pointer;
  appearance: none;      /* hide native arrow */
  /* custom arrow injected via pseudo or icon */
}

/* Widths per row 1 dropdowns (visual proportion estimate) */
/* Row 1: 5 dropdowns spread across full width */
.filter-dropdown--header-card  { min-width: 120px; }
.filter-dropdown--type         { min-width: 120px; }
.filter-dropdown--bank         { min-width: 120px; }
.filter-dropdown--zone         { min-width: 120px; }
.filter-dropdown--cashpoint    { min-width: 140px; }

/* Row 2: 4 dropdowns */
.filter-dropdown--op-prepare   { min-width: 140px; }
.filter-dropdown--op-reconcile { min-width: 140px; }
.filter-dropdown--supervisor   { min-width: 140px; }
.filter-dropdown--status       { min-width: 120px; }
```

---

## Buttons

> No Search or Clear buttons were visible in the screenshot for node 2:49793.
> This filter section appears to be dropdowns only. Search/Clear buttons may be in a sibling node.

If buttons are present (not visible in this node), expected specs:

```css
/* Search button */
.btn-search {
  background-color: #1976d2; /* blue — common search button */
  color: #ffffff;
  border-radius: 4px;
  padding: 6px 16px;
  /* icon: magnifying glass */
}

/* Clear button */
.btn-clear {
  background-color: transparent;
  color: #757575; /* grey */
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  padding: 6px 16px;
}
```

---

## CSS-Ready Variables

```css
:root {
  /* Filter Section */
  --filter-section-bg: #ffffff;
  --filter-section-border: #e0e0e0;
  --filter-section-height: 102px;
  --filter-section-padding: 8px 12px;
  --filter-row-gap: 8px;
  --filter-item-gap: 8px;

  /* Dropdown */
  --filter-dropdown-height: 32px;
  --filter-dropdown-border: #d9d9d9;
  --filter-dropdown-border-radius: 4px;
  --filter-dropdown-padding: 4px 8px;
  --filter-dropdown-bg: #ffffff;
  --filter-dropdown-text: #333333;

  /* Typography */
  --filter-font-family: 'Sarabun', sans-serif;
  --filter-font-size: 13px;
  --filter-font-weight: 400;
  --filter-label-color: #333333;
}
```

---

## Status

| Item                  | Status                |
|-----------------------|-----------------------|
| Screenshot            | Captured              |
| `get_design_context`  | FAILED (fetch error)  |
| Exact hex colors      | NOT confirmed — visual estimate only |
| Font family           | NOT confirmed — assumed Sarabun      |
| Exact dimensions      | NOT confirmed — visual estimate      |

> To get exact values, retry `get_design_context` on node `2:49793` when Figma MCP is available.
