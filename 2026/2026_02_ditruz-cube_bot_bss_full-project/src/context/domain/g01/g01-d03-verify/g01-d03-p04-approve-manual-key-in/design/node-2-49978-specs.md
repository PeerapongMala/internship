# Figma Node 2-49978 — Main Table (รายการ Header Card) Design Specs

## Source
- **Node ID**: 2-49978
- **Label**: Main Table — รายการ Header Card
- **Date extracted**: 2026-02-20
- **Method**: get_screenshot (get_design_context fetch failed, visual analysis used)

---

## Screenshot Reference
The table is a full-width data grid with Thai language content. Columns include:
- บาร์โค้ดสายฝอ, บาร์โค้ดสายเอ็น, Header Card, สาขา, Zone, ตู้เก็บเงิน/Cashpoint, ประเภทขนบัตร, วันเวลารับรัก, วันเวลาสิ้นสุด, Operator - Prepare, Sorter, Operator - Reconcile, Supervisor สั่งเก็บ, Supervisor สั่งเก็บ (repeated), etc.

---

## Colors (CSS-ready hex values)

```css
/* --- Header Row --- */
--table-header-bg: #f0f0f0;           /* Light gray header background */
--table-header-text: #333333;         /* Dark gray header text */
--table-header-border: #d0d0d0;       /* Header bottom border */
--table-header-sort-icon: #888888;    /* Sort icon (arrow indicators) */

/* --- Body Rows --- */
--table-row-bg-odd: #ffffff;          /* White — odd rows */
--table-row-bg-even: #f9f9f9;         /* Very light gray — even rows (alternating) */
--table-row-hover-bg: #e8f4ff;        /* Light blue hover state */
--table-row-selected-bg: #cce5ff;     /* Slightly deeper blue — selected state */
--table-row-text: #333333;            /* Body text color */
--table-row-text-muted: #666666;      /* Muted text for dash placeholders "-" */

/* --- Borders --- */
--table-border-color: #e0e0e0;        /* Cell/row border color */
--table-border-outer: #d0d0d0;        /* Outer table border */
--table-border-header-bottom: #cccccc; /* Thicker border under header */
```

---

## Typography

```css
/* --- Header --- */
--table-header-font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
--table-header-font-size: 12px;
--table-header-font-weight: 600;       /* Semi-bold */
--table-header-line-height: 1.4;
--table-header-letter-spacing: 0px;
--table-header-text-align: center;     /* Centered column headers */

/* --- Body --- */
--table-body-font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
--table-body-font-size: 12px;
--table-body-font-weight: 400;         /* Regular */
--table-body-line-height: 1.4;
--table-body-letter-spacing: 0px;
--table-body-text-align: left;         /* Left-aligned body cells (date/time centered) */
--table-body-text-align-center: center; /* For date/time, numeric, status cells */
```

---

## Layout

```css
/* --- Table Dimensions --- */
--table-width: 1408px;
--table-min-width: 1408px;

/* --- Row Heights --- */
--table-header-row-height: 36px;       /* Header row height */
--table-body-row-height: 32px;         /* Standard body row height */

/* --- Cell Padding --- */
--table-cell-padding-x: 8px;
--table-cell-padding-y: 6px;
--table-cell-padding: 6px 8px;

/* --- Column Widths (estimated from screenshot) --- */
--col-barcode-1: 160px;                /* บาร์โค้ดสายฝอ */
--col-barcode-2: 160px;                /* บาร์โค้ดสายเอ็น */
--col-header-card: 100px;              /* Header Card */
--col-branch: 80px;                    /* สาขา */
--col-zone: 60px;                      /* Zone */
--col-cashpoint: 140px;                /* ตู้เก็บเงิน/Cashpoint */
--col-type: 130px;                     /* ประเภทขนบัตร */
--col-date-start: 120px;               /* วันเวลารับรัก */
--col-date-end: 120px;                 /* วันเวลาสิ้นสุด */
--col-operator-prepare: 110px;         /* Operator - Prepare */
--col-sorter: 100px;                   /* Sorter */
--col-operator-reconcile: 120px;       /* Operator - Reconcile */
--col-supervisor-1: 120px;             /* Supervisor สั่งเก็บ */
--col-supervisor-2: 120px;             /* Supervisor สั่งเก็บ (2nd) */
```

---

## Header Styling

```css
.table-header {
  background-color: #f0f0f0;           /* var(--table-header-bg) */
  color: #333333;                      /* var(--table-header-text) */
  font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid #cccccc;    /* var(--table-border-header-bottom) */
  height: 36px;
  padding: 6px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Sort icon (arrow indicators, visible on hover/active) */
.table-header .sort-icon {
  color: #888888;                      /* var(--table-header-sort-icon) */
  font-size: 10px;
  margin-left: 4px;
  opacity: 0.6;
}
.table-header.sorted .sort-icon {
  opacity: 1.0;
  color: #555555;
}
```

---

## Row Styling

```css
/* Odd rows */
.table-row:nth-child(odd) {
  background-color: #ffffff;           /* var(--table-row-bg-odd) */
}

/* Even rows (alternating) */
.table-row:nth-child(even) {
  background-color: #f9f9f9;           /* var(--table-row-bg-even) */
}

/* Hover state */
.table-row:hover {
  background-color: #e8f4ff;           /* var(--table-row-hover-bg) */
  cursor: pointer;
}

/* Selected state */
.table-row.selected,
.table-row:focus {
  background-color: #cce5ff;           /* var(--table-row-selected-bg) */
  outline: none;
}

/* Body cells */
.table-cell {
  font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  padding: 6px 8px;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Placeholder dash cells */
.table-cell.empty {
  color: #666666;
  text-align: center;
}
```

---

## Full Table CSS (Combined)

```css
.main-table {
  width: 1408px;
  min-width: 1408px;
  border-collapse: collapse;
  border: 1px solid #d0d0d0;
  font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
  font-size: 12px;
  table-layout: fixed;
}

.main-table thead tr {
  background-color: #f0f0f0;
  height: 36px;
}

.main-table thead th {
  font-size: 12px;
  font-weight: 600;
  color: #333333;
  text-align: center;
  padding: 6px 8px;
  border: 1px solid #d0d0d0;
  border-bottom: 2px solid #cccccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.main-table tbody tr {
  height: 32px;
}

.main-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.main-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.main-table tbody tr:hover {
  background-color: #e8f4ff;
}

.main-table tbody tr.selected {
  background-color: #cce5ff;
}

.main-table tbody td {
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  padding: 6px 8px;
  border: 1px solid #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## Notes
- `get_design_context` returned a fetch error; all values above are derived from visual analysis of the screenshot.
- Thai font stack: `'Sarabun', 'Noto Sans Thai', sans-serif` — consistent with other pages in this domain.
- Sort icons (arrows) are visible on each header column with `◇` style indicators (bidirectional sort).
- The table uses horizontal scrolling given the large number of columns exceeding viewport width.
- Date/time columns appear center-aligned; text/name columns appear left-aligned.
