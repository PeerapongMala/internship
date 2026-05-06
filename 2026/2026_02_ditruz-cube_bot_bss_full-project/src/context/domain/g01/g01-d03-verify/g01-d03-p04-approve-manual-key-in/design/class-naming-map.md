# Class Naming Map — Approve Manual Key-in

**Purpose**: ใช้เป็นคู่มืออ้างอิงเมื่อ inspect element ในบราวเซอร์ เพื่อบอก AI แก้ CSS ทีละจุดได้ชัดเจน

**Last Updated**: 2026-02-20

---

## 📋 Figma Node to HTML/CSS Mapping

### 1. Page Header Section

**Figma Node**: `2-49769`
**Section Name**: Page Header
**Container Class**: `.approve-page-header`

| Element | Class Name | Description | Current Status |
|---------|------------|-------------|----------------|
| Container | `.approve-page-header` | Main wrapper (62px height) | ✅ |
| Left section | `.approve-header-left` | Title area | ✅ |
| Page title | `.approve-page-title` | "Approve Manual Key-in" | ✅ |
| Center section | `.approve-header-center` | Date + ธปท info | ✅ |
| Status group | `.approve-status-group` | Each info pair | ✅ |
| Status label | `.approve-status-label` | "Date:", "ธปท:" | ⚠️ Need Figma colors |
| Status value | `.approve-status-value` | Data values | ⚠️ Need Figma colors |
| Right section | `.approve-header-right` | Filter button area | ✅ |
| Filter button | `.approve-btn-filter` | Toggle filter button | ⚠️ Need icon + colors |

---

### 2. Navbar Section

**Figma Node**: `2-49546`
**Section Name**: Navigation Bar
**Container Class**: `.navbar` (shared component)

| Element | Class Name | Description | Current Status |
|---------|------------|-------------|----------------|
| Container | `.navbar` | Top navigation bar (40px) | ❌ Not in this page |
| Logo area | `.navbar-brand` | BSS logo + title | ❌ Missing |
| Menu nav | `.navbar-nav` | Menu items | ❌ Missing |
| User section | `.navbar-user` | User profile dropdown | ❌ Missing |

**Note**: Navbar มักเป็น shared layout component ใน `_Layout.cshtml`

---

### 3. Filter Section

**Figma Node**: `2-49793`
**Section Name**: Filter Panel
**Container Class**: `.approve-filter-section`

| Element | Class Name | Description | Current Status |
|---------|------------|-------------|----------------|
| Container | `.approve-filter-section` | Main filter panel (102px) | ✅ |
| Row 1 | `.approve-filter-row:nth-child(1)` | First row (5 filters) | ✅ |
| Row 2 | `.approve-filter-row:nth-child(2)` | Second row (4 filters + buttons) | ✅ |
| Filter item | `.approve-filter-item` | Each label+select pair | ✅ |
| Filter label | `.approve-filter-label` | "Header Card:", "Type:", etc. | ⚠️ Need exact spacing |
| Filter select | `.approve-filter-select` | Dropdown element | ⚠️ Need exact styling |
| Actions wrapper | `.approve-filter-actions` | Button container | ✅ |
| Search button | `.approve-btn-search` | "ค้นหา" button | ⚠️ Need icon + colors |
| Clear button | `.approve-btn-clear` | "ล้างค่า" button | ⚠️ Need exact styling |

**Specific Filters** (for granular targeting):
- `#filterHeaderCard` → Header Card dropdown
- `#filterType` → Type dropdown
- `#filterBank` → ธนาคาร dropdown
- `#filterZone` → Zone dropdown
- `#filterCashpoint` → ศูนย์เงินสด/Cashpoint dropdown
- `#filterOperatorPrepare` → Operator - Prepare dropdown
- `#filterOperatorReconcile` → Operator - Reconcile dropdown
- `#filterSupervisor` → Supervisor(s) dropdown
- `#filterStatus` → สถานะ dropdown

---

### 4. Main Table Section

**Figma Node**: `2-49978`
**Section Name**: Main Transaction Table
**Container Class**: `.approve-main-table-section`

| Element | Class Name | Description | Current Status |
|---------|------------|-------------|----------------|
| Section wrapper | `.approve-main-table-section` | Outer container | ✅ |
| Table wrapper | `.approve-table-wrapper` | Scrollable wrapper | ✅ |
| Table | `.approve-main-table` | Main table element | ✅ |
| Table header | `.approve-main-table thead` | Header row | ⚠️ Need bg color |
| Header cell | `.approve-main-table th` | Each header cell | ⚠️ Need styling |
| Sortable header | `.th-sort` | Sortable columns | ⚠️ Need icon |
| Sort icon | `.sort-icon` | Chevron icon | ⚠️ Need styling |
| Table body | `.approve-main-table tbody` | Data rows | ✅ |
| Table row | `.approve-main-table tbody tr` | Each data row | ⚠️ Need hover state |
| Table cell | `.approve-main-table td` | Each data cell | ⚠️ Need styling |

**Column Classes** (for specific column targeting):
- `.col-select` → Checkbox column
- `.col-no` → ลำดับ column
- `.col-header-card` → Header Card column
- `.col-machine` → Machine column
- `.col-denom` → ชนิดราคา column
- `.col-m7-qty` → จำนวน M7 column
- `.col-manual-qty` → จำนวน Manual column
- `.col-diff` → ผลต่าง column
- `.col-status` → สถานะ column
- `.col-prepare-date` → วันที่เตรียม column
- `.col-action` → จัดการ column

---

### 5. Detail Breakdown Table

**Figma Node**: `2-49832`
**Section Name**: Detail Breakdown Table (Bottom Left)
**Container Class**: `.approve-detail-breakdown`

| Element | Class Name | Description | Current Status |
|---------|------------|-------------|----------------|
| Container | `.approve-detail-breakdown` | Main wrapper (900px) | ✅ |
| Header section | `.approve-detail-header` | Title + HC code | ✅ |
| Title text | `.approve-detail-title` | "แสดงผลการนับคัด..." | ⚠️ Need styling |
| HC code display | `.approve-detail-hc` | Header Card code value | ⚠️ Need styling |
| Table wrapper | `.approve-detail-table-wrapper` | Scrollable wrapper | ✅ |
| Table | `.approve-detail-table` | Detail table element | ✅ |
| Table header | `.approve-detail-table thead` | Header row | ⚠️ Need bg color |
| Table body | `.approve-detail-table tbody` | Data rows | ✅ |
| Table row | `.approve-detail-table tbody tr` | Each row (ดี/เสีย/Reject) | ⚠️ Need styling |

**Column Classes**:
- `.col-denom-badge` → ชนิดราคา (denomination badge)
- `.col-bn-type` → ประเภทธนบัตร
- `.col-form` → รูปแบบการนับคัด (ดี/เสีย/Reject)
- `.col-qty` → จำนวน

**Special Elements**:
- `.denom-badge` → Denomination badge (47×24px) — ต้องใช้ `<img>` ใน table

---

### 6. Action Panel

**Figma Node**: `2-49964`
**Section Name**: Action Panel (Bottom Right)
**Container Class**: `.approve-action-panel`

| Element | Class Name | Description | Current Status |
|---------|------------|-------------|----------------|
| Container | `.approve-action-panel` | Main wrapper (500px) | ✅ |
| Content wrapper | `.approve-action-content` | Inner content area | ✅ |
| Notes section | `.approve-notes-section` | Label + textarea wrapper | ✅ |
| Notes label | `.approve-notes-label` | "หมายเหตุ:" label | ⚠️ Need styling |
| Notes textarea | `.approve-notes-textarea` | Textarea input (468px) | ⚠️ Need exact size |
| Buttons section | `.approve-buttons-section` | Buttons container | ✅ |
| Approve button | `.approve-button-approve` | Green approve button (468×46px) | ⚠️ Need icon + text |
| Separator | `.approve-button-separator` | Line between buttons | ⚠️ Need exact color |
| Denied button | `.approve-button-denied` | Red denied button (468×48px) | ⚠️ Need icon + text |

**Button IDs** (for JS targeting):
- `#btnApprove` → Approve button
- `#btnDeny` → Denied button

**Expected Content**:
- Approve button: `<i class="bi bi-check-circle"></i> อนุมัติ (Approve)`
- Denied button: `<i class="bi bi-x-circle"></i> ปฏิเสธ (Denied)`

---

## 🎯 How to Use This Map

### When inspecting in browser:

1. **Right-click element** → Inspect
2. **Find the class name** in DevTools
3. **Look up in this table** to find:
   - Figma node ID (for spec reference)
   - Section name (for context)
   - Current status (what needs fixing)

### When requesting AI to fix CSS:

**❌ Bad request**:
```
"แก้ปุ่ม Filter ให้ตรงกับ Figma"
```

**✅ Good request**:
```
"แก้ class `.approve-btn-filter` (Page Header section, Node 2-49769)
ให้มีไอคอน bi-funnel สีขาว และพื้นหลังสีน้ำเงินตาม Figma"
```

---

## 📝 Naming Convention Rules

### Pattern:
```
.approve-{section}-{component}-{variant}
```

### Examples:
- `.approve-page-header` → Page header section
- `.approve-filter-section` → Filter section
- `.approve-filter-label` → Label in filter section
- `.approve-main-table` → Main table
- `.approve-detail-breakdown` → Detail breakdown table
- `.approve-action-panel` → Action panel
- `.approve-button-approve` → Approve button

### Why this pattern?
1. **Prefix `approve-`**: Avoids global CSS conflicts
2. **Section name**: Easy to locate (page/filter/table/detail/action)
3. **Component**: Describes element type (button/label/select/table)
4. **Variant** (optional): Specific style variation (approve/denied/search)

---

## 🔍 Quick Reference: Class to Figma Node

| Class Prefix | Figma Node | Section |
|--------------|------------|---------|
| `.approve-page-header*` | 2-49769 | Page Header |
| `.navbar*` | 2-49546 | Navigation Bar |
| `.approve-filter-*` | 2-49793 | Filter Section |
| `.approve-main-table*` | 2-49978 | Main Table |
| `.approve-detail-*` | 2-49832 | Detail Breakdown |
| `.approve-action-*` | 2-49964 | Action Panel |

---

## 🚀 Next Steps

1. ✅ Use this map to identify exact classes when inspecting
2. ⚠️ Get Figma specs for each node (6 nodes)
3. ⚠️ Update CSS file with exact Figma values
4. ⚠️ Verify in browser using class names from this map

---

**Note**: Classes marked with ⚠️ need Figma specs to be applied correctly.
