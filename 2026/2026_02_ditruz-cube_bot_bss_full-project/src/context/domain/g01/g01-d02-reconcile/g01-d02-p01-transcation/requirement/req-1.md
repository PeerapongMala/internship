เบืองต้น g01-d02-p01-transcation

หรือ หน้า Reconcile Transaction 

โดย

เชือมจาก http://localhost:7050/BSS_WEB/Main/OperationSetting

เลือกประเภท ธนบัตร เลือก  Oparetion เป็น Reconciliation กด เข้าสู่การทำงาน

เพื่อเข้าหน้า ของ domain reconcile ตรงนี้่เราจะมาทำต่อ

เหมือนส่วน reconcile ยังไม่เคยสร้าง frontend backend มาก่อน

วิธีการเขียนต่างๆ สามารถ อิงจาก เอกสารใน g01-d01-preparation ได้

แล้วไปค้่นใน project/frontend , project/backend อีกที

เบื่องต้นผมมีไฟล์ figma ให้ ส่งจาก figma mcp 

อยากให้เอา figma ที่ดึงมาได้ เก็บไว้ใน 

g01-d02-p01-transcation/design/

เวลาทำเสร็จตอนมาตรวจจะได้ตรวจจาก repo เลยไม่ต้องออกไปดึง figma อีก
ดึงข้อมูล ดึง screenshot อะไรก็เอามาใส่

ทีนี้ พวก popup หาก ลง code ก็ทำแยกๆ ไว้ใน g01-d02-p01-transcation/popup ไว้

ทั้งนี้ full project จะเอาไว้เก็บ ข้อมูล ai และ doc 

ส่วน project/frontend , project/backend เป็น source code และ project ลูกค้าจริงๆ

ให้คงของเดิม รูปแบบเดิม

ฝากเขียนแผน ดูว่า เราจะสามารถสร้าง reconcile ของเราขึ้นมาได้ไหมเมื่ออ้างอิง preparation

จริงๆ reconcile ยังมีอีกหลายๆหน้า แต่อยากทำ หน้า reconcile transalation ให้เรียบร้อยก่อน แล้วจะได้ทำหน้าอื่นๆเพิ่ม

โดยมี figma 

https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=2-34689&m=dev

อันนี้เป็น flow ทั้งหมด ของ reconcile แล้ว link figma  ที่เหลือ ก็เป็น layer ข้างในของ link flow ทั้งหมดอีกที

หลักๆหน้าตาเป็นแบบนี้

https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=32-25438&m=dev


โดยจะมี css 4 แบบ

unfit
https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=32-26428&m=dev

UNSORT CC
https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=2-36001&m=dev

UNSORT CA MEMBER
https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=2-36565&m=dev

UNSORT CA NON MEMBER
https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=2-37129&m=dev


ตรงนี้ feature ทำงานเหมือนกันหมด ใช้ร่วมกันได้ ต่างกันแค่สีและข้อความ แค่ว่าตอนยิง api มันจะต้องระบุประเภทแยกกัน

และมีรายละเอียดอื่นๆ 
https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=2-38451&m=dev
https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=2-39725&m=dev
https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=2-43372&m=dev

และมี pop up ต่างๆ ดังนี้

https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=2-41247&m=dev