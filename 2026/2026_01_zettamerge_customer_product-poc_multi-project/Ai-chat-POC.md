# AI Chat POC - Dental Plus

## Overview

ระบบ AI Chatbot สำหรับคลินิกทันตกรรม Dental Plus ใช้ Gemini AI + Vector Search (pgvector)

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────┐
│   Frontend      │────▶│    Backend      │────▶│  PostgreSQL         │
│   (React)       │     │    (Go)         │     │  + pgvector         │
│   port 5173     │     │    port 8080    │     │  port 5433 (Docker) │
└─────────────────┘     └────────┬────────┘     └─────────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Gemini AI     │
                        │   (Google)      │
                        └─────────────────┘
```

---

## Flow การทำงาน

### 1. User ส่งข้อความ

```
User → Frontend → POST /api/chat → Backend
```

### 2. Backend ประมวลผล

```go
// handlers/ai_chat.go - HandleChat()

1. รับ message จาก user
2. เตรียม tools (MCP Tools) สำหรับ Gemini:
   - search_faq        : ค้นหา FAQ
   - get_doctor_schedule : ดูตารางหมอ
   - get_promotions    : ดูโปรโมชัน
   - get_branch_info   : ข้อมูลสาขา
3. ส่งไปยัง Gemini API พร้อม system prompt
```

### 3. Gemini ตัดสินใจ

```
Gemini วิเคราะห์คำถาม → เลือกใช้ tool ที่เหมาะสม

ตัวอย่าง:
- "ราคาจัดฟัน" → เรียก search_faq
- "หมอวันไหนว่าง" → เรียก get_doctor_schedule
- "มีโปรอะไรบ้าง" → เรียก get_promotions
```

### 4. Vector Search (search_faq)

```go
// services/gemini.go - SearchSimilarFAQs()

1. สร้าง embedding จากคำถาม user (Gemini Embedding API)
2. ค้นหา FAQ ที่ใกล้เคียงด้วย cosine distance:

   SELECT id, question, answer,
          1 - (embedding <=> query_embedding) as similarity
   FROM faqs
   WHERE embedding IS NOT NULL
   ORDER BY embedding <=> query_embedding
   LIMIT 3

3. ถ้า embedding ไม่พร้อม → fallback เป็น text search (ILIKE)
```

### 5. ส่งผลลัพธ์กลับ Gemini

```
Tool Result → Gemini → สร้างคำตอบภาษาไทย → User
```

---

## Database Schema

### faqs (FAQ พร้อม Vector)

```sql
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    views INTEGER DEFAULT 0,
    embedding vector(768),  -- pgvector
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

### doctor_schedules

```sql
CREATE TABLE doctor_schedules (
    id SERIAL PRIMARY KEY,
    doctor_name VARCHAR(100),
    branch VARCHAR(100),
    day_of_week INTEGER,  -- 0=อาทิตย์, 1=จันทร์, ...
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN
);
```

### promotions

```sql
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    discount_percent INTEGER,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN
);
```

---

## API Endpoints

| Method | Endpoint                   | Description                              |
| ------ | -------------------------- | ---------------------------------------- |
| POST   | `/api/chat`                | ส่งข้อความ chat                          |
| POST   | `/api/embeddings/generate` | สร้าง embedding สำหรับ FAQ ทั้งหมด       |
| GET    | `/api/faqs`                | ดึง FAQ ทั้งหมด                          |
| POST   | `/api/faqs`                | สร้าง FAQ ใหม่ (auto generate embedding) |
| GET    | `/api/categories`          | ดึง categories                           |
| GET    | `/api/settings`            | ดึง settings                             |
| GET    | `/health`                  | Health check                             |

---

## การ Setup

### 1. รัน PostgreSQL + pgvector

```bash
docker run -d --name dental-postgres-vector \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=dental_faq \
  -p 5433:5432 \
  pgvector/pgvector:pg17
```

### 2. ตั้งค่า .env

```
DATABASE_URL=postgres://postgres:1234@localhost:5433/dental_faq?sslmode=disable
PORT=8080
GEMINI_API_KEY=your_api_key_here
```

### 3. รัน Backend

```bash
cd dental-plus-api
go run main.go
```

### 4. รัน Frontend

```bash
cd dental-plus-react
bun dev
```

### 5. เปิดทดสอบ

- Frontend: http://localhost:5173/chat
- Backend: http://localhost:8080

---

## Tech Stack

| Component | Technology                 |
| --------- | -------------------------- |
| Frontend  | React + Vite + TailwindCSS |
| Backend   | Go + Chi Router            |
| Database  | PostgreSQL 17 + pgvector   |
| AI        | Google Gemini 2.5 Flash    |
| Embedding | Gemini text-embedding-004  |
| Container | Docker                     |

---

## Files สำคัญ

```
dental-plus-api/
├── main.go                    # Entry point
├── config/database.go         # DB connection + migrations
├── handlers/
│   ├── ai_chat.go            # Chat handler + Gemini integration
│   └── faq.go                # FAQ CRUD
├── services/
│   ├── gemini.go             # Gemini API (chat + embedding)
│   └── mcp_tools.go          # MCP tools (doctor, promo, branch)
└── .env                      # Environment variables

dental-plus-react/
├── src/pages/HeadAdmin/
│   └── AIChatbot.tsx         # Chat UI
└── ...
```

---

## ข้อจำกัด (Free Tier)

1. **Gemini API**: 20 requests/minute/model
2. **Embedding Model**: อาจไม่พร้อมใช้งานใน free tier (fallback เป็น text search)

---

## ตัวอย่างการใช้งาน

**User**: "ราคาขูดหินปูนเท่าไหร่"

**Flow**:

1. Gemini เรียก `search_faq` พร้อม query
2. Vector search หา FAQ ที่ใกล้เคียง
3. พบ: "ค่าขูดหินปูนที่ Dental Plus เริ่มต้นที่ 800-1,500 บาท..."
4. Gemini สร้างคำตอบ: "ค่าขูดหินปูนเริ่มต้นที่ 800-1,500 บาทค่ะ ขึ้นอยู่กับปริมาณหินปูนและความซับซ้อนค่ะ"

**User**: "หมอสมศรีวันไหนว่าง"

**Flow**:

1. Gemini เรียก `get_doctor_schedule` พร้อม doctor_name="สมศรี"
2. Query จาก doctor_schedules table
3. Gemini สร้างคำตอบ: "ทพ.สมศรี ใจดี ออกตรวจที่สาขาสยาม วันจันทร์-พุธ 09:00-17:00 น. ค่ะ"
