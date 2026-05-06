import * as THREE from 'three';

// ฟังก์ชันสำหรับตั้งค่าการควบคุมด้วยแป้นพิมพ์
export function setupKeyControls(keys: { [key: string]: { pressed: boolean } }, characterRef: React.RefObject<THREE.Group>) {
  // ฟังก์ชันสำหรับจัดการเมื่อแป้นพิมพ์ถูกกดลง
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyA': // เมื่อกดแป้น 'A'
        keys.a.pressed = true; // ตั้งค่าว่าปุ่ม 'A' ถูกกด
        if (characterRef.current) characterRef.current.rotation.y = -Math.PI / 2; // หมุนตัวละครไปทางซ้าย
        break;
      case 'KeyD': // เมื่อกดแป้น 'D'
        keys.d.pressed = true; // ตั้งค่าว่าปุ่ม 'D' ถูกกด
        if (characterRef.current) characterRef.current.rotation.y = Math.PI / 2; // หมุนตัวละครไปทางขวา
        break;
    }
  };

  // ฟังก์ชันสำหรับจัดการเมื่อแป้นพิมพ์ถูกปล่อย
  const handleKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyA': // เมื่อปล่อยแป้น 'A'
        keys.a.pressed = false; // ตั้งค่าว่าปุ่ม 'A' ถูกปล่อย
        break;
      case 'KeyD': // เมื่อปล่อยแป้น 'D'
        keys.d.pressed = false; // ตั้งค่าว่าปุ่ม 'D' ถูกปล่อย
        break;
    }
  };

  // เพิ่ม event listeners สำหรับจัดการเหตุการณ์ keydown และ keyup
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // ส่งกลับฟังก์ชัน handleKeyDown และ handleKeyUp เพื่อใช้ในการลบ event listeners เมื่อไม่ต้องการใช้งาน
  return { handleKeyDown, handleKeyUp };
}

// ฟังก์ชันสำหรับลบการตั้งค่าการควบคุมด้วยแป้นพิมพ์
export function cleanupKeyControls(handleKeyDown: (event: KeyboardEvent) => void, handleKeyUp: (event: KeyboardEvent) => void) {
  window.removeEventListener('keydown', handleKeyDown); // ลบ event listener สำหรับ keydown
  window.removeEventListener('keyup', handleKeyUp); // ลบ event listener สำหรับ keyup
}