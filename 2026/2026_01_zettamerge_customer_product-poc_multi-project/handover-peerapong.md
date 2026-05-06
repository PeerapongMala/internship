# Dental Plus - AI Chatbot Project Handover

## สรุปภาพรวมโปรเจกต์

โปรเจกต์ POC สำหรับระบบ AI Chatbot ของคลินิกทันตกรรม Dental Plus ประกอบด้วยระบบหลัก 2 ส่วน:
1. **AI Chatbot** - ระบบแชทอัจฉริยะสำหรับลูกค้า
2. **Chat Management System** - ระบบจัดการแชทสำหรับ Admin/Staff

---

## โครงสร้างโปรเจกต์

```
├── dental-plus-api/          # Backend API (Go + Chi Router)
├── dental-plus-react/        # Frontend React App (Vite + TypeScript + Tailwind)
├── 2026_01_-_dental-plus_ai-chat-bot/
│   ├── ai-test-poc/          # PoC เริ่มต้น (ไม่ใช้แล้ว)
│   ├── chat-mangement-poc/   # HTML Prototype ของ Chat Management
│   └── product_blueprint/    # เอกสาร Requirement & Blueprint
├── 2026_02_-_fujitsu_oms/    # โปรเจกต์ Fujitsu OMS (แยก scope)
├── AI-Chat-Flow-Summary.md   # เอกสาร flow การทำงาน AI Chat
├── Ai-chat-POC.md            # เอกสาร Architecture ของ POC
├── FAQ-flow.md               # เอกสาร flow ของระบบ FAQ
└── FAQ-summary.md            # สรุป feature FAQ ที่ implement แล้ว
```

---

## 1. Backend API (`dental-plus-api/`)

**Tech Stack:** Go 1.21+, Chi Router, PostgreSQL + pgvector, Google Gemini AI

### API Endpoints ที่มีอยู่

| Endpoint | Method | หน้าที่ |
|----------|--------|---------|
| `/api/faqs` | GET, POST | CRUD รายการ FAQ |
| `/api/faqs/{id}` | GET, PUT, DELETE | จัดการ FAQ รายตัว |
| `/api/faqs/{id}/view` | POST | นับจำนวนครั้งที่ดู FAQ |
| `/api/chat-questions` | GET, POST, DELETE | จัดการคำถามจากแชท |
| `/api/categories` | GET, POST, DELETE | จัดการหมวดหมู่ FAQ |
| `/api/settings` | GET, PUT | ตั้งค่าระบบ |
| `/api/chat` | POST | **AI Chat** - ส่งข้อความไป Gemini |
| `/api/embeddings/generate` | POST | สร้าง vector embeddings สำหรับ FAQ |
| `/health` | GET | Health check |

### AI Chat Flow
```
User Message → HandleChat → Gemini AI (พร้อม tools)
                                ↓
                    [Tool Call?] → Execute MCP Tool → DB Query
                                ↓
                    Gemini สร้างคำตอบ → Response กลับ User
```

### MCP Tools ที่ Gemini ใช้ได้
- `search_faq` - ค้นหา FAQ (รองรับ vector search + text fallback)
- `get_doctor_schedule` - ดูตารางหมอ
- `get_promotions` - ดูโปรโมชัน
- `get_branch_info` - ข้อมูลสาขา

### Database Tables
- `faqs` - FAQ พร้อม vector embeddings (768 dim)
- `faq_categories` - หมวดหมู่ FAQ
- `chat_questions` - คำถามจากลูกค้า (analytics)
- `settings` - ตั้งค่าระบบ
- `doctor_schedules` - ตารางหมอ
- `promotions` - โปรโมชัน

### การ Run
```bash
# ตั้งค่า .env (ดู .env.example)
# DATABASE_URL, GEMINI_API_KEY, PORT

go run main.go          # Development
go build -o dental-plus-api.exe  # Build
```

---

## 2. Frontend React (`dental-plus-react/`)

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Chart.js, Lucide Icons

### Pages ตาม Role

#### HeadAdmin (ผู้ดูแลระบบหลัก)
| Page | ไฟล์ | สถานะ |
|------|------|-------|
| Dashboard | `Dashboard.tsx` | มี mockup |
| FAQ Management | `FAQ.tsx` | ใช้งานได้ (mock data) |
| AI Chatbot Settings | `AIChatbot.tsx` | มี mockup |
| Quick Replies | `QuickReplies.tsx` | มี mockup |
| Message Logs | `MessageLogs.tsx` | มี mockup |
| Analytics | `Analytics.tsx` | มี mockup |
| Clinic | `Clinic.tsx` | มี mockup |
| Settings | `Settings.tsx` | มี mockup |

#### Admin (แอดมินสาขา)
| Page | ไฟล์ | สถานะ |
|------|------|-------|
| Chat Task Management | `ChatTaskManagement.tsx` | มี mockup |

#### Customer (ลูกค้า)
| Page | ไฟล์ | สถานะ |
|------|------|-------|
| AI Chat | `AIChat.tsx` | ใช้งานได้ (ต่อ API) |
| FAQ List | `FAQList.tsx` | ใช้งานได้ (mock data) |

#### Staff Clinic
| Page | ไฟล์ | สถานะ |
|------|------|-------|
| Clinic Branch | `ClinicBranch.tsx` | มี mockup |

#### Other
| Page | ไฟล์ | สถานะ |
|------|------|-------|
| Chat Management | `ChatManagement.tsx` | มี mockup |
| Chat Dispatch Center | `ChatDispatchCenter.tsx` | มี mockup |
| Dispatch | `Dispatch.tsx` | มี mockup |

### การ Run
```bash
cd dental-plus-react
npm install
npm run dev     # http://localhost:5173
```

---

## 3. สิ่งที่ทำเสร็จแล้ว

- [x] Architecture ของ AI Chat (Gemini + MCP Tools + pgvector)
- [x] Backend API CRUD สำหรับ FAQ, Categories, Chat Questions, Settings
- [x] AI Chat endpoint ที่ต่อ Gemini พร้อม tool calling
- [x] Vector embeddings สำหรับ semantic search FAQ
- [x] Frontend React ทุก page ตาม role (mockup + บางหน้า functional)
- [x] FAQ Management UI (3 tabs: รายการ, คำถามจากแชท, ตั้งค่า)
- [x] Customer AI Chat UI ต่อ Backend
- [x] Sidebar + Layout + Routing ทั้งหมด
- [x] HTML Prototype ทุกหน้า (อยู่ใน `chat-mangement-poc/`)
- [x] เอกสาร Flow, Architecture, Requirement

---

## 4. สิ่งที่ต้องทำต่อ

### Priority สูง
- [ ] เปลี่ยน mock data ใน React pages ให้ต่อ API จริง (เหลือหลายหน้า)
- [ ] ระบบ Authentication / Login (ยังไม่มี)
- [ ] Chat session management (เก็บประวัติแชท)
- [ ] ต่อ LINE / Facebook channel จริง

### Priority กลาง
- [ ] Dashboard analytics ต่อข้อมูลจริง
- [ ] Message Logs เก็บ log แชท
- [ ] Quick Replies management
- [ ] Chat Dispatch / Task Assignment ระหว่าง admin

### Priority ต่ำ
- [ ] Clinic branch management
- [ ] Settings ครบทุก feature
- [ ] AI ช่วยกรอก FAQ (ตอนนี้ simulate)

---

## 5. Environment ที่ต้องเตรียม

| รายการ | ค่า |
|--------|-----|
| PostgreSQL | ต้องมี pgvector extension |
| Gemini API Key | Google AI Studio |
| Node.js | 18+ |
| Go | 1.21+ |
| Port Backend | 8080 (default) |
| Port Frontend | 5173 (Vite default) |

---

## 6. Branch ที่เกี่ยวข้อง

| Branch | เจ้าของ | เนื้อหา |
|--------|---------|---------|
| `main` | - | Latest merged code |
| `user/p/Ai-chatbot-react` | P (Peerapong) | AI Chatbot + React frontend |
| `user/arm` | Arm | Fujitsu OMS |
| `user/bell/clinic-branch-*` | Bell | Clinic branch pages |

---

## 7. เอกสารที่ควรอ่าน

1. `Ai-chat-POC.md` - Architecture overview + flow diagram
2. `AI-Chat-Flow-Summary.md` - Step-by-step flow พร้อม line references
3. `FAQ-summary.md` - สรุป FAQ feature ที่ implement แล้ว
4. `FAQ-flow.md` - รายละเอียด FAQ flow
5. `dental-plus-api/CLAUDE.md` - Backend architecture guide
6. `dental-plus-api/README.md` - API documentation
7. `2026_01_-_dental-plus_ai-chat-bot/product_blueprint/` - Requirement docs
