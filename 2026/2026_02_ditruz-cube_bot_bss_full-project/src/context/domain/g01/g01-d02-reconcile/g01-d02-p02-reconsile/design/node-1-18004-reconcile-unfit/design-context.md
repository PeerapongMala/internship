# Design Context — Node 1:18004 (Reconcile - Unfit)

## Layout Structure

Full page (1440x900) with vertical layout:

1. **Title** — "Reconciliation UNFIT" at top-left
2. **Top Panel** — semi-transparent white container (rgba 255,255,255,0.8), border-radius 16px
   - **Info Card Bar** — 3 items: Header Card (badge), จำนวนมัด (warning), Date/Time (bold)
   - **2-Column Split**:
     - Left: Denomination Table (3 columns: Header Card, ชนิดราคา, จำนวนมัด)
     - Right: Input Form (radio groups, denom chips, form fields, save button)
3. **Summary Table** — 9-column table with sort icons, action buttons
4. **Bottom Actions** — Cancel + Reconcile buttons (space-between)

## Component Hierarchy

```
.reconsile-layout (1410px, 92vh)
├── .reconsile-title > h1
├── .reconsile-main
│   ├── .reconsile-top-panel
│   │   ├── .reconsile-info-card > .reconsile-info-row > .reconsile-info-item[]
│   │   └── .reconsile-split
│   │       ├── .reconsile-split-left > .reconsile-denom-table-wrapper
│   │       └── .reconsile-split-right > .reconsile-input-form
│   │           ├── .reconsile-form-group (ประเภทธนบัตร radio)
│   │           ├── .reconsile-form-group (ชนิดราคา chips)
│   │           ├── .reconsile-fields-row (แบบ + จำนวน)
│   │           └── .reconsile-btn-save-summary
│   ├── .reconsile-summary-wrapper > table
│   └── .reconsile-bottom-actions
```

## 4 BnType Variants

| Variant | CSS Class | Gradient |
|---|---|---|
| Unfit | reconsile-unfit | nav-blue-light |
| Unsort CC | reconsile-unsort-cc | #f5a986 → #f8d4ba |
| CA Member | reconsile-ca-member | nav-green |
| CA Non-Member | reconsile-ca-non-member | nav-purple |
