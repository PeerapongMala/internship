# Design Check Instructions — Figma to Implementation

Guide สำหรับ AI ที่ต้องทำตามเวลา implement UI ตาม Figma design ให้ตรงจริง
อิงจาก lessons learned ของ session ที่ใช้ 6.9M tokens แก้ซ้ำเพราะไม่ทำตามขั้นตอน

---

## Phase 1: PRE-IMPLEMENTATION (ก่อนเขียน code ใดๆ)

### 1.1 Scan Global CSS ก่อนเสมอ

**ก่อนเขียน CSS แม้แต่บรรทัดเดียว** ต้อง scan ไฟล์เหล่านี้เพื่อหา rules ที่จะ override:

```
project/frontend/BSS_WEB/wwwroot/css/master/all.css     ← custom global overrides
project/frontend/BSS_WEB/wwwroot/css/Style.css           ← page-level overrides
project/frontend/BSS_WEB/wwwroot/lib/bootstrap/dist/css/bootstrap.css  ← framework defaults
```

**วิธี scan**: Grep หา selector ที่เกี่ยวข้องกับ component ที่จะ implement เช่น:
- กำลังจะใช้ `<button>` → grep `button` ใน Style.css, all.css
- กำลังจะใช้ `.btn-action` → grep `btn-action` ใน all.css
- กำลังจะใช้ badge → grep `badge` ใน all.css
- กำลังจะใช้ table → grep `table`, `td`, `th` ใน all.css, Style.css

**สิ่งที่ต้องจด**:
- Rules ที่มี `!important` → ต้องใช้ `!important` + higher specificity ในการ override
- Rules ที่ใช้ element selector (เช่น `button {}`) → กระทบทุก element ของ type นั้น
- Rules ที่มี `width`/`height`/`min-width`/`min-height` ที่ fixed → จะบังคับ size ทุกกรณี

### Known Critical Overrides (BSS Web)

| File | Selector | Rule | Impact |
|------|----------|------|--------|
| `Style.css` | `button` | `height: 40px !important` | ทุก `<button>` ถูกบังคับ 40px |
| `all.css` | `.btn-action` | `width: 28px !important; height: 28px !important; min-width: 28px; min-height: 28px` | Action buttons ถูกล็อคขนาด |
| `all.css` | `.btn-action i` | `font-size: 18px !important` | Icons ใน action buttons ถูกล็อคขนาด |
| `all.css` | `.qty-badge` | `background-image: url("/images/image_pattern.png") !important; width: 55px; height: 28px` | Badge ต้องใช้ pattern image |

**วิธีเอาชนะ override**:
- ใช้ higher specificity: `.data-table .btn-action` (0-2-0) ชนะ `.btn-action` (0-1-0)
- ใส่ `!important` ด้วยเสมอ ถ้า rule เดิมมี `!important`
- ถ้าเป็น element selector (`button {}`) ใช้ class selector ก็ชนะได้ (class > element)

---

### 1.2 ดึง Figma Spec ก่อนเขียน CSS

**ห้ามเดา CSS เด็ดขาด** — ต้องดึง spec จาก Figma MCP ก่อนเสมอ

ลำดับการเรียก Figma MCP:

1. **`get_screenshot`** — ดูภาพรวมของ component/page
2. **`get_variable_defs`** — ดึง design tokens (สี, font, spacing)
3. **`get_design_context`** — ดึง code ที่มี CSS specs (จะได้ React + Tailwind → ต้องแปลงเอง)

**การแปลง Tailwind → CSS**:

| Tailwind | CSS |
|----------|-----|
| `bg-[#fff5f5]` | `background-color: #fff5f5` |
| `border-[#c07575]` | `border-color: #c07575` |
| `text-[#8f4242]` | `color: #8f4242` |
| `text-xs` | `font-size: 12px` |
| `text-sm` | `font-size: 14px` |
| `font-medium` | `font-weight: 500` |
| `font-semibold` | `font-weight: 600` |
| `font-bold` | `font-weight: 700` |
| `rounded` | `border-radius: 4px` |
| `rounded-lg` | `border-radius: 8px` |
| `p-2` | `padding: 8px` |
| `px-3` | `padding-left: 12px; padding-right: 12px` |
| `gap-2` | `gap: 8px` |

**สำคัญ**: เมื่อ user พูดคลุมเครือ (เช่น "ทำตัวหนา") → **ต้องเช็ค Figma spec ก่อน** ไม่ใช่เดาเอง
- "ตัวหนา" อาจหมายถึง `font-weight: 500` (medium) ไม่ใช่ `700` (bold) เสมอ
- "สีฟ้า" อาจเป็น `#007bff` หรือ `#17a2b8` หรือ `#4fc3f7` → เช็ค Figma เท่านั้น

### 1.3 Figma Node ใหญ่ → แบ่ง Task แต่ถาม User ก่อน

<!-- DISABLED: Deep Auto-Analysis — ปิดชั่วคราวประหยัด rate limit
ห้าม AI เรียก get_metadata แล้วแตก subagent ซ้อนเรียก get_design_context ทุก component อัตโนมัติ
ห้าม AI วิเคราะห์หน้าจอเองแล้วเรียก MCP หลายรอบ (nested analysis)
-->

**กฎ**: ถ้า Figma node เป็น **ระดับ page หรือ section ใหญ่** → **ถาม user ก่อน** ว่าจะให้ดึง spec node ไหนบ้าง

**วิธี (ขณะปิด deep analysis)**:
1. ถาม user ว่า node ไหนสำคัญที่สุด → ดึง spec เฉพาะ node นั้น
2. แบ่ง tasks ตาม section ที่ user ระบุ
3. ดึง `get_design_context` ทีละ node ตามที่ user บอก (ไม่ auto-discover)
4. บันทึกผลลง design/ folder ทุกครั้ง

**ขนาดที่เหมาะสมต่อ task**:

| ขนาด Node | ตัวอย่าง | วิธีจัดการ |
|-----------|---------|-----------|
| **เล็ก** — component เดียว | ปุ่ม, badge, input | ทำได้เลยใน main context |
| **กลาง** — section/group | filter bar, table, sidebar | 1 task ต่อ section |
| **ใหญ่** — page เต็ม | หน้าจอทั้งหน้า | **ถาม user** ว่าจะแบ่งยังไง ไม่ auto-discover |

**ห้ามทำ (ขณะปิด deep analysis)**:
- ได้ node ระดับ page แล้ว auto-call `get_metadata` → `get_screenshot` → `get_design_context` ซ้อนหลายรอบ
- ปล่อย parallel subagents เรียก Figma MCP ทุก component พร้อมกันโดยไม่ถาม user
- ข้าม component เล็กๆ (icon, badge, separator) เพราะ "เดี๋ยวค่อยแก้ทีหลัง"

**ต้องทำ**:
- ถาม user ว่าจะดึง spec node ไหน → ดึงเฉพาะที่จำเป็น
- บันทึก design/ folder ทุกครั้ง
- เช็ค design/ folder ที่บันทึกไว้แล้วก่อนเรียก MCP ซ้ำ

### 1.4 Autonomous Figma Analysis (DISABLED ชั่วคราว)

<!-- ปิดทั้ง section — เปิดกลับเมื่อ rate limit ไม่เป็นปัญหา
เมื่อได้รับ Figma node IDs → AI วิเคราะห์โครงสร้างเองทั้งหมด โดยเรียก MCP หลายรอบ:
ขั้น 1: get_metadata + get_screenshot ทุก node → แยก screen / variant / popup
ขั้น 2: แต่ละ screen → list components ทั้งหมด (parallel subagents per screen)
ขั้น 3: ดึง get_design_context ทีละ component (parallel subagents)
ขั้น 4: บันทึกผลลง design/ folder
→ ใช้ MCP calls เยอะมาก จึงปิดไว้ก่อน
-->

**ขณะนี้**: เมื่อได้ Figma node IDs → ถาม user ว่าจะให้ดึง spec node ไหนบ้าง แทนที่จะ auto-discover ทั้งหมด

---

## Phase 2: IMPLEMENTATION (ระหว่างเขียน code)

### 2.1 SVG/Icon — เช็คไฟล์ที่ User ดึงจาก Figma มาก่อนเสมอ

**ก่อนสร้าง SVG หรือ icon ใดๆ** ต้องค้นหาไฟล์ที่ user อาจดึงจาก Figma มาวางไว้แล้ว:

```
# ค้นหา SVG ที่อาจมีอยู่ในโปรเจค
Glob("**/*.svg")                                    # ทุกไฟล์ SVG
Glob("**/design/**/*.svg")                          # SVG ใน design folder
Glob("**/wwwroot/images/**/*.svg")                  # SVG ใน images folder
Grep("icon-name", glob="*.svg")                     # หาชื่อ icon ที่ต้องการ
```

**ลำดับความสำคัญ**:
1. ใช้ไฟล์ SVG ที่ user ดึงจาก Figma มาวางไว้ → **ดีที่สุด** (ตรง design 100%)
2. ใช้ SVG จาก `/wwwroot/images/` ที่มีอยู่แล้วในโปรเจค → ดี
3. ใช้ Bootstrap Icons (`<i class="bi bi-xxx">`) → ถ้าไม่มีไฟล์ SVG
4. สร้าง SVG เอง → **ทางเลือกสุดท้าย** ต้องเทียบกับ Figma screenshot ก่อนใช้

**ที่ SVG จาก Figma มักจะอยู่**:
- Root ของ project (`/workspaces/project/*.svg`)
- Design folder (`design/*.svg`)
- ที่ user วางไว้ตาม path ที่บอก

### 2.2 SVG ใน Table — ใช้ `<img>` + data URI เสมอ

**ห้ามใช้ inline `<svg>` ใน `<td>` เด็ดขาด**

`table-layout: fixed` + `overflow: hidden` จะบีบ inline SVG ให้เล็กกว่าที่กำหนด ไม่ว่าจะ set `width`, `min-width`, inline style ก็ไม่ช่วย

**วิธีที่ถูกต้อง**:
```html
<!-- ผิด: inline SVG ใน table จะถูกบีบ -->
<td>
  <svg width="14" height="14">...</svg>
</td>

<!-- ถูก: ใช้ <img> + data URI -->
<td>
  <img src="data:image/svg+xml,..." width="14" height="14"
       style="width:14px;height:14px;min-width:14px;min-height:14px" />
</td>

<!-- หรือถูก: ใช้ <img> + ไฟล์ SVG ที่แยก -->
<td>
  <img src="/images/icon.svg" width="14" height="14"
       style="width:14px;height:14px;min-width:14px;min-height:14px" />
</td>
```

### 2.3 Border ซ้อนกัน — ตรวจ Structure ก่อน

เมื่อ implement input ที่มี wrapper:
- ตรวจว่า wrapper มี border หรือไม่
- ถ้า wrapper มี border → input ไม่ควรมี border ด้วย (หรือกลับกัน)
- เลือกชั้นเดียวที่จะมี border

```css
/* ผิด: border ซ้อน 2 ชั้น */
.scanner-wrapper { border: 5px solid lightblue; }
.scanner-wrapper input { border: 3px solid blue; }

/* ถูก: border ชั้นเดียว */
.scanner-wrapper { border: 3px solid blue; }
.scanner-wrapper input { border: none; outline: none; }
```

### 2.4 Denomination Badge — ใช้ Class จาก all.css

Badge ราคาต้องใช้ class ที่มีอยู่แล้วใน `all.css`:

```html
<span class="qty-badge qty-20">20</span>
<span class="qty-badge qty-50">50</span>
<span class="qty-badge qty-100">100</span>
<span class="qty-badge qty-500">500</span>
<span class="qty-badge qty-1000">1000</span>
```

`qty-badge` จะ include:
- Background pattern image
- Fixed width 55px, height 28px
- สีแตกต่างกันตาม qty-{price} class

**ห้ามเขียน badge CSS เอง** — ใช้ class ที่มีอยู่แล้วเสมอ

---

## Phase 3: DEBUGGING (เมื่อ CSS ไม่ทำงาน)

### 3.1 กฎ 2 รอบ — เปลี่ยนแนวทางถ้าแก้ไม่ได้ใน 2 ครั้ง

**ถ้าแก้ CSS ไม่ได้ผลหลังจากพยายาม 2 รอบ → หยุดทำแบบเดิม เปลี่ยนแนวทาง**

ห้ามวน specificity war (เพิ่ม class, เพิ่ม `!important`, เพิ่ม nesting ไปเรื่อยๆ)

**ทางเลือกที่ควรพิจารณา**:

| ปัญหา | แนวทางเดิม (ที่ไม่ work) | แนวทางใหม่ |
|-------|--------------------------|-----------|
| padding ไม่ได้ผล | เพิ่ม specificity + !important | ใช้ spacer/empty column |
| element selector override | สู้ด้วย class selector | เปลี่ยน HTML element (เช่น `<div>` แทน `<button>`) |
| inline SVG ถูกบีบ | เพิ่ม width/min-width | เปลี่ยนเป็น `<img>` + data URI |
| font-weight ไม่ตรง | ลองเลขต่างๆ | เช็ค Figma spec ก่อน |

### 3.2 User บอก "ยังไม่หาย" แต่ Code ลบแล้ว → Browser Cache

เมื่อ:
- Grep หาไม่เจอ text ที่ user บอกยังเห็นอยู่
- Code เปลี่ยนแล้วแน่นอน
- แต่ user ยังเห็นเหมือนเดิม

**ตอบทันที**: "ลอง hard refresh (Ctrl+Shift+R หรือ Cmd+Shift+R) หรือเปิด DevTools → Network → Disable cache แล้ว refresh ดูครับ"

ห้ามวนแก้ code ซ้ำ ถ้า grep ยืนยันว่า code เปลี่ยนแล้ว

### 3.3 ตรวจสอบ Specificity ก่อนเขียน Override

ก่อนเพิ่ม CSS rule ใหม่ ต้องคำนวณ specificity:

```
Inline style:              1-0-0-0  (สูงสุด ยกเว้น !important)
#id:                       0-1-0-0
.class, [attr], :pseudo:   0-0-1-0
element, ::pseudo:         0-0-0-1

!important ชนะทุก specificity (ยกเว้น !important ที่ specificity สูงกว่า)
```

**ตัวอย่าง**: `all.css` มี `.btn-action { width: 28px !important; }` (specificity 0-0-1-0 + !important)
- ต้องใช้: `.my-page .btn-action { width: 20px !important; }` (specificity 0-0-2-0 + !important) → ชนะ

---

## Phase 4: POST-IMPLEMENTATION (หลัง implement เสร็จ)

### 4.1 Visual Comparison Checklist

เมื่อ implement UI เสร็จ ต้องทำ checklist นี้ก่อนบอก user ว่าเสร็จ:

- [ ] **Screenshot**: เรียก `get_screenshot` เทียบกับหน้าจริง
- [ ] **Colors**: ทุกสีตรงกับ Figma tokens (ไม่ใช่เดาเอง)
- [ ] **Font**: family, size, weight ตรง Figma spec
- [ ] **Spacing**: padding, margin, gap ตรง Figma spec
- [ ] **Border**: ไม่มี double border, สีและขนาดตรง
- [ ] **Icons**: ขนาดตรง, ไม่ถูกบีบจาก table/overflow
- [ ] **Global override**: ไม่มี rule ใน all.css/Style.css ที่ override ค่าที่ตั้งไว้

### 4.2 บันทึก Design Tokens

หลัง implement เสร็จ บันทึก design tokens ที่ใช้ลง `design/design-tokens.md`:

```markdown
# Design Tokens

## Colors
| Token | Value | Usage |
|-------|-------|-------|
| Header BG | #d6e0e0 | Table header background |
| Badge BG | #fff5f5 | Denomination badge background |

## Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Table header | Pridi | 14px | 500 |

## Spacing
| Element | Property | Value |
|---------|----------|-------|
| Table cell | padding | 4px 8px |
```

---

## Phase 5: FIGMA MCP — ทำผ่าน Subagent เท่านั้น

### 5.1 ห้ามเรียก Figma MCP จาก Main Context โดยตรง

Figma MCP (`get_screenshot`, `get_design_context`, `get_variable_defs`, `get_metadata`) return ข้อมูลขนาดใหญ่มาก ถ้าเรียกจาก main context จะกิน context window จนหมดเร็ว (เป็นสาเหตุหนึ่งที่ session crash)

**กฎเด็ดขาด**: ทุกครั้งที่ต้องเรียก Figma MCP → สร้าง Task subagent เสมอ

```
# ถูก — ผ่าน subagent
Task(subagent_type="general-purpose", prompt="
  Use get_screenshot on node 123:456.
  Then use get_design_context on the same node.
  Return: layout structure, colors (hex), font sizes, spacing values.
")

# ผิด — เรียกตรง (ห้ามทำ)
get_design_context(nodeId="123:456")
```

### 5.2 Subagent ต้อง Return สรุป ไม่ใช่ Raw Data

Prompt ของ subagent ต้องระบุชัดว่าให้ return อะไร:

```
# ดี — บอกชัดว่าต้องการอะไร
"Use get_design_context on node 123:456.
 Return ONLY:
 - Background colors (hex)
 - Font: family, size, weight
 - Padding/margin values
 - Border: width, color, radius
 Do NOT return raw Tailwind classes or full component code."

# ไม่ดี — กว้างเกินไป ได้ข้อมูลท่วม
"Use get_design_context on node 123:456 and tell me what you see."
```

### 5.3 รวม Figma Calls ใน Subagent เดียวเมื่อเป็น Node เดียวกัน

ถ้าต้องการทั้ง screenshot + design context + variables ของ node เดียวกัน → รวมใน subagent เดียว:

```
Task(subagent_type="general-purpose", prompt="
  For Figma node 123:456:
  1. get_screenshot — describe the visual layout
  2. get_variable_defs — list all design tokens
  3. get_design_context — extract CSS values (colors, fonts, spacing, borders)
  Return a concise summary with all values.
")
```

ถ้าเป็น **คนละ node** (เช่น header กับ table body) → ปล่อย subagent **แยกกัน parallel**:

```
# ปล่อยพร้อมกัน 2 ตัว
Task(description="Figma header node", prompt="get_design_context on node 111:222 ...")
Task(description="Figma table node", prompt="get_design_context on node 333:444 ...")
```

---

## Phase 6: บันทึก Design Documentation ลง /design

### 6.1 โครงสร้าง /design Folder

ทุกครั้งที่ดึง Figma data ต้องบันทึกลง `design/` folder ของ domain page นั้น:

```
g01-dXX-pXX-page/
└── design/
    ├── README.md              # สรุปภาพรวม: node IDs ทั้งหมด, ลิงก์ไปแต่ละ section
    ├── design-tokens.md       # รวม tokens ทุกตัวที่ใช้ในหน้านี้
    ├── figma-specs.css         # ★ CSS specs จาก Figma — ใช้ copy ตรงได้เลย
    ├── node-XXXXX/            # folder ต่อ Figma node (optional, สำหรับ node ใหญ่)
    │   ├── design-context.md  # สรุปจาก get_design_context
    │   └── notes.md           # หมายเหตุเพิ่มเติม
    └── session-issues-*.md    # บันทึกปัญหาที่เจอ (ถ้ามี)
```

### 6.2 design-tokens.md — Format มาตรฐาน

ทุกหน้าต้องมี `design/design-tokens.md` ที่บันทึก tokens จาก Figma:

```markdown
# Design Tokens — [ชื่อหน้า]

Source Figma Node: [node ID]

## Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary BG | #d6e0e0 | Table header background |
| Row Hover | #f0f4f4 | Table row hover state |
| Badge BG (20) | #fff5f5 | Denomination 20 badge |
| Badge Border (20) | #c07575 | Denomination 20 border |
| Badge Text (20) | #8f4242 | Denomination 20 text |
| Alert Icon | #dc3545 | Octagon alert icon fill |

## Typography
| Element | Font Family | Size | Weight | Color |
|---------|-------------|------|--------|-------|
| Table header | Pridi | 14px | 500 | #333333 |
| Table body | Pridi | 13px | 400 | #333333 |
| Badge text | Pridi | 12px | 500 | varies |

## Spacing
| Element | Property | Value |
|---------|----------|-------|
| Table cell | padding | 4px 8px |
| Header cell | padding | 6px 8px |
| Badge | padding | 2px 8px |
| Section gap | margin-bottom | 12px |

## Borders
| Element | Width | Color | Radius |
|---------|-------|-------|--------|
| Table | 1px | #dee2e6 | 0 |
| Badge | 1px | varies | 4px |
| Scanner input | 3px | #007bff | 4px |

## Icons
| Icon | Type | Size | Color |
|------|------|------|-------|
| Edit | Bootstrap Icon | 14px | #6c757d |
| Delete | Bootstrap Icon | 14px | #dc3545 |
| Alert | SVG octagon | 14px | #dc3545 |
```

### 6.3 เมื่อไหร่ต้องบันทึก

| เหตุการณ์ | บันทึกอะไร |
|-----------|-----------|
| ดึง Figma data ครั้งแรก | สร้าง `design-tokens.md` + `README.md` |
| เจอ token ใหม่ระหว่าง implement | อัพเดท `design-tokens.md` เพิ่ม |
| แก้ design issue | บันทึกใน `session-issues-*.md` |
| เสร็จ implement | ตรวจว่า tokens ครบทุกตัวที่ใช้จริง |

### 6.4 figma-specs.css — CSS Specs จาก Figma (ไฟล์ .css จริง)

เมื่อ Figma MCP return design context ที่มี Tailwind classes → **แปลงเป็น CSS แล้วบันทึกเป็นไฟล์ `.css` จริง** ไม่ใช่แค่ code block ใน markdown

**เหตุผล**:
- `.css` file เปิดใน IDE ได้ syntax highlight + autocomplete
- Copy selector/properties ไปใช้ได้ตรงๆ ไม่ต้อง parse markdown
- AI อ่าน `.css` ได้เร็วกว่า markdown ที่มี code blocks ซ้อน

**Format**:
```css
/* ==========================================================
 * Figma Design Specs — [ชื่อหน้า]
 * Source: Figma MCP get_design_context
 * Generated: [วันที่]
 *
 * ★ ไฟล์นี้เป็น REFERENCE เท่านั้น — ห้าม link เป็น stylesheet
 * ★ ใช้เป็นต้นฉบับ copy ค่าไปใส่ใน production CSS
 * ★ font-family: 'Pridi' จาก Figma → ต้อง map เป็น 'bss-pridi' ตอน implement
 * ========================================================== */

/* --- Section: Title Bar (Node 32:26438) --- */
.main-title h1 {
    font-family: 'Pridi', sans-serif;   /* → implement เป็น 'bss-pridi' */
    font-weight: 600;
    font-size: 30px;
    color: #212121;
}

/* --- Section: Table Header (Node 32:29202) --- */
.data-table thead th {
    background: #d6e0e0;
    font-weight: 500;
    font-size: 13px;
    color: #212121;
    padding: 8px;
}

/* --- Section: Denomination Badge --- */
.denom-badge-100 {
    background: #fff5f5;
    border-color: #c07575;
    color: #8f4242;
}
```

**กฎ**:
- ทุก section ใส่ comment `/* --- Section: [ชื่อ] (Node XX:XXXXX) --- */`
- Figma บอก `font-family: 'Pridi'` → ใส่ comment ว่า `/* → implement เป็น 'bss-pridi' */`
- ใส่ header comment ชัดว่าเป็น **reference file** ไม่ใช่ production CSS
- ถ้ามี `css-specs-from-figma.md` อยู่แล้ว → สร้าง `figma-specs.css` คู่กัน (หรือแทนที่)

### 6.5 README.md — สรุปภาพรวมของ Design

```markdown
# Design — [ชื่อหน้า]

## Figma Nodes
| Section | Node ID | Description |
|---------|---------|-------------|
| Full Page | 123:456 | ภาพรวมทั้งหน้า |
| Header | 123:789 | Filter bar + scanner |
| Left Table | 124:100 | ตารางซ้าย |
| Right Table | 124:200 | ตารางขวา |
| Popup | 125:300 | Denomination detail popup |

## Files
- [design-tokens.md](./design-tokens.md) — Design tokens ทั้งหมด
- [session-issues-2026-02-18.md](./session-issues-2026-02-18.md) — ปัญหาที่เจอ
```

---

## Phase 7: PARALLEL SUBAGENT WORKFLOW — รับ Issue แล้วแยกงาน

### 7.1 เมื่อ User แจ้ง Issue → สร้าง Task แล้วปล่อย Subagent ทำพร้อมกัน

เมื่อ user แจ้งปัญหาหรือขอแก้หลายจุด **ห้ามทำทีละจุด sequential** — ต้อง:

1. **วิเคราะห์** issue ทั้งหมดก่อน แยกเป็น tasks ที่เป็นอิสระจากกัน
2. **สร้าง TaskCreate** สำหรับแต่ละ task
3. **ปล่อย Task subagent** ทำพร้อมกัน (parallel) สำหรับ tasks ที่ไม่ depend กัน

### 7.2 ตัวอย่าง: User แจ้ง 3 issues พร้อมกัน

User: "สีหัวตารางผิด, icon เล็กเกินไป, badge ไม่มี pattern"

```
# ขั้น 1: วิเคราะห์ — 3 issues เป็นอิสระจากกัน ทำพร้อมกันได้

# ขั้น 2: สร้าง tasks
TaskCreate("Fix table header color")
TaskCreate("Fix icon size in action buttons")
TaskCreate("Fix denomination badge pattern")

# ขั้น 3: ปล่อย subagents ทำพร้อมกัน (ส่งใน message เดียวกัน)
Task(subagent_type="general-purpose", prompt="
  Issue: สีหัวตารางผิด
  1. เรียก get_design_context บน node XXX เพื่อหาสี header ที่ถูกต้อง
  2. Grep หาไฟล์ CSS ที่กำหนดสี header อยู่
  3. บอกว่าต้องแก้ไฟล์ไหน บรรทัดไหน เปลี่ยนจากอะไรเป็นอะไร
")

Task(subagent_type="general-purpose", prompt="
  Issue: icon เล็กเกินไป
  1. Grep หา .btn-action ใน all.css เพื่อดู override rules
  2. หา CSS ของหน้า reconcile ที่กำหนด icon size
  3. บอกวิธีแก้ที่ชนะ specificity ของ all.css
")

Task(subagent_type="general-purpose", prompt="
  Issue: badge ไม่มี pattern
  1. Grep หา qty-badge ใน all.css เพื่อดู class ที่มีอยู่
  2. หา HTML ที่ render badge อยู่
  3. บอกว่าต้องเปลี่ยน HTML class เป็นอะไร
")
```

### 7.3 แยก Research vs Implementation

| ขั้นตอน | ใช้ Subagent? | ทำไม |
|---------|-------------|------|
| **Research** (หาสาเหตุ, ดึง Figma spec, scan CSS) | ใช่ — ปล่อย parallel | ประหยัด context, ทำพร้อมกันได้ |
| **Implementation** (แก้ code จริง) | ไม่ — ทำใน main context | ต้อง Edit ไฟล์ซึ่ง subagent ทำไม่ได้ |

**Workflow**:
```
1. User แจ้ง issues
2. ปล่อย research subagents พร้อมกัน (parallel)
3. รอผลกลับมาทั้งหมด
4. Main context แก้ code ตามผลวิจัย (sequential ถ้าแก้ไฟล์เดียวกัน)
5. ปล่อย verification subagent เช็ค Figma อีกรอบ
```

### 7.4 เมื่อไหร่ห้ามทำ Parallel

- Issues ที่ **depend กัน** (เช่น ต้องแก้ HTML structure ก่อน แล้วค่อยแก้ CSS)
- Issues ที่ **แก้ไฟล์เดียวกัน** (ต้อง sequential เพื่อไม่ให้ conflict)
- **Implementation step** — การ Edit ไฟล์ต้องทำใน main context เท่านั้น

### 7.5 Template: รับ Issue จาก User

เมื่อ user แจ้ง issue ให้ทำตาม pattern นี้:

```
1. ตอบรับ: "เข้าใจครับ มี X จุดที่ต้องแก้ ผมจะ research พร้อมกันก่อน"

2. ปล่อย research subagents (parallel):
   - Subagent A: ดึง Figma spec สำหรับ issue 1
   - Subagent B: scan CSS overrides ที่เกี่ยวข้อง
   - Subagent C: ดึง Figma spec สำหรับ issue 2
   (... ตามจำนวน issues)

3. รอผลจาก subagents

4. สรุปให้ user: "จากการ research พบว่า..."
   - Issue 1: ต้องแก้ไฟล์ A บรรทัด X
   - Issue 2: ต้องแก้ไฟล์ B บรรทัด Y

5. แก้ code (main context)

6. ปล่อย verification subagent: เช็ค Figma อีกรอบ

7. บอก user: "แก้เสร็จแล้วครับ ลอง hard refresh ดู"
```

---

## Quick Reference — Decision Tree

```
ต้องเขียน CSS?
├── scan all.css, Style.css ก่อน → จดสิ่งที่จะ override
├── เรียก get_design_context จาก Figma (ผ่าน subagent!) → ดึง spec จริง
├── แปลง Tailwind → CSS (ดูตาราง Phase 1.2)
└── เขียน CSS พร้อม specificity ที่สูงกว่า global override

ได้ Figma node IDs มา? (Deep Analysis ปิดชั่วคราว)
├── 1. ถาม user ว่าจะให้ดึง spec node ไหนบ้าง
├── 2. ดึง get_design_context เฉพาะ node ที่ user ระบุ (ไม่ auto-discover)
├── 3. บันทึกลง design/ folder ทุกครั้ง
├── 4. สร้าง tasks ตาม section → implement ทีละ task
└── ห้าม auto-call get_metadata แล้วแตก subagent ซ้อนหลายรอบ

ต้องเรียก Figma MCP?
├── ห้ามเรียกตรง → สร้าง Task subagent เสมอ
├── Node เดียว → รวม screenshot + context + variables ใน subagent เดียว
└── หลาย nodes → ปล่อย subagent แยกกัน parallel

CSS ไม่ work?
├── รอบ 1: เช็ค specificity + !important
├── รอบ 2: ลอง higher specificity selector
└── รอบ 3+: หยุด! เปลี่ยนแนวทาง (spacer column, เปลี่ยน element, ใช้ <img>)

User แจ้ง issues หลายจุด?
├── วิเคราะห์แยก tasks ที่เป็นอิสระ
├── ปล่อย research subagents parallel (scan CSS, read design/ docs, ดึง Figma spec เฉพาะ node ที่จำเป็น)
├── รอผลกลับมา → แก้ code ใน main context
└── ปล่อย verification subagent เช็ค Figma อีกรอบ

User บอก "ยังไม่หาย"?
├── grep เจอ text ใน code → แก้ code
└── grep ไม่เจอ → browser cache → แนะนำ hard refresh

ต้องใช้ SVG/icon?
├── Glob หาไฟล์ SVG ที่ user ดึงจาก Figma มาวางไว้ก่อน
├── เจอ → ใช้ไฟล์นั้นเลย (ตรง design 100%)
├── ไม่เจอ → ใช้ Bootstrap Icons หรือ SVG ที่มีใน wwwroot/images/
└── ถ้าอยู่ใน table → ใช้ <img> + data URI เท่านั้น ห้าม inline <svg>

User พูดคลุมเครือ (เช่น "ทำตัวหนา")?
├── ห้ามเดา
└── เช็ค Figma spec ก่อนเสมอ

User พูดถึง component แบบกำกวม (เช่น "dropdown")?
├── ถามก่อนว่า "หมายถึง dropdown ไหน" (navbar? page buttons? popup?)
└── ห้ามเดาแล้วลงมือแก้ — เสียเวลาหลายรอบถ้าผิดที่

รู้ว่าปัญหาอยู่ที่ data/DB ไม่ใช่ UI?
├── บอก user ทันที: "ข้อมูลนี้มาจาก DB ไม่ใช่ hardcode ใน HTML"
└── ห้ามไปแก้ UI แล้วค่อยบอก — user เสียเวลา refresh + ทดสอบ

Figma MCP return ข้อมูล node ใหม่?
├── บันทึกลง design/node-{id}-{name}/ ทันที ก่อน implement
├── Rate limit จะเกิดเสมอใน session ยาว → saved specs = safety net
└── ห้าม implement ก่อนบันทึก

ต้องปรับ column width / spacing?
├── คำนวณจาก Figma spec ก่อน (เช่น icon 14px + gap 2px = +16px)
├── ห้ามเดาค่า (เช่น +20px) → มักเยอะหรือน้อยเกินไป
└── ถ้าไม่แน่ใจ → ให้ user เลือกจาก 2-3 ค่า แทนลองทีละค่า

Implement เสร็จ?
├── บันทึก design tokens ลง design/design-tokens.md
├── อัพเดท design/README.md ด้วย node IDs
└── ปล่อย subagent เช็ค Figma screenshot เทียบหน้าจริง
```

---

## Phase 8: COMMUNICATION — ถามก่อน อย่าเดา (Lessons from Retro 2026-02-18)

### 8.1 ถามให้ชัดก่อนแก้ — Component ที่กำกวม

เมื่อ user พูดถึง component โดยไม่ระบุชัด (เช่น "dropdown", "ปุ่ม", "ตาราง") และหน้ามีหลาย component ที่ชื่อคล้ายกัน:

**ต้องทำ**: ถามก่อนว่า "หมายถึงตรงไหนครับ?"
- "dropdown" → navbar dropdown หรือ dropdown ในหน้า?
- "ปุ่ม" → ปุ่มบน header หรือ action button ในตาราง?
- "ตาราง" → ตารางซ้าย (reconcile) หรือตารางขวา (machine)?

**ห้ามทำ**: คิดเอาเองแล้วลงมือแก้ทันที → ถ้าผิดที่ ต้อง revert + ทำใหม่ เสียเวลาหลายรอบ

### 8.2 บอก Root Cause ก่อนแก้ — Data Layer vs UI

เมื่อ user ขอให้แก้อะไรบางอย่างแล้วพบว่า:
- Data มาจาก **database** (เช่น menu items จาก `bss_mst_menu`)
- Data มาจาก **API** ไม่ใช่ hardcode ใน HTML
- ปัญหาอยู่ที่ **config/environment** ไม่ใช่ code

**ต้องทำ**: บอก user ทันที:
> "เมนูนี้มาจาก database (table `bss_mst_menu`) ไม่ใช่ hardcode ใน HTML ครับ ต้องเพิ่ม rows ใน DB ถึงจะขึ้น"

**ห้ามทำ**: ไปแก้ UI (HTML/CSS) แล้วค่อยบอก → user เสียเวลา refresh + ทดสอบ + สงสัยว่าทำไมไม่เปลี่ยน

### 8.3 คำนวณก่อนเดา — Values จาก Figma Spec

เมื่อต้องปรับค่าตัวเลข (width, padding, margin, font-size):

**ต้องทำ**: คำนวณจาก Figma spec ก่อน
```
ตัวอย่าง: เพิ่ม icon ใน column
- Icon width: 14px (จาก Figma)
- Gap: 2px (จาก Figma)
- ต้องเพิ่ม column width: +16px (ไม่ใช่ +20px ที่เดาเอา)
```

**ถ้าไม่แน่ใจ**: ให้ user เลือกจาก 2-3 ค่า:
> "ผมคำนวณว่าต้องเพิ่ม column width ครับ มี 3 ทางเลือก: +14px (แน่น), +16px (พอดี), +20px (หลวม) — แนะนำ +16px ครับ"

### 8.4 บันทึก Figma Spec ก่อน Implement — ทุกครั้ง

**กฎเด็ดขาด**: เมื่อ Figma MCP subagent return ข้อมูล node ใดๆ → **บันทึกลง `design/node-{id}-{name}/` ทันที ก่อนจะ implement**

เหตุผล:
- Rate limit จะเกิดขึ้นเสมอใน session ยาว (>3 ชม.)
- ถ้าไม่บันทึก → พอ rate limit มา ก็ไม่มี spec อ้างอิง → ต้องเดา
- Saved specs = safety net → ใช้อ้างอิงได้ใน session ถัดไปด้วย

**ขั้นตอน**:
1. Subagent ดึง Figma data กลับมา
2. **บันทึกทันที** → `design/node-{id}-{name}/design-context.md`
3. อัพเดท `design/design-tokens.md` ด้วยค่าใหม่
4. **แล้วค่อย implement**
