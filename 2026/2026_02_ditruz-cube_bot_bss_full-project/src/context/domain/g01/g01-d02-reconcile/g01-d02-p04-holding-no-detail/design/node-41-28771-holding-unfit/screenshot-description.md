# Screenshot Description: Holding UNFIT Page

**Figma Node ID:** `41:28771`
**Node Name:** Holdin - Unfit
**Dimensions:** 1440 x 900

## Overall Layout

The screen is a full-width page with a light gray/white background. It is structured vertically into the following major sections from top to bottom:

1. **Top Navigation Bar**
2. **Page Header with Action Buttons**
3. **Transaction Info Card**
4. **Sorting Results Table**
5. **Summary Section**
6. **Primary Action Button**

---

## 1. Top Navigation Bar

- **Background**: Dark navy blue with slight transparency (`rgba(185, 213, 225, 0.85)`)
- **Left side**: Circular logo/icon (Bank of Thailand) followed by Thai text "ระบบตรวจสอบการนับคัดธนบัตร" and "Version 1.0.0"
- **Center**: Dropdown/nav item labeled **"Reconciliation"** with a downward chevron icon
- **Right side**: User info "สมสวัสดิ์ มาดี" with role **"Operator (Reconcile)"** and circular avatar (30x30px)

## 2. Page Header

- **Title**: Large bold text **"Holding UNFIT"** aligned to the left (Pridi SemiBold 30px)
- **Right side**: Two action buttons:
  - **"Reconcile Transaction"** — dark navy (#003366) background, white text, rounded corners
  - **"Print Data"** — dark navy (#003366) background, white text, printer icon, rounded corners

## 3. Transaction Info Card

- **Container**: Rounded-corner card (12px radius) with 1px solid #cbd5e1 border
- **Fields in two columns**:
  - **Left column** (with pink/rose `#f8d7da` background on date row):
    - **Date:** `21/7/2568 16:26` with red octagonal alert icon (14x14px)
    - **Sorter:** `ไพศาล เสาวลักษณ์`
    - **Reconciliator:** `สมสวัสดิ์ มาดี`
  - **Right column** (white background):
    - **Sorting Machine:** `กรุงเทพฯ M7-1 ศกท.`
    - **Shift:** `ผลัดบ่าย`

## 4. Sorting Results Table: "สรุปยอดผลการนับคัด"

- **Section title**: "สรุปยอดผลการนับคัด" (Pridi Medium 20px)
- **Table headers** (background `#d6e0e0`, height 30px):

| Column | Thai Label | Width |
|--------|-----------|-------|
| 1 | ชนิดราคา (with sort icon) | 186px |
| 2 | ประเภท (with sort icon) | 186px |
| 3 | แบบ (with sort icon) | 186px |
| 4 | จำนวนฉบับ (with sort icon) | 186px |

- **Table rows** (alternating white / `#f2f6f6`, height 40px):

| Denomination | Type | Series | Count |
|-------------|------|--------|-------|
| **1000** (bordered badge/pill) | ทำลาย | 17 | 4956 |
| **1000** (bordered badge/pill) | ดี | 17 | 18 |
| **1000** (bordered badge/pill) | ทำลาย | 16 | 13 |
| **1000** (bordered badge/pill) | Reject | 17 | 11 |
| **1000** (bordered badge/pill) | ปลอม | 99 | 1 |

- **Denomination badges**: 47x24px, background `#fbf8f4`, border 2px solid `#9f7d57`, text Pridi Bold 13px color `#4f3e2b`

## 5. Summary Section

Below the table, a summary card with:

- **รวมธนบัตร ดี/เสีย/ทำลาย ทั้งสิ้น (+):** **4987** ฉบับ (bold, `#212121`)
- **รวมธนบัตร Reject จำนวนทั้งสิ้น (-):** **11** ฉบับ (bold, **red** `#dc2626`)
- **ธนบัตร ปลอม/ชำรุด จำนวนทั้งสิ้น (O):** **1** ฉบับ (bold, `#212121`)
- **เกินจำนวน (ระบบ) จำนวนทั้งสิ้น (O):** **1** ฉบับ (bold, **blue** `#2563eb`)
- **รวมทั้งสิ้น** (Grand Total): **4,998 ฉบับ** (bold, dark, border-top separator)

## 6. Primary Action Button

- Large centered button: **"ส่งยอด Reject"**
- Background: `#003366`, white text, Pridi Medium 20px
- Border radius: 8px
- Size: 376px wide x 48px tall

## Colors Summary

| Element | Color |
|---------|-------|
| Page background | `#e8e8e8` / `#ededed` |
| Gradient foreground | `linear-gradient(116.7deg, #b9d5e1 0.7%, #dfe2e3 100%)` |
| Nav bar background | `rgba(185, 213, 225, 0.85)` |
| Header text | `#212121` |
| Action buttons | `#003366` background, white text |
| Info card date row | `#f8d7da` background |
| Table header | `#d6e0e0` |
| Table even rows | `#f2f6f6` |
| Borders/separators | `#cbd5e1` |
| Reject value | `#dc2626` (red) |
| Excess value | `#2563eb` (blue) |
| Denomination badge | `#fbf8f4` bg, `#9f7d57` border, `#4f3e2b` text |

## Notable UI Elements

1. **Red octagonal icon** next to date — signals alert/status
2. **Denomination badges** — bordered pill components (47x24px) with watermark pattern
3. **Sort icons** on all 4 table columns
4. **Color-coded summary values** — Reject in red, excess in blue
5. **Thai language** throughout with English terms: "Reject", "Reconcile Transaction", "Print Data", "Holding UNFIT"
6. **Scrollbar** on table: 8px wide, right edge, thumb `#909090` 4px wide
