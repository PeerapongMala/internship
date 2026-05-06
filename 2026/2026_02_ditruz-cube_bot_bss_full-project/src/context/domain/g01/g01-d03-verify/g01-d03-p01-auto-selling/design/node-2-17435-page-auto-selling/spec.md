# Node 2:17435 — Page Auto Selling

**Source**: `get_metadata` + `get_screenshot` on node `2:17435`
**Date fetched**: 2026-02-19
**Size**: 28318 x 18272 px (canvas containing 41 screen frames)

## Structure Tree

### Direct Children (5 sections + 2 decorative)

| Node ID | Type | Name | Position | Size |
|---|---|---|---|---|
| `2:17436` | Section | Auto Selling UNSORT CC 20251104 | (755, 422) | 18309 x 5450 |
| `2:26691` | Section | Section 4 20251104 | (755, 6607) | 9714 x 5867 |
| `2:31554` | Section | Cancel Send 20251104 | (755, 12875) | 4667 x 1875 |
| `2:31621` | Line | Line 31 | decorative | - |
| `2:31622` | Vector | Arrow 24 | decorative | - |
| `2:31623` | Section | แทรก/แทน (Insert/Replace) 20251105 | (759, 15419) | 3402 x 2070 |

## Typical Screen Frame Structure (1440 x 900 px)

Each main screen follows this hierarchy:

1. **Background** (`2:17438`) — 1440 x 900
2. **Navigation Header** (`2:17445`) — 1440 x 40 px
   - BSS logo + system name ("ระบบตรวจสอบการนับคัดธนบัตร")
   - Menu navigation (List Menu Nav instance)
   - User profile
3. **Main Content Area** (`2:17668`) — 1440 x 860 px
   - **Title Bar** (`2:17669`) — 1403 x 62 px
   - **Filter Bar** (`2:17710`) — 1408 x 63 px (5 dropdown filters + 1 hidden)
   - **Content Panel** (`2:17731` "Frame 6207") — 1408 x 663 px

## Content Panel Layout: 2-Column x 3-Row

### Left Panel (~845px)

| Table | Node ID | Title | Columns |
|---|---|---|---|
| 1 | `2:17733` | มัดครบจำนวน ครบมูลค่า | Checkbox, Header Card, ชนิดราคา, วันเวลานับคัด, จำนวนฉบับ, มูลค่า, สถานะ, Action |
| 2 | `2:17815` | มัดรวมครบจำนวน ครบมูลค่า | Same as Table 1 |
| 3 | `2:17977` | แสดงรายละเอียดข้อมูลตาม HeaderCard ที่เลือก | Header Card, ธนาคาร, Cashpoint, ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ, มูลค่า |

### Right Panel (~555px)

| Table | Node ID | Component Name |
|---|---|---|
| A | `2:18087` | Table - Auto Selling - A |
| B | `2:18088` | Table - Auto Selling - B |
| C | `2:18089` | Table - Auto Selling - C |
| Hidden | `2:18090` | Unsort - CC (edit form, toggle view) |

## All 41 Screen Variant Frames

### Section 1: Auto Selling UNSORT CC (`2:17436`) — 23 items
| Node ID | Name | Size |
|---|---|---|
| `2:17437` | Auto Selling - Unsort CC - 1 มัดครบจำนวนครบมูลค่า แสดงรายระเอียด | 1440x900 |
| `2:18136` | Auto Selling - Unsort CC มัดรวมครบจำนวนครบมูลค่า แสดงรายระเอียด | 1440x900 |
| `2:18859` | Auto Selling - Unsort CC มัดขาด-เกิน แสดงรายระเอียดการปรับยอดธนบัตร | 1440x900 |
| `2:19560` | Auto Selling - Unsort CC แสดงรายระเอียดการปรับยอดธนบัตร | 1440x900 |
| `2:20263` | Auto Selling - Unsort CC - Default | 1440x900 |
| `2:21286` | Auto Selling - Unsort CC | 1440x900 |
| `2:22272` | Auto Selling - Unsort CC | 1440x900 |
| `2:23259` | Edit & Manual Key-in Unsort CC | 1440x900 |
| `2:23836` | Edit & Manual Key-in Unsort CC | 1440x900 |
| `2:24413` | Edit & Manual Key-in Unsort CC | 1440x900 |
| `2:24990` | Group 7 | varies |
| `2:24996` | Edit / Edit & Manual Key-in Unsort CC | 1440x900 |
| `2:25021` | Edit / Edit & Manual Key-in Unsort CC | 1440x900 |
| `2:25046` | บันทึกข้อมูลสำเร็จ | 1440x900 |
| `2:25055` | บันทึกข้อมูลสำเร็จ | 1440x900 |
| `2:25070` | Group 5 | varies |
| `2:25077` | Edit Single Item - 13 | 1440x900 |
| `2:25186` | Edit Single Item - 14 | 1440x900 |
| `2:25308` | Edit Single Item - 15 | 1440x900 |
| `2:25429` | บันทึกข้อมูลสำเร็จ | 1440x900 |
| `2:25441` | Auto Selling - Unsort CC | 1440x900 |
| `2:26450` | Frame 6210 | varies |
| `2:26468` | Navigation Header Prepare | 1440x40 |

### Section 2: Section 4 (`2:26691`) — 9 items
| Node ID | Name | Size |
|---|---|---|
| `2:26692` | Auto Selling - Unsort CC - Default | 1440x900 |
| `2:27529` | Auto Selling - Unsort CC | 1440x900 |
| `2:28269` | Auto Selling - Unsort CC | 1440x900 |
| `2:29015` | Auto Selling - Unsort CC | 1440x900 |
| `2:29750` | Auto Selling - Unsort CC | 1440x900 |
| `2:30477` | Edit Users | varies |
| `2:30538` | Edit Shift - 3 | varies |
| `2:30590` | Edit Shift - 4 | varies |
| `2:30644` | Auto Selling Error Case | 1440x900 |

### Section 3: Cancel Send (`2:31554`) — 7 items
| Node ID | Name | Size |
|---|---|---|
| `2:31518` | Group 8 | varies |
| `2:31523` | Cancel Send สำเร็จ | varies |
| `2:31532` | Cancel Send สำเร็จ | varies |
| `2:31547` | Group 9 | varies |
| `2:31555` | Cancel Send Popup OTP - 3 | varies |
| `2:31581` | Cancel Send Popup OTP - 4 | varies |
| `2:31610` | Cancel Send สำเร็จ | varies |

### Section 4: Insert/Replace (`2:31623`) — 2 items
| Node ID | Name | Size |
|---|---|---|
| `2:31624` | Auto Selling / แทรกแทน - Unsort CC - 6 | 1440x900 |
| `2:32278` | Auto Selling / แทรกแทน - Unsort CC - 7 | 1440x900 |

## Key Observations

1. **6-panel layout** (2 columns x 3 rows) — NOT 3-panel like Reconcile
2. Left tables = full XML structures; right tables = component instances
3. Table 3 has different columns than Tables 1-2
4. Tables 1-2 have checkboxes; Table 3 does not
5. Hidden edit form in right panel (toggle view)
6. 5 filter dropdowns (+ 1 hidden) in filter bar
7. Multiple popup types: Modal Dialog, Modal Alert, OTP Template
