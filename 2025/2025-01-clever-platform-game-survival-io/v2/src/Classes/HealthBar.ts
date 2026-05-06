import * as THREE from 'three';

/**
 * คลาสสำหรับสร้างและจัดการ Health Bar แบบ 3D
 * แสดงเหนือหัวตัวละครและศัตรู
 */
export class HealthBar {
  private barGroup: THREE.Group;
  private foreground: THREE.Mesh;
  private background: THREE.Mesh;
  private border: THREE.LineSegments;
  private maxHealth: number;
  private currentHealth: number;
  private width: number;
  private height: number;
  private offsetY: number;

  constructor(
    maxHealth: number,
    options: {
      width?: number;
      height?: number;
      offsetY?: number;
      backgroundColor?: number;
      foregroundColor?: number;
      borderColor?: number;
    } = {},
  ) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.width = options.width || 2;
    this.height = options.height || 0.2;
    this.offsetY = options.offsetY || 3;

    // สร้าง Group สำหรับจัดเก็บทุกอย่าง
    this.barGroup = new THREE.Group();

    // สร้าง Background (พื้นหลังสีแดงเข้ม)
    const bgGeometry = new THREE.PlaneGeometry(this.width, this.height);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: options.backgroundColor || 0x330000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    this.background = new THREE.Mesh(bgGeometry, bgMaterial);
    this.background.position.z = 0.01; // อยู่ข้างหลังเล็กน้อย
    this.barGroup.add(this.background);

    // สร้าง Foreground (แถบเลือดสีเขียว)
    const fgGeometry = new THREE.PlaneGeometry(this.width, this.height);
    const fgMaterial = new THREE.MeshBasicMaterial({
      color: options.foregroundColor || 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    this.foreground = new THREE.Mesh(fgGeometry, fgMaterial);
    this.foreground.position.z = 0.02; // อยู่ข้างหน้า background
    this.barGroup.add(this.foreground);

    // สร้างขอบ (Border)
    const borderGeometry = new THREE.EdgesGeometry(bgGeometry);
    const borderMaterial = new THREE.LineBasicMaterial({
      color: options.borderColor || 0xffffff,
      linewidth: 2,
    });
    this.border = new THREE.LineSegments(borderGeometry, borderMaterial);
    this.border.position.z = 0.03; // อยู่หน้าสุด
    this.barGroup.add(this.border);

    // ตั้งตำแหน่งเริ่มต้น
    this.barGroup.position.y = this.offsetY;
  }

  /**
   * อัพเดทค่าเลือดและแสดงผล
   */
  public updateHealth(currentHealth: number): void {
    this.currentHealth = Math.max(0, Math.min(currentHealth, this.maxHealth));
    const healthPercent = this.currentHealth / this.maxHealth;

    // อัพเดทขนาดและตำแหน่งของ foreground
    this.foreground.scale.x = healthPercent;
    this.foreground.position.x = -(this.width / 2) * (1 - healthPercent);

    // เปลี่ยนสีตามค่าเลือด
    const material = this.foreground.material as THREE.MeshBasicMaterial;
    if (healthPercent > 0.6) {
      material.color.setHex(0x00ff00); // เขียว
    } else if (healthPercent > 0.3) {
      material.color.setHex(0xffff00); // เหลือง
    } else {
      material.color.setHex(0xff0000); // แดง
    }
  }

  /**
   * ทำให้ health bar หันหน้าไปทางกล้องเสมอ (Billboard effect)
   */
  public lookAtCamera(camera: THREE.Camera): void {
    this.barGroup.quaternion.copy(camera.quaternion);
  }

  /**
   * อัพเดทตำแหน่งของ health bar ให้ตามเป้าหมาย
   */
  public updatePosition(targetPosition: THREE.Vector3): void {
    this.barGroup.position.x = targetPosition.x;
    this.barGroup.position.y = targetPosition.y + this.offsetY;
    this.barGroup.position.z = targetPosition.z;
  }

  /**
   * แสดง health bar
   */
  public show(): void {
    this.barGroup.visible = true;
  }

  /**
   * ซ่อน health bar
   */
  public hide(): void {
    this.barGroup.visible = false;
  }

  /**
   * ดึง Group object เพื่อเพิ่มเข้า scene
   */
  public getObject(): THREE.Group {
    return this.barGroup;
  }

  /**
   * ทำลาย health bar และทำความสะอาด
   */
  public dispose(): void {
    // ลบ geometry และ material
    this.background.geometry.dispose();
    (this.background.material as THREE.Material).dispose();
    this.foreground.geometry.dispose();
    (this.foreground.material as THREE.Material).dispose();
    this.border.geometry.dispose();
    (this.border.material as THREE.Material).dispose();

    // ลบออกจาก parent
    if (this.barGroup.parent) {
      this.barGroup.parent.remove(this.barGroup);
    }
  }

  /**
   * ตั้งค่า max health ใหม่
   */
  public setMaxHealth(maxHealth: number): void {
    this.maxHealth = maxHealth;
    this.updateHealth(this.currentHealth);
  }

  /**
   * ดึงค่าเลือดปัจจุบัน
   */
  public getCurrentHealth(): number {
    return this.currentHealth;
  }

  /**
   * ดึงค่าเลือดสูงสุด
   */
  public getMaxHealth(): number {
    return this.maxHealth;
  }
}
