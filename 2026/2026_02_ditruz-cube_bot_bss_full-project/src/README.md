# BSS Full Project — เอกสาร Domain

> **AI:** เริ่มต้นที่ [AI Guide (index.md)](./index.md) ก่อนทำงาน

โฟลเดอร์ `src/` นี้เก็บ **เอกสารอ้างอิงสำหรับนักพัฒนาและ AI** ของระบบ BSS

## จุดประสงค์

Repo นี้เป็น **ศูนย์กลาง** ที่เชื่อม submodule `project/frontend` และ `project/backend` เข้าด้วยกัน แทนที่จะเข้าไปหาไฟล์ใน submodule โดยตรง ให้ดูที่นี่เพื่อ:

1. **หาไฟล์** — รู้ว่าแต่ละหน้า/ฟีเจอร์เกี่ยวข้องกับไฟล์ frontend/backend ตัวไหนบ้าง
2. **เข้าใจ logic** — อ่าน business logic คร่าวๆ โดยไม่ต้องเปิดโค้ด
3. **ติดตามการเปลี่ยนแปลง** — ดู changelog ว่าแก้อะไรไปเมื่อไหร่

## โครงสร้าง

```
src/
└── domain/
    ├── preparation/          # โดเมน Preparation
    │   ├── index.md          # ภาพรวมโดเมน + รายชื่อหน้า
    │   ├── unfit/
    │   │   └── index.md      # PreparationUnfit — file map, logic, changelog
    │   ├── unsort-ca-member/
    │   │   └── index.md      # UnsortCAMember — file map, logic, changelog
    │   ├── unsort-ca-nonmember/
    │   │   └── index.md      # UnsortCANonMember — file map, logic, changelog
    │   └── unsort-cc/
    │       └── index.md      # UnsortCC — file map, logic, changelog
    ├── reconcile/            # (เพิ่มภายหลัง)
    └── verify/               # (เพิ่มภายหลัง)
```

## วิธีใช้งาน

### สำหรับ AI

เมื่อได้รับคำสั่งให้ทำงานกับหน้าใดหน้าหนึ่ง (เช่น "แก้ layout หน้าพิมพ์ Preparation Unfit"):

1. เปิด `index.md` ที่เกี่ยวข้อง (เช่น `src/domain/preparation/unfit/index.md`)
2. อ่าน **File Map** เพื่อหาไฟล์ frontend/backend ทั้งหมดที่เกี่ยวข้อง
3. อ่าน **Logic Notes** เพื่อเข้าใจ business rules
4. หลังแก้โค้ดเสร็จ ให้อัปเดต **Changelog**

### สำหรับนักพัฒนา

- เปิดดู `src/domain/` เพื่อทำความเข้าใจภาพรวมของแต่ละฟีเจอร์
- ใช้ file map เป็น quick reference ตอน onboard หรือ debug
- อัปเดต changelog ทุกครั้งที่แก้ไขหน้านั้นๆ

## แต่ละหน้าประกอบด้วย

| ส่วน | จุดประสงค์ |
|------|-----------|
| **File Map** | path ที่แน่นอนของไฟล์ frontend และ backend (controller, view, service, model, CSS, JS) |
| **Logic Notes** | อธิบาย business flow และกฎสำคัญโดยย่อ |
| **Changelog** | บันทึกการเปลี่ยนแปลงพร้อมวันที่ |

## ข้อตกลง

- path ทั้งหมดเป็น relative จาก `project/frontend/BSS_WEB/` หรือ `project/backend/BSS_API/`
- โฟลเดอร์ domain ใช้ kebab-case (เช่น `unsort-ca-member`)
- แต่ละหน้ามีโฟลเดอร์ย่อยพร้อม `index.md` ของตัวเอง
- `index.md` ระดับ domain จะแสดงรายชื่อทุกหน้าในโดเมนนั้น
