import * as THREE from 'three';

// ฟังก์ชันสำหรับสร้าง platform
export function createPlatform(x: number, y: number, z: number, color: string, scene: THREE.Scene, platforms: THREE.Mesh[]) {
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.7, 10), // สร้าง BoxGeometry สำหรับ platform
    new THREE.MeshStandardMaterial({ color: color }) // สร้าง Material สำหรับ platform
  );
  platform.position.set(x, y, z); // กำหนดตำแหน่งของ platform
  (platform.userData as any).isDestructible = color === '#ff0000'; // กำหนดว่าถ้าเป็นสีแดงจะทำลายได้
  scene.add(platform); // เพิ่ม platform เข้าฉาก
  platforms.push(platform); // เพิ่ม platform เข้าสู่ array ของ platforms
  return platform;
}

// ฟังก์ชันสำหรับรีเซ็ต platforms
export function resetPlatforms(scene: THREE.Scene, platforms: THREE.Mesh[], platformPositions: any[], highestPlatformY: number, minHeight: number) {
  platforms.forEach(platform => scene.remove(platform)); // ลบทุก platform ในฉาก
  platforms.length = 0; // รีเซ็ต array ของ platforms
  platformPositions.forEach(pos => {
    createPlatform(pos.x, pos.y, pos.z, pos.color, scene, platforms); // สร้าง platform ใหม่ตามตำแหน่งที่กำหนด
  });
  highestPlatformY = platformPositions[platformPositions.length - 1].y; // กำหนดค่า highestPlatformY
  minHeight = 0; // รีเซ็ตค่า minHeight
  return { highestPlatformY, minHeight };
}

// ฟังก์ชันสำหรับรีไซเคิล platforms ที่อยู่นอกขอบเขตกล้อง
export function recyclePlatforms(scene: THREE.Scene, camera: THREE.Camera, platforms: THREE.Mesh[], highestPlatformY: number, maxGap: number, createBluePlatformNearby: (y: number, z: number, scene: THREE.Scene, platforms: THREE.Mesh[]) => void) {
  platforms.forEach(platform => {
    if (platform.position.y < camera.position.y - 20) {
      // สร้างแพลตฟอร์มใหม่ไว้ก่อน
      for (let i = 0; i < 3; i++) {
        highestPlatformY = createNewPlatform(highestPlatformY, maxGap, platforms, scene, createBluePlatformNearby);
      }
      // ลบแพลตฟอร์มเก่า
      scene.remove(platform);
      platforms.splice(platforms.indexOf(platform), 1);
    }
  });
  return highestPlatformY;
}

// ฟังก์ชันสำหรับสร้างแพลตฟอร์มใหม่
export function createNewPlatform(highestPlatformY: number, maxGap: number, platforms: THREE.Mesh[], scene: THREE.Scene, createBluePlatformNearby: (y: number, z: number, scene: THREE.Scene, platforms: THREE.Mesh[]) => void) {
  const minDistanceY = 7; // ระยะห่างขั้นต่ำในแกน Y
  const minDistanceZ = 15; // ระยะห่างขั้นต่ำในแกน Z
  let newY = highestPlatformY + maxGap; // กำหนดตำแหน่ง Y ของแพลตฟอร์มใหม่
  let attempts = 0; // ตัวแปรนับจำนวนการพยายามสร้างแพลตฟอร์ม
  let isPositionValid = false; // ตัวแปรเช็คความถูกต้องของตำแหน่ง
  let isBluePlatformNearby = false; // ตัวแปรเช็คว่ามีแพลตฟอร์มสีน้ำเงินอยู่ใกล้ๆ หรือไม่
  let redPlatformCountLocal = 0; // ตัวแปรนับจำนวนแพลตฟอร์มสีแดง
  let consecutiveRedCount = 0; // ตัวแปรนับจำนวนแพลตฟอร์มสีแดงที่อยู่ติดกัน
  let newZ: number | undefined = undefined; // ตำแหน่ง Z ของแพลตฟอร์มใหม่

  while (!isPositionValid && attempts < 100) {
    newZ = (Math.random() - 0.5) * 20; // สุ่มตำแหน่ง Z ของแพลตฟอร์มใหม่
    isPositionValid = true; // สมมติว่าตำแหน่งนี้ถูกต้อง
    consecutiveRedCount = 0; // รีเซ็ตตัวแปรนับจำนวนแพลตฟอร์มสีแดงที่อยู่ติดกัน
    for (let i = 0; i < platforms.length; i++) {
      const otherPlatform = platforms[i];
      const distanceY = Math.abs(otherPlatform.position.y - newY); // คำนวณระยะห่างในแกน Y
      const distanceZ = Math.abs(otherPlatform.position.z - newZ); // คำนวณระยะห่างในแกน Z

      // ตรวจสอบระยะห่างในแกน Y และ Z
      if (distanceY < minDistanceY && distanceZ < minDistanceZ) {
        isPositionValid = false;
        break;
      }

      if (otherPlatform.position.y > newY - maxGap && otherPlatform.position.y < newY + maxGap) {
        if ((otherPlatform.material as THREE.MeshStandardMaterial).color.getHex() === 0x0369a1) {
          isBluePlatformNearby = true; // ตรวจสอบว่ามีแพลตฟอร์มสีน้ำเงินอยู่ใกล้ๆ
        }
        if ((otherPlatform.material as THREE.MeshStandardMaterial).color.getHex() === 0xff0000) {
          redPlatformCountLocal++;
          if (distanceY < 2 * maxGap) {
            consecutiveRedCount++; // นับจำนวนแพลตฟอร์มสีแดงที่อยู่ติดกัน
          }
        }
      }
    }
    if (consecutiveRedCount >= 2) {
      isPositionValid = false; // ถ้ามีแพลตฟอร์มสีแดงติดกันมากกว่า 2 ให้ถือว่าตำแหน่งนี้ไม่ถูกต้อง
    }
    attempts++;
  }

  if (isPositionValid && newZ !== undefined) {
    let newColor = (Math.random() < 0.20 || isBluePlatformNearby) ? '#ff0000' : '#0369a1'; // สุ่มสีของแพลตฟอร์มใหม่
    if (redPlatformCountLocal >= 2) {
      newColor = '#0369a1'; // ถ้ามีแพลตฟอร์มสีแดงมากกว่า 2 ให้สร้างเป็นสีน้ำเงิน
    }

    createPlatform(0, newY, newZ, newColor, scene, platforms); // สร้างแพลตฟอร์มใหม่

    if (newColor === '#ff0000') {
      if (redPlatformCountLocal > 1) {
        createBluePlatformNearby(newY, newZ, scene, platforms); // สร้างแพลตฟอร์มสีน้ำเงินใกล้ๆ ถ้ามีแพลตฟอร์มสีแดงมากกว่า 1
      }
    }
    return newY;
  }
  return highestPlatformY;
}

// ฟังก์ชันสำหรับสร้างแพลตฟอร์มสีน้ำเงินใกล้ๆ
export function createBluePlatformNearby(y: number, z: number, scene: THREE.Scene, platforms: THREE.Mesh[]) {
  const minDistanceY = 7; // ระยะห่างขั้นต่ำในแกน Y
  const minDistanceZ = 15; // ระยะห่างขั้นต่ำในแกน Z
  let attempts = 0; // ตัวแปรนับจำนวนการพยายามสร้างแพลตฟอร์ม
  let isPositionValid = false; // ตัวแปรเช็คความถูกต้องของตำแหน่ง
  let newZ: number | undefined;
  while (!isPositionValid && attempts < 20) {
    newZ = (Math.random() - 0.5) * 20; // สุ่มตำแหน่ง Z ของแพลตฟอร์มใหม่
    isPositionValid = true; // สมมติว่าตำแหน่งนี้ถูกต้อง
    for (let i = 0; i < platforms.length; i++) {
      const otherPlatform = platforms[i];
      const distanceY = Math.abs(otherPlatform.position.y - y); // คำนวณระยะห่างในแกน Y
      const distanceZ = Math.abs(otherPlatform.position.z - newZ); // คำนวณระยะห่างในแกน Z

      // ตรวจสอบระยะห่างในแกน Y และ Z
      if ((distanceY < minDistanceY && distanceZ < minDistanceZ) || (distanceY < 5 && distanceZ < 5)) {
        isPositionValid = false;
        break;
      }
    }
    attempts++;
  }
  if (isPositionValid && newZ !== undefined) {
    createPlatform(0, y, newZ, '#0369a1', scene, platforms); // สร้างแพลตฟอร์มสีน้ำเงิน
  }
}

// ฟังก์ชันสำหรับสร้างแพลตฟอร์มเริ่มต้น
export function createInitialPlatforms(platformPositions: any[], scene: THREE.Scene, platforms: THREE.Mesh[], highestPlatformY: number, minHeight: number, redPlatformCount: number, createBluePlatformNearby: (y: number, z: number, scene: THREE.Scene, platforms: THREE.Mesh[]) => void) {
  platformPositions.forEach(pos => {
    createPlatform(pos.x, pos.y, pos.z, pos.color, scene, platforms); // สร้างแพลตฟอร์มตามตำแหน่งที่กำหนด
    if (pos.color === '#ff0000') redPlatformCount++;
  });
  highestPlatformY = platformPositions[platformPositions.length - 1].y; // กำหนดค่า highestPlatformY
  minHeight = 0; // รีเซ็ตค่า minHeight
  return { highestPlatformY, minHeight };
}

// ฟังก์ชันสำหรับตรวจสอบการชนของตัวละครกับแพลตฟอร์ม
export function checkPlatformCollision(
  characterRef: React.MutableRefObject<THREE.Group | null>,
  platforms: THREE.Mesh[],
  scene: THREE.Scene,
  highestPlatformY: number,
  maxGap: number,
  minHeightRef: React.MutableRefObject<number>,
  isJumping: React.MutableRefObject<boolean>,
  scoreRef: React.MutableRefObject<number>,
  jumpVelocity: number,
  gravity: number,
  jumpSoundRef: React.MutableRefObject<THREE.PositionalAudio | undefined>,
  breakSoundRef: React.MutableRefObject<THREE.PositionalAudio | undefined>,
  updateDebugInfo: (newInfo: any) => void,
  endGame: () => void,
  createNewPlatform: (
    highestPlatformY: number,
    maxGap: number,
    platforms: THREE.Mesh[],
    scene: THREE.Scene,
    createBluePlatformNearby: (y: number, z: number, scene: THREE.Scene, platforms: THREE.Mesh[]) => void
  ) => number
) {
  // เช็คชนแพลตฟอร์มในส่วนด้านบนของแพลตฟอร์ม
  platforms.forEach(platform => {
    const boxGeometry = platform.geometry as THREE.BoxGeometry;
    if (
      characterRef.current!.position.y <= platform.position.y + 0.5 &&
      characterRef.current!.position.y >= platform.position.y + 0.25 &&
      characterRef.current!.position.x > platform.position.x - boxGeometry.parameters.width / 2 &&
      characterRef.current!.position.x < platform.position.x + boxGeometry.parameters.width / 2 &&
      characterRef.current!.position.z > platform.position.z - boxGeometry.parameters.depth / 2 &&
      characterRef.current!.position.z < platform.position.z + boxGeometry.parameters.depth / 2 &&
      (characterRef.current as any).velocity.y < 0
    ) {
      if ((platform.userData as any).isDestructible) {
        scene.remove(platform);
        platforms = platforms.filter(p => p !== platform);
        isJumping.current = true;
        for (let i = 0; i < 2; i++) { // สร้างแพลตฟอร์มใหม่ 2 แพลตฟอร์มเมื่อแพลตฟอร์มเก่าถูกทำลาย
          highestPlatformY = createNewPlatform(
            highestPlatformY,
            maxGap,
            platforms,
            scene,
            createBluePlatformNearby
          );
        }
        breakSoundRef.current?.play(); // เล่นเสียงเมื่อแพลตฟอร์มถูกทำลาย
      } else {
        characterRef.current!.position.y = platform.position.y + 0.25;
        (characterRef.current as any).velocity.y = jumpVelocity;
        isJumping.current = false;
        jumpSoundRef.current?.play(); // เล่นเสียงเมื่อกระโดด
      }

      if (characterRef.current!.position.y > minHeightRef.current) {
        minHeightRef.current = characterRef.current!.position.y - 10;
      }
    }
  });
}