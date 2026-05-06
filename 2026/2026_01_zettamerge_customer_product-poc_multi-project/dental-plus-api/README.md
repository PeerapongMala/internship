# Dental Plus API

API Backend สำหรับระบบแชทบอทคลินิกทันตกรรม Dental Plus ที่ใช้ Google Gemini AI

## คุณสมบัติหลัก

- 🤖 **AI Chatbot**: ตอบคำถามลูกค้าด้วย Google Gemini 2.5 Flash
- 🔍 **Vector Search**: ค้นหา FAQ แบบ semantic search ด้วย embeddings
- 🛠️ **MCP Tools**: เชื่อมต่อกับข้อมูลตารางหมอ, โปรโมชั่น, และข้อมูลสาขา
- 📝 **FAQ Management**: จัดการคำถามที่พบบ่อย (CRUD)
- 📊 **Analytics**: บันทึกคำถามของลูกค้าเพื่อวิเคราะห์

## เทคโนโลยีที่ใช้

- **Go 1.21+**: Backend framework
- **Chi Router**: HTTP router และ middleware
- **PostgreSQL**: ฐานข้อมูลพร้อม pgvector extension
- **Google Gemini**: AI model สำหรับ chat และ embeddings
- **pgx/v5**: PostgreSQL driver พร้อม connection pooling

## การติดตั้ง

### ความต้องการของระบบ

- Go 1.21 หรือสูงกว่า
- PostgreSQL 12+ พร้อม pgvector extension
- Google Gemini API Key

### ขั้นตอนการติดตั้ง

1. Clone repository

```bash
git clone <repository-url>
cd dental-plus-api
```

2. ติดตั้ง dependencies

```bash
go mod download
```

3. สร้างไฟล์ `.env` จาก `.env.example`

```bash
cp .env.example .env
```

4. แก้ไขไฟล์ `.env` ให้ตรงกับการตั้งค่าของคุณ

```env
DATABASE_URL=postgres://username:password@localhost:5432/dental_faq?sslmode=disable
PORT=8080
GEMINI_API_KEY=your_gemini_api_key_here
```

5. รันแอปพลิเคชัน

```bash
go run main.go
```

หรือ build แล้วรัน

```bash
go build -o dental-plus-api.exe
./dental-plus-api.exe
```

## ฐานข้อมูล

### การติดตั้ง pgvector

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Migration

ระบบจะทำ migration อัตโนมัติเมื่อเริ่มต้นแอปพลิเคชัน รวมถึง:
- สร้างตารางทั้งหมด
- ใส่ข้อมูลตัวอย่าง (หากตารางว่าง)

## API Endpoints

### Health Check

```
GET /health
```

ตรวจสอบสถานะของ API

### FAQs

```
GET    /api/faqs              - ดึงรายการ FAQ ทั้งหมด
POST   /api/faqs              - สร้าง FAQ ใหม่
GET    /api/faqs/{id}         - ดึง FAQ ตาม ID
PUT    /api/faqs/{id}         - อัปเดต FAQ
DELETE /api/faqs/{id}         - ลบ FAQ
POST   /api/faqs/{id}/view    - เพิ่มจำนวนการดู
```

### Chat Questions

```
GET    /api/chat-questions    - ดึงรายการคำถามจากแชท
POST   /api/chat-questions    - บันทึกคำถามใหม่
DELETE /api/chat-questions    - ลบคำถามหลายรายการ
DELETE /api/chat-questions/{id} - ลบคำถามตาม ID
```

### Categories

```
GET    /api/categories        - ดึงรายการหมวดหมู่
POST   /api/categories        - สร้างหมวดหมู่ใหม่
DELETE /api/categories/{id}   - ลบหมวดหมู่
```

### Settings

```
GET /api/settings             - ดึงการตั้งค่า
PUT /api/settings             - อัปเดตการตั้งค่า
```

### AI Chat

```
POST /api/chat                - ส่งข้อความถึง AI chatbot
POST /api/embeddings/generate - สร้าง embeddings สำหรับ FAQs
```

## การใช้งาน AI Chat

### ส่งข้อความ

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "user123",
    "message": "ขูดหินปูนราคาเท่าไหร่"
  }'
```

### Response

```json
{
  "response": "ค่าขูดหินปูนที่ Dental Plus เริ่มต้นที่ 800-1,500 บาท ขึ้นอยู่กับปริมาณหินปูนและความซับซ้อนค่ะ",
  "sources": [
    {
      "tool": "search_faq",
      "result": [...]
    }
  ],
  "tools_used": ["search_faq"]
}
```

## MCP Tools

AI สามารถเรียกใช้ tools เหล่านี้เพื่อดึงข้อมูล:

- **get_doctor_schedule**: ดึงตารางเวลาทำงานของหมอ
- **get_promotions**: ดึงโปรโมชั่นที่กำลังใช้งานอยู่
- **get_branch_info**: ดึงข้อมูลสาขา (ที่อยู่, เบอร์โทร, เวลาเปิด-ปิด)
- **search_faq**: ค้นหา FAQ ด้วย vector similarity

## Vector Embeddings

### สร้าง Embeddings สำหรับ FAQs

```bash
curl -X POST http://localhost:8080/api/embeddings/generate
```

ระบบจะ:
1. ดึง FAQs ที่ยังไม่มี embeddings
2. สร้าง embeddings ด้วย Gemini text-embedding-004
3. บันทึก vector ลงฐานข้อมูล

### Semantic Search

เมื่อ FAQs มี embeddings แล้ว การค้นหาจะใช้ cosine similarity แทน text search ทำให้:
- ค้นหาได้แม่นยำกว่า
- เข้าใจความหมายของคำถาม
- รองรับคำพ้องความหมาย

## โครงสร้างโปรเจค

```
dental-plus-api/
├── config/           # Database configuration และ migrations
├── handlers/         # HTTP request handlers
├── middleware/       # HTTP middleware (CORS, etc.)
├── models/           # Data models
├── services/         # Business logic (Gemini, MCP tools)
├── main.go          # Entry point
├── go.mod           # Go dependencies
└── .env.example     # ตัวอย่างการตั้งค่า environment variables
```

## Development

### รัน Tests

```bash
go test ./...
```

### Format Code

```bash
go fmt ./...
```

### Tidy Dependencies

```bash
go mod tidy
```

## การ Deploy

1. Build application

```bash
go build -o dental-plus-api
```

2. ตั้งค่า environment variables บน production
3. ตรวจสอบว่า PostgreSQL มี pgvector extension
4. รัน application

```bash
./dental-plus-api
```

## ข้อมูลตัวอย่าง

ระบบมีข้อมูลตัวอย่างที่จะถูกใส่อัตโนมัติเมื่อเริ่มต้นครั้งแรก:
- 4 หมวดหมู่ FAQ (ราคา, บริการ, การนัดหมาย, ทั่วไป)
- 5 FAQs ตัวอย่าง
- ตารางหมอ 3 คน ใน 3 สาขา
- 3 โปรโมชั่น

## Troubleshooting

### ฐานข้อมูลเชื่อมต่อไม่ได้

- ตรวจสอบว่า PostgreSQL ทำงานอยู่
- ตรวจสอบ DATABASE_URL ใน .env
- ตรวจสอบว่า database ถูกสร้างแล้ว

### pgvector extension หาไม่เจอ

```sql
-- เชื่อมต่อ PostgreSQL แล้วรัน
CREATE EXTENSION vector;
```

### Gemini API error

- ตรวจสอบว่า GEMINI_API_KEY ถูกต้อง
- ตรวจสอบโควต้า API ของคุณ
- ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต

## License

[ระบุ License ของโปรเจค]

## ติดต่อ

สำหรับคำถามหรือข้อเสนอแนะ โปรดติดต่อทีมพัฒนา
