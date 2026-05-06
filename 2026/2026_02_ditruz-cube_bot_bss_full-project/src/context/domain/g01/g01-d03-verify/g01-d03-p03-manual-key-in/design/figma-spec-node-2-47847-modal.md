# Figma Spec: Modal Dialog "Edit Data" (Node 2:47847)

## Overview
Modal dialog for editing data (แก้ไขข้อมูล) with form fields and action buttons.

## Typography Specifications

### Title: "แก้ไขข้อมูล"
- **Style**: Heading/H4
- **Font Family**: Pridi
- **Font Style**: Medium
- **Font Size**: 24px
- **Font Weight**: 500
- **Line Height**: 1.2 (120%)
- **Letter Spacing**: 0.6px (tracking-[0.6px])
- **Color**: black (#000000)

### Form Labels & Read-Only Values (Header Card, ชนิดราคา, ประเภท, แบบ, จำนวน)
- **Style**: Body/Regular
- **Font Family**: Pridi
- **Font Style**: Regular
- **Font Size**: 16px
- **Font Weight**: 400
- **Line Height**: 1.5 (150%)
- **Letter Spacing**: 0.4px (tracking-[0.4px])
- **Color**: black (#000000)

### Input Number Value ("6")
- **Style**: Body/Regular
- **Font Family**: Pridi
- **Font Style**: Regular
- **Font Size**: 16px
- **Font Weight**: 400
- **Line Height**: 1.5 (150%)
- **Letter Spacing**: 0.4px (tracking-[0.4px])
- **Color**: #212529

### Money Type Badge ("1000")
- **Style**: Form Value 2
- **Font Family**: Pridi
- **Font Style**: SemiBold
- **Font Size**: 16px
- **Font Weight**: 600
- **Line Height**: normal
- **Letter Spacing**: 0.4px
- **Color**: #4F3E2B
- **Background**: #FBF8F4
- **Border**: 2px solid #9F7D57

### Button Text ("ยกเลิก", "บันทึก")
- **Style**: Body/Regular
- **Font Family**: Pridi
- **Font Style**: Regular
- **Font Size**: 16px
- **Font Weight**: 400
- **Line Height**: 1.5 (150%)
- **Letter Spacing**: 0.4px
- **Color**: white (#FFFFFF)

## Layout Structure

### Top Bar
- Background: white
- Border-bottom: 1px solid var(--slate/300, #CBD5E1)
- Padding: 16px horizontal, 16px top, 8px bottom

### Content Area
- Padding: 24px
- Inner padding: 8px
- Gap between rows: 8px
- Each row: flex, items-center, justify-between

### Bottom Bar (Actions)
- Background: white
- Border-top: 1px solid var(--slate/300, #CBD5E1)
- Padding: 16px
- Justify-content: space-between

### Cancel Button ("ยกเลิก")
- Background: #6C757D (Gray/600 - secondary)
- Border: 1px solid #6C757D
- Border-radius: 6px
- Width: 120px
- Padding: 7px 13px

### Save Button ("บันทึก")
- Background: #198754 (green/success)
- Border: 1px solid #198754
- Border-radius: 6px
- Width: 120px
- Padding: 7px 13px

### Input Number (จำนวน ฉบับ)
- Width: 87px
- Border: 1px solid #86B7FE (focus state)
- Border-radius: 6px
- Focus ring: 0 0 0 4px rgba(13, 110, 253, 0.25)
- Has up/down spinner arrows

### Modal Container
- Background: white
- Border: 1px solid #EEEEEE
- Border-radius: 12px
- Overflow: clip

## Design Tokens Referenced
- `--slate/300`: #CBD5E1
- `--theme-colors/secondary`: #6C757D
- `--space/s-md`: 16px
- `Components/Input/Focus Border`: #86B7FE
- `Focus Ring/Default`: drop-shadow 0 0 0 4px rgba(13,110,253,0.25)
- `Gray/White`: #FFFFFF
- `Gray/600`: #6C757D
- `Body Text/Body Color`: #212529
