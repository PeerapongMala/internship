export function playSound(soundPath: string) {
  // ทำการสุ่มเสียงจา�� soundPath ที่กำหนด
  const sound = new Audio(soundPath);

  // ส่ง sound ที่ได้ออกไปให้อีก��ังก์ชันที่ใช้ใน��ปรแกรม
  return sound;
}
