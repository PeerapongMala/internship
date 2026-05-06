# Design Tokens — Reconsile

Extracted from Figma file `OAMmUhXjYQKdYn5TAXGnAN`, node `1:18004` and modal nodes.

## Colors

### Text

| Token | Hex | Usage |
|---|---|---|
| Title text | #212121 | Page title, table headers, labels |
| Body text | #212529 | Table body, input text, radio labels |
| Black | #000000 | Modal titles, KV labels/values |
| Highlighted row | #013661 | Table row 1 text |
| Warning | #B45309 | จำนวนมัด value |
| Placeholder | #6C757D | Input placeholder |

### Backgrounds

| Token | Hex | Usage |
|---|---|---|
| White | #FFFFFF | Cards, inputs, modals |
| Semi-transparent | rgba(255,255,255,0.8) | Top panel |
| Badge | #E4E6E9 | Header Card badge |
| Radio item | rgba(0,0,0,0.05) | Radio/chip wrapper |
| Table header | #D6E0E0 | Table header row |
| Odd row | #FFFFFF | Table odd rows (changed from Figma #F8FAFC to white per Design QA) |
| Even row | #F2F6F6 | Table even rows |

### Actions

| Token | Hex | Usage |
|---|---|---|
| Primary | #003366 | Reconcile button |
| Success | #198754 | Save button, success icon |
| Secondary | #6C757D | Cancel button, sort icons |
| Danger | #DC3545 | Delete confirm button |
| Warning icon | #FD7E14 | Confirm/warning icon |

### Borders

| Token | Value | Usage |
|---|---|---|
| Card border | 1px solid #CBD5E1 | Tables, cards, section borders |
| Input border | 1px solid #CED4DA | Form inputs |
| Input focus | 1px solid #86B7FE | Focused input |
| Focus ring | 0 0 0 4px rgba(13,110,253,0.25) | Input focus ring |
| Modal border | 1px solid #EEEEEE | Modal container |
| Action button | 1px solid #000000 | Action buttons in table |

### Denomination Colors

| Denom | Background | Border (2px) | Text |
|---|---|---|---|
| 1000 | #FBF8F4 | #9F7D57 | #4F3E2B |
| 500 | #F8F5FF | #6A509D | #3D2E5B |
| 100 | #FFF5F5 | #C07575 | #991B1B |
| 50 | #F0F8FF | #35A0FD | #025CAB |
| 20 | #F1F9F1 | #55B254 | #3B7E3A |

## Typography

Font: `Pridi` (implement as `bss-pridi`)

| Style | Weight | Size | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| Title | 600 | 30px | 1.2em | 2.25% | Page title |
| Heading/H4 | 500 | 24px | 1.2em | 2.5% | Modal titles |
| Heading/H5 | 500 | 20px | 1.2em | 2.5% | Success message |
| Heading/H6 | 500 | 16px | 1.2em | 2.5% | Table section title |
| Body/Lead | 300 | 20px | 1.5em | 2.5% | Input values |
| Body/Regular | 400 | 16px | 1.5em | 2.5% | KV labels, modal text, button text |
| Info label | 400 | 20px | 1.5em | 2.5% | Info card labels |
| Info value | 500-700 | 20px | 1.2em | 2.5% | Info card values |
| Table header | 500 | 13px | 1.55em | ~2.3% | Table headers |
| Table body | 400 | 13px | 1.55em | ~2.2% | Table cells |
| Section label | 600 | 14px | 1.55em | 2.5% | ประเภทธนบัตร, ชนิดราคา |
| Form label | 400 | 14px | 1.55em | 2.5% | แบบ, จำนวน |
| Button (page) | 500 | 20px | 1.5em | 2.5% | Page buttons |
| Button (modal) | 400 | 16px | — | — | Modal buttons |

## Spacing

| Element | Value |
|---|---|
| Page padding | 8px 16px |
| Top panel padding | 8px 8px 16px |
| Top panel gap | 8px |
| Info card padding | 8px 24px |
| Input form padding | 8px 24px 16px |
| Input form gap | 16px |
| Fields row gap | 30px |
| Radio group gap | 16px |
| Denom chips gap | 16px |
| Table header padding | 8px |
| Table cell padding | 6px 8px |
| Table row height | 40px |
| Modal header padding | 16px 16px 8px |
| Modal body padding | 24px 32px |
| Modal footer padding | 16px |
| Confirm body padding | 32px 32px 16px |
| Button padding (page) | 8px 16px |
| Button padding (modal) | 6px 12px |

## Border Radius

| Element | Value |
|---|---|
| Top panel | 16px |
| Cards/tables | 12px |
| Modal | 12px |
| Inputs | 8px |
| Radio items | 8px |
| Denom chips | 8px |
| Badge | 8px |
| Page buttons | 8px |
| Modal buttons | 6px |
| Edit qty input | 6px |
| Action buttons | 4px |

## Sizes

| Element | Value |
|---|---|
| Page layout width | 1410px |
| Page buttons | 300px wide |
| Save button | 300px wide |
| Modal buttons (edit) | 120px wide |
| Success modal button | 160px wide |
| Action column | 150px wide |
| Action button | 20x20px |
| Action icon | 14px |
| Sort icon | 12px |
| Confirm icon | 48x48px |
| Badge width | 152px |
| Denom chip badge | 47x24px |
| Edit qty input | 87px wide |
