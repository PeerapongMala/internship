**ระบบจัดการแชท \- เอกสารข้อกำหนดโครงการ**

**เวอร์ชั่น:** 1.0  
**วันที่:** 26 มกราคม 2026  
**สถานะ:** เตรียมประเมินกับผู้รับจ้าง  
**สถานที่:** กรุงเทพฯ ประเทศไทย

---

**สรุปผู้บริหาร**

เอกสารนี้กำหนด ข้อกำหนดครบถ้วนสำหรับ **ระบบจัดการแชทแบบรวมศูนย์** ที่รวมการสอบถามของลูกค้าจากช่องทางโซเชียลมีเดีย (LINE, Facebook, Instagram, TikTok) หลายแห่ง โดยมี AI Chatbot ที่ผ่านการรวมเข้า ระบบได้รับการออกแบบเพื่อให้ส่งเสริมการหาเบ้าลีด, การปรับปรุงอัตราการแปลงโดยการกำหนดผู้ดูแลแบบอัจฉริยะ และให้ข้อมูลเชิงลึกที่ขึ้นอยู่กับข้อมูลเพื่อเพิ่มรายได้ของคลินิก

โซลูชันประกอบด้วยโครงการที่ผ่านการรวมเข้า 2 โครงการ:

1. **แพลตฟอร์มจัดการแชท** \- การรวบรวมข้อความจากหลายช่องทางและการส่งเสริมแบบอัจฉริยะ

2. **โมดูล AI Chatbot** \- การจำแนกลูกค้าอัตโนมัติและการทำความสัมพันธ์เบื้องต้น (โครงการแยกต่างหาก, เวิร์กโฟลว์ที่ผ่านการรวม)

---

**1\. ภาพรวมของระบบ**

**1.1 จุดประสงค์หลัก**

รวบรวมข้อความของลูกค้าจากช่องทางโซเชียลมีเดียทั้งหมดเข้าในระบบกล่องเข้าแบบรวมศูนย์ที่:

* ระบุข้อมูลลูกค้าและความต้องการของบริการโดยอัตโนมัติ

* ส่งเสริมการสอบถามไปยังผู้ดูแลที่เหมาะสมที่สุดโดยยึดตามข้อมูลประสิทธิภาพ

* ติดตามการจองตัดแต่งผมตลอดการเดินทางของลูกค้า

* เรียนรู้จากข้อมูลทางประวัติศาสตร์เพื่อปรับปรุงความถูกต้องของการส่งเสริมเมื่อเวลาผ่านไป

* ให้การวิเคราะห์ประสิทธิภาพครบถ้วนสำหรับการปรับปรุงอย่างต่อเนื่อง

**1.2 วัตถุประสงค์ทางธุรกิจ**

* **เพิ่มอัตราการแปลง:** ส่งเสริมเบ้าลีดไปยังผู้ดูแลที่มีประสิทธิภาพสูงสุดสำหรับแต่ละประเภทคดี

* **เพิ่มการป้องกันการไม่โปรแกรม:** ติดตามประสิทธิภาพของทันตแพทย์และเมตริกส์ความมุ่งมั่นของผู้ป่วย

* **ปรับปรุงผลตอบแทนการลงทุนเชิงโฆษณา:** ระบุแคมเปญและช่องทางที่มีประสิทธิภาพสูง

* **ปรับปรุงประสบการณ์ของลูกค้า:** เวลาตอบสนองที่เร็วขึ้น การกำหนดที่ปรึกษาที่เหมาะสมกว่า

* **เปิดใช้งานการตัดสินใจโดยขับเคลื่อนด้วยข้อมูล:** การวิเคราะห์ครบถ้วนเกี่ยวกับประสิทธิภาพของผู้ดูแล ทันตแพทย์ และช่องทาง

* **ความสามารถในการปรับขนาด:** สนับสนุนการเติบโตของทีมด้วยการจัดการความสามารถของผู้ดูแลแบบไดนามิก

**1.3 ขอบเขต**

**อยู่ในขอบเขต:**

* การรวบรวมข้อความจากหลายช่องทาง (LINE OA, Facebook Messenger, Instagram DM, TikTok DM)

* การระบุและจำแนกลูกค้า

* อัลกอริทึมการส่งเสริมกล่องเข้าแบบอัจฉริยะ

* การติดตามประสิทธิภาพสำหรับผู้ดูแลและทันตแพทย์

* แดชบอร์ดการวิเคราะห์และรายงาน

* การรวมเข้ากับระบบ ERP ที่มีอยู่

* จุดการรวม AI Chatbot

**นอกขอบเขต:**

* การพัฒนา AI Chatbot (โครงการแยกต่างหาก)

* การปรับปรุงระบบ CRM

* ระบบการประมวลผลการชำระเงิน

* แอปมือถือของลูกค้า

---

**2\. ข้อกำหนดการรวมช่องทาง**

**2.1 ช่องทางการสื่อสารที่รองรับ**

| ช่องทาง | ความสำคัญ | วิธีการผสานรวม | คุณภาพที่คาดหวัง |
| :---- | :---- | :---- | :---- |
| LINE Official Account | สูง | LINE Messaging API | จุดประสงค์สูงสุด เหมาะสำหรับการนัดหมาย |
| Facebook Messenger | สูง | Facebook Graph API | จุดประสงค์แบบผสม การมีส่วนร่วมที่ดี |
| Facebook Click-to-Message Ads | สูง | API \+ การติดตามโฆษณา | ขับเคลื่อนโดยแคมเปญ คุณภาพแตกต่างกัน |
| Instagram Direct Messages | ปานกลาง | Instagram Graph API | การโฟกัสด้านความสวยงามที่แข็งแกร่ง เบ้าลีดครบบริการจดเรียง |
| TikTok Direct Messages | สูง | TikTok API / Webhook | ผู้ชมที่อายุน้อยกว่า การท่องเบ้าลีดสูง |

**2.2 คุณลักษณะเฉพาะช่องทาง**

**LINE OA:**

* เทมเพลตการตอบสนองอัตโนมัติพร้อมปุ่มการตอบสนองด่วน

* การนำทางเมนูสมบูรณ์สำหรับหมวดหมู่บริการ

* การติดตาม QR code ต่อแคมเปญ

* การส่งเสริมเส้นทางเร็วของลูกค้า VIP

**Facebook & Instagram:**

* การแยกรหัสโฆษณา / รหัสแคมเปญจากพารามิเตอร์ UTM

* การสร้างเธรดการสนทนาอัตโนมัติ

* การสนับสนุนไฟล์สื่อ (รูปภาพ วิดีโอสำหรับกรณีที่ปรึกษาด้านความสวยงาม)

**TikTok:**

* การแยกวิเคราะห์แบบฟอร์มการจับเบ้าลีด

* การแยกข้อมูลอายุ / ประชากรศาสตร์ที่มี

* การตรวจสอบสัญญาณจุดประสงค์สูง

**2.3 Real-Time Message Delivery**

* Message arrival to system: \< 2 seconds

* Message to admin display: \< 3 seconds

* System must handle peak 500+ messages/minute

* Message queue with automatic retry on failure

---

**3\. การระบุและจำแนกลูกค้า**

**3.1 การจับคู่บันทึกลูกค้า (ระบบ A1)**

**วัตถุประสงค์:** กำหนดว่าข้อความขาเข้ามาจากลูกค้าใหม่หรือเก่า

**ตรรกะการจับคู่ \- ใช้ตัวระบุที่มีทั้งหมด:**

1. **เลขโทรศัพท์** (ตัวระบุหลัก)

   * ทำให้รูปแบบไทยเป็นมาตรฐาน \+66

   * การจับคู่แบบคลุมเครือสำหรับข้อผิดพลาดเล็กน้อย

   * จับคู่กับฟิลด์โทรศัพท์ ERP

2. **รหัสผู้ใช้ LINE**

   * การค้นหาฐานข้อมูลโดยตรง

   * สำคัญสำหรับลูกค้า LINE ซ้ำ

3. **Facebook PSID (Page Scoped ID)**

   * ตัวระบุผู้ใช้เฉพาะ Facebook

   * ยังคงอยู่ในการสนทนา

4. **รหัสผู้ใช้ Instagram**

   * การจับคู่ด้านจัดการ / รหัสผู้ใช้ Instagram

   * การจับคู่โดยไม่สนใจตัวพิมพ์ใหญ่เล็ก

5. **รหัสผู้ใช้ TikTok**

   * การทำให้ชื่อผู้ใช้ TikTok เป็นมาตรฐาน

   * จัดการรูปแบบชื่อผู้ใช้ที่แตกต่างกัน

6. **ที่อยู่อีเมล**

   * การจับคู่อีเมลแบบคลุมเครือ

   * ทำให้การเขียนตัวพิมพ์ใหญ่เป็นมาตรฐาน

7. **ชื่อเต็ม (การจับคู่แบบคลุมเครือ)**

   * ชื่อจริง \+ นามสกุลจับคู่ที่แน่นอน

   * การจับคู่ฟอนเนติกสำหรับชื่อไทย (จัดการการเปลี่ยนแปลงเสียง)

   * สนับสนุนชื่อเล่น \+ การรวมนามสกุล

   * ตัวอย่าง: "สมชาย" อาจจับคู่กับ "สมชาย หวังสุข" หรือชื่อเล่น "เจ้ม" จาก "สมชาย"

**เอาต์พุต:** pt\_id จากข้อมูลทั่วไป \+ การจำแนก (ใหม่ / เก่า)

**ผลกระทบต่อระบบ:**

* **ลูกค้าใหม่:** ส่งเสริมไปยังผู้ดูแลที่เชี่ยวชาญในการศึกษาผู้ป่วยใหม่

* **ลูกค้าเก่า:** ส่งเสริมไปยังผู้ดูแลที่มีอัตราการแปลงสูง (ผู้ปิดการจำหน่ายที่เร็วขึ้น)

**3.2 การจำแนกประเภทบริการ (ระบบ A3)**

**วัตถุประสงค์:** ระบุว่าลูกค้าสนใจบริการทันตกรรมประเภทใด

**ลำดับชั้นของการจำแนก:**

**1\. การตรวจสอบคีย์เวิร์ด (หลัก)**

| ประเภทบริการ | คีย์เวิร์ดภาษาไทย | กรณีลำดับความสำคัญ |
| :---- | :---- | :---- |
| **OT (จัดฟน)** | จัดฟน, ฟนลม, เคลียรไลน์, รีเทนเนอร์, จัดเรียง, braces | การจัดตำแหน่ง, ตัวหนึ่ง, braces |
| **DTL (ความสวยงาม)** | วีเนียร์, ครอบฟน, smile makeover, ฟนสวย, ฟนไม่สวย, aesthetic | วีเนียร์, crown, ออกแบบรอยยิ้ม |
| **GP (ทั่วไป)** | ปวดฟน, ฟนผุ, เหงือกบวม, เคี้ยวเจ็บ, scaling, filling | ปวด, โพรงฟัน, โรคเหงือก |
| **Implant (การปลูกฟน)** | รากฟนเทียม, ฟนหลุด, ฟนหาย, missing teeth | การสูญเสียฟัน, การแทนที่ |
| **Whitening (ฟอกฟัน)** | ฟนเหลือง, ฟอกสีฟน, whitening, ขาว | สีฟัน, ความสว่าง |
| **Retainer (ด้ามจับ)** | รีเทนเนอร์หาย, รีเทนเนอร์แนน, retainer broken | การถือครองหลังการรักษา |
| **Emergency (ฉุกเฉิน)** | ปวดมาก, ฟนหัก, อุบัติเหตุ, urgent, ฉุกเฉิน | ปวด, ความเสียหาย, ด่วน |
| **Cosmetic Consult (ปรึกษา)** | ความสวยงาม, อยากให้ฟนเรียง, consultation | ความสวยงามโดยรวม, รอยยิ้ม |

**2\. การตรวจสอบความหมาย / ความหมาย (AI)**

หากไม่พบคีย์เวิร์ดโดยตรง AI จะวิเคราะห์ความหมายของข้อความ:

* "เวลายิ้มแล้วฟนไม่เท่ากัน" → DTL (ความกังวลด้านความสวยงาม)

* "เคี้ยวแล้วเจ็บตรงนี้" → GP (อาการปวด)

* "อยากให้รับประกันว่าจะไม่มีปัญหา" → OT (ความเชื่อมั่นในการรักษา)

**3\. การตรวจสอบจุดประสงค์ (โทนเสียง & บริบท)**

* ความต้องการบรรเทาปวด → GP / ฉุกเฉิน (ความเร่งด่วนสูง)

* ความสนใจในการจัดตำแหน่ง → OT (ไทม์ไลน์ปานกลาง)

* เป้าหมายความงาม → DTL (วัฏจักรการตัดสินใจที่นานขึ้น)

* การบำรุงรักษา → ด้ามจับ / ติดตาม

**4\. การเรียนรู้โดยผู้ดูแล**

* หากระบบไม่แน่นอน (ความเชื่อมั่น \< 70%) ผู้ดูแลเลือกประเภทที่ถูกต้อง

* ระบบเก็บการจำแนกและการฝึกใหม่

* คาดว่าจะได้รับการปรับปรุงความถูกต้องรายสัปดาห์

**เอาต์พุต:** Service\_Type \+ ความอ่อนไหว

**3.3 การติดตามแหล่งเบ้าลีดและแคมเปญ (ระบบ A2)**

**วัตถุประสงค์:** ติดตามช่องทาง แคมเปญโฆษณา และแหล่งการตลาดสำหรับการวิเคราะห์ ROI

**จุดข้อมูลที่จะแยกออก/ตรวจหา:**

| ฟิลด์ | แหล่งที่มา | วิธีการ | ตัวอย่าง |
| :---- | :---- | :---- | :---- |
| **ช่องทาง** | ข้อมูลเมตาของข้อความ | การตรวจสอบแพลตฟอร์ม | LINE, FB, IG, TikTok |
| **ช่องทางรอง** | แหล่งข้อความ | การจำแนก | Website Chat, Google Business |
| **รหัสโฆษณา** | UTM / บริบทข้อความ | การแยกวิเคราะห์พารามิเตอร์ UTM | utm\_id=12345 |
| **รหัสแคมเปญ** | UTM / แพลตฟอร์มโฆษณา | การติดตามแคมเปญ | utm\_campaign=whitening\_2026\_q1 |
| **พารามิเตอร์ UTM** | URL ในข้อความ | การแยกออก | utm\_source, utm\_medium, utm\_content |
| **สร้างโฆษณา** | ข้อมูลเมตา Facebook/IG | การค้นหาไลบรารี่โฆษณา | รูปภาพ, วิดีโอ, สำเนา |
| **ส่วนของผู้ชม** | ข้อมูลเมตาการกำหนดเป้าหมายโฆษณา | Facebook Ads Manager | Lookalike, Interest-based |

**ระดับคุณภาพของช่องทาง (สำหรับการส่งเสริมแบบอัจฉริยะ):**

1. **ระดับ 1 (จุดประสงค์สูงสุด):** Website Chat, Google Business, โทรศัพท์

2. **ระดับ 2 (จุดประสงค์สูง):** LINE OA, Click-to-Message Ads

3. **ระดับ 3 (จุดประสงค์ปานกลาง):** Facebook Messenger, Facebook standard ads

4. **ระดับ 4 (ความเป็นจริง):** Instagram DM, TikTok DM

**เอาต์พุต:** ช่องทาง \+ Ad\_ID \+ Campaign\_ID \+ พารามิเตอร์ UTM \+ Lead\_Quality\_Tier

---

**4\. อัลกอริทึมการส่งเสริมกล่องเข้าแบบอัจฉริยะ**

**4.1 การจัดการความสามารถของผู้ดูแล**

**วัตถุประสงค์:** ป้องกันการโอเวอร์โหลดของผู้ดูแลในขณะเพิ่มผลผลิตให้สูงสุด

**กระบวนการ:**

1. **คำนวณความสามารถสูงสุด (ต่อผู้ดูแล)**

   * เริ่มต้นด้วยการประมาณอย่างระมัดระวัง (เช่น 3 แชท)

   * เพิ่มขึ้นทีละน้อยพร้อมการตรวจสอบอัตราการปิด

   * เมื่ออัตราการปิดลดลง \> 5% ให้หยุดการเพิ่มขึ้น

   * ความสามารถที่เสถียรสูงสุดจะกลายเป็นขีดจำกัดของผู้ดูแล

   * คำนวณใหม่ทุกเดือนเพื่อพิจารณาการปรับปรุงทักษะ

2. **การตรวจสอบความสามารถแบบเรียลไทม์**  
   Active\_Inboxes(admin) \< Maximum\_Capacity(admin)

   * นับเฉพาะแชทที่ใช้งานอยู่เท่านั้น

   * ระบบข้ามผู้ดูแลหากอยู่ในความสามารถ

   * พิจารณาผู้ดูแลที่มีอื่น ๆ โดยอัตโนมัติ

3. **กฎการแทนที่ความสามารถ**

   * **ลูกค้า VIP:** ข้ามไปผู้จัดการ VIP ที่มอบหมายให้

   * **กรณีฉุกเฉิน:** ส่งเสริมทันทีโดยไม่คำนึงถึงความสามารถ

   * **กรณีเชี่ยวชาญ:** ส่งเสริมไปยังผู้เชี่ยวชาญแม้จะมากกว่าเล็กน้อย (พร้อมการแจ้งเตือน)

4. **ตัวชี้วัดภาพ (แดชบอร์ดผู้ดูแล)**

   * แสดงการโหลดปัจจุบัน: 3/5 แชท

   * การเตือนสี: เขียว (ปลอดภัย) เหลือง (85%+) แดง (ที่ความสามารถ)

   * การเปิดความสามารถครั้งต่อไปโดยประมาณ

**4.2 ระบบการให้คะแนนประสิทธิภาพของผู้ดูแล**

**วัตถุประสงค์:** สร้างโปรไฟล์ที่ขับเคลื่อนด้วยข้อมูลของจุดแข็งของผู้ดูแลแต่ละคน

**ก. อัตราการปิดของผู้ดูแล (%)**

**สูตร:**  
Admin\_Close\_Rate \= (โครงการจำนวนรวมทั้งหมด ÷ Total\_Chats) × 100

**การติดตาม:**

* คำนวณรายสัปดาห์ รายเดือน รายไตรมาส รายปี

* ติดตามแยกต่างหากต่อ Service\_Type (อัตราการปิด OT, อัตราการปิด DTL ฯลฯ)

* ติดตามแยกต่างหากต่อ Channel (อัตราการปิด LINE, อัตราการปิด FB ฯลฯ)

* ติดตามแยกต่างหากต่อ Lead\_Quality\_Tier

**ตัวอย่าง:**

* ผู้ดูแล "แอนนา" ทั้งหมด: การจองทั่วไป 40 จากการแชท 100 \= 40% อัตราการปิด

* Anna OT: 20 การจองจากการแชท OT 40 \= 50% อัตราการปิด (ผู้เชี่ยวชาญ\!)

* Anna DTL: 15 การจองจากการแชท DTL 50 \= 30% อัตราการปิด (อ่อนแอกว่า)

**การใช้งาน:** ส่งเสริมกรณี OT ไปยัง Anna หลีกเลี่ยงการกำหนด DTL

**ข. คะแนนความเสี่ยงการไม่แสดงตัวของผู้ดูแล (%)**

**สูตร:**  
No\_Show\_Risk \= (ไม่แสดงรวม ÷ รวมการจอง) × 100

**การติดตาม:**

* วัดคุณภาพของการจองที่สร้างขึ้น

* ความเสี่ยงต่ำ \= สัญญาที่สมจริง การกำหนดความคาดหวังที่แข็งแกร่ง

* ความเสี่ยงสูง \= การจองง่าย ๆ แต่ผู้ป่วยไม่แสดงตัว

* ติดตามแยกต่างหากต่อผู้ดูแล โดยรวม และเกณฑ์อื่น ๆ

**ตัวอย่าง:**

* ผู้ดูแล "บ็อบ" สร้างการจอง 50 ครั้ง ไม่แสดง 10 ครั้ง \= ความเสี่ยง 20% (สูงเกินไป)

* ผู้ดูแล "แคโรล" สร้างการจอง 40 ครั้ง ไม่แสดง 2 ครั้ง \= ความเสี่ยง 5% (ยอดเยี่ยม)

**ผลกระทบ:**

* ลดหรือหยุดการกำหนดใหม่ให้กับ Bob

* ระบบแนะนำให้ Bob ปรับปรุงการสื่อสารและการโทรยืนยัน

* Carol ได้รับเบ้าลีดที่มีจุดประสงค์สูง (กรณีพิเศษ)

**ค. คะแนนคุณภาพการติดตาม**

**สูตร:**  
Follow\_Up\_Score \= (ความสม่ำเสมอ × 0.4) \+ (เวลา × 0.3) \+ (ปลุกปลั่นเบ้าลีด × 0.3)

**ส่วนประกอบ:**

* **ความสม่ำเสมอ (40%):** ผู้ดูแลติดตามผู้ที่ไม่ตอบสนองอย่างสม่ำเสมอหรือไม่

* **เวลา (30%):** นานแค่ไหนหลังจากติดต่อครั้งแรก (ในอุดมคติ: ภายใน 24 ชั่วโมง)

* **เบ้าลีดที่ปลุกปลั่น (30%):** % ของเบ้าลีดที่ไม่ตอบสนองที่แปลงร่างหลังการติดตาม

**การใช้งาน:** ส่งเสริม DTL, OT, กรณีวัฏจักรยาว (การตัดสินใจช้า) ไปยังผู้ดูแลติดตามที่มีคะแนนสูง

**ง. คะแนนความเร็วในการตอบสนอง**

**สูตร:**  
Response\_Speed\_Score \= 100 \- (นาทีตอบสนองครั้งแรกเฉลี่ย ÷ 60\) \[จำกัดที่ 100\]

**เกณฑ์มาตรฐาน:**

* 0-5 นาที: 100 คะแนน (ยอดเยี่ยม)

* 5-15 นาที: 80 คะแนน (ดี)

* 15-30 นาที: 60 คะแนน (ยอมรับได้)

* 30+ นาที: \< 60 คะแนน (ช้าเกินไป)

**การติดตาม:**

* ติดตามเวลาตอบสนองครั้งแรก

* ติดตามเวลาตอบสนองเฉลี่ยตลอดการสนทนา

* ติดตามแยกต่างหากต่อเวลาของวัน (เช้า บ่าย เย็น กลางคืน)

**การใช้งาน:** ส่งเสริมเบ้าลีดที่เร่งด่วนไปยังผู้ดูแลที่เร็ว กำหนดกะกลางคืนให้ผู้ดูแลที่มีประสิทธิภาพดีในตอนเย็น

**E. Peak-Time Performance Score**

**Formula:**  
Peak\_Perf\_Score(time\_segment) \= Close\_Rate(time\_segment)

**Examples:**

* Admin "David": 30% close rate morning, 55% close rate night (excel at evenings)

* Admin "Emma": 60% close rate morning, 20% close rate night (excel at mornings)

**Usage:** Route night leads to David, morning leads to Emma

**F. Negotiation & Objection Handling Score**

**Formula:**  
Objection\_Score \= (Resolved\_Objections ÷ Total\_Objections) × 100

**Types of Objections Tracked:**

* Price objections ("Too expensive", "Can you discount?")

* Trust objections ("How do I know you're good?")

* Timing objections ("Not now, maybe later")

* Procedure objections ("Does it hurt?")

**AI Evaluation:**

* System analyzes chat to identify when admin successfully countered objection

* Admin explains value, provides alternatives, addresses concern

**Usage:** Route premium cases (implant, OT, DTL) to high-scoring admins; avoid high-value cases for low-scoring admins

**G. Conversation Efficiency Score**

**Formula:**  
Efficiency\_Score \= Average\_Messages ÷ Time\_to\_Booking (lower is better)

**Interpretation:**

* Fewer messages \+ quick booking \= excellent communication

* Too many messages \= admin unclear, inefficient

* No booking \= likely lost lead

**Usage:** Route time-sensitive leads to efficient admins

**H. Lead-Type Specialization Score**

**Formula:**  
Specialization\_OT \= (OT\_Bookings ÷ Total\_OT\_Chats) × 100  
Specialization\_DTL \= (DTL\_Bookings ÷ Total\_DTL\_Chats) × 100  
\[Same for GP, Implant, Whitening, Emergency\]

**Tracking:**

* Separate close rate per service type

* Identify which admin specializes in which service

**Example:**

* Admin "Frank": OT specialist (70%), average at others (40%)

* Admin "Grace": DTL specialist (65%), GP specialist (60%), average at OT (35%)

**Usage:** Route OT cases to Frank, mixed/complex cases to Grace

**4.3 Admin Score & Ranking**

**Primary Ranking Formula:**

Admin\_Score \= Admin\_Close\_Rate(service\_type) × (1 − Admin\_No\_Show\_Risk)

**Interpretation:**

* Balances conversion ability with booking quality

* Filters out admins who book easily but have high no-shows

* Recalculate weekly

**Example:**

* Admin "Helen": 50% close rate, 10% no-show risk

  * Score \= 0.50 × (1 \- 0.10) \= 0.50 × 0.90 \= **0.45**

* Admin "Iris": 40% close rate, 2% no-show risk

  * Score \= 0.40 × (1 \- 0.02) \= 0.40 × 0.98 \= **0.39**

* **Result:** Route to Helen (higher score) despite lower close rate, because bookings actually show up

**Secondary Ranking Filters (Applied in sequence if needed):**

1. **Peak-Time Performance:** If lead arrived during specific time, use time-specific close rate

2. **Specialization Match:** Boost score if admin specializes in case type

3. **Channel Expertise:** Boost score if admin performs well on that channel

4. **Follow-Up Strength:** For long-cycle cases (OT, DTL), use follow-up score

5. **Availability:** Capacity check (must be \< maximum)

**Final Assignment Logic:**

1. Calculate Admin\_Score for all available admins (capacity \< max)

2. Apply secondary filters (time, specialization, channel, follow-up)

3. Sort by score (highest first)

4. Assign to top scorer

5. Real-time routing (no queue)

**4.4 Inbox Assignment Execution**

**Real-Time Delivery:**

1. **Message Received** → System processes in \< 1 second

2. **Classification Complete** → Customer, service type, source identified

3. **Admin Selected** → Top-scoring available admin identified

4. **Assignment Notification** → Admin receives push notification, sound alert, in-app badge

5. **Message Display** → Message appears in admin's inbox with full context:

   * Customer history (if OLD)

   * Service type icon

   * Lead source / ad campaign

   * Recommended dentist(s)

   * Customer risk score (no-show, price sensitivity)

**Notification Details:**

* Sound alert for high-intent leads (website, Google Business)

* Silent for lower-intent leads (TikTok, discovery)

* Increase urgency alert for emergency cases

**Context Information Displayed to Admin:**

| Field | Value | Purpose |
| :---- | :---- | :---- |
| Customer Status | NEW / OLD | Routing optimization |
| Service Type | OT / DTL / GP / etc. | Context for response |
| Customer History | Lifetime spend, previous cases, upcoming appointments | Personalization |
| Lead Quality | Tier 1-4 | Priority indicator |
| Ad Campaign | Campaign name, Ad ID | Attribution for ROI |
| No-Show Risk | Low / Medium / High | Follow-up intensity |
| Price Sensitivity | Low / Medium / High | Objection handling approach |
| Recommended Dentist | Name, specialization, success rate | Closing suggestion |
| Last Response Time | Time since last customer message | Urgency indicator |

---

**5\. การติดตามประสิทธิภาพและการวิเคราะห์**

**5.1 เมตริกประสิทธิภาพของผู้ดูแล**

**แดชบอร์ดแบบเรียลไทม์:**

| เมตริก | การคำนวณ | ความถี่การอัปเดต | เป้าหมาย |
| :---- | :---- | :---- | :---- |
| แชทที่ใช้งานอยู่ | นับการสนทนาสด | เรียลไทม์ | \< ความสามารถสูงสุด |
| อัตราการปิด | การจอง ÷ แชท | รายสัปดาห์ | 40%+ |
| ความเสี่ยงการไม่แสดงตัว | ไม่แสดง ÷ การจอง | รายสัปดาห์ | \< 5% |
| ความเร็วในการตอบสนอง | เวลาตอบสนองครั้งแรกเฉลี่ย | รายวัน | \< 10 นาที |
| ข้อความเฉลี่ย | ข้อความ ÷ การจอง | รายสัปดาห์ | \< 15 |
| คุณภาพการติดตาม | (ความสม่ำเสมอ × 0.4) \+ (เวลา × 0.3) \+ (ปลุกปลั่น × 0.3) | รายสัปดาห์ | 70%+ |
| อัตราการปิดเวลาพิเศษ | ตามเช้า / บ่าย / เย็น / คืน | รายสัปดาห์ | ส่วนบุคคล |
| อัตราการเชี่ยวชาญ | อัตราการปิดต่อประเภทคดี | รายเดือน | 50%+ ในสาขาเชี่ยวชาญ |
| การจัดการคัดค้าน | แก้ไข ÷ รวม | ทุก 2 สัปดาห์ | 70%+ |
| ความพึงพอใจของลูกค้า | คะแนนสำรวจหรือ NPS | รายเดือน | 8+/10 |

**การแจ้งเตือนประสิทธิภาพของผู้ดูแล:**

* **สัญญาณเขียว:** อัตราการปิด \> 50% ไม่แสดง \< 5% ตอบสนองอย่างรวดเร็ว

* **สัญญาณเหลือง:** อัตราการปิด 30-40% ไม่แสดง 10-15% ตอบสนอง \> 20 นาที

* **สัญญาณแดง:** อัตราการปิด \< 30% ไม่แสดง \> 20% ตอบสนอง \> 60 นาที

**การฝึกอบรมและการปรับปรุง:**

* ระบบแฟล็กอัตโนมัติสำหรับผู้ที่ประสิทธิภาพต่ำ

* การทริกเกอร์การตรวจสอบผู้จัดการ

* หัวข้อการฝึกอบรมที่แนะนำโดยยึดตามเมตริกที่อ่อนแอ

**5.2 Dentist Performance Metrics**

**Tracking by Service Type & Channel:**

| Metric | Calculation | Purpose |
| :---- | :---- | :---- |
| **Close Rate (Treatment Acceptance)** | Treatments Accepted ÷ Consultations | Ability to convert patient → treatment |
| **Comeback Rate** | Repeat Patients ÷ Total with Previous Visit | Loyalty and long-term trust |
| **Dentist Score** | Close Rate × Comeback Rate | Overall strength for recommendation |
| **Acceptance by Type** | (OT Accepted ÷ OT Consult), (DTL Accepted ÷ DTL Consult), etc. | Service specialization |
| **Cancellation Rate** | Cancelled Appointments ÷ Total Booked | Schedule stability |
| **Reschedule Rate** | Rescheduled ÷ Total Booked | Patient hesitation indicator |
| **Patient Satisfaction** | Survey/NPS score | Service quality |

**Dentist Recommendation Engine:**

For incoming case of type \[Service\_Type\]:

1. Find all dentists who have treated this type

2. Calculate Dentist\_Score \= (Close\_Rate × 0.6) \+ (Comeback\_Rate × 0.4)

3. Rank by score

4. Recommend top 3 dentists to admin

5. Admin suggests recommended dentist to patient

**Example:**

* Patient interested in OT (braces)

* Calculate OT-specific close rate for each dentist

* Dr. A: 80% OT close rate, 70% comeback \= score 0.76

* Dr. B: 60% OT close rate, 75% comeback \= score 0.665

* Recommend Dr. A first, Dr. B second

**5.3 Channel & Campaign Analytics**

**Channel Performance Scorecard:**

| Channel | Metrics Tracked | Business Impact |
| :---- | :---- | :---- |
| **LINE OA** | Volume, close rate, response time, comeback rate | Highest value channel |
| **Facebook Messenger** | Volume, close rate, channel quality, ad performance | Mid-value, high volume |
| **FB Click-to-Message Ads** | Volume, cost-per-lead, close rate, ROI by ad | Campaign attribution |
| **Instagram DM** | Volume, case type distribution, aesthetic case rate | Cosmetic lead source |
| **TikTok DM** | Volume, age group, intent score, browsing behavior | Awareness \+ discovery |

**Campaign ROI Calculation:**

Campaign\_ROI \= (Total\_Revenue\_from\_Campaign − Campaign\_Cost) ÷ Campaign\_Cost × 100%

Where:

* Total\_Revenue \= All treatments started from leads in campaign

* Campaign\_Cost \= Ad spend for that campaign

**Attribution Model:**

* **First-Touch:** Which channel first brought customer?

* **Last-Touch:** Which channel completed the booking?

* **Multi-Touch:** Weighted credit across all touchpoints

**Example:**

* Customer sees TikTok ad (first touch) → visits website (second touch) → messages LINE (last touch)

* Attribution: TikTok 20%, Website 30%, LINE 50%

**5.4 Lead Quality Scoring System**

**Real-Time Intent Detection:**

| Signal | Points | Example |
| :---- | :---- | :---- |
| **Specific service query** | \+30 | "How much for braces?" |
| **Dental pain/problem** | \+40 | "My tooth hurts" |
| **Multiple questions asked** | \+15 | Asks about 3+ details |
| **Asks for appointment** | \+50 | "Can I book tomorrow?" |
| **Phone number provided** | \+10 | Volunteer contact info |
| **Browsing only** | \-20 | "Just looking" |
| **Price-only focus** | \-15 | Only asks cost, no symptoms |
| **Generic question** | \-10 | Vague inquiry |

**Lead Quality Tiers:**

* **Tier 1 (Score 80+):** Immediate routing, fastest admin, no queue

* **Tier 2 (Score 60-79):** Standard routing, preferred admins

* **Tier 3 (Score 40-59):** Standard routing, any available admin

* **Tier 4 (Score \< 40):** Lower priority, educational content focus

**No-Show Risk Prediction:**

AI model predicts no-show probability based on:

* Customer response speed (slow repliers likely no-shows)

* Channel type (website leads lowest risk, TikTok higher)

* Wording analysis (commitment signals vs. "maybe later")

* History (if OLD customer, use past behavior)

**Output:** No-Show Risk Score 0-100%

**Routing Impact:**

* Low risk (\< 10%): Premium dentist assignment

* Medium risk (10-30%): Standard dentist

* High risk (\> 30%): Confirmation call required, reminder SMS

---

**6\. Customer Journey Tracking**

**6.1 Patient Funnel Stages**

**Service-Specific Journey (Orthodontics Example):**

| Stage | Action | Booking Decision | Tracking |
| :---- | :---- | :---- | :---- |
| **1\. Inbox** | Customer inquires about OT | Book initial consultation or decline | Record interest intent |
| **2\. Scan** | Patient attends 3D scan appointment | Book treatment or seek second opinion | Booking completion rate |
| **3\. Rescan (if needed)** | Corrected scan if first inadequate | Book treatment or return to inbox | Re-engagement rate |
| **4\. Clear (GP Prep)** | Mandatory scaling/filling before braces | Complete prep or delay | Compliance rate |
| **5\. Bracket** | Braces installation appointment | Treatment starts or cancels | Treatment commencement |
| **6\. Adjustment** | Regular adjustment visits | Continue treatment or drop out | Retention rate |
| **7\. Retainer** | Post-treatment retainer purchase | Retention product sold or not | Upsell rate |

**Service-Specific Journey (General Dentistry Example):**

| Stage | Action | Booking Decision | Tracking |
| :---- | :---- | :---- | :---- |
| **1\. Inbox** | Customer reports pain/symptom | Book appointment or seek other dentist | Conversion rate |
| **2\. Consultation** | Initial exam and diagnosis | Accept treatment or get opinion | Treatment acceptance |
| **3\. Treatment** | Execute scaling, filling, extraction, etc. | Complete or abandon | Completion rate |
| **4\. Follow-up** | Post-treatment care and recovery | Return for check-up or self-care | Follow-up rate |

**Service-Specific Journey (Aesthetic/DTL Example):**

| Stage | Action | Booking Decision | Tracking |
| :---- | :---- | :---- | :---- |
| **1\. Inbox** | Cosmetic consultation inquiry | Book consultation or gather info | Interest conversion |
| **2\. Design Consultation** | Design plan and simulation | Approve design or request changes | Design acceptance |
| **3\. Treatment Planning** | Cost, timeline, payment discussion | Confirm treatment or decline | Commitment rate |
| **4\. Treatment** | Veneer, crown, whitening execution | Completion rate | Treatment completion |
| **5\. Follow-up** | Post-treatment care, satisfaction check | Positive feedback and retention | Satisfaction & retention |

**6.2 Stage-Specific Admin Assignment**

**Inbox Stage (High-Value Routing):**

* Route to highest-scoring admin for case type

* Route to specialist if available

* Route to fastest responder

**Post-Booking Stages (Confirmation & Follow-Up):**

* Assigned admin continues with patient

* Alternative admin only if primary unavailable

* Dentist handles clinical decisions

* Admin handles admin/scheduling follow-up

**Re-Engagement Tracking:**

* If customer doesn't book at Inbox stage, mark as "Pending"

* After 7 days, trigger follow-up

* Assign to follow-up specialist

* Track revival success rate

---

**7\. การจัดการลูกค้า VIP**

**7.1 เกณฑ์การจำแนก VIP**

**ลูกค้าจัดอยู่ในหมวด VIP หาก:**

1. **มูลค่าตลอดอายุสูง**

   * ยอดรวมการใช้จ่าย \> ฿100,000

   * ใช้งานมากกว่า 3 ปี

   * สมาชิกครอบครัวหลายคนเป็นผู้ป่วย

2. **กรณีที่ค่าสูงเมื่อเร็ว ๆ นี้**

   * การปลูกฟนเมื่อเร็ว ๆ นี้ การฟื้นฟูปากเต็ม OT

   * มูลค่าการรักษาที่รอดำเนินการ \> ฿50,000

3. **แหล่งอ้างอิง**

   * อ้างอิง 5+ ผู้ป่วยใหม่

   * ผู้ส่งเสริมอย่างแข็งขัน / แบรนด์แอมบาสเดอร์

4. **ความน่าเชื่อถือในการจอง**

   * การเข้าชมที่สมบูรณ์แบบ (ไม่มีการไม่แสดงตัว)

   * มาแต่เนิ่นเสมอ

   * เสร็จสิ้นแผนการรักษาแบบเต็ม

5. **ความชอบของพนักงาน**

   * ผู้ดูแลหรือทันตแพทย์เฉพาะที่พวกเขาเชื่อใจ

   * ขอให้คนเดียวกันซ้ำแล้วซ้ำเล่า

6. **ธุรกิจ / การเป็นหุ้นส่วน**

   * บัญชีองค์กร

   * พนักงานบริษัทกลุ่ม

   * โปรแกรมการเป็นหุ้นส่วน

**7.2 การจัดการพิเศษ VIP**

**ลำดับความสำคัญในการส่งเสริม:**

* ส่งเสริมไปยังผู้ดูแล / ทันตแพทย์ที่ต้องการทันที

* ข้ามข้อจำกัดความสามารถหากจำเป็น

* กำหนดผู้จัดการบัญชีโดยเฉพาะหากการใช้จ่าย \> ฿200k/ปี

**การสื่อสาร:**

* เทมเพลตการตอบสนองที่ปรับตัว

* ระบบการทักทายวันเกิด / การทักทายครบรอบ

* การแจ้งเตือนข้อเสนอพิเศษ

**บริการ:**

* การจองการแต่งตัดแบบลำดับความสำคัญ (สล็อตสงวน)

* หมายเลขติดต่อโดยตรงไปยังผู้ดูแลที่ต้องการ

* โปรแกรมพิมพ์ความภักดี

**ความเป็นส่วนตัวของข้อมูล:**

* โฟลเดอร์ VIP แยกต่างหากในระบบ

* หมายเหตุสถานะ VIP ที่โดดเด่น

* จำกัดการเข้าถึงสำหรับพนักงานเฉพาะ

---

**8\. System Architecture & Integration**

**8.1 Data Integration Points**

**Inbound Integrations (Receiving Data):**

| Source | API/Method | Data | Frequency |
| :---- | :---- | :---- | :---- |
| LINE OA | LINE Messaging API | Messages, media, user profile | Real-time |
| Facebook | Facebook Graph API | Messages, PSID, ad info | Real-time |
| Instagram | Instagram Graph API | DMs, media, user info | Real-time |
| TikTok | TikTok API / Webhook | Lead form, DMs, user data | Real-time |
| ERP System | Database API | Customer pt\_id, history, dentist | On-demand |
| Ad Platform | Facebook Ads Manager, TikTok Ads, Google Ads | Ad ID, campaign, spend, conversion | Daily |
| Booking System | Calendar API / Database | Appointment status, dentist info | On-demand |

**Outbound Integrations (Sending Data):**

| Target | API/Method | Data | Frequency |
| :---- | :---- | :---- | :---- |
| Admin Apps | Push notifications, in-app messaging | Inbox assignment, urgent alerts | Real-time |
| ERP System | Database API | Customer interaction log, booking result | Per transaction |
| Analytics Platform | Webhook / Database sync | Performance data, metrics | Daily |
| Reporting Dashboard | API endpoints | Dashboard metrics, charts | Real-time |
| Email System | SMTP / Marketing API | Follow-up emails, reminders | On-demand |

---

**9\. AI Chatbot Integration (Separate Project)**

**9.1 Chatbot Scope & Functions**

**Note:** AI Chatbot is a separate project but integrates with Chat Management System

**Chatbot Responsibilities:**

1. **Automated Customer Greeting & Qualification**

   * Greet customer immediately (\< 3 seconds)

   * Present quick reply buttons for service selection

   * Collect initial information

2. **Automatic Service Type Detection**

   * Analyze customer message for service type

   * Provide service-specific responses

   * Ask clarifying questions if needed

3. **Appointment Availability Check**

   * Query dentist availability

   * Present available time slots

   * Collect appointment preference

4. **Initial Information Gathering**

   * Phone number

   * Name

   * Customer type (NEW / OLD)

   * Preferred dentist

   * Insurance info

   * Medical history for OT cases

5. **FAQ Handling & Education**

   * Answer common questions about procedures

   * Cost information / standard pricing

   * Post-treatment care instructions

   * Treatment duration expectations

6. **Fallback to Human Admin**

   * If chatbot confidence \< threshold → escalate to admin

   * Pass all collected information to admin

   * Warm handoff (chatbot → human)

**9.2 Chatbot-Chat Management Integration Points**

**Information Handoff:**  
AI Chatbot collects:  
├─ Customer identification (phone, name)  
├─ Service type intent  
├─ Lead quality signals  
└─ Appointment preference

↓ Passes to Chat Management System:  
├─ Enriched customer record  
├─ Pre-classified service type  
├─ Lead quality score  
└─ Available dentist slots (for admin to suggest)

**Routing Optimization:**

* Chatbot pre-qualifies leads

* Chat Management receives higher-quality leads

* Admin conversion rate improves

* Response time reduced

**Performance Tracking:**

* Track which leads chatbot handles fully vs. escalates

* Measure chatbot resolution rate

* Monitor handoff quality

* Identify gaps for chatbot improvement

---

