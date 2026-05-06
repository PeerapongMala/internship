# AI Page Scaffold Guide — BSS Web

Guide for AI to scaffold new pages in BSS Web, based on the pattern established by Reconcile Transaction → Verify Auto Selling.

## IMPORTANT: Backend vs Frontend Scope

- **Backend = Scaffold**: Copy structure from reference page, rename, use TODO stubs. Business logic ยังไม่ส่ง → ทำโครงคร่าวๆ ไว้ก่อน
- **Frontend = Build from Figma**: ห้าม copy หน้าตาจาก reference page มาเปลี่ยนชื่อ ต้องดึง Figma spec แล้วสร้างใหม่ตาม design จริง
  - Backend models/service/controller อ้างอิง reference page ได้ (โครงสร้าง API เหมือนกัน)
  - View (.cshtml), CSS, JS → **ต้องทำตาม Figma เท่านั้น**
  - Frontend request models, service result models, service interface → copy โครงจาก reference ได้ (เป็น data layer)

## Prerequisites
1. **Identify source page** to mirror for backend structure (e.g., Reconcile Transaction)
2. **Get Figma design** for frontend — node IDs, screenshots, design tokens
3. **Create naming map** — table mapping old names → new names
4. **Confirm with user**: DB tables exist? Status codes? Business logic scope?

## Naming Map Template

| Aspect | Old | New |
|--------|-----|-----|
| Entity (Tran) | `TransactionReconcileTran` | `TransactionXxxTran` |
| Entity (Detail) | `TransactionReconcile` | `TransactionXxx` |
| DB Table (Tran) | `bss_txn_reconcile_tran` | `bss_txn_xxx_tran` |
| DB Table (Detail) | `bss_txn_reconcile` | `bss_txn_xxx` |
| PK Field | `reconcile_tran_id` | `xxx_tran_id` |
| API Route | `api/ReconcileTransaction` | `api/XxxTransaction` |
| Frontend URL | `/Reconcilation/ReconcileTransaction` | `/Xxx/XxxPage` |
| CSS Base | `reconcileTransaction.css` | `xxxTransaction.css` |
| CSS Class Prefix | `reconcile-` | `xxx-` |
| JS File | `reconcileTransaction.js` | `xxxTransaction.js` |
| Thai Text | กระทบยอดธนบัตร | (new Thai text) |
| Status Code | 11 (Reconciliation) | (new status code) |

## Implementation Order

### Phase 1: Backend (project/backend/BSS_API/)

#### 1.1 Entities (2 files — NEW)
**Path**: `Models/Entities/`
- `TransactionXxxTran.cs` — Main transaction entity
  - Map to DB table, define PK, FKs
  - Include navigation property to detail entity
- `TransactionXxx.cs` — Detail entity
  - Map to DB table, define PK, FK to Tran

#### 1.2 Request Models (7 files — NEW)
**Path**: `Models/RequestModels/`
- `XxxFilterRequest.cs` — Filter for paged list
- `XxxScanRequest.cs` — Scan header card
- `EditXxxTranRequest.cs` — Edit transaction
- `DeleteXxxTranRequest.cs` — Delete transaction
- `XxxActionRequest.cs` — Main action + items
- `CancelXxxRequest.cs` — Cancel action
- `XxxCountRequest.cs` — Count request

#### 1.3 Response Models (7 files — NEW)
**Path**: `Models/ResponseModels/`
- `XxxTransactionResponse.cs`, `XxxScanResponse.cs`, `XxxHeaderCardDetailResponse.cs`
- `EditXxxTranResponse.cs`, `DeleteXxxTranResponse.cs`
- `XxxDetailResponse.cs` + detail item class, `XxxCountResponse.cs`

#### 1.4 Repository (2 files — NEW)
**Path**: `Repositories/`
- `Interface/ITransactionXxxTranRepository.cs` — extends `IGenericRepository<T>`
- `TransactionXxxTranRepository.cs` — extends `GenericRepository<T>`
  - **IMPORTANT**: Update status codes in queries

#### 1.5 Service (2 files — NEW)
**Path**: `Services/`
- `Interface/ITransactionXxxTranService.cs`
- `TransactionXxxTranService.cs` — delegate to repo, use TODO stubs

#### 1.6 Controller (1 file — NEW)
**Path**: `Controllers/`
- `XxxTransactionController.cs`
  - Route: `api/[controller]`
  - Attribute: `[ApiKey("BSS_WEB")]`
  - 9 endpoints matching the service methods

#### 1.7 Registration (3 files — MODIFY)
- `Repositories/Interface/IUnitofWork.cs` — add repository property
- `Repositories/UnitOfWork.cs` — add property + constructor init
- `Models/ApplicationDbContext.cs` — add DbSets + OnModelCreating relationships

> **DI Note**: Scrutor auto-registers by class name suffix (Service, Repository, Repos). No manual registration needed in backend.

### Phase 2: Frontend — Data Layer (project/frontend/BSS_WEB/)

> **Data layer (2.1–2.5)**: Copy โครงจาก reference page ได้ เพราะเป็น API contract เหมือนกัน

#### 2.1 Request Models (7 files — NEW)
**Path**: `Models/ObjectModel/`
- Mirror backend request models (copy + rename from reference)

#### 2.2 Service Result Models (5 files — NEW)
**Path**: `Models/ServiceModel/Xxx/`
- `XxxTransactionResult.cs`, `XxxScanResult.cs`, `XxxHeaderCardDetailResult.cs`
- `XxxDetailResult.cs` + detail item, `XxxCountResult.cs`

#### 2.3 Service (2 files — NEW)
- `Interfaces/IXxxTransactionService.cs`
- `Services/XxxTransactionService.cs` — extends `BaseApiClient`, API base = `"api/XxxTransaction/"`

#### 2.4 DI Registration (1 file — MODIFY)
- `Infrastructure/ItemServiceCollectionExtensions.cs`
  - Add: `services.AddScoped<IXxxTransactionService, XxxTransactionService>();`
  - **Frontend requires manual registration** (unlike backend)

#### 2.5 Controller (1 file — NEW or MODIFY)
**Path**: `Controllers/`
- `XxxController.cs` — extends `BaseController`
  - DI: Service, IAppShare, IMasterMachineService, IHttpContextAccessor
  - `Index()` → `RedirectToAction("XxxPage")`
  - View action with BnType variant logic (4 variants + default)
  - 9 AJAX endpoints

### Phase 3: Frontend — UI Layer (Build from Figma)

> **UI layer (3.1–3.4)**: ต้องสร้างจาก Figma spec ห้าม copy จาก reference page มาเปลี่ยนชื่อ

#### 3.1 ViewModel (1 file — NEW)
**Path**: `Views/Xxx/XxxPage/Index.cshtml.cs`
- Properties ขึ้นกับ Figma design (อาจไม่เหมือน reference page)
- ต้องมีอย่างน้อย: CssVariantClass, BnTypeCode, BnTypeName

#### 3.2 View (1 file — NEW)
**Path**: `Views/Xxx/XxxPage/Index.cshtml`
- **สร้างจาก Figma spec** — ดึง layout, components, spacing จาก design จริง
- ห้าม copy จาก reference page แล้วเปลี่ยนชื่อ
- ใช้ Figma MCP: `get_metadata` → แตก sections → `get_design_context` ทีละ section

#### 3.3 CSS (4 files — NEW)
**Path**: `wwwroot/css/xxx/`
- `xxxTransaction.css` — **สร้างจาก Figma design tokens** (colors, fonts, spacing, sizes)
- `xxx-unsort-cc.css` — Gradient variant จาก Figma
- `xxx-ca-member.css` — Gradient variant จาก Figma
- `xxx-ca-non-member.css` — Gradient variant จาก Figma
- ต้อง scan `all.css` + `Style.css` ก่อนเขียน CSS ทุกครั้ง

#### 3.4 JavaScript (1 file — NEW)
**Path**: `wwwroot/js/xxx/`
- `xxxTransaction.js` — สร้าง logic ตาม Figma interactions + API endpoints
- AJAX paths ต้องตรงกับ Controller routes (Phase 2.5)
- DOM IDs ต้องตรงกับ View (Phase 3.2)
- Set `USE_MOCK_DATA = true`

## CSS Variant Pattern

Each BnType variant uses `body::before` gradient override in a separate CSS file:
```css
/* Xxx — Unsort CC variant (orange/salmon gradient) */
body::before {
    background: linear-gradient(98.93deg, #f5a986 0.74%, #f8d4ba 100%) !important;
}
```

Variant CSS is conditionally loaded in the View based on `Model.CssVariantClass`.

## BnType Mapping
| Code | Name | CSS Class | Nav Color Class |
|------|------|-----------|----------------|
| UF | UNFIT | xxx-unfit | nav-blue-light |
| UC | UNSORT CC | xxx-unsort-cc | nav-orange |
| CA | UNSORT CA MEMBER | xxx-ca-member | nav-green |
| CN | UNSORT CA NON-MEMBER | xxx-ca-non-member | nav-purple |

## Critical Files to Modify
These existing files MUST be updated when adding a new page:

| File | What to Add |
|------|-------------|
| `backend: Repositories/Interface/IUnitofWork.cs` | Repository property |
| `backend: Repositories/UnitOfWork.cs` | Property + constructor init |
| `backend: Models/ApplicationDbContext.cs` | DbSets + OnModelCreating |
| `frontend: Infrastructure/ItemServiceCollectionExtensions.cs` | DI registration |

## Domain Documentation
Create docs at `src/context/domain/g01/g01-dXX-name/g01-dXX-pXX-page/`:
```
├── index.md                  # Route, API, status, Figma nodes
├── design/
│   ├── README.md             # Figma node IDs, layout overview
│   ├── design-tokens.md      # Colors, fonts, spacing from Figma
│   └── node-{id}-{name}/     # Per-node Figma specs (5 files each)
│       ├── spec.md           # Layout, colors, spacing, typography summary
│       ├── screenshot.md     # Screenshot image
│       ├── design-context.md # Raw design context from get_design_context
│       ├── variables.md      # Design variables/tokens
│       └── styles.css        # Extracted CSS styles ready to use
├── backend/
│   ├── file-map.md           # All backend files
│   ├── business-logic.md     # Status flow, rules
│   └── changelog.md          # Change history
└── frontend/
    ├── file-map.md           # All frontend files
    ├── business-logic.md     # UI flow, mock data, modals
    └── changelog.md          # Change history
```

> **Figma Node 5-File Rule**: ทุกครั้งที่ดึง Figma MCP → ต้องบันทึก 5 ไฟล์ลง `design/node-{id}-{name}/` ก่อน implement เสมอ

## Verification Checklist

### Backend (scaffold)
- [ ] `dotnet build` passes
- [ ] API endpoints respond (even if stubs)
- [ ] No remaining references to old/source page names in backend code

### Frontend (Figma-based)
- [ ] `dotnet build` passes
- [ ] Frontend URL loads the page (with mock data)
- [ ] **UI matches Figma design** — layout, colors, fonts, spacing ตรงกับ spec
- [ ] All 4 BnType variants display correct gradient + text
- [ ] All modal IDs in View match JS references
- [ ] CSS class names in View match CSS file
- [ ] AJAX service paths in JS match Controller routes
- [ ] CSS ไม่ขัดกับ `all.css` / `Style.css` global overrides
