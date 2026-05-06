# Requirement — Manual Key-in

## Source
CTO (Pagon) — Meeting 2026-02-19

## Scope
- **Frontend UI + Mock Data เท่านั้น**
- Backend ยังไม่ต้องทำ (รอ business logic จากลูกค้า)
- Deadline: ภายในวันถัดไป (เย็น)

## Functional Requirements

### หน้าหลัก (Screen 1.0)
1. แสดง Header Card info (code, date, bank, cashpoint, personnel)
2. Form เพิ่มผลการนับคัดธนบัตร:
   - เลือกประเภทธนบัตร (ดี/เสีย/ทำลาย/Reject/ปลอม/ชำรุด)
   - เลือกชนิดราคา (1000/500/100/50/20)
   - เลือกแบบ (dropdown)
   - กรอกจำนวน
   - กดบันทึกผลนับคัด → เพิ่ม row ในตาราง
3. ตารางผลนับคัด:
   - แสดง ชนิดราคา, ประเภท, แบบ, จำนวนก่อนปรับ, จำนวนหลังปรับ
   - Action: แก้ไข, ลบ
   - สรุป จำนวนก่อน / จำนวนหลัง

### แก้ไขข้อมูล (Screen 1.1)
- Popup แสดง HC, ชนิดราคา, ประเภท, แบบ (readonly)
- แก้ไขจำนวนได้
- ปุ่ม ยกเลิก / บันทึก

### บันทึกข้อมูล (Screen 1.2 → 1.3)
- กด "บันทึกข้อมูล" → popup ยืนยัน (icon warning)
- ยืนยัน → popup สำเร็จ (icon checkmark)

### ตรวจสอบการแก้ไข (Screen 1.5 → 1.6 → 1.7)
- Step A: แสดงตาราง review + เลือก Manager
- Step B: กรอกเหตุผล + OTP (countdown 4:59)
- ยืนยัน OTP → popup แก้ไขข้อมูลสำเร็จ

## Non-Functional Requirements
- ใช้โครงสร้างเดียวกับ Auto Selling (g01-d03-p01)
- CSS ใช้ `mk-` prefix หลีกเลี่ยง conflict
- Mock data mode: `USE_MOCK_DATA = true`
- รองรับ 4 BnType variants (Unfit, Unsort CC, CA Member, CA Non-Member)
