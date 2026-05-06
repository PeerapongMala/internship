# Figma Node 2:49832 — Detail Breakdown Table
# "แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้"

Extracted: 2026-02-20
Source: Figma MCP get_screenshot + get_metadata + get_variable_defs

---

## Layout

```css
/* Outer container */
.detail-breakdown-table {
  width: 900px;
  height: 249px; /* min-height; grows with rows */
}

/* Inner Table wrapper */
.detail-breakdown-table .table {
  width: 900px;
}
```

---

## Structure & Dimensions

| Section        | Node ID   | x   | y   | width | height |
|----------------|-----------|-----|-----|-------|--------|
| Frame (root)   | 2:49832   | 0   | 0   | 900   | 249    |
| Table          | 2:49833   | 0   | 0   | 900   | 249    |
| List Header    | 2:49834   | 0   | 0   | 900   | 45     |
| Column Headers | 2:49845   | 0   | 45  | 900   | 30     |
| List Row 1     | 2:49862   | 0   | 75  | 900   | 40     |
| List Row 2     | 2:49937   | 0   | 115 | 900   | 40     |
| List Row 3     | 2:49949   | 0   | 155 | 900   | 40     |

---

## Colors

```css
/* Variable tokens from get_variable_defs */
--color-text-primary:        #212121;   /* Texts/text-neutral-primary */
--color-text-body:           #212529;   /* Body Text/Body Color */
--color-text-muted:          #6C757D;   /* Gray/600 */
--color-border:              #cbd5e1;   /* Gray-300 / Strokes/stroke-neutral-primary / Separators/seprator-opaque */
--color-table-row-bg:        #f8fafc;   /* Slate/50 — alternating row background */
--color-white:               #FFFFFF;   /* HitBox */

/* Header section (List Header bar) — visually light/white from screenshot */
--color-list-header-bg:      #FFFFFF;

/* Table column header row — light gray from screenshot */
--color-table-header-bg:     #f8fafc;   /* Slate/50 */

/* Denomination badge — golden/tan border visible in screenshot */
--color-badge-border:        #C9A96E;   /* observed from screenshot (gold tone) */
--color-badge-bg:            #FFFFFF;
--color-badge-text:          #212121;   /* Texts/text-neutral-primary */
```

---

## Typography

```css
/* Header title: "แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้" */
/* Heading/H6 token */
.detail-breakdown-table .list-header-title {
  font-family: 'Pridi', sans-serif;
  font-size: 16px;
  font-weight: 500;           /* Medium */
  line-height: 1.2;
  letter-spacing: 2.5px;
  color: #212121;             /* Texts/text-neutral-primary */
}

/* Column header labels (ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ) */
/* Table header token */
.detail-breakdown-table .col-header {
  font-family: 'Pridi', sans-serif;
  font-size: 13px;
  font-weight: 500;           /* Medium */
  line-height: 100%;          /* = 13px */
  letter-spacing: 2.3px;      /* 2.299999952316284 */
  color: #212121;
}

/* Body text (ดี, เสีย, Reject, 17, 4, 995, 1) */
/* Body/Small token */
.detail-breakdown-table .cell-text {
  font-family: 'Pridi', sans-serif;
  font-size: 14px;
  font-weight: 400;           /* Regular */
  line-height: 1.5;
  letter-spacing: 2.5px;
  color: #212529;             /* Body Text/Body Color */
}

/* Denomination badge label (1000) */
/* Form Label token */
.detail-breakdown-table .badge-label {
  font-family: 'Pridi', sans-serif;
  font-size: 13px;
  font-weight: 400;           /* Regular */
  line-height: 100%;
  letter-spacing: 2.5px;
  color: #212121;
}
```

---

## Header Section

```css
/* "List Header" bar — top title row */
.detail-breakdown-table .list-header {
  width: 900px;
  height: 45px;
  background-color: #FFFFFF;
  padding-left: 16px;         /* Space/s-md */
  display: flex;
  align-items: center;
}

/* Title text container */
.detail-breakdown-table .list-header .title-frame {
  /* x:16, y:13, width:868, height:19 */
  padding-left: 16px;
}
```

---

## Column Headers Row

```css
/* Column header row */
.detail-breakdown-table .col-header-row {
  width: 900px;
  height: 30px;
  background-color: #f8fafc;   /* Slate/50 */
  display: flex;
  align-items: center;
  border-top: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
}

/* Each header cell */
.detail-breakdown-table .col-header-cell {
  width: 221px;               /* each of 4 cols = 221px (4 × 221 = 884px + 8px margin = 892px, fits 900) */
  height: 30px;
  padding-left: 8px;
  display: flex;
  align-items: center;
}

/* Sort icon (12×12px) */
.detail-breakdown-table .sort-icon {
  width: 12px;
  height: 12px;
  margin-left: 4px;           /* Space/s-xxxxsm = 2px gap */
}
```

---

## Column Widths

| Column       | x offset | Width  | Content alignment |
|--------------|----------|--------|-------------------|
| ชนิดราคา     | 8        | 221px  | left (badge)      |
| ประเภท       | 229      | 221px  | left              |
| แบบ          | 450      | 221px  | left              |
| จำนวนฉบับ   | 671      | 221px  | right (number)    |

---

## Data Rows

```css
/* Each list row */
.detail-breakdown-table .list-row {
  width: 900px;
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #cbd5e1;
}

/* Row inner frame */
.detail-breakdown-table .list-row .row-frame {
  margin: 0 8px;              /* x:8, width:884 */
  width: 884px;
  height: 40px;
  display: flex;
  align-items: center;
}

/* Alternating row background */
.detail-breakdown-table .list-row:nth-child(odd) {
  background-color: #FFFFFF;
}
.detail-breakdown-table .list-row:nth-child(even) {
  background-color: #f8fafc;  /* Slate/50 */
}

/* Cell content */
.detail-breakdown-table .cell {
  width: 221px;
  height: 40px;
  padding: 0 8px;
  display: flex;
  align-items: center;
}
```

---

## Denomination Badge (ชนิดราคา)

```css
/* Badge container: 47×24px with border-radius 12px (Rounded/r-sm) */
.denomination-badge {
  width: 47px;
  height: 24px;
  border-radius: 12px;        /* Rounded/r-sm */
  border: 1px solid #C9A96E;  /* golden border (observed from screenshot) */
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px;                /* x:8, y:8 inside cell — Space/s-xsm = 8px */
}

/* Badge text "1000" */
.denomination-badge .badge-label {
  font-family: 'Pridi', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 2.5px;
  color: #212121;
  /* text x:7.5 offset, width:32px */
  padding: 0 7.5px;
}
```

---

## Spacing Tokens Used

```css
--space-zero:   0px;    /* Space/s-zero */
--space-xxxxsm: 2px;    /* Space/s-xxxxsm */
--space-xsm:    8px;    /* Space/s-xsm */
--space-md:     16px;   /* Space/s-md */
--radius-sm:    12px;   /* Rounded/r-sm */
```

---

## Full Component CSS (Ready to Use)

```css
/* ===== Detail Breakdown Table (Node 2:49832) ===== */

.detail-breakdown-table {
  width: 900px;
  font-family: 'Pridi', sans-serif;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  overflow: hidden;
  background-color: #FFFFFF;
}

/* Title Header */
.detail-breakdown-table .list-header {
  height: 45px;
  padding: 13px 16px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #cbd5e1;
}

.detail-breakdown-table .list-header .title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 2.5px;
  color: #212121;
}

/* Column Header Row */
.detail-breakdown-table .col-header-row {
  height: 30px;
  background-color: #f8fafc;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
}

.detail-breakdown-table .col-header-row .col-header-cell {
  width: 221px;
  padding: 5px 8px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 2.3px;
  color: #212121;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Data Rows */
.detail-breakdown-table .list-row {
  height: 40px;
  display: flex;
  padding: 0 8px;
  border-bottom: 1px solid #cbd5e1;
  background-color: #FFFFFF;
}

.detail-breakdown-table .list-row:nth-child(even) {
  background-color: #f8fafc;
}

.detail-breakdown-table .list-row .cell {
  width: 221px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 2.5px;
  color: #212529;
}

/* Denomination Badge */
.detail-breakdown-table .denomination-badge {
  width: 47px;
  height: 24px;
  border-radius: 12px;
  border: 1px solid #C9A96E;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 2.5px;
  color: #212121;
}
```

---

## Notes

- `get_design_context` returned a fetch error (network/rate-limit); specs derived from `get_variable_defs` + `get_metadata` + visual screenshot analysis.
- Badge border color `#C9A96E` is visually observed from screenshot (golden/tan tone); confirm with Figma if exact hex needed.
- The "จำนวนธนบัตรครบ 1 มัด" sub-header rows (nodes 2:49837, 2:49841) are `hidden="true"` in Figma — conditional display logic needed.
- Empty list rows (2:49961, 2:49962, 2:49963) are placeholder rows at y=195, 235, 275 — render as empty or omit.
