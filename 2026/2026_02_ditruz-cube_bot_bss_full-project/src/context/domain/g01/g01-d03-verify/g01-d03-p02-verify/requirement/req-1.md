# Requirement — g01-d03-p02-verify (Verify Confirmation)

## Figma Sources

| Component | Figma File | Node ID | URL |
|-----------|-----------|---------|-----|
| Main Page | `r8wLwGvG3I4vYU6SLQ1jec` (Figma_BSS-Verify) | `1:9829` | [Figma](https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=1-9829&m=dev) |
| Confirm Modal | `LeJRPqvfhVR3AnjdDqIZsn` (verify-ver-2 / CO9) | `1:11085` | [Figma](https://www.figma.com/design/LeJRPqvfhVR3AnjdDqIZsn/-verify-ver-2----CO9---BSS-Verify--20260220-?node-id=1-11085&m=dev) |
| Success Modal | `LeJRPqvfhVR3AnjdDqIZsn` (verify-ver-2 / CO9) | `1:10201` | [Figma](https://www.figma.com/design/LeJRPqvfhVR3AnjdDqIZsn/-verify-ver-2----CO9---BSS-Verify--20260220-?node-id=1-10201&m=dev) |
| Error Modal | `LeJRPqvfhVR3AnjdDqIZsn` (verify-ver-2 / CO9) | `1:10210` | [Figma](https://www.figma.com/design/LeJRPqvfhVR3AnjdDqIZsn/-verify-ver-2----CO9---BSS-Verify--20260220-?node-id=1-10210&m=dev) |

> **สำคัญ:** Modals ทั้ง 3 อยู่ใน Figma file `LeJRPqvfhVR3AnjdDqIZsn` (verify-ver-2 / CO9) ซึ่งคนละไฟล์กับ Main Page

## คำอธิบาย

หน้า Verify Confirmation — หน้าสรุปข้อมูลธนบัตรก่อนยืนยันการ Verify

เป็นหน้าที่ต่อจาก p01 Auto Selling ในขั้นตอนการทำงาน:
- จากหน้า Auto Selling กดปุ่ม "ตรวจสอบ" → มาที่หน้านี้
- แสดงสรุปจำนวนธนบัตรแยกตาม ชนิดราคา/ประเภท/แบบ
- แสดงยอดรวม: ดี/ทำลาย, Reject, ขาด, เกิน, ชำรุด, ปลอม
- ปุ่ม "กลับไปหน้า Auto Selling" → กลับ p01
- ปุ่ม "Verify" → เปิด OTP modal → ยืนยัน → Success/Error

## User Flow

```
หน้า Verify Confirmation (p02)
  │
  ├── [กลับไปหน้า Auto Selling] → redirect to p01
  │
  └── [Verify] button click
         │
         ▼
  ┌──────────────────────────────┐
  │  Confirm Modal (560×360)     │
  │  node 1:11085                │
  │                              │
  │  Icon: ℹ (blue #3D8BFD)     │
  │  Title: "Verify"             │
  │  Body: "คุณแน่ใจหรือไม่      │
  │   ที่ต้องการ Verify ข้อมูลนี้" │
  │                              │
  │  [ยกเลิก]     [ยืนยัน]       │
  └──────────────────────────────┘
         │ ยืนยัน          │ ยกเลิก
         ▼                 ▼
    Call API         Close modal,
    POST Verify      stay on page
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  Success    Error
    │         │
    ▼         ▼
  ┌──────────────┐  ┌──────────────┐
  │ Success Modal │  │ Error Modal  │
  │ node 1:10201 │  │ node 1:10210 │
  │ 560×360px     │  │ 560×360px    │
  │               │  │              │
  │ Icon: ✓ green │  │ Icon: ! red  │
  │ (#198754)     │  │ (#DC3545)    │
  │ "สำเร็จ"      │  │ "การแจ้งเตือน"│
  │ "บันทึกข้อมูล  │  │ "มีข้อผิดพลาด│
  │  สำเร็จ"       │  │  ในการ Verify"│
  │               │  │              │
  │ [ตกลง] green  │  │ [ตกลง] navy  │
  │ (#198754)     │  │ (#003366)    │
  └──────────────┘  └──────────────┘
    │                    │
    ▼                    ▼
  redirect to        close modal,
  p01 Auto Selling   stay on page
                     (user can retry)
```

### Mock Mode

- Default: ยืนยัน → Success
- Hold **Shift** + click ยืนยัน → Error (toggle mock error case)

## BnType Variants

รองรับ 4 ประเภทเหมือน p01:

| Code | Title | Nav Color |
|------|-------|-----------|
| UF | Verify UNFIT | nav-blue-light |
| UC | Verify UNSORT CC | nav-orange |
| CA | Verify UNSORT CA MEMBER | nav-green |
| CN | Verify UNSORT CA NON-MEMBER | nav-purple |

## Status Flow

Approved (16) → **Verify (17)** → SendToCBMS (18)

## อ้างอิง

- Pattern: อิง g01-d03-p01-auto-selling (sibling page ใน domain เดียวกัน)
- OTP Modal: อยู่ใน Figma file เดียวกับ main page
- Success/Error Modal: อยู่ใน Figma file `LeJRPqvfhVR3AnjdDqIZsn` (verify-ver-2 / CO9)
