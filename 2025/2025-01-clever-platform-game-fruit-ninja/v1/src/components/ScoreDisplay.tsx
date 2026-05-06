let scoreDisplay: HTMLDivElement | null = null; // ตัวแปรสำหรับเก็บ element ที่แสดงคะแนน

// ฟังก์ชันสำหรับสร้าง element แสดงคะแนน
export function createScoreDisplay() {
  // ตรวจสอบว่า element แสดงคะแนนมีอยู่แล้วหรือไม่
  if (!document.getElementById('scoreDisplay')) {
    // สร้าง div สำหรับแสดงคะแนน
    scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'scoreDisplay';
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.top = '20px';
    scoreDisplay.style.left = '20px';
    scoreDisplay.style.color = 'white';
    scoreDisplay.style.fontSize = '20px';
    // scoreDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    scoreDisplay.style.padding = '10px';
    scoreDisplay.style.borderRadius = '5px';
    // เพิ่ม div ที่สร้างใหม่ลงใน body ของ document
    document.body.appendChild(scoreDisplay);
  }
}

// ฟังก์ชันสำหรับอัปเดตคะแนนที่แสดง
export function updateScoreDisplay(newScore: number) {
  // ตรวจสอบว่า element แสดงคะแนนมีอยู่แล้วหรือไม่ ถ้าไม่มีก็สร้างใหม่
  if (!scoreDisplay) {
    createScoreDisplay();
  }
  // อัปเดตข้อความที่แสดงคะแนน
  if (scoreDisplay) {
    scoreDisplay.innerHTML = `Score: ${newScore}`;
  }
}

// ฟังก์ชันสำหรับลบ element แสดงคะแนน
export function removeScoreDisplay() {
  const scoreElement = document.getElementById('scoreDisplay');
  // ตรวจสอบว่า element แสดงคะแนนมีอยู่หรือไม่
  if (scoreElement) {
    // ลบ element แสดงคะแนนออกจาก body ของ document
    document.body.removeChild(scoreElement);
    // รีเซ็ตตัวแปร scoreDisplay ให้เป็น null
    scoreDisplay = null;
  }
}