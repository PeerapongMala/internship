# สรุปปัญหาการตรวจ Design จาก Figma ผิดพลาด

**Session:** 18 ก.พ. 2026 (10:11 AM - 4:14 PM, ~6 ชม.)
**Task:** Implement หน้า Reconciliation Transaction ตาม Figma design
**Stats:** 6.9M tokens, 1,379 messages, session crash ตอนท้าย

---

## ปัญหาหลัก 7 ประเภท

### 1. CSS Override Chain ที่ซ่อนอยู่ — ไม่เคยเช็คก่อน implement

AI implement CSS ถูกต้องตาม Figma แต่หน้าจริงไม่ตรง เพราะมี global CSS override

| ตัวการ | Rule ที่ซ่อนอยู่ | ผลกระทบ |
|--------|-----------------|---------|
| `Style.css` | `button { height: 40px !important; }` | ปุ่มทุกตัวถูกบังคับ 40px |
| `all.css` | `.btn-action { width: 28px !important; height: 28px !important; }` | icon ดินสอ/ถังขยะ ใหญ่ 28px แทนที่จะเป็น 20px ตาม Figma |
| `all.css` | `.btn-action i { font-size: 18px !important; }` | icon size ผิด |
| `all.css` | `.qty-badge { background-image: url(...) !important; }` | badge ต้องใช้ pattern image |

**Root cause**: AI ไม่ได้ scan global CSS (`all.css`, `Style.css`, `bootstrap.css`) ก่อนเขียน CSS ใหม่

---

### 2. Figma MCP ไม่ได้ให้ CSS โดยตรง — ต้องแปลงเอง

`get_design_context` return เป็น React + Tailwind code ไม่ใช่ CSS ตรงๆ

- สี denom badge: Figma = `bg-[#fff5f5]` border `#c07575` text `#8f4242` แต่ AI ใช้ `bg: #17a2b8` (teal) + white text — **ผิดทั้งหมด**
- Table header bg: Figma = `#d6e0e0` แต่ AI ใช้ `#f8f9fa`

**Root cause**: AI ไม่ได้เรียก `get_design_context` ตั้งแต่แรก เขียน CSS แบบเดาเอาก่อน

---

### 3. Inline SVG ใน table ถูกบีบขนาด — แก้ 5 รอบ

Alert icon (octagon SVG) ระบุ 14px แต่แสดงจริง 4.41px

| รอบ | วิธีแก้ | ผล |
|-----|---------|-----|
| 1 | `width="14" height="14"` HTML attributes | ยังเล็ก |
| 2 | CSS class `.alert-icon { width: 14px; min-width: 14px; }` | ยังเล็ก |
| 3 | inline style `style="width:14px;height:14px;min-width:14px"` | ยังเล็ก |
| 4 | ครอบด้วย `<span>` + `inline-flex` + double-layer sizing | ยังเล็ก |
| 5 | เปลี่ยนจาก inline `<svg>` เป็น `<img>` + data URI | **ได้ผล** |

**Root cause**: `table-layout: fixed` + `overflow: hidden` ใน td ทำให้ inline SVG ถูกบีบ

**Solution**: ใช้ `<img>` + data URI แทน inline SVG ใน table เสมอ

---

### 4. คำว่า "ทั้งวัน" — บอกลบ 10+ ครั้ง ยังอยู่

AI ยืนยันว่าลบแล้ว + grep ไม่เจอ แต่ user ยังเห็นอยู่

**Root cause**: Browser cache — AI ไม่ได้แนะนำ hard refresh ตั้งแต่แรก

---

### 5. CSS Specificity War — แก้แล้วไม่ได้ผล

ใส่ padding-left: 4px ให้ตาราง right แต่ "เหมือนไม่ได้ผล"

- รอบ 1-3: เพิ่ม specificity ไปเรื่อยๆ → ไม่ได้ผลทุกรอบ
- สุดท้าย: User บอกให้สร้าง **empty column** แทน padding → ได้ผล

**Root cause**: AI วน specificity war แทนที่จะเปลี่ยนแนวทาง (spacer column) ตั้งแต่แรก

---

### 6. font-weight เดาผิด

User ขอ "ตัวหนา" → AI ใส่ `font-weight: 700` แต่ Figma spec = `font-weight: 500`

**Root cause**: AI ไม่ได้เปิด Figma MCP เช็ค spec ก่อนแก้ CSS

---

### 7. Double border ที่ซ้อนกัน

Scanner input มี border 2 ชั้น: wrapper div `border: 5px` + input `border: 3px`

**Root cause**: AI เขียน CSS ทั้ง wrapper + input โดยไม่ได้ตรวจว่า border จะซ้อนกัน

---

## สรุป Root Cause หลัก

| # | Root Cause | ความถี่ | ผลกระทบ |
|---|-----------|---------|---------|
| 1 | **ไม่ scan global CSS ก่อน implement** | สูง | แก้ CSS ซ้ำหลายรอบเพราะ override |
| 2 | **ไม่เรียก Figma MCP ตั้งแต่แรก** | สูง | เดา CSS เอง → ผิดแทบทุกค่า |
| 3 | **ไม่รู้ browser behavior** (SVG ใน table, cache) | ปานกลาง | ลองผิดลองถูก 3-5 รอบ |
| 4 | **ตีความ user ผิด** (หนา=700 vs 500) | ต่ำ | ต้อง user แปะ Figma spec มาเอง |
| 5 | **ไม่เปลี่ยนแนวทางเมื่อแก้ไม่ได้ผล** | ปานกลาง | วน specificity war แทนเปลี่ยน approach |
