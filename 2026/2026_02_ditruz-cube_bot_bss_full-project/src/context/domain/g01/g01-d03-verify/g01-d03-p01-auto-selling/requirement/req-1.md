เบืองต้น g01-d03-p01-auto-selling
หรือ หน้า Verify Auto Selling

ตอนนี้ก็ไม่รู้ว่าเข้าจากหน้าไหนเหมือนกัน

แต่การทำงานโครงสร้างคล้าย
g01-d02-p01-transcation
มากๆ

เหมือนส่วน verify ยังไม่เคยสร้าง frontend backend มาก่อน

วิธีการเขียนต่างๆ สามารถ อิงจาก เอกสารใน g01-d02-p01-transcation ได้

แล้วไปค้่นใน project/frontend , project/backend อีกที

เบื่องต้นผมมีไฟล์ figma ให้ ส่งจาก figma mcp 


ทั้งนี้ full project จะเอาไว้เก็บ ข้อมูล ai และ doc 

ส่วน project/frontend , project/backend เป็น source code และ project ลูกค้าจริงๆ

ให้คงของเดิม รูปแบบเดิม

db ลูกค้าทำไว้ให้แล้ว เดี่ยว logic ลูกค้าส่งให้อีกที ทำโครงคร่าวๆไว้ก่อน

ฝากเขียนแผน ดูว่า เราจะสามารถสร้าง verify ของเราขึ้นมาได้ไหมเมื่ออ้างอิง reconcile

โดยมี figma 

https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-17435&m=dev

อันนี้เป็น flow ทั้งหมด ของ verify auto selling แล้ว link figma  ที่เหลือ ก็เป็น layer ข้างในของ link flow ทั้งหมดอีกที

หลักๆหน้าตาเป็นแบบนี้

https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-20263&m=dev

https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-18859&m=dev

มี 2 อันเพราะ เวลากดที่ header card ตัว แสดงรายละเอียดข้อมูลตาม HeaderCard ที่เลือก จะโผล่ออกมา

แต่ ถ้ากด header card จากทางขวา จะมี ปรับข้อมูลผลนับคัด กับ แสดงรายละเอียดข้อมูลตาม HeaderCard ที่เลือก โผลมาด้วย

โดยจะมี css 4 แบบ ให้อิงแบบ reconsile transaction ได้เลย

unfit
UNSORT CC
UNSORT CA MEMBER
UNSORT CA NON MEMBER


ตรงนี้ feature ทำงานเหมือนกันหมด ใช้ร่วมกันได้ ต่างกันแค่สีและข้อความ แค่ว่าตอนยิง api มันจะต้องระบุประเภทแยกกัน
 

เบื่องต้นต้องการทำ frontend backend เพื่อขึ้นโครงให้ group domain verify จะได้มีคนมาทำต่อได้