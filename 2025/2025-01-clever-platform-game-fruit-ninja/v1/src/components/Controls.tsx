import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

// ฟังก์ชันสำหรับสร้างและตั้งค่า OrbitControls
export function createControls(camera: THREE.Camera, renderer: THREE.Renderer) {
  // สร้าง OrbitControls และเชื่อมโยงกับกล้องและ DOM element ของ renderer
  const controls = new OrbitControls(camera, renderer.domElement);
  
  // ตั้งค่า target ที่กล้องจะมองไปที่จุด (0, 0, 0)
  controls.target.set(0, 0, 0);
  
  // ปิดการใช้งานการซูม
  controls.enableZoom = false;
  
  // ปิดการใช้งานการหมุน
  controls.enableRotate = false;
  
  // ปิดการใช้งานการควบคุมด้วยเม้าส์ขวา
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.LEFT,
    MIDDLE: THREE.MOUSE.MIDDLE,
    RIGHT: null // ปิดการใช้งานการหมุนด้วยเม้าส์ขวา
  };
  
  // อัปเดตการตั้งค่าใหม่ของ controls
  controls.update();
  
  // ส่งกลับ controls ที่ตั้งค่าเสร็จแล้ว
  return controls;
}