# Retrospective — Reconcile Transaction UI Implementation

**Session:** 18 ก.พ. 2026 (2 sessions รวมกัน)
**Task:** Implement หน้า Reconcile Transaction จาก Figma design
**หน้า:** `g01-d02-reconcile / g01-d02-p01-transcation`

---

## สิ่งที่ทำสำเร็จ

| # | งาน | สถานะ |
|---|------|--------|
| 1 | Fix alert icon ถูกบีบใน table (CASE-001) | PASSED |
| 2 | Fix font-weight panel titles (CASE-002) | PASSED |
| 3 | Fix alert/warning row coloring — สีแดงเฉพาะ cell (CASE-003) | PASSED |
| 4 | Tooltip hover card บน Header Card สีแดง (CASE-005) | PASSED (แก้ position/colors ด้วย) |
| 5 | Column widths — ปรับให้ตรง Figma | PASSED |
| 6 | สร้าง design-fix-log.md สำหรับอ้างอิง | PASSED |
| 7 | บันทึก design docs จาก Figma MCP ลง design/ folder | PASSED |

---

## สิ่งที่ทำผิดพลาด

### 1. แก้ dropdown ผิดที่ — เสียเวลาหลายรอบ

**เกิดอะไร:** User บอกว่า "dropdown มี 2 เมนู แทนที่จะ 4" → ผมไปแก้ปุ่มในหน้า (title-right) ทั้งที่ user หมายถึง navbar dropdown ที่ header ข้างเลข version

**Root cause:** ไม่ถามให้ชัดว่า "dropdown ไหน" ก่อนลงมือแก้ — คิดเอาเองว่าหมายถึง dropdown ที่เพิ่งทำ

**ผลกระทบ:**
- แก้ HTML/CSS/JS หลายรอบโดยไม่จำเป็น
- เปลี่ยนปุ่มแยก → dropdown → ปุ่มแยก กลับไปกลับมา
- User เสียเวลาบอกหลายครั้งว่าผิดที่

**บทเรียน:** เมื่อ UI มีหลาย component ที่ชื่อคล้ายกัน → ถามก่อนว่าหมายถึงตรงไหน

---

### 2. ไม่บอก User ว่า navbar dropdown มาจาก database

**เกิดอะไร:** Navbar dropdown (Reconciliation > sub-menu) มาจาก `MenuViewComponent` → `GetMenuItemsAsync()` จาก DB — แก้ UI เท่าไหร่ก็ไม่เปลี่ยน เพราะ data มาจาก `bss_mst_menu` table

**Root cause:** ผมรู้ตั้งแต่อ่าน `Default.cshtml` ว่า menu มาจาก model แต่ไม่ได้บอก user ทันที — ไปพยายามแก้ HTML แทน

**ผลกระทบ:** User เสียเวลาทดสอบ + refresh หลายรอบ แล้วสงสัยว่าทำไมไม่เปลี่ยน

**บทเรียน:** เมื่อรู้ว่าสิ่งที่ user ขอเกี่ยวข้องกับ data layer ไม่ใช่ UI → **บอกทันที** ก่อนลงมือแก้อะไร

---

### 3. Tooltip ทำผิดหลายจุด + ไม่บันทึก Figma spec ลง design/

**เกิดอะไร:**
- Position: ไว้ข้างล่าง (rect.bottom) ทั้งที่ Figma spec บอกข้างบน
- สี: ดูเหมือนเดา ทั้งๆ ที่มี design-tokens.md อยู่แล้ว
- แสดงกับทุก header card สีแดง → user ต้องมาบอก
- **ที่สำคัญ: ตอน subagent ดึง Figma MCP ได้ข้อมูล tooltip (nodes 32:57780, 32:57796, 32:54692) แล้วไม่ได้บันทึกลง `design/` folder** → พอ rate limit มา ก็ไม่มี spec อ้างอิง → เลยเดาทำ

**Root cause:**
1. ไม่ปฏิบัติตาม CLAUDE.md ที่บอกว่า "Save design docs — always save tokens/specs to design/ folder"
2. เมื่อ subagent ได้ข้อมูลจาก Figma MCP → ควรบันทึกเป็น `design/node-XX-XXXXX-name/` ทันที ก่อนจะ implement
3. ไม่ได้อ่าน design docs ที่มีอยู่แล้ว (design-tokens.md) อย่างละเอียดก่อน implement

**บทเรียน:**
- **ทุกครั้ง** ที่ Figma MCP return ข้อมูล node ใหม่ → บันทึกลง `design/node-{id}-{name}/` ทันที (metadata.xml, design-context.md, screenshot)
- Rate limit จะเกิดขึ้นเสมอใน session ยาว → ข้อมูลที่บันทึกไว้คือ safety net
- ก่อน implement → อ่าน design docs ที่มีอยู่ก่อน ไม่ใช่เดา

---

### 4. Column width ปรับหลายรอบ (125 → 105 → 102 → 100 → 98)

**เกิดอะไร:** ขยาย column +20px เพื่อรองรับ alert icon แต่เยอะเกินจน "Header Card from Machine" ล้น → user ต้องบอก → revert กลับ → ลองอีกหลายค่า

**Root cause:** ไม่ได้คำนวณว่า icon 14px + gap ต้องการพื้นที่เท่าไหร่จริงๆ — เดาว่า +20px น่าจะพอ

**บทเรียน:** คำนวณก่อนแก้ — icon 14px + gap 2px = +16px ก็เพียงพอ ไม่ต้อง +20px และควรทดสอบว่า column อื่นไม่ล้นก่อน commit

---

## สิ่งที่ต้องปรับปรุง

| # | เรื่อง | Action |
|---|--------|--------|
| 1 | **ถามให้ชัดก่อนแก้** | เมื่อ user พูดถึง component → ถามว่า "หมายถึงตรงไหน" ก่อนลงมือ |
| 2 | **บอก root cause ก่อนแก้** | ถ้ารู้ว่าปัญหาอยู่ที่ data/DB → บอกทันที ไม่ใช่ไปแก้ UI |
| 3 | **อ่าน design docs ที่บันทึกไว้** | ก่อน implement feature → อ่าน design-tokens.md + metadata.xml ก่อน |
| 4 | **บันทึก Figma spec ทุก node ใหม่ทันที** | Figma MCP return ข้อมูล → save ลง `design/node-{id}-{name}/` ก่อน implement เสมอ |
| 5 | **คำนวณก่อนเดา** | Column width, spacing, padding → คำนวณจาก Figma ก่อน ไม่ใช่ใส่ค่าสุ่ม |
| 6 | **ลด back-and-forth** | ถ้าไม่แน่ใจค่า → ให้ทางเลือก user 2-3 ค่า แทนลองทีละค่า |

---

## งานค้าง

| # | งาน | สถานะ | หมายเหตุ |
|---|------|--------|----------|
| 1 | Navbar dropdown เพิ่ม Holding, Holding Detail | ค้าง | ต้องเพิ่ม rows ใน `bss_mst_menu` SQL + re-seed DB |
| 2 | ตรวจ tooltip แสดงถูกต้อง (เฉพาะ cell ที่มี AlertMessage) | ต้อง verify | User บอกว่า "แค่ header card สีแดงก็โชว์หมด" |
| 3 | ปุ่มในหน้า (เปิดหน้าจอ 2, Holding, Holding Detail) | ต้อง verify | Revert กลับปุ่มแยกแล้ว ต้องทดสอบว่า onclick ยังทำงาน |

---

## ข้อเสนอแนะสำหรับ User

1. **เรื่อง Figma MCP rate limit** — วันนี้ใช้ quota หมดเพราะ session ยาว ถ้า session หน้าต้องดู Figma เยอะ ควรเริ่มตอนเช้าเพื่อให้มี quota เต็ม
2. **เรื่อง navbar dropdown** — ต้องเพิ่ม 2 rows ใน `bss_mst_menu` (Holding, Holding Detail) กับ parent_menu_id = 3 แล้ว re-seed database ถึงจะขึ้น
3. **เรื่อง design docs** — ข้อมูล Figma ที่เคยดึงมาแล้วบันทึกใน `design/` folder ครบถ้วนพอควร ใช้อ้างอิงแทน MCP ได้เลยใน session ถัดไป
