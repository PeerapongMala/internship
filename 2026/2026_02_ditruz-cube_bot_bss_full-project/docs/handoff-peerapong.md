# Handoff Summary — Peerapong (พีระพงษ์)

**วันที่ส่งมอบ:** 2026-03-16
**Branch naming:** `user/p/...`

---

## 1. Manual Key-In (แก้ไขคีย์อิน)

### สถานะ: ✅ Merge เข้า dev_internal แล้ว

### Commits (อยู่บน dev_internal แล้ว)
| Repo | Commit | วันที่ | รายละเอียด |
|------|--------|--------|-------------|
| BE | `72f78b3` | 2026-03-06 | feat(manual-key-in): add 4 BE APIs + fix SendOtp performance |
| BE | `4dd75c5` | 2026-03-13 | fix(manual-key-in): refactor to use existing tables, fix entity mismatches |
| FE | `b39e8829` | 2026-03-02 | feat(manual-key-in): fix table alignment, add row selection, update modal flow |
| FE | `cb00adc6` | 2026-03-10 | feat(manual-key-in): complete Edit Manual Key-In page with API integration |
| FE | `deae533e` | 2026-03-13 | fix(manual-key-in): refactor field names, fix UI overflow, add input validation |

### BE API (4 endpoints)
```
GET  /api/ManualKeyIn/GetManualKeyInList       — ดึงรายการ Manual Key-In
GET  /api/ManualKeyIn/GetManualKeyInDetail     — ดึงรายละเอียด
POST /api/ManualKeyIn/SaveManualKeyIn          — บันทึก (draft)
POST /api/ManualKeyIn/SubmitManualKeyIn        — ส่งอนุมัติ
```

### ไฟล์หลัก
**BE:**
- `BSS_API/Controllers/ManualKeyInController.cs`
- `BSS_API/Services/ManualKeyInService.cs` + Interface
- `BSS_API/Repositories/ManualKeyInRepository.cs` + Interface

**FE:**
- `BSS_WEB/Controllers/VerifyController.cs` — 4 AJAX proxy endpoints
- `BSS_WEB/Services/ManualKeyInService.cs` + Interface
- `BSS_WEB/Views/Verify/ManualKeyIn/Index.cshtml` — JS connected to real API (`USE_MOCK_DATA = false`)
- `BSS_WEB/wwwroot/js/verify/manualKeyIn.js`

### สิ่งที่ต้องทำต่อ
- ✅ BE + FE อยู่บน dev_internal แล้ว ทำงานได้
- ⚠️ ทดสอบ end-to-end กับ data จริงบน staging/production
- ⚠️ Approve Manual Key-In page (หน้าอนุมัติ) — **คนอื่นทำ** (ไม่ใช่ Peerapong)

---

## 2. Holding Detail (รายละเอียดคงเหลือ)

### สถานะ: 🔀 อยู่บน branch แยก — ยังไม่ merge เข้า dev_internal

### Branches
| Repo | Branch | Commit | รายละเอียด |
|------|--------|--------|-------------|
| BE | `user/p/holding-detail` | `c6af656` | feat(holding-detail): add BE API for Holding Detail page |
| FE | `user/p/holding-detail` | `0cb9c6eb` | feat(holding-detail): connect FE to real API, remove mock data |
| Parent | `user/p/vibe-g01-d03-p04-holding-detail` | `871f76c` | chore: update submodule refs |

> **วิธี merge:** merge branch `user/p/holding-detail` เข้า `dev_internal` ทั้ง BE และ FE

### BE API (2 endpoints)
```
GET /api/HoldingDetail/GetHoldingDetail?bnType={UF|UC|CA|CN}&departmentId={int}
GET /api/HoldingDetail/GetHoldingDetailByHc?headerCards={csv}&bnType={string}
```

### ไฟล์ BE (4 ไฟล์ใหม่ — 226 lines)
| File | Description |
|------|-------------|
| `BSS_API/Controllers/HoldingDetailController.cs` | 2 GET endpoints |
| `BSS_API/Services/HoldingDetailService.cs` | Query + panel classification logic |
| `BSS_API/Services/Interface/IHoldingDetailService.cs` | Interface |
| `BSS_API/Models/ResponseModels/HoldingDetailResponse.cs` | DTOs |

### ไฟล์ FE (3 ไฟล์ใหม่ + 4 ไฟล์แก้ไข)
| File | Description |
|------|-------------|
| `BSS_WEB/Interfaces/IHoldingDetailService.cs` | **NEW** — FE service interface |
| `BSS_WEB/Services/HoldingDetailService.cs` | **NEW** — Proxy to BE API (extends BaseApiClient) |
| `BSS_WEB/Models/ServiceModel/HoldingDetail/HoldingDetailResult.cs` | **NEW** — FE DTOs |
| `BSS_WEB/Infrastructure/ItemServiceCollectionExtensions.cs` | **EDIT** — เพิ่ม DI registration |
| `BSS_WEB/Controllers/HoldingController.cs` | **EDIT** — เพิ่ม 2 AJAX endpoints + inject service |
| `BSS_WEB/Views/holding/unfit/Index.cshtml` | **EDIT** — ลบ mock data, เชื่อม API จริง |
| `BSS_WEB/wwwroot/css/holding/holdingUnfit.css` | **EDIT** — แก้ CSS ตาม Figma |

### Panel Classification Logic
```
qty == 1000 && !isMerged && !isExcess → P1 (มัดครบจำนวน ครบมูลค่า)
qty == 1000 && isMerged              → P2 (มัดรวมครบจำนวน ครบมูลค่า)
qty != 1000 && !isMerged && !isExcess → P4 (มัดขาด-เกิน)
qty != 1000 && isMerged              → P5 (มัดรวมขาด-เกิน)
isExcess                             → P6 (มัดเกินจากเครื่องจักร)
```
> Logic เหมือน Auto Selling (copy มา)

### DB Tables (ใช้ table ที่มีอยู่แล้ว ไม่ได้สร้างใหม่)
- `bss_txn_reconcile_tran` — header, filter: StatusId=13, IsActive, !IsRevoke
- `bss_txn_reconcile` — detail (denomination breakdown)
- `bss_txn_prepare` → `bss_txn_container_prepare` → `bss_mst_bn_type` — BnType filter chain

### QA Test Results
- **44/44 Pass** (100%) — ทั้ง 4 variants (Unfit, UnsortCC, CA Member, CA Non-Member)
- ดู report เต็ม: `temp/QA-HoldingDetail-TestReport.md`

### สิ่งที่ต้องทำต่อ
- 🔀 **Merge** branch `user/p/holding-detail` เข้า `dev_internal` (ทั้ง BE + FE)
- ⚠️ ทดสอบ end-to-end กับ data status 13 จริง (ตอนเทสใช้ test data insert แล้วลบ)

---

## 3. งานอื่นที่เกี่ยวข้อง (อยู่บน dev_internal แล้ว)

| Commit | วันที่ | รายละเอียด |
|--------|--------|-------------|
| BE `494eede` | 2026-03-14 | feat(approve-mki): remove legacy stubs, add filter master data support |
| FE `14aae4ea` | 2026-03-14 | feat(approve-mki): add filter dropdowns from master data, remove legacy code |

> งาน Approve Manual Key-In — ทำแค่ส่วน filter dropdown, ตัว flow อนุมัติคนอื่นทำต่อ

---

## 4. ข้อควรระวัง

1. **JSON Serialization**
   - FE MVC → JS: **CamelCase** (System.Text.Json)
   - FE → BE API: **PascalCase** (Newtonsoft.Json)
   - JS ใช้ `mapPanelRow()` / `mapP3Row()` แปลง PascalCase→camelCase

2. **BnType Cookie**
   - FE อ่าน `banknote_type_setting` cookie ผ่าน `_appShare.BnType`
   - ค่า: `UF` (Unfit), `UC` (Unsort CC), `CA` (CA Member), `CN` (CA Non-Member)

3. **Holding Detail ไม่มีใน menu**
   - เข้าผ่าน: Reconciliation Transaction → Holding → Holding Detail
   - ไม่ต้องเพิ่มใน `bss_mst_menu`

4. **DI Registration**
   - BE ใช้ Scrutor auto-scan (ไม่ต้อง register manual)
   - FE ต้อง register ใน `ItemServiceCollectionExtensions.cs`

---

## 5. เอกสารที่เกี่ยวข้อง

| File | Description |
|------|-------------|
| `temp/holding-detail-changes.md` | สรุปการเปลี่ยนแปลง Holding Detail (detail) |
| `temp/QA-HoldingDetail-TestReport.md` | QA Test Report 44/44 Pass |
| `temp/holding-detail-test-data.sql` | SQL สำหรับ insert test data (ใช้เทส) |
| `temp/holding-detail-test-data-CLEANUP.sql` | SQL สำหรับลบ test data |
