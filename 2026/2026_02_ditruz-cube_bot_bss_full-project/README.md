ขั้นตอนการรันโปรเจค

1. เปิด Docker Desktop ให้พร้อมทำงาน
2. เปิดโปรเจคใน VS Code แล้วกด Ctrl + Shift + P (หรือ Cmd + Shift + P บน Mac)
3. ค้นหาและเลือก Dev Containers: Reopen in Container
4. รอให้ container สร้างเสร็จ (อาจใช้เวลาสักครู่ในครั้งแรก)
5. เมื่อเปิด container เสร็จ จะมี terminal พร้อมใช้งานใน container
6. โหลดโปรแกรม Radmin VPN จาก https://www.radmin-vpn.com/ และติดตั้งเพื่อตั้งค่าเครือข่าย VPN
7. เปิด Radmin VPN จากนั้นกด Join Network
8. กรอก Network Name และ Password ที่กำหนดไว้ในโปรเจค (สามารถดูได้ในไฟล์ .env หรือถามผู้พัฒนา)
9. เมื่อเชื่อมต่อ VPN สำเร็จแล้ว คุณจะสามารถเข้าถึงโปรเจคผ่านเครือข่าย VPN ได้
10. ใช้ Run and Debug ของ VS Code เลือก "BSS Full Stack" เพื่อเริ่มรันโปรเจค
11. รอให้โปรเจคเริ่มทำงาน (จะมี swagger ปรากฎที่บราวเซอร์ รวมทั้ง frontend ที่ http://localhost:7050/BSS_WEB)
12. ตัวเลือกประเภทธนบัตรและ Sorting Machine เลือกอะไรก็ได้ ส่วนตัวเลือก Operation ที่พร้อมแต่ต้นให้เลือก "Reconciliation"
13. ตัวเลือก Sorting อาจยังไม่พร้อมใช้งานในตอนนี้ สามารถเว้นไว้ได้ จากนั้นกด "เข้าสู่การทำงาน"

# การสแกนโค้ดด้วย SonarQube (ไม่บังคับ)

1. ตั้งค่าในไฟล์ .env:
   - SONAR_SCANNER_HOST — URL ของ SonarQube server
   - SONAR_SCANNER_TOKEN — token สำหรับ push ผลสแกน (ขอจากผู้ดูแลโปรเจค)
2. (ถ้าใช้ local) เปิด SonarQube server: docker compose up -d sonarqube ใน terminal ของ host
   (ถ้าใช้ remote) ข้ามขั้นตอนนี้
3. สแกนโค้ดผ่าน VS Code Task: กด Ctrl + Shift + P (หรือ Cmd + Shift + P บน Mac) แล้วเลือก Tasks: Run Task
   - sonar-scan-backend — สแกนโค้ด API (BSS_API)
   - sonar-scan-frontend — สแกนโค้ด Web (BSS_WEB)
4. เมื่อสแกนเสร็จ ดูผลลัพธ์ได้ที่ SonarQube dashboard (URL เดียวกับ SONAR_SCANNER_HOST)
