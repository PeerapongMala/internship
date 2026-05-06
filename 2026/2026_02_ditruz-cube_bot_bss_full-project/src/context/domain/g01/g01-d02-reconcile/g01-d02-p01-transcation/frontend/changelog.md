# Reconciliation Transaction — Frontend Changelog

## [2026-02-18] — Session 2: Design Fixes & Tooltip
- Fix alert icon ถูกบีบใน table (CASE-001) — ใช้ flex wrapper + override td overflow
- Fix font-weight panel titles (CASE-002) — เปลี่ยน 'Pridi' → 'bss-pridi'
- Fix alert/warning row coloring (CASE-003) — สีแดงเฉพาะ Header Card cell, ไม่ใช่ทั้ง row
- เพิ่ม tooltip hover card บน Header Card ที่มี alert (CASE-005)
- ปรับ column widths ให้ตรง Figma
- Revert nav dropdown กลับเป็น 3 ปุ่มแยก (เปิดหน้าจอ 2, Holding, Holding Detail)

### งานค้าง
- Navbar dropdown: ต้องเพิ่ม rows ใน `bss_mst_menu` SQL (parent_menu_id=3, display_order 22-23)
- Action buttons: onclick handlers เป็น TODO stubs
- Dead code: JS dropdown functions (toggleNavDropdown, closeNavDropdown) ยังค้างอยู่ — ไม่มี HTML reference แล้ว

## [2026-02-18] — Initial Creation
- สร้าง ReconcilationController (แทนที่ stub)
- สร้าง View + CSS + JS สำหรับ Reconciliation Transaction
- สร้าง Service + Interface + DI registration
- สร้าง Object/Service models
- รองรับ 4 variants: Unfit, Unsort CC, CA Member, CA Non-Member
