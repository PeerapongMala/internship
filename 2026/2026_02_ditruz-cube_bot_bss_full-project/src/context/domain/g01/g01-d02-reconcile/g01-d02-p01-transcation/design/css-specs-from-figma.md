# CSS Specs from Figma MCP

> Source: Figma MCP `get_design_context` tool
> Converted: Tailwind classes -> CSS properties
> Date: 2026-02-18

---

## 1. Title Bar (Node 32:26438)

### Page Title
```css
/* "Reconciliation Transaction UNFIT" */
.main-title h1 {
    font-family: 'Pridi', sans-serif;
    font-weight: 600;            /* SemiBold */
    font-size: 30px;
    line-height: 1.2;
    letter-spacing: 0.675px;
    color: #212121;              /* --texts/text-neutral-primary */
}

/* Thai subtitle */
.main-title p {
    font-family: 'Pridi', sans-serif;
    font-weight: 400;            /* Regular */
    font-size: 20px;
    line-height: 1.2;
    letter-spacing: 0.45px;
    color: #212121;
}
```

### Nav Buttons (Holding, Holding Detail)
```css
/* "เปิดหน้าจอ 2" button */
.btn-nav-screen2 {
    background: #003366;         /* Primary */
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: 'Pridi', sans-serif;
    font-weight: 400;            /* Regular */
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: 0.35px;
    gap: 8px;
    display: inline-flex;
    align-items: center;
}

/* "Holding" and "Holding Detail" buttons */
.btn-nav-holding {
    background: #003366;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-family: 'Pridi', sans-serif;
    font-weight: 500;            /* Medium */
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0.4px;
    gap: 8px;
    display: inline-flex;
    align-items: center;
}
```

---

## 2. Scanner Section (Node 32:26461)

### Container
```css
.scanner-section {
    background: white;           /* bg-white */
    display: flex;
    flex-direction: column;
    gap: 8px;                    /* gap-[8px] */
    padding: 16px 24px;         /* py-[16px] px-[24px] (--space/s-lg) */
    border-radius: 12px;        /* rounded-[12px] (--rounded/r-sm) */
    overflow: clip;
}
```

### Scanner Title
```css
.scanner-title {
    font-family: 'Pridi', sans-serif;
    font-weight: 500;            /* Medium */
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0.352px;
    color: #212121;              /* --texts/text-neutral-primary */
}
```

### Scanner Input Row
```css
.scanner-main-row {
    display: flex;
    gap: 8px;                    /* gap-[8px] */
    align-items: center;
    width: 100%;
}
```

### Header Card Label
```css
.scanner-field-label {
    font-family: 'Pridi', sans-serif;
    font-weight: 400;            /* Regular */
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0.35px;
    color: #212121;              /* --color/neutral-text-primary */
}
```

### Input Group
```css
.scanner-input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;                    /* --space/s-xxxsm */
    flex-shrink: 0;
}
```

### Input Wrapper (outer border glow)
```css
.scanner-input-wrapper {
    border: 5px solid rgba(41, 126, 212, 0.5);  /* border-5 border-[rgba(41,126,212,0.5)] */
    border-radius: 8px;         /* rounded-[8px] */
    width: 390.5px;             /* w-[390.5px] */
    height: 41px;               /* h-[41px] */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
}
```

### Input Field (inner)
```css
.scanner-input {
    background: #d1e5fa;         /* bg-[#d1e5fa] */
    border: 3px solid #297ed4;  /* border-3 border-[#297ed4] */
    border-radius: 8px;         /* rounded-[8px] */
    padding: 8px 12px;          /* py-[8px] px-[12px] */
    width: 100%;
    flex: 1 0 0;
    overflow: clip;
}
```

### Count Row (กระทบยอดแล้วทั้งหมด)
```css
.scanner-count-row {
    display: flex;
    gap: 8px;                    /* gap-[8px] */
    align-items: center;
    justify-content: center;
    height: 30px;               /* h-[30px] */
    font-size: 20px;            /* text-[20px] */
    line-height: 1.5;
    letter-spacing: 0.5px;      /* tracking-[0.5px] */
}

/* Normal text */
.scanner-count-row span {
    font-family: 'Pridi', sans-serif;
    font-weight: 400;            /* Regular */
    color: #212121;              /* --texts/text-neutral-primary */
}

/* Count badge (number "100") */
.count-badge {
    font-family: 'Pridi', sans-serif;
    font-weight: 700;            /* Bold */
    color: #b45309;              /* --texts/text-warning-primary */
    text-align: right;
    font-size: 20px;
}
```

### Location Row (กรุงเทพฯ M7-1 + ผลัดบ่าย)
```css
.scanner-location-row {
    display: flex;
    gap: 32px;                   /* gap-[32px] */
    align-items: center;
    justify-content: center;
    width: 100%;
    font-family: 'Pridi', sans-serif;
    font-weight: 500;            /* Medium */
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0.352px;
    color: #212121;              /* --texts/text-neutral-primary */
}
```

### Action Buttons (Filter, Refresh)
```css
.scanner-actions {
    display: flex;
    gap: 24px;                   /* gap-[24px] */
    align-items: flex-end;
    flex-shrink: 0;
    height: 100%;
}

.btn-filter,
.btn-refresh {
    background: #003366;         /* bg-[#036] = #003366 */
    color: white;
    border: none;
    height: 41px;               /* h-[41px] */
    padding: 4px 16px;          /* py-[4px] px-[16px] */
    border-radius: 4px;         /* rounded-[4px] */
    gap: 8px;                    /* gap-[8px] */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: clip;
    font-family: 'Pridi', sans-serif;
    font-weight: 500;            /* Medium */
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: 0.35px;
}
```

### Filter Row
```css
.filter-row {
    background: white;           /* bg-white */
    display: flex;
    gap: 24px;                   /* gap-[24px] (--sds-size-space-600) */
    align-items: center;
    justify-content: flex-end;
    padding-top: 8px;           /* pt-[8px] */
    width: 100%;
    overflow: clip;
}
```

### Filter Labels
```css
.filter-item label {
    font-family: 'Pridi', sans-serif;
    font-weight: 400;            /* Regular */
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0.35px;
    color: #212121;              /* --color/neutral-text-primary */
    white-space: nowrap;
}
```

### Filter Select (Small)
```css
.filter-select {
    background: white;
    border: 1px solid #ced4da;  /* border border-[#ced4da] */
    border-radius: 4px;         /* rounded-[4px] */
    padding: 5px 13px 5px 9px;  /* pl-[9px] pr-[13px] py-[5px] */
    cursor: pointer;
    font-family: 'Pridi', sans-serif;
    font-weight: 400;
    font-size: 14px;            /* text-[14px] (small size) */
    line-height: 1.5;
    letter-spacing: 0.35px;
    color: #6c757d;             /* text-[#6c757d] */
}
```

### Clear Filter Button
```css
.btn-clear-filter {
    background: #003366;         /* bg-[#036] */
    border: 1px solid #003366;  /* border border-[#036] */
    color: white;
    height: 31px;               /* h-[31px] */
    padding: 5px 17px;          /* py-[5px] px-[17px] */
    border-radius: 4px;         /* rounded-[4px] */
    gap: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: clip;
    font-family: 'Pridi', sans-serif;
    font-weight: 400;            /* Regular */
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: 0.35px;
}
```

---

## 3. Panel Header / List Header (Node 32:29199)

```css
.panel-header {
    display: flex;
    align-items: center;
    padding: 8px 16px;          /* py-[8px] px-[16px] (--space/s-md) */
    border-bottom: 1px solid #cbd5e1;  /* border-b border-[#cbd5e1] (--gray-300) */
    background: white;           /* NOT colored - white background */
    flex-shrink: 0;
}

.panel-title {
    font-family: 'Pridi', sans-serif;
    font-weight: 500;            /* Medium */
    font-size: 16px;
    line-height: 1.2;
    letter-spacing: 0.4px;
    color: #212121;              /* --texts/text-neutral-primary */
    flex: 1 0 0;
}
```

---

## 4. Table Header Row (Node 32:29202)

```css
.data-table thead tr {
    background: #d6e0e0;         /* bg-[#d6e0e0] */
    border-bottom: 1px solid #cbd5e1;  /* border-b border-[#cbd5e1] (--gray-300) */
    padding: 0 8px;             /* px-[8px] py-[0] (--space/s-zero) */
}

.data-table thead th {
    background: #d6e0e0;
    font-family: 'Pridi', sans-serif;
    font-weight: 500;            /* Medium (NOT 600) */
    font-size: 13px;
    line-height: normal;
    letter-spacing: 0.299px;     /* tracking-[0.299px] */
    color: #212121;              /* --texts/text-neutral-primary */
    text-align: center;
    padding: 8px;               /* p-[8px] */
    white-space: nowrap;
    border: none;                /* NO cell borders */
    border-bottom: 1px solid #cbd5e1;
}
```

### Sort Icon (in header cells)
```css
/* Sort icon next to header text */
.th-sort {
    display: flex;
    gap: 2px;                    /* gap-[2px] (--space/s-xxxxsm) */
    align-items: center;
    justify-content: center;
    padding: 8px;
    cursor: pointer;
    user-select: none;
}

.sort-icon {
    width: 12px;                /* size-[12px] */
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    opacity: 0.5;
}
```

### Column Widths (Preparation table - left panel)
```
Header Card:  105px    /* w-[105px] */
วันเวลา:     120px    /* w-[120px] */
ชนิดราคา:    110px    /* w-[110px] → but actual badge area = 100px */
Action:       78px     /* w-[78px] */
```

---

## 5. Table Body Row (Node 32:29217)

```css
.data-table tbody {
    padding: 0 8px;             /* px-[8px] on the list container */
}

.data-table tbody tr {
    height: 40px;               /* h-[40px] */
    display: flex (in Figma) → in HTML use height: 40px */
}

.data-table tbody td {
    font-family: 'Pridi', sans-serif;
    font-weight: 400;            /* Regular */
    font-size: 13px;
    line-height: normal;
    letter-spacing: 0.286px;     /* tracking-[0.286px] */
    color: #013661;              /* text-[#013661] */
    padding: 6px 8px;           /* py-[6px] px-[8px] */
    vertical-align: middle;
    border: none;                /* NO cell borders */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

### Date/Time Cell (SMALLER font)
```css
.data-table tbody td.td-datetime {
    font-family: 'Pridi', sans-serif;
    font-weight: 400;            /* Regular */
    font-size: 12px;             /* text-[12px] (NOT 13px like other cells) */
    line-height: 13px;           /* leading-[13px] */
    letter-spacing: 0.264px;     /* tracking-[0.264px] */
    color: #013661;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;       /* whitespace-pre-wrap (allows line break in date) */
    width: 92px;                 /* w-[92px] for text content */
}
```

### Alternating Row Stripes
```css
.data-table tbody tr:nth-child(odd) {
    background: white;
}

.data-table tbody tr:nth-child(even) {
    background: #f2f6f6;
}
```

### Action Buttons (in table row)
```css
.action-btns {
    display: flex;
    gap: 6px;                    /* gap-[6px] */
    align-items: center;
    justify-content: center;
    padding: 6px 12px;          /* py-[6px] px-[12px] */
}

.btn-action {
    width: 20px;                /* size-[20px] */
    height: 20px;
    background: transparent;     /* bg-[rgba(255,255,255,0)] = transparent */
    border: 1px solid black;    /* border border-[black] (--icons/icon-black) */
    border-radius: 4px;         /* rounded-[4px] */
    padding: 5px 9px;           /* py-[5px] px-[9px] (but size overrides) */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: clip;
    cursor: pointer;
}

/* Icon inside button */
.btn-action .bi {
    font-size: 10px;            /* icon wrapper size-[14px] but button is 20px */
}
```

---

## 6. Denomination Badge (Node 32:26806)

```css
.denom-badge {
    width: 47px;                /* Figma: 47x24px container */
    height: 24px;
    border: 2px solid;          /* border-2 */
    border-radius: 0;           /* NO border-radius */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: clip;
    position: relative;
}

/* Badge text */
.denom-badge {
    font-family: 'Pridi', sans-serif;
    font-weight: 700;            /* Bold */
    font-size: 13px;
    line-height: normal;
    text-align: center;
}
```

### Per-Denomination Colors (from Figma)
```css
/* Default */
.denom-badge {
    background: #e9ecef;
    border-color: #7d7c7c;
    color: #7d7c7c;
}

/* 20 baht */
.denom-badge-20 {
    background: #f1f9f1;
    border-color: #55b254;
    color: #55b254;
}

/* 50 baht */
.denom-badge-50 {
    background: #f0f8ff;
    border-color: #35a0fd;
    color: #015cab;
}

/* 100 baht (from Node 32:26806) */
.denom-badge-100 {
    background: #fff5f5;         /* bg-[#fff5f5] */
    border-color: #c07575;      /* border-[#c07575] */
    color: #8f4242;              /* text-[#8f4242] */
}

/* 500 baht */
.denom-badge-500 {
    background: #f8f5ff;
    border-color: #6a509d;
    color: #3d2e5b;
}

/* 1000 baht */
.denom-badge-1000 {
    background: #fbf8f4;
    border-color: #9f7d57;
    color: #4f3e2b;
}
```

---

## 7. Info Card (Node 32:26512)

```css
.info-card {
    background: white;           /* bg-white */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 12px;         /* py-[16px] px-[12px] (--space/s-md) */
    border-radius: 12px;        /* rounded-[12px] (--rounded/r-sm) */
    overflow: clip;
}
```

### Info Row (each label-value pair)
```css
.info-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0 4px;             /* px-[4px] */
    width: 100%;
    font-family: 'Pridi', sans-serif;
    font-weight: 400;            /* Regular */
    font-size: 13px;             /* text-[13px] */
    line-height: normal;
    letter-spacing: 0.325px;     /* tracking-[0.325px] */
    color: #212121;              /* --color/neutral-text-primary */
}

/* Label (left) */
.info-row-label {
    white-space: nowrap;
    font-weight: 400;            /* Regular (NOT 500 or 600) */
}

/* Value (right) */
.info-row span:last-child {
    text-align: right;
    width: 100px;               /* w-[100px] for value columns */
    white-space: pre-wrap;
}
```

### First Row (Date) - Special: has pink background
```css
.info-row:first-child {
    background: #f8d7da;        /* bg-[#f8d7da] (Theme/Danger light) */
    border-radius: 4px;         /* rounded-[4px] */
    padding: 0 4px;
}

/* Date row has an icon (14px) next to the value */
.info-row:first-child .icon-wrapper {
    width: 14px;
    height: 14px;
}
```

### Sorting Machine Row (no text wrap)
```css
/* Sorting Machine row has whitespace-nowrap on both label and value */
.info-row.info-row-machine {
    white-space: nowrap;
}
```

### Shift Row - Value is "ผลัดบ่าย" (afternoon shift)
```css
/* Shift value has pre-wrap */
.info-row.info-row-shift span:last-child {
    white-space: pre-wrap;
    width: 100px;
}
```

---

## 8. Panel Container

```css
.panel {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;        /* rounded-[12px] (--rounded/r-sm) */
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

---

## 9. Page Layout (Node 32:26437 metadata)

```css
/* Full page: 1440x900, content area starts at y=40 (below nav) */
/* Content frame: 1435x860 */

.page-columns {
    display: flex;
    gap: 8px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

/* Left column: 1071px out of 1403px total ≈ 76% → flex: 7 */
.col-left {
    flex: 7;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Right column: 316px out of 1403px total ≈ 23% → flex: 3 */
.col-right {
    flex: 3;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Two tables side by side */
.tables-row {
    flex: 1;
    display: flex;
    gap: 8px;
    min-height: 0;
    overflow: hidden;
}

/* Left table (Preparation): 445px */
.panel-left {
    flex: 3;
    min-width: 0;
}

/* Center table (Prep+Machine): 607px */
.panel-center {
    flex: 4;
    min-width: 0;
}

/* Right table (HC from Machine): fills col-right */
.panel-right {
    flex: 1;
    min-width: 0;
    min-height: 0;
}
```

---

## 10. Table Scroll Container

```css
.panel-table-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
    min-height: 0;
    /* Striped background for empty rows (40px row height) */
    background: repeating-linear-gradient(
        to bottom,
        white 0px, white 40px,
        #f2f6f6 40px, #f2f6f6 80px
    );
    background-position-y: 30px;  /* offset by header height */
}
```

---

## Design Tokens Summary

| Token | Value | Usage |
|-------|-------|-------|
| `--texts/text-neutral-primary` | `#212121` | Main text color |
| `--texts/text-warning-primary` | `#b45309` | Warning/count badge |
| `--texts/text-negative-primary` | `#991b1b` | Error/danger text |
| `--color/neutral-text-primary` | `#212121` | Form labels, info card text |
| `--icons/icon-black` | `black` | Action button borders |
| `--gray-300` / `Gray/300` | `#cbd5e1` | Panel borders, table header border |
| `--space/s-lg` | `24px` | Scanner section padding-x |
| `--space/s-md` | `16px` | Panel header padding-x, info card padding-y |
| `--space/s-xsm` | `8px` | General gap, input padding |
| `--space/s-xxxsm` | `4px` | Input group gap, filter item gap |
| `--space/s-xxxxsm` | `2px` | Sort icon gap |
| `--space/s-zero` | `0px` | Table header row padding-y |
| `--rounded/r-sm` | `12px` | Card/panel border radius |
| `Primary` | `#003366` | Button backgrounds |
| `Gray/600` | `#6c757d` | Select placeholder text |
| `Gray/400` | `#ced4da` | Select border |
| `Gray/White` | `#ffffff` | Background |
| `Theme/Danger` | `#dc3545` | Danger buttons |
| `HitBox` | `#ffffff` | Transparent hit areas |

---

## Font Specs

| Role | Font | Weight | Size | Line-Height | Letter-Spacing |
|------|------|--------|------|-------------|----------------|
| Page Title | Pridi | 600 (SemiBold) | 30px | 1.2 | 0.675px |
| Page Subtitle | Pridi | 400 (Regular) | 20px | 1.2 | 0.45px |
| Section Title (Scanner) | Pridi | 500 (Medium) | 16px | normal | 0.352px |
| Panel Title (H6) | Pridi | 500 (Medium) | 16px | 1.2 | 0.4px |
| Count Text | Pridi | 400 (Regular) | 20px | 1.5 | 0.5px |
| Count Badge | Pridi | 700 (Bold) | 20px | 1.5 | 0.5px |
| Location Row | Pridi | 500 (Medium) | 16px | normal | 0.352px |
| Button Text (Filter/Refresh) | Pridi | 500 (Medium) | 14px | 1.5 | 0.35px |
| Form Label | Pridi | 400 (Regular) | 14px | normal | 0.35px |
| Table Header | Pridi | 500 (Medium) | 13px | normal | 0.299px |
| Table Body | Pridi | 400 (Regular) | 13px | normal | 0.286px |
| Table DateTime | Pridi | 400 (Regular) | 12px | 13px | 0.264px |
| Info Card Text | Pridi | 400 (Regular) | 13px | normal | 0.325px |
| Denom Badge | Pridi | 700 (Bold) | 13px | normal | - |
| Select (Small) | Pridi | 400 (Regular) | 14px | 1.5 | 0.35px |
| Select (Medium) | Pridi | 400 (Regular) | 16px | 1.5 | 0.4px |
| Nav Button | Pridi | 500 (Medium) | 16px | 1.5 | 0.4px |

---

## Raw Figma Tailwind → CSS Mapping

```
Tailwind Class                         →  CSS Property
─────────────────────────────────────────────────────────
bg-white                               →  background: white / #ffffff
bg-[#d6e0e0]                           →  background: #d6e0e0
bg-[#d1e5fa]                           →  background: #d1e5fa
bg-[#fff5f5]                           →  background: #fff5f5
bg-[#f8d7da]                           →  background: #f8d7da
bg-[#036]                              →  background: #003366
bg-[rgba(255,255,255,0)]               →  background: transparent
text-[#212121]                         →  color: #212121
text-[#013661]                         →  color: #013661
text-[#8f4242]                         →  color: #8f4242
text-[#b45309]                         →  color: #b45309
text-[#991b1b]                         →  color: #991b1b
text-[#6c757d]                         →  color: #6c757d
text-white                             →  color: white / #ffffff
border-[#cbd5e1]                       →  border-color: #cbd5e1
border-[#ced4da]                       →  border-color: #ced4da
border-[#c07575]                       →  border-color: #c07575
border-[#297ed4]                       →  border-color: #297ed4
border-[rgba(41,126,212,0.5)]          →  border-color: rgba(41,126,212,0.5)
border-[#036]                          →  border-color: #003366
border-[black]                         →  border-color: black
border                                 →  border-width: 1px
border-2                               →  border-width: 2px
border-3                               →  border-width: 3px
border-5                               →  border-width: 5px
border-b                               →  border-bottom-width: 1px
rounded-[12px]                         →  border-radius: 12px
rounded-[8px]                          →  border-radius: 8px
rounded-[6px]                          →  border-radius: 6px
rounded-[4px]                          →  border-radius: 4px
font-['Pridi:SemiBold',sans-serif]     →  font-family: 'Pridi', sans-serif; font-weight: 600
font-['Pridi:Medium',sans-serif]       →  font-family: 'Pridi', sans-serif; font-weight: 500
font-['Pridi:Regular',sans-serif]      →  font-family: 'Pridi', sans-serif; font-weight: 400
font-['Pridi:Bold',sans-serif]         →  font-family: 'Pridi', sans-serif; font-weight: 700
text-[30px]                            →  font-size: 30px
text-[20px]                            →  font-size: 20px
text-[16px]                            →  font-size: 16px
text-[14px]                            →  font-size: 14px
text-[13px]                            →  font-size: 13px
text-[12px]                            →  font-size: 12px
tracking-[0.675px]                     →  letter-spacing: 0.675px
tracking-[0.5px]                       →  letter-spacing: 0.5px
tracking-[0.45px]                      →  letter-spacing: 0.45px
tracking-[0.4px]                       →  letter-spacing: 0.4px
tracking-[0.352px]                     →  letter-spacing: 0.352px
tracking-[0.35px]                      →  letter-spacing: 0.35px
tracking-[0.325px]                     →  letter-spacing: 0.325px
tracking-[0.299px]                     →  letter-spacing: 0.299px
tracking-[0.286px]                     →  letter-spacing: 0.286px
tracking-[0.264px]                     →  letter-spacing: 0.264px
leading-[1.2]                          →  line-height: 1.2
leading-[1.5]                          →  line-height: 1.5
leading-[13px]                         →  line-height: 13px
leading-[normal]                       →  line-height: normal
gap-[32px]                             →  gap: 32px
gap-[24px]                             →  gap: 24px
gap-[16px]                             →  gap: 16px
gap-[8px]                              →  gap: 8px
gap-[6px]                              →  gap: 6px
gap-[4px]                              →  gap: 4px
gap-[2px]                              →  gap: 2px
px-[24px]                              →  padding-left: 24px; padding-right: 24px
px-[16px]                              →  padding-left: 16px; padding-right: 16px
px-[12px]                              →  padding-left: 12px; padding-right: 12px
px-[8px]                               →  padding-left: 8px; padding-right: 8px
px-[4px]                               →  padding-left: 4px; padding-right: 4px
py-[16px]                              →  padding-top: 16px; padding-bottom: 16px
py-[8px]                               →  padding-top: 8px; padding-bottom: 8px
py-[6px]                               →  padding-top: 6px; padding-bottom: 6px
py-[5px]                               →  padding-top: 5px; padding-bottom: 5px
py-[4px]                               →  padding-top: 4px; padding-bottom: 4px
p-[8px]                                →  padding: 8px
pt-[8px]                               →  padding-top: 8px
w-[390.5px]                            →  width: 390.5px
w-[250px]                              →  width: 250px
w-[200px]                              →  width: 200px
w-[150px]                              →  width: 150px
w-[120px]                              →  width: 120px
w-[110px]                              →  width: 110px
w-[105px]                              →  width: 105px
w-[100px]                              →  width: 100px
w-[92px]                               →  width: 92px
w-[78px]                               →  width: 78px
w-[47px]                               →  width: 47px
h-[41px]                               →  height: 41px
h-[40px]                               →  height: 40px
h-[31px]                               →  height: 31px
h-[30px]                               →  height: 30px
h-[24px]                               →  height: 24px
size-[20px]                            →  width: 20px; height: 20px
size-[16px]                            →  width: 16px; height: 16px
size-[14px]                            →  width: 14px; height: 14px
size-[12px]                            →  width: 12px; height: 12px
flex-[1_0_0]                           →  flex: 1 0 0
```
