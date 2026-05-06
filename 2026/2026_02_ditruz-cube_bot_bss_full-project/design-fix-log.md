# Design Fix Log

บันทึกการแก้ไข design issues — จัดเป็น case, สำเร็จขึ้นก่อน ไม่สำเร็จไล่ลงมา
ไว้เป็นข้อมูลอ้างอิงเมื่อเจอ design ที่แก้ยาก (3-4 ครั้งแล้วไม่หาย → มาดู log ว่าเคยแก้ยังไง)

---

## PASSED — แก้สำเร็จ

---

### CASE-001: Alert icon ถูกบีบจนเป็นฝุ่น (4.4px) ใน table

**วันที่**: 2026-02-18
**หน้า**: Reconcile Transaction
**ไฟล์**: `reconcileTransaction.css`, `reconcileTransaction.js`

**อาการ**: `<img>` SVG alert octagon (14x14) ถูกบีบเหลือ 4.4 x 13.36px ใน `<td>`

**สาเหตุ (root cause)**:
1. `table-layout: fixed` → column width ถูกล็อค
2. `overflow: hidden` บน `<td>` (.data-table tbody td) → clip content ก่อนที่ flex จะจัดการ
3. Bootstrap `* { box-sizing: border-box }` → `width: 14px` **รวม** padding → ถ้ามี padding 4.8px ต่อฝั่ง content เหลือ 4.4px
4. `flex-shrink: 0` บน `<img>` ไม่ทำงาน เพราะ parent `<td>` ไม่ใช่ flex container

**วิธีที่ไม่สำเร็จ** (FAILED attempts):
| # | วิธี | ทำไมไม่ work |
|---|------|-------------|
| 1 | ใส่ `flex-shrink:0` ใน inline style ของ `<img>` | parent `<td>` ไม่ใช่ flex container → ไม่มีผล |
| 2 | เพิ่ม `min-width: 14px` บน `<img>` | `table-layout: fixed` + `overflow: hidden` บน td ยังบีบอยู่ |
| 3 | ครอบ `<div class="td-hc-wrap">` เป็น flex container (แต่ไม่ override td overflow) | td ยัง clip ก่อนที่ div จะจัดการ |

**วิธีที่สำเร็จ (FINAL FIX)**:
```css
/* 1. Override overflow บน td ของ Header Card column — ให้ inner div จัดการแทน */
.reconcile-table-left tbody td:nth-child(2),
.reconcile-table-center tbody td:nth-child(2),
.reconcile-table-right tbody td:nth-child(2) {
    overflow: visible !important;
    text-overflow: clip !important;
}

/* 2. Flex wrapper ภายใน td — text truncate, icon คงขนาด */
.td-hc-wrap {
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%;
}
.td-hc-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
}

/* 3. Icon ต้อง reset padding + box-sizing เพื่อป้องกัน Bootstrap border-box */
.td-hc-wrap img {
    flex-shrink: 0;
    width: 14px !important;
    height: 14px !important;
    min-width: 14px !important;
    padding: 0 !important;
    box-sizing: content-box !important;
    display: block;
}
```

**บทเรียน**:
- `table-layout: fixed` + `overflow: hidden` บน `<td>` = ศัตรูตัวฉกาจของ inline element
- ต้อง override `overflow: visible` บน `<td>` ก่อน แล้วให้ inner div จัดการ overflow แทน
- Bootstrap `border-box` ทำให้ `width` รวม padding → ต้อง `box-sizing: content-box` + `padding: 0` บน img
- `flex-shrink: 0` ต้องอยู่ใน flex container จริงๆ ถึงจะทำงาน

---

### CASE-002: Panel title font-weight หายไป (Preparation, Data from Machine, Header Card from Machine)

**วันที่**: 2026-02-18
**หน้า**: Reconcile Transaction
**ไฟล์**: `reconcileTransaction.css`

**อาการ**: heading ของ panel (Preparation, Preparation + Data from Machine, Header Card from Machine) ที่ควรเป็น font-weight: 500 กลับดูเหมือน normal (400)

**สาเหตุ (root cause)**:
- CSS ใช้ `font-family: 'Pridi', sans-serif` แต่ `@font-face` ใน Style.css ลงทะเบียนเป็น `'bss-pridi'`
- Browser หา font `'Pridi'` ไม่เจอ → fallback ไป `sans-serif` (เช่น Arial)
- sans-serif font แสดง weight 500 แทบไม่ต่างจาก 400 → ดูเหมือน font-weight หายไป

**วิธีที่สำเร็จ (FINAL FIX)**:
```css
.panel-title {
    font-family: 'bss-pridi', sans-serif !important;  /* ไม่ใช่ 'Pridi' */
    font-weight: 500 !important;
}
```

**บทเรียน**:
- ในโปรเจคนี้ font Pridi ลงทะเบียนเป็น `'bss-pridi'` ใน @font-face → ต้องใช้ชื่อนี้เสมอ
- Figma output จะบอก `font-family: Pridi` แต่ต้อง map เป็น `'bss-pridi'` ตอน implement
- Style.css `* { font-weight: normal !important }` → ทุก element ถูกบังคับ normal ต้อง override ด้วย class selector + `!important`

---

### CASE-003: Alert row สีแดงทั้ง row แทนที่จะแดงแค่ Header Card

**วันที่**: 2026-02-18
**หน้า**: Reconcile Transaction
**ไฟล์**: `reconcileTransaction.css`, `reconcileTransaction.js`

**อาการ**: HasAlert=true → ทุก cell ในrow เป็นสีแดง (วันที่, badge ก็แดง) ซึ่งผิด design

**สาเหตุ (root cause)**:
- ใช้ `row-alert` class บน `<tr>` → CSS `.data-table tbody tr.row-alert td { color: #dc3545 }` กระทบทุก cell

**Figma spec ที่ถูกต้อง** (จาก node 32:26778):
- HasAlert → แค่ Header Card cell เป็น #DC3545, column อื่น (วันที่, badge) = สีปกติ #013661
- IsWarning → bg ชมพู #F8D7DA ทั้ง row, แค่ Header Card cell เป็น #DC3545, column อื่น = สีปกติ

**วิธีที่สำเร็จ (FINAL FIX)**:
```js
// JS: ย้ายจาก row-level class เป็น cell-level class
const rowClass = item.IsWarning ? 'row-warning' : '';
const hcClass = item.HasAlert ? 'td-hc-alert' : '';
// <td class="${hcClass}">...</td>
```
```css
/* CSS: สีแดงเฉพาะ Header Card cell */
.data-table tbody td.td-hc-alert {
    color: #dc3545 !important;
}
.data-table tbody tr.row-warning td:nth-child(2) {
    color: #DC3545 !important;  /* แค่ Header Card column */
}
```

**บทเรียน**:
- ตรวจ Figma spec ทุกครั้งว่า "สีแดง" กระทบแค่ cell เดียว หรือทั้ง row
- HasAlert กับ IsWarning เป็น mutually exclusive
- ใช้ cell-level class (`td-hc-alert`) แทน row-level class (`row-alert`) เมื่อต้องการ style เฉพาะ column

---

### CASE-004: Dropdown เปลี่ยนหน้า (Nav Dropdown)

**วันที่**: 2026-02-18
**หน้า**: Reconcile Transaction
**ไฟล์**: `Index.cshtml`, `reconcileTransaction.css`, `reconcileTransaction.js`

**รายละเอียด**: แปลงปุ่ม Holding / Holding Detail เป็น dropdown menu ตาม Figma (node 32:26417)

**Figma Spec**:
- Container: 230x117px, padding 8px, white bg, 12px border-radius, box-shadow
- 3 items: Holding, Holding Detail, ตั้งค่าการทำงานเริ่มต้น
- Each item: 214x33px, text left-padded 12px, Pridi 16px weight 500

**วิธีที่สำเร็จ**:
- ปุ่ม "เปิดหน้าจอ 2" คงเดิม
- แทนที่ปุ่ม Holding + Holding Detail ด้วย dropdown trigger + panel
- CSS: `.nav-dropdown-wrap` (relative) + `.nav-dropdown` (absolute, below trigger)
- JS: `toggleNavDropdown()` toggle `.open` class, close on outside click

---

### CASE-005: Hover card แสดง Alert message บน Header Card สีแดง

**วันที่**: 2026-02-18
**หน้า**: Reconcile Transaction
**ไฟล์**: `Index.cshtml`, `reconcileTransaction.css`, `reconcileTransaction.js`

**รายละเอียด**: เมื่อเอาเม้าท์ชี้ Header Card ที่มี alert (สีแดง) จะแสดง tooltip card ลอย

**Figma Spec** (nodes 32:57780, 32:57796, 32:57814):
- Width: 285px (fixed), height varies by content
- Header: 50px, #F8D7DA bg, icon 24x24 + "Reconcile Transaction" (Pridi 16px Medium)
- Body: 16px padding, message text (Pridi 14px Regular #212529)
- No arrow, positioned below-right of hovered cell

**วิธีที่สำเร็จ**:
- HTML: `#alertTooltip` div with header (warning icon + title) + body (message)
- CSS: `position: fixed`, `pointer-events: none`, show/hide via `.show` class
- JS: `bindAlertTooltips()` — attaches mouseenter/mouseleave on `td.td-hc-alert[data-alert-msg]`
- Mock data: เพิ่ม `AlertMessage` field ใน getMockMachineData / getMockMachineHcData
- Render: เพิ่ม `data-alert-msg` attribute บน td ที่มี alert

---

## FAILED — วิธีที่ไม่สำเร็จ (สำหรับอ้างอิง)

---

### FAILED-001: ใส่ flex-shrink:0 ใน inline style ของ `<img>` ใน `<td>`

**เกี่ยวข้องกับ**: CASE-001
**ทำไมไม่ work**: `<td>` ไม่ใช่ flex container → `flex-shrink` ไม่มีผล
**สิ่งที่ควรทำแทน**: ครอบด้วย flex div + override `overflow: visible` บน td

---

### FAILED-002: เพิ่ม min-width/min-height บน `<img>` ใน table-layout:fixed

**เกี่ยวข้องกับ**: CASE-001
**ทำไมไม่ work**: `table-layout: fixed` + td `overflow: hidden` ยังบีบ content ก่อนที่ min-width จะมีผล
**สิ่งที่ควรทำแทน**: Override td overflow → ให้ inner element จัดการ

---

### FAILED-003: ครอบ flex wrapper แต่ไม่ override td overflow

**เกี่ยวข้องกับ**: CASE-001
**ทำไมไม่ work**: td `overflow: hidden` clip ทั้ง div → flex ข้างในจัดการไม่ได้เพราะ td ตัดก่อน
**สิ่งที่ควรทำแทน**: ต้อง override td `overflow: visible !important` ด้วย

---

### FAILED-004: ใช้ font-family: 'Pridi' แทน 'bss-pridi'

**เกี่ยวข้องกับ**: CASE-002
**ทำไมไม่ work**: @font-face ลงทะเบียนเป็น 'bss-pridi' → browser หา 'Pridi' ไม่เจอ fallback ไป sans-serif
**สิ่งที่ควรทำแทน**: Map Figma font name → project font name เสมอ (Pridi → bss-pridi)

---

### FAILED-005: แก้ dropdown ผิดที่ — Page buttons แทน Navbar

**เกี่ยวข้องกับ**: CASE-004 (Dropdown เปลี่ยนหน้า)
**ทำไมไม่ work**: User บอก "dropdown มี 2 เมนู แทนที่จะ 4" → AI ไปแก้ปุ่มในหน้า (title-right) ทั้งที่ user หมายถึง navbar dropdown ที่ header
**ผลกระทบ**: แก้ HTML/CSS/JS หลายรอบ, ปุ่มแยก → dropdown → ปุ่มแยก กลับไปกลับมา
**สิ่งที่ควรทำแทน**: ถามก่อนว่า "หมายถึง dropdown ไหนครับ?" ก่อนลงมือแก้

---

### FAILED-006: Navbar dropdown แก้ UI แต่ data มาจาก DB

**เกี่ยวข้องกับ**: CASE-004
**ทำไมไม่ work**: Navbar dropdown (Reconciliation > sub-menu) มาจาก `MenuViewComponent` → `GetMenuItemsAsync()` จาก DB (`bss_mst_menu` table) — แก้ HTML เท่าไหร่ก็ไม่เปลี่ยน
**สิ่งที่ควรทำแทน**: บอก user ทันทีว่า "เมนูมาจาก DB ต้องเพิ่ม rows ใน `bss_mst_menu`"

---

### FAILED-007: Column width เดาค่า +20px → ล้น → ปรับหลายรอบ

**เกี่ยวข้องกับ**: CASE-001 (alert icon ใน column)
**ทำไมไม่ work**: ขยาย column +20px เพื่อรองรับ alert icon 14px → เยอะเกิน "Header Card from Machine" text ล้น → ต้องปรับ 125→105→102→100→98 หลายรอบ
**สิ่งที่ควรทำแทน**: คำนวณ: icon 14px + gap 2px = +16px พอดี, หรือให้ user เลือกจาก 2-3 ค่า
