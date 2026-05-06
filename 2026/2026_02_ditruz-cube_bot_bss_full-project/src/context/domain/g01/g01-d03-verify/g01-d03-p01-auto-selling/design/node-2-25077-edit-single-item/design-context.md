# Design Context - Node 2:25077

**Node:** Edit Single Item / Preparation - Edit Single Item - 13
**Date:** 2026-02-19

## Component Hierarchy

```
Edit Single Item / Preparation - Edit Single Item - 13 (2:25077)
  bg-white, full size

  Template - Modal Dialog - OTP (2:25078)
    bg: rgba(12,12,12,0.38), 1440x900 (full viewport overlay)

    Modal Dialog (2:25079)
      bg-white, border: 1px #eee, rounded: 12px
      w: 1280px, h: 700px, min-w: 560px, max-w: 1280px
      flex-col, overflow: clip

      Top Bar (2:25080)
        bg-white, border-bottom: slate/300
        px: 16, pt: 16, pb: 8
        Text: "ตรวจสอบการแก้ไข" (Heading/H4: 24px, Medium)

      Content Area (2:25082)
        flex: 1 0 0, flex-col, gap: 16px, p: 24px

        Sub-heading (2:25083)
          "เตรียมแก้ไขข้อมูล 1 รายการ" (H4: 24px Medium)

        Header Card Info (2:25084)
          flex, gap: 16px, Body/Regular 16px
          "Header Card" + "0054941526"

        Table Container (2:25087)
          flex-col, w-full

          Table (2:25089)
            border: 1px separators/separator-opaque (#cbd5e1)
            rounded: 12px, overflow-x: clip, overflow-y: auto

            List Header - Summary Row (2:25090)
              min-h: 45px, px: 16, py: 8, gap: 16px
              border-bottom: gray-300
              Left: "แสดงผลการนับคัด" (H6: 16px Medium)
              Right group 1: "จำนวนก่อน:" + "1002" (bold, warning #b45309) + "ฉบับ"
              Right group 2: "จำนวนหลัง:" + "1002" (bold, warning #b45309) + "ฉบับ"

            Column Headers (2:25101)
              bg: #d6e0e0, h: 30px, px: 8
              border-bottom: gray-300
              Font: Table header (13px, Medium, #212121)
              Columns: ชนิดราคา | ประเภท | แบบ | ก่อนปรับ (ฉบับ) | หลังปรับ (ฉบับ)
              "หลังปรับ" header in orange #ca6510
              Each column has sort icon (12x12)

            Data Row 1 (2:25126) - white bg
              h: 38px, px: 8, border-bottom: strokes/stroke-neutral-primary
              MoneyType(1000) | ดี | 17 | 993 | 992 (orange #ca6510)

            Data Row 2 (2:25142) - alternate bg #f2f6f6
              px: 8, border-bottom: strokes/stroke-neutral-primary
              MoneyType(1000) | ทำลาย | 17 | 8 | (empty)

            Data Row 3 (2:25158) - white bg
              px: 8, border-bottom: strokes/stroke-neutral-primary
              MoneyType(1000) | Reject | 17 | 1 | 2 (orange #ca6510)

        Confirmation Section (2:25174)
          flex, w-full

          Form Area (2:25175)
            w: 400px, p: 8, gap: 16px, flex-col

            "ยืนยันการแก้ไข" (H4: 24px Medium)

            Manager Select (2:25177)
              Label: "เลือก Manager" (Form Label 2: 14px, #212121)
              gap: 4px between label and select

              Select Component (2:25182) - Bootstrap select
                bg-white, border: 1px #ced4da, rounded: 6px
                px: 13, py: 7
                Value: "ดนัย มนีกาล" (Body/Regular: 16px, #212529)
                Dropdown chevron icon on right

      Bottom Bar / Footer (2:25183)
        bg-white, border-top: slate/300
        p: 16, flex, justify-between, align-end

        Back Button (2:25184)
          bg: secondary (#6c757d), border: secondary
          min-w: 160px, w: 160px, px: 13, py: 7, rounded: 6px
          Text: "ย้อนกลับ" (Body/Regular: 16px, white)

        Submit Button (2:25185)
          bg: #003366, border: #003366
          min-w: 160px, px: 13, py: 7, rounded: 6px
          Text: "ส่งคำขออนุมัติแก้ไข" (Body/Regular: 16px, white)
```

## MoneyType Component (2:14209)

Reusable denomination badge component:
- Dimensions: 47px x 24px
- Background: #fbf8f4 (warm cream)
- Border: 2px solid #9f7d57 (golden brown)
- Pattern image overlay: 30% opacity, mix-blend-mode: color-burn
- Text: Bold 13px Pridi, color #4f3e2b, centered

Props:
- `size`: "Default" | "Large"
- `type`: "1000" | "500" | "100" | "50" | "20"

## Referenced Figma Components

| Component | Node ID | Description |
|-----------|---------|-------------|
| icon-wrapper | 1:22 | Icon with multi-size support |
| select | 1:5950 | Bootstrap 5.3 select component |
| text/text | 1:226 | Text bullet list |
| button | 1:385 | Bootstrap 5.3 button component |
| Union=false, Size=custom | 1:43 | Custom size icon (default 16px) |

## Design Styles Referenced

| Style | Spec |
|-------|------|
| Heading/H4 | Pridi Medium 24px, lh: 1.2, ls: 2.5% |
| Body/Regular | Pridi Regular 16px, lh: 1.5, ls: 2.5% |
| Heading/H6 | Pridi Medium 16px, lh: 1.2, ls: 2.5% |
| Body | Pridi Regular 14px, lh: 100%, ls: 2.2% |
| Table header | Pridi Medium 13px, lh: 100%, ls: 2.2% |
| Table body | Pridi Regular 13px, lh: 100%, ls: 2.2% |
| Body/Small | Pridi Regular 14px, lh: 1.5, ls: 2.5% |
| Form Label | Pridi Regular 13px, lh: 100%, ls: 2.5% |
| Form Label 2 | Pridi Regular 14px, lh: 100%, ls: 2.5% |
| Orange/600 | #CA6510 |
| Gray/600 | #6C757D |
| Primary | #003366 |
