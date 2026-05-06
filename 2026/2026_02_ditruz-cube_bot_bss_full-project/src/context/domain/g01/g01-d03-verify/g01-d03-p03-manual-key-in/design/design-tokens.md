# Design Tokens — Manual Key-in (Screen 1.0)

Source Figma Node: 2:47210

## Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary (navy) | #003366 | Radio selected, save button bg |
| Success (green) | #198754 | Submit button bg |
| Body text | #212529 | Form text, radio labels |
| Neutral text | #212121 | Headings, section titles |
| Warning/amber | #b45309 | Count values (จำนวนก่อน/หลัง) |
| Placeholder | #6C757D | Input placeholder, sort icons |
| Input border | #CED4DA | Form input/select border |
| Table separator | #cbd5e1 | Table borders, header card border |
| Table header bg | #D6E0E0 | Column header background |
| Selected row bg | #D1E5FA | Table row selected state |
| Selected row border | #297ED4 | Table row selected border |
| Header card badge bg | #E4E6E9 | Badge background |
| Nav header bg | #F2B091 | Navigation header (Unsort CC) |
| Money badge bg | #FBF8F4 | Denom 1000 badge bg |
| Money badge border | #9F7D57 | Denom 1000 badge border |
| Money badge text | #4F3E2B | Denom 1000 badge text |

## Denomination Badge Colors
| Denom | Background | Border | Text |
|-------|-----------|--------|------|
| 1000 | #FBF8F4 | #9F7D57 | #4F3E2B |
| 500 | #F8F5FF | #6A509D | #3D2E5B |
| 100 | #FFF5F5 | #C07575 | #8F4242 |
| 50 | #F0F8FF | #35A0FD | #025CAB |
| 20 | #F1F9F1 | #55B254 | #336C32 |

## Typography (all font-family: Pridi → implement as 'bss-pridi')
| Element | Weight | Size | Line-Height | Letter-Spacing | Color |
|---------|--------|------|-------------|----------------|-------|
| Page title | 600 | 30px | 1.2 | 0.675px | #212121 |
| Header Card label | 400 | 20px | 1.5 | 0.5px | #212121 |
| Header Card badge | 700 | 20px | 1.2 | 0.5px | #212121 |
| Section heading (เพิ่มผลฯ) | 500 | 16px | normal | 0.352px | #212121 |
| Radio group label (ประเภท/ชนิด) | 600 | 14px | normal | 0.35px | #212121 |
| Form field label (แบบ/จำนวน) | 400 | 14px | normal | 0.35px | #212121 |
| Radio text | 400 | 16px | 1.5 | 0.4px | #212529 |
| Denom badge (form) | 600 | 16px | normal | 0.4px | varies |
| Select/input value | 300 | 20px | 1.5 | 0.5px | #6C757D |
| Info panel text | 400 | 16px | 1.5 | 0.4px | #212121 |
| Table header | 500 | 13px | 100% | 0.299px | #212121 |
| Table cell | 400 | 12-14px | 1.5 | 0.3px | #212529 |
| Button text | 500 | 20px | 1.5 | 0.5px | #FFFFFF |
| Count labels | 400 | 14px | normal | 0.308px | #212121 |
| Count values | 700 | 14px | normal | 0.308px | #b45309 |

## Spacing
| Element | Property | Value |
|---------|----------|-------|
| Header card row | padding | 8px 24px |
| Form section | padding | 16px 24px |
| Radio item | padding | 4px 8px |
| Form fields gap | gap | 30px |
| Select/input | height | 48px |
| Select/input | padding | 9px 17px |
| Submit button | size | 300 x 46px |
| Save button | size | 229 x 48px |
| Table header bar | padding | 8px 16px |
| Column header | height | 30px |
| Table row | min-height | 34px |
| Action buttons gap | gap | 10px |

## Borders
| Element | Width | Color | Radius |
|---------|-------|-------|--------|
| Header card row | 1px | #cbd5e1 | 16px |
| Form section | 1px | #cbd5e1 | 12px |
| Info panel | 1px | #cbd5e1 | 12px |
| Results table | 1px | #cbd5e1 | 12px |
| Select/input | 1px | #CED4DA | 8px |
| Submit button | none | — | 8px |
| Save button | 1px | #003366 | 8px |
| Denom badge | 2px | varies | 4px |
| Action button | 1px | #000000 | 4px |
| Radio circle | 1px | #dee2e6 / #003366 | 50% |

## Icons
| Icon | Type | Size | Color |
|------|------|------|-------|
| Sort (column header) | Bootstrap Icon bi-arrow-down-up | 12px | #6c757d |
| Edit (action) | Bootstrap Icon bi-pencil-fill | 16px | #000 |
| Delete (action) | Bootstrap Icon bi-trash3-fill | 16px | #000 |
