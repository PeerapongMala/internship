# AI Chat Flow Summary - Dental Plus

## Overview
เอกสารนี้อธิบาย flow การทำงานของระบบ AI Chat ตั้งแต่ลูกค้าส่งข้อความจนได้รับคำตอบ

---

## Flow Diagram

```
Customer → Frontend (React) → POST /api/chat → Backend (Go) → Gemini AI
                                                    ↓
                                            [ถ้ามี Tool Call]
                                                    ↓
                                            Execute Tool → DB/Data
                                                    ↓
                                            Tool Result → Gemini → Response
```

---

## Step-by-Step Flow

### Step 1: ลูกค้าส่งข้อความ
**ตัวอย่าง:** ลูกค้าพิมพ์ "ราคาจัดฟันเท่าไหร่"

Frontend ส่ง POST request ไปยัง `/api/chat`:
```json
{
  "session_id": "xxx",
  "message": "ราคาจัดฟันเท่าไหร่"
}
```

---

### Step 2: Route เข้า Handler
📁 [dental-plus-api/main.go:68](./dental-plus-api/main.go#L68)
```go
r.Post("/chat", handlers.HandleChat)
```
Router รับ request แล้วส่งไป `HandleChat` function

---

### Step 3: HandleChat รับ Request
📁 [dental-plus-api/handlers/ai_chat.go:61-115](./dental-plus-api/handlers/ai_chat.go#L61-L115)

| Line | Action |
|------|--------|
| [Line 62](./dental-plus-api/handlers/ai_chat.go#L62) | `initServices()` - สร้าง GeminiService และ MCPTools |
| [Line 64-68](./dental-plus-api/handlers/ai_chat.go#L64-L68) | Parse JSON body เป็น ChatMessageRequest |
| [Line 78-80](./dental-plus-api/handlers/ai_chat.go#L78-L80) | เตรียม Tools (MCP Tools) สำหรับ Gemini |
| [Line 83-90](./dental-plus-api/handlers/ai_chat.go#L83-L90) | สร้าง messages array พร้อม user message |
| [Line 93](./dental-plus-api/handlers/ai_chat.go#L93) | เรียก `geminiService.Chat()` |

**Tools ที่พร้อมใช้งาน:**
📁 [dental-plus-api/services/mcp_tools.go:166-220](./dental-plus-api/services/mcp_tools.go#L166-L220)
- `search_faq` - ค้นหา FAQ
- `get_doctor_schedule` - ดูตารางหมอ
- `get_promotions` - ดูโปรโมชัน
- `get_branch_info` - ข้อมูลสาขา

---

### Step 4: เรียก Gemini API
📁 [dental-plus-api/services/gemini.go:235-281](./dental-plus-api/services/gemini.go#L235-L281)

| Line | Action |
|------|--------|
| [Line 236-245](./dental-plus-api/services/gemini.go#L236-L245) | สร้าง Request Body (contents, tools, systemInstruction) |
| [Line 247-257](./dental-plus-api/services/gemini.go#L247-L257) | สร้าง HTTP POST request ไปยัง Gemini API |
| [Line 259-264](./dental-plus-api/services/gemini.go#L259-L264) | ส่ง request และรับ response |
| [Line 275-278](./dental-plus-api/services/gemini.go#L275-L278) | Parse JSON response เป็น ChatResponse |

**Gemini API URL:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

**System Prompt:**
📁 [dental-plus-api/handlers/ai_chat.go:27-45](./dental-plus-api/handlers/ai_chat.go#L27-L45)
```
- ตอบเป็นภาษาไทยที่สุภาพ
- ใช้ tools ที่มีให้สำหรับข้อมูล dynamic
- ตอบสั้นกระชับ ไม่เกิน 3-4 ประโยค
```

---

### Step 5: Gemini วิเคราะห์และตัดสินใจ

**กรณี A: ตอบตรง (ไม่ต้องใช้ Tool)**
- Gemini ส่ง text response กลับมาเลย
- ไปที่ Step 8

**กรณี B: ต้องการข้อมูล (เรียก Tool)**
- Gemini ส่ง `functionCall` กลับมา เช่น:
```json
{
  "functionCall": {
    "name": "search_faq",
    "args": {"query": "ราคาจัดฟัน"}
  }
}
```

---

### Step 6: Execute Function Call
📁 [dental-plus-api/handlers/ai_chat.go:117-179](./dental-plus-api/handlers/ai_chat.go#L117-L179) (processGeminiResponse)

| Line | Action |
|------|--------|
| [Line 128-136](./dental-plus-api/handlers/ai_chat.go#L128-L136) | ตรวจพบ FunctionCall → เรียก `executeFunctionCall()` |
| [Line 132](./dental-plus-api/handlers/ai_chat.go#L132) | เก็บชื่อ tool ที่ใช้ |

📁 [dental-plus-api/handlers/ai_chat.go:182-206](./dental-plus-api/handlers/ai_chat.go#L182-L206) (executeFunctionCall)

**แยกตาม Tool ที่เรียก:**

| Tool Name | Handler | Code Location |
|-----------|---------|---------------|
| `search_faq` | `geminiService.SearchSimilarFAQs()` | [ai_chat.go:196-201](./dental-plus-api/handlers/ai_chat.go#L196-L201) |
| `get_doctor_schedule` | `mcpTools.GetDoctorSchedule()` | [ai_chat.go:184-187](./dental-plus-api/handlers/ai_chat.go#L184-L187) |
| `get_promotions` | `mcpTools.GetActivePromotions()` | [ai_chat.go:189-190](./dental-plus-api/handlers/ai_chat.go#L189-L190) |
| `get_branch_info` | `mcpTools.GetBranchInfo()` | [ai_chat.go:192-194](./dental-plus-api/handlers/ai_chat.go#L192-L194) |

---

### Step 6.1: search_faq (Vector Search)
📁 [dental-plus-api/services/gemini.go:146-191](./dental-plus-api/services/gemini.go#L146-L191)

| Line | Action |
|------|--------|
| [Line 148](./dental-plus-api/services/gemini.go#L148) | สร้าง embedding จากคำถาม user (Gemini Embedding API) |
| [Line 162-169](./dental-plus-api/services/gemini.go#L162-L169) | Query PostgreSQL ด้วย Vector Similarity (pgvector) |
| [Line 151, 172, 186-187](./dental-plus-api/services/gemini.go#L151) | ถ้า embedding ไม่พร้อม → fallback เป็น Text Search |

**Embedding API URL:** `https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent`

**Vector Search SQL:**
```sql
SELECT id, question, answer,
       1 - (embedding <=> query_embedding) as similarity
FROM faqs
WHERE embedding IS NOT NULL
ORDER BY embedding <=> query_embedding
LIMIT 3
```

**Fallback Text Search:**
📁 [dental-plus-api/services/gemini.go:194-222](./dental-plus-api/services/gemini.go#L194-L222)
```sql
WHERE LOWER(question) LIKE '%query%' OR LOWER(answer) LIKE '%query%'
```

---

### Step 6.2: get_doctor_schedule
📁 [dental-plus-api/services/mcp_tools.go:41-86](./dental-plus-api/services/mcp_tools.go#L41-L86)

| Line | Action |
|------|--------|
| [Line 44-64](./dental-plus-api/services/mcp_tools.go#L44-L64) | สร้าง SQL query พร้อม filter ตาม doctor_name และ branch |
| [Line 66-83](./dental-plus-api/services/mcp_tools.go#L66-L83) | Query จาก doctor_schedules table และ format ผลลัพธ์ |

---

### Step 6.3: get_promotions
📁 [dental-plus-api/services/mcp_tools.go:89-120](./dental-plus-api/services/mcp_tools.go#L89-L120)

| Line | Action |
|------|--------|
| [Line 90-97](./dental-plus-api/services/mcp_tools.go#L90-L97) | Query promotions ที่ active และยังไม่หมดอายุ |

```sql
WHERE is_active = true
  AND start_date <= CURRENT_DATE
  AND end_date >= CURRENT_DATE
```

---

### Step 6.4: get_branch_info
📁 [dental-plus-api/services/mcp_tools.go:123-163](./dental-plus-api/services/mcp_tools.go#L123-L163)

| Line | Action |
|------|--------|
| [Line 125-147](./dental-plus-api/services/mcp_tools.go#L125-L147) | ข้อมูลสาขาแบบ hardcoded (สยาม, ทองหล่อ, เซ็นทรัลลาดพร้าว) |
| [Line 149-162](./dental-plus-api/services/mcp_tools.go#L149-L162) | คืนข้อมูลสาขาที่ระบุ หรือทุกสาขา |

---

### Step 7: ส่ง Tool Result กลับ Gemini
📁 [dental-plus-api/handlers/ai_chat.go:144-169](./dental-plus-api/handlers/ai_chat.go#L144-L169)

| Line | Action |
|------|--------|
| [Line 145-158](./dental-plus-api/handlers/ai_chat.go#L145-L158) | เพิ่ม function result ใน messages (model + functionResponse) |
| [Line 162](./dental-plus-api/handlers/ai_chat.go#L162) | เรียก `geminiService.Chat()` อีกครั้งพร้อม tool result |
| [Line 167-168](./dental-plus-api/handlers/ai_chat.go#L167-L168) | รับ text response สุดท้ายจาก Gemini |

---

### Step 8: ส่ง Response กลับ Frontend
📁 [dental-plus-api/handlers/ai_chat.go:107-114](./dental-plus-api/handlers/ai_chat.go#L107-L114)

```go
chatResp := ChatMessageResponse{
    Response:  response,       // คำตอบจาก Gemini
    ToolsUsed: toolsUsed,      // ["search_faq"]
    Sources:   sources,        // ข้อมูลที่ใช้ตอบ
}
```

**ตัวอย่าง Response:**
```json
{
  "response": "ค่าจัดฟันที่ Dental Plus เริ่มต้นที่ 35,000-80,000 บาท ขึ้นอยู่กับประเภทค่ะ",
  "tools_used": ["search_faq"],
  "sources": [{
    "tool": "search_faq",
    "result": [{"question": "ค่าจัดฟัน...", "answer": "..."}]
  }]
}
```

---

## ตัวอย่าง Flow ทั้งหมด

### ตัวอย่าง 1: "ราคาจัดฟันเท่าไหร่"

| Step | Location | Action |
|------|----------|--------|
| 1 | Frontend | POST /api/chat `{"message": "ราคาจัดฟันเท่าไหร่"}` |
| 2 | [main.go:68](./dental-plus-api/main.go#L68) | Route ไป HandleChat |
| 3 | [ai_chat.go:61](./dental-plus-api/handlers/ai_chat.go#L61) | Parse request, เตรียม tools |
| 4 | [gemini.go:235](./dental-plus-api/services/gemini.go#L235) | เรียก Gemini API ครั้งที่ 1 |
| 5 | Gemini | ตัดสินใจเรียก `search_faq` |
| 6 | [ai_chat.go:196-201](./dental-plus-api/handlers/ai_chat.go#L196-L201) | Execute search_faq |
| 6.1 | [gemini.go:148](./dental-plus-api/services/gemini.go#L148) | สร้าง embedding จาก "ราคาจัดฟัน" |
| 6.2 | [gemini.go:162-169](./dental-plus-api/services/gemini.go#L162-L169) | Vector search หา FAQ ที่ใกล้เคียง |
| 7 | [ai_chat.go:162](./dental-plus-api/handlers/ai_chat.go#L162) | เรียก Gemini API ครั้งที่ 2 พร้อม FAQ result |
| 8 | [ai_chat.go:107-114](./dental-plus-api/handlers/ai_chat.go#L107-L114) | ส่ง response กลับ Frontend |

### ตัวอย่าง 2: "หมอสมศรีวันไหนว่าง"

| Step | Location | Action |
|------|----------|--------|
| 1 | Frontend | POST /api/chat `{"message": "หมอสมศรีวันไหนว่าง"}` |
| 2-4 | เหมือนด้านบน | |
| 5 | Gemini | ตัดสินใจเรียก `get_doctor_schedule` พร้อม `doctor_name: "สมศรี"` |
| 6 | [ai_chat.go:184-187](./dental-plus-api/handlers/ai_chat.go#L184-L187) | Execute get_doctor_schedule |
| 6.1 | [mcp_tools.go:44-64](./dental-plus-api/services/mcp_tools.go#L44-L64) | Query: `SELECT ... WHERE doctor_name ILIKE '%สมศรี%'` |
| 7-8 | เหมือนด้านบน | |

---

## File Reference (คลิกเพื่อเปิดไฟล์)

| File | Purpose |
|------|---------|
| [main.go](./dental-plus-api/main.go) | Entry point, routes setup |
| [handlers/ai_chat.go](./dental-plus-api/handlers/ai_chat.go) | Chat handler, tool execution |
| [services/gemini.go](./dental-plus-api/services/gemini.go) | Gemini API calls, embedding, vector search |
| [services/mcp_tools.go](./dental-plus-api/services/mcp_tools.go) | MCP tools (doctor, promotion, branch) |
| [config/database.go](./dental-plus-api/config/database.go) | PostgreSQL + pgvector connection |
