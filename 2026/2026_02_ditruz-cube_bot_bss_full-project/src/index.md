# AI Guide — BSS Full Project

คู่มือสำหรับ AI ที่ทำงานกับโปรเจกต์นี้

## Project Overview

ระบบ BSS (Banknote Sorting System) ประกอบด้วย:

- **Frontend** — ASP.NET Core MVC (`project/frontend/BSS_WEB/`)
- **Backend** — ASP.NET Core Web API (`project/backend/BSS_API/`)
- **เอกสาร** — อยู่ใน `src/` (โฟลเดอร์นี้)

## โครงสร้าง `src/`

```
src/
├── index.md                    ← คุณอยู่ที่นี่ (AI Guide)
├── README.md                   ← ภาพรวมสำหรับนักพัฒนา
├── human/                      ← คู่มือสำหรับคน (AI ไม่ต้องอ่าน)
└── domain/
    └── {domain-name}/
        ├── index.md            ← ภาพรวมโดเมน + shared files
        └── {page-name}/
            ├── index.md        ← overview + ลิงก์ไป frontend/backend
            ├── frontend/
            │   ├── file-map.md
            │   ├── business-logic.md
            │   └── changelog.md
            └── backend/
                ├── file-map.md
                ├── business-logic.md
                └── changelog.md
```

## ขั้นตอน AI ก่อนเขียนโค้ด

เมื่อได้รับคำสั่งให้ทำงานกับหน้าใดหน้าหนึ่ง ให้ทำตามลำดับนี้:

1. **อ่าน domain `index.md`** — เข้าใจภาพรวมโดเมน + ไฟล์ shared
2. **อ่าน page `index.md`** — เข้าใจ scope ของหน้านั้น
3. **อ่าน `file-map.md`** ของ frontend/backend ที่เกี่ยวข้อง — รู้ว่าต้องแก้ไฟล์ไหน
4. **(ถ้าต้องการบริบท)** อ่าน `business-logic.md` — เข้าใจการตัดสินใจ/ข้อจำกัดของ logic
5. **หลังแก้เสร็จ:**
   - อัปเดต `changelog.md` ของ frontend/backend ที่แก้ไข
   - ถ้ามีการเพิ่มหรือลบไฟล์ → อัปเดต `file-map.md` ให้ตรงกับสถานะปัจจุบันด้วย

## ข้อห้าม

- **ห้ามแก้ไฟล์นอก scope** — แก้เฉพาะไฟล์ที่อยู่ใน `file-map.md` ของหน้านั้น หรือไฟล์ shared ที่ระบุใน domain `index.md`
- **ห้ามลบ changelog เดิม** — เพิ่มรายการใหม่ต่อท้ายเท่านั้น
- **ห้ามเปลี่ยน business logic** โดยไม่มีบริบทจาก `business-logic.md`

## โดเมนที่มีอยู่

| โดเมน | Path |
|--------|------|
| [Preparation](./context/domain/g01/g01-d01-preparation/index.md) | `src/context/domain/g01/g01-d01-preparation/` |
| [Reconciliation](./context/domain/g01/g01-d02-reconcile/index.md) | `src/context/domain/g01/g01-d02-reconcile/` |
