# ZettaPlan - Financial Planning

## Project Overview

โปรเจกต์ **ZettaPlan** เป็นแอปพลิเคชันสำหรับที่ปรึกษาทางการเงิน (Financial Advisor) พัฒนาด้วย React + TypeScript + Vite โดย UI ทั้งหมดเป็นภาษาไทย ออกแบบด้วยธีมสีม่วง (Purple Gradient) พร้อม Sidebar นำทางที่รองรับทั้งโหมดกางและหุบ มีระบบ routing ด้วย react-router-dom (URL-based) และข้อมูล persist ด้วย localStorage

---

## Tech Stack

| เทคโนโลยี | เวอร์ชัน | หมายเหตุ |
|-----------|---------|---------|
| React | 19.2.0 | UI Library |
| TypeScript | ~5.9.3 | Type Safety |
| Vite | 7.2.4 | Build Tool + Dev Server |
| Noto Sans Thai | Google Fonts | ฟอนต์ภาษาไทย |
| react-router-dom | ^7.x | URL-based Routing |
| Material Icons Outlined | Google Fonts | ไอคอน |
| jsPDF | ^4.1.0 | PDF generation |
| html2canvas | ^1.4.1 | HTML to Canvas (for PDF) |

---

## Project Structure

```
ZettaPlan_Arm/
├── Screenshot/                          # ภาพออกแบบต้นแบบ
│   ├── Design.png                       # ดีไซน์หน้าโปรไฟล์หลัก
│   ├── Profile - edit.png               # ดีไซน์โหมดแก้ไข
│   ├── Asset.png                        # ดีไซน์หน้าสินทรัพย์
│   ├── Asset - Add and Edit.png         # ดีไซน์ Modal เพิ่ม/แก้ไขสินทรัพย์
│   ├── Sidebar - expand.png             # ดีไซน์ Sidebar กาง
│   ├── Sidebar - collapse.png           # ดีไซน์ Sidebar หุบ
│   ├── ZPLogo.png                       # โลโก้ตอนกาง
│   ├── ZPLogocollapse.png               # โลโก้ตอนหุบ
│   ├── Retirement Plan.png              # ดีไซน์หน้าวางแผนเกษียณ
│   ├── Goal.png                         # ดีไซน์หน้าเป้าหมายการเงิน
│   ├── Goal - Add and Edit.png          # ดีไซน์ Modal เพิ่ม/แก้ไขเป้าหมาย
│   ├── Insurance Overview.png           # ดีไซน์หน้าประกันภาพรวม
│   ├── Insurance - Life.png             # ดีไซน์หน้าประกันชีวิต
│   ├── Insurance - Life - Add Case.png  # ดีไซน์ Modal เพิ่มเคสประกันชีวิต
│   ├── Insurance - Life - Edit.png      # ดีไซน์โหมดแก้ไขประกันชีวิต
│   ├── Insurance - Health.png           # ดีไซน์หน้าประกันสุขภาพ
│   ├── Insurance - Health - Add Case.png # ดีไซน์ Modal เพิ่มเคสประกันสุขภาพ
│   ├── Insurance - Health - Edit.png    # ดีไซน์โหมดแก้ไขประกันสุขภาพ
│   ├── Portfolio AI.png                 # ดีไซน์หน้าพอร์ตแนะนำ
│   ├── Portfolio AI - Edit.png          # ดีไซน์โหมดแก้ไขพอร์ตแนะนำ
│   ├── Tax Plan - Basic.png             # ดีไซน์หน้าวางแผนภาษี (ขั้นพื้นฐาน)
│   ├── Tax Plan - Basic - Edit.png      # ดีไซน์โหมดแก้ไขวางแผนภาษี (ขั้นพื้นฐาน)
│   ├── Tax Plan - Advanced.png          # ดีไซน์หน้าวางแผนภาษี (ขั้นสูง)
│   ├── Tax Plan - Advanced - Edit.png   # ดีไซน์โหมดแก้ไขวางแผนภาษี (ขั้นสูง)
│   ├── Dashboard.png                    # ดีไซน์หน้าดูรายงาน (Dashboard)
│   └── PDF Viewer.png                   # ดีไซน์หน้า PDF Viewer
├── Project.md                           # เอกสารโปรเจกต์ (ไฟล์นี้)
└── app/                                 # React Application
    ├── index.html                       # HTML entry point (lang="th")
    ├── package.json                     # Dependencies & scripts
    ├── tsconfig.json                    # TypeScript config
    ├── vite.config.ts                   # Vite config
    └── src/
        ├── main.tsx                     # React entry point
        ├── App.tsx                      # Root component (จัดการ state หลัก)
        ├── App.css                      # (ว่าง - ใช้ index.css แทน)
        ├── index.css                    # Global CSS + Design Tokens
        ├── assets/
        │   ├── ZPLogo.png               # โลโก้ Sidebar กาง
        │   └── ZPLogocollapse.png       # โลโก้ Sidebar หุบ
        ├── hooks/
        │   └── usePersistedState.ts   # Custom hook: useState + localStorage sync
        ├── components/
        │   ├── Sidebar.tsx              # Sidebar นำทาง (รับ activePage + onNavigate)
        │   ├── Sidebar.css              # สไตล์ Sidebar
        │   ├── TopBar.tsx               # แถบด้านบน (dynamic title + back button)
        │   ├── TopBar.css               # สไตล์ TopBar
        │   ├── DonutChart.tsx           # SVG Donut Chart (pure, ไม่ใช้ library, มี transition + hover tooltip)
        │   ├── ConfirmModal.tsx        # Modal ยืนยันการลบ (reusable ทุกหน้า)
        │   ├── ConfirmModal.css        # สไตล์ ConfirmModal
        │   ├── AreaChart.tsx           # SVG Area Chart (pure, reusable)
        │   ├── ProfileCard.tsx          # การ์ดโปรไฟล์ (ดู/แก้ไข)
        │   ├── ProfileCard.css          # สไตล์ ProfileCard
        │   ├── ContactCard.tsx          # การ์ดช่องทางติดต่อ
        │   ├── LicenseCard.tsx          # การ์ดใบอนุญาต
        │   └── DetailCard.css           # สไตล์ร่วม Contact/License
        └── pages/
            ├── ProfilePage.tsx          # หน้าโปรไฟล์ (จัดการ edit state)
            ├── ProfilePage.css          # สไตล์หน้าโปรไฟล์
            ├── AssetPage.tsx            # หน้าสินทรัพย์ (donut chart + ตาราง)
            ├── AssetPage.css            # สไตล์หน้าสินทรัพย์
            ├── RetirementPage.tsx       # หน้าวางแผนเกษียณ (area chart + คำนวณ)
            ├── RetirementPage.css       # สไตล์หน้าวางแผนเกษียณ
            ├── GoalPage.tsx             # หน้าเป้าหมายการเงิน (goal cards + CRUD)
            ├── GoalPage.css             # สไตล์หน้าเป้าหมายการเงิน
            ├── InsurancePage.tsx         # หน้าประกันภาพรวม (donut chart + ตาราง)
            ├── InsurancePage.css         # สไตล์หน้าประกัน
            ├── LifeInsurancePage.tsx     # หน้าประกันชีวิต (banner + ตาราง + needs/assets)
            ├── LifeInsurancePage.css     # สไตล์หน้าประกันชีวิต
            ├── HealthInsurancePage.tsx   # หน้าประกันสุขภาพ (ตาราง + coverage + เปรียบเทียบ)
            ├── HealthInsurancePage.css   # สไตล์หน้าประกันสุขภาพ
            ├── PortfolioPage.tsx         # หน้าพอร์ตแนะนำ (donut chart + area chart + simulator)
            ├── PortfolioPage.css         # สไตล์หน้าพอร์ตแนะนำ
            ├── TaxPlanPage.tsx           # หน้าวางแผนภาษี (คำนวณภาษี + ตารางฐานภาษี)
            ├── TaxPlanPage.css           # สไตล์หน้าวางแผนภาษี
            ├── DashboardPage.tsx         # หน้าดูรายงาน (สรุปทุกหน้า + radar + donut + trend)
            ├── DashboardPage.css         # สไตล์หน้าดูรายงาน
            ├── PdfViewerPage.tsx         # หน้า PDF Viewer (preview + download PDF)
            └── PdfViewerPage.css         # สไตล์หน้า PDF Viewer
```

---

## Design Tokens (CSS Variables)

กำหนดใน `app/src/index.css` `:root`

```css
--primary: #7C3AED            /* สีม่วงหลัก */
--primary-light: #A855F7       /* สีม่วงอ่อน */
--primary-50: #F5F3FF          /* พื้นหลังม่วงจาง */
--primary-100: #EDE9FE
--primary-200: #DDD6FE
--gray-50 ~ --gray-900         /* โทนเทา */
--white: #FFFFFF
--sidebar-width: 240px         /* ความกว้าง Sidebar กาง */
--sidebar-collapsed-width: 64px /* ความกว้าง Sidebar หุบ */
--topbar-height: 64px
--radius-sm: 6px ~ --radius-full: 9999px
--shadow-sm / --shadow-md / --shadow-lg
```

---

## Components

### 1. App.tsx (Root Component)

**หน้าที่:** จัดการ state หลักทั้งหมด, routing, และส่ง props ลงไปยัง component ลูก

**State:**
- `sidebarOpen` — เปิด/ปิด Sidebar (สำหรับมือถือ)
- `sidebarCollapsed` — หุบ/กาง Sidebar
- `profile` — ข้อมูลโปรไฟล์ทั้งหมด (`ProfileData`) — **persist ด้วย localStorage**

**Routing:** URL-based routing ด้วย `react-router-dom` — ใช้ `useLocation()` + `useNavigate()` + `<Routes>/<Route>`

**Route Mapping:**

| URL Path | หน้า | Component |
|----------|------|-----------|
| `/` | ข้อมูลส่วนตัว | ProfilePage |
| `/assets` | สินทรัพย์ | AssetPage |
| `/retirement` | วางแผนเกษียณ | RetirementPage |
| `/goals` | เป้าหมายการเงิน | GoalPage |
| `/insurance` | ประกัน | InsurancePage |
| `/insurance/life` | ประกัน / ประกันชีวิต | LifeInsurancePage |
| `/insurance/health` | ประกัน / ประกันสุขภาพ | HealthInsurancePage |
| `/portfolio` | พอร์ตลงทุน | PortfolioPage |
| `/tax` | วางแผนภาษี | TaxPlanPage |
| `/dashboard` | ดูรายงาน | DashboardPage |
| `/report/pdf` | (standalone) | PdfViewerPage |

**Data Flow:**
```
BrowserRouter (main.tsx)
└── App (profile state + useLocation + useNavigate)
    ├── Sidebar (activePage ← derived from pathname, onNavigate → navigate())
    ├── TopBar (pageTitle ← routeTitles[pathname], onBack → navigate('/'))
    └── Routes
        ├── Route "/" → ProfilePage
        ├── Route "/assets" → AssetPage
        ├── Route "/retirement" → RetirementPage
        ├── Route "/goals" → GoalPage
        ├── Route "/insurance" → InsurancePage
        ├── Route "/insurance/life" → LifeInsurancePage
        ├── Route "/insurance/health" → HealthInsurancePage
        ├── Route "/portfolio" → PortfolioPage
        ├── Route "/tax" → TaxPlanPage
        └── Route "/dashboard" → DashboardPage
    (standalone — if pathname === '/report/pdf')
    └── PdfViewerPage (no sidebar/topbar)
```

**ข้อมูลตัวอย่าง (Default):**
- ชื่อ: สมชาย ใจดี (ชาย)
- ตำแหน่ง: Senior Financial Advisor
- บริษัท: ZettaWealth Co., Ltd.
- ใบอนุญาต: 5401012345
- คุณวุฒิ: MDRT 2024, COT, FChFP, CFP

---

### 2. Sidebar.tsx

**หน้าที่:** เมนูนำทางด้านซ้าย รองรับโหมดกาง/หุบ และเมนูย่อย

**Props:** `isOpen`, `collapsed`, `activePage`, `onNavigate`, `onClose`, `onToggleCollapse`

**เมนู (navSections):**

| Section | เมนู | Icon | เมนูย่อย |
|---------|------|------|---------|
| MENU | ข้อมูลส่วนตัว | person | - |
| MENU | ภาพรวม | dashboard | - |
| MENU | สินทรัพย์ | account_balance_wallet | - |
| MENU | วางแผนเกษียณ | edit_note | - |
| MENU | เป้าหมายการเงิน | flag | - |
| TOOLS | ประกัน | shield | ประกันชีวิต, ประกันสุขภาพ |
| TOOLS | วางแผนภาษี | calculate | - |
| TOOLS | พอร์ตแนะนำ | trending_up | - |
| MORE | ดูรายงาน | description | - |

**ฟีเจอร์:**
- **กาง (Expanded):** แสดงโลโก้ ZPLogo.png + ปุ่มลูกศรซ้ายสำหรับหุบ (chevron_left)
- **หุบ (Collapsed):** แสดงโลโก้ ZPLogocollapse.png + ลูกศรขวา รวมเป็นปุ่มเดียว (`logo-expand-btn`) กดเพื่อกาง
- **เมนูย่อย:** "ประกัน" มีลูกศรหมุน 90 องศาเมื่อกาง แสดงเมนูย่อย ประกันชีวิต/ประกันสุขภาพ
- **ประกัน selectable:** กดที่ "ประกัน" จะเลือกเมนูนี้ได้เลย พร้อมกับเปิด/ปิดเมนูย่อย
- **ส่วนล่าง:** การ์ดอัปเกรด + ปุ่ม "Upgrade Pro"
- **Overlay:** แสดงพื้นหลังสีดำจางเมื่อเปิด Sidebar บนมือถือ

**Animation:**
- ปุ่มเมนูที่เลือก: พื้นขาว + เงาม่วง + ลอยขึ้น `scale(1.02)` ด้วย spring curve `cubic-bezier(0.34, 1.56, 0.64, 1)`
- กดเมนู: ยุบลง `scale(0.96)` transition 0.1s
- Hover: ตัวอักษรและไอคอนเปลี่ยนเป็นสีม่วง

---

### 3. TopBar.tsx

**หน้าที่:** แถบด้านบน แสดงชื่อหน้าและข้อมูลผู้ใช้

**Props:** `onMenuToggle`, `userName`, `avatarUrl`, `pageTitle`, `onBack?`

**ฟีเจอร์:**
- แสดงชื่อหน้าแบบ dynamic ตาม `pageTitle` prop
- ปุ่ม back `<` (chevron_left) — แสดงเมื่อมี `onBack` prop (เช่น หน้าสินทรัพย์ กดกลับไปหน้าโปรไฟล์)
- ปุ่ม hamburger menu (แสดงเฉพาะมือถือ)
- User badge ขวาบน: รูปโปรไฟล์ + ชื่อ — **sync กับ profile data เสมอ** (เมื่อแก้ไขโปรไฟล์แล้วบันทึก ชื่อและรูปจะอัปเดตทันที)

---

### 4. ProfileCard.tsx

**หน้าที่:** แสดงข้อมูลโปรไฟล์หลัก มี 2 โหมด

**Props:** `data`, `avatarUrl`, `isEditing`, `onEdit`, `onCancel`, `onSave`, `onChange`, `onAvatarClick`

**โหมดดูปกติ:**
- รูปโปรไฟล์ขนาดใหญ่ (130px) พร้อมกรอบม่วง
- ชื่อ-นามสกุล + (ชื่อเล่น)
- ตำแหน่ง + บริษัท
- ปุ่ม "แก้ไขข้อมูล" มุมขวาบน
- แถบ gradient ม่วงบาง (4px) ด้านบนการ์ด

**โหมดแก้ไข (Edit Mode):**
- แบนเนอร์ gradient ม่วงด้านบน
- รูปโปรไฟล์พร้อมปุ่มแก้ไข overlay (กดเพื่อเปิด native file picker)
- ปุ่ม "ยกเลิก" (โปร่งแสง) และ "บันทึกข้อมูล" (ขาว)
- ฟอร์ม: ชื่อจริง-นามสกุล + ชื่อเล่น (2 คอลัมน์), ตำแหน่ง, บริษัท

---

### 5. ContactCard.tsx

**หน้าที่:** แสดงช่องทางการติดต่อ

**ฟิลด์:**

| Icon | Label | Field |
|------|-------|-------|
| phone | เบอร์โทรศัพท์ | phone |
| email | อีเมล | email |
| chat | LINE ID | lineId |
| location_on | ที่ทำงาน | address |
| language | Social Media | socialMedia |

- **โหมดดู:** แสดงไอคอน + ข้อความ
- **โหมดแก้ไข:** แสดง label + input field

---

### 6. LicenseCard.tsx

**หน้าที่:** แสดงข้อมูลใบอนุญาตและคุณวุฒิ

**ฟิลด์:**

| Label | Field |
|-------|-------|
| ใบอนุญาตตัวแทนประกันชีวิต | insuranceLicense |
| ผู้แนะนำการลงทุน (IC License) | icLicense |
| คุณวุฒิ | qualifications |
| ใบอนุญาตอื่นๆ | otherLicenses |

- **โหมดดู:** แสดง label (เทาอ่อน) + value (เข้ม)
- **โหมดแก้ไข:** แสดง label + input field

---

### 7. ProfilePage.tsx

**หน้าที่:** หน้าหลักที่รวม ProfileCard, ContactCard, LicenseCard เข้าด้วยกัน จัดการ state การแก้ไข

**Props:** `profile`, `onSave`

**State ภายใน:**
- `isEditing` — กำลังแก้ไขอยู่หรือไม่
- `draft` — สำเนาข้อมูลสำหรับแก้ไข (ไม่กระทบข้อมูลจริงจนกว่าจะบันทึก)
- `previewUrl` — URL ชั่วคราวของรูปที่เลือก (จาก `URL.createObjectURL`)
- `fileInputRef` — ref สำหรับ hidden file input

**Flow การแก้ไข:**
1. กด "แก้ไขข้อมูล" → คัดลอก profile → draft, เปิด isEditing
2. แก้ไขข้อมูลในฟอร์ม → อัปเดต draft
3. เปลี่ยนรูป → เปิด native file picker → สร้าง previewUrl
4. กด "บันทึกข้อมูล" → ส่ง draft (+ previewUrl ถ้ามี) ไปยัง App ผ่าน onSave → TopBar อัปเดตตาม
5. กด "ยกเลิก" → ทิ้ง draft, ปิด isEditing

**Layout:**
- ProfileCard (เต็มความกว้าง)
- Grid 2 คอลัมน์: ContactCard | LicenseCard
- Footer: "(c) 2026. ZettaPlan All rights reserved."

---

### 8. DonutChart.tsx

**หน้าที่:** Reusable SVG donut chart สำหรับแสดงสัดส่วนข้อมูล

**Props:**
- `segments` — `{ value: number, color: string, label: string }[]` (value เป็น %)
- `size?` — ขนาด SVG (default: 200px)
- `strokeWidth?` — ความหนาของ donut (default: 40px)

**วิธีการ:** ใช้ `<circle>` + `stroke-dasharray` + `stroke-dashoffset` ของ SVG — ไม่ต้องใช้ charting library ภายนอก แต่ละ segment เป็น circle ที่ซ้อนกัน หมุนเริ่มจาก 12 นาฬิกา (`rotate(-90)`)

---

### 9. AssetPage.tsx

**หน้าที่:** หน้าแสดงข้อมูลสินทรัพย์ทั้งหมด ตามดีไซน์ Asset.png

**State ภายใน:**
- `assets` — รายการสินทรัพย์ (`Asset[]`)
- `nextId` — ID ถัดไปสำหรับรายการใหม่
- `modalOpen` — เปิด/ปิด Modal
- `editingId` — ID ของรายการที่กำลังแก้ไข (`null` = เพิ่มใหม่)
- `form` — ข้อมูลในฟอร์ม Modal (`ModalForm`)

**ข้อมูลที่คำนวณ:**
- `totalValue` — ยอดรวมสินทรัพย์ทั้งหมด
- `categoryTotals` — ยอดรวม + เปอร์เซ็นต์ แยกตามประเภท

**Layout (3 ส่วน):**

**ส่วนบน (grid 2 คอลัมน์):**
- **ซ้าย "สินทรัพย์สุทธิ"** — ยอดรวม (ม่วง, ตัวใหญ่) + รายการประเภท (จุดสี+label+%) + ปุ่ม "+ เพิ่มรายการสินทรัพย์"
- **ขวา "สัดส่วนสินทรัพย์"** — DonutChart + Legend

**สีประเภทสินทรัพย์:**

| ประเภท | สี | ประเภทในตาราง |
|--------|-----|-------------|
| เงินสด/ฝากธนาคาร | #6366F1 (น้ำเงิน) | เงินฝาก |
| กองทุนรวม | #22C55E (เขียว) | กองทุน |
| หุ้นสามัญ | #F59E0B (ส้ม) | หุ้น |

**ส่วนล่าง "รายการสินทรัพย์" (table):**
- Headers: รายการ | ประเภท | สถาบันการเงิน | มูลค่าสินทรัพย์ (บาท) | แก้ไข | ลบ
- Mock data 3 รายการ
- ปุ่ม edit (เปิด Modal พร้อมข้อมูลเดิม) + ปุ่ม delete (ลบได้จริง → donut อัปเดตอัตโนมัติ)

**Modal เพิ่ม/แก้ไขสินทรัพย์ (ตาม "Asset - Add and Edit.png"):**
- Title: "คำนวณการวางแผนเกษียณ"
- ฟิลด์: รายการ (text), ประเภท (dropdown: เงินฝาก/กองทุน/หุ้น), สถาบันการเงิน (text), มูลค่าสินทรัพย์ (number)
- ปุ่ม "บันทึกข้อมูล" (ม่วง, เต็มความกว้าง, rounded)
- ปุ่ม X ปิด modal มุมขวาบน
- กดพื้นหลัง overlay ปิด modal ได้
- **เพิ่ม:** ฟอร์มว่าง → บันทึก → เพิ่มรายการใน list + donut อัปเดต
- **แก้ไข:** ฟอร์มมีข้อมูลเดิม → บันทึก → อัปเดตรายการ + donut อัปเดต
- Validation: ต้องกรอกชื่อ, สถาบัน, และมูลค่า > 0

**Mock Data:**

| รายการ | ประเภท | สถาบัน | มูลค่า |
|--------|--------|--------|--------|
| หุ้นสามัญ | หุ้น | Bualuang | 3,000,000 |
| กองทุนรวม | กองทุน | SCBAM | 2,500,000 |
| เงินสด/ฝากธนาคาร | เงินฝาก | KBANK | 1,500,000 |

---

### 10. GoalPage.tsx

**หน้าที่:** หน้าเป้าหมายการเงิน แสดงเป้าหมายเป็น cards พร้อม CRUD ผ่าน Modal

**State (persisted):**
- `goals` — รายการเป้าหมาย (`Goal[]`) — localStorage key: `zettaplan_goals`
- `nextId` — ID ถัดไปสำหรับเป้าหมายใหม่ — localStorage key: `zettaplan_goals_nextId`

**State (local):**
- `modalOpen` — เปิด/ปิด Modal เพิ่ม/แก้ไข
- `editingId` — ID ที่กำลังแก้ไข (`null` = เพิ่มใหม่)
- `form` — ข้อมูลในฟอร์ม Modal (`GoalForm` — ใช้ string เพื่อรองรับ input ว่าง)
- `confirmDeleteId` — ID ที่จะลบ (แสดง ConfirmModal)

**สูตรคำนวณ (Future Value of Annuity):**
```
gap = targetAmount - currentSavings
r = expectedReturn / 100 / 12  (monthly rate)
months = years × 12
monthlySaving = gap / ((1+r)^months - 1) × r
```

**Layout:**
- ปุ่ม "เพิ่มเป้าหมาย" (ม่วง, rounded)
- Grid **3 คอลัมน์** (responsive: 2 col ≤1024px, 1 col ≤768px)
- แต่ละ card: ชื่อเป้าหมาย + ปุ่มลบ, badge "เป้าหมาย: X ปี", เป้าหมาย (บาท), มีอยู่แล้ว (บาท), กล่อง highlight ม่วง "เงินที่ต้องเก็บเดือนละประมาณ X บาท", ปุ่ม "แก้ไขข้อมูล"

**Modal เพิ่ม/แก้ไข (ตาม "Goal - Add and Edit.png"):**
- Title: "สร้างเป้าหมายใหม่" (เพิ่ม) / "แก้ไขเป้าหมาย" (แก้ไข)
- ฟิลด์: ชื่อเป้าหมาย (text), จำนวนเงินที่ตั้งไว้ + เงินออมปัจจุบัน (2 col), ระยะเวลา (ปี) + Exp. Return (%) (2 col)
- ปุ่ม "บันทึกข้อมูล" (ม่วง, rounded)
- Reuse modal CSS จาก AssetPage (`.modal-overlay`, `.modal-card`, `.modal-input`, `.modal-save-btn`)

**Mock Data:**

| ชื่อเป้าหมาย | เป้าหมาย (บาท) | มีอยู่แล้ว | ระยะเวลา | Exp. Return |
|-------------|-------------|---------|---------|-----------|
| ทุนการศึกษาบุตร | 2,000,000 | 500,000 | 15 ปี | 5% |
| ซื้อ IPAD Gen 6 | 20,000 | 5,000 | 3 ปี | 5% |

---

### 11. InsurancePage.tsx

**หน้าที่:** หน้าภาพรวมประกัน รวมข้อมูลจากประกันชีวิตและประกันสุขภาพ แสดงยอดรวม + donut chart + ตาราง

**State (persisted):**
- `healthItems` — รายการประกันสุขภาพ (`InsuranceItem[]`) — localStorage key: `zettaplan_insurance` (กรองเฉพาะประกันสุขภาพ)

**Read-only (from LifeInsurancePage):**
- `lifePolicies` — กรมธรรม์ประกันชีวิต (`LifePolicy[]`) — อ่านจาก localStorage key: `zettaplan_life_policies`

**Derived:**
- `lifeTotalCoverage` / `lifeTotalPremium` — รวม coverage/premium จากกรมธรรม์ประกันชีวิตทั้งหมด
- `items` — รวมแถว ประกันชีวิต (aggregate) + ประกันสุขภาพ เป็น `InsuranceItem[]` สำหรับ table + chart
- `totalCoverage` — ทุนประกันรวมทั้งหมด
- `totalPremium` — เบี้ยประกันรวมทั้งหมด
- `typeTotals` — ยอดรวม + เปอร์เซ็นต์ แยกตามประเภท (ประกันชีวิต/ประกันสุขภาพ)

**Layout (ตามดีไซน์ "Insurance Overview.png"):**

**ส่วนบน (grid 2 คอลัมน์):**
- **ซ้าย "ประกันรวมทั้งหมด":** ยอดทุนประกันรวม (ม่วง, ตัวใหญ่) + เบี้ยประกันทั้งหมด + จำแนกตามทุนประกัน (จุดสี + label + %)
- **ขวา "แผนภูมิภาพรวมประกัน":** DonutChart (reuse) + Legend (Life/Health)

**สีประเภทประกัน:**

| ประเภท | สี | Legend Label |
|--------|-----|-----------|
| ประกันชีวิต | #6366F1 (น้ำเงิน) | Life |
| ประกันสุขภาพ | #22C55E (เขียว) | Health |

**ส่วนล่าง "รายการประกัน" (table):**
- Headers: ประเภท | บริษัท | ทุนประกันรวม (บาท) | เบี้ยประกัน (บาท)

**Mock Data:**

| ประเภท | บริษัท | ทุนประกันรวม | เบี้ยประกัน |
|--------|--------|------------|----------|
| ประกันชีวิต | AIA | 1,000,000 | 25,000 |
| ประกันสุขภาพ | Muang Thai | 5,000,000 | 30,000 |

**Routing:**
- "ประกัน" → `/insurance` (overview)
- "ประกันชีวิต" → `/insurance/life`
- "ประกันสุขภาพ" → `/insurance/health`

---

### 12. LifeInsurancePage.tsx

**หน้าที่:** หน้าประกันชีวิต แสดงช่องว่างความคุ้มครอง (coverage gap) พร้อมตารางกรมธรรม์ + ภาระ/ทรัพย์สิน

**State (persisted):**
- `policies` — รายการกรมธรรม์ (`LifePolicy[]`) — localStorage key: `zettaplan_life_policies`
- `nextId` — ID ถัดไปสำหรับกรมธรรม์ใหม่ — localStorage key: `zettaplan_life_nextId`
- `needs` — ภาระและความจำเป็น (`NeedItem[]`) — localStorage key: `zettaplan_life_needs_v2` (dynamic list)
- `needsNextId` — ID ถัดไปสำหรับ need item ใหม่ — localStorage key: `zettaplan_life_needs_nextId`
- ~~`assets`~~ — **ลบออก** → ดึงจาก `zettaplan_assets` (หน้าสินทรัพย์) แบบ read-only

**State (local):**
- `addModalOpen` — เปิด/ปิด Modal เพิ่มเคส
- `selectedCases` — Set ของ index ที่เลือกใน Modal
- `editingNeeds` — โหมดแก้ไขภาระ
- `needsDraft` — draft state สำหรับ needs (`NeedDraftItem[]`)
- `needsDraftNextId` — ID counter สำหรับ draft
- `confirmDeleteId` — ID ที่จะลบ (ConfirmModal)

**Derived:**
- `totalNeed` — ผลรวมภาระทั้งหมด (จาก `needs[]`)
- `totalAsset` — ผลรวมทรัพย์สินทั้งหมด (จาก `zettaplan_assets` localStorage)
- `totalPolicyCoverage` — ทุนประกันจากกรมธรรม์
- `gap` — ช่องว่างความคุ้มครอง (totalNeed - totalAsset - totalPolicyCoverage)
- `funded` — % ที่คุ้มครองแล้ว

**Layout (ตาม "Insurance - Life.png"):**
- **Banner:** gradient ม่วงเข้ม (เดียวกันทั้ง covered/uncovered) แสดง gap (บาท) หรือ "ครอบคลุมแล้ว" + progress bar (แดง/เขียว)
- **ตารางประกันชีวิต:** รหัสแบบ | บริษัท | ทุนประกัน | เบี้ยรายปี | ลบ + ปุ่ม "เพิ่มประกันชีวิต" — **limit 3 rows visible, scroll เมื่อมากกว่า**
- **Bottom Grid (2 คอลัมน์):**
  - ซ้าย "ภาระและความจำเป็น": แสดง need items แบบ dynamic list + รวม (แดง) + ปุ่มแก้ไข — edit mode เพิ่ม/ลบ/แก้ไขเป็นก้อนๆ (ชื่อรายการ + จำนวนเงิน) — **limit 2 blocks visible, scroll เมื่อมากกว่า**
  - ขวา "ทรัพย์สินที่มีอยู่": **read-only**, ดึงข้อมูลจากหน้าสินทรัพย์ (`zettaplan_assets`) แสดงเป็น cards + รวม (ม่วง) — **limit 4 items visible, scroll เมื่อมากกว่า**

**Modal เพิ่มเคส (ตาม "Insurance - Life - Add Case.png"):**
- ตาราง checkbox: เลือกได้หลายเคส, select-all toggle
- รายการ: รหัสแบบ | ชื่อแบบ | ทุนประกัน | เบี้ยรายปี
- กดบันทึก → เพิ่มเคสที่เลือกเข้าตาราง

**โหมดแก้ไข Needs (ตาม "Insurance - Life - Edit.png"):**
- แต่ละ need item เป็น block: ชื่อรายการ (text) + จำนวนเงิน (number) + ปุ่มลบ
- ปุ่ม "+ เพิ่มความจำเป็น" เพิ่ม block ใหม่
- ปุ่มยกเลิก + บันทึก (draft pattern เหมือนหน้าอื่น)

**Mock Data (Available Cases):**

| รหัสแบบ | ชื่อแบบ | ทุนประกัน | เบี้ยรายปี |
|---------|---------|----------|----------|
| WL-001 | AIA Whole Life 20/20 | 1,000,000 | 25,000 |
| TL-002 | AIA Term Life 10Y | 2,000,000 | 8,500 |
| END-003 | AIA Endowment 15/15 | 500,000 | 32,000 |
| UL-004 | AIA Unit Linked Plus | 1,500,000 | 18,000 |
| WL-005 | AIA Whole Life 99/20 | 3,000,000 | 45,000 |
| CI-006 | AIA CI Protection | 1,000,000 | 12,000 |
| TL-007 | AIA Term Life 20Y | 5,000,000 | 15,000 |

### 13. HealthInsurancePage.tsx

**หน้าที่:** หน้าประกันสุขภาพ แสดงตารางกรมธรรม์ + ข้อมูลความคุ้มครองเดิม + เปรียบเทียบกับค่ารักษามาตรฐาน

**State (persisted):**
- `policies` — รายการกรมธรรม์ประกันสุขภาพ (`HealthPolicy[]`) — localStorage key: `zettaplan_health_policies`
- `nextId` — ID ถัดไปสำหรับกรมธรรม์ใหม่ — localStorage key: `zettaplan_health_nextId`
- `coverage` — ข้อมูลความคุ้มครอง (`CoverageData`) — localStorage key: `zettaplan_health_coverage`

**State (local):**
- `editingCoverage` — โหมดแก้ไขความคุ้มครอง
- `draft` — draft state สำหรับ coverage (`CoverageDraft`)
- `addModalOpen` — เปิด/ปิด Modal เพิ่มเคส
- `selectedCases` — Set ของ index ที่เลือกใน Modal
- `confirmDeleteId` — ID ที่จะลบ (ConfirmModal)
- `standardLevel` — ระดับมาตรฐานที่เลือกเปรียบเทียบ

**Layout (ตาม "Insurance - Health.png"):**
- **ตารางประกันสุขภาพ:** รหัสประกัน | บริษัท | ทุนประกัน | เบี้ยประกัน | ลบ + ปุ่ม "เพิ่มประกันสุขภาพ"
- **Bottom Grid (2 คอลัมน์):**
  - ซ้าย "ข้อมูลความคุ้มครองเดิม": ค่าห้องต่อคืน, วงเงินเหมาจ่ายต่อปี, ค่ารักษาผู้ป่วยนอก (OPD) + view/edit mode
  - ขวา "จำลองเปรียบเทียบกับค่ารักษามาตรฐาน": dropdown เลือกระดับ + progress bars เปรียบเทียบ 3 รายการ

**Modal เพิ่มเคส (ตาม "Insurance - Health - Add Case.png"):**
- ตาราง checkbox: เลือกได้หลายเคส, select-all toggle
- รายการ: รหัสประกัน | บริษัท | ทุนประกัน | เบี้ยประกัน
- กดเลือก → เพิ่มเคสที่เลือกเข้าตาราง

**โหมดแก้ไข Coverage (ตาม "Insurance - Health - Edit.png"):**
- Input fields สำหรับ ค่าห้องต่อคืน, วงเงินเหมาจ่ายต่อปี, ค่ารักษาผู้ป่วยนอก
- ปุ่มยกเลิก + บันทึก (draft pattern เหมือนหน้าอื่น)

**ระดับมาตรฐานเปรียบเทียบ:**

| ระดับ | ค่าห้อง | วงเงินเหมาจ่าย | OPD |
|-------|---------|---------------|-----|
| ระดับทั่วไป (มาตรฐาน) | 4,000 | 1,000,000 | 1,500 |
| ระดับกลาง | 6,000 | 3,000,000 | 2,500 |
| ระดับสูง | 10,000 | 5,000,000 | 5,000 |

**Mock Data (Available Cases):**

| รหัสประกัน | บริษัท | ทุนประกัน | เบี้ยประกัน |
|-----------|--------|----------|----------|
| INSH000001-007 | AIA | 1,000,000 | 25,000 |

---

### 14. PortfolioPage.tsx

**หน้าที่:** หน้าพอร์ตแนะนำ แสดงพอร์ตที่แนะนำจาก AI พร้อม donut chart สัดส่วนสินทรัพย์ + จำลองการลงทุน + area chart

**State (persisted):**
- `data` — ข้อมูลจำลองการลงทุน (`InvestmentData`) — localStorage key: `zettaplan_portfolio`

**State (local):**
- `isEditing` — โหมดแก้ไข
- `draft` — draft state สำหรับ investment data (`Record<keyof InvestmentData, string>`)

**Layout (ตาม "Portfolio AI.png"):**
- **Banner:** gradient ม่วง แสดง "พอร์ตที่แนะนำจาก AI" + "AIA 5 Years Plan"
- **Middle Grid (2 คอลัมน์):**
  - ซ้าย: DonutChart (ตราสารหนี้ 40%, หุ้นไทย 25%, หุ้นต่างประเทศ 20%, อสังหาฯ 15%) + Legend
  - ขวา: รายละเอียดพอร์ต (description + กล่องผลตอบแทน 5-8% CAGR)
- **Bottom Grid (2 คอลัมน์):**
  - ซ้าย "จำลองการลงทุน": เงินลงทุนเริ่มต้น, ออมเพิ่มต่อเดือน, ผลตอบแทนที่คาดหวัง, ระยะเวลา + view/edit mode
  - ขวา: AreaChart (compound growth projection)

**โหมดแก้ไข (ตาม "Portfolio AI - Edit.png"):**
- Input fields สำหรับ 4 ฟิลด์ + ปุ่มยกเลิก/บันทึก (draft pattern เดียวกับหน้าอื่น)

**สูตรคำนวณ (Compound Growth):**
```
FV = initialInvestment × (1+r)^months + monthlySaving × ((1+r)^months - 1) / r
r = expectedReturn / 100 / 12  (monthly rate)
```

**Mock Data (Default):**

| ฟิลด์ | ค่า |
|-------|-----|
| เงินลงทุนเริ่มต้น | 100,000 บาท |
| ออมเพิ่มต่อเดือน | 5,000 บาท |
| ผลตอบแทนที่คาดหวัง | 5% |
| ระยะเวลา | 3 ปี |

### 15. TaxPlanPage.tsx

**หน้าที่:** หน้าวางแผนภาษี จำลองการคำนวณภาษีเงินได้บุคคลธรรมดาตามฐานภาษีไทย (progressive tax) รองรับ 2 โหมด: ขั้นพื้นฐาน + ขั้นสูง

**State (persisted):**
- `basicData` — ข้อมูลโหมดพื้นฐาน (`TaxDataBasic`) — localStorage key: `zettaplan_tax`
- `advancedData` — ข้อมูลโหมดขั้นสูง (`TaxDataAdvanced`) — localStorage key: `zettaplan_tax_adv`

**State (local):**
- `taxLevel` — โหมดปัจจุบัน ('ขั้นพื้นฐาน' | 'ขั้นสูง') — เปลี่ยนด้วย dropdown
- `isEditing` — โหมดแก้ไข
- `basicDraft` / `advancedDraft` — draft state แยกตามโหมด

**Layout:**
- **Top Grid (2 คอลัมน์):**
  - ซ้าย: dropdown สลับโหมด + fields ตามโหมด + view/edit mode
    - **ขั้นพื้นฐาน:** 2 ฟิลด์ (รายได้ทั้งปี + ค่าลดหย่อนรวม) — stacked layout
    - **ขั้นสูง (view):** 6 ฟิลด์ horizontal rows (label ซ้าย, value ขวา) + แถว "รวมลดหย่อน" (auto-sum, bold, top-border)
    - **ขั้นสูง (edit):** 6 input fields — stacked layout
  - ขวา: dark gradient card แสดง ภาษีโดยประมาณ (สีเขียว) + เงินได้สุทธิ + อัตราภาษีเฉลี่ย
- **Bottom Card:** ตารางฐานภาษี — 8 ขั้น + badge "คุณอยู่ขั้นนี้" (highlight ม่วง + left border)

**สูตรคำนวณ (Thai Progressive Tax):**
```
ฐานภาษี 8 ขั้น: 0% (0-150K), 5% (150K-300K), 10% (300K-500K), 15% (500K-750K),
                20% (750K-1M), 25% (1M-2M), 30% (2M-5M), 35% (>5M)
Basic: netIncome = annualIncome - totalDeduction
Advanced: netIncome = annualIncome - Σ(deductions)
tax = Σ (min(netIncome, bracket.max) - bracket.min) × rate
effectiveRate = tax / annualIncome × 100
```

**Mock Data (Default):**

| โหมด | ฟิลด์ | ค่า |
|------|-------|-----|
| Basic | รายได้ทั้งปี | 1,600,000 บาท |
| Basic | ค่าลดหย่อนรวม | 500,000 บาท |
| Advanced | รายได้ทั้งปี | 4,000 บาท |
| Advanced | ประกันสังคม | 9,000 บาท |
| Advanced | กองทุนสำรองเลี้ยงชีพ | 20,000 บาท |
| Advanced | RMF / SSF / ThaiESG | 50,000 บาท |
| Advanced | เบี้ยประกันชีวิต / สุขภาพ | 30,000 บาท |
| Advanced | อื่นๆ | 0 บาท |

---

### 16. DashboardPage.tsx

**หน้าที่:** หน้าดูรายงาน (Dashboard) สรุปข้อมูลจากทุกหน้าใน Sidebar แสดง Radar Chart, Donut Chart, Area Chart, และ Summary Cards

**Read-only (from localStorage):**
- `assets` — สินทรัพย์ (`Asset[]`) — key: `zettaplan_assets`
- `retirement` — ข้อมูลเกษียณ (`RetirementData`) — key: `zettaplan_retirement`
- `goals` — เป้าหมายการเงิน (`Goal[]`) — key: `zettaplan_goals`
- `lifePolicies` — กรมธรรม์ประกันชีวิต (`LifePolicy[]`) — key: `zettaplan_life_policies`
- `healthPolicies` — กรมธรรม์ประกันสุขภาพ (`HealthPolicy[]`) — key: `zettaplan_health_policies`
- `lifeNeeds` — ภาระความจำเป็น (`NeedItem[]`) — key: `zettaplan_life_needs_v2`
- `taxData` — ข้อมูลภาษี (`TaxDataBasic`) — key: `zettaplan_tax`
- `portData` — ข้อมูลพอร์ตแนะนำ (`InvestmentData`) — key: `zettaplan_portfolio`

**Derived:**
- `totalAsset` — ยอดรวมสินทรัพย์
- `donutSegments` — สัดส่วนสินทรัพย์ (แยกตามประเภท + จำนวนเงิน)
- `retirementNeeded` — เงินที่ต้องมีเพื่อเกษียณ
- `lifeCoverageGap` — ช่องว่างความคุ้มครอง (`totalNeed - totalAsset - totalPolicyCoverage`) — **sync กับ LifeInsurancePage**
- `taxAmount` — ภาษีที่ต้องจ่าย (Thai progressive tax)
- `portFV` — มูลค่าพอร์ตในอนาคต (compound growth)
- `radarValues` — คะแนน 5 มิติ (สภาพคล่อง, การออม, ความคุ้มครอง, หนี้สิน, ภาษี)
- `trendData` — แนวโน้ม 10 ปี (สมมุติผลตอบแทน 5%/ปี)
- `alerts` — แจ้งเตือน 3 รายการ (ประกันชีวิต, ภาษี, พอร์ตแนะนำ)

**Layout (ตาม "Dashboard.png"):**
- **ปุ่ม Export PDF:** ม่วง, navigate ไป `/report/pdf`
- **Row 1 (grid 2 คอลัมน์):**
  - ซ้าย: สินทรัพย์สุทธิ (คลิกไปหน้าสินทรัพย์) + แจ้งเตือน (3 รายการ: ประกันชีวิต/ภาษี/พอร์ต)
  - ขวา: Radar Chart (SVG, pure — 5 มิติ)
- **Row 2 (grid 2 คอลัมน์):**
  - ซ้าย: Donut Chart สัดส่วนสินทรัพย์ (คลิกไปหน้าสินทรัพย์) + Legend แสดงจำนวนเงิน
  - ขวา: Area Chart แนวโน้ม 10 ปี
- **Row 3: Summary Grid (3 คอลัมน์, 6 cards):**
  - วางแผนเกษียณ — navigate `/retirement`
  - เป้าหมายการเงิน — navigate `/goals`
  - ประกันชีวิต — navigate `/insurance/life`
  - ประกันสุขภาพ — navigate `/insurance/health`
  - วางแผนภาษี — navigate `/tax`
  - พอร์ตแนะนำ — navigate `/portfolio`
  - แต่ละ card: icon (gradient), ชื่อ, ค่า, หน่วย, badge (success/danger/warning/info)
- **Bottom: ตารางสินทรัพย์สูงสุด** (top 3)

**แจ้งเตือน (Alerts):**
- ประกันชีวิต: ครอบคลุมแล้ว (success) หรือ ขาดความคุ้มครอง (danger)
- ภาษี: จำนวนภาษีที่ต้องจ่าย (warning) หรือ ยกเว้นภาษี (success)
- พอร์ตแนะนำ: มูลค่าในอนาคต (success)

**สูตรความคุ้มครอง (sync กับ LifeInsurancePage):**
```
gap = totalNeed - totalAsset - totalPolicyCoverage
ถ้า gap ≤ 0 → ครอบคลุมแล้ว
ถ้า gap > 0 → ขาดความคุ้มครอง
```

**Animation:**
- Cards: `cardSlideUp` + hover lift + staggered animation-delay
- Net value: `valueFadeIn` 0.5s
- Badge: `popIn` 0.4s
- Alerts: `rowSlideIn` staggered
- Radar: `bannerFadeIn` + `radarDraw` (scale 0.3→1) + dots `popIn` staggered
- Summary values: `valueFadeIn`, badges: `popIn`

**Routing:** `/dashboard` → DashboardPage (ใน layout มี sidebar/topbar)
**ไฟล์:** `DashboardPage.tsx`, `DashboardPage.css`

---

### 17. PdfViewerPage.tsx

**หน้าที่:** หน้า PDF Viewer แสดง preview รายงานการเงินเป็นรูปแบบกระดาษ A4 แบบหลายหน้า (auto-paginate) พร้อม sidebar นำทางหน้า และปุ่มดาวน์โหลด PDF

**Read-only (from localStorage):**
- `profile` — ข้อมูลโปรไฟล์ (ชื่อ, ตำแหน่ง, บริษัท) — key: `zettaplan_profile`
- `assets` — สินทรัพย์ — key: `zettaplan_assets`
- `retirement` — ข้อมูลเกษียณ — key: `zettaplan_retirement`
- `lifePolicies` — กรมธรรม์ประกันชีวิต — key: `zettaplan_life_policies`
- `healthPolicies` — กรมธรรม์ประกันสุขภาพ — key: `zettaplan_health_policies`
- `lifeNeeds` — ภาระความจำเป็น — key: `zettaplan_life_needs_v2`
- `goals` — เป้าหมายการเงิน — key: `zettaplan_goals`
- `taxData` — ข้อมูลภาษี — key: `zettaplan_tax`
- `portData` — ข้อมูลพอร์ตแนะนำ — key: `zettaplan_portfolio`
- `healthCoverage` — ข้อมูลความคุ้มครองสุขภาพ — key: `zettaplan_health_coverage`

**Derived:**
- `coverageGap` — ช่องว่างความคุ้มครอง (`totalNeed - totalAsset - totalCoverage`) — **sync กับ LifeInsurancePage**
- `retirementNeeded`, `retirementEnough` — คำนวณเกษียณ
- `taxAmount`, `effectiveRate` — ภาษี (Thai progressive tax)
- `portFV` — มูลค่าพอร์ตในอนาคต (compound growth)

**A4 Pagination System:**
- A4 dimensions: `794 × 1123 px` (210mm × 297mm at 96dpi)
- Hidden measurement container: render ทุก section block แล้ววัดความสูง
- `paginate()` callback: วัด `.pdf-section-block` ทุกตัว แล้วแจกจ่ายเข้า pages ตาม usable height (1123 - 56 - 56 = 1011px)
- ถ้า section ล้น → ย้ายไปหน้าถัดไปอัตโนมัติ

**Section Blocks (10 blocks):**
1. Header + Confidential notice
2. Executive Summary (4 summary boxes)
3. สินทรัพย์ (Assets table)
4. แผนเกษียณ (Retirement detail table)
5. เป้าหมายการเงิน (Goals table)
6. ประกันชีวิต (Life Insurance table + coverage info)
7. ประกันสุขภาพ (Health Insurance table + coverage detail)
8. วางแผนภาษี (Tax detail table)
9. จำลองการลงทุน (Investment detail table)
10. Disclaimer + Footer

**Layout:**
- **Standalone page** — ไม่มี sidebar/topbar (render นอก layout ใน App.tsx)
- **Top Bar (dark):** ปุ่ม back → `/dashboard` + ชื่อไฟล์ + zoom +/- + page indicator + ปุ่ม Download (เขียว)
- **Page Sidebar (dark, 140px):** แสดง thumbnail + เลขหน้า ทุกหน้า, active state ม่วง, คลิกเพื่อ scroll ไปยังหน้านั้น
- **Body (dark background):** กระดาษ A4 สีขาว หลายหน้า (zoom scale) + page number ด้านล่าง

**PDF Download (Multi-page):**
- Dynamic import: `html2canvas` + `jsPDF` (code splitting)
- วน loop ทุก `.pdf-page` element → `html2canvas(el, { scale: 2 })` → `pdf.addImage()` per page
- `pdf.save('Financial_Plan_Report.pdf')`

**Scroll & Navigation:**
- `goToPage()`: scroll container ไปยังหน้าที่เลือก (smooth)
- `handleScroll()`: track active page จาก scroll position → highlight sidebar

**Routing:** `/report/pdf` → PdfViewerPage (standalone, early return ใน App.tsx)
**ไฟล์:** `PdfViewerPage.tsx`, `PdfViewerPage.css`

---

## Data Model

```typescript
interface ProfileData {
  avatarUrl: string          // URL รูปโปรไฟล์
  firstName: string          // ชื่อจริง-นามสกุล
  nickname: string           // ชื่อเล่น
  role: string               // ตำแหน่ง
  company: string            // บริษัท
  phone: string              // เบอร์โทรศัพท์
  email: string              // อีเมล
  lineId: string             // LINE ID
  address: string            // ที่อยู่/ที่ทำงาน
  socialMedia: string        // Social Media
  insuranceLicense: string   // เลขใบอนุญาตประกันชีวิต
  icLicense: string          // IC License
  qualifications: string     // คุณวุฒิ (MDRT, COT, etc.)
  otherLicenses: string      // ใบอนุญาตอื่นๆ
}
```

```typescript
// หน้าสินทรัพย์
type AssetCategory = 'เงินสด/ฝากธนาคาร' | 'กองทุนรวม' | 'หุ้นสามัญ'

interface Asset {
  id: number
  name: string               // ชื่อรายการ
  category: AssetCategory    // ประเภทสินทรัพย์
  institution: string        // สถาบันการเงิน
  value: number              // มูลค่า (บาท)
}

// หน้าเป้าหมายการเงิน
interface Goal {
  id: number
  name: string               // ชื่อเป้าหมาย
  targetAmount: number        // จำนวนเงินเป้าหมาย (บาท)
  currentSavings: number      // เงินออมปัจจุบัน (บาท)
  years: number               // ระยะเวลา (ปี)
  expectedReturn: number      // ผลตอบแทนที่คาดหวัง (%)
}

// หน้าประกัน
type InsuranceType = 'ประกันชีวิต' | 'ประกันสุขภาพ'

interface InsuranceItem {
  id: number
  type: InsuranceType        // ประเภทประกัน
  company: string            // บริษัทประกัน
  coverage: number           // ทุนประกัน (บาท)
  premium: number            // เบี้ยประกัน (บาท)
}

// หน้าประกันชีวิต
interface LifePolicy {
  id: number
  code: string               // รหัสแบบ
  company: string             // บริษัทประกัน
  coverage: number            // ทุนประกัน (บาท)
  premium: number             // เบี้ยรายปี (บาท)
}

interface NeedItem {
  id: number
  name: string                // ชื่อรายการภาระ
  amount: number              // จำนวนเงิน (บาท)
}

// ทรัพย์สินดึงจาก zettaplan_assets (หน้าสินทรัพย์) — read-only
// ใช้ Asset interface จาก AssetPage

// หน้าประกันสุขภาพ
interface HealthPolicy {
  id: number
  code: string               // รหัสประกัน
  company: string             // บริษัทประกัน
  coverage: number            // ทุนประกัน (บาท)
  premium: number             // เบี้ยประกัน (บาท)
}

interface CoverageData {
  roomPerNight: number         // ค่าห้องต่อคืน (บาท)
  annualLimit: number          // วงเงินเหมาจ่ายต่อปี (บาท)
  opdPerVisit: number          // ค่ารักษาผู้ป่วยนอก OPD/ครั้ง (บาท)
}

// หน้าพอร์ตแนะนำ
interface InvestmentData {
  initialInvestment: number   // เงินลงทุนเริ่มต้น (บาท)
  monthlySaving: number       // ออมเพิ่มต่อเดือน (บาท)
  expectedReturn: number      // ผลตอบแทนที่คาดหวัง (%)
  years: number               // ระยะเวลา (ปี)
}

// หน้าวางแผนภาษี (ขั้นพื้นฐาน)
interface TaxDataBasic {
  annualIncome: number        // รายได้ทั้งปี (บาท)
  totalDeduction: number      // ค่าลดหย่อนรวม (บาท)
}

// หน้าวางแผนภาษี (ขั้นสูง)
interface TaxDataAdvanced {
  annualIncome: number        // รายได้ทั้งปี (บาท)
  socialSecurity: number      // ประกันสังคม (บาท)
  providentFund: number       // กองทุนสำรองเลี้ยงชีพ (บาท)
  rmfSsfThaiEsg: number       // RMF / SSF / ThaiESG (บาท)
  insurancePremium: number    // เบี้ยประกันชีวิต / สุขภาพ (บาท)
  otherDeduction: number      // อื่นๆ — บริจาค / ดอกเบี้ยบ้าน (บาท)
}

// Routing (react-router-dom)
// Route "/" → ProfilePage
// Route "/assets" → AssetPage
// Route "/retirement" → RetirementPage
// Route "/goals" → GoalPage
// Route "/insurance" → InsurancePage
// Route "/insurance/life" → LifeInsurancePage
// Route "/insurance/health" → HealthInsurancePage
// Route "/portfolio" → PortfolioPage
// Route "/tax" → TaxPlanPage
```

---

## State Architecture

```
BrowserRouter (main.tsx)
└── App.tsx (Root)
    │
    ├── State: sidebarOpen (boolean)
    ├── State: sidebarCollapsed (boolean)
    ├── State: profile (ProfileData)     ← persist ด้วย usePersistedState (localStorage)
    ├── Hook: useLocation()              ← อ่าน URL ปัจจุบัน
    ├── Hook: useNavigate()              ← เปลี่ยน URL
    │
    ├── → Sidebar
    │     ├── Prop: activePage           ← derived จาก location.pathname
    │     ├── Prop: onNavigate           ← navigate() ผ่าน navRoutes mapping
    │     └── Local State: expandedMenu (string | null)
    │
    ├── → TopBar
    │     ├── pageTitle ← routeTitles[pathname]  ← ชื่อหน้าแบบ dynamic
    │     ├── onBack ← navigate('/')              ← ปุ่มกลับ (ถ้าไม่ใช่ /)
    │     ├── userName ← profile.firstName        ← sync อัตโนมัติ
    │     └── avatarUrl ← profile.avatarUrl       ← sync อัตโนมัติ
    │
    └── → Routes
          ├── Route "/" → ProfilePage
          │     ├── Local State: isEditing, draft, previewUrl
          │     ├── onSave → App.setProfile
          │     ├── → ProfileCard (ดู/แก้ไข)
          │     ├── → ContactCard (ดู/แก้ไข)
          │     └── → LicenseCard (ดู/แก้ไข)
          │
          ├── Route "/assets" → AssetPage
          │     ├── Persisted State: assets, nextId  ← usePersistedState (localStorage)
          │     ├── Local State: modalOpen, editingId, form, confirmDeleteId, exitingId
          │     ├── Derived: totalValue, categoryTotals
          │     ├── → DonutChart (SVG, animated transitions)
          │     ├── → ConfirmModal (reusable)
          │     └── → Modal (เพิ่ม/แก้ไขสินทรัพย์)
          │
          ├── Route "/retirement" → RetirementPage
          │     ├── Persisted State: retirementData  ← usePersistedState (localStorage)
          │     ├── Local State: isEditing, draft
          │     ├── Derived: futureMonthly, totalNeeded, chartData[]
          │     └── → AreaChart (SVG, hover tooltip)
          │
          ├── Route "/goals" → GoalPage
          │     ├── Persisted State: goals, nextId  ← usePersistedState (localStorage)
          │     ├── Local State: modalOpen, editingId, form, confirmDeleteId
          │     ├── Derived: monthlySaving (Future Value of Annuity)
          │     ├── → Goal Cards (3-col grid)
          │     ├── → ConfirmModal (reusable)
          │     └── → Modal (เพิ่ม/แก้ไขเป้าหมาย)
          │
          ├── Route "/insurance" → InsurancePage
          │     ├── Persisted State: healthItems (InsuranceItem[])  ← usePersistedState (localStorage)
          │     ├── Read-only: lifePolicies  ← อ่านจาก localStorage key 'zettaplan_life_policies' (หน้าประกันชีวิต)
          │     ├── Derived: lifeTotalCoverage, lifeTotalPremium, items (combined), totalCoverage, totalPremium, typeTotals
          │     ├── → DonutChart (SVG, reuse)
          │     └── → Table (รายการประกัน — ประกันชีวิต aggregate + ประกันสุขภาพ)
          │
          ├── Route "/insurance/life" → LifeInsurancePage
          │     ├── Persisted State: policies, nextId, needs (NeedItem[]), needsNextId  ← usePersistedState
          │     ├── Read-only: storedAssets  ← อ่านจาก localStorage key 'zettaplan_assets' (หน้าสินทรัพย์)
          │     ├── Local State: addModalOpen, selectedCases, editingNeeds, needsDraft, confirmDeleteId
          │     ├── Derived: totalNeed, totalAsset, totalPolicyCoverage, gap, funded
          │     ├── → Banner (coverage gap / ครอบคลุมแล้ว — สีเข้มเสมอ, progress bar แดง/เขียว)
          │     ├── → Policy Table (add/delete, limit 3 rows + scroll)
          │     ├── → Add Case Modal (multi-select checkbox)
          │     ├── → Needs Card (dynamic blocks, add/edit/delete, limit 2 blocks + scroll)
          │     ├── → Assets Card (read-only from AssetPage, limit 4 items + scroll)
          │     └── → ConfirmModal (reusable)
          │
          ├── Route "/insurance/health" → HealthInsurancePage
          │     ├── Persisted State: policies, nextId, coverage (CoverageData)  ← usePersistedState
          │     ├── Local State: editingCoverage, draft, addModalOpen, selectedCases, confirmDeleteId, standardLevel
          │     ├── → Policy Table (add/delete, limit 3 rows + scroll)
          │     ├── → Add Case Modal (multi-select checkbox)
          │     ├── → Coverage Card (view/edit mode — ค่าห้อง, วงเงิน, OPD)
          │     ├── → Comparison Card (progress bars เปรียบเทียบกับมาตรฐาน + dropdown ระดับ)
          │     └── → ConfirmModal (reusable)
          │
          ├── Route "/portfolio" → PortfolioPage
          │     ├── Persisted State: data (InvestmentData)  ← usePersistedState
          │     ├── Local State: isEditing, draft
          │     ├── → Banner (gradient ม่วง — ชื่อพอร์ต AI)
          │     ├── → DonutChart (สัดส่วนสินทรัพย์ — ตราสารหนี้/หุ้นไทย/หุ้นต่างประเทศ/อสังหาฯ)
          │     ├── → Details Card (รายละเอียดพอร์ต + ผลตอบแทน CAGR)
          │     ├── → Simulator Card (จำลองการลงทุน — view/edit mode)
          │     └── → AreaChart (compound growth projection)
          │
          ├── Route "/tax" → TaxPlanPage
          │     ├── Persisted State: basicData (TaxDataBasic), advancedData (TaxDataAdvanced)  ← usePersistedState
          │     ├── Local State: taxLevel, isEditing, basicDraft, advancedDraft
          │     ├── → Dropdown (ขั้นพื้นฐาน ↔ ขั้นสูง)
          │     ├── → Input Card — Basic: 2 ฟิลด์ stacked / Advanced: 6 ฟิลด์ horizontal rows + รวมลดหย่อน
          │     ├── → Result Card (dark gradient — ภาษีโดยประมาณ + เงินได้สุทธิ + อัตราภาษี)
          │     └── → Brackets Card (ตารางฐานภาษี 8 ขั้น — progress bars + badge "คุณอยู่ขั้นนี้")
          │
          └── Route "/dashboard" → DashboardPage
                ├── Read-only: assets, retirement, goals, lifePolicies, healthPolicies, lifeNeeds, taxData, portData  ← อ่านจาก localStorage ทุก key
                ├── Derived: totalAsset, donutSegments, retirementNeeded, lifeCoverageGap, taxAmount, portFV, radarValues, trendData, alerts
                ├── → Export PDF Button → navigate('/report/pdf')
                ├── → Net Asset Card (คลิก → /assets)
                ├── → Alerts Card (ประกันชีวิต/ภาษี/พอร์ต — danger/warning/success)
                ├── → RadarChart (SVG, pure — 5 มิติ)
                ├── → DonutChart (สัดส่วนสินทรัพย์ + legend แสดงเงิน — คลิก → /assets)
                ├── → AreaChart (แนวโน้ม 10 ปี)
                ├── → Summary Grid (6 cards — วางแผนเกษียณ/เป้าหมาย/ประกันชีวิต/ประกันสุขภาพ/ภาษี/พอร์ต)
                └── → Top Assets Table (top 3)

    (Standalone — if pathname === '/report/pdf')
    └── PdfViewerPage (no sidebar/topbar)
          ├── Read-only: profile, assets, retirement, lifePolicies, healthPolicies, lifeNeeds, goals, taxData, portData, healthCoverage  ← อ่านจาก localStorage
          ├── Derived: coverageGap, retirementNeeded, retirementEnough, taxAmount, portFV
          ├── State: zoom, activePage, totalPages, pages (section indices per page)
          ├── → Top Bar (dark — back/zoom/page indicator/download)
          ├── → Page Sidebar (thumbnails, active state, click-to-navigate)
          └── → PDF Pages (A4 multi-page — auto-paginate, 10 section blocks)
```

---

## Responsive Design

| Breakpoint | การเปลี่ยนแปลง |
|-----------|----------------|
| Desktop (> 1024px) | Sidebar กาง 240px, content padding 32px, details grid 2 คอลัมน์ |
| Tablet (768px - 1024px) | content padding 24px |
| Mobile (< 768px) | Sidebar เป็น drawer (overlay), content full-width, details grid 1 คอลัมน์, user name ซ่อน, edit button icon-only |
| Small Mobile (< 480px) | avatar เล็กลง, ปุ่มบันทึก/ยกเลิก icon-only |

---

## Scripts

```bash
cd app
npm run dev        # เปิด dev server (Vite) — http://localhost:5173
npm run build      # TypeScript check + Vite build
npm run lint       # ESLint
npm run preview    # Preview production build
```

---

## Development Timeline

### Phase 1: Static HTML/CSS/JS
- สร้างหน้าโปรไฟล์แบบ static จากภาพ Design.png
- ธีมสีม่วง, ข้อความภาษาไทย, Sidebar, Profile Card, Contact/License Cards

### Phase 2: Convert to React + TypeScript
- Scaffold Vite + React + TypeScript project ใน `app/`
- แยก component: Sidebar, TopBar, ProfileCard, ContactCard, LicenseCard, ProfilePage
- ลบไฟล์ static เดิม

### Phase 3: Edit Mode
- เพิ่มโหมดแก้ไขข้อมูลโปรไฟล์ตาม "Profile - edit.png"
- แบนเนอร์ gradient ม่วง, avatar upload ผ่าน native file picker
- ฟอร์มแก้ไข: ชื่อ, ชื่อเล่น, ตำแหน่ง, บริษัท, ช่องทางติดต่อ, ใบอนุญาต
- ปุ่มยกเลิก/บันทึก พร้อม draft state pattern

### Phase 4: Sidebar Expand/Collapse
- เพิ่มโหมดกาง/หุบ Sidebar ตาม "Sidebar - expand.png" / "Sidebar - collapse.png"
- Sidebar หุบ 64px แสดงเฉพาะไอคอน
- เมนูย่อย "ประกัน" → ประกันชีวิต, ประกันสุขภาพ (พร้อมลูกศรหมุน)
- CSS transition smooth สำหรับ width + margin-left

### Phase 5: Sidebar Button Animation
- ปุ่มที่เลือก: พื้นขาว + เงาม่วง `box-shadow: 0 2px 8px rgba(124,58,237,0.15)` + ลอยขึ้น `scale(1.02)`
- กดปุ่ม: ยุบลง `scale(0.96)` (pop-down effect)
- Hover: ตัวอักษร + ไอคอนเปลี่ยนเป็นสีม่วง
- Spring animation: `cubic-bezier(0.34, 1.56, 0.64, 1)`

### Phase 6: Sidebar UX Improvements
- "ประกัน" สามารถกดเลือกได้โดยตรง โดยไม่ต้องเลือกเมนูย่อย
- ปุ่มกางเมนูตอน collapse: โลโก้ + ลูกศรขวารวมเป็นปุ่มเดียว (`logo-expand-btn`)
- ลดช่องว่างระหว่างโลโก้กับลูกศร (gap: 2px)

### Phase 7: Custom Logo
- ใช้โลโก้ ZPLogo.png สำหรับ Sidebar กาง
- ใช้โลโก้ ZPLogocollapse.png สำหรับ Sidebar หุบ
- Import เป็น image asset ใน React

### Phase 8: Profile-TopBar Sync
- ยก profile state จาก ProfilePage ขึ้นมาอยู่ที่ App.tsx (State Lifting)
- TopBar รับ `userName` และ `avatarUrl` จาก profile state
- เมื่อบันทึกโปรไฟล์ → ชื่อและรูปใน TopBar อัปเดตทันที

### Phase 9: หน้าสินทรัพย์ + Routing Sidebar
- เพิ่ม state-based routing ใน App.tsx (`activePage` state, `PageId` type)
- Sidebar ลบ internal `activeItem` state → ใช้ `activePage` + `onNavigate` props จาก App แทน
- TopBar รับ `pageTitle` แบบ dynamic + ปุ่ม back `<` (แสดงเมื่อไม่ใช่หน้าแรก)
- สร้าง DonutChart.tsx — pure SVG donut chart (circle + stroke-dasharray)
- สร้าง AssetPage.tsx — สินทรัพย์สุทธิ + สัดส่วน donut chart + ตารางรายการ
- Sidebar กดเมนู "สินทรัพย์" → เปลี่ยนหน้า, กด `<` → กลับหน้าโปรไฟล์
- ลบรายการในตาราง → ยอดรวม + donut chart อัปเดตอัตโนมัติ

### Phase 10: Modal เพิ่ม/แก้ไขสินทรัพย์
- สร้าง Modal ตามดีไซน์ "Asset - Add and Edit.png"
- ฟิลด์: รายการ (text), ประเภท (dropdown), สถาบันการเงิน (text), มูลค่า (number)
- กดปุ่ม "+ เพิ่มรายการสินทรัพย์" → เปิด Modal ว่าง → บันทึก → เพิ่มใน list
- กดปุ่ม edit (ปากกา) ในตาราง → เปิด Modal พร้อมข้อมูลเดิม → บันทึก → อัปเดตรายการ
- ปิด Modal ได้ทั้งปุ่ม X และกดพื้นหลัง overlay
- บันทึกแล้ว → ยอดรวม + donut chart + ตาราง อัปเดตอัตโนมัติ
- Animation: fade-in overlay + slide-up card

### Phase 11: Animation + Confirm Delete Modal
- **DonutChart Animation:** เพิ่ม CSS transition บน `<circle>` — `stroke-dasharray` + `stroke-dashoffset` animate 0.5s ease เมื่อข้อมูลเปลี่ยน (เพิ่ม/แก้ไข/ลบ) chart จะเคลื่อนไหวลื่น
- **Table Row Animation:** แถวใหม่ slide-in จากด้านบน (`rowSlideIn 0.35s`) แถวที่ถูกลบ fade-out ไปด้านขวา (`rowFadeOut 0.3s`) ก่อนจะถูกลบจริง
- **ConfirmModal Component:** สร้าง component หลักสำหรับยืนยันการลบ (`ConfirmModal.tsx` + `ConfirmModal.css`) — reusable ใช้ได้ทุกหน้า
  - Props: `isOpen`, `title?`, `message?`, `confirmLabel?`, `cancelLabel?`, `onConfirm`, `onCancel`
  - UI: ไอคอน warning สีแดง + หัวข้อ + ข้อความ + ปุ่มยกเลิก/ยืนยัน
  - Animation: fade-in overlay + slide-up card (เหมือน modal อื่นๆ)
- **Delete Flow:** กดปุ่มลบ → แสดง ConfirmModal "ยืนยันการลบ" → กดยืนยัน → row-exit animation → ลบจริงหลัง 300ms → chart อัปเดต
- **ไฟล์ใหม่:** `ConfirmModal.tsx`, `ConfirmModal.css`

### Phase 12: localStorage Persistence + react-router-dom
- **react-router-dom:** เปลี่ยนจาก state-based routing → URL-based routing
  - ติดตั้ง `react-router-dom` dependency
  - `main.tsx`: wrap `<App>` ด้วย `<BrowserRouter>`
  - `App.tsx`: ลบ `activePage` state, `PageId` type, `pageTitles` → ใช้ `useLocation()` + `useNavigate()` + `<Routes>/<Route>`
  - Route mapping: `/` → ProfilePage, `/assets` → AssetPage
  - Sidebar/TopBar ไม่ต้องแก้ — App derive `activePage` label จาก pathname
- **localStorage Persistence:** สร้าง custom hook `usePersistedState<T>` ใน `hooks/usePersistedState.ts`
  - ทำงานเหมือน `useState` แต่ sync กับ localStorage อัตโนมัติ
  - Profile data (`zettaplan_profile`) — persist ใน App.tsx
  - Asset data (`zettaplan_assets`) + nextId (`zettaplan_nextId`) — persist ใน AssetPage.tsx
  - รีเฟรชหน้าจะไม่ reset ข้อมูล
- **ไฟล์ใหม่:** `hooks/usePersistedState.ts`
- **ไฟล์ที่แก้:** `main.tsx`, `App.tsx`, `AssetPage.tsx`

### Phase 13: หน้าวางแผนเกษียณ (Retirement Plan)
- สร้างหน้า "วางแผนเกษียณ" ตามดีไซน์ "Retirement Plan.png"
- **Layout 2 คอลัมน์:** ซ้าย = การ์ดคำนวณ (4 ฟิลด์ + ปุ่มแก้ไข), ขวา = 2 summary cards + area chart
- **ฟิลด์:** อายุปัจจุบัน, เกษียณที่อายุ, ใช้เงินหลังเกษียณ (บาท/เดือน), เงินเฟ้อ (%)
- **สูตร:** เงินในอนาคต = expense × (1 + inflation)^years, เงินก้อน = futureMonthly × 12 × 25
- **Summary cards:** เงินใช้ต่อเดือน (ในอนาคต) + แผนเกษียณอายุ (สี teal, ขอบ teal)
- **AreaChart.tsx:** reusable SVG area chart (pure, ไม่ใช้ library) — gradient fill teal → transparent
- **Draft pattern:** กด "แก้ไขข้อมูล" → input fields → กดบันทึก → คำนวณใหม่ + chart อัปเดต
- **Persist:** `zettaplan_retirement` ใน localStorage
- **Routing:** `/retirement` → RetirementPage, เพิ่ม mapping ใน App.tsx
- **ไฟล์ใหม่:** `AreaChart.tsx`, `RetirementPage.tsx`, `RetirementPage.css`

### Phase 13.5: AreaChart Tooltip + Input Fix
- **AreaChart Tooltip:** เพิ่ม hover interactivity บน AreaChart — invisible hit area ต่อ data point, แสดง vertical guide line + dot + tooltip (อายุ X ปี / X บาท), tooltip flip ไปด้านซ้ายเมื่อใกล้ขอบขวา, `onMouseLeave` clear tooltip
- **Input Fix:** เปลี่ยน draft state ใน RetirementPage จาก `RetirementData` (number) → `Record<keyof RetirementData, string>` (string) เพื่อให้ผู้ใช้ลบตัวเลขจนว่างได้ ค่า parse เป็น number เฉพาะตอนบันทึก (empty → 0)
- **ไฟล์ที่แก้:** `AreaChart.tsx`, `RetirementPage.tsx`

### Phase 14: หน้าเป้าหมายการเงิน (Financial Goals)
- สร้างหน้า "เป้าหมายการเงิน" ตามดีไซน์ "Goal.png" + "Goal - Add and Edit.png"
- **Layout:** ปุ่ม "เพิ่มเป้าหมาย" (ม่วง) + grid **3 คอลัมน์** สำหรับ goal cards
- **Goal Card:** ชื่อเป้าหมาย + ปุ่มลบ, badge ระยะเวลา, เป้าหมาย/มีอยู่แล้ว, กล่อง highlight ม่วง "เงินที่ต้องเก็บเดือนละประมาณ X บาท", ปุ่มแก้ไข
- **สูตร:** Future Value of Annuity — `PMT = gap / ((1+r)^n - 1) × r` สำหรับคำนวณเงินออมต่อเดือน
- **Modal:** เพิ่ม/แก้ไขเป้าหมาย — ชื่อ, จำนวนเงิน+เงินออม (2 col), ระยะเวลา+Return (2 col)
- **ConfirmModal:** reuse จาก AssetPage สำหรับยืนยันลบ
- **Persist:** `zettaplan_goals`, `zettaplan_goals_nextId` ใน localStorage
- **Routing:** `/goals` → GoalPage, เพิ่ม mapping ใน App.tsx
- **Responsive:** 3 col > 1024px, 2 col ≤ 1024px, 1 col ≤ 768px
- **ไฟล์ใหม่:** `GoalPage.tsx`, `GoalPage.css`
- **ไฟล์ที่แก้:** `App.tsx`

### Phase 15: หน้าประกันภาพรวม (Insurance Overview)
- สร้างหน้า "ประกัน" ตามดีไซน์ "Insurance Overview.png"
- **Layout:** grid 2 คอลัมน์ (ซ้าย=ยอดรวม+จำแนก, ขวา=DonutChart+Legend) + ตารางรายการประกัน
- **ข้อมูล:** รวมจากประกันชีวิต + ประกันสุขภาพ (ปัจจุบันใช้ shared localStorage `zettaplan_insurance`)
- **ส่วนบนซ้าย:** ประกันรวมทั้งหมด (ทุนประกัน ม่วงตัวใหญ่) + เบี้ยประกันทั้งหมด + จำแนกตามทุนประกัน (จุดสี+%)
- **ส่วนบนขวา:** DonutChart (reuse) แสดง Life (น้ำเงิน) / Health (เขียว) + Legend
- **ตาราง:** ประเภท | บริษัท | ทุนประกันรวม (บาท) | เบี้ยประกัน (บาท)
- **Routing:** "ประกัน" → `/insurance`, "ประกันชีวิต" + "ประกันสุขภาพ" → `/insurance` (ชั่วคราว)
- **Persist:** `zettaplan_insurance` ใน localStorage
- **Export:** `InsuranceType`, `InsuranceItem` types สำหรับ sub-pages ในอนาคต
- **ไฟล์ใหม่:** `InsurancePage.tsx`, `InsurancePage.css`
- **ไฟล์ที่แก้:** `App.tsx`

### Phase 16: หน้าประกันชีวิต (Life Insurance)
- สร้างหน้า "ประกันชีวิต" ตามดีไซน์ "Insurance - Life.png" + "Insurance - Life - Add Case.png" + "Insurance - Life - Edit.png"
- **Banner:** gradient ม่วงเข้ม แสดงช่องว่างความคุ้มครอง (gap) + progress bar + %, เปลี่ยนเป็น gradient เขียวเมื่อ gap ≤ 0 (ครอบคลุมแล้ว)
- **ตารางกรมธรรม์:** รหัสแบบ | บริษัท | ทุนประกัน | เบี้ยรายปี | ลบ + ปุ่ม "เพิ่มประกันชีวิต"
- **Modal เพิ่มเคส:** ตาราง checkbox multi-select จากรายการเคสที่มี (7 เคส AIA) พร้อม select-all toggle, sticky header
- **Bottom Grid (2 คอลัมน์):**
  - ซ้าย "ภาระและความจำเป็น": 4 ฟิลด์ (ค่าใช้จ่าย/เดือน, ทุนการศึกษาบุตร, ค่าดูแลครอบครัว, ค่าใช้จ่ายสุดท้าย) + รวม (แดง) + view/edit mode
  - ขวา "ทรัพย์สินที่มีอยู่": 3 ฟิลด์ (เงินสด/เงินฝาก, สินทรัพย์ลงทุน, ประกันชีวิตที่มีอยู่) + รวม (ม่วง) + view/edit mode
- **คำนวณ:** `gap = totalNeed - totalAsset - totalPolicyCoverage`
- **Draft pattern:** bottom cards มี edit mode อิสระ (needs/assets แยกกัน) ใช้ string draft values, parse เป็น number ตอนบันทึก
- **ConfirmModal:** reuse สำหรับยืนยันลบกรมธรรม์
- **Persist:** `zettaplan_life_policies`, `zettaplan_life_nextId`, `zettaplan_life_needs`, `zettaplan_life_assets` ใน localStorage
- **Routing:** "ประกันชีวิต" → `/insurance/life` (เปลี่ยนจากชั่วคราว → ชี้ไปที่ LifeInsurancePage)
- **ไฟล์ใหม่:** `LifeInsurancePage.tsx`, `LifeInsurancePage.css`
- **ไฟล์ที่แก้:** `App.tsx`

### Phase 16.5: LifeInsurance Refactor — Dynamic Needs + Read-only Assets + Scroll Limits
- **ตารางประกันชีวิต:** เพิ่ม max-height + scroll (limit 3 rows visible), sticky thead
- **Card ทรัพย์สินที่มีอยู่:** เปลี่ยนเป็น **read-only** — ดึงข้อมูลจาก `zettaplan_assets` (หน้าสินทรัพย์) แบบ `localStorage.getItem()` ตรง, ลบ edit mode + ลบ `AssetsData` interface, แสดงเป็น cards (ชื่อ + ประเภท + มูลค่า), limit 4 items + scroll
- **Card ภาระและความจำเป็น:** เปลี่ยนจาก fixed fields (`NeedsData`) → **dynamic list** (`NeedItem[]` — id + name + amount), edit mode เพิ่ม/ลบ/แก้ไขเป็น blocks (ชื่อรายการ + จำนวนเงิน + ปุ่มลบ) + ปุ่ม "+ เพิ่มความจำเป็น", limit 2 blocks + scroll
- **Banner:** ไม่เปลี่ยนสีพื้นหลังเมื่อ covered (gradient ม่วงเข้มเหมือนกัน), เปลี่ยนแค่ข้อความ + progress bar สีเขียว
- **localStorage keys เปลี่ยน:** `zettaplan_life_needs` → `zettaplan_life_needs_v2` (schema เปลี่ยนจาก object → array), เพิ่ม `zettaplan_life_needs_nextId`, ลบ `zettaplan_life_assets`
- **ไฟล์ที่แก้:** `LifeInsurancePage.tsx`, `LifeInsurancePage.css`

### Phase 16.6: Assets Hint Link
- **Card ทรัพย์สินที่มีอยู่:** คำว่า "สินทรัพย์" ในข้อความ hint เปลี่ยนเป็น `<Link>` สีม่วง (primary) + ขีดเส้นใต้ เชื่อมไปยังหน้าสินทรัพย์ (`/assets`)
- **Import เพิ่ม:** `Link` จาก `react-router-dom`
- **CSS เพิ่ม:** `.life-assets-link` (color: primary, text-decoration: underline)
- **ไฟล์ที่แก้:** `LifeInsurancePage.tsx`, `LifeInsurancePage.css`

### Phase 16.8: Table Row Compact — ลด Padding ทั้งระบบ
- **ลด row padding ของตารางทุกหน้า** ให้แถวแคบลง:
  - `th`: `12px 16px` → `6px 16px`
  - `td`: `14px 16px` → `8px 16px`
  - `.life-case-table th/td`: `10px 12px` → `5px 12px`
- **ไฟล์ที่แก้:** `AssetPage.css`, `InsurancePage.css`, `LifeInsurancePage.css`

### Phase 16.7: Insurance Overview — ดึงข้อมูลจาก LifeInsurancePage
- **InsurancePage (ภาพรวม):** เปลี่ยนจากใช้ข้อมูล mock ทั้งหมด (`zettaplan_insurance`) → ดึงข้อมูลประกันชีวิตจาก `zettaplan_life_policies` (หน้าประกันชีวิต) แบบ read-only
- **แถวประกันชีวิต:** รวม coverage + premium ของกรมธรรม์ทั้งหมดจาก LifeInsurancePage เป็นแถวเดียว, company แสดง unique companies (join ด้วย `,`)
- **แถวประกันสุขภาพ:** ยังคงมาจาก `zettaplan_insurance` (กรองเฉพาะ type = ประกันสุขภาพ)
- **Donut chart + summary:** คำนวณจากข้อมูลรวมจริง (life + health)
- **ไฟล์ที่แก้:** `InsurancePage.tsx`

### Phase 16.9: ลบเมนู "ภาพรวม" ออกจาก Sidebar
- **Sidebar:** ลบ `{ icon: 'dashboard', label: 'ภาพรวม' }` ออกจาก `navSections` (MENU section)
- **ไฟล์ที่แก้:** `Sidebar.tsx`

### Phase 17: หน้าประกันสุขภาพ (Health Insurance)
- สร้างหน้า "ประกันสุขภาพ" ตามดีไซน์ "Insurance - Health.png" + "Insurance - Health - Add Case.png" + "Insurance - Health - Edit.png"
- **ตารางกรมธรรม์:** รหัสประกัน | บริษัท | ทุนประกัน | เบี้ยประกัน | ลบ + ปุ่ม "เพิ่มประกันสุขภาพ"
- **Modal เพิ่มเคส:** ตาราง checkbox multi-select จากรายการเคสที่มี (7 เคส AIA) พร้อม select-all toggle
- **Bottom Grid (2 คอลัมน์):**
  - ซ้าย "ข้อมูลความคุ้มครองเดิม": ค่าห้องต่อคืน, วงเงินเหมาจ่ายต่อปี, ค่ารักษาผู้ป่วยนอก + view/edit mode (draft pattern)
  - ขวา "จำลองเปรียบเทียบกับค่ารักษามาตรฐาน": dropdown เลือกระดับ (ทั่วไป/กลาง/สูง) + progress bars เปรียบเทียบ 3 รายการ (เขียว=ผ่าน, แดง=ไม่ถึงเป้า)
- **InsurancePage:** ดึงข้อมูลประกันสุขภาพจาก `zettaplan_health_policies` (หน้าประกันสุขภาพ) แบบ read-only เพื่อรวมใน overview
- **Routing:** "ประกันสุขภาพ" → `/insurance/health` (เปลี่ยนจากชั่วคราว → ชี้ไปที่ HealthInsurancePage)
- **Persist:** `zettaplan_health_policies`, `zettaplan_health_nextId`, `zettaplan_health_coverage` ใน localStorage
- **ไฟล์ใหม่:** `HealthInsurancePage.tsx`, `HealthInsurancePage.css`
- **ไฟล์ที่แก้:** `App.tsx`, `InsurancePage.tsx`

### Phase 18: หน้าพอร์ตแนะนำ (Portfolio AI)
- สร้างหน้า "พอร์ตแนะนำ" ตามดีไซน์ "Portfolio AI.png" + "Portfolio AI - Edit.png"
- **Sidebar:** เปลี่ยนชื่อเมนู "พอร์ตลงทุน" → "พอร์ตแนะนำ"
- **Banner:** gradient ม่วง (primary) แสดง "พอร์ตที่แนะนำจาก AI" (สีเหลือง) + "AIA 5 Years Plan" (ขาว)
- **Middle Grid (2 คอลัมน์):**
  - ซ้าย: DonutChart (ตราสารหนี้ 40% / หุ้นไทย 25% / หุ้นต่างประเทศ 20% / อสังหาฯ 15%) + Legend
  - ขวา: รายละเอียดพอร์ต (description + กล่อง CAGR 5-8%)
- **Bottom Grid (2 คอลัมน์):**
  - ซ้าย "จำลองการลงทุน": เงินลงทุนเริ่มต้น, ออมเพิ่มต่อเดือน, ผลตอบแทน, ระยะเวลา + view/edit mode (draft pattern)
  - ขวา: AreaChart (compound growth — FV initial + FV annuity)
- **Routing:** "พอร์ตแนะนำ" → `/portfolio`
- **Persist:** `zettaplan_portfolio` ใน localStorage
- **ไฟล์ใหม่:** `PortfolioPage.tsx`, `PortfolioPage.css`
- **ไฟล์ที่แก้:** `App.tsx`, `Sidebar.tsx`

### Phase 19: หน้าวางแผนภาษี (Tax Plan — Basic + Advanced)
- สร้างหน้า "วางแผนภาษี" ตามดีไซน์ 4 ภาพ: Basic, Basic-Edit, Advanced, Advanced-Edit
- **Dropdown สลับโหมด:** "ขั้นพื้นฐาน" ↔ "ขั้นสูง" — เปลี่ยนโหมดจะยกเลิก edit mode อัตโนมัติ
- **ขั้นพื้นฐาน (Basic):**
  - 2 ฟิลด์: รายได้ทั้งปี + ค่าลดหย่อนรวม
  - Persist: `zettaplan_tax`
- **ขั้นสูง (Advanced):**
  - 6 ฟิลด์: รายได้ทั้งปี, ประกันสังคม, กองทุนสำรองเลี้ยงชีพ, RMF/SSF/ThaiESG, เบี้ยประกันชีวิต/สุขภาพ, อื่นๆ
  - View mode: แสดงแบบ horizontal rows (label ซ้าย, value ขวา) + แถวรวมลดหย่อน (auto-sum)
  - Persist: `zettaplan_tax_adv`
- **Result Card:** dark gradient — ภาษีโดยประมาณ + เงินได้สุทธิ + อัตราภาษี (คำนวณตามโหมดที่เลือก)
- **ตารางฐานภาษี:** 8 ขั้น + **badge "คุณอยู่ขั้นนี้"** แสดงขั้นภาษีสูงสุดที่ผู้ใช้เข้าถึง (highlight ม่วง + border-left)
- **Routing:** "วางแผนภาษี" → `/tax`
- **ไฟล์ที่แก้:** `TaxPlanPage.tsx`, `TaxPlanPage.css`

### Phase 20: หน้าดูรายงาน + PDF Viewer (Dashboard + PDF Export)
- สร้างหน้า "ดูรายงาน" (Dashboard) ตามดีไซน์ "Dashboard.png"
- **DashboardPage:** อ่านข้อมูลจาก localStorage ทุก key (assets, retirement, goals, lifePolicies, healthPolicies, lifeNeeds, taxData, portData) แบบ read-only
- **Row 1:** สินทรัพย์สุทธิ (คลิกไปหน้าสินทรัพย์) + แจ้งเตือน (ประกันชีวิต/ภาษี/พอร์ต) + Radar Chart (SVG pure, 5 มิติ)
- **Row 2:** Donut Chart สัดส่วนสินทรัพย์ + Legend แสดงจำนวนเงิน + Area Chart แนวโน้ม 10 ปี
- **Row 3:** Summary Grid 6 cards (เกษียณ/เป้าหมาย/ประกันชีวิต/ประกันสุขภาพ/ภาษี/พอร์ต) แต่ละ card: icon gradient + ค่า + badge — คลิก navigate ไปหน้าที่เกี่ยวข้อง
- **ตาราง:** สินทรัพย์สูงสุด top 3
- **Export PDF:** ปุ่มม่วงซ้ายบน → navigate ไป `/report/pdf`
- **PdfViewerPage:** standalone page (ไม่มี sidebar/topbar), dark header bar + zoom +/- + ปุ่ม Download
- **PDF Body:** กระดาษ A4 สีขาว — header (ชื่อ planner), summary boxes, แผนเกษียณ, เป้าหมาย (FV table), สินทรัพย์ table, footer วันที่ (พ.ศ.)
- **PDF Download:** dynamic import `html2canvas` + `jsPDF` → canvas → PDF file
- **Dependencies เพิ่ม:** `jspdf` ^4.1.0, `html2canvas` ^1.4.1
- **Routing:** `/dashboard` → DashboardPage (ใน layout), `/report/pdf` → PdfViewerPage (standalone, early return ใน App.tsx)
- **Sidebar:** "ดูรายงาน" อยู่ใน MORE section แล้ว → เชื่อม route
- **ไฟล์ใหม่:** `DashboardPage.tsx`, `DashboardPage.css`, `PdfViewerPage.tsx`, `PdfViewerPage.css`
- **ไฟล์ที่แก้:** `App.tsx`, `package.json`

### Phase 20.5: Dashboard Enhancement — Summary Cards + Animation + Coverage Fix
- **Dashboard:** เปลี่ยนหัวข้อจาก "ภาพรวม" → "ดูรายงาน" (ใน routeTitles)
- **Summary Cards:** แต่ละ Card แสดงผลจากแต่ละหน้าใน Sidebar (6 cards)
- **สัดส่วนสินทรัพย์:** Donut legend แสดงจำนวนเงินแต่ละประเภท
- **แจ้งเตือน:** แสดงผลจากหน้า ประกันชีวิต (coverage gap), ภาษี (tax amount), พอร์ตแนะนำ (FV) — 3 ระดับ: danger/warning/success
- **Animation:** cards `cardSlideUp` + stagger, alerts `rowSlideIn` + stagger, radar `radarDraw` + dots `popIn`, summary values `valueFadeIn`, badges `popIn`
- **Coverage Gap Fix:** แก้สูตร `lifeCoverageGap = totalNeed - totalAsset - totalCoverage` ให้ sync กับ LifeInsurancePage (ก่อนหน้าใช้ `+totalAsset` ผิด)
- **ไฟล์ที่แก้:** `DashboardPage.tsx`, `DashboardPage.css`, `PdfViewerPage.tsx`, `App.tsx`

### Phase 20.6: Radar Chart Safe Area + Responsive Scaling
- **RadarChart (Dashboard):** ขยาย SVG viewBox ให้ label ไม่ถูกตัด (เช่น "การออม") โดยเพิ่ม padding 48px รอบ chart
- **เปลี่ยนจาก:** fixed `size = 260, maxR = 100` → `pad = 48, maxR = 110, viewBox = (pad + maxR) * 2 = 316`
- **Labels:** ย้ายจาก `maxR + 22` → `maxR + 28`, fontSize 12→13, fontWeight 500→600
- **Responsive:** ลบ fixed `width/height` attributes, ใช้ `viewBox` + CSS `width: 100%; height: auto` ให้ chart ขยายเต็มการ์ด
- **ไฟล์ที่แก้:** `DashboardPage.tsx`, `DashboardPage.css`

### Phase 20.7: PDF Viewer — A4 Pagination + Page Sidebar
- **PdfViewerPage:** เขียนใหม่ทั้งหมด รองรับ A4 multi-page pagination
- **A4 Dimensions:** `794 × 1123 px` (210mm × 297mm at 96dpi)
- **Pagination Algorithm:** hidden measurement container วัดความสูงแต่ละ section → แจกจ่ายเข้าหน้า A4 (usable = 1011px)
- **Page Sidebar (140px):** thumbnail + เลขหน้า, active state ม่วง, คลิกเพื่อ scroll ไปหน้านั้น
- **Active Page Tracking:** `handleScroll()` ติดตามหน้าที่กำลังดูจาก scroll position
- **Multi-page PDF Download:** วน loop `.pdf-page` → `html2canvas` per page → `jsPDF.addPage()`
- **Section Blocks (10):** header, summary, assets, retirement, goals, life-insurance, health-insurance, tax, investment, footer
- **Top Bar:** เพิ่ม page indicator "หน้า X / Y"
- **Responsive:** sidebar 100px ที่ 900px, ซ่อนที่ 768px
- **ไฟล์ที่แก้:** `PdfViewerPage.tsx`, `PdfViewerPage.css`

### Phase 20.8: Scroll-to-top + DonutChart Hover Tooltip
- **Scroll-to-top:** เพิ่ม `useEffect` ใน App.tsx — ทุกครั้งที่เปลี่ยน `location.pathname` จะ scroll ทั้ง `window` และ `.main` container ไปด้านบนสุด
- **DonutChart Hover Tooltip:** เพิ่ม interactivity เมื่อ hover segment:
  - `strokeWidth` เพิ่มขึ้น 6px + `brightness(1.1)` filter
  - แสดง tooltip ตรงกลางวงกลม: ชื่อ label (11px, gray) + จำนวนเงิน (14px, bold)
  - ถ้าไม่มี `amount` prop → fallback แสดง % แทน
  - Transition: `stroke-width 0.2s ease`
- **DonutSegment interface:** เพิ่ม `amount?: number` (optional, backward compatible)
- **ส่ง amount ไปทุกหน้า:**
  - AssetPage: `amount: cat.total`
  - InsurancePage: `amount: t.total`
  - DashboardPage: `amount: val` (มีอยู่แล้ว)
  - PortfolioPage: ไม่มีข้อมูลจำนวนเงิน → fallback แสดง %
- **PDF Viewer goToPage:** แก้ให้ scroll container ไปยังตำแหน่งที่ถูกต้อง (ใช้ `container.scrollTo` แทน `scrollIntoView`)
- **ไฟล์ที่แก้:** `App.tsx`, `DonutChart.tsx`, `AssetPage.tsx`, `InsurancePage.tsx`, `PdfViewerPage.tsx`

### Phase 20.9: DonutChart Safe Area — ป้องกัน Hover Clipping
- **ปัญหา:** เมื่อ hover segment จะขยาย strokeWidth +6px (3px ทิศละด้าน) แต่ SVG viewBox ไม่มีที่เหลือ → วงถูกตัดขอบ
- **แก้ไข:** เพิ่ม `pad = 6` ใน DonutChart — ขยาย viewBox เป็น `size + pad*2` และเลื่อน center เป็น `size/2 + pad`
- **ผลลัพธ์:** SVG มี safe area 6px รอบ chart → hover expansion ไม่ถูก clipped ทุกหน้า (AssetPage, InsurancePage, DashboardPage, PortfolioPage)
- **ไฟล์ที่แก้:** `DonutChart.tsx`

### Phase 21: Favicon + App Title
- **Favicon:** เปลี่ยนจาก Vite default (`vite.svg`) → โลโก้ ZettaPlan (`LogoZP.png` → `public/favicon.png`)
- **App Title:** เปลี่ยนจาก "ZettaPlan - ข้อมูลส่วนตัว" → "ZettaPlan - Financial Planning"
- **ไฟล์ที่แก้:** `index.html`
- **ไฟล์ใหม่:** `public/favicon.png`

---

## Key Design Patterns

### 1. State Lifting
Profile data อยู่ที่ App.tsx เป็น Single Source of Truth ส่งลง TopBar (ชื่อ+รูป) และ ProfilePage (ข้อมูลทั้งหมด+callback) เมื่อบันทึกจะ update ทั้งหน้า

### 2. Draft Pattern (Edit Mode)
เมื่อเข้าโหมดแก้ไข คัดลอก profile → draft แก้ไขใน draft เท่านั้น กด "บันทึก" จึงส่ง draft ไปอัปเดต profile จริง กด "ยกเลิก" ทิ้ง draft

### 3. Native File Upload
ใช้ hidden `<input type="file" accept="image/*">` + `URL.createObjectURL()` สำหรับ preview รูปก่อนบันทึก ไม่ต้องใช้ library เพิ่มเติม

### 4. Component-based Architecture
แต่ละส่วน UI แยกเป็น component อิสระ สื่อสารผ่าน props เท่านั้น ง่ายต่อการ maintain และ reuse

### 5. URL-based Routing (react-router-dom)
ใช้ `react-router-dom` (`BrowserRouter` + `Routes`/`Route` + `useNavigate` + `useLocation`) สำหรับ routing — URL สะท้อนหน้าปัจจุบัน (`/` = โปรไฟล์, `/assets` = สินทรัพย์) พิมพ์ URL ตรงได้ Sidebar ส่ง `onNavigate` callback → App แปลงชื่อเมนูเป็น path ผ่าน `navRoutes` mapping → `navigate(path)` เมนูที่ยังไม่ implement จะไม่เปลี่ยน URL (guard ใน `handleNavigate`)

### 6. Pure SVG Charts
DonutChart ใช้ SVG `<circle>` + `stroke-dasharray` technique — ไม่ต้อง install charting library รองรับ dynamic data (ลบรายการ → chart อัปเดตทันที) พร้อม CSS transition 0.5s ease สำหรับ smooth animation เมื่อข้อมูลเปลี่ยน + hover tooltip แสดง label + จำนวนเงิน ตรงกลาง (optional `amount` prop, fallback แสดง %)

### 7. Reusable Confirm Modal
ConfirmModal เป็น component กลางสำหรับยืนยันก่อนลบข้อมูล — ใช้ได้ทุกหน้าผ่าน props (`isOpen`, `onConfirm`, `onCancel`) รองรับ custom title/message/label

### 8. localStorage Persistence (usePersistedState)
Custom hook `usePersistedState<T>(key, default)` ทำหน้าที่เหมือน `useState` แต่ sync กับ localStorage อัตโนมัติ — โหลดจาก localStorage เมื่อ mount, บันทึกทุกครั้งที่ state เปลี่ยน, fallback เป็น default ถ้า parse ล้มเหลว ใช้สำหรับ profile data + asset data

---

## Notes สำหรับการพัฒนาต่อ

- Routing ใช้ react-router-dom — เพิ่มหน้าใหม่ด้วยการเพิ่ม Route + เพิ่ม mapping ใน `routeTitles`, `navRoutes`, `pathToLabel`
- ทุกหน้าใน Sidebar implement แล้ว รวมถึง "ดูรายงาน" (Dashboard) + PDF Viewer
- `/report/pdf` เป็น standalone page — render นอก layout (ไม่มี sidebar/topbar) ผ่าน early return ใน App.tsx
- ข้อมูล persist ด้วย localStorage — **ยังไม่เชื่อมต่อ API/Backend** (mock data + localStorage เท่านั้น)
- การอัปโหลดรูปใช้ `createObjectURL` (local preview เท่านั้น) — ยังไม่อัปโหลดไปยัง server (รูป avatar ไม่ persist เมื่อรีเฟรชถ้าเป็น blob URL)
- ProfileCard.tsx form labels บางตัว ("ชื่อเล่น") ซ้ำกัน — ควรแก้เป็น "ตำแหน่ง" และ "บริษัท" ตามลำดับ
- ยังไม่มี form validation
- ยังไม่มี loading state / toast notification
- **สูตรความคุ้มครอง (ประกันชีวิต):** ต้องใช้ `gap = totalNeed - totalAsset - totalPolicyCoverage` ทุกที่ (DashboardPage, PdfViewerPage, LifeInsurancePage) — ถ้า gap ≤ 0 หมายถึง "ครอบคลุมแล้ว"
- localStorage keys: `zettaplan_profile`, `zettaplan_assets`, `zettaplan_nextId`, `zettaplan_retirement`, `zettaplan_goals`, `zettaplan_goals_nextId`, `zettaplan_insurance`, `zettaplan_life_policies`, `zettaplan_life_nextId`, `zettaplan_life_needs_v2`, `zettaplan_life_needs_nextId`, `zettaplan_health_policies`, `zettaplan_health_nextId`, `zettaplan_health_coverage`, `zettaplan_portfolio`, `zettaplan_tax`, `zettaplan_tax_adv`
