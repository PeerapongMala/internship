พยายามทำให้หน้า Approve Manual Key-in ออกมาตรงกับที่ออกแบบไว้ใน Figma ที่สุด
ทั้งในเรื่องของสี ฟอนต์ ข้อความ ไอค่อน และองค์ประกอบต่างๆ รวมทั้งnavbarที่ต้องเป็นสีน้ำเงินเข้มมีdropdownและlabelต่างๆไปจนถึงชื่อผู้ใช้ และพื้นหลังของทั้งหน้ามีการไล่เฉดสีตามที่ออกแบบไว้ องค์ประกอบทั้งหมดต้องตรงตามที่กำหนดใน Figma
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49537&m=dev

ส่วนที่แสดงหัวข้อ "Approve Manual Key-in" และข้อมูล "Date:", "ธปท:" ยาวไปจนกล่อง "แสดงผลการนับคัดตามรายการ" และกล่อง "หมายเหตุ" มันมีกล่องใหญ่สีขาวครอบทั้งหมดไว้ ต้องไม่มีพื้นหลังสีขาวดังกล่าวนะครับ ให้ทำตามที่ออกแบบไว้ใน Figma ด้วยนะครับ ต้องเป็นแบบนี้
ช่วยทำตามที่ออกแบบไว้ใน Figma ด้วยนะครับ
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49537&m=dev

ส่วนหัวnavbarซึ่งครอบคลุมโลโก้และส่วนที่มีคำว่า "ธนาคารแห่งประเทศไทย" ยาวเป็นจนถึงชื่อผู้ใช้งานและรูปภาพผู้ใช้งาน ให้มีองค์ประกอบตามที่ดีไซน์ไว้ใน Figma แบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49546&m=dev

กล่องที่มี input dropdown ตัวเลือกต่างๆ อย่าง "Header Card:", "Type:", "ธนาคาร:", "Zone:", "ศูนย์เงินสด/Cashpoint:" ต่อด้วย "Operator - Prepare:", "Perator - Reconsile:", "Supervisor(s):", "สถานะ:"
ทำให้ตรงกับที่ออกแบบไว้ใน Figma ด้วยนะครับ ต้องเป็นแบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49793&m=dev

ตาราง "รายการ Header Card" ทำให้ตรงกับที่ออกแบบไว้ใน Figma ด้วยนะครับ ต้องเป็นแบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49978&m=dev

ตาราง "แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้" ด้านล่างซ้ายทำให้ตรงกับที่ออกแบบไว้ใน Figma ด้วยนะครับ ต้องเป็นแบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49832&m=dev

กล่อง "หมายเหตุ:" ด้านล่างขวาก็ทำให้ตรงกับที่ออกแบบไว้ใน Figma ด้วยนะครับ ไอค่อนและคำที่แสดงในปุ่มกดต้องทำให้ตรงกับดีไซน์
ต้องเป็นแบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49964&m=dev

ดึง Figma specs จากทุก nodes ทั้งนี้อยากให้กำหนดชื่อเรียกและชื่อคลาสแต่ละส่วนให้ทำงานต่อได้ง่าย เพื่อที่เมื่อ inspect ในบราวน์เซอร์ จะได้นำชื่อคลาสมาบอกเอไอให้แก้รายละเอียดทีละจุดได้สะดวก
ปล.เรื่องพื้นหลังขาวถูกแก้แล้ว

ปุ่ม Approve เมื่อกดแล้วให้แสดง Pop-up ยืนยันการอนุมัติ โดยมีสัญลักษณ์
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-50282&m=dev
และข้อความว่า "Approve" "คุณแน่ใจหรือไม่ที่ต้องการ Approve ข้อมูลนี้" และมีปุ่ม "ยกเลิก" และ "ยืนยัน" ตามที่ออกแบบไว้ใน Figma ด้วยนะครับ แบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-50280&m=dev
และเมื่อกดปุ่ม "ยืนยัน" ใน Pop-up ดังกล่าวแล้ว ให้ปิด Pop-up เดิมและแสดง Pop-up ใหม่
โดยมีสัญลักษณ์
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-50272&m=dev
และข้อความว่า "สำเร็จ" "บันทึกข้อมูลสำเร็จ" และมีปุ่ม "ตกลง" ตามที่ออกแบบไว้ใน Figma ด้วยนะครับ แบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-50270&m=dev

ไล่เฉดสีพื้นหลังของทั้งหน้าให้ตรงกับที่ออกแบบไว้ใน Figma ด้วยนะครับ แบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49538&m=dev
Implement this design from Figma.
@https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49538&m=dev

ที่ id="mainNav" ซึ่งเป็นส่วนของ navbar ด้านบนที่มีโลโก้และคำว่า "ธนาคารแห่งประเทศไทย" ยาวไปจนถึงชื่อผู้ใช้งานและรูปภาพผู้ใช้งาน ให้ปรับให้มีองค์ประกอบตามที่ดีไซน์ไว้ใน Figma แบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49758&m=dev
และที่ id="user-name-display" และ id="span-role-display" ทำอย่างไรจึงจะมีข้อมูลแสดงตามที่ออกแบบไว้ใน Figma แบบนี้
https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49761&m=dev
