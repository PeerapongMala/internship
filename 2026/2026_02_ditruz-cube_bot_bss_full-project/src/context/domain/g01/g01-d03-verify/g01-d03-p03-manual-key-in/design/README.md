# Design — Manual Key-in

## Figma References
- **File**: `r8wLwGvG3I4vYU6SLQ1jec`
- **Main Node**: `2:23259` — "Edit & Manual Key-in Unsort CC" (1440 x 900 px)

## Screens (from PNG)

| # | Screen | Type | Description |
|---|--------|------|-------------|
| 1.0 | Edit & Manual Key-in | Full page | Form + info panel + results table |
| 1.1 | Popup แก้ไขข้อมูล | Modal | Edit single item (จำนวน) |
| 1.2 | Popup ยืนยันบันทึก | Modal | Confirm save (warning icon) |
| 1.3 | บันทึกข้อมูลสำเร็จ | Modal | Success (checkmark) |
| 1.4 | หน้าหลักหลัง key-in | Full page | Updated state (จำนวนหลังอัปเดต) |
| 1.5 | ตรวจสอบการแก้ไข | Modal Step A | Review table + Manager selection |
| 1.6 | ตรวจสอบการแก้ไข + OTP | Modal Step B | เหตุผล + OTP input + countdown |
| 1.7 | แก้ไขข้อมูลสำเร็จ | Modal | Edit success (checkmark) |

## Page Structure (1440 x 900 px)

```
Title Bar (page title + BnType info)
  └── "Edit & Manual Key-in ประเภท {BnType}"

Header Card Row
  ├── Header Card badge (code)
  └── Date

Content Area (flex row)
  ├── Form Section (left, flex:1)
  │   ├── Title: "เพิ่มผลการนับคัดธนบัตร"
  │   ├── Radio: ประเภทธนบัตร (ดี/เสีย/ทำลาย/Reject/ปลอม/ชำรุด)
  │   ├── Radio: ชนิดราคา (1000/500/100/50/20 badges)
  │   ├── Select: แบบ (dropdown)
  │   ├── Input: จำนวน
  │   └── Button: "บันทึกผลนับคัด" (green)
  └── Info Panel (right, fixed ~400px)
      └── Key-value rows (บาร์โค้ด, ธนาคาร, Cashpoint, etc.)

Results Table
  ├── Header bar (จำนวนก่อน / จำนวนหลัง)
  ├── Column headers (ชนิดราคา, ประเภท, แบบ, ก่อนปรับ, หลังปรับ, Action)
  └── Table body (#resultsTableBody)

Footer Bar
  └── Button: "บันทึกข้อมูล" (navy #003366)
```

## CSS Variant Gradients
| Variant | Gradient |
|---------|----------|
| Unfit (default) | No override (uses base) |
| Unsort CC | `linear-gradient(98.93deg, #f5a986 0.74%, #f8d4ba 100%)` |
| CA Member | `linear-gradient(90deg, #afc5aa, #d3e3cd)` |
| CA Non-Member | `linear-gradient(90deg, #bac0d1, #c3d0de)` |

## Figma MCP Specs
| Node | Description | File |
|------|-------------|------|
| 2:47210 | Screen 1.0 full page spec | [figma-spec-node-2-47210.md](./figma-spec-node-2-47210.md) |

## Design Tokens
- [design-tokens.md](./design-tokens.md) — Colors, typography, spacing, borders, icons

## PNG References
- Source: `/png/` folder (8 PNG screenshots from Figma)
