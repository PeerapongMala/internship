import * as THREE from 'three';

// ฟังก์ชันสำหรับตั้งค่า event handlers ต่างๆ
export function setupEventHandlers(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  // ฟังก์ชันสำหรับจัดการเมื่อหน้าต่างถูกปรับขนาด
  const handleResize = () => {
    // ปรับ aspect ratio ของกล้องให้ตรงกับขนาดใหม่ของหน้าต่าง
    camera.aspect = window.innerWidth / window.innerHeight;
    // อัปเดต projection matrix ของกล้อง
    camera.updateProjectionMatrix();
    // ปรับขนาด renderer ให้ตรงกับขนาดใหม่ของหน้าต่าง
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  // เพิ่ม event listener สำหรับจัดการเมื่อหน้าต่างถูกปรับขนาด
  window.addEventListener('resize', handleResize);

  // คืนค่าฟังก์ชัน cleanup ที่ใช้สำหรับลบ event listener เมื่อไม่ต้องการใช้งาน
  return () => window.removeEventListener('resize', handleResize);
}